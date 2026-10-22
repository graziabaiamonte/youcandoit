"""initial schema

Revision ID: 0001
Revises:
"""

# ----------------------------------------------------------------------------
# MIGRAZIONE 0001: lo schema iniziale del database (tutte le tabelle, da zero).
#
# Perché esiste una migrazione? Il codice cambia nel tempo, e anche il database
# (tabelle, colonne, indici) deve cambiare. Alembic tiene traccia di ogni modifica
# come un file numerato. Questo è il primo "passo": crea la struttura di partenza.
#
# Ogni migrazione ha due funzioni:
#   - upgrade():   applica la modifica (crea tabelle, colonne, indici...)
#   - downgrade(): la annulla, per tornare indietro
#
# All'avvio del container l'API esegue `alembic upgrade head` (vedi CLAUDE.md):
# applica in ordine tutte le migrazioni non ancora applicate.
#
# Regola d'oro: NON modificare questo file dopo che è stato applicato a un database
# reale. Per cambiare lo schema si crea un nuovo file (come 0002_chunks_document_index.py).
#
# Riferimenti ufficiali (versioni indicative dal pyproject: alembic>=1.14,
# sqlalchemy>=2.0.36, pgvector>=0.3.6; non ho trovato un lockfile con la versione esatta):
#   - Alembic: https://alembic.sqlalchemy.org/en/latest/
#   - SQLAlchemy 2.0: https://docs.sqlalchemy.org/en/20/
#   - pgvector-python: https://github.com/pgvector/pgvector-python
# ----------------------------------------------------------------------------

# sqlalchemy: libreria Python per parlare con il database. "as sa" è un alias (nome corto).
import sqlalchemy as sa

# Tipo di colonna per i vettori di embedding (liste di numeri), fornito dal pacchetto pgvector.
from pgvector.sqlalchemy import Vector

# "op" è l'oggetto con cui Alembic esegue le operazioni sul DB (create_table, execute...).
from alembic import op

# Identificativo univoco di questa migrazione (coincide con il numero nel nome del file).
revision = "0001"
# None = non dipende da nessuna migrazione precedente: è la prima della catena.
down_revision = None

# Scorciatoia per un tipo di colonna usato spesso: data e ora CON fuso orario
# (in Postgres: TIMESTAMP WITH TIME ZONE). Evita di ripetere timezone=True ovunque.
TS = sa.DateTime(timezone=True)


# -> None è un "type hint": dichiara che la funzione non restituisce nessun valore.
def upgrade() -> None:
    # Attiva l'estensione pgvector in Postgres: senza di essa il tipo "vector" non esiste.
    # "IF NOT EXISTS" evita errori se l'estensione è già attiva.
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    # Tabella "tracks": i grandi percorsi del curriculum (es. Track 1).
    # I dati arrivano da ROADMAP.md (vedi sync.sync_roadmap), non si scrivono a mano nel DB.
    op.create_table(
        "tracks",
        # Id testuale, chiave primaria: identifica univocamente la riga.
        sa.Column("id", sa.String(16), primary_key=True),
        # String(200) = VARCHAR(200), testo di max 200 caratteri. nullable=False = obbligatorio.
        sa.Column("title", sa.String(200), nullable=False),
        # Intero che dice l'ordine di visualizzazione (come nel file ROADMAP.md).
        sa.Column("position", sa.Integer, nullable=False),
    )
    # Tabella "modules": i moduli, ciascuno dentro un track.
    op.create_table(
        "modules",
        # Id testuale, chiave primaria.
        sa.Column("id", sa.String(16), primary_key=True),
        # Chiave esterna (ForeignKey): il valore deve esistere in tracks.id.
        # ondelete="CASCADE": se cancelli un track, il DB cancella anche i suoi moduli.
        sa.Column(
            "track_id",
            sa.String(16),
            sa.ForeignKey("tracks.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
    )
    # Tabella "sessions": una lezione/sessione, dentro un modulo.
    op.create_table(
        "sessions",
        # Id testuale, chiave primaria.
        sa.Column("id", sa.String(16), primary_key=True),
        # Chiave esterna verso modules.id; cancellando il modulo, si cancellano le sessioni.
        sa.Column(
            "module_id",
            sa.String(16),
            sa.ForeignKey("modules.id", ondelete="CASCADE"),
            nullable=False,
        ),
        # Titolo della sessione (String(300) = VARCHAR di max 300 caratteri).
        sa.Column("title", sa.String(300), nullable=False),
        # Text = testo senza limite pratico. Qui gli obiettivi di apprendimento.
        sa.Column("outcomes", sa.Text, nullable=False),
        # Ordine di visualizzazione dentro il modulo.
        sa.Column("position", sa.Integer, nullable=False),
        # JSON = dato strutturato (qui la lista delle fonti, es. link di riferimento).
        sa.Column("sources", sa.JSON, nullable=False),
    )
    # Tabella "subchapters": i sotto-capitoli (i punti elenco "- subchapter {#N}" del ROADMAP).
    op.create_table(
        "subchapters",
        # String(24) è più lungo degli altri id: è composto da id sessione + "." + chiave.
        sa.Column("id", sa.String(24), primary_key=True),
        # Chiave esterna verso sessions.id, con CASCADE come le altre relazioni.
        sa.Column(
            "session_id",
            sa.String(16),
            sa.ForeignKey("sessions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
    )
    # Tabella "completions": i sotto-capitoli completati dall'utente (il progresso).
    op.create_table(
        "completions",
        # Nessuna ForeignKey di proposito: il progresso sopravvive a modifiche del ROADMAP.
        sa.Column("subchapter_id", sa.String(24), primary_key=True),
        # server_default=sa.func.now(): se non viene indicata la data, la scrive il DB
        # con la funzione now() (ora attuale) al momento dell'inserimento.
        sa.Column("completed_at", TS, server_default=sa.func.now(), nullable=False),
    )
    # Tabella "articles": notizie raccolte dal feed (aggiornate dal comando refresh-news).
    op.create_table(
        "articles",
        # Integer + primary_key: numero progressivo che il DB assegna da solo (1, 2, 3...).
        sa.Column("id", sa.Integer, primary_key=True),
        # unique=True: due articoli non possono avere lo stesso URL (evita duplicati).
        sa.Column("url", sa.String(2000), nullable=False, unique=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("source", sa.String(200), nullable=False),
        # server_default="": se non viene passato un valore, il DB usa la stringa vuota.
        sa.Column("excerpt", sa.Text, nullable=False, server_default=""),
        # Senza nullable=False la colonna accetta NULL (= "valore assente"), come default.
        sa.Column("published_at", TS),
        sa.Column("fetched_at", TS, server_default=sa.func.now(), nullable=False),
        # NULL = non preferito; quando l'utente lo mette tra i preferiti, qui c'è una data.
        sa.Column("favorite_at", TS),
        # Riassunto generato dall'AI: opzionale, quindi può essere NULL.
        sa.Column("ai_summary", sa.Text),
    )
    # Tabella "documents": le pagine/fonti indicizzate per il RAG (la ricerca nei testi).
    op.create_table(
        "documents",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("url", sa.String(2000), nullable=False, unique=True),
        sa.Column("title", sa.String(500), nullable=False),
        # Tipo di documento, in forma di testo breve (il valore lo decide il codice che indicizza).
        sa.Column("kind", sa.String(16), nullable=False),
        # index=True: crea anche un indice su questa colonna, per cercare per sessione in fretta.
        # Nota: qui è nullable (manca nullable=False): può non essere legato a una sessione.
        sa.Column("session_id", sa.String(16), index=True),
        # Impronta (hash) del contenuto: se non cambia, la pagina non viene reindicizzata.
        sa.Column("content_hash", sa.String(64), nullable=False),
        sa.Column("indexed_at", TS, server_default=sa.func.now(), nullable=False),
    )
    # Tabella "chunks": pezzi di testo di un documento, ciascuno con il suo vettore (embedding).
    op.create_table(
        "chunks",
        sa.Column("id", sa.Integer, primary_key=True),
        # Chiave esterna verso documents.id; cancellando il documento, via i suoi pezzi.
        sa.Column(
            "document_id",
            sa.Integer,
            sa.ForeignKey("documents.id", ondelete="CASCADE"),
            nullable=False,
        ),
        # Ordine del pezzo dentro il documento (primo, secondo, ...).
        sa.Column("position", sa.Integer, nullable=False),
        # Il testo del pezzo, quello che verrà mostrato o passato al modello AI.
        sa.Column("text", sa.Text, nullable=False),
        # Vector(768) = colonna pgvector: una lista di 768 numeri. 768 è la dimensione
        # prodotta dal modello di embedding nomic-embed-text (vedi CLAUDE.md e config.py).
        sa.Column("embedding", Vector(768), nullable=False),
    )
    # Indice HNSW: struttura che rende veloce trovare i vettori "più simili" senza confrontarli
    # tutti uno per uno. vector_cosine_ops = misura di somiglianza "coseno" (vedi rag.py).
    # op.execute esegue SQL scritto a mano, per ciò che Alembic non sa esprimere direttamente.
    op.execute(
        "CREATE INDEX chunks_embedding_hnsw ON chunks USING hnsw (embedding vector_cosine_ops)"
    )


# downgrade() annulla upgrade(): elimina le tabelle create sopra.
def downgrade() -> None:
    # L'ordine conta: prima si eliminano le tabelle che CONTENGONO le chiavi esterne
    # (es. chunks), poi quelle a cui puntano (es. tracks). Il contrario darebbe errore.
    # Nota: l'estensione "vector" non viene rimossa qui; resta attiva nel database.
    for table in (
        "chunks",
        "documents",
        "articles",
        "completions",
        "subchapters",
        "sessions",
        "modules",
        "tracks",
    ):
        op.drop_table(table)
