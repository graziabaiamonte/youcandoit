// File di supporto per i test end-to-end (Playwright, https://playwright.dev/docs/intro).
// Non contiene test: esporta funzioni riusate da più spec in apps/web/e2e/ (tutor, progress,
// layout, lesson, news, session-map), così non ripetiamo lo stesso codice in ogni file.
// `import type` importa solo il TIPO `Page` (usato per scrivere il tipo del parametro);
// non esiste a runtime. Tipo Page: https://playwright.dev/docs/api/class-page
import type { Page } from "@playwright/test";

// `async` = la funzione restituisce una Promise: chi la chiama deve usare `await`.
/** Mark the welcome dialog as seen so it doesn't cover the page under test. */
export async function skipWelcome(page: Page) {
  // `page` rappresenta la scheda del browser controllata dal test.
  // addInitScript registra codice JS che il browser esegue PRIMA di caricare ogni pagina,
  // a ogni navigazione. Quindi la chiave è pronta quando l'app parte.
  // La freccia `() => ...` viene inviata al browser: NON può usare variabili del test.
  // "ycdi:welcome-seen" è la stessa chiave letta da components/welcome-dialog.tsx (SEEN_KEY):
  // con il valore "1" il dialog di benvenuto non compare e non copre la pagina.
  await page.addInitScript(() => sessionStorage.setItem("ycdi:welcome-seen", "1"));
}
