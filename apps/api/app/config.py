# =============================================================================
# config.py - LA CONFIGURAZIONE CENTRALE DELL'API
#
# Questo file raccoglie in un unico posto tutti i "parametri" del backend
# (indirizzo del database, chiavi API, modelli AI, fuso orario, ecc.), cosi'
# che il codice non contenga valori "scritti a mano" sparsi ovunque.
#
# Ruolo nel progetto:
# - Viene importato quasi da tutti i moduli di apps/api/app (db.py, models.py,
#   main.py, llm.py, sync.py, news.py, routes/*.py, alembic/env.py, tests/*).
#   Per esempio db.py legge `settings.database_url` per creare la connessione.
# - Non viene mai chiamato come funzione: si limita a creare l'oggetto
#   `settings` una volta sola, all'avvio, e tutti lo condividono (vedi in fondo).
#
# Come funziona "pydantic-settings" (libreria usata qui, versione >=2.6 da
# pyproject.toml; doc ufficiale: https://docs.pydantic.dev/latest/concepts/pydantic_settings/):
# - Ogni campo della classe Settings (es. `database_url: str`) viene riempito
#   automaticamente da una variabile d'ambiente con lo stesso nome in MAIUSCOLO
#   (DATABASE_URL). Il confronto non distingue maiuscole/minuscole.
# - Se la variabile non esiste, si usa il valore scritto dopo il `=` (il default).
# - Se la variabile esiste, il suo valore viene convertito al tipo indicato dopo
#   i `:` (str, int, bool, Path, list[str]...). Un valore non convertibile
#   fa fallire l'avvio con un errore chiaro: e' una sicurezza, non un bug.
# - Le variabili arrivano da: l'ambiente del sistema/Docker (docker-compose.yml)
#   oppure dal file `.env` nella cartella da cui parte il processo.
#
# Concetti Python usati nel file:
# - `class Settings(BaseSettings)`: la classe EREDITA da BaseSettings, cioe'
#   prende da essa tutta la logica di lettura delle variabili d'ambiente.
# - Type hint (`: str`, `: int`, `list[str]`): annotazioni che dicono il tipo
#   del valore. Pydantic le usa sia per convertire sia per validare.
# - `Path` (dalla libreria standard `pathlib`): rappresenta un percorso di file
#   o cartella in modo oggetto, invece di una semplice stringa.
# =============================================================================

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# La classe raccoglie TUTTE le impostazioni: ogni riga `nome: tipo = valore`
# e' una variabile d'ambiente (es. `content_dir` <-> CONTENT_DIR).
class Settings(BaseSettings):
    # `model_config` e' il "pannello di controllo" di pydantic-settings:
    # - env_file=".env": se esiste, legge le variabili da quel file (utile in locale).
    # - extra="ignore": le variabili sconosciute nell'ambiente (es. REAL_ROADMAP
    #   in docker-compose.yml) vengono ignorate invece di far fallire l'avvio.
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Indirizzo del database PostgreSQL. Il prefisso `postgresql+asyncpg://`
    # dice a SQLAlchemy di usare il driver asincrono "asyncpg".
    # `db` e' il nome del servizio nel docker-compose: Docker lo risolve in un IP.
    database_url: str = "postgresql+asyncpg://ycdi:ycdi@db:5432/ycdi"
    # Cartella con i contenuti (lezioni, feed, citazioni). Path = percorso oggetto.
    content_dir: Path = Path("/content")
    # Percorso del file ROADMAP.md, la "fonte di verita'" del programma di studio.
    roadmap_path: Path = Path("/roadmap/ROADMAP.md")
    # Fuso orario usato dallo scheduler (orari delle attivita' automatiche)
    # e dai calcoli sulle date.
    timezone: str = "Europe/Rome"

    # Sezione AI (vedi app/llm.py che legge questi valori).
    # "ollama" | "anthropic" | "fake". Empty = anthropic if a key is set, else ollama.
    # Il valore "fake" restituisce risposte finte e deterministiche: usato nei test e nell'e2e.
    llm_provider: str = ""
    # Ollama e' un programma che esegue modelli AI in locale. Questo e' il suo indirizzo.
    ollama_url: str = "http://ollama:11434"
    # Modello di chat (generazione di risposte) e modello di embedding
    # (trasforma il testo in vettori di numeri, usati per la ricerca semantica).
    ollama_chat_model: str = "llama3.2:3b"
    ollama_embed_model: str = "nomic-embed-text"
    # Chiave segreta per le API di Anthropic (a pagamento). Vuota = non usata.
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-opus-5-5"

    # Dimensione del vettore prodotto dal modello di embedding (768 numeri per testo).
    # Deve coincidere con la colonna pgvector nel database (vedi app/models.py).
    embed_dim: int = 768  # nomic-embed-text output size
    # Se True, lo scheduler (APScheduler) avvia i lavori automatici in background.
    scheduler_enabled: bool = True
    # Origini (domini) autorizzati a chiamare l'API direttamente dal browser (CORS).
    # `list[str]` = lista di testi; da env va scritta come JSON, es. ["http://..."].
    cors_origins: list[str] = ["http://localhost:3000"]


# Creiamo UNA SOLA istanza (oggetto) di Settings: qui avviene la lettura reale
# delle variabili d'ambiente. Gli altri file fanno `from app.config import settings`
# e ricevono questo stesso oggetto (pattern "singleton").
# Importante: viene eseguito al momento dell'import, quindi i test devono impostare
# le variabili d'ambiente PRIMA di importare `app` (vedi tests/conftest.py).
settings = Settings()
