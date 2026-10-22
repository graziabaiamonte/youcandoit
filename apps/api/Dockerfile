# Un Dockerfile è la "ricetta" per costruire un'immagine Docker: ogni istruzione è un passo,
# eseguito dall'alto verso il basso. Questa immagine contiene l'API (FastAPI + Python).
# FROM sceglie l'immagine di partenza: Python 3.12 nella variante "slim" (più leggera).
# Docker la scarica da Docker Hub. La 3.12 coincide con requires-python in pyproject.toml.
FROM python:3.12-slim
# WORKDIR imposta la cartella di lavoro nel container: i comandi successivi girano in /app
# (Docker la crea se non esiste).
WORKDIR /app
# ENV imposta variabili d'ambiente per il container. PYTHONDONTWRITEBYTECODE=1 evita di
# creare file .pyc (cache inutili); PYTHONUNBUFFERED=1 fa comparire subito i log di Python,
# così docker compose logs li mostra in tempo reale.
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
# dependencies first, so a code change doesn't reinstall them
# COPY copia file dal computer (la cartella apps/api, detta "contesto di build") nell'immagine.
# Qui copiamo SOLO pyproject.toml, cioè la lista delle dipendenze; il codice arriva dopo.
# Così Docker tiene in cache il passo di installazione: se cambi solo il codice, le librerie
# non vengono reinstallate. Il primo "." è l'origine, il secondo "." è la WORKDIR (/app).
COPY pyproject.toml .
# RUN esegue un comando DURANTE la build (non all'avvio). Qui uno script Python legge
# pyproject.toml con tomllib (libreria standard, nessuna installazione extra), unisce le
# dipendenze con quelle di sviluppo (pytest, ruff, usate dai test) e salva la lista in
# /tmp/req.txt. Poi pip installa quella lista. "&&" esegue il comando dopo solo se il primo
# è andato a buon fine. --no-cache-dir: pip non conserva la cache, l'immagine resta leggera.
RUN python -c "import tomllib; p = tomllib.load(open('pyproject.toml', 'rb'))['project']; \
    print('\n'.join(p['dependencies'] + p['optional-dependencies']['dev']))" > /tmp/req.txt \
    && pip install --no-cache-dir -r /tmp/req.txt
# Ora copia TUTTO il progetto (apps/api) nel container. Le esclusioni stanno in .dockerignore:
# niente cache (__pycache__, .pytest_cache), niente *.egg-info e soprattutto niente .env,
# così le chiavi segrete non finiscono dentro l'immagine.
COPY . .
# Installa il progetto "in modalità editabile" (-e): crea un collegamento al codice in /app,
# così "import app" funziona ovunque nel container. --no-deps: non reinstalla le dipendenze,
# già installate sopra. La configurazione dei pacchetti sta in [tool.setuptools] di pyproject.
RUN pip install --no-cache-dir --no-deps -e .
# EXPOSE dichiara che il container ascolta sulla porta 8000. È solo documentazione: da sola
# non apre nulla. La pubblicazione sul computer la fa docker-compose.yml (ports: 8000:8000).
EXPOSE 8000
# CMD è il comando eseguito quando il container PARTE (non in fase di build). Forma JSON
# (exec form). sh -c serve a concatenare due comandi con "&&":
# 1) alembic upgrade head applica le migrazioni: crea/aggiorna le tabelle del database;
# 2) uvicorn avvia il server FastAPI (app.main:app = oggetto "app" in app/main.py).
# --host 0.0.0.0 accetta connessioni da fuori del container, non solo da localhost.
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
