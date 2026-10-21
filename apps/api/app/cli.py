"""Admin commands, run inside the api container:

python -m app.cli sync-roadmap | index-sources | refresh-news
python -m app.cli index-text URL TITLE TEXT [--kind source|article] [--session ID]
python -m app.cli backup > backup.json  |  python -m app.cli restore < backup.json
"""

import argparse
import asyncio
import json
import sys
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app import news, rag, sync
from app.db import SessionLocal
from app.models import Article, Completion

# Only what can't be rebuilt: roadmap rows come from ROADMAP.md, vectors from re-indexing.
ARTICLE_FIELDS = ("url", "title", "source", "excerpt", "published_at", "favorite_at", "ai_summary")


async def backup(db: AsyncSession) -> dict:
    completions = (await db.scalars(select(Completion))).all()
    favorites = (await db.scalars(select(Article).where(Article.favorite_at.is_not(None)))).all()
    return {
        "completions": [
            {"subchapter_id": c.subchapter_id, "completed_at": c.completed_at.isoformat()}
            for c in completions
        ],
        "favorites": [
            {
                f: v.isoformat() if isinstance(v := getattr(a, f), datetime) else v
                for f in ARTICLE_FIELDS
            }
            for a in favorites
        ],
    }


async def restore(db: AsyncSession, data: dict) -> tuple[int, int]:
    """Upsert a backup; existing rows are kept, favorites are re-marked."""

    def dt(v: str | None) -> datetime | None:
        return datetime.fromisoformat(v) if v else None

    for c in data["completions"]:
        await db.execute(
            insert(Completion)
            .values(subchapter_id=c["subchapter_id"], completed_at=dt(c["completed_at"]))
            .on_conflict_do_nothing()
        )
    for a in data["favorites"]:
        row = {f: a.get(f) for f in ARTICLE_FIELDS} | {
            "published_at": dt(a.get("published_at")),
            "favorite_at": dt(a["favorite_at"]),
        }
        await db.execute(
            insert(Article)
            .values(**row)
            .on_conflict_do_update(index_elements=["url"], set_={"favorite_at": row["favorite_at"]})
        )
    await db.commit()
    return len(data["completions"]), len(data["favorites"])


async def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    sub = parser.add_subparsers(dest="cmd", required=True)
    for name in ("sync-roadmap", "index-sources", "refresh-news", "backup", "restore"):
        sub.add_parser(name)
    it = sub.add_parser("index-text", help="index a text directly (seeding, tests)")
    it.add_argument("url")
    it.add_argument("title")
    it.add_argument("text")
    it.add_argument("--kind", default="source", choices=["source", "article"])
    it.add_argument("--session")
    aa = sub.add_parser("add-article", help="insert a news article by hand (seeding, tests)")
    aa.add_argument("url")
    aa.add_argument("title")
    aa.add_argument("source")
    aa.add_argument("--excerpt", default="")
    args = parser.parse_args()

    async with SessionLocal() as db:
        match args.cmd:
            case "sync-roadmap":
                print(f"{await sync.sync_roadmap(db)} sessions")
            case "index-sources":
                print(f"{await sync.index_sources(db)} changed pages indexed")
            case "refresh-news":
                print(f"{await news.refresh_news(db)} new articles")
            case "backup":
                json.dump(await backup(db), sys.stdout, indent=2)
            case "restore":
                done, favs = await restore(db, json.load(sys.stdin))
                print(f"restored {done} completions, {favs} favorites", file=sys.stderr)
            case "index-text":
                changed = await rag.index_text(
                    db,
                    url=args.url,
                    title=args.title,
                    text=args.text,
                    kind=args.kind,
                    session_id=args.session,
                )
                print("indexed" if changed else "unchanged")
            case "add-article":
                await db.execute(
                    insert(Article)
                    .values(
                        url=args.url, title=args.title, source=args.source, excerpt=args.excerpt
                    )
                    .on_conflict_do_nothing(index_elements=["url"])
                )
                await db.commit()
                await news.index_article(db, args.url, args.title, args.excerpt)
                print("added")


if __name__ == "__main__":
    asyncio.run(main())
