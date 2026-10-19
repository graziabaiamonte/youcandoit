import asyncio
import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import news, sync
from app.config import settings
from app.db import SessionLocal
from app.llm import LLMError, get_embedder
from app.routes import ai, articles, progress, quotes, roadmap

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


async def _wait_for_embedder() -> None:
    """On first boot Ollama may still be downloading models: poll until embeddings work."""
    while True:
        try:
            await get_embedder().embed(["ping"])
            return
        except LLMError as e:
            log.info("waiting for embeddings (%s), retrying in 30s", e)
            await asyncio.sleep(30)


async def _first_run() -> None:
    await _wait_for_embedder()
    await _job(news.refresh_news)
    await _job(sync.index_sources)


async def _job(fn) -> None:
    async with SessionLocal() as db:
        try:
            await fn(db)
        except Exception:
            log.exception("background job %s failed", fn.__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    async with SessionLocal() as db:
        log.info("roadmap synced: %d sessions", await sync.sync_roadmap(db))
    scheduler = AsyncIOScheduler(timezone=settings.timezone)
    startup_tasks = []  # held so the tasks aren't garbage-collected mid-run
    if settings.scheduler_enabled:
        scheduler.add_job(_job, "cron", hour=7, args=[news.refresh_news])
        scheduler.add_job(_job, "cron", hour=3, args=[sync.index_sources])
        scheduler.start()
        # first run: fill news + index sources without blocking startup
        startup_tasks = [asyncio.create_task(_first_run())]
    yield
    for t in startup_tasks:
        t.cancel()
    if scheduler.running:
        scheduler.shutdown()


app = FastAPI(title="YouCanDoIt API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, allow_origins=settings.cors_origins, allow_methods=["*"], allow_headers=["*"]
)


@app.exception_handler(LLMError)
async def llm_error(_: Request, exc: LLMError) -> JSONResponse:
    return JSONResponse(status_code=503, content={"detail": str(exc)})


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


for r in (roadmap, progress, quotes, articles, ai):
    app.include_router(r.router)
