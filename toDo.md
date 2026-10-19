# To Do — YouCanDoIt

What remains to complete the app. Updated at the end of every phase.

## Phase 1 — Research
- [x] Syllabi downloaded to `Resources/syllabi/<institution>/` + `research/curricula.md`
- [x] `research/job-requirements.md` (≈20 senior postings, skill frequency table)
- [x] `research/elearning-platforms.md`
- [x] `research/ui-notes.md`
- [x] `research/official-docs.md`

## Phase 2 — Roadmap
- [x] `ROADMAP.md` (tracks → modules → sessions → subchapters, outcomes, sources, Sources, Changelog)
- [x] Coverage check: every `themes.md` item and top job skill maps to a session

## Phase 3 — App
- [x] Docker Compose (web, api, db pgvector, ollama + model pull)
- [x] API: roadmap parser, progress + gamification, quotes, news + favorites, LLM providers, RAG
- [x] Web: sidebar roadmap tree, session view, welcome quote, daily news + favorites, `/map`, tutor drawer
- [x] Tests: pytest + Playwright e2e
- [x] CI (GitHub Actions)
- [x] README (architecture, stack alternatives, screenshots)

## Phase 4 — Weekly routine
- [x] Push repo to GitHub
- [ ] Scheduled routine Saturday 10:00 Europe/Rome → PR with ROADMAP.md updates

## Follow-ups found while building
- [ ] Bigger/faster local model: llama3.2:3b on CPU-in-Docker answers in ~40 s and is sometimes imprecise — use native Ollama (Metal GPU), a larger model, or the Claude key
- [ ] PDF sources are skipped by the indexer (`rag.fetch_text`) — add pypdf extraction
- [ ] Subchapter IDs are positional (`<session>.<n>`): reordering subchapters in ROADMAP.md shifts ticked progress — append only, or add explicit IDs
- [ ] Sentry + OpenTelemetry in the app itself (Track 5 practice)

## Later
- [x] Full lesson content per session (Markdown in `content/lessons/`: text, colour-coded callouts and Mermaid diagrams), indexed into RAG — pilot 0.1.1 done; content for later tracks is being written
- [ ] Auth + multi-user (needed before any public deploy)
- [ ] Free cloud deploy (Vercel + Render + Neon) and a public demo with seeded data
- [ ] Optional Qdrant swap capstone (Track 9): port `rag.py` to Qdrant and compare it with pgvector on speed, filtering and setup
- [ ] Mobile/PWA polish
- [ ] Anything the weekly routine flags that needs a human decision
