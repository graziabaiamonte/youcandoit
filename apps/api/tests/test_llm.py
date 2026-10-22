# ------------------------------------------------------------------------------------------------
# TEST DEL PROVIDER LLM
# Questo file verifica una sola cosa: la funzione provider_name() di app/llm.py decide quale
# "motore" AI usare (Ollama, Anthropic o fake) in base alla configurazione. È un test "unitario":
# controlla un pezzo piccolo e isolato del codice, senza chiamare davvero nessun modello.
#
# COME SI LANCIA
# Con Docker, dalla radice del progetto:
# docker compose run --rm -v "$PWD/apps/api:/app" api pytest -q tests/test_llm.py
# pytest cerca da solo i file che iniziano con "test_" nella cartella tests/.
#
# COME FUNZIONA UN TEST (doc: https://docs.pytest.org/en/stable/)
# - Una funzione il cui nome inizia con "test_" è un test. Se tutte le "assert" passano, il test
#   è verde; se una "assert" è falsa, il test fallisce con un messaggio.
# - assert: "asserisci" che una condizione sia vera, es. assert x == 1.
# - monkeypatch: fixture built-in di pytest (doc:
#   https://docs.pytest.org/en/stable/how-to/monkeypatch.html). Cambia temporaneamente un
#   attributo (monkeypatch.setattr) e, alla fine del test, pytest lo ripristina: i test non si
#   influenzano a vicenda.
# - conftest.py imposta LLM_PROVIDER=fake per tutta la suite. Questo test lo svuota per provare
#   la logica di scelta reale.
#
# COSA VERIFICA (la logica di provider_name() in app/llm.py):
#   llm_provider vuoto + nessuna chiave Anthropic  -> "ollama"    (default locale)
#   llm_provider vuoto + chiave Anthropic presente -> "anthropic" (cloud, se c'è una chiave)
#   llm_provider = "ollama" esplicito              -> "ollama"    (la scelta esplicita vince)
# ------------------------------------------------------------------------------------------------

# Importiamo il modulo app/llm.py: "llm.provider_name" è la funzione che vogliamo testare.
from app import llm

# Importa "settings", la configurazione letta da app/config.py (variabili d'ambiente).
# Lo modifichiamo temporaneamente dentro il test per simulare scenari diversi.
from app.config import settings


# Funzione di test: pytest la trova perché il nome inizia con "test_". Il parametro "monkeypatch"
# non lo creiamo noi: pytest lo "inietta" perché il suo nome è scritto tra le parentesi.
def test_provider_selection(monkeypatch):
    # Primo scenario: svuotiamo la scelta esplicita (questo sovrascrive LLM_PROVIDER=fake).
    # setattr(oggetto, "nome", valore) cambia quel valore solo per la durata di questo test.
    monkeypatch.setattr(settings, "llm_provider", "")
    # Nessuna chiave Anthropic: senza scelta esplicita il default è il modello locale Ollama.
    monkeypatch.setattr(settings, "anthropic_api_key", "")
    # assert: se l'uguaglianza a destra non è vera, il test fallisce.
    assert llm.provider_name() == "ollama"
    # Secondo scenario: chiave presente. "sk-test" è una chiave finta, non una vera chiave API.
    monkeypatch.setattr(settings, "anthropic_api_key", "sk-test")
    # Con una chiave e nessuna scelta esplicita, il provider diventa Anthropic (cloud).
    assert llm.provider_name() == "anthropic"
    # Terzo scenario: scelta esplicita "ollama" anche con la chiave presente.
    monkeypatch.setattr(settings, "llm_provider", "ollama")
    # La configurazione esplicita ha la precedenza sulla sola presenza della chiave.
    assert llm.provider_name() == "ollama"  # explicit choice wins over a present key
