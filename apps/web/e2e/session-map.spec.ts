/*
 * COSA FA QUESTO FILE
 * Test end-to-end (Playwright) della "Session map" di una sessione: il diagramma mentale
 * (mindmap Mermaid) che si apre dal pulsante in fondo alla pagina sessione.
 * Verifica un bug visivo preciso: a zoom del browser al 90% le etichette uscivano dai riquadri.
 * Il test simula lo zoom via CSS e controlla che nessun testo ecceda il proprio box.
 *
 * DOVE SI COLLOCA NEL PROGETTO
 * - La mappa e' creata da sessionMindmap() in components/session-view.tsx (sintassi "mindmap"),
 *   disegnata da components/mermaid.tsx (htmlLabels: false, quindi etichette SVG <text>)
 *   e stilata da app/globals.css (classe .session-mindmap, circa riga 288).
 * - Usa la sessione "0.1.1", con dati da ROADMAP.md, come gli altri spec in apps/web/e2e/.
 * - Richiede lo stack avviato (docker compose + seed): vedi playwright.config.ts.
 *
 * CONCETTI BASE
 * - Un test Playwright e' una funzione async che riceve "page" (una scheda del browser reale) e
 *   usa "await" per aspettare ogni operazione (caricamento pagina, click, controlli).
 * - expect(...) fa asserzioni che RIPROVANO da sole per qualche secondo: utili perche' il
 *   diagramma compare dopo il caricamento asincrono di Mermaid.
 * - Riferimento ufficiale: https://playwright.dev/docs/writing-tests
 */
// Funzioni prese da Playwright: "expect" fa le asserzioni, "test" definisce il caso di test.
import { expect, test } from "@playwright/test";
// Helper condiviso (e2e/helpers.ts): segna il dialog di benvenuto come gia' visto.
import { skipWelcome } from "./helpers";

// Nome del test (mostrato nel report se fallisce), poi la funzione con il corpo del test.
test("session map labels fit their boxes at a fractional browser zoom", async ({ page }) => {
  // Evita che il dialog di benvenuto copra la pagina (vedi helpers.ts).
  await skipWelcome(page);
  // 90% zoom: Mermaid's HTML labels stopped wrapping here and were cut off
  // addInitScript: codice JS eseguito dal browser prima di ogni caricamento di pagina.
  // Dopo il DOMContentLoaded imposta lo zoom CSS di <html> a 0.9 (come lo zoom del browser al 90%).
  // La freccia viene inviata al browser: non puo' usare variabili del test (vedi helpers.ts).
  await page.addInitScript(() =>
    document.addEventListener("DOMContentLoaded", () => (document.documentElement.style.zoom = "0.9")),
  );
  // Apre la pagina della sessione 0.1.1 (baseURL di playwright.config.ts + questo percorso).
  await page.goto("/session/0.1.1");
  // Cerca il pulsante per nome accessibile (regex: contiene "Session map") e lo clicca:
  // apre il Collapsible che contiene il diagramma (vedi session-view.tsx).
  await page.getByRole("button", { name: /Session map/ }).click();
  // Locator: "descrizione" di elementi nella pagina, NON ancora gli elementi. Qui: ogni nodo
  // <g class="mindmap-node"> dentro il contenitore .session-mindmap prodotto da Mermaid.
  const nodes = page.locator(".session-mindmap g.mindmap-node");
  // Attende (con ripetizioni automatiche) che il primo nodo sia visibile: Mermaid disegna dopo.
  await expect(nodes.first()).toBeVisible();

  // evaluateAll: esegue la funzione NEL browser, con l'array di tutti i nodi trovati.
  // Restituisce al test solo il risultato (qui: il testo dei nodi che traboccano).
  const overflowing = await nodes.evaluateAll((gs) =>
    // gs.flatMap: per ogni nodo "g" restituisce [testo] se difettoso, altrimenti [] (lista vuota).
    // flatMap appiattisce le liste, cosi' l'output e' un semplice array di testi.
    gs.flatMap((g) => {
      // Riquadro del nodo: il primo <rect> o <path> (la forma disegnata da Mermaid).
      // getBoundingClientRect: dimensioni e posizione reali in pixel mostrati a schermo.
      // "!" (non-null assertion) dice a TypeScript: "so che non e' null", senza controllo.
      const box = g.querySelector("rect, path")!.getBoundingClientRect();
      // Etichetta del nodo: il primo <text> SVG (possibile perche' Mermaid usa htmlLabels: false).
      const text = g.querySelector("text")!.getBoundingClientRect();
      // Difetto se il testo e' piu' largo o alto del riquadro, con una tolleranza di 1 pixel
      // per gli arrotondamenti dei numeri frazionari dello zoom.
      return text.width > box.width + 1 || text.height > box.height + 1 ? [g.textContent] : [];
    }),
  );
  // Asserzione finale: la lista dei nodi difettosi deve essere vuota.
  // toEqual([]) confronta in profondita' (stesso contenuto), come un'uguaglianza tra array.
  expect(overflowing).toEqual([]);
});
