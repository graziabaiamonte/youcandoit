"""Retrieval-augmented generation: fetch → extract → chunk → embed → store → retrieve."""

import hashlib
import logging
from dataclasses import dataclass
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import httpx
import trafilatura
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.llm import get_embedder
from app.models import Chunk, Document

log = logging.getLogger(__name__)
USER_AGENT = "YouCanDoIt-StudyBot/0.1 (personal learning app)"
CHUNK_WORDS = 600  # ≈ 800 tokens
OVERLAP_WORDS = 80


@dataclass
class Hit:
    url: str
    title: str
    kind: str
    text: str
    distance: float


def chunk_text(text: str, size: int = CHUNK_WORDS, overlap: int = OVERLAP_WORDS) -> list[str]:
    words = text.split()
    if not words:
        return []
    step = size - overlap
    return [" ".join(words[i : i + size]) for i in range(0, max(len(words) - overlap, 1), step)]


_robots: dict[str, RobotFileParser] = {}


async def _allowed(client: httpx.AsyncClient, url: str) -> bool:
    origin = "{0.scheme}://{0.netloc}".format(urlparse(url))
    if origin not in _robots:
        rp = RobotFileParser()
        try:
            r = await client.get(f"{origin}/robots.txt")
            rp.parse(r.text.splitlines() if r.status_code == 200 else [])
        except httpx.HTTPError:
            rp.parse([])
        _robots[origin] = rp
    return _robots[origin].can_fetch(USER_AGENT, url)


async def fetch_text(url: str) -> str | None:
    async with httpx.AsyncClient(
        timeout=30, follow_redirects=True, headers={"User-Agent": USER_AGENT}
    ) as client:
        if not await _allowed(client, url):
            log.info("robots.txt disallows %s", url)
            return None
        r = await client.get(url)
        r.raise_for_status()
    if "pdf" in r.headers.get("content-type", ""):
        return None  # shortcut: PDFs skipped, add pypdf extraction if sources need it
    return trafilatura.extract(r.text, url=url)


async def index_text(
    db: AsyncSession, *, url: str, title: str, text: str, kind: str, session_id: str | None = None
) -> bool:
    """Store `text` as chunks for `url`. Returns False if unchanged since last index."""
    digest = hashlib.sha256(text.encode()).hexdigest()
    doc = await db.scalar(select(Document).where(Document.url == url))
    if doc and doc.content_hash == digest:
        return False
    chunks = chunk_text(text)
    if not chunks:
        return False
    vectors = await get_embedder().embed(chunks)
    if doc:
        await db.execute(delete(Chunk).where(Chunk.document_id == doc.id))
        doc.content_hash, doc.title, doc.session_id = digest, title, session_id
    else:
        doc = Document(url=url, title=title, kind=kind, session_id=session_id, content_hash=digest)
        db.add(doc)
        await db.flush()
    db.add_all(
        Chunk(document_id=doc.id, position=i, text=t, embedding=v)
        for i, (t, v) in enumerate(zip(chunks, vectors, strict=True))
    )
    await db.commit()
    return True


async def index_url(
    db: AsyncSession, *, url: str, title: str, kind: str, session_id: str | None = None
) -> bool:
    try:
        text = await fetch_text(url)
    except httpx.HTTPError as e:
        log.warning("could not fetch %s: %s", url, e)
        return False
    if not text:
        return False
    return await index_text(db, url=url, title=title, text=text, kind=kind, session_id=session_id)


async def retrieve(
    db: AsyncSession,
    query: str,
    *,
    k: int = 6,
    kind: str | None = None,
    session_id: str | None = None,
) -> list[Hit]:
    [qv] = await get_embedder().embed([query])
    distance = Chunk.embedding.cosine_distance(qv).label("distance")
    stmt = select(Chunk.text, Document.url, Document.title, Document.kind, distance).join(Document)
    if kind:
        stmt = stmt.where(Document.kind == kind)
    if session_id:
        stmt = stmt.where(Document.session_id == session_id)
    rows = await db.execute(stmt.order_by(distance).limit(k))
    return [Hit(url=u, title=t, kind=kd, text=tx, distance=d) for tx, u, t, kd, d in rows]


def build_context(hits: list[Hit]) -> tuple[str, list[dict]]:
    """Numbered context block for the prompt + the citation list for the UI (one per URL)."""
    numbers: dict[str, int] = {}
    parts = []
    for h in hits:
        n = numbers.setdefault(h.url, len(numbers) + 1)
        parts.append(f"[{n}] {h.title}\n{h.text}")
    citations = [
        {"n": n, "url": u, "title": next(h.title for h in hits if h.url == u)}
        for u, n in numbers.items()
    ]
    return "\n\n".join(parts), citations
