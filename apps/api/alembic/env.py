# =============================================================================
# alembic/env.py - Configurazione delle migrazioni del database (Alembic)
# =============================================================================
# Alembic è lo strumento che "versiona" lo schema del database: ogni modifica alle
# tabelle (creare una tabella, aggiungere una colonna, un indice...) diventa un file
# in alembic/versions/. Questo file è lo "script di collegamento": Alembic lo esegue
# ogni volta che lo invochiamo e gli dice QUALE database usare e QUALI modelli usare
# come riferimento.
#
# Ruolo nel progetto:
# - apps/api/Dockerfile lancia `alembic upgrade head` prima di avviare uvicorn: così il
#   database è sempre alla versione più recente dello schema all'avvio del container.
# - alembic.ini (nella stessa cartella apps/api) dice ad Alembic dove sta questa cartella
#   (script_location = alembic). Alembic cerca env.py proprio lì.
# - Le tabelle sono descritte come classi Python in app/models.py (la classe Base).
# - La URL del database arriva da app/config.py, che la legge dal file .env.
# - tests/conftest.py NON usa Alembic: crea le tabelle direttamente da Base.metadata.
#   Quindi, quando cambi un modello, ricordati di aggiungere anche la migrazione.
#
# Concetti chiave:
# - Migrazione: un file Python con upgrade() (applica la modifica) e downgrade()
#   (la annulla). Ogni migrazione ha un revision id e punta alla precedente.
# - Autogenerate (`alembic revision --autogenerate`): Alembic confronta i modelli con
#   il DB reale e propone automaticamente la migrazione. Doc: alembic.sqlalchemy.org
# - Modalità "online" (quella usata qui): Alembic apre una connessione reale al DB.
#   Modalità "offline" (`alembic upgrade --sql`): produce solo SQL, senza DB.
#   shortcut: supporta solo la modalità online (manca il ramo context.is_offline_mode()),
#   da aggiungere se serve generare SQL da far eseguire a mano.
# - Versione di Alembic: non ho verificato il numero esatto nel lock file del progetto;
#   il pyproject.toml chiede alembic>=1.14.
# - Async: il driver asyncpg richiede un engine asincrono. Alembic però lavora in modo
#   sincrono, quindi il codice sotto fa da ponte con asyncio e conn.run_sync.
# =============================================================================

# Libreria standard di Python per eseguire codice asincrono (funzioni con async/await).
import asyncio

# Importa solo il nome indicato dal modulo. Crea il motore asincrono del DB.
from sqlalchemy.ext.asyncio import create_async_engine

# `context` è l'oggetto di Alembic con cui si configurano e si lanciano le migrazioni.
from alembic import context

# `settings` contiene la configurazione letta da .env (incluso database_url).
from app.config import settings

# `Base` è la classe base dei modelli SQLAlchemy: tiene il registro di tutte le tabelle.
from app.models import Base

# `metadata` è la descrizione dello schema "desiderato" dai modelli. Alembic la confronta
# con il database reale (per l'autogenerate). Il nome `target_metadata` è una convenzione
# che Alembic si aspetta esattamente così.
target_metadata = Base.metadata


# Funzione SINCRONA: riceve una connessione già aperta ed esegue le migrazioni.
# `-> None` è un type hint che indica che la funzione non restituisce nulla.
# `connection` non ha un type hint: è un oggetto Connection di SQLAlchemy.
def run(connection) -> None:
    # Dice ad Alembic quale connessione usare e quali modelli confrontare.
    context.configure(connection=connection, target_metadata=target_metadata)
    # Apre una transazione: se una migrazione fallisce, il DB torna com'era (tutto o niente).
    with context.begin_transaction():
        # Applica in ordine le migrazioni mancanti fino a quella richiesta (es. "head" = ultima).
        context.run_migrations()


# Funzione ASINCRONA (`async def`): può usare `await` per aspettare operazioni lente
# (come quelle sul DB) senza bloccare il resto del programma.
async def main() -> None:
    # Crea l'engine, il "ponte" verso il DB, usando l'URL preso da settings.database_url.
    engine = create_async_engine(settings.database_url)
    # `async with` apre la connessione e la chiude da sola alla fine del blocco, anche se
    # succede un errore. `conn` è il nome con cui usiamo la connessione dentro il blocco.
    async with engine.connect() as conn:
        # `run_sync` esegue la funzione sincrona `run` dentro la connessione asincrona.
        await conn.run_sync(run)
    # Chiude tutte le connessioni rimaste aperte nel pool dell'engine, liberando risorse.
    await engine.dispose()


# Avvia il loop di eventi asincrono ed esegue `main()`. Non c'è un
# `if __name__ == "__main__":` perché Alembic importa questo file e lo esegue subito.
asyncio.run(main())
