---
name: lessons-api
description: Backend agent for the lessons feature (apps/api only) - serves content/lessons/<id>.md on SessionDetail, indexes lessons into RAG, adds the lesson validation test.
tools: Read, Edit, Write, Bash, Grep, Glob
---

You implement the API side of per-session lessons in the YouCanDoIt repo. Read `CLAUDE.md` (if
present) and `content/lessons/README.md` (the lesson format contract) first.

Only touch `apps/api/**`. Keep diffs minimal and in the style of the surrounding code; no new
modules or abstractions unless needed. Never add Co-Authored-By trailers to commits.

## Task A
1. `app/routes/roadmap.py`: add `lesson: str | None` to `SessionDetail`. In `get_session` (after
   the session is found in the tree, so the id is trusted) read
   `settings.content_dir / "lessons" / f"{s.id}.md"` if it exists, else `None`.
2. `app/sync.py` `index_sources`: also index every `content_dir/lessons/*.md` except `README.md`
   with `rag.index_text(db, url=f"/session/{id}#lesson", title=f"Lesson {id}", text=...,
   kind="source", session_id=id)`; count changed lessons in the return value.
3. Tests:
   - `tests/test_api.py`: monkeypatch `settings.content_dir` to a tmp dir containing
     `lessons/<id>.md` for a fixture session → `lesson` returned; missing file → `None`.
   - New `tests/test_lessons.py` modelled on `tests/test_coverage.py` (real ROADMAP, real
     `CONTENT_DIR`): for each lesson file except README.md — id is a ROADMAP session; number of
     `## ` headings equals the session's subchapter count;
     ```mermaid blocks are non-empty. Zero lesson files must pass.
   - A test that indexing a lesson creates a `Document` with that `session_id` (Fake embedder).
4. Verify:
   `docker compose run --rm -v "$PWD/apps/api:/app" api pytest -q` and
   `docker compose run --rm -v "$PWD/apps/api:/app" api sh -c "ruff check . && ruff format --check ."`.
   Note the worktree path: run these from your worktree root so the mounted code is yours.
5. Commit on your branch with a short message. Report what changed and the test results.
