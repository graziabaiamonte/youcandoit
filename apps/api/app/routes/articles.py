from datetime import UTC, datetime

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app import news, rag
from app.db import SessionLocal, get_db
from app.llm import get_llm
from app.models import Article

router = APIRouter(tags=["articles"])
# newest N per source, so high-volume feeds (dev.to) don't crowd out the rest
PER_SOURCE = 5


class ArticleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    url: str
    title: str
    source: str
    excerpt: str
    published_at: datetime | None
    favorite_at: datetime | None
    ai_summary: str | None


async def _article(db: AsyncSession, article_id: int) -> Article:
    if not (a := await db.get(Article, article_id)):
        raise HTTPException(404, "Article not found")
    return a


async def _index_full_text(url: str, title: str) -> None:
    async with SessionLocal() as db:
        await rag.index_url(db, url=url, title=title, kind="article")


@router.get("/articles", response_model=list[ArticleOut])
async def list_articles(
    favorites: bool = False,
    limit: int = Query(100, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
) -> list[Article]:
    stmt = select(Article)
    if favorites:
        stmt = stmt.where(Article.favorite_at.is_not(None)).order_by(Article.favorite_at.desc())
    else:
        newest = (Article.published_at.desc().nulls_last(), Article.id.desc())
        rank = func.row_number().over(partition_by=Article.source, order_by=newest)
        ranked = select(Article.id, rank.label("rank")).subquery()
        stmt = (
            stmt.join(ranked, ranked.c.id == Article.id)
            .where(ranked.c.rank <= PER_SOURCE)
            .order_by(*newest)
        )
    return list(await db.scalars(stmt.limit(limit)))


@router.post("/articles/refresh")
async def refresh(db: AsyncSession = Depends(get_db)) -> dict[str, int]:
    return {"new": await news.refresh_news(db)}


@router.put("/articles/{article_id}/favorite", response_model=ArticleOut)
async def favorite(
    article_id: int, tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)
) -> Article:
    a = await _article(db, article_id)
    if not a.favorite_at:
        a.favorite_at = datetime.now(UTC)
        await db.commit()
        tasks.add_task(_index_full_text, a.url, a.title)
    return a


@router.delete("/articles/{article_id}/favorite", response_model=ArticleOut)
async def unfavorite(article_id: int, db: AsyncSession = Depends(get_db)) -> Article:
    a = await _article(db, article_id)
    a.favorite_at = None
    await db.commit()
    return a


@router.post("/articles/{article_id}/summary", response_model=ArticleOut)
async def summarize(article_id: int, db: AsyncSession = Depends(get_db)) -> Article:
    a = await _article(db, article_id)
    if not a.ai_summary:
        try:
            text = await rag.fetch_text(a.url) or a.excerpt
        except httpx.HTTPError:
            text = a.excerpt
        a.ai_summary = await get_llm().chat(
            "You summarize technical articles for a junior developer studying to become a "
            "senior engineer. Write 3-5 short bullet points, then one line 'Why it matters:'. "
            "Always answer in English.",
            [{"role": "user", "content": f"Title: {a.title}\n\n{text[:12000]}"}],
        )
        await db.commit()
    return a
