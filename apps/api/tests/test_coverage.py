import os
from pathlib import Path

import pytest
import yaml

from app.roadmap_parser import parse_roadmap

ROADMAP = Path(os.environ.get("REAL_ROADMAP", "/roadmap/ROADMAP.md"))
COVERAGE = Path(os.environ["CONTENT_DIR"]) / "coverage.yaml"


@pytest.mark.skipif(not ROADMAP.exists(), reason="ROADMAP.md not mounted")
def test_every_theme_and_job_skill_maps_to_existing_sessions():
    sessions = {
        s.id for t in parse_roadmap(ROADMAP.read_text()) for m in t.modules for s in m.sessions
    }
    coverage = yaml.safe_load(COVERAGE.read_text())
    missing = {
        f"{group}/{name}": [i for i in map(str, ids) if i not in sessions] or "no sessions"
        for group in ("themes", "job_skills")
        for name, ids in coverage[group].items()
        if not ids or any(str(i) not in sessions for i in ids)
    }
    assert not missing
