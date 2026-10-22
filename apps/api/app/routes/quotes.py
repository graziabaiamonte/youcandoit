# =====================================================================
# routes/quotes.py: L'ENDPOINT CHE RESTITUISCE UNA CITAZIONE CASUALE
#
# Questo file definisce UN solo endpoint HTTP: GET /quotes/random.
# Il frontend (apps/web/components/welcome-dialog.tsx) lo chiama quando
# l'utente apre la dashboard e mostra la citazione nella finestra
# "Welcome back". Il test apps/api/tests/test_api.py lo verifica.
#
# Come arriva qui il codice:
#   1. main.py importa questo modulo (riga: from app.routes import ... quotes ...)
#   2. main.py fa app.include_router(quotes.router): registra l'endpoint
#      nell'applicazione FastAPI, che poi risponde alle richieste HTTP.
#   3. Il file di dati e' content/quotes.json (una lista di oggetti
#      {"text": ..., "author": ...}), letto a runtime dalla cartella
#      CONTENT_DIR (in Docker montata in sola lettura su /content).
#
# Concetti usati (doc ufficiali):
#   - FastAPI (la versione e' un range ">=0.115" in pyproject.toml; non
#     ho trovato un lock file, quindi la versione esatta non e' verificabile):
#     https://fastapi.tiangolo.com/
#   - APIRouter = "mini-app" con un gruppo di endpoint, da collegare
#     all'app principale con include_router.
#   - Pydantic BaseModel = classe che descrive la forma dei dati e li
#     valida/serializza in JSON. FastAPI la usa per generare la documentazione
#     OpenAPI (quella che poi alimenta lib/api-types.ts sul frontend).
#     https://docs.pydantic.dev/
#   - async def = funzione asincrona: FastAPI la esegue senza bloccare
#     il server mentre aspetta operazioni lente (qui non ce ne sono).
#   - lru_cache = decoratore della libreria standard che memorizza il
#     risultato di una funzione: la lettura del file JSON avviene una volta sola.
#     https://docs.python.org/3/library/functools.html#functools.lru_cache
# =====================================================================

# json: libreria standard per leggere/scrivere JSON (qui per decodificare quotes.json)
import json

# random: libreria standard per la casualita' (qui per scegliere una citazione a caso)
import random

# lru_cache: decoratore che memorizza il risultato di una funzione (vedi sopra)
from functools import lru_cache

# APIRouter: crea un gruppo di endpoint (le "route") da collegare all'app principale
from fastapi import APIRouter

# BaseModel: classe base di Pydantic per definire modelli di dati validati
from pydantic import BaseModel

# settings: l'oggetto di configurazione letto dalle variabili d'ambiente (vedi app/config.py)
# "from app.config import settings" = importa solo quell'oggetto dal modulo app/config.py
from app.config import settings

# Creiamo il router. tags=["quotes"] serve solo a raggruppare questo endpoint
# sotto la voce "quotes" nella documentazione automatica su /docs
router = APIRouter(tags=["quotes"])


# class = definisce una nuova "forma" di dati. QuoteOut eredita da BaseModel
# (la sintassi class Nome(Base): significa "Nome e' una versione specializzata di Base")
class QuoteOut(BaseModel):
    # campo text: deve essere una stringa (str), altrimenti Pydantic segnala un errore
    text: str
    # campo author: anche questo una stringa
    author: str


# @lru_cache = "decoratore": una riga che modifica il comportamento della funzione sotto.
# Qui: la prima chiamata legge il file, le successive riusano il risultato in memoria.
@lru_cache
# def = definisce una funzione. "_quotes" con underscore iniziale e' una convenzione
# Python che indica "uso interno a questo modulo, non esportarla"
# -> list[dict] = tipo di ritorno: una lista di dizionari (ancora grezzi, non ancora QuoteOut)
def _quotes() -> list[dict]:
    # Path: settings.content_dir e' un oggetto Path (percorso). L'operatore "/" di Path
    # unisce due percorsi. read_text() legge il file come testo; json.loads() lo trasforma
    # in una lista Python di dizionari.
    return json.loads((settings.content_dir / "quotes.json").read_text())


# @router.get = "decoratore" di FastAPI: registra questa funzione come risposta alla
# richiesta HTTP GET verso il percorso /quotes/random
# response_model=QuoteOut = FastAPI validera' e serializzera' la risposta secondo QuoteOut
@router.get("/quotes/random", response_model=QuoteOut)
# async def = funzione asincrona (vedi sopra); -> QuoteOut = tipo di ritorno atteso
async def random_quote() -> QuoteOut:
    # random.choice() prende un elemento a caso dalla lista di citazioni.
    # **dict = "spacchetta" il dizionario come argomenti con nome: QuoteOut(text=..., author=...).
    # Cosi' la validazione Pydantic controlla che ogni campo ci sia e sia una stringa.
    return QuoteOut(**random.choice(_quotes()))
