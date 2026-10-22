/**
 * Test end-to-end (Playwright) della pagina di una sessione con lezione.
 * Playwright apre un vero browser (Chromium, vedi playwright.config.ts), visita l'app gia' avviata
 * (docker compose + seed) e controlla cio' che vede l'utente. Non tocca il codice dell'app.
 *
 * Come si collega al progetto:
 * - usa la sessione "0.1.1": i dati vengono da ROADMAP.md e da content/lessons/ (file .md);
 * - la lezione e' resa da components/lesson.tsx (callout, Mermaid) dentro session-view.tsx;
 * - helpers.ts fornisce skipWelcome, che evita che il dialog di benvenuto copra la pagina.
 *
 * Concetti base:
 * - import: porta dentro questo file funzioni definite in altri moduli (o librerie).
 * - test("nome", async ({ page }) => {...}): definisce un caso di test. "page" e' la scheda
 *   del browser; "async" permette di usare "await" (attendere operazioni che richiedono tempo).
 * - Guida ufficiale: https://playwright.dev/docs/writing-tests
 */
// Funzioni prese dalla libreria Playwright: "expect" fa le asserzioni, "test" definisce i test.
import { expect, test } from "@playwright/test";
// Import di una funzione dal file helpers.ts nella stessa cartella (il "./" indica il percorso).
import { skipWelcome } from "./helpers";

// beforeEach: funzione eseguita PRIMA di ogni test di questo file (qui: preparare la pagina).
test.beforeEach(async ({ page }) => {
  // Imposta un flag nel sessionStorage del browser cosi' il dialog di benvenuto non compare.
  await skipWelcome(page);
});

// Primo argomento di test(): il nome del test, mostrato nel report quando fallisce.
test("a session with a lesson renders text, a diagram and callouts", async ({ page }) => {
  // page.goto apre l'URL (baseURL in playwright.config.ts + "/session/0.1.1"): la pagina sessione.
  await page.goto("/session/0.1.1");
  // Each subchapter expands to its lesson section; the first one has the diagram and a callout.
  // getByRole cerca per ruolo ARIA (qui "button") e nome accessibile. /.../ e' una regex (testo
  // che contiene la frase). click() clicca il pulsante e apre l'accordion del sotto-capitolo.
  await page.getByRole("button", { name: /How memory works/ }).click();
  // Il pannello aperto ha ruolo "region" e il suo nome e' il titolo del sotto-capitolo.
  // "const" dichiara una variabile costante: un "locator" e' un riferimento lazy all'elemento.
  const lesson = page.getByRole("region", { name: /How memory works/ });
  // toBeVisible: asserzione che Playwright ritenta finche' l'elemento non appare (o scade il tempo)
  await expect(lesson).toBeVisible();

  // Mermaid renders client-side into an svg.
  // Cerca dentro "lesson" un elemento con ruolo "img" e label "Lesson diagram" (vedi lesson.tsx),
  // .first() prende il primo se ce n'e' piu' d'uno, .locator("svg") scende fino al disegno SVG.
  await expect(lesson.getByRole("img", { name: "Lesson diagram" }).first().locator("svg")).toBeVisible();
  // Callouts render as a Card with a label (the "[!NOTE]" marker is stripped).
  // getByText cerca il testo; exact: true = corrispondenza esatta (non basta che contenga "Note").
  await expect(lesson.getByText("Note", { exact: true }).first()).toBeVisible();
  // not.: negazione dell'asserzione. Verifica che il marcatore grezzo non sia rimasto nel testo.
  await expect(lesson).not.toContainText("[!NOTE]");
});
