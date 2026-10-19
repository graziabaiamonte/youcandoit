from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.gamification import compute_stats, level_for, level_threshold

TZ = ZoneInfo("Europe/Rome")
NOW = datetime(2026, 10, 19, 12, tzinfo=TZ)
SESSIONS = {"0.1.1": ["0.1.1.1", "0.1.1.2"], "0.1.2": ["0.1.2.1"]}
TRACKS = {"0": ["0.1.1", "0.1.2"]}


def days_ago(n: int) -> datetime:
    return NOW - timedelta(days=n)


def test_levels_are_monotonic_and_inverse():
    for lvl in range(1, 30):
        assert level_for(level_threshold(lvl)) == lvl
        assert level_for(level_threshold(lvl + 1) - 1) == lvl


def test_xp_includes_session_and_track_bonuses():
    partial = compute_stats({"0.1.1.1": NOW}, SESSIONS, TRACKS, now=NOW)
    assert partial.xp == 10
    full = compute_stats(
        {s: NOW for s in ("0.1.1.1", "0.1.1.2", "0.1.2.1")}, SESSIONS, TRACKS, now=NOW
    )
    assert full.xp == 3 * 10 + 2 * 50 + 300
    assert "track-0" in {b.id for b in full.badges}


def test_streak_counts_consecutive_days_and_allows_today_off():
    c = {"a": days_ago(1), "b": days_ago(2), "c": days_ago(3), "d": days_ago(5)}
    s = compute_stats(c, {}, {}, now=NOW)
    assert s.streak == 3  # yesterday, 2 and 3 days ago; today not studied yet
    assert s.best_streak == 3
    assert s.completed_today == 0
    assert "streak-3" in {b.id for b in s.badges}


def test_streak_breaks_after_a_missed_day():
    s = compute_stats({"a": days_ago(2)}, {}, {}, now=NOW)
    assert s.streak == 0 and s.best_streak == 1
