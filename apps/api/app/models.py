from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.config import settings


class Base(DeclarativeBase):
    pass


# --- Roadmap (mirrors ROADMAP.md; ids are the stable "1.2.3" numbers) ---


class Track(Base):
    __tablename__ = "tracks"
    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    position: Mapped[int] = mapped_column(Integer)
    modules: Mapped[list["Module"]] = relationship(
        back_populates="track", order_by="Module.position", cascade="all, delete-orphan"
    )


class Module(Base):
    __tablename__ = "modules"
    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    track_id: Mapped[str] = mapped_column(ForeignKey("tracks.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(200))
    position: Mapped[int] = mapped_column(Integer)
    track: Mapped[Track] = relationship(back_populates="modules")
    sessions: Mapped[list["Session"]] = relationship(
        back_populates="module", order_by="Session.position", cascade="all, delete-orphan"
    )


class Session(Base):
    __tablename__ = "sessions"
    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    module_id: Mapped[str] = mapped_column(ForeignKey("modules.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(300))
    outcomes: Mapped[str] = mapped_column(Text)
    position: Mapped[int] = mapped_column(Integer)
    sources: Mapped[list[dict]] = mapped_column(JSON, default=list)  # [{title, url}]
    module: Mapped[Module] = relationship(back_populates="sessions")
    subchapters: Mapped[list["Subchapter"]] = relationship(
        back_populates="session", order_by="Subchapter.position", cascade="all, delete-orphan"
    )


class Subchapter(Base):
    __tablename__ = "subchapters"
    id: Mapped[str] = mapped_column(String(24), primary_key=True)  # "<session id>.<{#N} key>"
    session_id: Mapped[str] = mapped_column(ForeignKey("sessions.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(300))
    position: Mapped[int] = mapped_column(Integer)
    session: Mapped[Session] = relationship(back_populates="subchapters")


class Completion(Base):
    """A ticked subchapter. No FK: progress must survive roadmap edits."""

    __tablename__ = "completions"
    subchapter_id: Mapped[str] = mapped_column(String(24), primary_key=True)
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# --- News ---


class Article(Base):
    __tablename__ = "articles"
    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(2000), unique=True)
    title: Mapped[str] = mapped_column(String(500))
    source: Mapped[str] = mapped_column(String(200))
    excerpt: Mapped[str] = mapped_column(Text, default="")
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    favorite_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ai_summary: Mapped[str | None] = mapped_column(Text)


# --- RAG ---


class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(2000), unique=True)
    title: Mapped[str] = mapped_column(String(500))
    kind: Mapped[str] = mapped_column(String(16))  # "source" | "article"
    session_id: Mapped[str | None] = mapped_column(String(16), index=True)
    content_hash: Mapped[str] = mapped_column(String(64))
    indexed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    chunks: Mapped[list["Chunk"]] = relationship(cascade="all, delete-orphan")


class Chunk(Base):
    __tablename__ = "chunks"
    id: Mapped[int] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"), index=True
    )
    position: Mapped[int] = mapped_column(Integer)
    text: Mapped[str] = mapped_column(Text)
    embedding: Mapped[list[float]] = mapped_column(Vector(settings.embed_dim))
