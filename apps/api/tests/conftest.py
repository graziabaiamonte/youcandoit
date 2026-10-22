# File di configurazione dei test (pytest). pytest lo carica da solo prima di eseguire
# i test di questa cartella: nessun file deve importarlo. Analogia Laravel: e' un mix tra
# `phpunit.xml` (variabili d'ambiente per i test) e il metodo `setUp()` di un TestCase
# (preparazione condivisa: database e client HTTP).
# Qui si definiscono le "fixture": funzioni decorate con @pytest.fixture che preparano uno
# stato (DB, client) e che i test ricevono come parametro, senza ripetere il setup.
# Doc fixture: https://docs.pytest.org/en/stable/how-to/fixtures.html
# Doc pytest-asyncio: https://pytest-asyncio.readthedocs.io/en/stable/
# La modalita' "auto" (gia' in pyproject.toml) esegue le funzioni async come test o fixture
# senza bisogno di decorarle con @pytest.mark.asyncio.

# Importa il modulo standard `os` per leggere e scrivere le variabili d'ambiente.
import os

# Importa `Path` (libreria standard) per gestire i percorsi dei file in modo portabile.
from pathlib import Path

# HERE e' la cartella che contiene questo file (apps/api/tests), come percorso assoluto.
# `__file__` e' il percorso di questo file; `.parent` prende la cartella che lo contiene.
HERE = Path(__file__).parent
# Must run before `app` is imported: settings are read at import time.
# LLM_PROVIDER=fake: risposte finte e prevedibili, nessuna chiamata reale a Ollama o Anthropic
# (i test devono essere ripetibili e gratuiti).
os.environ["LLM_PROVIDER"] = "fake"
# SCHEDULER_ENABLED=false: non avviare i lavori automatici in background (APScheduler),
# altrimenti girerebbero in parallelo ai test.
os.environ["SCHEDULER_ENABLED"] = "false"
# ROADMAP_PATH: punta al ROADMAP.md di prova (fixtures/roadmap.md), non a quello reale,
# cosi' i test non dipendono dal contenuto del curriculum. str() perche' le variabili
# d'ambiente accettano solo testo, mentre HERE / "..." e' un oggetto Path.
os.environ["ROADMAP_PATH"] = str(HERE / "fixtures" / "roadmap.md")
# in Docker the repo content is mounted at /content; locally it is <repo>/content
# setdefault imposta il valore solo se la variabile non esiste gia' (es. nel tuo terminale).
os.environ.setdefault("CONTENT_DIR", "/content")
# DATABASE_URL: connessione al database di TEST (ycdi_test), mai a quello reale (ycdi).
# os.environ.get(chiave, default) usa TEST_DATABASE_URL se presente (come in docker-compose),
# altrimenti l'indirizzo di default del servizio "db" del container.
# "+asyncpg" indica il driver asincrono di PostgreSQL usato da SQLAlchemy.
os.environ["DATABASE_URL"] = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+asyncpg://ycdi:ycdi@db:5432/ycdi_test"
)

# Gli import sotto hanno il marcatore noqa per E402, l'errore di ruff "import non in cima".
# Lo ignoriamo di proposito: devono venire DOPO le variabili d'ambiente impostate sopra.
# asyncpg: driver PostgreSQL asincrono di basso livello; qui serve per creare il database.
import asyncpg  # noqa: E402

# pytest: il framework di test; fornisce il decoratore @pytest.fixture.
import pytest  # noqa: E402

# httpx: client HTTP. ASGITransport chiama l'app FastAPI in memoria, senza server reale.
# AsyncClient e' il client asincrono con cui i test fanno GET, PUT, ecc. alle route.
from httpx import ASGITransport, AsyncClient  # noqa: E402

# text(): SQLAlchemy esegue il SQL grezzo solo se lo racchiudi in text().
from sqlalchemy import text  # noqa: E402

# settings: la configurazione letta dalle variabili d'ambiente (vedi app/config.py).
from app.config import settings  # noqa: E402

# engine: il motore di connessione al database, con il suo pool di connessioni (app/db.py).
from app.db import engine  # noqa: E402

# Base: la classe madre di tutti i modelli; Base.metadata conosce tutte le tabelle.
from app.models import Base  # noqa: E402


# Crea il database di test se non esiste ancora (equivale a un CREATE DATABASE fatto a mano).
# "_" iniziale = funzione privata, usata solo in questo file. "async def" = funzione asincrona,
# che dentro usa "await" per aspettare le operazioni di rete senza bloccare il programma.
# "-> None" dichiara che la funzione non restituisce nulla (type hint: solo documentazione).
async def _ensure_database() -> None:
    # Copia dell'URL senza "+asyncpg", perche' asyncpg vuole un URL "pulito".
    url = settings.database_url.replace("+asyncpg", "")
    # Divide l'URL all'ultima "/": a sinistra l'indirizzo del server, a destra il nome del DB.
    base, name = url.rsplit("/", 1)
    # Apre una connessione al database di sistema "postgres": per creare un DB serve
    # connettersi a uno che esista gia'.
    conn = await asyncpg.connect(f"{base}/postgres")
    # try/finally: la connessione viene chiusa anche se qualcosa va storto nel blocco.
    try:
        # $1 e' un parametro segnaposto: il valore viene passato separatamente, non incollato
        # nel testo SQL (protezione da SQL injection). Controlla se il DB esiste gia'.
        if not await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = $1", name):
            # Crea il DB solo se manca; il nome va tra virgolette doppie come identificatore SQL.
            await conn.execute(f'CREATE DATABASE "{name}"')
    # Chiude sempre la connessione, anche in caso di errore.
    finally:
        await conn.close()


# scope="session": questa fixture viene eseguita UNA sola volta per tutta la suite di test,
# non prima di ogni test. Creare lo schema e' lento, quindi si fa una volta sola.
# Il nome "db_schema" e' il valore che i test possono richiedere come parametro per dipendere
# da questa preparazione (vedi la fixture "client" sotto).
@pytest.fixture(scope="session")
async def db_schema():
    # Assicura che il database di test esista (vedi _ensure_database sopra).
    await _ensure_database()
    # engine.begin() apre una transazione: se un'istruzione fallisce, tutto viene annullato.
    # "async with" apre la risorsa e la chiude in automatico alla fine del blocco.
    async with engine.begin() as conn:
        # Abilita l'estensione pgvector: serve per le colonne vettoriali (embedding della RAG).
        # Va fatta prima di creare le tabelle. IF NOT EXISTS evita errori se esiste gia'.
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        # drop_all cancella tutte le tabelle dei modelli, per partire da uno stato pulito.
        # run_sync esegue i metodi sincroni di SQLAlchemy dentro la connessione asincrona.
        await conn.run_sync(Base.metadata.drop_all)
        # create_all ricrea le tabelle leggendole dai modelli Python (qui niente migrazioni
        # Alembic: lo schema viene creato direttamente dai modelli).
        await conn.run_sync(Base.metadata.create_all)
    # yield consegna il controllo ai test. Il codice dopo yield gira alla fine di TUTTI i test.
    yield
    # Chiude il pool di connessioni del motore quando la suite e' finita.
    await engine.dispose()


# Fixture "client", eseguita prima di OGNI test (scope di default: "function").
# Il parametro db_schema e' una dipendenza: pytest esegue prima db_schema, cosi' il DB e' pronto.
@pytest.fixture
async def client(db_schema):
    # Import dentro la funzione: app.main viene caricato solo ora, quando le variabili
    # d'ambiente sono gia' impostate in cima al file.
    from app.main import app

    # lifespan_context esegue le operazioni di avvio e spegnimento dell'app (es. sync della
    # roadmap nel DB), come farebbe uvicorn in produzione.
    async with app.router.lifespan_context(app):
        # ASGITransport collega il client direttamente all'app in memoria; base_url e' un
        # indirizzo finto usato solo per costruire le URL delle richieste.
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
            # yield consegna il client al test; alla fine del test i blocchi "async with"
            # si chiudono da soli, quindi connessioni e lifespan vengono puliti.
            yield c
