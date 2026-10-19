"""initial schema

Revision ID: 0001
Revises:
"""

import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

from alembic import op

revision = "0001"
down_revision = None

TS = sa.DateTime(timezone=True)


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "tracks",
        sa.Column("id", sa.String(16), primary_key=True),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
    )
    op.create_table(
        "modules",
        sa.Column("id", sa.String(16), primary_key=True),
        sa.Column(
            "track_id",
            sa.String(16),
            sa.ForeignKey("tracks.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
    )
    op.create_table(
        "sessions",
        sa.Column("id", sa.String(16), primary_key=True),
        sa.Column(
            "module_id",
            sa.String(16),
            sa.ForeignKey("modules.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("outcomes", sa.Text, nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
        sa.Column("sources", sa.JSON, nullable=False),
    )
    op.create_table(
        "subchapters",
        sa.Column("id", sa.String(24), primary_key=True),
        sa.Column(
            "session_id",
            sa.String(16),
            sa.ForeignKey("sessions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
    )
    op.create_table(
        "completions",
        sa.Column("subchapter_id", sa.String(24), primary_key=True),
        sa.Column("completed_at", TS, server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "articles",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("url", sa.String(2000), nullable=False, unique=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("source", sa.String(200), nullable=False),
        sa.Column("excerpt", sa.Text, nullable=False, server_default=""),
        sa.Column("published_at", TS),
        sa.Column("fetched_at", TS, server_default=sa.func.now(), nullable=False),
        sa.Column("favorite_at", TS),
        sa.Column("ai_summary", sa.Text),
    )
    op.create_table(
        "documents",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("url", sa.String(2000), nullable=False, unique=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("kind", sa.String(16), nullable=False),
        sa.Column("session_id", sa.String(16), index=True),
        sa.Column("content_hash", sa.String(64), nullable=False),
        sa.Column("indexed_at", TS, server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "chunks",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "document_id",
            sa.Integer,
            sa.ForeignKey("documents.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("position", sa.Integer, nullable=False),
        sa.Column("text", sa.Text, nullable=False),
        sa.Column("embedding", Vector(768), nullable=False),
    )
    op.execute(
        "CREATE INDEX chunks_embedding_hnsw ON chunks USING hnsw (embedding vector_cosine_ops)"
    )


def downgrade() -> None:
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
