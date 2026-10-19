from sqlalchemy import select

from app import rag, sync
from app.config import settings
from app.db import SessionLocal
from app.models import Document


async def test_roadmap_progress_and_stats(client):
    tree = (await client.get("/roadmap")).json()
    assert [t["id"] for t in tree] == ["0", "1"]

    r = await client.put("/progress/0.1.2.1")
    assert r.status_code == 200
    stats = r.json()
    assert stats["xp"] == 10 + 50  # subchapter + completed single-subchapter session
    assert stats["completed_today"] == 1

    session = (await client.get("/sessions/0.1.2")).json()
    assert session["subchapters"][0]["done"] is True
    assert session["prev_id"] == "0.1.1" and session["next_id"] == "1.1.1"

    assert (await client.delete("/progress/0.1.2.1")).json()["xp"] == 0
    assert (await client.put("/progress/9.9.9.9")).status_code == 404


async def test_tutor_cites_indexed_sources(client):
    async with SessionLocal() as db:
        await rag.index_text(
            db,
            url="https://missing.csail.mit.edu/",
            title="Missing Semester",
            text="The shell is a textual interface to run programs.",
            kind="source",
            session_id="0.1.1",
        )
    r = await client.post("/ai/tutor", json={"session_id": "0.1.1", "question": "What is a shell?"})
    body = r.json()
    assert r.status_code == 200
    assert body["citations"][0]["url"] == "https://missing.csail.mit.edu/"
    assert "[1]" in body["answer"]


async def test_quote(client):
    q = (await client.get("/quotes/random")).json()
    assert q["text"] and q["author"]


async def test_session_lesson_served_and_indexed(client, tmp_path, monkeypatch):
    (tmp_path / "lessons").mkdir()
    (tmp_path / "lessons" / "0.1.1.md").write_text("## What is a shell\n\nA lesson body.")
    monkeypatch.setattr(settings, "content_dir", tmp_path)

    assert (await client.get("/sessions/0.1.1")).json()["lesson"].startswith("## What is a shell")
    assert (await client.get("/sessions/0.1.2")).json()["lesson"] is None

    async def no_fetch(*args, **kwargs):
        return False

    monkeypatch.setattr(rag, "index_url", no_fetch)  # keep source pages off the network
    async with SessionLocal() as db:
        assert await sync.index_sources(db) == 1
        doc = await db.scalar(select(Document).where(Document.url == "/session/0.1.1#lesson"))
        assert doc.session_id == "0.1.1"
        assert await sync.index_sources(db) == 0  # unchanged lesson is skipped
