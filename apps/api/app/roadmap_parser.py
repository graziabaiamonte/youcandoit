"""Parse ROADMAP.md into a tree. Convention:

# Track N — Name
## Module N.M — Name
### Session N.M.K — Topic
> Outcomes: ...
- Subchapter {#1}
Sources: [Title](url), [Title](url)

`{#N}` is the subchapter's permanent key (id `<session id>.<N>`): reorder freely, never reuse a key,
give a new bullet the next unused number.

Any other top-level `# ` heading after the first track (e.g. `# Sources`) ends the roadmap part.
"""

import re
from dataclasses import dataclass, field

TRACK = re.compile(r"^# Track (\d+) — (.+)$")
MODULE = re.compile(r"^## Module (\d+\.\d+) — (.+)$")
SESSION = re.compile(r"^### Session (\d+\.\d+\.\d+) — (.+)$")
SUBCHAPTER = re.compile(r"^- (.+?)(?: \{#(\d+)\})?$")
LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")


@dataclass
class ParsedSession:
    id: str
    title: str
    outcomes: str = ""
    subchapters: list[str] = field(default_factory=list)
    subchapter_keys: list[str | None] = field(default_factory=list)  # parallel to subchapters
    sources: list[dict] = field(default_factory=list)


@dataclass
class ParsedModule:
    id: str
    title: str
    sessions: list[ParsedSession] = field(default_factory=list)


@dataclass
class ParsedTrack:
    id: str
    title: str
    modules: list[ParsedModule] = field(default_factory=list)


class RoadmapError(ValueError):
    pass


def parse_roadmap(text: str) -> list[ParsedTrack]:
    tracks: list[ParsedTrack] = []
    session: ParsedSession | None = None
    for lineno, raw in enumerate(text.splitlines(), 1):
        line = raw.rstrip()
        if m := TRACK.match(line):
            tracks.append(ParsedTrack(m[1], m[2].strip()))
            session = None
        elif line.startswith("# "):
            if tracks:  # appendix after the tracks; headings before them are the intro
                break
        elif m := MODULE.match(line):
            if not tracks or not m[1].startswith(tracks[-1].id + "."):
                raise RoadmapError(f"line {lineno}: module {m[1]} outside its track")
            tracks[-1].modules.append(ParsedModule(m[1], m[2].strip()))
            session = None
        elif m := SESSION.match(line):
            module = tracks[-1].modules[-1] if tracks and tracks[-1].modules else None
            if module is None or not m[1].startswith(module.id + "."):
                raise RoadmapError(f"line {lineno}: session {m[1]} outside its module")
            session = ParsedSession(m[1], m[2].strip())
            module.sessions.append(session)
        elif session is None:
            continue
        elif line.startswith(">"):
            body = line.lstrip("> ").removeprefix("Outcomes:").strip()
            session.outcomes = f"{session.outcomes} {body}".strip()
        elif line.startswith("- "):
            m = SUBCHAPTER.match(line)
            session.subchapters.append(m[1].strip())
            session.subchapter_keys.append(m[2])
        elif line.startswith("Sources:"):
            session.sources += [{"title": t, "url": u} for t, u in LINK.findall(line)]
    return tracks


def validate(tracks: list[ParsedTrack]) -> list[str]:
    """Return human-readable problems; empty list means the roadmap is well-formed."""
    problems, seen = [], set()
    for t in tracks:
        for m in t.modules:
            for s in m.sessions:
                if s.id in seen:
                    problems.append(f"duplicate session id {s.id}")
                seen.add(s.id)
                if not s.outcomes:
                    problems.append(f"{s.id}: missing outcomes")
                if not s.subchapters:
                    problems.append(f"{s.id}: no subchapters")
                if None in s.subchapter_keys:
                    problems.append(f"{s.id}: subchapter without a {{#N}} key")
                keys = [k for k in s.subchapter_keys if k]
                if len(keys) != len(set(keys)):
                    problems.append(f"{s.id}: duplicate subchapter key")
                if not s.sources:
                    problems.append(f"{s.id}: no sources")
    return problems
