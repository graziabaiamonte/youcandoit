# =====================================================================================
# File: app/routes/roadmap.py
# Ruolo: espone due endpoint GET che il frontend usa per il percorso di studio:
#   - GET /roadmap           -> l'intero albero: tracce > moduli > sessioni > sotto-capitoli
#   - GET /sessions/{id}     -> il dettaglio di una singola sessione (lezione, fonti, prev/next)
#
# Come si collega al resto del progetto:
#   - main.py importa questo modulo e lo registra con app.include_router(...): da quel momento
#     FastAPI sa che queste URL esistono (vedi la nota in main.py, simile a routes/web.php).
#   - Il browser chiama /api/*; il proxy Next.js (app/api/[...path]/route.ts) inoltra la
#     richiesta a questa API. Le risposte finiscono come tipi TypeScript in lib/api-types.ts.
#   - I dati arrivano dal database (tabelle Track, Module, Session, Completion in models.py),
#     che a sua volta è riempito da sync.py leggendo ROADMAP.md all'avvio.
#   - Il file della lezione viene cercato con sync.lesson_file(id) e letto come testo.
#
# Concetti di Python/FastAPI usati qui:
#   - APIRouter: un "mini-router" con un gruppo di rotte; tags=["roadmap"] lo raggruppa
#     nella documentazione automatica su /docs. Più o meno un Route::group() di Laravel.
#   - Decoratori (@router.get(...)): la riga che inizia con @ registra la funzione sotto
#     come handler per una URL e un metodo HTTP.
#   - BaseModel (Pydantic): classi che descrivono la forma del JSON di risposta e validano
#     i dati. Funzionano come le API Resource di Laravel.
#   - Type hint (str, list[X], X | None): annotazioni sui tipi. FastAPI le usa per validare
#     e per generare lo schema OpenAPI. "X | None" significa "X oppure null".
#   - Dependency injection con Depends(get_db): prima di eseguire la funzione, FastAPI chiama
#     get_db e passa il risultato come argomento db (una sessione DB pronta all'uso).
#     Doc: https://fastapi.tiangolo.com/tutorial/dependencies/
#   - async/await: la funzione può "mettersi in attesa" del database senza bloccare il server.
#   - SQLAlchemy 2.x (select, db.scalars, selectinload): ORM che traduce il codice Python in
#     SQL. selectinload carica le relazioni con query extra mirate, evitando il problema N+1.
#     Doc: https://docs.sqlalchemy.org/en/20/
#
# Versioni: pyproject.toml richiede fastapi>=0.115 e sqlalchemy>=2.0.36. Non ho trovato
# uv.lock nel repo, quindi la versione esatta installata non è verificabile da qui.
# Doc ufficiali: https://fastapi.tiangolo.com/ e https://docs.sqlalchemy.org/
# =====================================================================================

# Importa da FastAPI: APIRouter (gruppo di rotte), Depends (dependency injection),
# HTTPException (per restituire errori HTTP come 404).
from fastapi import APIRouter, Depends, HTTPException

# Pydantic: libreria che definisce le classi-modello (BaseModel) per le risposte JSON.
from pydantic import BaseModel

# select: costruisce una query SQL in Python (equivale a un query builder, es. DB::table()).
from sqlalchemy import select

# AsyncSession: la "connessione" al DB in versione asincrona, da usare con await.
from sqlalchemy.ext.asyncio import AsyncSession

# selectinload: istruisce SQLAlchemy a caricare le relazioni in blocco (vedi _tree).
from sqlalchemy.orm import selectinload

# Import dei nostri moduli: "from app.x import y" prende y dal file app/x.py del progetto.
# get_db: funzione che apre una sessione DB per ogni richiesta.
from app.db import get_db

# Modelli ORM (tabelle del DB) usati nelle query: vedi app/models.py.
from app.models import Completion, Module, Session, Track

# iter_sessions: appiattisce l'albero in una lista di tuple (traccia, modulo, sessione).
from app.roadmap_parser import iter_sessions

# lesson_file: trova il file .md della lezione dato l'id della sessione (o None).
from app.sync import lesson_file

# Crea il router. Le rotte definite sotto con @router.get(...) appartengono a questo gruppo.
router = APIRouter(tags=["roadmap"])


# Modelli di risposta (Pydantic). Ogni classe descrive un pezzo del JSON che restituiamo.
# "Out" nel nome indica che sono oggetti in uscita verso il client (non input dal client).
# Fonte di lettura della lezione: un link con titolo e URL.
class SourceOut(BaseModel):
    title: str
    url: str


# Un sotto-capitolo (una voce "- subchapter {#N}" in ROADMAP.md) con il flag "fatto o no".
# done è calcolato al volo confrontando con la tabella Completion: non è salvato qui.
class SubchapterOut(BaseModel):
    id: str
    title: str
    done: bool


# Una sessione nell'albero: contiene la lista dei suoi sotto-capitoli.
# list[SubchapterOut] = lista di oggetti di quel tipo (come un array tipizzato).
class SessionNode(BaseModel):
    id: str
    title: str
    subchapters: list[SubchapterOut]


# Un modulo (es. "Module 1.1"): contiene la lista delle sue sessioni.
class ModuleNode(BaseModel):
    id: str
    title: str
    sessions: list[SessionNode]


# Una traccia (es. "Track 1"): primo livello dell'albero, contiene i moduli.
class TrackNode(BaseModel):
    id: str
    title: str
    modules: list[ModuleNode]


# Risposta di GET /sessions/{id}: tutto ciò che serve a disegnare la pagina di una sessione.
# Contiene anche i campi "breadcrumb" (track/module) e la navigazione (prev/next).
class SessionDetail(BaseModel):
    id: str
    title: str
    outcomes: str
    track_id: str
    track_title: str
    module_id: str
    module_title: str
    sources: list[SourceOut]
    subchapters: list[SubchapterOut]
    # "str | None": il valore può essere None, che in JSON diventa null (es. primo/ultimo elemento).
    prev_id: str | None
    next_id: str | None
    # Testo Markdown della lezione, oppure None se il file non esiste.
    lesson: str | None


# Funzioni "di servizio" con underscore iniziale: convenzione Python per "uso interno al modulo".
# Restituisce l'insieme (set) degli id dei sotto-capitoli completati.
# set[str] = insieme senza duplicati e con ricerca veloce ("x in set" è rapido).
async def _done_ids(db: AsyncSession) -> set[str]:
    # db.scalars(...) restituisce solo la prima colonna di ogni riga (qui subchapter_id).
    return set(await db.scalars(select(Completion.subchapter_id)))


# Carica l'intero albero delle tracce con i figli, in un'unica operazione.
async def _tree(db: AsyncSession) -> list[Track]:
    # Costruisce la query: SELECT tracce ORDER BY position (l'ordine del ROADMAP.md).
    stmt = (
        select(Track)
        .order_by(Track.position)
        # .options(...) dice a SQLAlchemy di caricare anche tutti i figli in query aggiuntive,
        # così nel codice si possono scorrere t.modules, m.sessions, s.subchapters senza query.
        .options(
            selectinload(Track.modules)
            .selectinload(Module.sessions)
            .selectinload(Session.subchapters)
        )
    )
    # db.scalars(stmt) restituisce le righe come oggetti Track; list(...) le mette in una lista.
    return list(await db.scalars(stmt))


# GET /roadmap: rotta pubblica che restituisce l'albero completo del percorso.
# response_model=list[TrackNode] dice a FastAPI la forma della risposta (documentazione e
# validazione). Il tipo dopo "->" è un suggerimento per l'editor e per i controlli statici.
@router.get("/roadmap", response_model=list[TrackNode])
# Dependency injection: FastAPI passa automaticamente una sessione DB (db) a questa funzione.
async def get_roadmap(db: AsyncSession = Depends(get_db)) -> list[TrackNode]:
    # Carica prima tutti gli id completati, una sola volta per richiesta.
    done = await _done_ids(db)
    # Costruzione annidata: per ogni traccia, moduli, sessioni e sotto-capitoli creiamo un
    # oggetto Pydantic. La lista esterna è una "list comprehension" (vedi sotto).
    return [
        TrackNode(
            id=t.id,
            title=t.title,
            modules=[
                ModuleNode(
                    id=m.id,
                    title=m.title,
                    sessions=[
                        SessionNode(
                            id=s.id,
                            title=s.title,
                            subchapters=[
                                # "c.id in done": True se questo sotto-capitolo è stato completato.
                                SubchapterOut(id=c.id, title=c.title, done=c.id in done)
                                for c in s.subchapters
                            ],
                        )
                        for s in m.sessions
                    ],
                )
                for m in t.modules
            ],
        )
        # Ciclo esterno della list comprehension: una TrackNode per ogni traccia del DB.
        for t in await _tree(db)
    ]


# GET /sessions/{session_id}: il {session_id} tra graffe è un "path parameter", cioè un pezzo
# variabile dell'URL (es. /sessions/1.1.2) che FastAPI passa alla funzione come argomento.
@router.get("/sessions/{session_id}", response_model=SessionDetail)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)) -> SessionDetail:
    # Appiattisce l'albero in una lista ordinata di (traccia, modulo, sessione), così
    # possiamo trovare la sessione richiesta e anche la precedente e la successiva.
    order = list(iter_sessions(await _tree(db)))
    # Cerca l'indice della sessione con quell'id. enumerate() dà coppie (indice, elemento);
    # next(..., None) restituisce il primo indice trovato, oppure None se non esiste.
    idx = next((i for i, (_, _, s) in enumerate(order) if s.id == session_id), None)
    # Sessione non trovata: HTTPException(404, ...) interrompe la funzione e risponde 404.
    if idx is None:
        raise HTTPException(404, "Session not found")
    # Tuple unpacking: scompatta la tupla in tre variabili; done contiene gli id completati.
    (t, m, s), done = order[idx], await _done_ids(db)
    # Path del file .md della lezione, oppure None (la lezione è opzionale).
    lesson = lesson_file(s.id)
    # Costruisce la risposta: ogni argomento "nome=valore" diventa un campo del JSON.
    return SessionDetail(
        id=s.id,
        title=s.title,
        outcomes=s.outcomes,
        track_id=t.id,
        track_title=t.title,
        module_id=m.id,
        module_title=m.title,
        # **src "scompatta" il dizionario: SourceOut(title=..., url=...) per ogni fonte.
        sources=[SourceOut(**src) for src in s.sources],
        subchapters=[
            SubchapterOut(id=c.id, title=c.title, done=c.id in done) for c in s.subchapters
        ],
        # order[i] è la tupla (traccia, modulo, sessione); [2] prende la sessione, [.id] il suo id.
        # "X if condizione else Y" è l'operatore ternario: vale X se la condizione è vera, o Y.
        prev_id=order[idx - 1][2].id if idx > 0 else None,
        next_id=order[idx + 1][2].id if idx + 1 < len(order) else None,
        # Legge il file .md dal disco e ne restituisce il testo (str); None se non c'è la lezione.
        lesson=lesson.read_text() if lesson else None,
    )
