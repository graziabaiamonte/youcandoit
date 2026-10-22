#!/usr/bin/env sh
# Full end-to-end run: isolated e2e database + fake LLM, then Playwright against the real UI.
# Riepilogo: 1) avvia Postgres, 2) crea il DB ycdi_e2e, 3) avvia api e web con il fake LLM,
# 4) carica i dati di prova (seed), 5) lancia Playwright. Il DB reale "ycdi" non viene toccato.
# Attenzione: l'API resta puntata al DB di e2e finche' non la riavvii (vedi CLAUDE.md).
# set -e: se un comando fallisce lo script si ferma subito invece di andare avanti.
# set -u: usare una variabile non definita e' un errore invece di un valore vuoto silenzioso.
set -eu
# Si posiziona nella root del progetto (cartella sopra scripts/), cosi' i percorsi relativi
# funzionano anche se lo script viene lanciato da un'altra cartella. $0 e' il percorso dello script.
cd "$(dirname "$0")/.."
# Variabile con il comando docker compose: il file "-f e2e.yml" sovrascrive il file base
# (DB ycdi_e2e, LLM fake, niente job in background). Si usa con $compose piu' avanti.
compose="docker compose -f docker-compose.yml -f docker-compose.e2e.yml"
# Avvia (o ricostruisce) solo il container del database Postgres in background (-d).
$compose up -d --build db
# Attende che Postgres accetti connessioni: pg_isready risponde 0 solo quando e' pronto.
# "until ... do ...; done" ripete il comando finche' fallisce, con una pausa di 1 secondo.
# >/dev/null 2>&1 nasconde l'output e gli errori, che qui sono attesi durante l'avvio.
until $compose exec -T db pg_isready -h localhost -U ycdi >/dev/null 2>&1; do sleep 1; done
# Crea il database ycdi_e2e solo se non esiste. psql -tc esegue la query SQL e stampa solo il
# risultato; grep -q 1 e' vero se la query ha trovato una riga. Se non c'e', "||" esegue createdb.
# (la riga di continuazione sotto e' un unico comando: non inserire commenti tra le due righe)
$compose exec -T db psql -U ycdi -tc "SELECT 1 FROM pg_database WHERE datname='ycdi_e2e'" | grep -q 1 \
  || $compose exec -T db createdb -U ycdi ycdi_e2e
# Avvia api e web (ricostruendoli) con la configurazione di e2e; il DB viene avviato sopra.
$compose up -d --build api web
# Attende che l'API risponda su /health (curl -s silenzioso, -f fallisce su errori HTTP).
until curl -sf localhost:8000/health >/dev/null; do sleep 1; done
# Carica i dati attesi dai test (fonte indicizzata e articolo). COMPOSE_FILE e' la variabile
# che docker compose legge al posto dei -f: qui fa lo stesso lavoro dei due -f di sopra.
COMPOSE_FILE=docker-compose.yml:docker-compose.e2e.yml ./scripts/e2e-seed.sh
# Entra in apps/web ed esegue i test Playwright. "$@" inoltra a playwright tutti gli argomenti
# ricevuti dallo script (es. ./scripts/e2e.sh e2e/tutor.spec.ts), cosi' puoi lanciare un solo file.
cd apps/web && npx playwright test "$@"
