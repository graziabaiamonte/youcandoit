// File di configurazione di Next.js per apps/web. Next.js lo legge da solo all'avvio
// (sia in `next dev` sia in `next build`): non va importato da nessun altro file.
// Decide come compilare, ottimizzare e servire l'app. Docs ufficiali (v16):
// https://nextjs.org/docs/app/api-reference/config/next-config-js
// Dettagli delle singole opzioni: apps/web/node_modules/next/dist/docs/ (vedi AGENTS.md).
//
// `import type` importa solo il TIPO NextConfig: serve a TypeScript per controllare
// le opzioni, e sparisce dal codice JavaScript finale (non esiste a runtime).
import type { NextConfig } from "next";

// Oggetto con le opzioni. `: NextConfig` fa controllare a TypeScript che le chiavi
// esistano davvero: un nome sbagliato viene segnalato subito invece di essere ignorato.
const nextConfig: NextConfig = {
  // "standalone": la build crea .next/standalone con solo i file necessari e un server.js.
  // Il Dockerfile copia quella cartella e avvia `node server.js` (niente node_modules).
  output: "standalone", // small self-contained server for the Docker image
  // Cache Components: abilita la direttiva `use cache` per mettere in cache singoli componenti
  // o funzioni. La pagina viene pre-renderizzata come shell statica, mentre le parti dinamiche
  // arrivano in streaming. Docs: .../config/next-config-js/cacheComponents
  cacheComponents: true,
  // Prefetch parziale: quando un link compare, Next.js scarica solo la parte statica della
  // rotta di destinazione (più veloce). Richiede cacheComponents. Docs: .../partialPrefetching
  partialPrefetching: true,
  // Opzioni per Turbopack, il bundler di Next.js (sostituisce webpack in dev e build).
  turbopack: {
    // `rules`: per i file che corrispondono a un glob (chiave), applica i loader indicati.
    rules: {
      // Glob: tutti i file .css del progetto.
      "*.css": {
        // Loader: fa passare il CSS da Tailwind CSS v4 (dipendenza @tailwindcss/turbopack).
        loaders: ["@tailwindcss/turbopack"],
        // Tipo di output del loader: il risultato resta CSS (*.css), quindi nessun altro passaggio.
        as: "*.css",
      },
    },
  },
};

// `export default` esporta l'oggetto come valore predefinito del modulo:
// è la forma che Next.js si aspetta di trovare quando carica questo file.
export default nextConfig;
