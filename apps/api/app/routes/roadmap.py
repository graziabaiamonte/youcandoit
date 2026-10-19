from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.models import Completion, Module, Session, Track

router = APIRouter(tags=["roadmap"])


class SourceOut(BaseModel):
    title: str
    url: str


class SubchapterOut(BaseModel):
    id: str
    title: str
    done: bool


class SessionNode(BaseModel):
    id: str
    title: str
    subchapters: list[SubchapterOut]


class ModuleNode(BaseModel):
    id: str
    title: str
    sessions: list[SessionNode]


class TrackNode(BaseModel):
    id: str
    title: str
    modules: list[ModuleNode]


class SessionDetail(BaseModel):
    id: str
    title: str
    outcomes: str
    track_id: str
    track_title: str
    module_id: str
    module_title: str
    sources: list[SourceOut]
    subchapters: list[SubchapterOut]
    prev_id: str | None
    next_id: str | None


async def _done_ids(db: AsyncSession) -> set[str]:
    return set(await db.scalars(select(Completion.subchapter_id)))


async def _tree(db: AsyncSession) -> list[Track]:
    stmt = (
        select(Track)
        .order_by(Track.position)
        .options(
            selectinload(Track.modules)
            .selectinload(Module.sessions)
            .selectinload(Session.subchapters)
        )
    )
    return list(await db.scalars(stmt))


@router.get("/roadmap", response_model=list[TrackNode])
async def get_roadmap(db: AsyncSession = Depends(get_db)) -> list[TrackNode]:
    done = await _done_ids(db)
    return [
        TrackNode(
            id=t.id,
            title=t.title,
            modules=[
                ModuleNode(
                    id=m.id,
                    title=m.title,
                    sessions=[
                        SessionNode(
                            id=s.id,
                            title=s.title,
                            subchapters=[
                                SubchapterOut(id=c.id, title=c.title, done=c.id in done)
                                for c in s.subchapters
                            ],
                        )
                        for s in m.sessions
                    ],
                )
                for m in t.modules
            ],
        )
        for t in await _tree(db)
    ]


@router.get("/sessions/{session_id}", response_model=SessionDetail)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)) -> SessionDetail:
    order = [(t, m, s) for t in await _tree(db) for m in t.modules for s in m.sessions]
    idx = next((i for i, (_, _, s) in enumerate(order) if s.id == session_id), None)
    if idx is None:
        raise HTTPException(404, "Session not found")
    (t, m, s), done = order[idx], await _done_ids(db)
    return SessionDetail(
        id=s.id,
        title=s.title,
        outcomes=s.outcomes,
        track_id=t.id,
        track_title=t.title,
        module_id=m.id,
        module_title=m.title,
        sources=[SourceOut(**src) for src in s.sources],
        subchapters=[
            SubchapterOut(id=c.id, title=c.title, done=c.id in done) for c in s.subchapters
        ],
        prev_id=order[idx - 1][2].id if idx > 0 else None,
        next_id=order[idx + 1][2].id if idx + 1 < len(order) else None,
    )
