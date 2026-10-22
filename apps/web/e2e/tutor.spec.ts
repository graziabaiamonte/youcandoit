// File di test end-to-end (Playwright, https://playwright.dev/docs/intro) per il TUTOR AI:
// la chat "Ask the tutor" dentro una sessione e la chat sulla reading list (/news).
// Playwright apre un browser vero, naviga l'app e controlla cosa appare, come farebbe una persona.
// I test girano contro lo stack Docker attivo (vedi playwright.config.ts), con i dati di
// scripts/e2e-seed.sh e LLM_PROVIDER=fake: risposte finte e deterministiche, sempre uguali.
// `import { expect, test }`: `test` definisce un caso di test, `expect` verifica una condizione
// (es. "questo elemento e' visibile"). Entrambi vengono da @playwright/test.
import { expect, test } from "@playwright/test";
// Importa da helpers.ts la funzione che segna il dialog di benvenuto come gia' visto.
import { skipWelcome } from "./helpers";

// `beforeEach` esegue la funzione prima di OGNI test del file (qui: prima di ciascuno dei due).
// `async ({ page })`: Playwright passa al test una `page` (una scheda del browser) gia' pronta.
// `=> skipWelcome(page)` la passa all'helper. Doc: https://playwright.dev/docs/api/class-test
test.beforeEach(async ({ page }) => skipWelcome(page));

// Primo test: il tutor risponde e cita una fonte indicizzata per la sessione 0.1.1.
// `test("nome", async ({ page }) => {...})`: nome leggibile + funzione asincrona con il browser.
// `async/await`: ogni passo del browser richiede tempo, quindi si aspetta che finisca.
test("the tutor answers and cites the session's indexed sources", async ({ page }) => {
  test.setTimeout(180_000); // real local models can be slow; the fake provider is instant
  // page.goto apre l'URL (baseURL di playwright.config.ts + "/session/0.1.1"): la sessione 0.1.1.
  await page.goto("/session/0.1.1");
  // getByRole cerca un elemento per RUOLO e testo visibile, come fa uno screen reader.
  // .click() lo clicca: apre il pannello laterale della chat (components/tutor-sheet.tsx).
  await page.getByRole("button", { name: "Ask the tutor" }).click();
  // getByLabel trova il campo tramite aria-label="Your question" (components/chat.tsx).
  // .fill() scrive il testo, come farebbe una persona da tastiera.
  await page.getByLabel("Your question").fill("What is a shell?");
  // Clicca "Send" (aria-label in chat.tsx) per inviare la domanda al tutor.
  await page.getByRole("button", { name: "Send" }).click();

  // getByTestId trova data-testid="chat-answer", la bolla della risposta. Il test id e'
  // un'etichetta tecnica per i test: non cambia se il testo della UI cambia.
  const answer = page.getByTestId("chat-answer");
  // `{ timeout: 170_000 }` = 170000 ms (quasi 3 minuti): il "_" e' solo un separatore per leggerlo.
  // Serve per i modelli locali lenti; con il provider fake la risposta arriva subito.
  await expect(answer).toBeVisible({ timeout: 170_000 });
  // Cerca nella risposta un link il cui testo CONTIENE "MIT The Missing Semester" (regex /.../).
  // toHaveAttribute controlla che href sia l'URL della fonte di seed (il link esterno della chat).
  await expect(answer.getByRole("link", { name: /MIT The Missing Semester/ })).toHaveAttribute(
    "href",
    "https://missing.csail.mit.edu/",
  );
});

// Secondo test: la domanda sulla "reading list" (articoli salvati in /news) deve citare l'articolo.
// Stessa struttura del primo test, ma su una pagina diversa e senza scegliere il bottone del tutor.
test("asking the reading list cites a saved article", async ({ page }) => {
  // Stesso timeout alto del primo test: il modello reale puo' essere lento.
  test.setTimeout(180_000);
  // La pagina /news ha la stessa chat, ma risponde usando gli articoli salvati nella reading list.
  await page.goto("/news");
  // Scrive la domanda nel campo "Your question" (stesso componente Chat, riusato in /news).
  await page.getByLabel("Your question").fill("How does Kubernetes autoscaling work?");
  // Invia con il bottone "Send".
  await page.getByRole("button", { name: "Send" }).click();
  // Attende la bolla della risposta, come nel primo test.
  const answer = page.getByTestId("chat-answer");
  await expect(answer).toBeVisible({ timeout: 170_000 });
  // Controlla che tra le citazioni compaia l'articolo di seed (scripts/e2e-seed.sh).
  // Qui basta che sia visibile: non verifichiamo l'href come nel primo test.
  await expect(answer.getByRole("link", { name: /Kubernetes autoscaling explained/ })).toBeVisible();
});
