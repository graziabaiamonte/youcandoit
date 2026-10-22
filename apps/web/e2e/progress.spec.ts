// File di test end-to-end (Playwright, https://playwright.dev/docs/intro) sul PROGRESSO:
// spunte dei sottocapitoli, XP e mappa. Playwright apre un browser vero, naviga l'app come
// farebbe un utente e controlla cosa vede. Ogni `test(...)` è un caso indipendente.
// `expect(...)` è un'asserzione: se non è vera, il test fallisce (diventa rosso).
// `request` (APIRequestContext) fa chiamate HTTP dirette, senza browser: serve per preparare
// e pulire i dati. Doc: https://playwright.dev/docs/api/class-apirequestcontext
// Il browser chiama /api/*; il proxy app/api/[...path]/route.ts lo inoltra all'API FastAPI.
import { expect, test } from "@playwright/test";
import { skipWelcome } from "./helpers";

// ID del sottocapitolo usato dai test: è il bullet {#1} della sessione 0.1.1 in ROADMAP.md
// (id completo = "<id sessione>.<chiave>"). Se cambi ROADMAP.md, va aggiornato anche qui.
const SUB = "0.1.1.1";

// `beforeEach` gira PRIMA di ogni test del file, per partire sempre da uno stato pulito.
// `async ({ page, request })`: Playwright passa al callback le sue "fixture" (strumenti del test);
// la destrutturazione `{ page, request }` prende solo quelle che servono.
test.beforeEach(async ({ page, request }) => {
  // DELETE all'API: annulla il completamento salvato del sottocapitolo (XP compresi).
  await request.delete(`/api/progress/${SUB}`);
  // Funzione di helpers.ts: evita che il dialog di benvenuto copra la pagina.
  await skipWelcome(page);
});

// Primo caso di prova. Il titolo descrive in una frase il comportamento atteso.
// Nota: `page.goto("/session/0.1.1")` è relativo a baseURL (http://localhost:3000, vedi
// playwright.config.ts), quindi scrivi solo il percorso.
test("ticking a subchapter awards XP, updates the map and survives a reload", async ({ page }) => {
  // Apre la pagina della sessione 0.1.1 (l'id è nell'URL, vedi app/session/[id]/page.tsx).
  await page.goto("/session/0.1.1");
  // getByRole cerca un elemento per ruolo ARIA (qui il titolo h1): è il modo consigliato da
  // Playwright, perché rispecchia ciò che vede un utente o uno screen reader.
  // toContainText controlla che il testo contenga la stringa indicata.
  await expect(page.getByRole("heading", { level: 1 })).toContainText("How to learn effectively");
  // getByTestId cerca l'elemento con data-testid="xp-total" (vedi stats-mini.tsx).
  const xp = page.getByTestId("xp-total");
  // textContent legge il testo (es. "120 XP"); `await` aspetta la Promise. `??` = valore di
  // ripiego se il testo è null. parseInt converte la stringa in numero. Salviamo il valore PRIMA.
  const before = parseInt((await xp.textContent()) ?? "0");

  // Trova la casella (checkbox) del sottocapitolo: data-testid="sub-0.1.1.1" in session-view.tsx.
  const box = page.getByTestId(`sub-${SUB}`);
  // Il clic simula l'utente che spunta il sottocapitolo: l'app salva il progresso via API.
  await box.click();
  // Le asserzioni web-first (toBeChecked, toContainText) RIPROVANO da sole finché la condizione
  // non è vera o scade il timeout: non serve un sleep/attesa manuale.
  await expect(box).toBeChecked();
  // Ogni sottocapitolo vale 10 XP (XP_SUBCHAPTER in gamification.py). Il template literal
  // `${before + 10} XP` costruisce il testo atteso, es. "130 XP".
  await expect(xp).toContainText(`${before + 10} XP`);

  // Ricarica la pagina: se la spunta resta, il progresso è stato salvato nel backend
  // e non solo nella memoria del browser.
  await page.reload();
  // Dopo il reload la casella deve essere ancora spuntata ("survives a reload" nel titolo).
  await expect(page.getByTestId(`sub-${SUB}`)).toBeChecked();

  // Passa alla mappa dei percorsi (le "track" del ROADMAP.md).
  await page.goto("/map");
  // Track 0 è il primo percorso. learning-map.tsx lo espone con data-testid="map-track-0".
  const track0 = page.getByTestId("map-track-0");
  // Deve essere visibile sullo schermo, non solo presente nel DOM.
  await expect(track0).toBeVisible();
  // getAttribute legge l'attributo HTML data-percent (stringa); Number lo converte in numero.
  // Qui il `expect` non ha `await`: il valore è già stato letto con `await` nella riga sopra.
  expect(Number(await track0.getAttribute("data-percent"))).toBeGreaterThan(0);
});

// `afterEach` gira DOPO ogni test (anche se fallisce): pulisce il progresso lasciato in giro.
// È definito qui in mezzo al file, ma Playwright lo applica comunque a tutti i test del file.
test.afterEach(async ({ request }) => {
  // Stesso DELETE del beforeEach: riporta il sottocapitolo allo stato iniziale.
  await request.delete(`/api/progress/${SUB}`);
});

// Secondo caso: cliccare il titolo di un sottocapitolo apre la lezione, senza spuntarlo.
test("a subchapter expands to its lesson without ticking it", async ({ page }) => {
  // Apre la stessa sessione del primo test.
  await page.goto("/session/0.1.1");
  // Cerca un bottone il cui nome corrisponde alla RegExp /How memory works/ (le barre / / in JS
  // delimitano un'espressione regolare). Il clic espande la lezione del sottocapitolo.
  await page.getByRole("button", { name: /How memory works/ }).click();
  // Testo presente solo nella lezione content/lessons/.../0.1.1.md. Deve essere visibile.
  await expect(page.getByText("Think of your memory like a library")).toBeVisible();
  // Espandere non vuol dire completare: la casella deve restare vuota.
  // `.not` nega l'asserzione (il contrario di toBeChecked).
  await expect(page.getByTestId(`sub-${SUB}`)).not.toBeChecked();
});
