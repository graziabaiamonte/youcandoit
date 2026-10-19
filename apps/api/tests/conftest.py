import os
from pathlib import Path

HERE = Path(__file__).parent
# Must run before `app` is imported: settings are read at import time.
os.environ["LLM_PROVIDER"] = "fake"
os.environ["SCHEDULER_ENABLED"] = "false"
os.environ["ROADMAP_PATH"] = str(HERE / "fixtures" / "roadmap.md")
# in Docker the repo content is mounted at /content; locally it is <repo>/content
os.environ.setdefault("CONTENT_DIR", "/content")
os.environ["DATABASE_URL"] = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+asyncpg://ycdi:ycdi@db:5432/ycdi_test"
)

import asyncpg  # noqa: E402
import pytest  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy import text  # noqa: E402

from app.config import settings  # noqa: E402
from app.db import engine  # noqa: E402
from app.models import Base  # noqa: E402


async def _ensure_database() -> None:
    url = settings.database_url.replace("+asyncpg", "")
    base, name = url.rsplit("/", 1)
    conn = await asyncpg.connect(f"{base}/postgres")
    try:
        if not await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = $1", name):
            await conn.execute(f'CREATE DATABASE "{name}"')
    finally:
        await conn.close()


@pytest.fixture(scope="session")
async def db_schema():
    await _ensure_database()
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


@pytest.fixture
async def client(db_schema):
    from app.main import app

    async with app.router.lifespan_context(app):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
            yield c
