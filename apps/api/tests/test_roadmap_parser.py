# ============================================================================
# FILE: apps/api/tests/test_roadmap_parser.py
#
# COS'È: file di test (pytest) per il parser di ROADMAP.md, cioè app/roadmap_parser.py.
# Un test è una funzione il cui nome inizia con `test_`: pytest la esegue e la segna come
# riuscita o fallita. Dentro ci sono "assert" (affermazioni): se una è falsa, il test fallisce.
#
# COME SI ESEGUE: dalla root del progetto (vedi CLAUDE.md):
#   docker compose run --rm -v "$PWD/apps/api:/app" api pytest -q tests/test_roadmap_parser.py
#
# DOVE SI COLLEGA:
# - app/roadmap_parser.py: il codice testato (parse_roadmap, validate, iter_sessions).
# - tests/fixtures/roadmap.md: un ROADMAP.md piccolo e finto, usato come "dato di prova".
#   Contiene un'appendice dopo le tracce, per verificare che il parser si fermi lì.
# - ROADMAP.md reale (in Docker: /roadmap/ROADMAP.md): usato dall'ultimo test, se presente.
# - tests/conftest.py: pytest lo carica da solo prima dei test (configurazione condivisa).
#
# CONCETTI PYTHON/PYTEST USATI:
# - import: porta dentro il file funzioni o moduli da altri file. `from x import y`
#   prende solo `y` da `x`.
# - pytest: il framework di test. Doc: https://docs.pytest.org/en/stable/
# - assert: se la condizione dopo `assert` è falsa, il test fallisce. Doc:
#   https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement
# - pytest.raises(X): il blocco `with` DEVE sollevare un'eccezione X, altrimenti il test
#   fallisce. Doc: https://docs.pytest.org/en/stable/reference/reference.html#pytest.raises
# - pytest.mark.skipif(condizione, reason=...): salta il test se la condizione è vera.
#   Doc: https://docs.pytest.org/en/stable/reference/reference.html#pytest.mark.skipif
# - VERSIONE: nessun framework web coinvolto. La versione di pytest non è stata verificata
#   in questo passaggio (controllare pyproject.toml o il Dockerfile).
# ============================================================================

# `os` (libreria standard) serve a leggere le variabili d'ambiente con `os.environ`.
import os

# `Path` rappresenta un percorso di file in modo portabile (macOS, Linux, Windows).
from pathlib import Path

# pytest: framework di test. Ci fornisce `pytest.raises` e `pytest.mark`.
import pytest

# Importa le funzioni da testare dal modulo app/roadmap_parser.py.
# `RoadmapError` è l'eccezione personalizzata che il parser solleva in caso di errore.
from app.roadmap_parser import RoadmapError, iter_sessions, parse_roadmap, validate

# Legge il file fixtures/roadmap.md come testo (una stringa).
# `__file__` è il percorso di questo file; `.parent` risale alla cartella tests/;
# l'operatore `/` unisce i percorsi; `read_text()` legge tutto il contenuto.
FIXTURE = (Path(__file__).parent / "fixtures" / "roadmap.md").read_text()
# Percorso del ROADMAP.md reale. `os.environ.get(nome, default)` legge la variabile
# REAL_ROADMAP se esiste, altrimenti usa /roadmap/ROADMAP.md (il percorso montato in Docker).
REAL = Path(os.environ.get("REAL_ROADMAP", "/roadmap/ROADMAP.md"))


# Verifica che il parser costruisca l'albero corretto e si fermi all'appendice.
def test_parses_tree_and_stops_at_appendix():
    # Esegue il parser sul testo di prova: ottiene la lista delle tracce.
    tracks = parse_roadmap(FIXTURE)
    # Le tracce trovate devono essere esattamente la 0 e la 1 (l'appendice non ne crea).
    assert [t.id for t in tracks] == ["0", "1"]
    # Prende la prima sessione: traccia 0, primo modulo, prima sessione (gli indici partono da 0).
    s = tracks[0].modules[0].sessions[0]
    # L'id della sessione deve essere 0.1.1.
    assert s.id == "0.1.1"
    # Il testo della riga `> Outcomes:` salvato senza il prefisso.
    assert s.outcomes == "Navigate the file system and run commands confidently."
    # I sotto-capitoli (le righe `- ...`) nell'ordine del file, senza la chiave {#N}.
    assert s.subchapters == ["What a shell is", "Files and directories"]
    # Dalla riga `Sources:` il parser estrae gli URL dei link Markdown [titolo](url), in ordine.
    # `[x["url"] for x in ...]` è una list comprehension: crea una lista dei soli URL.
    assert [x["url"] for x in s.sources] == [
        "https://missing.csail.mit.edu/",
        "https://linuxjourney.com/",
    ]
    # Raccoglie gli URL di TUTTE le sessioni; `iter_sessions` le scorre in ordine.
    # Qui `s` è solo la variabile del ciclo interno: non è la sessione di sopra.
    all_urls = [x["url"] for _, _, s in iter_sessions(tracks) for x in s.sources]
    # Un link che sta nell'appendice non deve comparire: così verifichiamo che il parser si sia
    # fermato davvero prima dell'appendice.
    assert "https://example.com" not in all_urls
    # Il file di prova è ben formato: validate() deve restituire una lista vuota (nessun problema).
    assert validate(tracks) == []


# Un modulo con id di un'altra traccia (1.1 dentro la traccia 0) deve far fallire il parser.
def test_rejects_misplaced_ids():
    # Il blocco `with` si aspetta che venga sollevato un RoadmapError: se non succede, il test
    # fallisce.
    with pytest.raises(RoadmapError):
        # Testo minimo: traccia 0 con un modulo 1.1 che non le appartiene.
        # In una stringa Python, `\n` significa "a capo".
        parse_roadmap("# Track 0 — A\n## Module 1.1 — wrong track\n")


# Controlla che validate() segnali gli id di sessione duplicati e le sessioni senza fonti.
def test_validate_reports_problems():
    # Testo con due sessioni che hanno lo stesso id (0.1.1) e nessuna riga Sources.
    # Il parser non si lamenta: questi controlli sono compito di validate().
    tracks = parse_roadmap(
        "# Track 0 — A\n## Module 0.1 — B\n### Session 0.1.1 — C\n### Session 0.1.1 — D\n"
    )
    # Raccoglie la lista dei messaggi di problema trovati.
    problems = validate(tracks)
    # `in` controlla che il messaggio esatto sia presente nella lista.
    assert "duplicate session id 0.1.1" in problems
    assert "0.1.1: no sources" in problems


# `@pytest.mark.skipif`: salta questo test se la condizione è vera. Qui: se il ROADMAP reale
# non esiste (es. fuori da Docker), il test viene saltato invece di fallire.
@pytest.mark.skipif(not REAL.exists(), reason="ROADMAP.md not mounted")
# Test sul ROADMAP reale: deve avere almeno 10 tracce e nessun problema di validazione.
def test_real_roadmap_is_valid():
    # Legge il file reale e lo passa al parser, come nel test precedente.
    tracks = parse_roadmap(REAL.read_text())
    # Controllo di sanità: `len` conta gli elementi della lista.
    assert len(tracks) >= 10
    # Il ROADMAP reale deve essere ben formato, altrimenti l'API non partirebbe.
    assert validate(tracks) == []


# Le chiavi {#N} restano legate al testo anche se le righe vengono riordinate.
# È la proprietà che permette di riordinare il ROADMAP senza perdere il progresso.
def test_subchapter_keys_survive_reordering():
    # Stessa catena di prima: prima sessione della prima traccia.
    s = parse_roadmap(FIXTURE)[0].modules[0].sessions[0]
    # Le chiavi nell'ordine originale del file.
    assert s.subchapter_keys == ["1", "2"]
    # `.replace(vecchio, nuovo)` crea una COPIA del testo con le due righe scambiate.
    # FIXTURE resta invariata: le stringhe in Python non si modificano sul posto.
    swapped = FIXTURE.replace(
        "- What a shell is {#1}\n- Files and directories {#2}",
        "- Files and directories {#2}\n- What a shell is {#1}",
    )
    # Analizza il testo riordinato.
    s = parse_roadmap(swapped)[0].modules[0].sessions[0]
    # `zip` accoppia chiave e testo nella stessa posizione; `dict` li trasforma in un
    # dizionario {chiave: testo}. `strict=True` (Python 3.10+) fallisce se le liste hanno
    # lunghezze diverse.
    # Ogni chiave deve puntare ancora allo stesso testo, indipendentemente dall'ordine.
    assert dict(zip(s.subchapter_keys, s.subchapters, strict=True)) == {
        "1": "What a shell is",
        "2": "Files and directories",
    }


# Verifica i controlli sulle chiavi {#N} dei sotto-capitoli, usando un testo costruito al volo.
def test_validate_requires_unique_subchapter_keys():
    # Modello di una sessione completa e ben formata. `{}` è un segnaposto: `.format()`
    # lo riempie con i sotto-capitoli di ogni caso di prova. `\n` è un "a capo".
    base = "# Track 0 — A\n## Module 0.1 — B\n### Session 0.1.1 — C\n> Outcomes: x\n{}Sources: [t](https://t.co)\n"
    # Un sotto-capitolo senza {#N} deve essere segnalato come problema.
    assert validate(parse_roadmap(base.format("- a\n"))) == ["0.1.1: subchapter without a {#N} key"]
    # Due sotto-capitoli con la stessa chiave {#1} devono essere segnalati come duplicato.
    assert validate(parse_roadmap(base.format("- a {#1}\n- b {#1}\n"))) == [
        "0.1.1: duplicate subchapter key"
    ]
