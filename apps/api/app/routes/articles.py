# =====================================================================
# FILE: app/routes/articles.py : gli endpoint HTTP della "reading list" (pagina /news).
#
# RUOLO NELL'ARCHITETTURA
# Questo file è un "router": un gruppo di endpoint (URL + metodo HTTP) collegati
# tra loro. Ogni funzione decorata con @router.get / @router.post / @router.put /
# @router.delete risponde a una richiesta che arriva dal browser.
# Il browser non chiama mai questo file direttamente: chiama /api/articles, e
# app/api/[...path]/route.ts (lato Next.js) inoltra la richiesta a FastAPI (API_URL).
#
# COLLEGAMENTI CON IL RESTO DEL PROGETTO
# - app/main.py: importa questo modulo e registra il router con app.include_router
#   (nel ciclo "for r in (...)"). Senza quella riga gli endpoint non esisterebbero.
# - app/models.py: la classe Article rappresenta la tabella "articles" del database.
# - app/news.py: refresh_news scarica i feed RSS e salva le notizie nuove
#   (usata da POST /articles/refresh).
# - app/rag.py: index_url scarica il testo completo e lo indicizza per l'assistente
#   AI (ricerca semantica); fetch_text scarica il testo per il riassunto.
# - app/llm.py: get_llm() restituisce il provider AI (Ollama, Anthropic o un finto
#   provider nei test).
# - app/db.py: get_db fornisce una sessione del database per ogni richiesta;
#   SessionLocal crea una sessione a mano (serve in un task in background).
# - apps/web/lib/hooks.ts e app/news/page.tsx: il frontend chiama questi endpoint.
# - tests/test_api.py: verifica che PER_SOURCE limiti davvero le notizie per sorgente.
#
# CONCETTI DA CONOSCERE (Python / FastAPI)
# - Decoratori (@router.get("/percorso")): la riga sopra una funzione dice a
#   FastAPI "questa funzione risponde a questo URL e a questo metodo HTTP".
#   È simile a Route::get() in routes/web.php di Laravel.
# - Type hints (es. "limit: int", "-> list[Article]"): sono annotazioni sui tipi.
#   Python non le applica da solo, ma FastAPI le legge per validare l'input,
#   generare la documentazione (/docs) e creare i tipi TypeScript del frontend.
# - Dependency Injection: "db: AsyncSession = Depends(get_db)" chiede a FastAPI
#   di procurare la sessione del database e passarla alla funzione. Non la creiamo
#   a mano: viene "iniettata". È il concetto dietro il service container di Laravel.
# - response_model: dichiara la forma della risposta (es. ArticleOut), così dal
#   server esce solo ciò che è previsto, mai un campo interno per sbaglio.
# - async / await: le funzioni "async" possono mettersi in attesa (await) di
#   operazioni lente (database, rete) senza bloccare il server per gli altri utenti.
# - BackgroundTasks: lavoro che viene eseguito DOPO aver già risposto al browser.
# - SQLAlchemy 2.x: select(...), db.get(...), db.scalars(...) costruiscono ed
#   eseguono query SQL senza doverle scrivere come stringhe.
# - Pydantic: BaseModel definisce uno "schema" (forma dei dati) validato da Python.
#
# VERSIONI (dichiarazione onesta)
# Non ho trovato un file di lock (uv.lock) nel repo, quindi la versione esatta
# non è verificabile da qui. In apps/api/pyproject.toml ci sono i range:
# fastapi>=0.115, sqlalchemy[asyncio]>=2.0.36, httpx>=0.28 (pydantic arriva come
# dipendenza di FastAPI). Documentazione ufficiale:
# https://fastapi.tiangolo.com/ , https://docs.sqlalchemy.org/en/20/ ,
# https://docs.pydantic.dev/ , https://www.python-httpx.org/
# =====================================================================

from datetime import UTC, datetime

# httpx = client HTTP asincrono; ci serve per riconoscere gli errori di rete (httpx.HTTPError).
import httpx

# APIRouter: il "gruppo di endpoint". BackgroundTasks: lavoro in background.
# Depends: dependency injection. HTTPException: errore HTTP (es. 404).
# Query: regole sui parametri URL.
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query

# BaseModel: classe base dello schema Pydantic. ConfigDict: opzioni di configurazione dello schema.
from pydantic import BaseModel, ConfigDict

# func: funzioni SQL (es. row_number). select: costruisce una query SELECT.
from sqlalchemy import func, select

# AsyncSession: la sessione asincrona del database, tramite cui si eseguono le query.
from sqlalchemy.ext.asyncio import AsyncSession

# Importiamo i nostri moduli: news (feed RSS), rag (indicizzazione e ricerca nei testi).
from app import news, rag

# SessionLocal: la "fabbrica" di sessioni.
# get_db: dependency che fornisce una sessione per richiesta.
from app.db import SessionLocal, get_db

# get_llm: restituisce il provider del modello AI da usare.
from app.llm import get_llm

# La classe che rappresenta la tabella "articles".
from app.models import Article

# Creiamo il router. tags=["articles"] raggruppa questi endpoint sotto "articles"
# nella pagina /docs.
router = APIRouter(tags=["articles"])
# Costante: per convenzione Python, i nomi in MAIUSCOLO sono valori che non cambiano.
# newest N per source, so high-volume feeds (dev.to) don't crowd out the rest
PER_SOURCE = 5


# Schema di risposta: la "forma" dell'articolo che arriva al browser (come un contratto).
# Pydantic usa questa classe per costruire il JSON; i campi qui sotto sono quelli esposti.
class ArticleOut(BaseModel):
    # from_attributes=True: Pydantic può leggere i campi direttamente dall'oggetto Article
    # (es. article.title) invece che da un dizionario. In Pydantic v2 si chiama così.
    model_config = ConfigDict(from_attributes=True)
    # Campi: "nome: tipo". "X | None" significa che il valore può essere None
    # (NULL nel database). datetime = data e ora.
    id: int
    url: str
    title: str
    source: str
    excerpt: str
    published_at: datetime | None
    favorite_at: datetime | None
    ai_summary: str | None


# Funzione "di supporto": il _ iniziale è una convenzione Python che indica
# "uso interno a questo file".
# Cerca un articolo per id e lo restituisce, oppure risponde con errore 404.
async def _article(db: AsyncSession, article_id: int) -> Article:
    # db.get cerca per chiave primaria. Il := (operatore "walrus") assegna il risultato a "a" e lo
    # controlla nello stesso passo: se non esiste (None), il "not" rende la condizione vera.
    if not (a := await db.get(Article, article_id)):
        # 404 = Not Found. Sollevare (raise) l'eccezione interrompe la funzione e FastAPI
        # risponde al browser con {"detail": "Article not found"}.
        raise HTTPException(404, "Article not found")
    # Se l'articolo esiste, lo restituiamo al chiamante.
    return a


# Eseguita in background (vedi favorite più sotto). Riceve url e title, non una sessione:
# la sessione della richiesta si chiude appena la risposta parte, quindi ne apriamo una nuova.
async def _index_full_text(url: str, title: str) -> None:
    # async with apre la sessione e la chiude automaticamente alla fine del blocco.
    async with SessionLocal() as db:
        # rag.index_url scarica la pagina, la divide in pezzi (chunk), la trasforma in vettori
        # (embedding) e la salva nel database per la ricerca semantica.
        # kind="article" la marca come articolo.
        await rag.index_url(db, url=url, title=title, kind="article")


# GET /articles: la lista delle notizie.
# response_model=list[ArticleOut] = una lista di schemi ArticleOut.
@router.get("/articles", response_model=list[ArticleOut])
async def list_articles(
    # Parametri dell'URL (query string, es. /articles?favorites=true&limit=20).
    # favorites: bool = False -> se non lo passi vale False.
    # FastAPI converte "true"/"false" in booleano.
    favorites: bool = False,
    # Query(100, ge=1, le=200): default 100; ge = "greater or equal" (minimo 1),
    # le = "less or equal" (massimo 200).
    # Un valore fuori range fa rispondere FastAPI con errore 422
    # prima ancora di entrare nella funzione.
    limit: int = Query(100, ge=1, le=200),
    # Dependency injection: FastAPI chiama get_db e passa la sessione del database qui.
    db: AsyncSession = Depends(get_db),
    # -> list[Article]: tipo di ritorno dichiarato, una lista di oggetti Article.
) -> list[Article]:
    # select(Article) = "SELECT * FROM articles".
    # Per ora è solo una query preparata, non ancora eseguita.
    stmt = select(Article)
    # Ramo 1: la pagina dei preferiti.
    if favorites:
        # where(...IS NOT NULL) = solo gli articoli con una data di preferito.
        # order_by(... .desc()) = ordinati dal preferito più recente (desc = decrescente).
        stmt = stmt.where(Article.favorite_at.is_not(None)).order_by(Article.favorite_at.desc())
    # Ramo 2: la lista generale, con una regola anti-dominio di una sola sorgente.
    else:
        # Criteri di ordinamento: prima per data di pubblicazione dalla più recente
        # (nulls_last = le date mancanti finiscono in fondo), poi per id
        # per avere un ordine stabile in caso di parità.
        newest = (Article.published_at.desc().nulls_last(), Article.id.desc())
        # Window function: numera gli articoli dentro ogni sorgente (partition_by),
        # dal più recente (1) in giù.
        # Ogni sorgente ricomincia la numerazione da 1.
        rank = func.row_number().over(partition_by=Article.source, order_by=newest)
        # Sottoquery: una SELECT interna che produce coppie (id, rank) per tutti gli articoli.
        # label("rank") dà un nome alla colonna; subquery() la rende utilizzabile
        # dentro un'altra query.
        ranked = select(Article.id, rank.label("rank")).subquery()
        # JOIN: unisce la query principale alla sottoquery sull'id,
        # e tiene solo le righe con rank <= PER_SOURCE,
        # cioè le N più recenti di ciascuna sorgente. Poi ordina con gli stessi criteri "newest".
        stmt = (
            stmt.join(ranked, ranked.c.id == Article.id)
            .where(ranked.c.rank <= PER_SOURCE)
            .order_by(*newest)
        )
    # stmt.limit(limit) applica il tetto di righe;
    # await db.scalars(...) esegue la query e restituisce
    # gli oggetti Article (non tuple); list(...) li trasforma in una lista Python.
    return list(await db.scalars(stmt.limit(limit)))


# POST = azione che cambia dei dati: scarica le notizie nuove dai feed RSS.
# Nessun response_model: il dizionario viene convertito direttamente in JSON.
@router.post("/articles/refresh")
# dict[str, int]: dizionario con chiavi di testo e valori interi, es. {"new": 3}.
async def refresh(db: AsyncSession = Depends(get_db)) -> dict[str, int]:
    # news.refresh_news scarica e salva i nuovi articoli e restituisce quanti sono.
    return {"new": await news.refresh_news(db)}


# PUT su /articles/{article_id}/favorite: {article_id} nel percorso è un "path parameter",
# FastAPI lo legge dall'URL e lo converte in int. PUT = "imposta lo stato a questo valore".
@router.put("/articles/{article_id}/favorite", response_model=ArticleOut)
async def favorite(
    # tasks: BackgroundTasks è iniettato da FastAPI;
    # serve per accodare lavoro da fare dopo la risposta.
    article_id: int,
    tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> Article:
    # Recupera l'articolo (o risponde 404 tramite _article).
    a = await _article(db, article_id)
    # not a.favorite_at: entra solo se non è ancora un preferito. Così non sovrascriviamo
    # la data con cui è stato messo tra i preferiti la prima volta.
    if not a.favorite_at:
        # Salva data e ora attuali in UTC.
        a.favorite_at = datetime.now(UTC)
        # commit scrive la modifica nel database. Senza commit resterebbe solo in memoria.
        await db.commit()
        # Accoda _index_full_text: viene eseguita dopo la risposta, così l'utente non aspetta
        # il download e l'indicizzazione (che possono essere lenti).
        tasks.add_task(_index_full_text, a.url, a.title)
    # Restituisce l'articolo aggiornato (lo schema ArticleOut lo ripulisce dei campi interni).
    return a


# DELETE sullo stesso percorso: rimuove il preferito. Non cancella l'articolo.
@router.delete("/articles/{article_id}/favorite", response_model=ArticleOut)
async def unfavorite(article_id: int, db: AsyncSession = Depends(get_db)) -> Article:
    # Recupera l'articolo (o 404).
    a = await _article(db, article_id)
    # Togliere il preferito = impostare la data a None (NULL nel database).
    a.favorite_at = None
    # Salva la modifica.
    await db.commit()
    # Restituisce l'articolo aggiornato.
    return a


# POST su /articles/{id}/summary: genera un riassunto con l'AI. È un POST perché crea un dato nuovo
# e ha un costo (chiamata al modello).
@router.post("/articles/{article_id}/summary", response_model=ArticleOut)
async def summarize(article_id: int, db: AsyncSession = Depends(get_db)) -> Article:
    # Recupera l'articolo (o 404).
    a = await _article(db, article_id)
    # Cache: se il riassunto esiste già non richiamiamo l'AI (più veloce e senza costi).
    # not a.ai_summary è True sia se è None sia se è una stringa vuota.
    if not a.ai_summary:
        # try: prova un'operazione che potrebbe fallire, e gestisce l'errore nel blocco except.
        try:
            # rag.fetch_text scarica e pulisce il testo completo della pagina.
            # "or a.excerpt": se il risultato è None o vuoto, usa l'estratto breve.
            text = await rag.fetch_text(a.url) or a.excerpt
        # except httpx.HTTPError: se il download fallisce (rete, timeout, sito giù)
        # non blocchiamo tutto.
        except httpx.HTTPError:
            # Ripiego: usiamo solo l'estratto che abbiamo già nel database.
            text = a.excerpt
        # get_llm().chat(system, messages): il primo argomento è il "system prompt"
        # (le istruzioni per il modello),
        # il secondo è la conversazione (qui un solo messaggio dell'utente con titolo e testo).
        # Il provider può essere Ollama, Anthropic o finto nei test (vedi app/llm.py).
        a.ai_summary = await get_llm().chat(
            # Prompt di sistema: chiede 3-5 punti elenco e una riga "Why it matters:".
            # Le istruzioni sono in inglese e chiedono risposte in inglese (scelta del progetto).
            "You summarize technical articles for a junior developer studying to become a "
            "senior engineer. Write 3-5 short bullet points, then one line 'Why it matters:'. "
            "Always answer in English.",
            # Messaggio utente: titolo + testo. text[:12000] è uno "slice":
            # prende solo i primi 12000 caratteri, per non superare il limite
            # di contesto del modello.
            [{"role": "user", "content": f"Title: {a.title}\n\n{text[:12000]}"}],
        )
        # Salva il riassunto nel database.
        await db.commit()
    # Restituisce l'articolo, ora con ai_summary valorizzato (nuovo o già presente).
    return a
