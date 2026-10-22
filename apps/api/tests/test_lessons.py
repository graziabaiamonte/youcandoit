# ===========================================================================
# COSA FA QUESTO FILE
# ---------------------------------------------------------------------------
# Test automatici per le LEZIONI in content/lessons/ (un file .md per sessione).
# Pytest esegue ogni funzione che inizia con test_ e fallisce se un'asserzione (assert) e' falsa.
# Qui verifichiamo che ogni lezione rispetti le regole di content/lessons/README.md
# e che corrisponda a ROADMAP.md: se un titolo o un sottocapitolo cambia, il test avvisa
# prima che la pagina della sessione si rompa.
#
# RELAZIONE COL RESTO DEL PROGETTO
# - ROADMAP.md e' la fonte unica del curriculum: sync.py lo legge all'avvio dell'API.
# - app/roadmap_parser.py trasforma il Markdown in oggetti Python (track, modulo, sessione).
# - app/sync.py fornisce lesson_folder(): calcola il nome della cartella di track e modulo.
# - content/lessons/README.md descrive le regole che questi test fanno rispettare.
# - In Docker ROADMAP.md e content/ sono montati (vedi docker-compose.yml); fuori Docker
#   i test che li richiedono vengono saltati.
#
# CONCETTI PYTHON USATI
# - import: porta dentro il file moduli della libreria standard (os, re, pathlib)
#   o nostri moduli (app). Docs: https://docs.python.org/3/reference/import.html
# - pytest: framework di test. Trova da solo le funzioni test_* e ne mostra gli errori.
#   Docs: https://docs.pytest.org/
# - Decoratori (@pytest.mark.*): righe sopra una funzione che ne cambiano il comportamento
#   (skipif = salta il test, parametrize = lo esegue piu' volte con valori diversi).
#   Docs: https://docs.pytest.org/en/stable/how-to/mark.html
# - Type hint (es. text: str, -> list[str]): annotazioni sui tipi; non cambiano l'esecuzione.
#   Docs: https://docs.python.org/3/library/typing.html
# - Regex (modulo re): modelli di testo per cercare pattern.
#   Docs: https://docs.python.org/3/library/re.html
# - Path (modulo pathlib): percorso di file o cartella come oggetto con metodi.
#   Docs: https://docs.python.org/3/library/pathlib.html
# ===========================================================================

# os: modulo standard per leggere le variabili d'ambiente (os.environ).
import os

# re: modulo standard per le espressioni regolari (regex), cerca pattern nel testo.
import re

# Path: percorso di file o cartella come oggetto (con .exists(), .glob(), ...).
from pathlib import Path

# pytest: libreria di test; fornisce i decoratori @pytest.mark.* e le asserzioni.
import pytest

# Nostro modulo: legge ROADMAP.md e restituisce track, moduli e sessioni.
# iter_sessions(...) appiattisce la struttura in una sequenza di tuple (track, modulo, sessione).
from app.roadmap_parser import iter_sessions, parse_roadmap

# Nostra funzione: nome di cartella di una track o modulo, es. "5 DevOps and Cloud".
from app.sync import lesson_folder

# Percorso del ROADMAP. os.environ.get(chiave, default) legge una variabile d'ambiente;
# se manca usa il valore di default (il secondo argomento). In Docker e' montato in /roadmap.
ROADMAP = Path(os.environ.get("REAL_ROADMAP", "/roadmap/ROADMAP.md"))
# os.environ["CONTENT_DIR"] (senza .get) e' obbligatoria: se manca, Python si ferma con KeyError.
# L'operatore / unisce due percorsi: Path("a") / "b" equivale a "a/b".
LESSONS_DIR = Path(os.environ["CONTENT_DIR"]) / "lessons"
# glob("*/*/*.md") cerca i file .md a tre livelli: <track>/<modulo>/<sessione>.md.
# sorted() li ordina in ordine alfabetico, cosi' l'elenco dei test e' sempre uguale.
LESSONS = sorted(LESSONS_DIR.glob("*/*/*.md"))


# Funzione di aiuto; il _ iniziale indica che e' usata solo dentro questo file.
# Restituisce il contenuto di ogni blocco di codice recintato da ``` con la lingua 'lang'.
def _blocks(text: str, lang: str) -> list[str]:
    # rf"..." = raw f-string: la f inserisce {lang} nel modello, la r lascia i \n come sono.
    # ^ e $ con re.M agiscono su ogni riga; re.S fa includere gli a capo nel punto (.).
    # (.*?) e' un gruppo di cattura non avido: prende il testo fino alla prima chiusura ```.
    # findall restituisce la lista di tutti i gruppi catturati.
    return re.findall(rf"^```{lang}\n(.*?)^```", text, re.M | re.S)


# skipif: salta il test (senza farlo fallire) se ROADMAP.md non esiste (es. fuori da Docker).
@pytest.mark.skipif(not ROADMAP.exists(), reason="ROADMAP.md not mounted")
# parametrize: esegue questo test una volta per ogni file in LESSONS, passandolo in 'path'.
# ids=lambda p: p.stem dà a ogni esecuzione un nome leggibile (lambda = funzione di una riga,
# p.stem = nome del file senza estensione, es. "0.1.1").
@pytest.mark.parametrize("path", LESSONS, ids=lambda p: p.stem)
# Funzione di test: 'path' e' un Path (type hint) che pytest riempie ad ogni esecuzione.
def test_lesson_matches_roadmap(path: Path):
    # Dizionario {id sessione: (track, modulo, sessione)} costruito leggendo il ROADMAP.
    # read_text() legge il file intero come stringa; parse_roadmap la trasforma in oggetti.
    # Comprensione di dizionario: {chiave: valore for elemento in sequenza}.
    where = {s.id: (t, m, s) for t, m, s in iter_sessions(parse_roadmap(ROADMAP.read_text()))}
    # assert: se la condizione e' falsa il test fallisce e mostra il messaggio dopo la virgola.
    # Qui: il file deve avere un id che esiste nel ROADMAP. f"..." inserisce il nome del file.
    assert path.stem in where, f"{path.name} is not a ROADMAP session"
    # Spacchettamento (unpacking): assegna a t, m, session i tre valori della tupla in un colpo.
    t, m, session = where[path.stem]
    # path.parent e' la cartella che contiene il file (il modulo); .name ne da' il nome.
    # Deve coincidere con il nome di cartella calcolato dal ROADMAP.
    assert path.parent.name == lesson_folder(m.id, m.title), "lesson is not in its module's folder"
    # path.parent.parent e' la cartella sopra, cioe' quella della track.
    assert path.parent.parent.name == lesson_folder(t.id, t.title), "module is not in its track"
    # Contenuto completo del file come stringa.
    text = path.read_text()
    # re.sub(modello, sostituto, testo) rimpiazza i pattern: qui svuota i blocchi di codice,
    # cosi' i '## ' scritti dentro il codice non vengono contati come titoli.
    prose = re.sub(r"^```.*?^```", "", text, flags=re.M | re.S)  # `## ` in code isn't a heading
    # Cerca un titolo di primo livello '# ' (H1), vietato perche' il titolo viene da ROADMAP.md.
    # ^ con re.M = inizio di ogni riga; 'not' inverte il risultato (il test passa se NON c'e').
    assert not re.search(r"^# ", prose, re.M), "no H1: the title comes from ROADMAP.md"
    # List comprehension: [espressione for elemento in lista] crea una nuova lista.
    # findall estrae il testo (.+) di ogni riga che inizia con '## '; strip() toglie gli spazi.
    headings = [h.strip() for h in re.findall(r"^## (.+)$", prose, re.M)]
    # I titoli '## ' devono essere identici al ROADMAP: stesso testo e stesso ordine.
    assert headings == session.subchapters
    # all() e' True se ogni elemento e' vero: ogni blocco mermaid deve avere contenuto non vuoto.
    assert all(b.strip() for b in _blocks(text, "mermaid")), "empty ```mermaid block"


# skipif: salta il test se la cartella content/lessons non e' montata.
@pytest.mark.skipif(not LESSONS_DIR.exists(), reason="content/ not mounted")
# Controlla che nessuna lezione sia nel posto sbagliato (fuori dalle cartelle di track/modulo).
def test_no_lessons_outside_module_folders():
    # Nella radice di lessons/ deve restare solo README.md: lista di nomi dei file .md.
    assert [p.name for p in LESSONS_DIR.glob("*.md")] == ["README.md"]
    # glob("*/*.md") cerca file a due livelli (lessons/<track>/x.md): la lista deve essere vuota.
    # 'not' rende vero il test solo quando la lista e' vuota.
    assert not list(LESSONS_DIR.glob("*/*.md")), "lessons go in <track>/<module>/"
