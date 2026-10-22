"""Admin commands, run inside the api container:

python -m app.cli sync-roadmap | index-sources | refresh-news
python -m app.cli index-text URL TITLE TEXT [--kind source|article] [--session ID]
python -m app.cli backup > backup.json  |  python -m app.cli restore < backup.json
"""

# ============================================================================
# cli.py: i comandi "da amministratore" del progetto, lanciati da terminale.
#
# Modulo eseguibile: ogni file .py si puo' importare da altri codici OPPURE
# eseguire direttamente. `python -m app.cli comando` cerca il modulo app/cli.py
# dentro il pacchetto "app" ed esegue questo file come programma. Il blocco
# `if __name__ == "__main__":` in fondo e' il punto di ingresso.
#
# Dove gira: dentro il container Docker dell'API (docker compose exec api ...),
# quindi usa le stesse impostazioni e lo stesso database dell'app web.
#
# Perche' esiste: alcune operazioni non nascono da una richiesta HTTP
# dell'utente, ma da un comando a mano o da uno script: sincronizzare il
# programma di studi, reindicizzare le fonti per il tutor, scaricare le notizie,
# fare backup/restore dei progressi, inserire dati di prova.
#
# Chi lo usa:
# - README.md: elenca i comandi da lanciare;
# - scripts/e2e-seed.sh: popola il database di test con index-text e add-article;
# - apps/api/tests/test_api.py: verifica backup e restore (importa le funzioni).
# Cosa importa: news, rag, sync (dove sta la logica vera), SessionLocal (la
# "fabbrica" di sessioni del database, vedi db.py) e i modelli Article e Completion.
#
# Schema generale: ogni comando e' una funzione `async` che riceve una sessione
# `db`; main() legge il comando dalla riga di comando e chiama la funzione giusta.
# Questo file non duplica la logica: delega a sync, news e rag.
#
# Concetti chiave:
# - async/await: le operazioni che aspettano il database o la rete non bloccano
#   il programma. `await` vuol dire "aspetta che questa operazione finisca".
# - asyncio.run(): avvia il "motore" che esegue le funzioni async.
# - Type hint (es. `-> dict`, `tuple[int, int]`): dichiarano il tipo atteso di
#   argomenti e valore di ritorno. Python non li controlla a runtime; servono a
#   chi legge il codice e agli strumenti di analisi.
# ============================================================================

# Importa il modulo `argparse` della libreria standard: legge i comandi e gli
# argomenti da terminale.
import argparse

# Importa `asyncio` (libreria standard) per eseguire codice asincrono con asyncio.run().
import asyncio

# Importa `json` per convertire dati Python in testo JSON (backup) e viceversa (restore).
import json

# Importa `sys` per accedere allo standard input/output (stdin, stdout, stderr):
# serve a leggere/scrivere su pipe e redirezioni.
import sys

# Importa la classe `datetime` per lavorare con date e ore.
from datetime import datetime

# Importa `select`, il costruttore SQLAlchemy che crea una query SELECT (leggi righe).
from sqlalchemy import select

# Importa `insert` nella versione specifica di PostgreSQL: serve per
# INSERT ... ON CONFLICT (upsert).
from sqlalchemy.dialects.postgresql import insert

# Importa `AsyncSession`, il tipo della sessione asincrona del database (solo per il type hint).
from sqlalchemy.ext.asyncio import AsyncSession

# Importa i moduli del progetto: news (notizie), rag (ricerca per significato),
# sync (programma di studi).
from app import news, rag, sync

# Importa SessionLocal da db.py: la "fabbrica" che crea nuove sessioni verso il database.
from app.db import SessionLocal

# Importa i modelli (le tabelle del DB come classi): Article per le notizie,
# Completion per le spunte.
from app.models import Article, Completion

# Only what can't be rebuilt: roadmap rows come from ROADMAP.md, vectors from re-indexing.
# Una tupla (tuple, lista fissa e immutabile tra parentesi tonde) con i nomi dei campi
# dell'articolo da salvare nel backup. Tutto il resto si ricostruisce da solo.
ARTICLE_FIELDS = ("url", "title", "source", "excerpt", "published_at", "favorite_at", "ai_summary")


# `async def` = funzione asincrona. Riceve la sessione `db` e restituisce un dizionario (dict).
async def backup(db: AsyncSession) -> dict:
    # Legge TUTTE le spunte dalla tabella completions.
    # select(Completion) = "SELECT * FROM completions";
    # db.scalars(...) esegue la query e restituisce gli oggetti; .all() li mette in una lista.
    completions = (await db.scalars(select(Completion))).all()
    # Legge solo gli articoli preferiti: .where(...) aggiunge il filtro
    # WHERE favorite_at IS NOT NULL (cioe' la data di preferito e' impostata).
    # is_not(None) e' il modo SQLAlchemy per dire "non e' NULL".
    favorites = (await db.scalars(select(Article).where(Article.favorite_at.is_not(None)))).all()
    # Costruisce e restituisce il dizionario che diventera' il JSON del backup.
    return {
        # Chiave "completions": una lista di dizionari, uno per ogni spunta.
        "completions": [
            # Per ogni spunta salva l'id del sottocapitolo e la data convertita in testo ISO
            # (es. "2026-10-21T10:00:00+00:00"), perche' JSON non conosce le date.
            {"subchapter_id": c.subchapter_id, "completed_at": c.completed_at.isoformat()}
            # Comprehension: la forma compatta di "for c in completions: aggiungi alla lista".
            for c in completions
        ],
        # Chiave "favorites": lista di dizionari, uno per ogni articolo preferito.
        "favorites": [
            # Dizionario costruito con una comprehension annidata: per ogni campo f
            # in ARTICLE_FIELDS...
            {
                # ...il valore v e' l'attributo `a.f` dell'articolo. Se v e' una data (datetime) la
                # converte in testo ISO; altrimenti lo lascia com'e'.
                # `v := ...` (operatore walrus) assegna e usa il valore nella stessa espressione.
                f: v.isoformat() if isinstance(v := getattr(a, f), datetime) else v
                # getattr(a, f) legge l'attributo con nome f (es. a.title) senza scriverlo a mano.
                for f in ARTICLE_FIELDS
            }
            # ...e lo fa per ogni articolo preferito a.
            for a in favorites
        ],
    }


# Funzione inversa di backup: legge il dizionario `data` (il JSON caricato) e lo scrive nel DB.
# `-> tuple[int, int]` dichiara che restituisce una coppia di numeri interi
# (quante spunte e quanti preferiti).
async def restore(db: AsyncSession, data: dict) -> tuple[int, int]:
    """Upsert a backup; existing rows are kept, favorites are re-marked."""

    # Questa e' una funzione annidata (definita dentro un'altra funzione): esiste solo qui dentro.
    # Converte una stringa ISO in datetime; se la stringa e' vuota o None restituisce None.
    # `X if condizione else Y` e' l'operatore ternario: "X se la condizione e' vera, altrimenti Y".
    def dt(v: str | None) -> datetime | None:
        return datetime.fromisoformat(v) if v else None

    # Per ogni spunta salvata nel backup...
    for c in data["completions"]:
        # ...esegue un INSERT nel database.
        await db.execute(
            # insert(Completion): inizia un INSERT sulla tabella completions.
            # .values(...) indica i valori della nuova riga.
            insert(Completion)
            .values(subchapter_id=c["subchapter_id"], completed_at=dt(c["completed_at"]))
            # on_conflict_do_nothing(): se la riga esiste gia' (stessa chiave
            # primaria) non fa nulla.
            # Cosi' il ripristino non crea duplicati e non sovrascrive le spunte gia' presenti.
            .on_conflict_do_nothing()
        )
    # Per ogni articolo preferito nel backup...
    for a in data["favorites"]:
        # Costruisce il dizionario della riga: prende i campi di ARTICLE_FIELDS dal backup
        # (a.get(f) restituisce None se il campo manca, invece di dare errore)...
        # ...e l'operatore `|` unisce due dizionari, aggiungendo/sovrascrivendo
        # le due date convertite.
        row = {f: a.get(f) for f in ARTICLE_FIELDS} | {
            "published_at": dt(a.get("published_at")),
            "favorite_at": dt(a["favorite_at"]),
        }
        # Inserisce l'articolo nella tabella articles...
        await db.execute(
            insert(Article)
            .values(**row)
            # ...ma se l'URL esiste gia' (index_elements=["url"]: la colonna
            # univoca) non lo duplica:
            # aggiorna solo la data favorite_at. set_ dice quali colonne aggiornare in quel caso.
            # Questo e' l'"upsert" (update + insert): aggiorna se esiste, inserisce se no.
            .on_conflict_do_update(index_elements=["url"], set_={"favorite_at": row["favorite_at"]})
        )
    # Salva tutte le modifiche in una sola transazione: o si salva tutto, o nulla.
    await db.commit()
    # Restituisce i conteggi, che main() stampa a video.
    return len(data["completions"]), len(data["favorites"])


# Punto di ingresso: legge il comando scritto dopo `python -m app.cli` ed esegue la funzione giusta.
async def main() -> None:
    # Crea il "parser": il lettore degli argomenti da riga di comando.
    # prog= e' il nome mostrato nell'aiuto (--help).
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    # Crea i "sottocomandi" (subparsers): ognuno e' un comando diverso (es. backup, restore).
    # dest="cmd" salva il nome scelto in args.cmd; required=True obbliga a sceglierne uno.
    sub = parser.add_subparsers(dest="cmd", required=True)
    # Registra i comandi semplici, che non hanno argomenti. Il ciclo for scorre la tupla di nomi.
    for name in ("sync-roadmap", "index-sources", "refresh-news", "backup", "restore"):
        sub.add_parser(name)
    # Comando index-text: ha tre argomenti obbligatori (posizionali, senza --) e il testo di aiuto.
    it = sub.add_parser("index-text", help="index a text directly (seeding, tests)")
    it.add_argument("url")
    it.add_argument("title")
    it.add_argument("text")
    # Opzione facoltativa --kind: default "source" e accetta solo i valori della lista choices.
    it.add_argument("--kind", default="source", choices=["source", "article"])
    # Opzione facoltativa --session: nessun default, quindi vale None se non la si scrive.
    it.add_argument("--session")
    # Comando add-article (il nome "aa" e' solo una variabile locale per il sottocomando).
    aa = sub.add_parser("add-article", help="insert a news article by hand (seeding, tests)")
    aa.add_argument("url")
    aa.add_argument("title")
    aa.add_argument("source")
    # Opzione --excerpt con default stringa vuota.
    aa.add_argument("--excerpt", default="")
    # Legge davvero la riga di comando: args.cmd contiene il nome del comando,
    # args.url ecc. gli argomenti.
    # Se l'utente sbaglia, argparse stampa l'errore e chiude il programma da solo.
    args = parser.parse_args()

    # Apre una sessione verso il DB. `async with` la chiude automaticamente alla fine del blocco,
    # anche in caso di errore. SessionLocal() crea una nuova sessione dalla "fabbrica" in db.py.
    async with SessionLocal() as db:
        # match/case (Python 3.10+): confronta args.cmd con ogni caso, come uno
        # switch in altri linguaggi.
        match args.cmd:
            # Ogni case chiama la funzione corrispondente e stampa un riepilogo.
            # print(f"...") stampa su schermo; l'f-string inserisce il risultato
            # dentro le graffe {...}.
            case "sync-roadmap":
                print(f"{await sync.sync_roadmap(db)} sessions")
            case "index-sources":
                print(f"{await sync.index_sources(db)} changed pages indexed")
            case "refresh-news":
                print(f"{await news.refresh_news(db)} new articles")
            # backup: scrive il JSON direttamente su stdout, cosi' il comando si puo' redirigere
            # con `> backup.json`. indent=2 rende il file leggibile (rientrato di 2 spazi).
            case "backup":
                json.dump(await backup(db), sys.stdout, indent=2)
            # restore: legge il JSON da stdin (il contenuto del file reindirizzato con `<`).
            # Il riepilogo va su stderr (canale per i messaggi), non su stdout, per non
            # mescolarlo con eventuali dati.
            case "restore":
                done, favs = await restore(db, json.load(sys.stdin))
                print(f"restored {done} completions, {favs} favorites", file=sys.stderr)
            # index-text: passa gli argomenti alla funzione per nome
            # (url=args.url ecc.), cosi' l'ordine non conta.
            # Restituisce True se il testo e' cambiato dall'ultima volta,
            # False se era gia' indicizzato.
            case "index-text":
                changed = await rag.index_text(
                    db,
                    url=args.url,
                    title=args.title,
                    text=args.text,
                    kind=args.kind,
                    session_id=args.session,
                )
                # Operatore ternario: stampa "indexed" se changed e' True, altrimenti "unchanged".
                print("indexed" if changed else "unchanged")
            # add-article: inserisce a mano una notizia nella tabella articles.
            case "add-article":
                await db.execute(
                    insert(Article)
                    .values(
                        url=args.url, title=args.title, source=args.source, excerpt=args.excerpt
                    )
                    # Se l'URL esiste gia' non fa nulla (nessun duplicato).
                    .on_conflict_do_nothing(index_elements=["url"])
                )
                # Salva l'inserimento nel database.
                await db.commit()
                # Poi indicizza il titolo e il riassunto per la ricerca del tutor
                # (vedi news.index_article).
                await news.index_article(db, args.url, args.title, args.excerpt)
                print("added")


# Questo blocco esegue main() solo quando il file parte direttamente (es. con `python -m app.cli`),
# NON quando viene importato da un altro file (es. dai test).
# __name__ vale "__main__" solo in quel caso.
if __name__ == "__main__":
    # asyncio.run() avvia il motore asincrono ed esegue la funzione main() fino alla fine.
    asyncio.run(main())
