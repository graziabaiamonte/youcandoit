// ============================================================================
// playwright.config.ts: configurazione di Playwright, lo strumento che esegue i test
// end-to-end (E2E): apre un browser vero, naviga l'app e clicca come farebbe un utente.
// Playwright legge questo file in automatico quando lanci `npx playwright test`.
// Doc: https://playwright.dev/docs/test-configuration
// ============================================================================
// `import { ... } from "pacchetto"` prende funzioni da una libreria installata in node_modules.
// Le graffe scelgono solo i nomi che servono: `defineConfig` (helper che controlla la config)
// e `devices` (profili predefiniti di browser, es. "Desktop Chrome").
import { defineConfig, devices } from "@playwright/test";

// Runs against a live stack (docker compose up + scripts/e2e-seed.sh).
// Use LLM_PROVIDER=fake on the API for deterministic AI answers (CI does).
// `export default` rende l'oggetto il valore "principale" di questo file: Playwright lo importa.
// `defineConfig({ ... })` riceve un oggetto con tutte le impostazioni dei test. Le chiavi sotto
// sono le opzioni; ogni riga spiega la sua.
export default defineConfig({
  // Cartella dove Playwright cerca i file di test (*.spec.ts), relativa a questo file.
  testDir: "./e2e",
  // false = i test dentro uno stesso file girano uno dopo l'altro, non in parallelo.
  // Serve perché i test condividono un solo database.
  fullyParallel: false, // specs share one database
  // Quanti processi (worker) di test far girare insieme: 1 = uno alla volta.
  workers: 1,
  // process.env legge le variabili d'ambiente del sistema. CI è impostata dai sistemi di
  // integrazione continua (es. GitHub Actions). Operatore ternario `cond ? a : b`: se cond
  // è vera usa `a`, altrimenti `b`. Quindi in CI riprova i test falliti una volta, in locale mai.
  retries: process.env.CI ? 1 : 0,
  // Come mostrare i risultati: in CI annotazioni GitHub + report HTML (senza aprirlo);
  // in locale un semplice elenco. Ogni voce è una coppia [nome, opzioni].
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  // `use` = impostazioni condivise da tutti i test (opzioni del browser e dell'app).
  use: {
    // Indirizzo base dell'app: page.goto("/map") diventa http://localhost:3000/map.
    // `??` (nullish coalescing) usa il valore a destra solo se BASE_URL non è definita.
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    // Registra una traccia (timeline di azioni e DOM) solo quando un test fallisce: serve al debug.
    trace: "retain-on-failure",
    // Scatta uno screenshot solo quando un test fallisce.
    screenshot: "only-on-failure",
  },
  // Un "progetto" è una combinazione di browser + impostazioni. Qui solo Chromium (il motore
  // di Chrome) con i parametri di "Desktop Chrome". `...` (spread) copia dentro `use` tutte le
  // proprietà di quell'oggetto (dimensione schermo, user agent, ecc.).
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
