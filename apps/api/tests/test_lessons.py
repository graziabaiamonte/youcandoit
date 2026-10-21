import os
import re
from pathlib import Path

import pytest

from app.roadmap_parser import parse_roadmap
from app.sync import lesson_folder

ROADMAP = Path(os.environ.get("REAL_ROADMAP", "/roadmap/ROADMAP.md"))
LESSONS_DIR = Path(os.environ["CONTENT_DIR"]) / "lessons"
LESSONS = sorted(LESSONS_DIR.glob("*/*/*.md"))


def _blocks(text: str, lang: str) -> list[str]:
    return re.findall(rf"^```{lang}\n(.*?)^```", text, re.M | re.S)


@pytest.mark.skipif(not ROADMAP.exists(), reason="ROADMAP.md not mounted")
@pytest.mark.parametrize("path", LESSONS, ids=lambda p: p.stem)
def test_lesson_matches_roadmap(path: Path):
    where = {
        s.id: (t, m, s)
        for t in parse_roadmap(ROADMAP.read_text())
        for m in t.modules
        for s in m.sessions
    }
    assert path.stem in where, f"{path.name} is not a ROADMAP session"
    t, m, session = where[path.stem]
    assert path.parent.name == lesson_folder(m.id, m.title), "lesson is not in its module's folder"
    assert path.parent.parent.name == lesson_folder(t.id, t.title), "module is not in its track"
    text = path.read_text()
    prose = re.sub(r"^```.*?^```", "", text, flags=re.M | re.S)  # `## ` in code isn't a heading
    assert not re.search(r"^# ", prose, re.M), "no H1: the title comes from ROADMAP.md"
    headings = [h.strip() for h in re.findall(r"^## (.+)$", prose, re.M)]
    assert headings == session.subchapters
    assert all(b.strip() for b in _blocks(text, "mermaid")), "empty ```mermaid block"


def test_no_lessons_outside_module_folders():
    assert [p.name for p in LESSONS_DIR.glob("*.md")] == ["README.md"]
    assert not list(LESSONS_DIR.glob("*/*.md")), "lessons go in <track>/<module>/"
