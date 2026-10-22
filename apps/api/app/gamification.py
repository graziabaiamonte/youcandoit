"""Pure gamification rules. XP, level, streak and badges are derived from completions,
so nothing is stored that could drift out of sync with the ticked checkboxes."""

# ---------------------------------------------------------------------------
# COSA FA QUESTO FILE
# Qui sta la "logica di gioco" della piattaforma: XP, livello, streak (serie di
# giorni consecutivi di studio), badge e attività del calendario.
#
# Idea chiave: NESSUNO di questi valori viene salvato nel database. Vengono
# ricalcolati ogni volta, a partire dalla tabella dei completamenti (le spunte
# delle lezioni). Così non possono mai "disallinearsi" dalle spunte reali.
#
# Il file è una funzione "pura": riceve dei dati, restituisce un risultato, e
# basta. Non legge il database, non fa richieste di rete, non scrive su disco.
# Questo la rende facile da testare (vedi tests/test_gamification.py).
#
# RELAZIONE CON IL RESTO DEL PROGETTO
# - Chi la usa: app/routes/progress.py, dove la funzione compute_stats() viene
#   chiamata dall'endpoint che alimenta la dashboard. Il risultato viene poi
#   trasformato in una risposta JSON (modelli Pydantic StatsOut/BadgeOut).
# - Chi la testa: tests/test_gamification.py.
# - Da dove arrivano i dati: app/models.py (tabelle Completion, Subchapter,
#   Session, Track) letti dal database in progress.py.
#
# CONCETTI PYTHON USATI IN QUESTO FILE
# - Costanti in MAIUSCOLO (XP_SUBCHAPTER, ...): per convenzione Python indicano
#   valori che non cambiano. Python non le blocca davvero, è solo una regola di stile.
# - @dataclass: decoratore (una "etichetta" che sta sopra una classe) che genera
#   automaticamente __init__ e altri metodi, così non devi scriverli a mano.
#   frozen=True rende l'oggetto immutabile (non modificabile dopo la creazione).
#   Doc: https://docs.python.org/3/library/dataclasses.html
# - Type hint (es. "xp: int", "-> int"): annotazioni che dichiarano il tipo atteso.
#   Python NON le verifica a runtime; servono a chi legge e a strumenti come mypy.
#   La sintassi moderna list[X], dict[K, V], X | None richiede Python 3.10+; il
#   progetto usa Python >=3.12 (vedi apps/api/pyproject.toml).
# - zoneinfo: libreria standard per i fusi orari (qui "Europe/Rome"), così
#   "oggi" è calcolato nel giorno locale dell'utente e non in UTC.
#   Doc: https://docs.python.org/3/library/zoneinfo.html
# ---------------------------------------------------------------------------

# libreria standard: funzioni matematiche (qui serve sqrt, la radice quadrata)
import math

# contatore: conta quante volte compare ogni elemento
from collections import Counter

# decoratore per creare classi "contenitore di dati"
from dataclasses import dataclass

# date e orari; timedelta = una durata (es. 1 giorno)
from datetime import date, datetime, timedelta

# fuso orario, es. ZoneInfo("Europe/Rome")
from zoneinfo import ZoneInfo

# Quanto vale ogni azione in XP (punti esperienza).
# ogni sottocapitolo completato vale 10 XP
XP_SUBCHAPTER = 10
# bonus extra quando completi tutta una sessione
XP_SESSION_BONUS = 50
# bonus extra quando completi tutta una traccia (track)
XP_TRACK_BONUS = 300
ACTIVITY_DAYS = 168  # 24 weeks, the dashboard heatmap


# @dataclass(frozen=True): crea una classe che contiene solo dati. frozen=True
# significa che un Badge, una volta creato, non può più essere modificato.
@dataclass(frozen=True)
class Badge:
    # Un badge è un "premio" sbloccabile. Ha un id interno, un titolo e una descrizione.
    # identificativo univoco, es. "first-step"; "str" = testo
    id: str
    # nome mostrato all'utente
    title: str
    # frase che spiega come ottenerlo
    description: str


# @dataclass senza parametri: contenitore di dati modificabile. Raccoglie tutti i
# numeri e le liste che la dashboard deve mostrare.
# Il "risultato" completo che compute_stats() restituisce alla dashboard.
@dataclass
class Stats:
    # punti esperienza totali
    xp: int
    # livello attuale, calcolato dagli XP
    level: int
    # quanti XP hai già guadagnato DENTRO il livello attuale (per la barra di progresso)
    xp_into_level: int
    # quanti XP servono in tutto per passare al livello successivo
    xp_for_next_level: int
    # giorni consecutivi di studio correnti
    streak: int
    # record storico di giorni consecutivi
    best_streak: int
    # quanti sottocapitoli hai completato oggi
    completed_today: int
    # lista dei badge sbloccati (list[...] = lista di elementi di un tipo)
    badges: list[Badge]
    activity: dict[str, int]  # ISO date -> subchapters completed, last ACTIVITY_DAYS days
    # dict[K, V] = dizionario (coppie chiave -> valore). ISO date = data in formato "2026-10-22"


# Dato un livello, dice quanti XP TOTALI servono per raggiungerlo.
# Esempi: livello 1 -> 0 XP, livello 2 -> 100 XP, livello 3 -> 300 XP.
# Il costo cresce di 100 XP a ogni livello in più (la differenza tra soglie cresce linearmente).
# "-> int" = la funzione restituisce un intero
def level_threshold(level: int) -> int:
    """Total XP needed to reach `level` (level 1 = 0 XP). Each level costs 100 XP more."""
    # formula: 50 * (l-1) * l, così la soglia cresce in modo quadratico
    return 50 * (level - 1) * level


# Operazione inversa di level_threshold: dato un totale di XP, dice a che livello sei.
# È la formula risolta rispetto a "l" (equazione di secondo grado, con la radice quadrata).
def level_for(xp: int) -> int:
    # inverse of level_threshold: 50*l*(l-1) <= xp
    # math.sqrt = radice quadrata; int(...) tronca i decimali
    return int((1 + math.sqrt(1 + 8 * xp / 100)) / 2)


# Calcola le serie di giorni consecutivi. Riceve l'insieme dei giorni in cui hai studiato
# (set = insieme senza duplicati) e il giorno di oggi. Restituisce una coppia (tuple):
# (serie attuale, serie migliore).
# "_" all'inizio = uso interno al file
def _streaks(days: set[date], today: date) -> tuple[int, int]:
    # assegnazione multipla: best e run partono entrambi da 0
    best = run = 0
    # giorno precedente; None = "ancora nessuno" (None è il "nulla" di Python)
    prev: date | None = None
    # for: ripete il blocco per ogni giorno, in ordine cronologico
    for d in sorted(days):
        # if-else in una riga (operatore ternario): se il giorno è il successore del precedente,
        # allunga la serie (run + 1), altrimenti ricomincia da 1.
        run = run + 1 if prev and d - prev == timedelta(days=1) else 1
        # tieni il valore più alto visto finora
        best = max(best, run)
        # questo giorno diventa il "precedente" per il giro successivo
        prev = d
    # current streak counts if the last active day is today or yesterday
    # La serie corrente resta valida anche se hai studiato ieri ma non ancora oggi.
    current = 0
    # parte da oggi, o da ieri se oggi manca
    d = today if today in days else today - timedelta(days=1)
    # while: ripete finché la condizione è vera; qui conta all'indietro
    while d in days:
        current += 1
        # torna indietro di un giorno
        d -= timedelta(days=1)
    # return: restituisce i due valori insieme (tuple)
    return current, best


# Funzione principale: prende i dati grezzi dal database e calcola tutte le statistiche.
# I parametri con "=" hanno un valore predefinito (es. tz="Europe/Rome") e sono opzionali.
def compute_stats(
    # id sottocapitolo -> quando è stato completato
    completions: dict[str, datetime],
    # id sessione -> lista dei suoi sottocapitoli
    session_subchapters: dict[str, list[str]],
    # id traccia -> lista delle sue sessioni
    track_sessions: dict[str, list[str]],
    # fuso orario in cui contare i giorni
    tz: str = "Europe/Rome",
    # "ora attuale"; None = usa l'orario reale. Utile nei test per fissare la data
    now: datetime | None = None,
    # la funzione restituisce un oggetto Stats
) -> Stats:
    # crea l'oggetto fuso orario dalla stringa, es. "Europe/Rome"
    zone = ZoneInfo(tz)
    # Trova "oggi": se non passi now, usa l'orario reale;
    # poi converte nel fuso orario e prende solo la data.
    today = (now or datetime.now(zone)).astimezone(zone).date()
    # set delle chiavi: quali sottocapitoli sono stati spuntati
    done = set(completions)

    # Una sessione è completa se ha almeno un sottocapitolo (subs) e TUTTI sono nel set "done".
    # all(...) è True solo se ogni elemento soddisfa la condizione.
    done_sessions = {
        s for s, subs in session_subchapters.items() if subs and all(x in done for x in subs)
    }
    # Una traccia è completa se ha almeno una sessione e TUTTE le sue sessioni sono complete.
    done_tracks = {
        t for t, sess in track_sessions.items() if sess and all(s in done_sessions for s in sess)
    }
    # Calcolo degli XP: ogni voce moltiplicata per il suo valore, poi sommate tra loro.
    xp = (
        # len = quanti elementi ci sono nella collezione
        len(done) * XP_SUBCHAPTER
        + len(done_sessions) * XP_SESSION_BONUS
        + len(done_tracks) * XP_TRACK_BONUS
    )
    # Insieme dei giorni (solo la data, non l'ora) in cui hai completato almeno un sottocapitolo.
    days = {ts.astimezone(zone).date() for ts in completions.values()}
    # scompatta la tupla restituita: streak = attuale, best = record
    streak, best = _streaks(days, today)
    # calcola il livello dagli XP appena trovati
    level = level_for(xp)

    # Lista di regole: ogni voce è una coppia (condizione True/False, badge).
    # Alla fine teniamo solo i badge la cui condizione è True.
    rules = [
        (len(done) >= 1, Badge("first-step", "First step", "Completed your first subchapter")),
        (len(done_sessions) >= 1, Badge("first-session", "Topic tamer", "Completed a session")),
        (len(done_sessions) >= 10, Badge("ten-sessions", "On a roll", "Completed 10 sessions")),
        (best >= 3, Badge("streak-3", "Warming up", "3-day study streak")),
        (best >= 7, Badge("streak-7", "One full week", "7-day study streak")),
        (best >= 30, Badge("streak-30", "Unstoppable", "30-day study streak")),
        (xp >= 1000, Badge("xp-1000", "Kilo-XP", "Earned 1,000 XP")),
    ]
    # List comprehension: [risultato for elemento in lista if condizione] in una riga sola.
    # "ok, b" scompatta la coppia. Poi si aggiungono i badge "traccia completata", uno per traccia.
    badges = [b for ok, b in rules if ok] + [
        # f"..." = stringa con variabili dentro {}
        Badge(f"track-{t}", f"Track {t} complete", f"Finished every session of track {t}")
        # key=int: ordina i numeri come numeri (così 2 viene prima di 10)
        for t in sorted(done_tracks, key=int)
    ]
    # Counter conta quanti completamenti ci sono per ogni giorno, es. {data: 3}.
    per_day = Counter(ts.astimezone(zone).date() for ts in completions.values())
    # Mappa per il calendario: solo gli ultimi ACTIVITY_DAYS giorni.
    # La chiave diventa testo ISO, es. "2026-10-22".
    activity = {
        d.isoformat(): n for d, n in sorted(per_day.items()) if (today - d).days < ACTIVITY_DAYS
    }
    # Costruisce e restituisce l'oggetto Stats. Ogni "nome=valore" riempie un campo della dataclass.
    return Stats(
        xp=xp,
        level=level,
        # XP già dentro il livello = XP totali - soglia del livello attuale
        xp_into_level=xp - level_threshold(level),
        # ampiezza del livello attuale
        xp_for_next_level=level_threshold(level + 1) - level_threshold(level),
        streak=streak,
        best_streak=best,
        # sum: somma una sequenza di 1 (uno per ogni completamento di oggi)
        completed_today=sum(
            1 for ts in completions.values() if ts.astimezone(zone).date() == today
        ),
        badges=badges,
        activity=activity,
    )
