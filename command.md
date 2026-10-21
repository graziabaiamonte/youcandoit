# Commands — running YouCanDoIt locally

Run everything from the project root (`~/Desktop/SoftwareDev/YouCanDoIt`) unless a step says
otherwise.

The app runs only on this Mac (single-user, no auth, no cloud deploy).

---

## 0. One-time setup

```sh
brew install --cask docker            # Docker Desktop, then open it once
brew install node gh                  # Node 24+, GitHub CLI
npm i -g @anthropic-ai/claude-code    # Claude Code CLI
gh auth login
cp .env.example .env                  # optional: add ANTHROPIC_API_KEY, OLLAMA_URL
cd apps/web && npm ci && npx playwright install chromium && cd ../..
```

Ollama runs natively on the Mac (it gets the GPU, so the tutor is much faster). As a Homebrew
service it starts on every login; `.env` points the API at it instead of the `ollama` container:

```sh
brew install ollama && brew services start ollama
ollama pull llama3.2:3b && ollama pull nomic-embed-text
echo "OLLAMA_URL=http://host.docker.internal:11434" >> .env
```

If `index-sources` or the tutor fails with "Ollama embeddings unavailable at
http://host.docker.internal:11434", the service isn't running: `brew services start ollama`
(check with `curl localhost:11434/api/tags`).

## 1. Start the stack

```sh
docker compose up -d --build          # db, ollama, api :8000, web :3000
docker compose logs -f api            # wait for "Application startup complete", then Ctrl+C
open http://localhost:3000
```

The lesson-writer agent runs `test_lessons.py` in Docker, so the `db` container has to be up.

## 2. Edit the roadmap

Every subchapter bullet ends in a permanent `{#N}` key (its id is `<session>.<N>`), so ticked
progress survives reordering. A new bullet takes the next unused number in its session; never reuse
or renumber a key. Add the matching `## ` heading to `content/lessons/<session>.md` in the same order.
Review the Saturday routine's PRs with this in mind: CI fails on a bullet without a key.

## 3. Write or redo a lesson

`claude --agent lesson-writer "Write the lesson for session 3.2.4"`
writes a missing lesson. To redo one, delete `content/lessons/3.2.4.md` first: existing lessons are
skipped.

## 4. Run the full CI locally

```sh
docker compose run --rm -v "$PWD/apps/api:/app" api sh -c "ruff check . && ruff format --check ."
docker compose run --rm -v "$PWD/apps/api:/app" api pytest -q
cd apps/web && npm run lint && npm run typecheck && npx next build && cd ../..
./scripts/e2e.sh
docker compose up -d api              # point the API back at your real DB after e2e
```

## 5. Index the lessons for the AI tutor and check them in the app

```sh
docker compose restart api
docker compose exec api python -m app.cli index-sources
open http://localhost:3000/session/1.1.1
```

Run step 5 whenever lessons change; the 03:00 nightly job also picks them up.
