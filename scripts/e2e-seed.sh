#!/usr/bin/env sh
# Seeds the data the Playwright specs rely on: one indexed source for session 0.1.1
# and one news article. Idempotent. Run with the stack up (docker compose up).
set -eu
cli() { docker compose exec -T api python -m app.cli "$@"; }
cli index-text "https://missing.csail.mit.edu/" "MIT The Missing Semester" \
  "The shell is a textual interface for running programs, composing commands with pipes and automating tasks." \
  --kind source --session 0.1.1
cli add-article "https://example.com/e2e-kubernetes" "E2E: Kubernetes autoscaling explained" "E2E Feed" \
  --excerpt "How the Horizontal Pod Autoscaler scales pods based on CPU and custom metrics."
