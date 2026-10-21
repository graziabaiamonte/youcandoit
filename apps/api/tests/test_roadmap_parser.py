import os
from pathlib import Path

import pytest

from app.roadmap_parser import RoadmapError, parse_roadmap, validate

FIXTURE = (Path(__file__).parent / "fixtures" / "roadmap.md").read_text()
REAL = Path(os.environ.get("REAL_ROADMAP", Path(__file__).resolve().parents[-2] / "ROADMAP.md"))


def test_parses_tree_and_stops_at_appendix():
    tracks = parse_roadmap(FIXTURE)
    assert [t.id for t in tracks] == ["0", "1"]
    s = tracks[0].modules[0].sessions[0]
    assert s.id == "0.1.1"
    assert s.outcomes == "Navigate the file system and run commands confidently."
    assert s.subchapters == ["What a shell is", "Files and directories"]
    assert [x["url"] for x in s.sources] == [
        "https://missing.csail.mit.edu/",
        "https://linuxjourney.com/",
    ]
    all_urls = [x["url"] for t in tracks for m in t.modules for s in m.sessions for x in s.sources]
    assert "https://example.com" not in all_urls
    assert validate(tracks) == []


def test_rejects_misplaced_ids():
    with pytest.raises(RoadmapError):
        parse_roadmap("# Track 0 — A\n## Module 1.1 — wrong track\n")


def test_validate_reports_problems():
    tracks = parse_roadmap(
        "# Track 0 — A\n## Module 0.1 — B\n### Session 0.1.1 — C\n### Session 0.1.1 — D\n"
    )
    problems = validate(tracks)
    assert "duplicate session id 0.1.1" in problems
    assert "0.1.1: no sources" in problems


@pytest.mark.skipif(not REAL.exists(), reason="ROADMAP.md not mounted")
def test_real_roadmap_is_valid():
    tracks = parse_roadmap(REAL.read_text())
    assert len(tracks) >= 10
    assert validate(tracks) == []


def test_subchapter_keys_survive_reordering():
    s = parse_roadmap(FIXTURE)[0].modules[0].sessions[0]
    assert s.subchapter_keys == ["1", "2"]
    swapped = FIXTURE.replace(
        "- What a shell is {#1}\n- Files and directories {#2}",
        "- Files and directories {#2}\n- What a shell is {#1}",
    )
    s = parse_roadmap(swapped)[0].modules[0].sessions[0]
    assert dict(zip(s.subchapter_keys, s.subchapters, strict=True)) == {
        "1": "What a shell is",
        "2": "Files and directories",
    }


def test_validate_requires_unique_subchapter_keys():
    base = "# Track 0 — A\n## Module 0.1 — B\n### Session 0.1.1 — C\n> Outcomes: x\n{}Sources: [t](https://t.co)\n"
    assert validate(parse_roadmap(base.format("- a\n"))) == ["0.1.1: subchapter without a {#N} key"]
    assert validate(parse_roadmap(base.format("- a {#1}\n- b {#1}\n"))) == [
        "0.1.1: duplicate subchapter key"
    ]
