"""Retrieval-augmented generation: fetch → extract → chunk → embed → store → retrieve."""

# ============================================================================
# COSA FA QUESTO FILE
# ============================================================================
# RAG = Retrieval-Augmented Generation ("generazione aumentata dal recupero").
# Prima che il tutor risponda, cerca nei testi (fonti delle sessioni e articoli)
# i pezzi più pertinenti alla domanda, e li passa al modello di linguaggio (LLM)
# come contesto. Così la risposta si basa su testi veri e può citarli.
#
# La pipeline, in ordine:
#   1. fetch    -> scarica la pagina web                  (fetch_text)
#   2. extract  -> tiene solo il testo utile, con trafilatura (fetch_text)
#   3. chunk    -> spezza il testo in pezzi               (chunk_text)
#   4. embed    -> trasforma ogni pezzo in un vettore di numeri
#                  che ne rappresenta il significato      (get_embedder)
#   5. store    -> salva documenti e pezzi in Postgres con pgvector (index_text)
#   6. retrieve -> trova i pezzi con vettore più vicino a quello della domanda (retrieve)
#
# ============================================================================
# DOVE SI COLLEGA NEL PROGETTO
# ============================================================================
# - app/sync.py: indicizza fonti e lezioni delle sessioni (index_text, index_url).
# - app/news.py: indicizza gli articoli di notizie (index_text).
# - app/cli.py: comandi da terminale "index-sources" e "refresh-news".
# - app/routes/articles.py: aggiunge un articolo e ne legge il testo (fetch_text).
# - app/routes/ai.py: il tutor (retrieve + build_context) e "chiedi alla reading list".
# - app/models.py: definisce le tabelle Document e Chunk che questo file usa.
# - app/llm.py: fornisce get_embedder(), che calcola i vettori (Ollama, Anthropic, fake nei test).
# - tests/test_rag.py e tests/test_api.py: test che usano queste funzioni.
#
# ============================================================================
# CONCETTI PYTHON USATI QUI
# ============================================================================
# - import: porta dentro il file il codice di altri moduli. "from x import y" prende solo y.
# - async / await: funzioni "asincrone". Quando aspettano una operazione lenta (rete, DB)
#   lasciano lavorare altro invece di bloccare il server.
#   Docs: https://docs.python.org/3.12/library/asyncio.html
# - type hint (es. `str | None`, `list[str]`): dichiarano il tipo atteso. Python non li
#   controlla a runtime, ma aiutano l'editor e strumenti come ruff.
#   Docs: https://docs.python.org/3.12/library/typing.html
# - @dataclass: decoratore che genera una classe "contenitore di dati" (vedi Hit).
#   Docs: https://docs.python.org/3.12/library/dataclasses.html
# - SQLAlchemy async (AsyncSession): parla con il database senza bloccare.
#   Docs: https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html
# - pgvector: estensione di Postgres che sa confrontare vettori (cosine_distance).
#   Docs: https://github.com/pgvector/pgvector-python
# - Nota: nelle funzioni chunk_text e index_text il parametro `text` "nasconde"
#   la funzione text() di SQLAlchemy importata qui sotto. Non è un problema, perché
#   dentro quelle funzioni la funzione text() non viene usata.

# Moduli della libreria standard di Python (già inclusi, non serve installarli).
# asyncio: strumenti per il codice asincrono; qui serve per to_thread (vedi fetch_text).
import asyncio

# hashlib: calcola impronte (hash) del testo, per capire se è cambiato.
import hashlib

# logging: scrive messaggi nel log (info, warning) invece di usare print.
import logging

# dataclass: decoratore per classi "contenitore di dati".
from dataclasses import dataclass

# urlparse: scompone un URL nei suoi pezzi (schema, dominio, percorso...).
from urllib.parse import urlparse

# RobotFileParser: legge il file robots.txt con cui un sito dice ai bot cosa possono visitare.
from urllib.robotparser import RobotFileParser

# Librerie esterne, installate tramite pyproject.toml.
# httpx: client HTTP asincrono per scaricare pagine web.
import httpx

# trafilatura: estrae il testo "pulito" da una pagina HTML (toglie menu, pubblicità, ecc.).
import trafilatura

# delete, select, text: costruttori di query SQL in stile Python.
# delete = DELETE, select = SELECT, text = SQL scritto a mano come stringa.
from sqlalchemy import delete, select, text

# AsyncSession: la sessione del database usata con async/await.
from sqlalchemy.ext.asyncio import AsyncSession

# Import dal progetto stesso (la cartella app/ è un "pacchetto").
# get_embedder: restituisce il motore che trasforma testo in vettori.
from app.llm import get_embedder

# Chunk e Document: classi che rappresentano le tabelle del database.
from app.models import Chunk, Document

# Logger legato a questo modulo; __name__ vale "app.rag", utile per capire da dove arriva un
# messaggio.
log = logging.getLogger(__name__)
# Nome con cui il nostro bot si presenta ai siti quando scarica le pagine.
USER_AGENT = "YouCanDoIt-StudyBot/0.1 (personal learning app)"
# Dimensione di ogni pezzo in parole. 600 parole circa 800 token (l'unità con cui ragiona l'LLM).
CHUNK_WORDS = 600  # ≈ 800 tokens
# Parole ripetute tra un pezzo e il successivo: un concetto spezzato a metà non si perde.
OVERLAP_WORDS = 80


# Un "risultato di ricerca": un pezzo di testo trovato, con la sua fonte e quanto è simile alla
# domanda.
# @dataclass genera da solo il costruttore __init__ e altre utilità per la classe.
@dataclass
class Hit:
    # Indirizzo della pagina da cui arriva il pezzo (serve per le citazioni).
    url: str
    # Titolo della pagina.
    title: str
    # Il testo del pezzo trovato.
    text: str
    # Distanza coseno dalla domanda: più è piccola, più il significato è simile.
    distance: float


# Spezza un testo lungo in pezzi di `size` parole, con `overlap` parole in comune tra un pezzo e il
# successivo.
# I valori di default vengono dalle costanti in cima al file.
def chunk_text(text: str, size: int = CHUNK_WORDS, overlap: int = OVERLAP_WORDS) -> list[str]:
    # split() senza argomenti divide il testo su qualsiasi spazio o a capo: ottieni una lista di
    # parole.
    words = text.split()
    # Testo vuoto (nessuna parola): nessun pezzo da restituire.
    if not words:
        return []
    # Quante parole "nuove" aggiungere a ogni giro. Es. 600 - 80 = 520.
    step = size - overlap
    # range(inizio, fine, passo) produce gli indici di partenza dei pezzi: 0, 520, 1040...
    # max(..., 1) garantisce almeno un giro, anche per testi più corti dell'overlap.
    # words[i : i + size] prende le parole da i fino a i+size (esclusa); " ".join le riunisce in una
    # stringa.
    return [" ".join(words[i : i + size]) for i in range(0, max(len(words) - overlap, 1), step)]


# Cache in memoria: per ogni sito (origin) salva il robots.txt già letto, così non lo riscarichiamo.
# Il "_" all'inizio del nome segnala che è un dettaglio interno a questo file.
# dict[str, RobotFileParser] = dizionario con chiavi stringa e valori RobotFileParser.
_robots: dict[str, RobotFileParser] = {}


# Controlla se il robots.txt del sito permette al nostro bot di visitare `url`. Restituisce True o
# False.
async def _allowed(client: httpx.AsyncClient, url: str) -> bool:
    # urlparse scompone l'URL; teniamo solo "https://dominio" (scheme + netloc), che identifica il
    # sito.
    origin = "{0.scheme}://{0.netloc}".format(urlparse(url))
    # Se il sito non è ancora in cache, scarichiamo e leggiamo il suo robots.txt.
    if origin not in _robots:
        # Crea il "lettore" di robots.txt.
        rp = RobotFileParser()
        try:
            # Scarica /robots.txt del sito; await aspetta la risposta senza bloccare il server.
            r = await client.get(f"{origin}/robots.txt")
            # Se il file esiste (status 200) lo leggiamo riga per riga; altrimenti lo consideriamo
            # vuoto (tutto permesso).
            rp.parse(r.text.splitlines() if r.status_code == 200 else [])
        except httpx.HTTPError:
            # Errore di rete: nessun robots.txt disponibile, quindi trattiamo tutto come permesso.
            rp.parse([])
        # Salva in cache per le prossime richieste allo stesso sito.
        _robots[origin] = rp
    # can_fetch risponde: il nostro USER_AGENT può visitare questo url secondo le regole?
    return _robots[origin].can_fetch(USER_AGENT, url)


# Scarica una pagina e restituisce il suo testo pulito, oppure None se non è possibile leggerla.
# Il tipo di ritorno "str | None" significa: una stringa oppure None.
async def fetch_text(url: str) -> str | None:
    # AsyncClient è un client HTTP asincrono. "async with" lo apre e lo chiude in automatico (come
    # with per i file).
    # timeout=30: massimo 30 secondi di attesa; follow_redirects: segue i reindirizzamenti;
    # headers: manda il nostro User-Agent.
    async with httpx.AsyncClient(
        timeout=30, follow_redirects=True, headers={"User-Agent": USER_AGENT}
    ) as client:
        # Rispettiamo robots.txt: se il sito vieta la pagina, usciamo senza scaricarla.
        if not await _allowed(client, url):
            # log.info scrive un messaggio informativo (non è un errore).
            log.info("robots.txt disallows %s", url)
            # None = "nessun testo disponibile".
            return None
        # Scarica la pagina vera e propria.
        r = await client.get(url)
        # Se lo stato HTTP è un errore (404, 500...), solleva un'eccezione httpx.HTTPStatusError.
        r.raise_for_status()
    # Qui il client è già chiuso. Saltiamo i PDF: headers.get legge il tipo di contenuto (default
    # "").
    if "pdf" in r.headers.get("content-type", ""):
        return None  # shortcut: PDFs skipped, add pypdf extraction if sources need it
    # CPU-heavy: run off the event loop so requests aren't blocked while a page is parsed
    return await asyncio.to_thread(trafilatura.extract, r.text, url=url)


# Salva un testo nel database, spezzato in chunk con i relativi vettori. Il "*" nella firma
# obbliga a passare db, url, title, ecc. con il nome (es. kind="source"), non per posizione.
# AsyncSession è la "sessione" con cui parliamo al database (vedi get_db in app/db.py).
async def index_text(
    db: AsyncSession, *, url: str, title: str, text: str, kind: str, session_id: str | None = None
) -> bool:
    """Store `text` as chunks for `url`. Returns False if unchanged since last index."""
    # Impronta SHA-256 del testo: stringa di 64 caratteri che cambia se anche una sola lettera
    # cambia.
    # text.encode() converte la stringa in byte, che è ciò che l'algoritmo di hash richiede.
    digest = hashlib.sha256(text.encode()).hexdigest()
    # Cerca nel database un documento con questo URL. scalar() restituisce il primo risultato, o
    # None.
    doc = await db.scalar(select(Document).where(Document.url == url))
    # Il documento esiste già e il testo è identico: non c'è nulla da fare, restituiamo False.
    if doc and doc.content_hash == digest:
        return False
    # Spezza il testo in pezzi (vedi chunk_text).
    chunks = chunk_text(text)
    # Nessun pezzo (testo vuoto): non c'è niente da salvare.
    if not chunks:
        return False
    # Calcola un vettore per ogni pezzo. get_embedder() ottiene il motore di embedding;
    # embed riceve una lista di testi e restituisce una lista di vettori, nello stesso ordine.
    # È un'operazione lenta (chiama un servizio esterno), quindi usiamo await.
    vectors = await get_embedder().embed(chunks)
    # Il documento esiste ma il contenuto è cambiato: cancelliamo i vecchi pezzi e aggiorniamo i
    # campi.
    if doc:
        # DELETE di tutti i Chunk collegati a questo documento.
        await db.execute(delete(Chunk).where(Chunk.document_id == doc.id))
        # Aggiorniamo l'impronta, il titolo e la sessione. SQLAlchemy tiene traccia delle modifiche
        # e le salverà al commit. (A destra, la tupla di valori viene assegnata a sinistra in
        # ordine.)
        doc.content_hash, doc.title, doc.session_id = digest, title, session_id
    # Documento nuovo: lo creiamo e lo registriamo nella sessione con db.add.
    else:
        doc = Document(url=url, title=title, kind=kind, session_id=session_id, content_hash=digest)
        db.add(doc)
        # flush invia la INSERT al database senza chiudere la transazione: così il DB assegna
        # un id al documento, che ci serve subito per collegarci i chunk.
        await db.flush()
    # Aggiunge in blocco tutti i Chunk. Il generatore crea un Chunk per ogni coppia (testo,
    # vettore):
    # enumerate dà la posizione i (0, 1, 2...), zip accoppia pezzi e vettori;
    # strict=True solleva un errore se le due liste hanno lunghezze diverse.
    db.add_all(
        Chunk(document_id=doc.id, position=i, text=t, embedding=v)
        for i, (t, v) in enumerate(zip(chunks, vectors, strict=True))
    )
    # Salva tutto in modo definitivo. È una transazione: o si salva tutto, o nulla.
    await db.commit()
    # True = il documento è stato (ri)indicizzato.
    return True


# Scarica una pagina e la indicizza. È la "colla" tra fetch_text e index_text.
async def index_url(
    db: AsyncSession, *, url: str, title: str, kind: str, session_id: str | None = None
) -> bool:
    # try/except: proviamo a scaricare; se la rete fallisce, registriamo un avviso e
    # restituiamo False invece di far crashare la richiesta.
    try:
        text = await fetch_text(url)
    # "as e" dà un nome (e) all'errore, così lo possiamo scrivere nel log.
    except httpx.HTTPError as e:
        log.warning("could not fetch %s: %s", url, e)
        return False
    # Nessun testo (PDF, robots.txt che vieta, pagina vuota): non c'è nulla da indicizzare.
    if not text:
        return False
    # Passa il testo all'indicizzazione vera e propria e restituisce il suo risultato (True/False).
    return await index_text(db, url=url, title=title, text=text, kind=kind, session_id=session_id)


# Cerca i pezzi di testo più pertinenti a una domanda (query). È il cuore del "retrieval".
# k=6: quanti risultati al massimo. kind e session_id sono filtri opzionali.
async def retrieve(
    db: AsyncSession,
    query: str,
    *,
    k: int = 6,
    kind: str | None = None,
    session_id: str | None = None,
) -> list[Hit]:
    # Trasforma la domanda in un vettore con lo stesso modello usato per i testi:
    # solo così il confronto ha senso. [qv] = ... è "unpacking": la lista ha un solo elemento, che
    # prendiamo.
    [qv] = await get_embedder().embed([query])
    # Per ogni chunk calcoliamo la distanza coseno tra il suo vettore e quello della domanda.
    # label("distance") dà il nome "distance" alla colonna nel risultato.
    distance = Chunk.embedding.cosine_distance(qv).label("distance")
    # SELECT del testo del pezzo, dell'URL e del titolo del documento, più la distanza.
    # join(Document) unisce ogni chunk con il suo documento (chunks.document_id = documents.id).
    stmt = select(Chunk.text, Document.url, Document.title, distance).join(Document)
    # Filtro opzionale: solo fonti ("source") oppure solo articoli ("article").
    if kind:
        stmt = stmt.where(Document.kind == kind)
    # Filtro opzionale: solo i documenti di una certa sessione.
    if session_id:
        stmt = stmt.where(Document.session_id == session_id)
    if kind or session_id:
        # HNSW filters after its candidate scan; keep scanning until k filtered rows are found
        # Con un filtro, l'indice HNSW (ricerca veloce ma approssimata) potrebbe trovare pochi
        # risultati.
        # Questo comando dice a pgvector di continuare a cercare finché non ne trova abbastanza.
        # SET LOCAL vale solo per questa transazione, non per tutto il database.
        await db.execute(text("SET LOCAL hnsw.iterative_scan = relaxed_order"))
    # Ordina per distanza crescente (i più simili arrivano primi) e prende solo i primi k.
    rows = await db.execute(stmt.order_by(distance).limit(k))
    # Ogni riga del database diventa un Hit. Le variabili tx, u, t, d seguono l'ordine delle colonne
    # nella select: testo, url, titolo, distanza.
    return [Hit(url=u, title=t, text=tx, distance=d) for tx, u, t, d in rows]


# Prepara il contesto per l'LLM: un testo numerato da mettere nel prompt, e l'elenco delle citazioni
# per l'interfaccia.
# Il tipo "tuple[str, list[dict]]" significa: la funzione restituisce due valori insieme.
def build_context(hits: list[Hit]) -> tuple[str, list[dict]]:
    """Numbered context block for the prompt + the citation list for the UI (one per URL)."""
    # Dizionario URL -> numero di citazione. Ogni pagina avrà un numero unico: [1], [2], [3]...
    numbers: dict[str, int] = {}
    # Lista dei blocchetti di testo che andranno nel prompt.
    parts = []
    # Per ogni pezzo trovato...
    for h in hits:
        # setdefault: se l'URL non è ancora in dizionario, lo aggiunge con il numero successivo (len
        # + 1);
        # se c'è già, restituisce il numero assegnato prima. Così più pezzi della stessa pagina
        # condividono il numero.
        n = numbers.setdefault(h.url, len(numbers) + 1)
        # Aggiunge un blocco come "[1] Titolo della pagina" seguito dal testo del pezzo.
        # Il modello userà il numero [1] per citare la fonte nella risposta.
        parts.append(f"[{n}] {h.title}\n{h.text}")
    # Lista di citazioni per l'interfaccia, una per URL. Nella comprensione di lista:
    # for u, n in numbers.items() scorre le coppie (URL, numero); next(...) prende il primo titolo
    # trovato per quell'URL.
    citations = [
        {"n": n, "url": u, "title": next(h.title for h in hits if h.url == u)}
        for u, n in numbers.items()
    ]
    # Unisce i blocchi di testo con una riga vuota tra l'uno e l'altro e restituisce due valori:
    # testo e citazioni.
    return "\n\n".join(parts), citations
