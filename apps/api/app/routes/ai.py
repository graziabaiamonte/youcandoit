"""
File: apps/api/app/routes/ai.py

COSA FA: definisce le route HTTP dell'"AI" della piattaforma, cioe' gli endpoint che
il browser chiama per parlare con il tutor (un LLM, cioe' un modello linguistico tipo
ChatGPT/Claude/Ollama) e per fare domande sulla reading list (gli articoli salvati).

DOVE SI COLLOCA:
- E' un "router" FastAPI: un gruppo di route con prefisso comune. Qui il prefisso e' "/ai",
  quindi le URL finali sono /api/ai/status, /api/ai/tutor e /api/ai/ask.
- E' montato in app/main.py con app.include_router(...). Il browser non chiama mai direttamente
  l'API: passa da apps/web/app/api/[...path]/route.ts, un proxy Next.js che inoltra le richieste.
- Lo usano: components/tutor-sheet.tsx (il pannello del tutor), app/news/page.tsx (la reading list)
  e lib/api-types.ts (i tipi generati da questo file tramite OpenAPI).
- Dipende da: app/rag.py (ricerca nei documenti indicizzati, RAG = Retrieval-Augmented Generation),
  app/llm.py (il provider LLM scelto via configurazione), app/db.py (sessione del database),
  app/models.py (tabella Session con le sottosezioni del corso).

CONCETTI DA SAPERE:
- FastAPI (doc ufficiale: https://fastapi.tiangolo.com/): funzioni "async def" + decoratori
  @router.get / @router.post che collegano una funzione a un URL e a un metodo HTTP.
- Pydantic (https://docs.pydantic.dev/): i BaseModel sono classi che descrivono la forma dei dati
  JSON in ingresso/uscita. FastAPI le usa per validare automaticamente le richieste (un campo
  mancante o troppo lungo produce un errore 422 senza che tu scriva nulla) e per generare OpenAPI.
- Dependency injection con Depends(...) (https://fastapi.tiangolo.com/tutorial/dependencies/):
  invece di aprire il database a mano, dichiari "ho bisogno di get_db" e FastAPI la chiama per te
  e poi chiude la sessione. In Laravel e' simile a un type-hint che il container risolve.
- async/await: le operazioni di rete o database non bloccano il server mentre aspettano.
- Type hints (es. `-> AnswerOut`): dichiarano il tipo atteso; Python non li impone da solo,
  ma FastAPI e gli editor li leggono.
- Riferimenti: questo progetto usa FastAPI >=0.115 e Pydantic v2 (vedi apps/api/pyproject.toml).
  Non ho verificato la versione esatta nel lockfile.
"""

# Literal: il valore puo' essere solo uno di quelli elencati
from typing import Literal

# strumenti base di FastAPI
from fastapi import APIRouter, Depends, HTTPException

# per definire modelli di dati e vincoli sui campi
from pydantic import BaseModel, Field

# tipo della sessione DB asincrona
from sqlalchemy.ext.asyncio import AsyncSession

# carica in anticipo le relazioni (evita query extra)
from sqlalchemy.orm import selectinload

# modulo di ricerca nei documenti indicizzati
from app import rag

# funzione che fornisce una sessione DB alle route
from app.db import get_db

# accesso al modello linguistico e al suo nome
from app.llm import get_llm, provider_name

# modello ORM della tabella delle sessioni del corso
from app.models import Session

# Crea il gruppo di route. prefix="/ai" fa si' che ogni route qui sotto parta da /ai.
# tags=["ai"] raggruppa gli endpoint nella documentazione automatica (/docs).
router = APIRouter(prefix="/ai", tags=["ai"])

# Istruzioni "di base" (system prompt) che vengono aggiunte a ogni richiesta al modello.
# Le parentesi tonde senza virgola finale servono solo a concatenare piu' stringhe in una.
GROUNDING = (
    "Answer using the numbered context passages below and cite them inline like [1]. "
    "If the context does not contain the answer, say so briefly, then answer from general "
    "knowledge and mark that part '(not from your sources)'. Keep answers clear and short: "
    "small paragraphs, bullet lists, a tiny code example when it helps. "
    # qwen2.5 can drift into Chinese mid-answer
    "Always answer in English."
)


# Un "Turn" e' un singolo messaggio della conversazione: chi lo ha scritto e il testo.
# BaseModel (Pydantic) valida i dati: role deve essere "user" o "assistant",
# content al massimo 8000 caratteri.
class Turn(BaseModel):
    # chi parla: l'utente o l'assistente (il modello)
    role: Literal["user", "assistant"]
    # testo del messaggio, con un limite di lunghezza
    content: str = Field(max_length=8000)


# Il corpo JSON che arriva a /ask: la domanda e lo storico della chat.
class AskIn(BaseModel):
    # min_length=1: la domanda non puo' essere vuota;
    # max_length: difesa da input enormi (costi/abusi).
    question: str = Field(min_length=1, max_length=4000)
    # default_factory=list: se "history" manca, parte da una lista vuota
    # (ogni richiesta ha la sua lista nuova).
    history: list[Turn] = Field(default_factory=list, max_length=20)


# TutorIn "eredita" da AskIn: ha tutti i suoi campi piu' session_id (quale sessione del corso).
class TutorIn(AskIn):
    # id della sessione, es. "1.1.2"
    session_id: str


# Una citazione: il numero [n] usato nel testo, il link della fonte e il suo titolo.
class Citation(BaseModel):
    n: int
    url: str
    title: str


# La risposta: il testo generato e la lista delle fonti citate.
class AnswerOut(BaseModel):
    answer: str
    citations: list[Citation]


# Risposta di /status: il nome del provider LLM in uso (es. "ollama", "anthropic", "fake").
class StatusOut(BaseModel):
    provider: str


# La "_" davanti al nome indica una funzione di uso interno a questo file (convenzione Python).
# async def: la funzione puo' aspettare operazioni lente (il DB) senza bloccare il server.
async def _session(db: AsyncSession, session_id: str) -> Session:
    # db.get cerca una riga per chiave primaria;
    # selectinload carica anche le sottosezioni in un colpo solo.
    s = await db.get(Session, session_id, options=[selectinload(Session.subchapters)])
    # None significa "non trovata": rispondiamo 404 (Not Found) al client
    if not s:
        # HTTPException interrompe la richiesta con quell'errore
        raise HTTPException(404, "Session not found")
    return s


# Costruisce un riassunto testuale della sessione (titolo, obiettivi, sottosezioni)
# da dare al modello.
def _outline(s: Session) -> str:
    # Unisce i titoli delle sottosezioni in una lista puntata, separate da a capo (\n).
    subs = "\n".join(f"- {c.title}" for c in s.subchapters)
    return f"Session {s.id}: {s.title}\nOutcomes: {s.outcomes}\nSubchapters:\n{subs}"


# Funzione comune a tutte le risposte: prepara il prompt con le fonti,
# chiama l'LLM e impacchetta il risultato.
async def _answer(system: str, body: AskIn, hits: list[rag.Hit]) -> AnswerOut:
    # build_context trasforma i pezzi di testo trovati (hits) in un blocco numerato
    # e in una lista di citazioni.
    context, citations = rag.build_context(hits)
    # Unisce: istruzioni di ruolo, regole di citazione e i passaggi trovati.
    # "or" sotto: se il contesto e' vuoto, scrive un testo di ripiego al posto della stringa vuota.
    prompt = f"{system}\n\n{GROUNDING}\n\nContext:\n{context or '(no indexed passages yet)'}"
    # Lo storico (convertito in dizionari con model_dump) + la domanda attuale
    # come ultimo messaggio "user".
    messages = [t.model_dump() for t in body.history] + [{"role": "user", "content": body.question}]
    # get_llm() restituisce il provider configurato; await aspetta la risposta del modello.
    answer = await get_llm().chat(prompt, messages)
    # Crea la risposta: Citation(**c) "scompatta" il dizionario c nei campi n, url, title.
    return AnswerOut(answer=answer, citations=[Citation(**c) for c in citations])


# GET /api/ai/status: endpoint semplice per la UI, non tocca il database ne' l'LLM.
# response_model: forma garantita e documentata della risposta
@router.get("/status", response_model=StatusOut)
async def status() -> StatusOut:
    return StatusOut(provider=provider_name())


# POST /api/ai/tutor: risponde a una domanda usando il materiale della sessione corrente.
# body: il JSON in ingresso, validato come TutorIn.
# db: la sessione DB, iniettata da Depends(get_db).
@router.post("/tutor", response_model=AnswerOut)
async def tutor(body: TutorIn, db: AsyncSession = Depends(get_db)) -> AnswerOut:
    # recupera la sessione o risponde 404
    s = await _session(db, body.session_id)
    # Prima cerca tra i documenti legati a questa sessione (session_id=...).
    hits = await rag.retrieve(db, body.question, session_id=s.id)
    if not hits:  # this session's pages aren't indexed yet: search all sources
        # Fallback: se non ci sono documenti per questa sessione,
        # cerca in tutte le fonti (kind="source").
        hits = await rag.retrieve(db, body.question, kind="source")
    # Il ruolo del modello: un tutor paziente.
    # f-string (la f davanti alle virgolette) inserisce il riassunto della sessione.
    system = (
        "You are a patient tutor for a junior developer without a CS degree who is working "
        "towards a senior software engineer role. Explain with analogies and concrete examples."
        f"\n\nThe learner is studying:\n{_outline(s)}"
    )
    # restituisce la risposta, che FastAPI converte in JSON
    return await _answer(system, body, hits)


# POST /api/ai/ask: risponde usando solo gli articoli della reading list (kind="article").
@router.post("/ask", response_model=AnswerOut)
async def ask_reading_list(body: AskIn, db: AsyncSession = Depends(get_db)) -> AnswerOut:
    # cerca solo tra gli articoli
    hits = await rag.retrieve(db, body.question, kind="article")
    system = "You help the learner recall and connect articles from their reading list."
    # stesso flusso del tutor, con un ruolo diverso
    return await _answer(system, body, hits)
