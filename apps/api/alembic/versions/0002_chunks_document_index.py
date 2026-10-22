"""index chunks.document_id (re-index delete, cascade from documents, retrieve join)

Revision ID: 0002
Revises: 0001
"""

# Migrazione Alembic (revisione 0002): crea un indice sulla colonna chunks.document_id.
# Alembic tiene la "storia" dello schema del database: ogni file in versions/ è una revisione.
# All'avvio del container, `alembic upgrade head` applica in ordine le revisioni non ancora fatte.
# Perché l'indice: Postgres NON crea indici automatici sulle colonne di chiave esterna
# (ForeignKey). Senza questo, ogni ricerca per document_id leggerebbe tutta la tabella chunks.
# Le query che lo usano sono in app/rag.py: cancellazione dei chunk alla reindicizzazione
# (riga 217), join chunk-documento in fase di retrieve.
# Qui sotto importiamo `op`, l'oggetto di Alembic con cui si eseguono le modifiche allo schema.
from alembic import op

# Identificativo di questa revisione. Serve ad Alembic per riconoscerla nella cronologia.
revision = "0002"
# Revisione precedente: 0002 viene dopo 0001 (quella che ha creato la tabella chunks).
# Così le revisioni formano una catena: 0001 -> 0002. Alembic applica sempre in quest'ordine.
down_revision = "0001"


# upgrade(): la funzione che Alembic esegue per applicare la revisione.
# "-> None" è un type hint: indica che la funzione non restituisce alcun valore.
def upgrade() -> None:
    # Crea l'indice "ix_chunks_document_id" sulla tabella "chunks", colonna "document_id".
    # Il nome segue la convenzione ix_<tabella>_<colonna>,
    # la stessa che SQLAlchemy usa con index=True (vedi app/models.py).
    op.create_index("ix_chunks_document_id", "chunks", ["document_id"])


# downgrade(): fa l'operazione opposta, per tornare allo stato precedente
# (per esempio con `alembic downgrade -1`). Ogni upgrade dovrebbe avere il suo downgrade.
def downgrade() -> None:
    # Elimina l'indice creato in upgrade. table_name indica da quale tabella rimuoverlo.
    op.drop_index("ix_chunks_document_id", table_name="chunks")
