"""
GUIDA: tests/test_api.py  (test di integrazione delle route HTTP)

COSA FA
Questo file contiene i test "end-to-end" dell'API: avvia l'app FastAPI in memoria,
fa richieste HTTP vere (GET, PUT, POST, DELETE) alle route e controlla che le risposte
siano quelle attese. Non testa una singola funzione isolata, ma il flusso completo:
route -> logica -> database -> risposta JSON.

COME SI COLLEGA AL RESTO DEL PROGETTO
- tests/conftest.py fornisce la fixture "client" (un client HTTP collegato all'app) e
  "db_schema" (lo schema del database di test, creato una sola volta). Qui non li importiamo:
  pytest li trova da solo e li passa come parametri, es. test_quote(client).
- Chiama l'app di app/main.py tramite il client, e le route in app/routes/ (progress.py,
  roadmap.py, ai.py, articles.py, quotes.py).
- Usa direttamente app/rag.py (index_text), app/sync.py (index_sources, lesson_file),
  app/cli.py (backup, restore) e app/models.py (Article, Completion, Document) per preparare
  i dati o per verificarne lo stato nel database.
- Il curriculum usato e' tests/fixtures/roadmap.md, non il ROADMAP.md reale: cosi' i test
  non cambiano quando il contenuto del corso viene modificato.
- Si esegue con: docker compose run --rm -v "$PWD/apps/api:/app" api pytest -q

CONCETTI DI BASE (per chi parte da zero)
- Test: una funzione il cui nome inizia con "test_". pytest la trova ed esegue da sola.
  Analogia Laravel/PHPUnit: un metodo test_... dentro una classe che estende TestCase.
- assert: "questa condizione deve essere vera, altrimenti il test fallisce".
  Analogia PHPUnit: $this->assertSame(...). Doc pytest: https://docs.pytest.org/
- async def + await: i test sono asincroni perche' parlano con il database senza bloccare
  il programma. Con asyncio_mode = "auto" (pyproject.toml) pytest-asyncio gestisce tutto,
  senza decoratori @pytest.mark.asyncio.
- Fixture: una dipendenza che pytest prepara prima del test e passa come parametro.
  Doc: https://docs.pytest.org/en/stable/how-to/fixtures.html
- Client HTTP (httpx.AsyncClient): simula un browser. client.get("/x") fa una GET,
  client.put(...) una PUT, e cosi' via. Il risultato e' una Response: .json() la converte
  in dizionari e liste Python, .status_code e' il codice HTTP (200, 404, ...).
  Doc: https://www.python-httpx.org/
- Monkeypatch: sostituisce per un solo test una funzione o un'impostazione con una versione
  finta; alla fine pytest ripristina l'originale. Analogia Laravel: Http::fake().
  Doc: https://docs.pytest.org/en/stable/how-to/monkeypatch.html
- tmp_path: una cartella temporanea unica per ogni test. Doc:
  https://docs.pytest.org/en/stable/how-to/tmp_path.html
- Sessione del database (SessionLocal / AsyncSession): il "canale" per leggere e scrivere.
  Le modifiche vanno confermate con "await db.commit()", altrimenti vengono annullate.
  Doc SQLAlchemy: https://docs.sqlalchemy.org/en/20/orm/session_basics.html
- Lo schema del database viene creato una volta sola per tutta la suite: i dati scritti da un
  test restano visibili ai successivi. Per questo alcuni test cancellano i propri dati alla fine.
"""

# select: costruisce una query SELECT (lettura) con oggetti Python invece che SQL a mano.
from sqlalchemy import select

# Moduli del progetto (app/):
# rag: ricerca e indicizzazione dei testi (RAG); sync: sincronizza roadmap e lezioni nel DB;
# settings: configurazione dalle variabili d'ambiente (qui: la cartella dei contenuti);
# SessionLocal: fabbrica di sessioni DB, "async with SessionLocal() as db:" ne apre una che
# si chiude da sola alla fine del blocco; Document: tabella "documents" dei testi indicizzati.
from app import rag, sync
from app.config import settings
from app.db import SessionLocal
from app.models import Document


# Test 1: il ciclo completo di progresso. Segna un sottocapitolo come fatto, controlla XP e
# statistiche, poi lo annulla. Verifica roadmap, progressi e statistiche in un solo test.
async def test_roadmap_progress_and_stats(client):
    # GET /roadmap: chiede l'albero del corso (percorsi > moduli > sessioni).
    # "await" serve perche' la richiesta e' asincrona; .json() converte la risposta in Python.
    tree = (await client.get("/roadmap")).json()
    # Il file di prova ha due percorsi, con id "0" e "1". La comprehension [t["id"] for t in tree]
    # estrae solo gli id, e assert verifica che siano esattamente questi.
    assert [t["id"] for t in tree] == ["0", "1"]

    # PUT /progress/0.1.2.1: segna come completato il sottocapitolo 0.1.2.1 ("Commits").
    # PUT "imposta" una risorsa: qui aggiunge una riga nella tabella completions.
    r = await client.put("/progress/0.1.2.1")
    # 200 = OK, la richiesta e' andata a buon fine.
    assert r.status_code == 200
    # La risposta contiene le statistiche aggiornate (StatsOut, in app/routes/progress.py).
    stats = r.json()
    # 10 XP per il sottocapitolo, piu' 50 XP di bonus: la sessione 0.1.2 ha UN solo sottocapitolo,
    # quindi completarlo completa anche la sessione (regole in app/gamification.py).
    assert stats["xp"] == 10 + 50  # subchapter + completed single-subchapter session
    # Un solo completamento fatto oggi.
    assert stats["completed_today"] == 1

    # GET /sessions/0.1.2: il dettaglio della sessione. Il sottocapitolo deve risultare "done".
    session = (await client.get("/sessions/0.1.2")).json()
    # "is True" confronta con il valore booleano True (in JSON diventa "true").
    assert session["subchapters"][0]["done"] is True
    # prev_id / next_id: sessione precedente e successiva nell'ordine del corso. 0.1.2 e' preceduta
    # da 0.1.1 e seguita da 1.1.1 (che sta nel percorso 1). "and" richiede che entrambe siano vere.
    assert session["prev_id"] == "0.1.1" and session["next_id"] == "1.1.1"

    # DELETE /progress/0.1.2.1 annulla il completamento: gli XP tornano a zero.
    assert (await client.delete("/progress/0.1.2.1")).json()["xp"] == 0
    # Un sottocapitolo che non esiste nel corso (9.9.9.9) deve dare 404 (Not Found).
    assert (await client.put("/progress/9.9.9.9")).status_code == 404


# Test 2: il tutor AI deve citare le fonti indicizzate. Prima inseriamo un testo nel RAG, poi
# chiediamo una risposta al tutor e controlliamo che la fonte compaia come citazione [1].
async def test_tutor_cites_indexed_sources(client):
    # Qui scriviamo direttamente nel DB per preparare i dati, senza passare dall'API.
    async with SessionLocal() as db:
        # rag.index_text: spezza il testo in chunk, calcola i vettori (embedding) e salva tutto.
        # Gli argomenti dopo "db" sono keyword-only: si passano per nome (es. url="...").
        await rag.index_text(
            db,
            # url: l'indirizzo della fonte, quello che il tutor dovra' citare.
            url="https://missing.csail.mit.edu/",
            title="Missing Semester",
            # il testo che il tutor deve usare per rispondere.
            text="The shell is a textual interface to run programs.",
            # kind="source": e' una fonte del corso, non un articolo della reading list.
            kind="source",
            # collega il documento alla sessione 0.1.1, cosi' il tutor di quella sessione lo trova.
            session_id="0.1.1",
        )
    # POST /ai/tutor con un JSON {session_id, question}. Con LLM_PROVIDER=fake (conftest.py)
    # la risposta e' finta ma deterministica: il test puo' controllarla (vedi app/llm.py).
    r = await client.post("/ai/tutor", json={"session_id": "0.1.1", "question": "What is a shell?"})
    # .json() converte il corpo della risposta (AnswerOut) in un dizionario.
    body = r.json()
    # Il tutor ha risposto con successo (200).
    assert r.status_code == 200
    # citations: lista delle fonti usate. La prima deve essere l'URL che abbiamo indicizzato.
    assert body["citations"][0]["url"] == "https://missing.csail.mit.edu/"
    # Il testo della risposta deve contenere il marcatore "[1]", che rimanda alla citazione 1.
    assert "[1]" in body["answer"]


# Test 3: la citazione casuale. La scelta e' casuale, quindi non possiamo sapere quale sara':
# controlliamo solo che la "forma" della risposta sia corretta.
async def test_quote(client):
    # GET /quotes/random: restituisce una citazione scelta a caso, convertita in dizionario.
    q = (await client.get("/quotes/random")).json()
    # In Python una stringa vuota "" e' considerata falsa. Quindi "and" e' vero solo se sia
    # "text" sia "author" contengono davvero qualcosa.
    assert q["text"] and q["author"]


# Test 4: la lezione di una sessione. Verifica due cose: (1) l'API restituisce il testo Markdown
# della lezione letto dal disco; (2) index_sources la indicizza nel RAG, e la salta se invariata.
# Parametri: tmp_path e monkeypatch sono fixture di pytest, fornite automaticamente.
async def test_session_lesson_served_and_indexed(client, tmp_path, monkeypatch):
    # tmp_path e' una cartella temporanea propria di questo test. Ci creiamo dentro la struttura
    # content/lessons/<percorso>/<modulo>/ come nel progetto reale.
    # mkdir(parents=True) crea anche le cartelle intermedie, come "mkdir -p" nel terminale.
    (tmp_path / "lessons" / "0 Track" / "0.1 Module").mkdir(parents=True)
    # Scriviamo la lezione della sessione 0.1.1. Il nome del file (0.1.1.md) e' l'id della
    # sessione: lesson_files() lo cerca per id, quindi i nomi delle cartelle non contano.
    (tmp_path / "lessons" / "0 Track" / "0.1 Module" / "0.1.1.md").write_text(
        "## What is a shell\n\nA lesson body."
    )
    # monkeypatch.setattr sostituisce temporaneamente settings.content_dir con la nostra cartella:
    # l'app legge cosi' la lezione di prova invece di quella vera. Alla fine del test si ripristina.
    monkeypatch.setattr(settings, "content_dir", tmp_path)

    # La sessione 0.1.1 ha una lezione: il campo "lesson" deve iniziare con il titolo atteso.
    # startswith() controlla l'inizio di una stringa.
    assert (await client.get("/sessions/0.1.1")).json()["lesson"].startswith("## What is a shell")
    # La sessione 0.1.2 non ha un file di lezione: il campo "lesson" deve essere None
    # (null in JSON).
    assert (await client.get("/sessions/0.1.2")).json()["lesson"] is None

    # Funzione finta che sostituisce rag.index_url. Invece di scaricare pagine web (lento e
    # dipendente dalla rete) risponde sempre False, cioe' "nessuna pagina cambiata".
    # *args e **kwargs accettano qualsiasi argomento, senza doverli elencare uno per uno.
    async def no_fetch(*args, **kwargs):
        return False

    # Da qui in poi rag.index_url e' la nostra funzione finta.
    monkeypatch.setattr(rag, "index_url", no_fetch)  # keep source pages off the network
    async with SessionLocal() as db:
        # index_sources restituisce quante voci ha re-indicizzato. Con le pagine finte resta solo
        # la lezione, quindi il risultato atteso e' 1.
        assert await sync.index_sources(db) == 1
        # Cerchiamo nel DB il documento della lezione, identificato dall'URL
        # "/session/0.1.1#lesson". scalar() restituisce il primo risultato, oppure None.
        doc = await db.scalar(select(Document).where(Document.url == "/session/0.1.1#lesson"))
        # Il documento deve essere collegato alla sessione 0.1.1.
        assert doc.session_id == "0.1.1"
        # Seconda esecuzione: il contenuto non e' cambiato (stesso hash), quindi viene saltato.
        assert await sync.index_sources(db) == 0  # unchanged lesson is skipped


# Test 5: backup e ripristino (andata e ritorno, "roundtrip"). Salviamo spunte e preferiti in un
# dizionario, svuotiamo il DB, ripristiniamo dal dizionario e verifichiamo che sia tutto uguale.
async def test_backup_restore_roundtrip(client):
    # Gli import sono dentro la funzione: il test li usa solo qui, e restano vicini al codice.
    # datetime.UTC e' il fuso orario UTC (disponibile da Python 3.11).
    from datetime import UTC, datetime

    # delete(...) costruisce una query DELETE, usata piu' sotto per svuotare le tabelle.
    from sqlalchemy import delete

    # cli = app/cli.py (funzioni backup e restore); Article e Completion = modelli (tabelle) del DB.
    from app import cli
    from app.models import Article, Completion

    # Prepariamo un dato: completiamo un sottocapitolo via API, cosi' c'e' una spunta da salvare.
    await client.put("/progress/0.1.1.1")
    async with SessionLocal() as db:
        # db.add(...) mette in coda un nuovo oggetto Article. Non e' ancora nel DB finche' non
        # facciamo commit.
        db.add(
            # Un articolo "preferito": favorite_at e' impostato all'ora attuale.
            # published_at non viene passato, quindi nel DB resta NULL (None in Python).
            Article(
                url="https://ex.com/fav",
                title="Fav",
                source="Ex",
                excerpt="",
                # datetime.now(UTC) = data e ora attuali in UTC.
                favorite_at=datetime.now(UTC),
            )
        )
        # commit: salva davvero nel DB la spunta (fatta sopra) e l'articolo appena aggiunto.
        await db.commit()
        # Crea il backup: data e' un dizionario con le chiavi "completions" e "favorites".
        data = await cli.backup(db)
        # Svuotiamo le tabelle: ora il DB non ha ne' spunte ne' articoli.
        await db.execute(delete(Completion))
        await db.execute(delete(Article))
        await db.commit()
        # Ripristiniamo dal backup. restore restituisce una coppia (spunte, preferiti) ripristinate:
        # ci aspettiamo (1, 1), cioe' una spunta e un preferito.
        assert await cli.restore(db, data) == (1, 1)
        # Il nuovo backup deve essere identico a quello di prima: nulla si e' perso per strada.
        assert await cli.backup(db) == data
        # Pulizia finale: svuotiamo di nuovo le tabelle, per non lasciare dati agli altri test.
        await db.execute(delete(Completion))
        await db.execute(delete(Article))
        await db.commit()


# Test 6: il limite per fonte. La reading list mostra al massimo PER_SOURCE articoli per ogni
# fonte, cosi' una fonte molto attiva (es. dev.to) non "affolla" le altre.
async def test_articles_capped_per_source(client):
    # Import locali, come nel test precedente.
    from datetime import UTC, datetime, timedelta

    from sqlalchemy import delete

    # Article = modello degli articoli. PER_SOURCE = costante del limite (5), definita in
    # app/routes/articles.py: la importiamo invece di scrivere "5", cosi' il test resta corretto.
    from app.models import Article
    from app.routes.articles import PER_SOURCE

    # "now" e' il momento attuale: ci serve come riferimento per calcolare le date di pubblicazione.
    now = datetime.now(UTC)
    async with SessionLocal() as db:
        # add_all accetta una sequenza di oggetti e li aggiunge tutti insieme.
        db.add_all(
            # Qui sotto: una "generator expression". E' come una comprehension ma con le tonde,
            # e produce un articolo alla volta senza creare una lista intera in memoria.
            Article(
                # f"..." (f-string): inserisce il valore di i nella stringa, es. busy.ex/3.
                url=f"https://busy.ex/{i}",
                title="b",
                source="Busy",
                excerpt="",
                # i minuti di differenza: i=0 e' il piu' recente, poi via via piu' vecchi.
                published_at=now - timedelta(minutes=i),
            )
            # range(PER_SOURCE + 3) produce 0, 1, ..., 7: otto articoli della fonte "Busy".
            for i in range(PER_SOURCE + 3)
        )
        # Un articolo della fonte "Slow" pubblicato tre giorni fa. Il limite vale per ogni fonte
        # separatamente, quindi anche se e' vecchio deve comparire nella lista.
        db.add(
            Article(
                url="https://slow.ex/1",
                title="s",
                source="Slow",
                excerpt="",
                published_at=now - timedelta(days=3),
            )
        )
        await db.commit()
    # try/finally: il blocco finally viene eseguito sempre, anche se un assert fallisce.
    # Cosi' la pulizia dei dati avviene in ogni caso.
    try:
        # GET /articles: lista di articoli. La comprehension tiene solo il campo "source".
        sources = [a["source"] for a in (await client.get("/articles")).json()]
        # Ci aspettiamo PER_SOURCE articoli "Busy" (i piu' recenti, gli altri vengono scartati),
        # seguiti da "Slow". Il "+" tra due liste le unisce in un'unica lista.
        assert sources == ["Busy"] * PER_SOURCE + ["Slow"]
    finally:
        # Svuotiamo la tabella degli articoli, per non influenzare gli altri test.
        async with SessionLocal() as db:
            await db.execute(delete(Article))
            await db.commit()
