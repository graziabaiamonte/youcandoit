# Commands — running YouCanDoIt locally

Run everything from the project root (`~/Desktop/SoftwareDev/YouCanDoIt`).

## Start

```sh
open -a Docker                        # wait until Docker Desktop is running
docker compose up -d                  # db, api :8000, web :3000 (add --build after a git pull)
open http://localhost:3000
```

The tutor uses the native Ollama service (`brew services start ollama` if it isn't running;
check with `curl localhost:11434/api/tags`).

## Stop

```sh
docker compose stop
```

## After merging the Saturday roadmap PR

```sh
git pull && docker compose up -d --build
```

## Back up and restore your progress

Progress lives only in the Postgres volume. The backup keeps ticked subchapters and favorite
articles; everything else is rebuilt from `ROADMAP.md` and re-indexing.

```sh
mkdir -p backups
docker compose exec -T api python -m app.cli backup > backups/ycdi-$(date +%F).json
docker compose exec -T api python -m app.cli restore < backups/ycdi-2026-10-21.json
```

`restore` only adds what is missing, so it is safe to run on a database that already has progress.
