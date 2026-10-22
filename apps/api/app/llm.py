"""LLM + embedding providers. Chat can be Ollama, Anthropic or a fake (tests);
embeddings are always Ollama (Anthropic has no embeddings API) or fake."""

# ------------------------------------------------------------------------------------------------
# RUOLO DEL FILE
# Questo file è il "traduttore" tra la nostra app e i modelli di intelligenza artificiale (LLM).
# Il resto dell'app non sa né vuole sapere quale modello c'è dietro: chiama solo
# get_llm().chat(...) per farsi generare testo, e get_embedder().embed(...) per trasformare
# testo in numeri (vettori). Qui sotto decidiamo quale "motore" usare: Ollama (in locale),
# Anthropic (Claude, via API cloud) o un finto motore per i test.
#
# CHI USA QUESTO FILE
# - app/routes/ai.py       -> get_llm().chat() per rispondere al tutor; provider_name() per /status
# - app/routes/articles.py -> get_llm().chat() per riassumere gli articoli
# - app/rag.py             -> get_embedder().embed() per indicizzare e cercare nei testi (RAG)
# - app/main.py            -> get_embedder() al primo avvio; registra l'handler per LLMError
#                             (LLMError diventa una risposta HTTP 503 "servizio non disponibile")
# - app/sync.py            -> intercetta LLMError durante la sincronizzazione dei contenuti
# - tests/test_llm.py      -> verifica la scelta del provider
# Le impostazioni (URL di Ollama, nome del modello, chiave API...) arrivano da app/config.py.
#
# CONCETTI PYTHON USATI IN QUESTO FILE (doc: https://docs.python.org/3.12/)
# - Protocol (typing): descrive "una forma" che un oggetto deve avere (metodi con certi nomi e
#   tipi) senza obbligare a ereditare da una classe. È un'interfaccia "a forma di anatra":
#   se ha un metodo chat() con quella firma, va bene. Vedi LLMProvider ed Embedder.
# - async / await: funzioni asincrone. Quando aspettiamo una risposta di rete (Ollama o Claude),
#   il programma può fare altro nel frattempo invece di bloccarsi. Ogni metodo "async def" va
#   chiamato con "await". Vedi https://docs.python.org/3.12/library/asyncio.html
# - Type hint (es. "text: str", "-> str"): annotazioni che dicono che tipo di dato ci si aspetta.
#   Python non le fa rispettare a runtime, ma aiutano editor e strumenti come mypy.
# - @lru_cache: decoratore che memorizza il risultato di una funzione. Qui serve a creare il
#   provider UNA sola volta e riusarlo (vedi get_llm e get_embedder).
# - match / case: "switch" moderno di Python 3.10+, confronta un valore con più casi.
# - Eccezioni (raise / try / except): meccanismo per segnalare errori. "raise X from e" conserva
#   l'errore originale per capire la causa.
#
# LIBRERIE ESTERNE
# - httpx (https://www.python-httpx.org/): client HTTP asincrono, serve per parlare con Ollama.
# - anthropic (https://docs.anthropic.com/en/api/client-sdks): SDK ufficiale per l'API di Claude.
#   Nota: nel pyproject.toml il requisito è "anthropic>=0.75" e non abbiamo trovato un uv.lock
#   con la versione esatta, quindi non posso confermare la versione installata. Anche i parametri
#   "betas", "fallbacks" e "output_config" usati più sotto sono specifici di una versione recente
#   dell'API: verificali nella documentazione Anthropic prima di modificarli.
# ------------------------------------------------------------------------------------------------

# Import: "prendi" librerie della standard library di Python (hashlib = impronte MD5, math =
# radici quadrate, re = espressioni regolari per cercare pezzi di testo).
import hashlib
import math
import re

# lru_cache: decoratore che ricorda il risultato di una funzione (vedi get_llm).
from functools import lru_cache

# Protocol: serve a definire interfacce (vedi LLMProvider ed Embedder più sotto).
from typing import Protocol

# SDK ufficiale di Anthropic (Claude) e client HTTP asincrono (per Ollama). Sono librerie
# esterne installate tramite pyproject.toml, non fanno parte di Python.
import anthropic
import httpx

# Importiamo "settings", l'oggetto con tutta la configurazione letta dalle variabili d'ambiente
# (vedi app/config.py).
from app.config import settings

# "Alias" di tipo: Message è solo un nome più corto per dire "un dizionario con chiavi e valori
# stringa". Un messaggio di chat ha "role" (chi parla) e "content" (il testo).
Message = dict[str, str]  # {"role": "user" | "assistant", "content": str}


# Eccezione personalizzata: una classe che eredita da RuntimeError (errore a tempo di esecuzione).
# Serve a distinguere "il modello non è raggiungibile" da altri bug. Il "pass" dice "non
# aggiungo nulla di speciale, solo un nome nuovo". main.py la trasforma in risposta HTTP 503.
class LLMError(RuntimeError):
    pass


# Protocol = contratto: qualunque oggetto con un metodo async chat(system, messages, json_mode)
# che restituisce una stringa "è" un LLMProvider, senza doverlo dichiarare esplicitamente.
# "..." al posto del corpo significa "solo firma, l'implementazione sta altrove".
# Parametri: system = istruzioni di sistema (il "ruolo" del tutor), messages = la conversazione,
# json_mode = se True chiediamo al modello di rispondere in JSON.
# "-> str" indica il tipo restituito.
class LLMProvider(Protocol):
    async def chat(self, system: str, messages: list[Message], json_mode: bool = False) -> str: ...


# Stesso ragionamento del Protocol sopra, ma per il calcolo di embeddings: trasformare una lista
# di testi in una lista di vettori (liste di numeri decimali). Due testi simili danno vettori
# vicini, ed è la base della ricerca semantica (RAG).
class Embedder(Protocol):
    async def embed(self, texts: list[str]) -> list[list[float]]: ...


# Implementazione del provider "Ollama": modelli che girano sul nostro computer o in Docker.
class OllamaProvider:
    # __init__ è il costruttore: viene eseguito quando creiamo l'oggetto con OllamaProvider(...).
    # "self" è l'oggetto stesso. Qui salviamo URL e nome del modello nell'oggetto.
    def __init__(self, url: str, model: str):
        # rstrip("/") toglie eventuali "/" finali dall'URL, così non si creano doppi "//".
        self.url, self.model = url.rstrip("/"), model
        # Creiamo un client HTTP con timeout di 300 secondi (i modelli locali possono essere lenti).
        self.client = httpx.AsyncClient(timeout=300)  # one pool per process (get_llm is cached)

    # Metodo che chiede a Ollama una risposta di chat.
    async def chat(self, system: str, messages: list[Message], json_mode: bool = False) -> str:
        # Il corpo della richiesta nel formato che Ollama si aspetta (vedi doc API di Ollama).
        # stream False = vogliamo la risposta intera in un colpo solo, non a pezzi.
        body = {
            "model": self.model,
            "stream": False,
            # Il messaggio di sistema va per primo, poi "*messages" sparge dentro la lista
            # tutti i messaggi della conversazione (l'asterisco = "espandi questa lista").
            "messages": [{"role": "system", "content": system}, *messages],
        }
        # Se serve un JSON valido, Ollama accetta il campo "format": "json".
        if json_mode:
            body["format"] = "json"
        # try/except: proviamo la chiamata; se la rete o Ollama falliscono, catturiamo l'errore.
        try:
            # await: aspettiamo la risposta senza bloccare il resto del server.
            # f"..." sono stringhe con variabili dentro le graffe.
            r = await self.client.post(f"{self.url}/api/chat", json=body)
            # Se la risposta ha uno stato di errore (4xx, 5xx) questa riga solleva un'eccezione.
            r.raise_for_status()
        # Trasformiamo l'errore tecnico di httpx in un LLMError "comprensibile" per il resto
        # dell'app.
        # "from e" conserva l'errore originale come causa, utile per il debug.
        except httpx.HTTPError as e:
            raise LLMError(f"Ollama unavailable at {self.url}: {e}") from e
        # r.json() converte la risposta in un dizionario Python; prendiamo il testo generato.
        return r.json()["message"]["content"]


# Implementazione del provider per gli embeddings, sempre tramite Ollama.
class OllamaEmbedder:
    # Stessa logica del costruttore di OllamaProvider.
    def __init__(self, url: str, model: str):
        self.url, self.model = url.rstrip("/"), model
        self.client = httpx.AsyncClient(timeout=300)

    # Riceve una lista di testi e restituisce una lista di vettori, uno per testo.
    async def embed(self, texts: list[str]) -> list[list[float]]:
        try:
            # Chiediamo a Ollama di "trasformare in numeri" tutti i testi in una sola richiesta.
            r = await self.client.post(
                f"{self.url}/api/embed", json={"model": self.model, "input": texts}
            )
            r.raise_for_status()
        # Stesso schema di gestione errori di OllamaProvider.chat.
        except httpx.HTTPError as e:
            raise LLMError(f"Ollama embeddings unavailable at {self.url}: {e}") from e
        # Ollama risponde con un campo "embeddings" contenente la lista dei vettori.
        return r.json()["embeddings"]


# Implementazione del provider "Anthropic": usa Claude tramite API cloud (serve una chiave).
class AnthropicProvider:
    # Crea il client ufficiale di Anthropic con la chiave API e memorizza il nome del modello.
    # "Async" indica la versione asincrona del client, che si usa con "await".
    def __init__(self, api_key: str, model: str):
        self.client = anthropic.AsyncAnthropic(api_key=api_key)
        self.model = model

    async def chat(self, system: str, messages: list[Message], json_mode: bool = False) -> str:
        # Anthropic non ha un'opzione "format json" come Ollama: aggiungiamo la richiesta
        # direttamente alle istruzioni di sistema. "+=" concatena una stringa a quella esistente.
        if json_mode:
            system += "\n\nRespond with a single valid JSON object and nothing else."
        try:
            # Chiamata all'API di Claude. Nota: usiamo "client.beta.messages.create", cioè la
            # sezione "beta" dell'SDK, che contiene funzioni ancora in sperimentazione.
            # I parametri sono quelli documentati da Anthropic per la versione in uso.
            response = await self.client.beta.messages.create(
                model=self.model,
                # Limite massimo di token (pezzi di parola) nella risposta.
                max_tokens=16000,
                system=system,
                messages=messages,
                # Chiediamo a Claude uno sforzo di ragionamento "basso": per tutoraggio e
                # riassunti non serve un ragionamento lungo, e così la risposta è più veloce.
                output_config={"effort": "low"},  # tutoring/summaries don't need deep thinking
                # Funzionalità beta attivate per questa chiamata (vedi doc Anthropic: il nome
                # contiene una data, quindi è una versione specifica).
                betas=["server-side-fallback-2026-07-01"],
                # Se il modello principale non è disponibile, Anthropic prova un modello di
                # ripiego ("default"). Verificare nella documentazione prima di modificarlo.
                fallbacks="default",
            )
        # anthropic.APIError è la classe base di tutti gli errori dell'SDK: li convertiamo in
        # LLMError, come fatto con Ollama.
        except anthropic.APIError as e:
            raise LLMError(f"Claude API error: {e}") from e
        # stop_reason indica perché il modello ha smesso di scrivere. "refusal" = Claude ha
        # rifiutato la richiesta per motivi di sicurezza: lo segnaliamo come errore.
        if response.stop_reason == "refusal":
            raise LLMError("Claude declined this request.")
        # Claude restituisce una lista di "blocchi" (testo, ragionamento, ecc.). Qui uniamo
        # solo quelli di tipo testo in una stringa unica. "join" concatena una lista di stringhe.
        return "".join(b.text for b in response.content if b.type == "text")


# Provider finto, usato solo in test e CI: non chiama nessun modello, quindi i risultati sono
# sempre uguali e prevedibili. La stringa tra triple virgolette sotto è la "docstring"
# della classe, cioè la sua documentazione (Python la conserva in help() e negli strumenti).
class FakeProvider:
    """Deterministic provider for tests/CI: echoes the cited sources from the context."""

    async def chat(self, system: str, messages: list[Message], json_mode: bool = False) -> str:
        # re.findall cerca tutte le occorrenze del pattern "[numero]" nel testo di sistema
        # (es. "[1]", "[2]") e restituisce la lista dei numeri trovati come stringhe.
        cited = sorted(set(re.findall(r"\[(\d+)\]", system)), key=int)
        # Ricostruisce la lista delle citazioni nel formato "[1] [2]".
        refs = " ".join(f"[{n}]" for n in cited)
        # Restituisce una risposta finta che ripete l'ultima domanda e le citazioni trovate.
        # messages[-1] = ultimo elemento della lista (l'ultimo messaggio);
        # .strip() toglie gli spazi in eccesso.
        return f"Fake answer to: {messages[-1]['content']} {refs}".strip()


# Embedder finto: non usa un'IA vera, ma conta le parole. Testi con le stesse parole danno
# vettori simili, abbastanza per testare la ricerca senza un modello.
class FakeEmbedder:
    """Bag-of-words hashing embedder: same words → similar vectors. Good enough for tests."""

    async def embed(self, texts: list[str]) -> list[list[float]]:
        out = []
        # Ripetiamo la stessa logica per ogni testo della lista.
        for text in texts:
            # Vettore di zeri lungo quanto vuole la configurazione (768 numeri di default).
            v = [0.0] * settings.embed_dim
            # Estraiamo le parole (solo lettere minuscole e cifre) dal testo in minuscolo.
            for word in re.findall(r"[a-z0-9]+", text.lower()):
                # Calcoliamo un'impronta MD5 della parola, la convertiamo in numero e la usiamo
                # come "posizione" nel vettore (il % tiene il risultato entro la lunghezza).
                # "+= 1" conta quante volte appare quella parola.
                v[int(hashlib.md5(word.encode()).hexdigest(), 16) % settings.embed_dim] += 1
            # Normalizzazione: dividiamo per la lunghezza del vettore così che abbia lunghezza 1.
            # "or 1.0" evita la divisione per zero se il testo era vuoto.
            norm = math.sqrt(sum(x * x for x in v)) or 1.0
            # Dividiamo ogni elemento per la norma e aggiungiamo il vettore al risultato.
            out.append([x / norm for x in v])
        return out


# Decide quale provider usare, leggendo la configurazione. Ordine di priorità:
# 1) LLM_PROVIDER esplicito nel .env, 2) Anthropic se c'è una chiave API, 3) altrimenti Ollama.
# "a or b" in Python restituisce il primo valore "vero" (non vuoto): è una scorciatoia comoda.
def provider_name() -> str:
    return settings.llm_provider or ("anthropic" if settings.anthropic_api_key else "ollama")


# @lru_cache (least recently used cache): la funzione viene eseguita una volta sola e il risultato
# viene riutilizzato. Così esiste un solo client HTTP per processo invece di crearne uno a ogni
# richiesta. Il "@" si chiama decoratore: modifica la funzione che segue.
@lru_cache
def get_llm() -> LLMProvider:
    # match/case: confronta il nome del provider con i casi e restituisce l'oggetto giusto.
    match provider_name():
        case "anthropic":
            return AnthropicProvider(settings.anthropic_api_key, settings.anthropic_model)
        case "fake":
            return FakeProvider()
        # "_" è il caso "tutto il resto": qualsiasi altro valore usa Ollama.
        case _:
            return OllamaProvider(settings.ollama_url, settings.ollama_chat_model)


# Come get_llm, ma per gli embeddings. Anthropic non offre embeddings, quindi usiamo sempre
# Ollama, tranne nei test dove usiamo il finto embedder.
@lru_cache
def get_embedder() -> Embedder:
    if provider_name() == "fake":
        return FakeEmbedder()
    return OllamaEmbedder(settings.ollama_url, settings.ollama_embed_model)
