# =====================================================================
# main.py: IL PUNTO DI INGRESSO DELL'API (FastAPI)
#
# Questo file crea l'applicazione web "YouCanDoIt API". Non contiene la
# logica dei singoli endpoint: li raccoglie tutti e gestisce le cose
# "generali": avvio e spegnimento del server, job pianificati, CORS,
# gestione globale degli errori, endpoint di health check.
#
# Analogia Laravel (per chi arriva da PHP): lifespan ~ bootstrap/app.php,
# app.include_router ~ routes/web.php, middleware ~ middleware Laravel.
#
# Come si collega al resto del progetto:
# - apps/api/Dockerfile: `uvicorn app.main:app` cerca la variabile `app`
#   in questo file, quindi il nome `app` deve restare esattamente questo.
# - tests/conftest.py importa `app` e ne esegue il lifespan nei test.
# - app/routes/*.py: ogni file definisce un APIRouter (un gruppo di
#   endpoint) che qui viene "agganciato" all'app.
# - app/sync.py (sync_roadmap, index_sources), app/news.py (refresh_news),
#   app/llm.py (get_embedder, LLMError), app/config.py (settings),
#   app/db.py (SessionLocal): tutti usati qui sotto.
#
# Concetti chiave (le versioni vengono da apps/api/pyproject.toml:
# fastapi>=0.115, apscheduler>=3.11,<4. Non c'e' un lock file, quindi
# la versione installata esatta non e' verificata):
# - FastAPI: framework web Python. Doc: https://fastapi.tiangolo.com/
# - Lifespan: funzione con `yield` eseguita all'avvio (prima di yield) e
#   allo spegnimento (dopo yield). Doc: https://fastapi.tiangolo.com/advanced/events/
# - async/await: codice asincrono. Mentre un'operazione lenta (DB, rete)
#   aspetta, il server puo' servire altre richieste. Doc:
#   https://docs.python.org/3/library/asyncio.html
# - APScheduler 3.x: pianifica funzioni (es. "ogni giorno alle 7") dentro
#   il processo stesso. Doc: https://apscheduler.readthedocs.io/en/3.x/
# - Middleware: strato che intercetta ogni richiesta e risposta.
# - CORS: regole del browser su quali siti possono chiamare l'API. Nel
#   progetto il browser chiama /api/* tramite il proxy Next.js, quindi
#   CORS e' soprattutto una rete di sicurezza per chiamate dirette.
# - Exception handler: funzione che trasforma un'eccezione in una
#   risposta HTTP con un codice di stato.
# =====================================================================

# `import X` carica il modulo X. asyncio = codice asincrono (libreria standard)
import asyncio

# logging = scrive messaggi nel log (stdout), con livelli info/warning/error
import logging

# contextlib = utilita' della libreria standard; asynccontextmanager serve per il lifespan sotto
from contextlib import asynccontextmanager

# AsyncIOScheduler: lo "scheduler" che esegue i job nei tempi prestabiliti, integrato con asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# FastAPI = la classe che rappresenta l'app web; Request = oggetto che descrive
# la richiesta HTTP in arrivo
from fastapi import FastAPI, Request

# CORSMiddleware = middleware che gestisce le intestazioni CORS
from fastapi.middleware.cors import CORSMiddleware

# JSONResponse = risposta HTTP con corpo in formato JSON e codice di stato scelto da noi
from fastapi.responses import JSONResponse

# importa i moduli news e sync dal package app (le cartelle con __init__ sono "package")
from app import news, sync

# settings = oggetto con la configurazione letta da variabili d'ambiente (.env), vedi app/config.py
from app.config import settings

# SessionLocal = "fabbrica" di sessioni verso il database; ogni sessione e' una
# conversazione con il DB
from app.db import SessionLocal

# LLMError = eccezione propria del layer AI; get_embedder = funzione che
# restituisce il generatore di embedding
from app.llm import LLMError, get_embedder

# importa i moduli-router di ciascuna area (ai, articles, progress, quotes, roadmap) da app/routes/
from app.routes import ai, articles, progress, quotes, roadmap

# logging.basicConfig imposta il livello minimo dei messaggi: INFO = mostra info, warning ed error
logging.basicConfig(level=logging.INFO)
# getLogger(__name__) crea un logger con il nome di questo modulo ("app.main"),
# utile per capire da dove arriva il messaggio
log = logging.getLogger(__name__)


# `async def` = funzione asincrona: si usa con `await` e non blocca il server mentre aspetta.
# `-> None` = type hint di ritorno: la funzione non restituisce nulla di utile.
async def _wait_for_embedder() -> None:
    """On first boot Ollama may still be downloading models: poll until embeddings work."""
    # `while True` = ciclo infinito: si ferma solo con `return`.
    while True:
        # `try` = prova questo blocco; se succede un LLMError si passa a `except`.
        try:
            # chiede all'embedder (il modello che trasforma testo in vettori numerici)
            # di processare "ping" come test
            await get_embedder().embed(["ping"])
            # l'embedder ha risposto: usciamo dalla funzione e il ciclo finisce
            return
        # cattura solo LLMError (es. Ollama non ancora pronto) e la chiama `e`
        except LLMError as e:
            # messaggio informativo nel log; %s viene sostituito dal contenuto di e
            log.info("waiting for embeddings (%s), retrying in 30s", e)
            # pausa di 30 secondi senza bloccare il server, poi si riprova
            await asyncio.sleep(30)


# funzione del primo avvio: esegue in sequenza le operazioni iniziali
async def _first_run() -> None:
    # prima aspetta che gli embedding funzionino
    await _wait_for_embedder()
    # poi aggiorna le news; _job gestisce da solo eventuali errori
    await _job(news.refresh_news)
    # infine indicizza le fonti (le pagine web dei riferimenti) per la ricerca RAG
    await _job(sync.index_sources)


# esegue una funzione "job" con una sua sessione DB dedicata
async def _job(fn) -> None:
    # `async with` apre la sessione e la chiude automaticamente alla fine del blocco,
    # anche in caso di errore
    async with SessionLocal() as db:
        # try/except: se il job fallisce, l'errore viene registrato invece di far cadere il server
        try:
            # esegue la funzione passandole la sessione DB come argomento
            await fn(db)
        # Exception = qualsiasi errore "normale" di Python
        except Exception:
            # log.exception scrive il messaggio di errore con tutto lo stack trace;
            # fn.__name__ e' il nome della funzione
            log.exception("background job %s failed", fn.__name__)


# @asynccontextmanager trasforma questa funzione con `yield` in un "gestore di contesto"
# che FastAPI usa per l'avvio/spegnimento
@asynccontextmanager
# `_: FastAPI` = parametro ricevuto da FastAPI (l'app); il nome `_` indica che non lo usiamo
async def lifespan(_: FastAPI):
    # FASE DI AVVIO, parte 1: apre una sessione DB per sincronizzare la roadmap
    async with SessionLocal() as db:
        # sync_roadmap legge ROADMAP.md e aggiorna il DB; restituisce il numero di sessioni,
        # poi loggato con %d (intero)
        log.info("roadmap synced: %d sessions", await sync.sync_roadmap(db))
    # crea lo scheduler con il fuso orario di settings.timezone (Europe/Rome)
    scheduler = AsyncIOScheduler(timezone=settings.timezone)
    # lista dei task in background; tenerli in una variabile evita che Python li
    # elimini a meta' esecuzione
    startup_tasks = []  # held so the tasks aren't garbage-collected mid-run
    # attivo di default; nei test e nell'e2e viene disattivato con SCHEDULER_ENABLED=false
    if settings.scheduler_enabled:
        # ogni giorno alle 07:00 (ora di settings.timezone) esegue _job con refresh_news;
        # args = argomenti passati a _job
        scheduler.add_job(_job, "cron", hour=7, args=[news.refresh_news])
        # ogni giorno alle 03:00 indicizza le fonti
        scheduler.add_job(_job, "cron", hour=3, args=[sync.index_sources])
        # avvia lo scheduler: da qui i job partono ai loro orari
        scheduler.start()
        # first run: fill news + index sources without blocking startup
        # create_task lancia _first_run in background: il server parte subito senza aspettare
        startup_tasks = [asyncio.create_task(_first_run())]
    # `yield` = qui l'app e' avviata e serve le richieste; il codice sopra era l'avvio,
    # quello sotto sara' lo spegnimento
    yield
    # FASE DI SPEGNIMENTO: annulla i task di avvio ancora in corso
    for t in startup_tasks:
        t.cancel()
    # ferma lo scheduler solo se e' davvero in esecuzione (evita errori se era disattivato)
    if scheduler.running:
        scheduler.shutdown()


# crea l'applicazione FastAPI: title e version compaiono nella documentazione automatica su /docs
app = FastAPI(title="YouCanDoIt API", version="0.1.0", lifespan=lifespan)
# aggiunge il middleware CORS: decide quali siti del browser possono chiamare l'API
app.add_middleware(
    # allow_origins = domini ammessi (default: http://localhost:3000, il frontend Next.js);
    # allow_methods/allow_headers = "*" significa tutti
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.exception_handler registra questa funzione come gestore globale per ogni
# LLMError sollevato in qualsiasi endpoint
@app.exception_handler(LLMError)
# exc = l'eccezione catturata; -> JSONResponse = tipo di ritorno; _: Request = richiesta non usata
async def llm_error(_: Request, exc: LLMError) -> JSONResponse:
    # 503 Service Unavailable = "servizio temporaneamente non disponibile" (es. modello AI spento);
    # il corpo JSON ha la chiave detail con il messaggio d'errore
    return JSONResponse(status_code=503, content={"detail": str(exc)})


# @app.get registra la funzione come endpoint GET /health
# (si chiama con: curl http://localhost:8000/health)
@app.get("/health")
# dict[str, str] = type hint: un dizionario con chiavi e valori di testo
async def health() -> dict[str, str]:
    # FastAPI converte il dizionario in JSON: {"status": "ok"} significa "il server e' vivo"
    return {"status": "ok"}


# per ogni modulo-router (roadmap, progress, quotes, articles, ai)...
for r in (roadmap, progress, quotes, articles, ai):
    # ...aggiunge all'app tutti gli endpoint che il router definisce in app/routes/
    app.include_router(r.router)
