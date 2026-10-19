from app import rag
from app.db import SessionLocal


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
