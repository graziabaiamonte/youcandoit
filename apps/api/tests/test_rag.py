from app import rag
from app.db import SessionLocal


def test_chunking_overlaps_and_covers_everything():
    words = [f"w{i}" for i in range(1000)]
    chunks = rag.chunk_text(" ".join(words), size=600, overlap=80)
    assert len(chunks) == 2
    assert chunks[0].split()[-80:] == chunks[1].split()[:80]
    assert chunks[1].split()[-1] == "w999"
    assert rag.chunk_text("") == []
    assert rag.chunk_text("one two") == ["one two"]


async def test_retrieval_returns_matching_document(db_schema):
    async with SessionLocal() as db:
        await rag.index_text(
            db,
            url="https://ex.com/k8s",
            title="Kubernetes pods",
            text="Kubernetes schedules pods onto nodes in a cluster.",
            kind="article",
        )
        await rag.index_text(
            db,
            url="https://ex.com/bake",
            title="Bread",
            text="Knead the dough and bake the bread in the oven.",
            kind="article",
        )
        hits = await rag.retrieve(db, "how does kubernetes schedule pods", k=1, kind="article")
        assert hits[0].url == "https://ex.com/k8s"
        # unchanged text is not re-embedded
        assert not await rag.index_text(
            db,
            url="https://ex.com/k8s",
            title="Kubernetes pods",
            text="Kubernetes schedules pods onto nodes in a cluster.",
            kind="article",
        )
