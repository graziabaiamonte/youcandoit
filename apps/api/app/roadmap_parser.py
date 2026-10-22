# ============================================================================
# FILE: apps/api/app/roadmap_parser.py
#
# COS'È: un "parser" (analizzatore) che legge ROADMAP.md, il file di testo
# Markdown con il programma di studio, e lo trasforma in oggetti Python
# organizzati ad albero: Tracce > Moduli > Sessioni > Sotto-capitoli.
#
# PERCHÉ SERVE: il database non si riempie a mano. Ad ogni avvio dell'API
# sync.py chiama parse_roadmap() e validate() e allinea il DB a ciò che c'è
# nel file. ROADMAP.md è la "fonte di verità" del curriculum.
#
# DOVE SI COLLEGA:
# - app/sync.py: sync_roadmap() usa parse_roadmap, validate e RoadmapError.
#   Se validate() trova problemi, l'API NON parte (vedi main.py lifespan).
# - app/routes/roadmap.py: usa iter_sessions() per l'ordine delle sessioni.
# - tests/test_roadmap_parser.py: test unitari su questo file.
# - tests/test_lessons.py e tests/test_coverage.py: usano questo parser sul
#   ROADMAP.md reale per verificare lezioni e mappa delle competenze.
#
# CONCETTI PYTHON USATI:
# - re (espressioni regolari): "sagome" di testo per riconoscere le righe.
#   Doc: https://docs.python.org/3/library/re.html
# - dataclass: decoratore che genera automaticamente __init__ e il resto
#   per una classe che contiene solo dati. Doc:
#   https://docs.python.org/3/library/dataclasses.html
# - type hint (es. `: str`, `-> list[ParsedTrack]`): annotazioni che dicono
#   quale tipo ci si aspetta. Python NON le impone a runtime; servono a chi
#   legge il codice e agli strumenti di analisi. Doc:
#   https://docs.python.org/3/library/typing.html
# - Walrus operator `:=` (Python 3.8+): assegna e confronta in un'unica
#   espressione, es. `if m := RE.match(line):`.
# - Generator expression `(x for x in ...)`: come una lista, ma valori
#   prodotti uno alla volta (pigra, non occupa memoria extra).
#
# VERSIONE: nessun framework esterno. Il codice usa `X | None` e `list[str]`
# che richiedono Python 3.10+. La versione esatta del progetto non è stata
# verificata in questo passaggio (controllare Dockerfile o pyproject).
# ============================================================================

"""Parse ROADMAP.md into a tree. Convention:

# Track N — Name
## Module N.M — Name
### Session N.M.K — Topic
> Outcomes: ...
- Subchapter {#1}
Sources: [Title](url), [Title](url)

`{#N}` is the subchapter's permanent key (id `<session id>.<N>`): reorder freely, never reuse a key,
give a new bullet the next unused number.

Any other top-level `# ` heading after the first track (e.g. `# Sources`) ends the roadmap part.
"""

# `re` è la libreria standard per le espressioni regolari (regex).
# `dataclass` e `field` servono a definire le classi-contenitore qui sotto.
import re
from dataclasses import dataclass, field

# Le regex vengono "compilate" una sola volta all'import, poi riusate per ogni riga.
# Legenda comune: ^ = inizio riga, $ = fine riga, \d = una cifra, \. = punto letterale,
# (...) = gruppo da catturare, + = uno o più, . = qualsiasi carattere.
# Il separatore "—" è un em dash (non un trattino): deve combaciare esattamente.

# Riga tipo "# Track 3 — Titolo": cattura il numero (gruppo 1) e il titolo (gruppo 2).
TRACK = re.compile(r"^# Track (\d+) — (.+)$")
# Riga tipo "## Module 3.1 — Titolo": cattura id "3.1" e titolo.
MODULE = re.compile(r"^## Module (\d+\.\d+) — (.+)$")
# Riga tipo "### Session 3.1.2 — Titolo": cattura id "3.1.2" e titolo.
SESSION = re.compile(r"^### Session (\d+\.\d+\.\d+) — (.+)$")
# Riga tipo "- Testo {#4}": il testo è il gruppo 1, la chiave numerica (4) il gruppo 2.
# `(.+?)` è "pigro": prende il meno possibile, così non ingloba la parte " {#4}".
# `(?: ... )?` è un blocco opzionale: la chiave {#N} può anche mancare (validate la segnala).
SUBCHAPTER = re.compile(r"^- (.+?)(?: \{#(\d+)\})?$")
# Link Markdown "[Titolo](https://...)": gruppo 1 = titolo, gruppo 2 = URL.
# `[^\]]+` = tutto tranne "]"; `[^)\s]+` = tutto tranne ")" e spazi.
LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")


# @dataclass: il decoratore genera automaticamente il costruttore __init__ dai campi.
# Una Sessione del ROADMAP diventa un oggetto con questi campi.
@dataclass
class ParsedSession:
    # Campi obbligatori: id e titolo sono sempre presenti nella riga "### Session ...".
    id: str
    title: str
    # `= ""` è un valore di default: se non passato, il campo vale stringa vuota.
    outcomes: str = ""
    # `field(default_factory=list)` crea una lista NUOVA per ogni oggetto.
    # Scrivere `= []` sarebbe un errore classico: la lista verrebbe condivisa tra tutti gli oggetti.
    subchapters: list[str] = field(default_factory=list)
    subchapter_keys: list[str | None] = field(default_factory=list)  # parallel to subchapters
    sources: list[dict] = field(default_factory=list)


# Un Modulo: contiene le sue Sessioni. Il type hint `list[ParsedSession]` dice che la lista
# contiene oggetti ParsedSession.
@dataclass
class ParsedModule:
    id: str
    title: str
    sessions: list[ParsedSession] = field(default_factory=list)


# Una Traccia (il livello più alto): contiene i suoi Moduli.
@dataclass
class ParsedTrack:
    id: str
    title: str
    modules: list[ParsedModule] = field(default_factory=list)


# Eccezione personalizzata. Eredita da ValueError (errore di valore) e non aggiunge altro:
# serve solo a distinguere "ROADMAP.md malformato" dagli altri errori, così sync.py
# e i test possono catturarlo in modo specifico con `except RoadmapError`.
class RoadmapError(ValueError):
    pass


def iter_sessions(tracks):
    """(track, module, session) in roadmap order."""
    # Espressione generatore con tre `for` annidati: scorre tracce, poi moduli, poi sessioni.
    # Ogni elemento è una tupla (traccia, modulo, sessione). Non crea una lista in memoria:
    # i valori vengono prodotti uno alla volta, quando qualcuno li chiede (es. con `for`).
    return ((t, m, s) for t in tracks for m in t.modules for s in m.sessions)


# Funzione principale: prende il testo intero di ROADMAP.md e restituisce la lista di Tracce.
# `-> list[ParsedTrack]` è il tipo di ritorno (cosa la funzione restituisce).
def parse_roadmap(text: str) -> list[ParsedTrack]:
    # Lista che accumula le tracce man mano che le trova.
    tracks: list[ParsedTrack] = []
    # Tiene traccia della sessione "aperta" in quel momento: le righe successive
    # (Outcomes, sotto-capitoli, Sources) appartengono a lei. None = nessuna ancora.
    session: ParsedSession | None = None
    # `enumerate(..., 1)` numera le righe partendo da 1 (utile per i messaggi d'errore).
    # `splitlines()` spezza il testo in righe; `rstrip()` toglie gli spazi finali invisibili.
    for lineno, raw in enumerate(text.splitlines(), 1):
        line = raw.rstrip()
        # Controllo in ordine: la prima condizione vera vince (come una catena di if/else).
        # `m := TRACK.match(line)` prova la regex: se la riga combacia, m contiene il risultato.
        if m := TRACK.match(line):
            # m[1] è il gruppo 1 della regex (l'id), m[2] il gruppo 2 (il titolo).
            # `.strip()` toglie gli spazi ai bordi del titolo.
            tracks.append(ParsedTrack(m[1], m[2].strip()))
            # Nuova traccia: la sessione precedente non è più valida.
            session = None
        # Riga che inizia con "# " ma non è una traccia (es. "# Sources").
        elif line.startswith("# "):
            # Se abbiamo già almeno una traccia, questa è un'appendice: fermiamo il parsing.
            # Prima di qualsiasi traccia, invece, è solo un'introduzione da ignorare.
            if tracks:  # appendix after the tracks; headings before them are the intro
                break
        # Riga "## Module ...": controlla che l'id inizi con l'id della traccia corrente (es. "3.").
        elif m := MODULE.match(line):
            # Nessuna traccia, oppure id non appartenente a quella traccia: errore di struttura.
            # `raise` interrompe la funzione e segnala l'errore con il numero di riga.
            # `f"..."` è una stringa formattata: le {...} vengono sostituite con i valori.
            if not tracks or not m[1].startswith(tracks[-1].id + "."):
                raise RoadmapError(f"line {lineno}: module {m[1]} outside its track")
            tracks[-1].modules.append(ParsedModule(m[1], m[2].strip()))
            # Nuovo modulo: la sessione precedente non è più valida.
            session = None
        # Riga "### Session ...": stessa idea, ma controlla contro l'ultimo modulo.
        elif m := SESSION.match(line):
            # Prende l'ultimo modulo dell'ultima traccia; `None` se non esiste.
            # `X if condizione else Y` è l'operatore ternario (scelta in una riga).
            module = tracks[-1].modules[-1] if tracks and tracks[-1].modules else None
            if module is None or not m[1].startswith(module.id + "."):
                raise RoadmapError(f"line {lineno}: session {m[1]} outside its module")
            # Crea la sessione, la rende "corrente" e la aggiunge al modulo.
            session = ParsedSession(m[1], m[2].strip())
            module.sessions.append(session)
        # Righe di testo prima di qualsiasi sessione (es. note generali): le ignoriamo.
        elif session is None:
            continue
        # Riga "> Outcomes: ..." (citazione Markdown): gli obiettivi della sessione.
        elif line.startswith(">"):
            # `lstrip("> ")` toglie ">" e spazi iniziali; `removeprefix` toglie "Outcomes:".
            body = line.lstrip("> ").removeprefix("Outcomes:").strip()
            # Più righe ">" si concatenano in un'unica stringa, separate da uno spazio.
            session.outcomes = f"{session.outcomes} {body}".strip()
        # Riga "- Testo {#N}": un sotto-capitolo. Usiamo la regex per separare testo e chiave.
        elif line.startswith("- "):
            m = SUBCHAPTER.match(line)
            # Due liste "parallele": stessa posizione = stesso sotto-capitolo.
            # m[2] può essere None se la chiave {#N} manca (validate() lo segnalerà).
            session.subchapters.append(m[1].strip())
            session.subchapter_keys.append(m[2])
        # Riga "Sources: [Titolo](url), [Titolo](url)": raccoglie tutti i link.
        elif line.startswith("Sources:"):
            # `findall` restituisce tutte le coppie (titolo, url) trovate; la lista comprensiva
            # le trasforma in dizionari. `+=` aggiunge in coda alla lista già esistente.
            session.sources += [{"title": t, "url": u} for t, u in LINK.findall(line)]
    # Restituisce l'albero completo (la fine di tutto: fuori dal for).
    return tracks


def validate(tracks: list[ParsedTrack]) -> list[str]:
    """Return human-readable problems; empty list means the roadmap is well-formed."""
    # `problems` raccoglie i messaggi di errore; `seen` è un insieme (set) degli id già visti.
    # Il set controlla i duplicati in tempo costante: `x in seen` è veloce anche con molti id.
    problems, seen = [], set()
    # `_` è la convenzione per "questo valore non mi serve" (qui traccia e modulo).
    for _, _, s in iter_sessions(tracks):
        # Due sessioni con lo stesso id romperebbero il database (la chiave deve essere unica).
        if s.id in seen:
            problems.append(f"duplicate session id {s.id}")
        seen.add(s.id)
        # Ogni controllo seguente aggiunge un messaggio se la sessione è incompleta.
        # `not s.outcomes` è True se la stringa è vuota.
        if not s.outcomes:
            problems.append(f"{s.id}: missing outcomes")
        if not s.subchapters:
            problems.append(f"{s.id}: no subchapters")
        # Sotto-capitolo senza {#N}: nessuna chiave stabile, quindi il progresso non si salverebbe.
        # `{{#N}}` in un'f-string produce il testo "{#N}" (le doppie graffe sono un escape).
        if None in s.subchapter_keys:
            problems.append(f"{s.id}: subchapter without a {{#N}} key")
        # Tiene solo le chiavi non vuote, poi confronta quante ce ne sono con quante ne sono uniche.
        # Se i due numeri differiscono, c'è almeno una chiave ripetuta.
        keys = [k for k in s.subchapter_keys if k]
        if len(keys) != len(set(keys)):
            problems.append(f"{s.id}: duplicate subchapter key")
        if not s.sources:
            problems.append(f"{s.id}: no sources")
    # Lista vuota = nessun problema = ROADMAP.md è ben formato.
    return problems
