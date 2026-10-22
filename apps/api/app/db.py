# ============================================================================
# db.py: la "porta" di connessione al database PostgreSQL.
#
# Ruolo nell'architettura: e' l'unico punto del progetto che crea la connessione
# al database. Tutto il resto (le route in app/routes/, main.py, cli.py e i test)
# importa da qui per parlare con il DB. Se si cambia database, si cambia qui.
#
# Chi lo usa:
# - app/routes/*.py (ai, roadmap, progress, articles): importano get_db e lo
#   passano alle route con Depends(get_db) (dependency injection, vedi sotto);
# - app/main.py e app/cli.py: importano SessionLocal per operazioni fuori dalle
#   richieste HTTP (avvio dell'app, job pianificati, comandi da terminale);
# - tests/conftest.py: importa engine (il motore) per la configurazione dei test;
# - tests/test_*.py: importano SessionLocal per preparare/leggere dati di test.
#
# Concetti chiave (versioni dal pyproject.toml: SQLAlchemy >=2.0.36 con extra
# asyncio, asyncpg >=0.30, FastAPI >=0.115; in apps/api non ho trovato un lock
# file, quindi non posso confermare le versioni esatte installate):
#
# 1) ORM e "engine": SQLAlchemy e' la libreria che traduce il codice Python in
#    SQL. Il "engine" e' l'oggetto che gestisce il pool di connessioni al DB.
#    In Laravel l'equivalente e' la configurazione di config/database.php con
#    Eloquent/DB facade, che pero' apre le connessioni "dietro le quinte".
#    Doc: https://docs.sqlalchemy.org/en/20/core/engines.html
#
# 2) Async (asincrono): "async"/"await" permettono di non bloccare il server
#    mentre aspetta il DB. Qui il driver e' asyncpg, indicato dal prefisso
#    "postgresql+asyncpg://" della URL in app/config.py.
#    Doc SQLAlchemy asyncio: https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html
#
# 3) Session: una "sessione" e' un'unita' di lavoro con il DB (come una
#    transazione). Si apre, si leggono/scrivono dati, si fa commit, poi si chiude
#    e la connessione torna nel pool. Non va condivisa tra richieste diverse.
#
# 4) Dependency injection con Depends: in FastAPI una route dichiara di aver
#    bisogno di qualcosa (es. db: AsyncSession = Depends(get_db)) e FastAPI lo
#    fornisce automaticamente. Non creiamo noi la sessione nella route.
#    Doc: https://fastapi.tiangolo.com/tutorial/dependencies/
# ============================================================================

# Importa AsyncIterator dalla libreria standard di Python: il tipo di "cosa
# restituisce" una funzione che produce valori uno alla volta (un generatore asincrono).
from collections.abc import AsyncIterator

# Importa dalla libreria SQLAlchemy (versione asincrona) i tre strumenti usati qui:
# AsyncSession (tipo della sessione), async_sessionmaker (fabbrica di sessioni) e
# create_async_engine (crea il motore di connessione).
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Importa l'oggetto "settings" da app/config.py: contiene la configurazione letta
# dalle variabili d'ambiente (.env), inclusa la URL del database (database_url).
from app.config import settings

# Crea il motore di connessione UNA SOLA VOLTA all'avvio del modulo. Usa la URL
# in settings.database_url. pool_pre_ping=True fa controllare ogni connessione
# prima di usarla: se il DB e' stato riavviato o la connessione e' caduta, viene
# sostituita invece di far fallire la richiesta.
engine = create_async_engine(settings.database_url, pool_pre_ping=True)

# Crea una "fabbrica" di sessioni: chiamare SessionLocal() produce una nuova
# AsyncSession collegata a engine. Il nome e' una convenzione (in SQLAlchemy
# classico si usava "SessionLocal" per lo stesso scopo).
# expire_on_commit=False: dopo un commit, gli oggetti letti restano leggibili
# senza dover ricaricare i dati dal DB. Serve perche' in modalita' async
# ricaricare i dati "pigri" (lazy) darebbe errore; cosi FastAPI puo' serializzare
# il risultato in JSON senza sorprese.
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


# Definisce la funzione get_db. "async def" = funzione asincrona. Il tipo di
# ritorno AsyncIterator[AsyncSession] dice che e' un generatore che produce
# una AsyncSession.
async def get_db() -> AsyncIterator[AsyncSession]:
    # "async with" apre la sessione e garantisce che venga chiusa alla fine,
    # anche se la route va in errore. SessionLocal() crea la sessione.
    async with SessionLocal() as db:
        # yield "consegna" la sessione alla route che l'ha richiesta. La funzione
        # si ferma qui e riprende quando la route ha finito: a quel punto
        # async with chiude la sessione (pattern "dependency with yield" di FastAPI).
        yield db
