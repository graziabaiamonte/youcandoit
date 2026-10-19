# Commands — from lessons to online

Run these top to bottom from the project root (`~/Desktop/SoftwareDev/YouCanDoIt`) unless a step
says otherwise.

**Where things stand:** the lessons feature is built (API `lessons-api`, web `lessons-web`, QA
`lessons-qa`), and all 20 Track 0 lessons exist. Tracks 1–11 are still to write: 207 sessions.

| Track | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sessions | 26 | 17 | 24 | 19 | 24 | 15 | 10 | 20 | 28 | 11 | 13 |

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

Optional, makes the tutor much faster on a Mac (native Ollama gets the GPU):

```sh
brew install ollama && ollama serve &
ollama pull llama3.2:3b && ollama pull nomic-embed-text
echo "OLLAMA_URL=http://host.docker.internal:11434" >> .env
```

## 1. Start the stack

```sh
docker compose up -d --build          # db, ollama, api :8000, web :3000
docker compose logs -f api            # wait for "Application startup complete", then Ctrl+C
open http://localhost:3000
```

The lesson-writer agent runs `test_lessons.py` in Docker, so the `db` container has to be up.

## 2. Commit the work in progress

```sh
git status
git add .gitignore content/lessons/0.1.1.md docker-compose.yml toDo.md
git commit -m "Update pilot lesson 0.1.1 and compose config"
```

## 3. Clean up old agent worktrees (check before deleting)

```sh
git worktree list
git branch --merged feature/lessons | grep worktree-agent     # only these are safe to remove
git worktree remove .claude/worktrees/agent-<id>              # one per merged branch
git branch -d worktree-agent-<id>
git worktree prune
```

If a branch isn't merged, look at it first (`git log feature/lessons..worktree-agent-<id>`) and merge
it or keep it.

## 4. Write the lessons: one lesson-writer agent per track

Each agent works in its own git worktree, so you can run several at once in separate terminal tabs.
Runs can be resumed: the agent skips lessons that already exist. Start with 2–3 tracks in parallel
(each agent calls WebFetch and Docker a lot).

```sh
claude --agent lesson-writer -w lessons-track-1  "Write the lessons for track 1"
claude --agent lesson-writer -w lessons-track-2  "Write the lessons for track 2"
claude --agent lesson-writer -w lessons-track-3  "Write the lessons for track 3"
claude --agent lesson-writer -w lessons-track-4  "Write the lessons for track 4"
claude --agent lesson-writer -w lessons-track-5  "Write the lessons for track 5"
claude --agent lesson-writer -w lessons-track-6  "Write the lessons for track 6"
claude --agent lesson-writer -w lessons-track-7  "Write the lessons for track 7"
claude --agent lesson-writer -w lessons-track-8  "Write the lessons for track 8"
claude --agent lesson-writer -w lessons-track-9  "Write the lessons for track 9"
claude --agent lesson-writer -w lessons-track-10 "Write the lessons for track 10"
claude --agent lesson-writer -w lessons-track-11 "Write the lessons for track 11"
```

To redo a single session: `claude --agent lesson-writer "Write the lesson for session 3.2.4"`
(delete `content/lessons/3.2.4.md` first, because existing lessons are skipped).

## 5. Merge each finished track into `feature/lessons`

Repeat for every track (N = 1…11) once its agent has finished:

```sh
N=1
git -C .claude/worktrees/lessons-track-$N status                # must be clean (everything committed)
BR=$(git -C .claude/worktrees/lessons-track-$N branch --show-current)
git merge --no-edit "$BR"
docker compose run --rm -v "$PWD/apps/api:/app" api pytest -q tests/test_lessons.py
git worktree remove .claude/worktrees/lessons-track-$N && git branch -d "$BR"
```

## 6. Run the full CI locally

```sh
docker compose run --rm -v "$PWD/apps/api:/app" api sh -c "ruff check . && ruff format --check ."
docker compose run --rm -v "$PWD/apps/api:/app" api pytest -q
cd apps/web && npm run lint && npm run typecheck && npx next build && cd ../..
./scripts/e2e.sh
docker compose up -d api              # point the API back at your real DB after e2e
```

## 7. Index the lessons for the AI tutor and check them in the app

```sh
docker compose restart api
docker compose exec api python -m app.cli index-sources
open http://localhost:3000/session/1.1.1
```

## 8. Push and merge into `main`

```sh
git push -u origin feature/lessons
gh pr create --base main --head feature/lessons --title "Lessons for all tracks" \
  --body "Lessons for every ROADMAP session (content/lessons/), rendered on the session page and indexed into RAG."
gh pr checks --watch                  # GitHub Actions CI must pass
gh pr merge --merge --delete-branch
git checkout main && git pull
```

## 9. Deploy online (free tier: Neon + Render + Vercel)

> **Read this before you deploy:**
> - **No auth yet.** The app is single-user and anyone with the URL can change your progress.
>   Add auth first, or keep the URLs private (`toDo.md` → "Auth + multi-user").
> - **The API image doesn't include `ROADMAP.md` or `content/`.** `apps/api/Dockerfile` only copies
>   `apps/api`, and locally the two are mounted as volumes. Render has no volumes, so you need a
>   Dockerfile built from the repo root that also copies them to `/roadmap/ROADMAP.md` and
>   `/content`. Add it before step 9.2.
> - **Ollama can't run on free tiers.** Chat runs on Claude (`ANTHROPIC_API_KEY`). Embeddings
>   (tutor/RAG) need `OLLAMA_URL` pointing at an Ollama you run yourself and can reach from the
>   internet, e.g. through a tunnel.

### 9.1 Database: Neon (Postgres + pgvector)

```sh
brew install neonctl
neonctl auth
neonctl projects create --name youcandoit --region-id aws-eu-central-1
neonctl connection-string --project-id <project-id>    # copy it
psql "<connection-string>" -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

For the API, rewrite the URL in asyncpg form:
`postgresql+asyncpg://<user>:<password>@<host>/<db>?ssl=require`. asyncpg takes `ssl=require`,
not `sslmode=require`.

### 9.2 API: Render (Docker web service)

Dashboard → New → Web Service → connect `graziabaiamonte/youcandoit`, branch `main`, runtime
Docker, with the root-context Dockerfile from the note above. Environment variables:

```
DATABASE_URL=postgresql+asyncpg://...neon.tech/...?ssl=require
ROADMAP_PATH=/roadmap/ROADMAP.md
CONTENT_DIR=/content
ANTHROPIC_API_KEY=sk-ant-...
LLM_PROVIDER=anthropic
OLLAMA_URL=https://<your-reachable-ollama>
```

The container runs `alembic upgrade head` on start. Check it:

```sh
curl https://<api>.onrender.com/openapi.json | head -c 200
```

### 9.3 Web: Vercel

```sh
npm i -g vercel
cd apps/web
vercel login
vercel link                                   # new project, root = apps/web
vercel env add API_URL production             # https://<api>.onrender.com
vercel --prod
cd ../..
```

### 9.4 Index the sources in production

Open a shell on the Render service (Dashboard → Shell) and run:

```sh
python -m app.cli index-sources
python -m app.cli refresh-news
```

After that, each push to `main` redeploys on its own: Render and Vercel both watch the branch.

## 10. Afterwards

- Tick the items in `toDo.md` ("Full lesson content per session", "Free cloud deploy").
- Run step 7 again whenever lessons change. The 03:00 nightly job also picks them up.
