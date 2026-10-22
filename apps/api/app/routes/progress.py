"""
GUIDA: app/routes/progress.py  (il "controller" del progresso utente)

COSA FA
Questo file gestisce tutto cio' che riguarda i "completamenti": quando l'utente
segna un sottocapitolo come fatto (o lo annulla), e le statistiche che ne derivano
(XP, livello, streak, badge, progresso per percorso). Non calcola nulla da solo:
la matematica vera sta in app/gamification.py, qui raccogliamo i dati dal DB,
li passiamo a quelle funzioni e restituiamo il risultato come JSON.

COME SI COLLEGA AL RESTO DEL PROGETTO
- app/main.py importa questo modulo (riga "from app.routes import ... progress")
  e, nel ciclo "for r in (...)", chiama app.include_router(progress.router):
  e' il momento in cui gli endpoint qui sotto diventano raggiungibili.
- Usa app.db.get_db: una sessione di database per ogni richiesta.
- Usa app.gamification.compute_stats: la logica di gioco pura (senza DB).
- Usa app.models (Completion, Module, Session, Subchapter, Track): le tabelle.
- Il frontend (apps/web/lib/hooks.ts, hook useStats) chiama GET /api/stats tramite
  il proxy Next.js app/api/[...path]/route.ts, che inoltra a questa API.
- Le route sono nel formato /stats, /progress/{id}: il prefisso /api lo aggiunge il proxy.

CONCETTI DI BASE (per chi parte da zero)
- APIRouter: un "mini-gruppo" di endpoint. Ha un tag ("progress") che serve solo
  a raggrupparli nella documentazione automatica di FastAPI su /docs.
  Simile a Route::prefix(...)->group(...) in Laravel.
- Decoratori @router.get / @router.put / @router.delete: associano una funzione Python
  a un verbo HTTP e a un percorso. Simili a Route::get / Route::put / Route::delete.
- Pydantic BaseModel: una classe che descrive la forma di un dato (campi + tipi).
  FastAPI la usa per validare e serializzare in JSON, e per generare lo schema OpenAPI
  che poi diventa lib/api-types.ts sul frontend. Simile a una Form Request / API Resource.
- Depends(get_db): "dependency injection". FastAPI chiama get_db per noi e ci passa
  il risultato come parametro db. Non creiamo noi la connessione.
- async / await: il codice non blocca il server mentre aspetta il database; ogni
  "await" e' un punto in cui il server puo' servire altre richieste nel frattempo.
- SQLAlchemy (select, join, insert, delete): costruisce query SQL con oggetti Python
  invece che scrivere SQL a mano. Documentazione: https://docs.sqlalchemy.org/
- Documentazione FastAPI (la versione e' quella dichiarata nel progetto, controllare
  apps/api/pyproject.toml o uv.lock per la major esatta): https://fastapi.tiangolo.com/
"""

# datetime: il tipo "data e ora" di Python, usato per sapere QUANDO un sottocapitolo
# e' stato completato
from datetime import datetime

# FastAPI: framework web. APIRouter = gruppo di endpoint; Depends = dependency injection;
# HTTPException = modo per rispondere con un errore HTTP (es. 404)
from fastapi import APIRouter, Depends, HTTPException

# BaseModel di Pydantic: definisce le classi che descrivono i dati in entrata/uscita
from pydantic import BaseModel

# delete = istruzione SQL DELETE; select = istruzione SQL SELECT (costruite come oggetti Python)
from sqlalchemy import delete, select

# insert specifico di PostgreSQL: serve per "INSERT ... ON CONFLICT",
# cioe' inserisci o ignora se gia' esiste
from sqlalchemy.dialects.postgresql import insert

# AsyncSession: la sessione di database asincrona, il "canale" con cui parliamo al DB
from sqlalchemy.ext.asyncio import AsyncSession

# settings: la configurazione letta dalle variabili d'ambiente (qui ci serve il fuso orario)
from app.config import settings

# get_db: la funzione che fornisce una sessione di database per ogni richiesta
from app.db import get_db

# compute_stats: la funzione pura che calcola XP, livelli, streak e badge
from app.gamification import compute_stats

# i modelli (tabelle) del database che useremo nelle query
from app.models import Completion, Module, Session, Subchapter, Track

# creo il gruppo di endpoint; il tag "progress" li raggruppa nella documentazione /docs
router = APIRouter(tags=["progress"])


# BadgeOut: la "forma" di un badge (medaglia) nella risposta JSON: id, titolo, descrizione
# (la classe eredita da BaseModel, quindi Pydantic valida i tipi e genera lo schema OpenAPI)
class BadgeOut(BaseModel):
    # identificativo stabile del badge (stringa)
    id: str
    # nome mostrato all'utente
    title: str
    # testo che spiega come ottenerlo
    description: str


# TrackProgress: quanti sottocapitoli di un percorso (track) sono completati su quanti totali
class TrackProgress(BaseModel):
    # id del percorso, es. "1" o una stringa del ROADMAP
    id: str
    # titolo leggibile del percorso
    title: str
    # quanti sottocapitoli l'utente ha gia' completato in questo percorso
    done: int
    # quanti sottocapitoli ci sono in totale in questo percorso
    total: int


# StatsOut: la risposta completa di /stats. Ogni campo e' un numero o una lista
# calcolata da compute_stats (XP, livello, streak, ...) piu' i progressi per percorso
class StatsOut(BaseModel):
    # punti esperienza totali
    xp: int
    # livello attuale, derivato dagli XP
    level: int
    # quanti XP ha gia' guadagnato dentro il livello corrente (per la barra di avanzamento)
    xp_into_level: int
    # quanti XP servono per arrivare al livello successivo
    xp_for_next_level: int
    # giorni consecutivi di studio fino a oggi
    streak: int
    # la streak piu' lunga mai raggiunta
    best_streak: int
    # quanti sottocapitoli sono stati completati oggi
    completed_today: int
    # lista dei badge ottenuti (usa il modello BadgeOut sopra)
    badges: list[BadgeOut]
    # attivita' per giorno: chiave = data come testo "AAAA-MM-GG", valore = quanti completamenti
    activity: dict[str, int]
    # progresso per ciascun percorso
    tracks: list[TrackProgress]


# funzione "privata" (il _ iniziale e' una convenzione: non e' pensata per essere chiamata da fuori)
# async: lavora in modo asincrono con il DB; restituisce uno StatsOut
async def _stats(db: AsyncSession) -> StatsOut:
    # carica TUTTI i completamenti dal DB: coppie (id sottocapitolo, quando e' stato completato)
    # dict(...) le trasforma in un dizionario {id_sottocapitolo: data}
    completions: dict[str, datetime] = dict(
        (await db.execute(select(Completion.subchapter_id, Completion.completed_at))).all()
    )
    # query che unisce le tabelle Track -> Module -> Session -> Subchapter
    # (join = unione per chiave)
    # restituisce una riga per ogni sottocapitolo, con id di percorso, titolo,
    # sessione e sottocapitolo
    # order_by ordina i percorsi secondo la loro posizione nel roadmap
    rows = (
        await db.execute(
            select(Track.id, Track.title, Session.id, Subchapter.id)
            .join(Module, Module.track_id == Track.id)
            .join(Session, Session.module_id == Module.id)
            .join(Subchapter, Subchapter.session_id == Session.id)
            .order_by(Track.position)
        )
    ).all()
    # session_subs: id sessione -> lista degli id dei suoi sottocapitoli
    session_subs: dict[str, list[str]] = {}
    # track_sessions: id percorso -> lista (senza duplicati) degli id delle sue sessioni
    track_sessions: dict[str, list[str]] = {}
    # titles: id percorso -> titolo del percorso
    titles: dict[str, str] = {}
    # scorro tutte le righe e riempio i tre dizionari in un solo passaggio
    for track_id, track_title, session_id, sub_id in rows:
        # salvo il titolo del percorso
        titles[track_id] = track_title
        # aggiungo il sottocapitolo alla lista della sua sessione
        # (setdefault crea la lista se manca)
        session_subs.setdefault(session_id, []).append(sub_id)
        # prendo (o creo) la lista delle sessioni di questo percorso
        sessions = track_sessions.setdefault(track_id, [])
        # aggiungo la sessione solo se non c'e' gia' (evito duplicati, la query ripete le sessioni)
        if session_id not in sessions:
            sessions.append(session_id)
    # completions of subchapters removed from the roadmap don't count
    # live = insieme degli id dei sottocapitoli ancora presenti nel roadmap
    live = {sid for subs in session_subs.values() for sid in subs}
    # calcolo XP, livello, streak e badge con la funzione pura di gamification.py;
    # filtro i completamenti tenendo solo quelli ancora "vivi" (k in live)
    # settings.timezone serve per decidere quale giorno e' "oggi" nel fuso orario giusto
    stats = compute_stats(
        {k: v for k, v in completions.items() if k in live},
        session_subs,
        track_sessions,
        settings.timezone,
    )
    # costruisco la risposta StatsOut: i campi di stats vanno passati come parametri nominali
    return StatsOut(
        # **dict "spacchetta" il dizionario in parametri: prendo tutti i campi di stats
        # tranne badges
        # (badges li gestiamo a parte perche' vanno convertiti in BadgeOut)
        **{k: v for k, v in vars(stats).items() if k != "badges"},
        # converto ogni badge grezzo nel modello BadgeOut
        # (vars(b) = i campi del badge come dizionario)
        badges=[BadgeOut(**vars(b)) for b in stats.badges],
        # costruisco la lista di progressi per percorso
        tracks=[
            # per ogni percorso t (con le sue sessioni sess) creo un TrackProgress
            TrackProgress(
                # id del percorso
                id=t,
                # titolo del percorso
                title=titles[t],
                # conto i sottocapitoli completati: scorro sessioni -> sottocapitoli
                # -> controllo se in completions
                done=sum(1 for s in sess for x in session_subs[s] if x in completions),
                # conto il totale dei sottocapitoli del percorso
                total=sum(len(session_subs[s]) for s in sess),
            )
            # ciclo su ogni coppia (percorso, sue sessioni) del dizionario track_sessions
            for t, sess in track_sessions.items()
        ],
    )


# decoratore: registra la funzione come risposta a GET /stats
# response_model=StatsOut dice a FastAPI la forma della risposta (validazione + documentazione)
@router.get("/stats", response_model=StatsOut)
# funzione che risponde alla richiesta; Depends(get_db) fornisce automaticamente la sessione DB
async def get_stats(db: AsyncSession = Depends(get_db)) -> StatsOut:
    # delego il lavoro alla funzione privata _stats e restituisco il risultato
    # (FastAPI lo converte in JSON)
    return await _stats(db)


# PUT = "sostituisci/imposta una risorsa". Qui: marca un sottocapitolo come completato.
# {subchapter_id} e' un parametro nel percorso dell'URL, es. /progress/1.2.3
@router.put("/progress/{subchapter_id}", response_model=StatsOut)
# il parametro subchapter_id arriva dall'URL (il tipo str lo valida come testo)
async def complete(subchapter_id: str, db: AsyncSession = Depends(get_db)) -> StatsOut:
    # db.get cerca il sottocapitolo per chiave primaria; se non esiste (None) rispondo 404
    if not await db.get(Subchapter, subchapter_id):
        # HTTPException interrompe la funzione e manda al client un errore 404 con questo messaggio
        raise HTTPException(404, "Subchapter not found")
    # inserisco il completamento nella tabella Completion
    # on_conflict_do_nothing: se l'utente l'ha gia' completato, non fa nulla
    # (niente duplicati, niente errore)
    await db.execute(
        insert(Completion).values(subchapter_id=subchapter_id).on_conflict_do_nothing()
    )
    # commit salva le modifiche in modo definitivo nel database (senza commit non resta nulla)
    await db.commit()
    # rileggo le statistiche aggiornate e le restituisco, cosi' il frontend
    # aggiorna subito XP e livello
    return await _stats(db)


# DELETE = "elimina una risorsa". Qui: annulla il completamento di un sottocapitolo.
@router.delete("/progress/{subchapter_id}", response_model=StatsOut)
# stesso parametro dell'URL di sopra; questa funzione non controlla che il sottocapitolo esista
async def uncomplete(subchapter_id: str, db: AsyncSession = Depends(get_db)) -> StatsOut:
    # cancello la riga di Completion per quel sottocapitolo
    # (se non c'e', la cancellazione non fa danni)
    await db.execute(delete(Completion).where(Completion.subchapter_id == subchapter_id))
    # salvo la cancellazione nel database
    await db.commit()
    # rispondo con le statistiche aggiornate
    return await _stats(db)
