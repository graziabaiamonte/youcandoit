"""Pure gamification rules. XP, level, streak and badges are derived from completions,
so nothing is stored that could drift out of sync with the ticked checkboxes."""

import math
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

XP_SUBCHAPTER = 10
XP_SESSION_BONUS = 50
XP_TRACK_BONUS = 300


@dataclass(frozen=True)
class Badge:
    id: str
    title: str
    description: str


@dataclass
class Stats:
    xp: int
    level: int
    xp_into_level: int
    xp_for_next_level: int
    streak: int
    best_streak: int
    completed_today: int
    badges: list[Badge]


def level_threshold(level: int) -> int:
    """Total XP needed to reach `level` (level 1 = 0 XP). Each level costs 100 XP more."""
    return 50 * (level - 1) * level


def level_for(xp: int) -> int:
    # inverse of level_threshold: 50*l*(l-1) <= xp
    return int((1 + math.sqrt(1 + 8 * xp / 100)) / 2)


def _streaks(days: set[date], today: date) -> tuple[int, int]:
    best = run = 0
    prev: date | None = None
    for d in sorted(days):
        run = run + 1 if prev and d - prev == timedelta(days=1) else 1
        best = max(best, run)
        prev = d
    # current streak counts if the last active day is today or yesterday
    current = 0
    d = today if today in days else today - timedelta(days=1)
    while d in days:
        current += 1
        d -= timedelta(days=1)
    return current, best


def compute_stats(
    completions: dict[str, datetime],
    session_subchapters: dict[str, list[str]],
    track_sessions: dict[str, list[str]],
    tz: str = "Europe/Rome",
    now: datetime | None = None,
) -> Stats:
    zone = ZoneInfo(tz)
    today = (now or datetime.now(zone)).astimezone(zone).date()
    done = set(completions)

    done_sessions = {
        s for s, subs in session_subchapters.items() if subs and all(x in done for x in subs)
    }
    done_tracks = {
        t for t, sess in track_sessions.items() if sess and all(s in done_sessions for s in sess)
    }
    xp = (
        len(done) * XP_SUBCHAPTER
        + len(done_sessions) * XP_SESSION_BONUS
        + len(done_tracks) * XP_TRACK_BONUS
    )
    days = {ts.astimezone(zone).date() for ts in completions.values()}
    streak, best = _streaks(days, today)
    level = level_for(xp)

    rules = [
        (len(done) >= 1, Badge("first-step", "First step", "Completed your first subchapter")),
        (len(done_sessions) >= 1, Badge("first-session", "Topic tamer", "Completed a session")),
        (len(done_sessions) >= 10, Badge("ten-sessions", "On a roll", "Completed 10 sessions")),
        (best >= 3, Badge("streak-3", "Warming up", "3-day study streak")),
        (best >= 7, Badge("streak-7", "One full week", "7-day study streak")),
        (best >= 30, Badge("streak-30", "Unstoppable", "30-day study streak")),
        (xp >= 1000, Badge("xp-1000", "Kilo-XP", "Earned 1,000 XP")),
    ]
    badges = [b for ok, b in rules if ok] + [
        Badge(f"track-{t}", f"Track {t} complete", f"Finished every session of track {t}")
        for t in sorted(done_tracks, key=int)
    ]
    return Stats(
        xp=xp,
        level=level,
        xp_into_level=xp - level_threshold(level),
        xp_for_next_level=level_threshold(level + 1) - level_threshold(level),
        streak=streak,
        best_streak=best,
        completed_today=sum(
            1 for ts in completions.values() if ts.astimezone(zone).date() == today
        ),
        badges=badges,
    )
