"""Daily news: fetch RSS/Atom feeds from content/feeds.yaml, dedupe by URL, keep 30 days
(favorites are kept forever), and index new articles into RAG."""

# ---------------------------------------------------------------------------
# news.py: la sezione "Notizie" dell'app.
#
# RUOLO: scarica le notizie da una lista di siti (content/feeds.yaml), le salva
# nella tabella "articles" del database e le indicizza nel motore RAG, così il
# tutor può cercarle. È l'unico file che parla con i feed esterni.
#
# CHI LO USA:
# - app/main.py: lo esegue ogni giorno alle 07:00 (job pianificato con APScheduler)
#   e una volta al primo avvio del server (_first_run).
# - app/routes/articles.py: l'endpoint POST /articles/refresh chiama refresh_news
#   quando l'utente preme "aggiorna" nell'interfaccia.
# - app/cli.py: i comandi "refresh-news" e "add-article" (che usa index_article).
# - tests/test_news.py: verifica parse_feed con un feed RSS finto.
#
# FLUSSO: load_feeds (legge la lista) -> _fetch (scarica tutti i feed insieme)
#   -> parse_feed (XML -> dizionari Python) -> insert nel DB -> pulizia dei vecchi
#   -> index_article (invio al RAG).
#
# CONCETTI PYTHON/FASTAPI USATI (versioni indicative: in apps/api/pyproject.toml
# trovo FastAPI>=0.115, SQLAlchemy>=2.0.36, Python>=3.12; non ho trovato un
# lock file nell'API, quindi la versione esatta installata non è verificabile):
# - async / await: "async def" dichiara una funzione che può aspettare operazioni
#   lente (rete, DB) senza bloccare il server. "await" aspetta il risultato.
#   Doc: https://docs.python.org/3/library/asyncio.html
# - httpx.AsyncClient: client HTTP asincrono per scaricare le pagine.
#   Doc: https://www.python-httpx.org/async/
# - asyncio.gather e asyncio.to_thread: avviare più attese in parallelo;
#   eseguire in un thread separato il codice che non è async (il parsing XML).
# - SQLAlchemy 2.0 async (AsyncSession): si scrive il SQL con funzioni Python
#   (select, insert, delete) e lo si esegue con "await db.execute(...)".
#   Doc: https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html
# - Type hint (es. list[dict], str | None): dichiarano il tipo atteso. Python non
#   li verifica a runtime, ma aiutano l'editor e il linter (ruff).
# - "from app import rag": importa un modulo del nostro progetto (la cartella app/).
#   Il nome dopo "import" è il file, senza .py.
# ---------------------------------------------------------------------------

# Libreria standard: asyncio per le operazioni asincrone, logging per registrare messaggi.
import asyncio
import logging

# re: "regular expressions", ricerca e sostituzione di testo con schemi
# (usata per togliere i tag HTML).
import re

# Da datetime importiamo: UTC (fuso orario universale), datetime (data+ora)
# e timedelta (una durata, es. 30 giorni).
from datetime import UTC, datetime, timedelta

# mktime converte una data "struct_time" in un numero di secondi (vedi parse_feed).
from time import mktime

# Librerie esterne installate con pip/uv (elencate in pyproject.toml).
# feedparser legge feed RSS e Atom e li trasforma in oggetti Python facili da usare.
import feedparser

# httpx: client per fare richieste HTTP (come scaricare una pagina web).
import httpx

# yaml: legge file in formato YAML (il formato di content/feeds.yaml).
import yaml

# Dalla libreria SQLAlchemy importiamo le funzioni per costruire query SQL in modo Python.
from sqlalchemy import delete, func, literal_column, select

# insert "specifico per PostgreSQL": serve per la clausola ON CONFLICT (upsert, vedi refresh_news).
from sqlalchemy.dialects.postgresql import insert

# AsyncSession: la "sessione" con il database usata con await
# (una connessione aperta per una serie di operazioni).
from sqlalchemy.ext.asyncio import AsyncSession

# Moduli interni del progetto.
# rag: il motore che spezza i testi, li trasforma in vettori e li cerca.
from app import rag

# settings: la configurazione letta dalle variabili d'ambiente
# (es. il percorso della cartella content).
from app.config import settings

# Le tabelle del DB come classi Python: Article (notizie) e Document (testi per il RAG).
from app.models import Article, Document

# Il logger registra messaggi (es. "feed X fallito"); __name__ è il nome di questo modulo,
# così nei log si capisce da dove arriva.
log = logging.getLogger(__name__)
# Giorni di conservazione: le notizie più vecchie vengono cancellate (tranne i preferiti).
KEEP_DAYS = 30
# Quante notizie prendere al massimo da ogni feed
# (evita che un sito molto prolifico domini la lista).
PER_FEED = 15


# Legge content/feeds.yaml e restituisce la lista dei feed
# (ogni feed è un dizionario con "name" e "url").
# "-> list[dict]" è il tipo restituito: una lista di dizionari.
def load_feeds() -> list[dict]:
    # settings.content_dir è un percorso (Path); "/" lo unisce al nome del file.
    # read_text() legge tutto il file come testo; yaml.safe_load lo trasforma in dati Python.
    # ["feeds"] prende la chiave "feeds" del file YAML (la lista sotto la voce "feeds:").
    return yaml.safe_load((settings.content_dir / "feeds.yaml").read_text())["feeds"]


# Funzione "privata": il nome inizia con _ per convenzione (non va usata da altri file).
# Toglie i tag HTML (es. <p>, <b>) da un testo e normalizza gli spazi.
def _clean(html: str) -> str:
    # "html or ''": se il testo è None (manca), lo sostituisce con una stringa vuota.
    # Il primo re.sub sostituisce ogni <...> con uno spazio;
    # il secondo riduce ogni sequenza di spazi a uno solo.
    # .strip() toglie gli spazi all'inizio e alla fine;
    # [:500] tiene solo i primi 500 caratteri (lo slicing).
    # shortcut: il regex non è un vero parser HTML (non gestisce script/style o HTML malformato),
    # va bene per estratti brevi; upgrade a un parser come BeautifulSoup se compaiono testi sporchi.
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html or "")).strip()[:500]


#   "str | bytes": il parametro xml può essere testo o byte
#   (il contenuto grezzo della risposta HTTP).
#   "source" è il nome leggibile del feed (es. "GitHub Blog").
# Funzione "pura": dato lo stesso input restituisce sempre lo stesso output
# e non tocca il DB o la rete.
# Per questo è facile da testare (vedi tests/test_news.py).
def parse_feed(xml: str | bytes, source: str) -> list[dict]:
    """Pure: feed body → article dicts. Duplicate URLs inside one feed are dropped."""
    # Creiamo un "insieme" (set) per ricordare gli URL già visti,
    # e una lista vuota per gli articoli.
    # I set non ammettono duplicati e controllare "url in seen" è velocissimo.
    seen, items = set(), []
    # feedparser.parse legge l'XML; .entries è la lista degli articoli;
    # [:PER_FEED] ne prende al massimo 15.
    for e in feedparser.parse(xml).entries[:PER_FEED]:
        # e.get("link") legge il campo "link" senza andare in errore se manca
        # (restituisce None invece).
        url = e.get("link")
        # "continue" salta il giro del ciclo: articoli senza URL o con URL già visti
        # vengono ignorati.
        if not url or url in seen:
            continue
        # Segniamo l'URL come visto, così un eventuale duplicato successivo verrà saltato.
        seen.add(url)
        # Data di pubblicazione come "struct_time" (formato di feedparser).
        # Se manca "published", proviamo "updated"; "or" prende il primo valore vero.
        ts = e.get("published_parsed") or e.get("updated_parsed")
        # Aggiungiamo alla lista un dizionario con i campi che ci servono (chiave: valore).
        # nota: mktime tratta la data come ora LOCALE, mentre feedparser la dà in UTC;
        # in Docker (fuso UTC) non cambia nulla, ma su un PC italiano le date sarebbero
        # spostate di 1-2 ore. Da sistemare con calendar.timegm se serve.
        items.append(
            {
                # l'indirizzo dell'articolo: è la chiave unica con cui lo riconosciamo nel DB
                "url": url,
                # il titolo pulito e tagliato a 500 caratteri (come String(500) in models.py);
                # se manca usiamo l'URL
                "title": _clean(e.get("title", url))[:500],
                # il nome del feed da cui arriva
                "source": source,
                # il riassunto ("summary") pulito dai tag HTML
                "excerpt": _clean(e.get("summary", "")),
                # "X if condizione else Y" è l'operatore ternario: converte la data in datetime
                # con fuso UTC, oppure None se non esiste
                "published_at": datetime.fromtimestamp(mktime(ts), UTC) if ts else None,
            }
        )
    # Restituisce la lista di tutti gli articoli validi raccolti dal feed.
    return items


# "async def": la funzione scarica il feed senza bloccare gli altri
# (vengono eseguite in parallelo da refresh_news).
# client: il client HTTP condiviso;
# feed: un dizionario {"name": ..., "url": ...} preso da feeds.yaml.
async def _fetch(client: httpx.AsyncClient, feed: dict) -> list[dict]:
    # try/except: proviamo il blocco; se succede un errore di rete, saltiamo nel blocco except
    # invece di far crollare tutto.
    try:
        # await client.get(...) invia la richiesta HTTP e aspetta la risposta
        # (senza bloccare gli altri feed).
        r = await client.get(feed["url"])
        # raise_for_status alza un errore se la risposta è 4xx o 5xx (es. 404 "non trovato").
        r.raise_for_status()
        # r.content sono i byte della risposta. to_thread esegue parse_feed in un thread separato,
        # così il parsing (lavoro della CPU) non blocca il server mentre gira.
        return await asyncio.to_thread(parse_feed, r.content, feed["name"])
    # httpx.HTTPError è la "famiglia" di errori HTTP di httpx:
    # copre sia errori di rete sia raise_for_status.
    except httpx.HTTPError as e:
        # log.warning scrive un avviso nei log (con i parametri %s sostituiti in ordine).
        log.warning("feed %s failed: %s", feed["name"], e)
        # Se un feed fallisce restituiamo una lista vuota:
        # così gli altri feed continuano a funzionare.
        return []


# Funzione principale del file: scarica tutti i feed, salva le novità, pulisce i vecchi e indicizza.
# db: la sessione del database (passata dal chiamante).
# "-> int" restituisce il numero di articoli nuovi.
async def refresh_news(db: AsyncSession) -> int:
    """Fetch all feeds; returns the number of new articles."""
    # "async with" apre il client HTTP e lo chiude automaticamente alla fine del blocco
    # (anche in caso di errore).
    # timeout=20: se un sito non risponde entro 20 secondi, si rinuncia;
    # follow_redirects: segue i reindirizzamenti (es. http -> https).
    # headers: si presenta con un "User-Agent" (il nome del nostro bot),
    # come fanno i browser e i crawler.
    async with httpx.AsyncClient(
        timeout=20, follow_redirects=True, headers={"User-Agent": rag.USER_AGENT}
    ) as client:
        # Scarichiamo tutti i feed contemporaneamente. "*(...)" passa i risultati
        # come argomenti separati a gather;
        # una "generator expression" (for f in load_feeds()) crea una coppia di attese,
        # una per feed.
        # gather aspetta che finiscano tutte e restituisce la lista dei risultati
        # (una lista per feed).
        batches = await asyncio.gather(*(_fetch(client, f) for f in load_feeds()))
    # Appiattiamo le liste di liste in un unico dizionario indicizzato per URL:
    # così se due feed hanno lo stesso articolo ne resta uno solo
    # (dict comprehension: {chiave: valore for ...}).
    # .values() prende i valori, list() li trasforma in lista.
    rows = list({a["url"]: a for batch in batches for a in batch}.values())
    # Contatore dei nuovi articoli, inizializzato a 0.
    new = 0
    # "if rows": eseguiamo l'INSERT solo se c'è almeno un articolo (un INSERT vuoto darebbe errore).
    if rows:
        # insert(Article).values(rows) prepara un INSERT con tutte le righe in una volta sola.
        stmt = insert(Article).values(rows)
        # still in a feed → keep it alive past the 30-day cutoff; xmax = 0 marks a fresh insert
        # Upsert = INSERT + UPDATE. on_conflict_do_update: se l'URL esiste già
        # (conflitto sulla colonna "url"), aggiorna solo fetched_at con l'ora attuale
        # (func.now()), così l'articolo non viene cancellato dopo 30 giorni.
        # returning(xmax = 0): PostgreSQL restituisce True per le righe inserite ex novo
        # e False per quelle aggiornate.
        result = await db.execute(
            stmt.on_conflict_do_update(
                index_elements=["url"], set_={"fetched_at": func.now()}
            ).returning(literal_column("xmax = 0"))
        )
        # Sommiamo i True: in Python True vale 1, quindi sum() conta quanti articoli sono nuovi.
        new = sum(result.scalars())
    # Data limite: "adesso" meno 30 giorni.
    # Gli articoli scaricati prima di questa data sono "vecchi".
    cutoff = datetime.now(UTC) - timedelta(days=KEEP_DAYS)
    # Cancelliamo gli articoli vecchi (fetched_at < cutoff) MA NON i preferiti
    # (favorite_at IS NULL = non è un preferito).
    # Article.fetched_at < cutoff e Article.favorite_at.is_(None) sono le condizioni
    # del WHERE (AND tra le due).
    await db.execute(
        delete(Article).where(Article.fetched_at < cutoff, Article.favorite_at.is_(None))
    )
    # Cancelliamo anche i Document di tipo "article" (i testi indicizzati per il RAG)
    # il cui URL non esiste più nella tabella articles.
    # not_in(select(...)) è un "NOT IN (sottoquery)": tiene solo i documenti
    # che non hanno più un articolo corrispondente.
    await db.execute(
        delete(Document).where(Document.kind == "article", Document.url.not_in(select(Article.url)))
    )
    # commit salva in modo definitivo tutte le modifiche fatte finora (insert, delete)
    # in un'unica transazione.
    # Se qualcosa fallisce prima di questo punto, il DB torna allo stato precedente
    # (rollback automatico).
    await db.commit()
    # index every article not indexed yet (self-heals if embeddings were down last time);
    # the excerpt is indexed now, the full text when the article is favorited
    # Selezioniamo gli articoli il cui URL non è ancora presente nella tabella documents
    # (cioè non ancora indicizzati).
    unindexed = select(Article).where(Article.url.not_in(select(Document.url)))
    # "for ... in await db.scalars(...)": ciclo su ogni articolo trovato;
    # scalars restituisce gli oggetti Article e non le righe grezze.
    for article in await db.scalars(unindexed):
        # Indicizziamo l'articolo nel RAG (spezza il testo, crea gli embedding, li salva).
        await index_article(db, article.url, article.title, article.excerpt)
    # Restituiamo il numero di articoli nuovi appena inseriti
    # (usato da routes/articles.py e cli.py).
    return new


# Indicizza un singolo articolo nel RAG. Restituisce True se è stato indicizzato,
# False se il contenuto non è cambiato dall'ultima volta.
# (Il "-> bool" è il tipo restituito.)
async def index_article(db: AsyncSession, url: str, title: str, excerpt: str) -> bool:
    # Un f-string (la f prima delle virgolette) inserisce le variabili dentro il testo con {...}.
    # Per ora indicizziamo solo titolo e riassunto;
    # il testo completo viene aggiunto quando l'articolo diventa preferito.
    text = f"{title}. {excerpt}"
    # Chiamiamo rag.index_text. Gli argomenti dopo "db" sono "keyword arguments"
    # (url=..., title=...): si scrivono col nome, così l'ordine non conta.
    # "kind" dice che è un articolo (non una fonte di sessione).
    return await rag.index_text(db, url=url, title=title, kind="article", text=text)
