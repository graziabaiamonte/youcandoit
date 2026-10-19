"""Admin commands, run inside the api container:

python -m app.cli sync-roadmap | index-sources | refresh-news
python -m app.cli index-text URL TITLE TEXT [--kind source|article] [--session ID]
"""

import argparse
import asyncio

from sqlalchemy.dialects.postgresql import insert

from app import news, rag, sync
from app.db import SessionLocal
from app.models import Article


async def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    sub = parser.add_subparsers(dest="cmd", required=True)
    for name in ("sync-roadmap", "index-sources", "refresh-news"):
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
                await rag.index_text(
                    db,
                    url=args.url,
                    title=args.title,
                    kind="article",
                    text=f"{args.title}. {args.excerpt}",
                )
                print("added")


if __name__ == "__main__":
    asyncio.run(main())
