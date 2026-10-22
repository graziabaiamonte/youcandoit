# ---------------------------------------------------------------------------
# COSA FA QUESTO FILE
# Contiene i test automatici (pytest) per app/gamification.py. Ogni funzione che
# inizia con "test_" è un controllo: pytest la esegue e, se un "assert" fallisce,
# segnala l'errore indicando quale regola non torna.
#
# COME SI ESEGUE (dalla root del progetto)
# docker compose run --rm -v "$PWD/apps/api:/app" api pytest -q tests/test_gamification.py
#
# PERCHÉ SONO UTILI
# La logica di gioco (XP, livelli, streak, badge) è "pura": riceve dati e restituisce
# un risultato, senza database né rete. Quindi la testiamo passando dati finti e
# controllando i numeri. Se cambi una regola per sbaglio, un test se ne accorge.
#
# CONCETTI PYTHON USATI
# - assert: "questa condizione deve essere vera". Se è falsa, il test fallisce.
# - pytest: framework di test. Trova da solo i file test_*.py e le funzioni test_*.
#   Doc: https://docs.pytest.org/en/stable/
# - Le costanti in MAIUSCOLO (TZ, NOW, ...) sono dati fissi usati da più test.
# ---------------------------------------------------------------------------

# datetime = data + ora; timedelta = una durata (es. "1 giorno")
from datetime import datetime, timedelta

# ZoneInfo = fuso orario della libreria standard (qui "Europe/Rome")
from zoneinfo import ZoneInfo

# Importiamo dal modulo app/gamification.py solo le funzioni che i test devono controllare.
# "from ... import ..." prende nomi specifici da un file (qui app/gamification.py).
from app.gamification import compute_stats, level_for, level_threshold

# Fuso orario dei test: lo stesso usato dall'app, così le date si comportano allo stesso modo.
TZ = ZoneInfo("Europe/Rome")
# "Oggi" finto: fissare la data rende i test ripetibili (l'orario reale cambierebbe ogni giorno).
# Mezzogiorno evita che un piccolo scarto di fuso orario cambi il giorno.
NOW = datetime(2026, 10, 19, 12, tzinfo=TZ)
# Catalogo finto: id sessione -> lista dei suoi sottocapitoli (la sessione "0.1.1" ne ha 2).
SESSIONS = {"0.1.1": ["0.1.1.1", "0.1.1.2"], "0.1.2": ["0.1.2.1"]}
# Catalogo finto: id traccia -> lista delle sue sessioni (la traccia "0" ha 2 sessioni).
TRACKS = {"0": ["0.1.1", "0.1.2"]}


# Helper (funzione di supporto): restituisce il momento di n giorni prima di NOW.
# "n: int" = parametro intero; "-> datetime" = la funzione restituisce una data-ora.
def days_ago(n: int) -> datetime:
    return NOW - timedelta(days=n)


# Test dei livelli: soglia e livello devono essere l'uno l'inverso dell'altro.
def test_levels_are_monotonic_and_inverse():
    # range(1, 30) produce 1, 2, ..., 29 (il secondo numero è escluso).
    for lvl in range(1, 30):
        # Gli XP esatti della soglia di un livello portano proprio a quel livello.
        assert level_for(level_threshold(lvl)) == lvl
        # Un XP in meno della soglia del livello successivo resta ancora nel livello attuale.
        assert level_for(level_threshold(lvl + 1) - 1) == lvl


# Test degli XP: 10 per sottocapitolo, 50 per sessione completa, 300 per traccia completa.
def test_xp_includes_session_and_track_bonuses():
    # Un solo sottocapitolo spuntato: 1 x 10 XP, nessun bonus (la sessione non è completa).
    # "now=NOW" passa la data finta, così compute_stats non usa l'orario reale.
    partial = compute_stats({"0.1.1.1": NOW}, SESSIONS, TRACKS, now=NOW)
    assert partial.xp == 10
    # Tutti e 3 i sottocapitoli spuntati. Il dizionario {s: NOW for s in (...)} è una
    # "dict comprehension": crea le coppie id -> data in una riga sola.
    full = compute_stats(
        {s: NOW for s in ("0.1.1.1", "0.1.1.2", "0.1.2.1")}, SESSIONS, TRACKS, now=NOW
    )
    # 3 sottocapitoli x 10 + 2 sessioni complete x 50 + 1 traccia completa x 300.
    assert full.xp == 3 * 10 + 2 * 50 + 300
    # Completando la traccia "0" deve comparire il badge con id "track-0".
    # Il set {b.id for b in ...} raccoglie solo gli id dei badge, per cercarne uno.
    assert "track-0" in {b.id for b in full.badges}


# Test delle serie (streak): giorni consecutivi in cui hai studiato.
def test_streak_counts_consecutive_days_and_allows_today_off():
    # Completamenti ieri, 2 e 3 giorni fa, e 5 giorni fa. Il giorno 4 manca.
    # Le chiavi "a", "b", ... sono nomi qualsiasi: conta solo il valore (la data).
    c = {"a": days_ago(1), "b": days_ago(2), "c": days_ago(3), "d": days_ago(5)}
    # {} {} = nessuna sessione e nessuna traccia: qui ci interessano solo le date.
    s = compute_stats(c, {}, {}, now=NOW)
    # La serie vale 3 (ieri, 2 e 3 giorni fa): si ferma perché il giorno 4 manca.
    # Oggi non ancora studiato, ma la serie resta valida fino a ieri.
    assert s.streak == 3  # yesterday, 2 and 3 days ago; today not studied yet
    # Il record storico è 3 anche lui, perché non c'è stata serie più lunga.
    assert s.best_streak == 3
    # Oggi non c'è nessun completamento, quindi il contatore di oggi è 0.
    assert s.completed_today == 0
    # Con 3 giorni di serie si sblocca il badge "streak-3".
    assert "streak-3" in {b.id for b in s.badges}


# Una serie si rompe dopo un giorno saltato.
def test_streak_breaks_after_a_missed_day():
    # Studio solo 2 giorni fa: ieri e oggi mancano, quindi la serie attuale è 0.
    s = compute_stats({"a": days_ago(2)}, {}, {}, now=NOW)
    # "and" = entrambe le condizioni devono essere vere. Il record però resta 1.
    assert s.streak == 0 and s.best_streak == 1


# Il calendario (activity) conta i completamenti per giorno.
def test_activity_counts_completions_per_day():
    # Due completamenti oggi; uno 400 giorni fa.
    done = {"0.1.1.1": days_ago(0), "0.1.1.2": days_ago(0), "0.1.2.1": days_ago(400)}
    s = compute_stats(done, SESSIONS, TRACKS, now=NOW)
    # Il dizionario ha come chiave la data in formato ISO (testo) e come valore il conteggio.
    # Il completamento di 400 giorni fa non compare: è oltre la finestra di 168 giorni.
    assert s.activity == {"2026-10-19": 2}
