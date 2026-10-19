from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db import get_db
from app.gamification import compute_stats
from app.models import Completion, Module, Session, Subchapter, Track

router = APIRouter(tags=["progress"])


class BadgeOut(BaseModel):
    id: str
    title: str
    description: str


class TrackProgress(BaseModel):
    id: str
    title: str
    done: int
    total: int


class StatsOut(BaseModel):
    xp: int
    level: int
    xp_into_level: int
    xp_for_next_level: int
    streak: int
    best_streak: int
    completed_today: int
    badges: list[BadgeOut]
    tracks: list[TrackProgress]


async def _stats(db: AsyncSession) -> StatsOut:
    completions: dict[str, datetime] = dict(
        (await db.execute(select(Completion.subchapter_id, Completion.completed_at))).all()
    )
    rows = (
        await db.execute(
            select(Track.id, Track.title, Session.id, Subchapter.id)
            .join(Module, Module.track_id == Track.id)
            .join(Session, Session.module_id == Module.id)
            .join(Subchapter, Subchapter.session_id == Session.id)
            .order_by(Track.position)
        )
    ).all()
    session_subs: dict[str, list[str]] = {}
    track_sessions: dict[str, list[str]] = {}
    titles: dict[str, str] = {}
    for track_id, track_title, session_id, sub_id in rows:
        titles[track_id] = track_title
        session_subs.setdefault(session_id, []).append(sub_id)
        sessions = track_sessions.setdefault(track_id, [])
        if session_id not in sessions:
            sessions.append(session_id)
    # completions of subchapters removed from the roadmap don't count
    live = {sid for subs in session_subs.values() for sid in subs}
    stats = compute_stats(
        {k: v for k, v in completions.items() if k in live},
        session_subs,
        track_sessions,
        settings.timezone,
    )
    return StatsOut(
        **{k: v for k, v in vars(stats).items() if k != "badges"},
        badges=[BadgeOut(**vars(b)) for b in stats.badges],
        tracks=[
            TrackProgress(
                id=t,
                title=titles[t],
                done=sum(1 for s in sess for x in session_subs[s] if x in completions),
                total=sum(len(session_subs[s]) for s in sess),
            )
            for t, sess in track_sessions.items()
        ],
    )


@router.get("/stats", response_model=StatsOut)
async def get_stats(db: AsyncSession = Depends(get_db)) -> StatsOut:
    return await _stats(db)


@router.put("/progress/{subchapter_id}", response_model=StatsOut)
async def complete(subchapter_id: str, db: AsyncSession = Depends(get_db)) -> StatsOut:
    if not await db.get(Subchapter, subchapter_id):
        raise HTTPException(404, "Subchapter not found")
    await db.execute(
        insert(Completion).values(subchapter_id=subchapter_id).on_conflict_do_nothing()
    )
    await db.commit()
    return await _stats(db)


@router.delete("/progress/{subchapter_id}", response_model=StatsOut)
async def uncomplete(subchapter_id: str, db: AsyncSession = Depends(get_db)) -> StatsOut:
    await db.execute(delete(Completion).where(Completion.subchapter_id == subchapter_id))
    await db.commit()
    return await _stats(db)
