"""Daily news: fetch RSS/Atom feeds from content/feeds.yaml, dedupe by URL, keep 30 days
(favorites are kept forever), and index new articles into RAG."""

import asyncio
import logging
import re
from datetime import UTC, datetime, timedelta
from time import mktime

import feedparser
import httpx
import yaml
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app import rag
from app.config import settings
from app.models import Article, Document

log = logging.getLogger(__name__)
KEEP_DAYS = 30
PER_FEED = 15


def load_feeds() -> list[dict]:
    return yaml.safe_load((settings.content_dir / "feeds.yaml").read_text())["feeds"]


def _clean(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html or "")).strip()[:500]


def parse_feed(xml: str | bytes, source: str) -> list[dict]:
    """Pure: feed body → article dicts. Duplicate URLs inside one feed are dropped."""
    seen, items = set(), []
    for e in feedparser.parse(xml).entries[:PER_FEED]:
        url = e.get("link")
        if not url or url in seen:
            continue
        seen.add(url)
        ts = e.get("published_parsed") or e.get("updated_parsed")
        items.append(
            {
                "url": url,
                "title": _clean(e.get("title", url))[:500],
                "source": source,
                "excerpt": _clean(e.get("summary", "")),
                "published_at": datetime.fromtimestamp(mktime(ts), UTC) if ts else None,
            }
        )
    return items


async def _fetch(client: httpx.AsyncClient, feed: dict) -> list[dict]:
    try:
        r = await client.get(feed["url"])
        r.raise_for_status()
        return parse_feed(r.content, feed["name"])
    except httpx.HTTPError as e:
        log.warning("feed %s failed: %s", feed["name"], e)
        return []


async def refresh_news(db: AsyncSession) -> int:
    """Fetch all feeds; returns the number of new articles."""
    async with httpx.AsyncClient(
        timeout=20, follow_redirects=True, headers={"User-Agent": rag.USER_AGENT}
    ) as client:
        batches = await asyncio.gather(*(_fetch(client, f) for f in load_feeds()))
    rows = list({a["url"]: a for batch in batches for a in batch}.values())
    new_ids: list[int] = []
    if rows:
        result = await db.execute(
            insert(Article)
            .values(rows)
            .on_conflict_do_nothing(index_elements=["url"])
            .returning(Article.id)
        )
        new_ids = list(result.scalars())
    cutoff = datetime.now(UTC) - timedelta(days=KEEP_DAYS)
    await db.execute(
        delete(Article).where(Article.fetched_at < cutoff, Article.favorite_at.is_(None))
    )
    await db.execute(
        delete(Document).where(Document.kind == "article", Document.url.not_in(select(Article.url)))
    )
    await db.commit()
    # index every article not indexed yet (self-heals if embeddings were down last time);
    # the excerpt is indexed now, the full text when the article is favorited
    unindexed = select(Article).where(Article.url.not_in(select(Document.url)))
    for article in await db.scalars(unindexed):
        await rag.index_text(
            db,
            url=article.url,
            title=article.title,
            kind="article",
            text=f"{article.title}. {article.excerpt}",
        )
    return len(new_ids)
