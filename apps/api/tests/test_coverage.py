# ============================================================================
# File: apps/api/tests/test_coverage.py
#
# Cos'è: un TEST automatico (pytest) che controlla che i collegamenti tra
# "temi/competenze richiesti" e "sessioni del roadmap" non siano rotti.
#
# Perché esiste: content/coverage.yaml dice quali sessioni insegnano ogni tema
# (es. "rag" -> sessioni 9.3.x) e ogni competenza richiesta dalle offerte di lavoro.
# Se una sessione viene rinominata o rimossa da ROADMAP.md, quel riferimento
# diventa "morto": questo test fallisce per avvisarti in anticipo.
#
# Come si collega al resto del progetto:
# - ROADMAP.md: fonte di verità del curriculum. Viene letto e "parsato" (analizzato)
#   da app/roadmap_parser.py, che produce tracce > moduli > sessioni, ognuna con un id
#   (es. "9.3.1").
# - content/coverage.yaml: il file da verificare. YAML è un formato di testo con
#   chiavi e liste, usato spesso per le configurazioni.
# - In Docker il roadmap è montato in /roadmap e il contenuto in /content (sola lettura).
#   I test eseguiti in locale usano le variabili d'ambiente impostate in tests/conftest.py.
#
# Concetti Python usati in questo file:
# - pytest: framework di test. Ogni funzione il cui nome inizia con "test_" viene
#   eseguita automaticamente. Una "assert" (affermazione) fa fallire il test se la
#   condizione è falsa. Doc: https://docs.pytest.org/
# - Decoratore (@...): una riga che inizia con "@" sopra una funzione ne modifica
#   il comportamento senza toccarne il corpo. Qui @pytest.mark.skipif salta il test
#   quando la condizione è vera.
# - Comprensioni (list/set/dict comprehension): modo compatto di costruire una
#   lista {}, un insieme o un dizionario con un ciclo "for" e un filtro "if".
# ============================================================================

# Modulo standard di Python: accesso all'ambiente del sistema (os.environ).
import os

# Path (dal modulo pathlib): rappresenta un percorso di file come oggetto, con metodi
# comodi come .exists() e .read_text().
from pathlib import Path

# Framework di test: fornisce il decoratore skipif e il riconoscimento dei test.
import pytest

# PyYAML: legge il testo YAML e lo trasforma in dizionari e liste Python.
import yaml

# Importa due funzioni dal nostro parser. "app" è la cartella apps/api/app/.
from app.roadmap_parser import iter_sessions, parse_roadmap

# Percorso di ROADMAP.md. os.environ.get(chiave, default) legge la variabile REAL_ROADMAP
# se è impostata (in docker-compose.yml), altrimenti usa il default /roadmap/ROADMAP.md.
ROADMAP = Path(os.environ.get("REAL_ROADMAP", "/roadmap/ROADMAP.md"))
# Percorso di coverage.yaml. os.environ["CONTENT_DIR"] (senza .get) è obbligatoria:
# se la variabile manca il modulo si blocca con KeyError. Il "/" tra due Path
# concatena i percorsi (come una cartella + un nome file).
COVERAGE = Path(os.environ["CONTENT_DIR"]) / "coverage.yaml"


# skipif: se ROADMAP.md non esiste (non montato), il test viene SALTATO, non fallito.
# reason= è il messaggio mostrato da pytest quando il test viene saltato.
@pytest.mark.skipif(not ROADMAP.exists(), reason="ROADMAP.md not mounted")
# Funzione di test: pytest la trova perché il nome inizia con "test_". Non riceve
# parametri e non restituisce nulla; verifica tutto con "assert" alla fine.
def test_every_theme_and_job_skill_maps_to_existing_sessions():
    # Insieme (set {}) di tutti gli id di sessione del roadmap. parse_roadmap legge il
    # testo; iter_sessions scorre tutte le sessioni come tuple (traccia, modulo, sessione).
    # "_" è il nome convenzionale per una variabile che non useremo. s.id è l'id, es. "9.3.1".
    # L'insieme rende veloce il controllo "è presente?" con l'operatore "in".
    sessions = {s.id for _, _, s in iter_sessions(parse_roadmap(ROADMAP.read_text()))}
    # safe_load legge il file YAML in un dizionario Python. "safe" significa che non
    # esegue codice contenuto nel file: è la versione sicura da usare.
    coverage = yaml.safe_load(COVERAGE.read_text())
    # Dizionario dei problemi trovati. Chiave: "gruppo/nome" (es. "themes/rag").
    # Valore: gli id mancanti, oppure la stringa "no sessions" se la lista è vuota.
    missing = {
        # Chiave: f-string, cioè una stringa in cui {...} viene sostituito dal valore della
        # variabile. Qui diventa, per esempio, "themes/rag".
        f"{group}/{name}": [i for i in map(str, ids) if i not in sessions] or "no sessions"
        # Ciclo esterno: le due sezioni del file YAML, "themes" (temi) e "job_skills".
        for group in ("themes", "job_skills")
        # Ciclo interno: per ogni voce, name è il nome e ids la lista di id. .items() dà
        # coppie (chiave, valore).
        for name, ids in coverage[group].items()
        # Filtro: tiene solo le voci problematiche, cioè lista vuota (not ids) oppure almeno
        # un id non presente tra le sessioni. any(...) è True se almeno un elemento lo è.
        if not ids or any(str(i) not in sessions for i in ids)
    }
    # Valore della voce: map(str, ids) converte ogni id in stringa (YAML può leggere
    # alcuni numeri come numeri), poi si tengono solo quelli non trovati. "or" usa
    # "no sessions" quando la lista è vuota (una lista vuota è considerata falsa in Python).
    # Il test passa se "missing" è vuoto: "not missing" è True per un dizionario vuoto.
    # Altrimenti pytest mostra il dizionario, indicando cosa è rotto.
    assert not missing
