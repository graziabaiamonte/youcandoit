#!/usr/bin/env sh
# Seeds the data the Playwright specs rely on: one indexed source for session 0.1.1
# and one news article. Idempotent. Run with the stack up (docker compose up).
# Nota: lo shebang (riga 1) usa "sh" (shell POSIX minimale): niente sintassi solo-bash.
# Viene chiamato da scripts/e2e.sh, che imposta COMPOSE_FILE sull'override e2e (DB ycdi_e2e).
# set -e: se un comando fallisce lo script si ferma subito, senza proseguire a meta'.
# set -u: usare una variabile non definita e' un errore (invece di diventare stringa vuota).
set -eu
# cli e' una funzione: inoltra tutti i suoi argomenti ("$@") a "python -m app.cli"
# eseguito dentro il container "api" gia' acceso (docker compose exec).
# -T: non alloca un terminale, necessario quando lo script non e' interattivo (es. CI).
cli() { docker compose exec -T api python -m app.cli "$@"; }
# 1) Indicizza un testo passato direttamente, senza scaricare la pagina (comando index-text).
# Argomenti: URL, titolo, testo. --kind source = materiale per il tutor (RAG);
# --session 0.1.1 lo collega alla sessione del roadmap usata dai test.
# Se il testo non e' cambiato, la CLI stampa "unchanged" e non reindicizza (hash SHA-256).
cli index-text "https://missing.csail.mit.edu/" "MIT The Missing Semester" \
  "The shell is a textual interface for running programs, composing commands with pipes and automating tasks." \
  --kind source --session 0.1.1
# 2) Inserisce a mano una notizia nella tabella articles (comando add-article).
# Argomenti: URL, titolo, fonte ("E2E Feed"); --excerpt = breve riassunto.
# Se l'URL esiste gia' non fa nulla (on_conflict_do_nothing), quindi lo script resta ripetibile.
cli add-article "https://example.com/e2e-kubernetes" "E2E: Kubernetes autoscaling explained" "E2E Feed" \
  --excerpt "How the Horizontal Pod Autoscaler scales pods based on CPU and custom metrics."
