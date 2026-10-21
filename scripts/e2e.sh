#!/usr/bin/env sh
# Full end-to-end run: isolated e2e database + fake LLM, then Playwright against the real UI.
set -eu
cd "$(dirname "$0")/.."
compose="docker compose -f docker-compose.yml -f docker-compose.e2e.yml"
$compose up -d --build db
until $compose exec -T db pg_isready -h localhost -U ycdi >/dev/null 2>&1; do sleep 1; done
$compose exec -T db psql -U ycdi -tc "SELECT 1 FROM pg_database WHERE datname='ycdi_e2e'" | grep -q 1 \
  || $compose exec -T db createdb -U ycdi ycdi_e2e
$compose up -d --build api web
until curl -sf localhost:8000/health >/dev/null; do sleep 1; done
COMPOSE_FILE=docker-compose.yml:docker-compose.e2e.yml ./scripts/e2e-seed.sh
cd apps/web && npx playwright test "$@"
