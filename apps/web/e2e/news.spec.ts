// File di test end-to-end (E2E) per la pagina /news: salva e toglie un articolo dai preferiti.
// Playwright (@playwright/test, v1.64 nel progetto) apre un browser vero (Chromium) e
// lo guida come farebbe un utente. Il test gira contro lo stack Docker gia' avviato
// (docker compose up + scripts/e2e-seed.sh), vedi playwright.config.ts (baseURL, workers: 1).
// Il titolo dell'articolo di prova viene creato da scripts/e2e-seed.sh (add-article).
// Flusso: l'UI (Next.js 16 + React 19) chiama l'API tramite il proxy /api/* (vedi CLAUDE.md).
// import { ... } da "@playwright/test": "expect" fa le asserzioni (verifiche),
// "test" definisce i casi di test. Sono importazioni con nome (named imports) in { }.
import { expect, test } from "@playwright/test";
// Helper locale (e2e/helpers.ts): segna il dialog di benvenuto come gia' visto.
import { skipWelcome } from "./helpers";

// Costante con il titolo dell'articolo seed: serve sia per cercarlo che per le asserzioni.
// Le costanti in MAIUSCOLO sono una convenzione per valori fissi.
const TITLE = "E2E: Kubernetes autoscaling explained";

// beforeEach: codice eseguito PRIMA di ogni test del file. Ripulisce lo stato precedente
// cosi' i test sono ripetibili. Riceve un oggetto con i "fixture" (page = scheda del browser,
// request = client HTTP verso l'app) tramite destructuring { page, request }.
test.beforeEach(async ({ page, request }) => {
  // Aggiunge uno script che gira prima del caricamento della pagina: imposta il flag di benvenuto.
  await skipWelcome(page);
  // Chiama l'API e legge la risposta come JSON. Il doppio await: il primo aspetta la risposta
  // HTTP, il secondo aspetta la conversione in JSON. Il tipo {id, title}[] e' un'annotazione TS.
  const articles: { id: number; title: string }[] = await (await request.get("/api/articles?limit=200")).json();
  // .find restituisce il primo elemento che rispetta la condizione (o undefined se non c'e').
  const seeded = articles.find((a) => a.title === TITLE);
  // Se l'articolo esiste ed e' gia' preferito, lo togliamo dai preferiti (DELETE .../favorite).
  if (seeded) await request.delete(`/api/articles/${seeded.id}/favorite`);
});

// test(nome, funzione async): definisce un caso di test. Il nome descrive il comportamento atteso.
// { page } e' il destructuring del fixture: Playwright crea una pagina pulita per questo test.
test("starring an article adds it to favorites and un-starring removes it", async ({ page }) => {
  // Apre la pagina /news nel browser (baseURL + "/news").
  await page.goto("/news");
  // Localizzatori (locator): cercano elementi nel DOM tramite data-testid (attributi di test).
  // Catena: dentro la griglia degli articoli, trova la card e filtra quella che contiene il titolo.
  const card = page.getByTestId("articles-grid").getByTestId("article-card").filter({ hasText: TITLE });
  // Asserzione: aspetta (con retry automatici) che la card sia visibile. Se no, il test fallisce.
  await expect(card).toBeVisible();

  // Dentro la card, trova il bottone con aria-label "Save ... to favorites" e ci clicca.
  // La regex /.../ fa match parziale; l'etichetta arriva da components/star-button.tsx.
  await card.getByRole("button", { name: /Save .* to favorites/ }).click();
  // Localizza la sezione laterale dei preferiti (data-testid="favorites" in app-sidebar.tsx).
  const favorites = page.getByTestId("favorites");
  // Verifica che il titolo sia comparso tra i preferiti.
  await expect(favorites.getByText(TITLE)).toBeVisible();

  // Stesso schema al contrario: clicca "Remove ... from favorites" dentro la sezione preferiti.
  await favorites.getByRole("button", { name: /Remove .* from favorites/ }).click();
  // Verifica che il titolo sia sparito dai preferiti (toBeHidden = non visibile o non presente).
  await expect(favorites.getByText(TITLE)).toBeHidden();
});
