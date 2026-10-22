# =============================================================================
# models.py: la "mappa" delle tabelle del database, scritta in Python.
#
# Cosa fa: ogni classe qui sotto corrisponde a UNA tabella PostgreSQL, e ogni
# attributo di classe corrisponde a UNA colonna. SQLAlchemy (l'ORM: il
# traduttore tra oggetti Python e righe del database) legge queste classi e
# genera da solo il SQL (SELECT, INSERT, UPDATE...). Tu lavori con oggetti
# Python e non scrivi SQL a mano.
#
# Dove si usa nel progetto:
# - app/sync.py: legge ROADMAP.md e crea/aggiorna Track, Module, Session, Subchapter.
# - app/routes/roadmap.py e progress.py: leggono il percorso e salvano le spunte (Completion).
# - app/news.py, app/cli.py, app/routes/articles.py: gestiscono Article (le notizie).
# - app/rag.py e app/news.py: gestiscono Document e Chunk (ricerca semantica, "RAG").
# - app/routes/ai.py: legge Session per generare il tutor.
# - alembic/env.py: passa Base ad Alembic, lo strumento che crea e modifica le
#   tabelle tramite le migrazioni (alembic/versions).
# - tests/conftest.py e test_api.py: creano le tabelle e inseriscono dati finti.
#
# Concetti chiave per chi inizia:
# - Una classe che eredita da Base diventa una tabella (docs SQLAlchemy 2.0:
#   https://docs.sqlalchemy.org/en/20/orm/declarative_styles.html).
# - Mapped[tipo] + mapped_column(...) è la sintassi "typed" di SQLAlchemy 2.x.
#   Il tipo Python dice come è fatta la colonna: "str" = testo, "int" = numero intero,
#   "datetime | None" = data che può anche essere assente (NULL nel DB).
# - relationship(...) NON è una colonna: è un collegamento tra tabelle che ti
#   permette di scrivere track.modules invece di fare una query a mano.
#   Docs: https://docs.sqlalchemy.org/en/20/orm/relationship_api.html
# - ForeignKey è un vincolo del database: la colonna deve contenere un id
#   che esiste davvero nell'altra tabella.
# - ondelete="CASCADE": se cancelli la riga "padre", il database cancella
#   automaticamente tutte le righe "figlie" collegate.
# - pgvector: il tipo Vector(n) è una colonna che contiene un vettore di n numeri
#   (un "embedding", cioè la rappresentazione numerica del significato di un testo).
#   Serve per trovare testi simili per significato.
#   Repo: https://github.com/pgvector/pgvector-python
#
# Versioni: il progetto non ha un lock file Python, quindi non posso verificare
# la versione installata. apps/api/pyproject.toml chiede sqlalchemy>=2.0.36 e
# pgvector>=0.3.6 (range minimi, non versioni esatte).
# =============================================================================

# Tipo Python per date e orari (es. quando un articolo è stato scaricato).
from datetime import datetime

# Tipo di colonna fornito dal pacchetto pgvector, per gli embedding (vettori di numeri).
from pgvector.sqlalchemy import Vector

# Importa dal pacchetto SQLAlchemy i tipi di colonna (JSON, DateTime, Integer, String, Text),
# ForeignKey (il vincolo tra tabelle) e func (funzioni SQL come "ora attuale", now()).
from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text, func

# DeclarativeBase: classe base per i modelli. Mapped e mapped_column: per dichiarare le colonne.
# relationship: per i collegamenti tra tabelle.
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

# Le impostazioni dell'app (lette da .env e da app/config.py). Qui ci serve la dimensione
# degli embedding (settings.embed_dim).
from app.config import settings


# Classe base da cui ereditano tutte le tabelle. Serve a SQLAlchemy per raccogliere
# l'elenco di tutti i modelli (Base.metadata), che Alembic e i test usano per creare le tabelle.
class Base(DeclarativeBase):
    # "pass" = nessuna personalizzazione: la classe serve solo come contenitore.
    pass


# --- Roadmap (mirrors ROADMAP.md; ids are the stable "1.2.3" numbers) ---


# Un "track" è una grande area del percorso (es. "Track 1").
# Corrisponde a "# Track N — …" in ROADMAP.md.
class Track(Base):
    # Nome della tabella nel database.
    __tablename__ = "tracks"
    # Chiave primaria: identifica la riga in modo unico.
    # È testo (String, max 16 caratteri), es. "1".
    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    # Titolo del track, testo fino a 200 caratteri.
    title: Mapped[str] = mapped_column(String(200))
    # Posizione nell'elenco (0, 1, 2...), per mostrare i track nell'ordine giusto.
    position: Mapped[int] = mapped_column(Integer)
    # Relazione: NON è una colonna. Permette di scrivere track.modules
    # e ottenere la lista dei moduli.
    # Le virgolette in "Module" servono perché la classe Module è definita più sotto.
    # back_populates: il nome del lato opposto (Module.track), che punta indietro a questo track.
    # order_by: ordina i moduli per "position" quando li carichi.
    # cascade="all, delete-orphan": cancellando un Track si cancellano anche i suoi moduli.
    modules: Mapped[list["Module"]] = relationship(
        back_populates="track", order_by="Module.position", cascade="all, delete-orphan"
    )


# Un "module" è un modulo dentro un track (es. "Module 1.2"). Corrisponde a "## Module N.M — …".
class Module(Base):
    # Nome della tabella.
    __tablename__ = "modules"
    # Chiave primaria, testo, es. "1.2".
    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    # Colonna "ponte" verso il track padre: contiene l'id del track a cui appartiene.
    # ForeignKey: il database accetta solo id di track che esistono davvero.
    # ondelete="CASCADE": se il track viene cancellato, anche questo modulo viene cancellato.
    track_id: Mapped[str] = mapped_column(ForeignKey("tracks.id", ondelete="CASCADE"))
    # Titolo del modulo, fino a 200 caratteri.
    title: Mapped[str] = mapped_column(String(200))
    # Ordine di visualizzazione nel track.
    position: Mapped[int] = mapped_column(Integer)
    # Relazione "molti-a-uno": ogni modulo ha UN solo track.
    # Quindi qui il tipo è Track, non una lista.
    track: Mapped[Track] = relationship(back_populates="modules")
    # Relazione "uno-a-molti": ogni modulo ha una lista di sessioni, ordinate per position.
    # cascade come sopra: cancellando il modulo si cancellano le sue sessioni.
    sessions: Mapped[list["Session"]] = relationship(
        back_populates="module", order_by="Session.position", cascade="all, delete-orphan"
    )


# Una "session" è una singola lezione del percorso (es. "Session 1.2.3"). Attenzione: qui
# "Session" è un modello del progetto, NON la Session di SQLAlchemy (la connessione al DB).
class Session(Base):
    # Nome della tabella.
    __tablename__ = "sessions"
    # Chiave primaria, testo, es. "1.2.3".
    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    # Id del modulo padre (vincolo ForeignKey + cancellazione a cascata, come sopra).
    module_id: Mapped[str] = mapped_column(ForeignKey("modules.id", ondelete="CASCADE"))
    # Titolo della sessione, fino a 300 caratteri.
    title: Mapped[str] = mapped_column(String(300))
    # Obiettivi di apprendimento: testo lungo (Text non ha un limite fisso di caratteri).
    outcomes: Mapped[str] = mapped_column(Text)
    # Ordine di visualizzazione nel modulo.
    position: Mapped[int] = mapped_column(Integer)
    # Fonti consigliate: una lista di dizionari, salvata come JSON nel database.
    # default=list: se non viene passato nulla, usa list() cioè una lista vuota [].
    sources: Mapped[list[dict]] = mapped_column(JSON, default=list)  # [{title, url}]
    # Relazione verso il modulo padre (molti-a-uno: una sessione appartiene a un solo modulo).
    module: Mapped[Module] = relationship(back_populates="sessions")
    # Relazione uno-a-molti: la lista dei sottocapitoli della sessione, ordinati per position.
    subchapters: Mapped[list["Subchapter"]] = relationship(
        back_populates="session", order_by="Subchapter.position", cascade="all, delete-orphan"
    )


# Un "sottocapitolo" è un punto della lezione, cioè un bullet "- subchapter {#N}" in ROADMAP.md.
# È l'unità che lo studente spunta come fatta.
class Subchapter(Base):
    # Nome della tabella.
    __tablename__ = "subchapters"
    # Chiave primaria composta da testo: "<id della sessione>.<numero N>", es. "1.2.3.4".
    # Lo id è stabile, così le spunte restano valide anche se riordini il roadmap.
    id: Mapped[str] = mapped_column(String(24), primary_key=True)  # "<session id>.<{#N} key>"
    # Id della sessione padre, con vincolo e cancellazione a cascata.
    session_id: Mapped[str] = mapped_column(ForeignKey("sessions.id", ondelete="CASCADE"))
    # Titolo del sottocapitolo.
    title: Mapped[str] = mapped_column(String(300))
    # Ordine di visualizzazione nella sessione.
    position: Mapped[int] = mapped_column(Integer)
    # Relazione verso la sessione padre (molti-a-uno).
    session: Mapped[Session] = relationship(back_populates="subchapters")


# La tabella delle spunte: una riga per ogni sottocapitolo completato.
# Il progresso (XP, livelli, streak) NON è salvato qui: viene calcolato da app/gamification.py.
class Completion(Base):
    """A ticked subchapter. No FK: progress must survive roadmap edits."""

    # Nome della tabella.
    __tablename__ = "completions"
    # Id del sottocapitolo spuntato. È la chiave primaria, quindi un sottocapitolo
    # può essere spuntato una sola volta.
    # Non c'è ForeignKey di proposito: se il roadmap cambia e il sottocapitolo viene rinominato
    # o spostato, la spunta resta comunque valida.
    subchapter_id: Mapped[str] = mapped_column(String(24), primary_key=True)
    # Data e ora della spunta. server_default=func.now(): è il database a mettere l'ora attuale
    # quando la riga viene inserita. timezone=True: la data include il fuso orario.
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# --- News ---


# Un articolo di notizie scaricato dai feed (sezione "news" dell'app).
class Article(Base):
    # Nome della tabella.
    __tablename__ = "articles"
    # Id numerico: Integer come chiave primaria fa sì che il database lo assegni
    # da solo (1, 2, 3...).
    id: Mapped[int] = mapped_column(primary_key=True)
    # Indirizzo dell'articolo. unique=True: il database rifiuta due righe con lo stesso URL,
    # così non salviamo due volte la stessa notizia.
    url: Mapped[str] = mapped_column(String(2000), unique=True)
    # Titolo dell'articolo.
    title: Mapped[str] = mapped_column(String(500))
    # Nome della testata che lo pubblica (es. il nome del blog).
    source: Mapped[str] = mapped_column(String(200))
    # Breve estratto del testo. default="": se non c'è, la stringa è vuota.
    excerpt: Mapped[str] = mapped_column(Text, default="")
    # Data di pubblicazione. "| None": può mancare, e nel DB sarà NULL.
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    # Data in cui l'abbiamo scaricato: il database la imposta automaticamente (now()).
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    # Preferiti: se è NULL l'articolo non è tra i preferiti, se contiene una data
    # è stato messo tra i preferiti in quel momento.
    favorite_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    # Riassunto generato dall'AI. Può non esserci ancora (None), quindi è opzionale.
    ai_summary: Mapped[str | None] = mapped_column(Text)


# --- RAG ---


# Un "documento" è una pagina web indicizzata per la ricerca RAG (Retrieval-Augmented Generation:
# il tutor cerca nei testi prima di rispondere). Può essere una fonte di una sessione o un articolo.
class Document(Base):
    # Nome della tabella.
    __tablename__ = "documents"
    # Id numerico assegnato dal database.
    id: Mapped[int] = mapped_column(primary_key=True)
    # Indirizzo della pagina, unico: la stessa pagina non viene indicizzata due volte.
    url: Mapped[str] = mapped_column(String(2000), unique=True)
    # Titolo della pagina.
    title: Mapped[str] = mapped_column(String(500))
    # Tipo di documento: "source" (fonte di una sessione) oppure "article" (notizia).
    kind: Mapped[str] = mapped_column(String(16))  # "source" | "article"
    # A quale sessione appartiene (se è una fonte). "| None": per gli articoli è vuoto.
    # index=True: crea un indice, cioè una specie di indice di un libro, per trovarlo più in fretta.
    session_id: Mapped[str | None] = mapped_column(String(16), index=True)
    # Impronta (hash) del contenuto: un codice che cambia se il testo cambia.
    # Se l'hash è uguale a quello salvato, la pagina non viene reindicizzata.
    content_hash: Mapped[str] = mapped_column(String(64))
    # Quando è stata indicizzata (data impostata automaticamente dal database).
    indexed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    # Relazione uno-a-molti: la lista dei "pezzi" (Chunk) del documento.
    # Non c'è back_populates perché Chunk non ha una relazione verso Document in questo file.
    # cascade="all, delete-orphan": cancellando il documento si cancellano anche i suoi pezzi.
    chunks: Mapped[list["Chunk"]] = relationship(cascade="all, delete-orphan")


# Un "chunk" è un pezzetto di un documento (il testo viene spezzato
# in parti di dimensione gestibile).
# Ogni chunk ha il suo embedding, cioè il vettore che rappresenta il significato di quel pezzo.
class Chunk(Base):
    # Nome della tabella.
    __tablename__ = "chunks"
    # Id numerico assegnato dal database.
    id: Mapped[int] = mapped_column(primary_key=True)
    # Documento a cui appartiene il chunk. ondelete="CASCADE": cancellato il documento,
    # spariscono anche i chunk.
    # index=True: indice per trovare velocemente tutti i chunk di un documento.
    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"), index=True
    )
    # Ordine del pezzo dentro il documento (0, 1, 2...), per ricostruire il testo
    # nell'ordine giusto.
    position: Mapped[int] = mapped_column(Integer)
    # Il testo del pezzo.
    text: Mapped[str] = mapped_column(Text)
    # L'embedding: un vettore di numeri. Mapped[list[float]] è la lista di numeri in Python.
    # Vector(settings.embed_dim): la lunghezza del vettore arriva da app/config.py
    # (es. 768 con nomic-embed-text).
    # Il vettore serve per cercare chunk con significato simile alla domanda dello studente.
    embedding: Mapped[list[float]] = mapped_column(Vector(settings.embed_dim))
