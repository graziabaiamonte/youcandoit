// layout.spec.ts: test end-to-end (Playwright) sulla larghezza del contenuto principale.
// Playwright avvia un browser Chromium vero, visita le pagine e controlla cosa vede l'utente.
// Verifica che solo la mappa occupi tutta la larghezza, anche dopo essere passati alla Dashboard.
// Si lancia dalla root con ./scripts/e2e.sh e2e/layout.spec.ts (vedi CLAUDE.md del progetto).
// Il layout testato e' app/layout.tsx: il <main> ha max-w-5xl (1024px), tolto se una pagina
// contiene un figlio data-fullbleed visibile (app/map/page.tsx).
// Doc: https://playwright.dev/docs/writing-tests (versione in package.json: ^1.64.1).
// Next.js 16.4.2 con cacheComponents: true (next.config.ts): le pagine visitate restano nel DOM,
// nascoste. Per questo il test controlla anche la navigazione lato client.
import { expect, test } from "@playwright/test";
// Helper in e2e/helpers.ts: segna il popup di benvenuto come gia' visto (sessionStorage).
import { skipWelcome } from "./helpers";

// test(nome, funzione): definisce un caso di test. "async" permette di usare "await" dentro.
// { page } e' una destrutturazione: Playwright passa al test una scheda del browser gia' pronta.
test("only the map is full width, also after navigating away from it", async ({ page }) => {
  // "await" aspetta che l'operazione asincrona finisca prima di passare alla riga successiva.
  await skipWelcome(page);
  // Finestra desktop di 1440x900 pixel: il layout e' pensato per schermi grandi, quindi il test
  // parte da una dimensione fissa e ripetibile.
  await page.setViewportSize({ width: 1440, height: 900 });
  // Locator: "descrittore" di un elemento, cercato solo quando serve. Il selettore CSS "main main"
  // indica un <main> dentro un altro <main>: il contenuto del layout sta dentro SidebarInset.
  const content = page.locator("main main");
  // Apre direttamente l'URL /map (il baseURL di playwright.config.ts viene messo davanti).
  await page.goto("/map");
  // expect(...).toBeVisible() riprova finche' l'elemento non compare: aspetta che la mappa sia
  // caricata. "map-track-0" e' il data-testid del primo percorso (components/learning-map.tsx).
  await expect(page.getByTestId("map-track-0")).toBeVisible();
  // boundingBox() restituisce x, y, width, height in pixel (o null se l'elemento non c'e').
  // Il "!" dice a TypeScript di fidarsi che non sia null. 1024 = max-w-5xl: la mappa lo supera.
  expect((await content.boundingBox())!.width).toBeGreaterThan(1024);

  // client navigation: cacheComponents keeps the map in the DOM, hidden
  // Clicca il link "Dashboard" nella sidebar. exact: true evita di prendere altri link simili.
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  // Verifica che l'URL sia cambiato in "/" (la Dashboard), senza ricaricare la pagina.
  await expect(page).toHaveURL("/");
  // expect.poll riprova la funzione finche' il risultato non e' 1024 (max-w-5xl), o scade.
  // Serve perche' dopo la navigazione il layout si aggiorna non subito. Qui si controlla che la
  // Dashboard torni al limite di 1024px, cioe' che la mappa non "sporchi" il layout.
  await expect.poll(async () => (await content.boundingBox())!.width).toBe(1024);
});
