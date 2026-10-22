# Dockerfile multi-stage: ogni blocco FROM è uno "stadio" che parte da zero. Solo l'ultimo
# stadio (run) finisce nell'immagine finale; gli altri servono per costruire l'app.
# Docs Next.js (deploy, output standalone): https://nextjs.org/docs/app/getting-started/deploying
# Immagine base: Node 24 su Alpine Linux (distribuzione Linux minimale, molto leggera).
# Stadio 1 "deps": installa le dipendenze. Lo stadio viene riusato dalla cache di Docker
# finché package.json / package-lock.json non cambiano.
FROM node:24-alpine AS deps
# Cartella di lavoro dentro il container: i comandi successivi partono da qui.
WORKDIR /app
# Copia solo i file dei pacchetti (non il codice), così questo strato resta in cache.
COPY package.json package-lock.json ./
# `npm ci` installa esattamente le versioni del lock file (build riproducibili), in node_modules.
RUN npm ci

# Stadio 2 "build": compila l'app Next.js partendo dal codice sorgente.
FROM node:24-alpine AS build
# Cartella di lavoro di questo stadio (ogni stadio ha il proprio filesystem).
WORKDIR /app
# Riprende le node_modules già installate nello stadio "deps" (--from=deps).
COPY --from=deps /app/node_modules ./node_modules
# Copia tutto il progetto. Le esclusioni stanno in .dockerignore (node_modules, .next, .env*...):
# così i segreti in .env non finiscono nell'immagine.
COPY . .
# Disattiva la telemetria di Next.js (invio di dati anonimi di utilizzo) durante la build.
ENV NEXT_TELEMETRY_DISABLED=1
# Esegue `next build`. Grazie a `output: "standalone"` in next.config.ts produce anche
# .next/standalone (solo i file necessari + server.js) e .next/static.
RUN npx next build

# Stadio 3 "run": l'immagine finale. Parte pulito e contiene solo ciò che serve a eseguire l'app.
FROM node:24-alpine AS run
# Cartella di lavoro: qui finirà il server standalone.
WORKDIR /app
# NODE_ENV=production attiva le ottimizzazioni di React/Next; PORT e HOSTNAME sono letti da
# server.js (HOSTNAME=0.0.0.0 fa ascoltare su tutte le interfacce, altrimenti solo nel container).
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
# Crea un gruppo "app" e un utente di sistema "app" (senza password né shell) per non far
# girare il server come root: se qualcuno lo compromette, i danni sono limitati.
RUN addgroup -S app && adduser -S app -G app
# Copia il server standalone: server.js e le sole node_modules necessarie (--chown: i file
# appartengono all'utente "app", altrimenti Node non potrebbe leggerli o scriverci cache).
COPY --from=build --chown=app:app /app/.next/standalone ./
# Il server standalone NON copia da solo gli asset statici (JS/CSS compilati): vanno copiati
# a mano nelle stesse posizioni in cui Next.js se li aspetta (.next/static).
COPY --from=build --chown=app:app /app/.next/static ./.next/static
# Anche la cartella public/ (immagini, favicon...) non viene copiata dallo standalone.
COPY --from=build --chown=app:app /app/public ./public
# Da qui in poi tutti i comandi e il processo finale girano con l'utente "app", non root.
USER app
# Solo documentazione: dichiara che il container ascolta sulla porta 3000. Non pubblica nulla
# da solo: la pubblicazione avviene con `ports` in docker-compose.yml.
EXPOSE 3000
# Comando di avvio del container: `node server.js`, il server minimale generato da Next.js.
# Forma a array (JSON): Node riceve i segnali di stop (docker stop) direttamente.
CMD ["node", "server.js"]
