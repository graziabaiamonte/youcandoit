/**
 * Configurazione di ESLint per apps/web (formato "flat config", quello moderno di ESLint 9).
 *
 * COS'È ESLINT: un "linter" legge il codice SENZA eseguirlo e segnala errori o pratiche
 * sospette (variabili non usate, hook React usati male, ecc.).
 * Si lancia con `npm run lint` (in package.json: "lint": "eslint"), che controlla il progetto
 * secondo le regole di questo file. È lo stesso controllo che la CI esegue prima del build.
 *
 * DOVE SI COLLOCA: ESLint legge questo file da solo dalla radice di apps/web. Nessuna pagina
 * o componente lo importa: vive solo nel tooling di sviluppo. Ha estensione .mjs perché usa
 * la sintassi dei moduli ES (import/export), che ESLint 9 si aspetta.
 *
 * FLAT CONFIG: il file esporta un ARRAY di configurazioni, applicate in ordine. Ogni oggetto
 * può avere campi come `files`, `ignores`, `rules`, `plugins`. Se due oggetti impostano la
 * stessa regola, vince quello che viene DOPO nell'array.
 * Doc: https://eslint.org/docs/latest/use/configure/configuration-files
 *
 * NEXT.JS 16: `next lint` è stato rimosso; si esegue ESLint direttamente e `next build` non
 * esegue più il lint. La config base arriva dal pacchetto eslint-config-next (16.4.2 installato).
 * Riferimento locale: node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md
 * Doc online: https://nextjs.org/docs/app/api-reference/config/eslint
 */
// defineConfig e globalIgnores arrivano da "eslint/config" (pacchetto eslint, devDependency).
// defineConfig costruisce l'array di configurazioni (con autocompletamento nell'editor).
// globalIgnores crea una configurazione che esclude dei percorsi da ogni controllo.
import { defineConfig, globalIgnores } from "eslint/config";
// Config ufficiale di Next.js per React e Next: regole su <img>, link verso pagine interne,
// script, font, hook React. Il suffisso "core-web-vitals" alza a errore le regole che
// incidono sulle performance misurate da Google (Core Web Vitals).
import nextVitals from "eslint-config-next/core-web-vitals";
// Regole TypeScript di typescript-eslint (set "recommended") per i file .ts e .tsx, più il parser
// che permette a ESLint di capire la sintassi TypeScript (tipi, interfacce, generics).
import nextTs from "eslint-config-next/typescript";

// Crea la config finale. `const` = variabile non riassegnabile. defineConfig([...]) riceve
// la lista di configurazioni: l'array tra le parentesi quadre è il suo unico argomento.
const eslintConfig = defineConfig([
  // Lo spread (`...`) inserisce tutti gli elementi di nextVitals in questo array, uno per uno.
  ...nextVitals,
  // Stessa cosa per la config TypeScript: le sue regole si aggiungono alla lista.
  ...nextTs,
  // Override default ignores of eslint-config-next.
  // globalIgnores: percorsi che ESLint non controlla mai. Senza `files` vale per tutto il progetto.
  // Le esclusioni sotto ripetono quelle di default di eslint-config-next, così sono visibili qui.
  globalIgnores([
    // Default ignores of eslint-config-next:
    // Cartelle e file generati, non scritti a mano: .next (cache e build di Next), out e build
    // (output di build/export), next-env.d.ts (file creato da Next con i riferimenti ai tipi).
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

// Esporta la config: ESLint importa questo file da solo e cerca proprio questo `export default`.
// Senza esportazione non avrebbe regole da applicare.
export default eslintConfig;
