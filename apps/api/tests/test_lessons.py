import os
import re
from pathlib import Path

import pytest

from app.roadmap_parser import parse_roadmap

ROADMAP = Path(os.environ.get("REAL_ROADMAP", "/roadmap/ROADMAP.md"))
LESSONS = sorted(
    p for p in (Path(os.environ["CONTENT_DIR"]) / "lessons").glob("*.md") if p.name != "README.md"
)


def _blocks(text: str, lang: str) -> list[str]:
    return re.findall(rf"^```{lang}\n(.*?)^```", text, re.M | re.S)


@pytest.mark.skipif(not ROADMAP.exists(), reason="ROADMAP.md not mounted")
@pytest.mark.parametrize("path", LESSONS, ids=lambda p: p.stem)
def test_lesson_matches_roadmap(path: Path):
    sessions = {
        s.id: s for t in parse_roadmap(ROADMAP.read_text()) for m in t.modules for s in m.sessions
    }
    assert path.stem in sessions, f"{path.name} is not a ROADMAP session"
    text = path.read_text()
    prose = re.sub(r"^```.*?^```", "", text, flags=re.M | re.S)  # `## ` in code isn't a heading
    assert not re.search(r"^# ", prose, re.M), "no H1: the title comes from ROADMAP.md"
    headings = [h.strip() for h in re.findall(r"^## (.+)$", prose, re.M)]
    assert headings == sessions[path.stem].subchapters
    assert all(b.strip() for b in _blocks(text, "mermaid")), "empty ```mermaid block"
