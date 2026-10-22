# ============================================================================================
# GUIDA: tests/test_rag.py (test del modulo RAG: spezzettamento del testo e ricerca)
#
# COSA FA
# Questo file verifica due parti di app/rag.py, il modulo che gestisce la RAG
# (Retrieval-Augmented Generation, "generazione aumentata dal recupero"): il tutor non
# conosce a memoria le fonti del corso, quindi PRIMA cerca nel database i pezzi di testo
# pertinenti alla domanda e POI li passa all'LLM come contesto da citare.
#
# DOVE SI COLLOCA NEL PROGETTO
# - app/rag.py: il codice testato (chunk_text, index_text, retrieve).
# - app/sync.py, app/news.py, app/cli.py, app/routes/articles.py: usano index_text/index_url
#   in produzione (indicizzazione di lezioni, articoli e fonti).
# - app/routes/ai.py: usa retrieve() per recuperare i pezzi da dare al tutor.
#
# CONCETTI CHIAVE PER CHI INIZIA
# - Chunk (pezzo): un testo lungo viene tagliato in blocchi di circa 600 parole. Piccoli
#   pezzi sono più facili da cercare e stanno nel contesto dell'LLM.
# - Overlap (sovrapposizione): i pezzi consecutivi condividono 80 parole, così una frase
#   spezzata a metà non si perde.
# - Embedding (vettore): ogni pezzo diventa una lista di numeri che rappresenta il suo
#   significato. Testi simili producono vettori vicini.
# - Distanza coseno: misura quanto due vettori puntano nella stessa direzione. Più è
#   piccola, più i testi sono simili.
# - FakeEmbedder (app/llm.py): in test l'embedding è finto ma deterministico (conta le
#   parole in comune), così il risultato è sempre lo stesso e non serve Ollama.
# - Hash SHA-256: impronta del testo. Se non cambia, il documento non viene ri-indicizzato.
#
# COME SI ESEGUONO
# pytest trova da solo le funzioni che iniziano con "test_". Con
# asyncio_mode = "auto" (pyproject.toml) le funzioni "async def" girano come test asincroni
# senza bisogno di decoratori. Il parametro "db_schema" è una fixture (vedi conftest.py):
# pytest la esegue prima del test, per creare le tabelle nel database di test.
# Doc: https://docs.pytest.org/en/stable/how-to/fixtures.html
#      https://pytest-asyncio.readthedocs.io/en/stable/
# ============================================================================================

# "from app import rag" importa il modulo app/rag.py: scriviamo rag.chunk_text(...) ecc.
from app import rag

# Importa la "fabbrica" di sessioni del database (vedi app/db.py): SessionLocal() apre
# una sessione asincrona con cui parlare al DB.
from app.db import SessionLocal


# TEST 1 (funzione sincrona, senza database): verifica lo spezzettamento del testo.
# Nel nome, "test_" dice a pytest che è un test; il resto descrive cosa si verifica.
def test_chunking_overlaps_and_covers_everything():
    # Lista di 1000 parole finte: "w0", "w1", ... "w999". Le usiamo perché sono uniche e facili
    # da controllare. range(1000) produce i numeri da 0 a 999; f"w{i}" li incolla con "w".
    words = [f"w{i}" for i in range(1000)]
    # " ".join(words) riunisce le parole in un'unica stringa separata da spazi.
    # chunk_text(..., size=600, overlap=80) deve tagliarla in pezzi da 600 parole, con 80 in comune.
    chunks = rag.chunk_text(" ".join(words), size=600, overlap=80)
    # Con 1000 parole, 600 per pezzo e passo di 520 parole, ci aspettiamo esattamente 2 pezzi.
    # "assert" è una verifica: se la condizione è falsa, il test fallisce.
    assert len(chunks) == 2
    # chunks[0] è il primo pezzo; .split() lo rimette in lista di parole. Lo slice [-80:] prende
    # le ultime 80, [:80] le prime 80 del secondo pezzo: devono coincidere (la sovrapposizione).
    # Lo slice è la sintassi Python per "prendi una porzione": [inizio:fine].
    # Un indice negativo conta dalla fine della lista.
    assert chunks[0].split()[-80:] == chunks[1].split()[:80]
    # L'ultima parola del secondo pezzo deve essere "w999": nessuna parola del testo
    # è andata persa. [-1] indica l'ultimo elemento di una lista.
    assert chunks[1].split()[-1] == "w999"
    # Caso limite 1: testo vuoto. Non ci sono pezzi, quindi la lista restituita è vuota: [].
    assert rag.chunk_text("") == []
    # Caso limite 2: testo più corto dell'overlap. Resta un solo pezzo, uguale al testo originale.
    assert rag.chunk_text("one two") == ["one two"]


# TEST 2 (asincrono, usa il database): indicizza due documenti e verifica che la ricerca
# trovi quello giusto. "async def" = funzione asincrona: il codice può "attendere" (await)
# operazioni lente come il DB senza bloccare il resto del programma.
# "db_schema" è il nome di una fixture: pytest lo cerca in conftest.py ed esegue la preparazione
# del database prima di questo test (è una forma di dependency injection: il test "dichiara" di
# aver bisogno del DB pronto, e pytest se ne occupa).
async def test_retrieval_returns_matching_document(db_schema):
    # "async with" apre una sessione del database e la chiude da sola alla fine del blocco.
    # "db" è la sessione: la passiamo a ogni funzione di rag.py che deve leggere o scrivere.
    async with SessionLocal() as db:
        # Primo documento: un articolo su Kubernetes. index_text lo spezza, lo trasforma in
        # vettori e lo salva nel DB.
        # Gli argomenti dopo "db" hanno il nome (url=..., title=...): così è chiaro cosa è cosa.
        # kind="article" lo classifica come articolo, utile per i filtri della ricerca.
        await rag.index_text(
            db,
            url="https://ex.com/k8s",
            title="Kubernetes pods",
            text="Kubernetes schedules pods onto nodes in a cluster.",
            kind="article",
        )
        # Secondo documento: un testo di cucina, molto diverso dal primo. Serve come "distrattore":
        # la ricerca deve preferire il primo.
        await rag.index_text(
            db,
            url="https://ex.com/bake",
            title="Bread",
            text="Knead the dough and bake the bread in the oven.",
            kind="article",
        )
        # Cerchiamo con una domanda in linguaggio naturale. k=1 chiede solo il risultato migliore;
        # kind="article" limita la ricerca agli articoli. Il risultato è una lista di Hit.
        hits = await rag.retrieve(db, "how does kubernetes schedule pods", k=1, kind="article")
        # Il primo risultato deve essere la pagina su Kubernetes: hits[0] è il primo elemento
        # della lista e .url è il suo indirizzo.
        assert hits[0].url == "https://ex.com/k8s"
        # Testo invariato: index_text deve rispondere False ("nulla da fare") senza ricalcolare
        # i vettori. "assert not ..." verifica che il risultato sia False; "not" inverte il valore.
        # Il confronto avviene tramite l'impronta SHA-256 del testo (vedi rag.index_text).
        # unchanged text is not re-embedded
        assert not await rag.index_text(
            db,
            url="https://ex.com/k8s",
            title="Kubernetes pods",
            text="Kubernetes schedules pods onto nodes in a cluster.",
            kind="article",
        )
