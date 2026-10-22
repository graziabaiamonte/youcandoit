// e2e/welcome.spec.ts: test end-to-end (Playwright, https://playwright.dev/docs/intro) del popup
// di benvenuto "Welcome back" (components/welcome-dialog.tsx).
//
// COS'È UN TEST E2E (per chi inizia)
// Apre un browser vero, visita l'app vera e controlla ciò che vedrebbe una persona: clic,
// testi, elementi visibili. Non guarda il codice interno, verifica solo il risultato.
//
// COSA VERIFICA
// Alla prima apertura il popup compare con una citazione, si chiude col bottone "Let's study"
// e NON riappare dopo un ricaricamento nella stessa scheda. Questo test NON chiama skipWelcome
// (e2e/helpers.ts): il popup deve comparire, quindi il flag in sessionStorage non è preimpostato.
//
// CONCETTI USATI
//  - import da "@playwright/test": `test` definisce un caso di test, `expect` contiene le
//    asserzioni (le verifiche). Doc: https://playwright.dev/docs/writing-tests
//  - `async` / `await`: il browser impiega tempo. `await` aspetta che l'operazione finisca
//    prima di passare alla riga successiva. Doc: https://playwright.dev/docs/writing-tests
//  - Locator (getByTestId, getByRole, locator): "ricette" per trovare elementi nella pagina.
//    Sono pigri: la ricerca avviene solo quando si usa il locator (click, expect...).
//    Doc: https://playwright.dev/docs/locators
//  - expect(...).toBeVisible() / toBeHidden() / toContainText(): asserzioni con auto-attesa,
//    Playwright ritenta per alcuni secondi prima di fallire, quindi niente attese fisse.
//    Doc: https://playwright.dev/docs/test-assertions
//  - Configurazione in playwright.config.ts (baseURL, cartella e2e/, browser Chromium).
//    I test girano contro lo stack Docker già avviato. Versione rilevata nel progetto:
//    @playwright/test 1.64.1 (apps/web/package.json e package-lock.json).
import { expect, test } from "@playwright/test";

// test(nome, funzione): registra un caso di test; il nome compare nel report se fallisce.
// { page } è "destructuring": Playwright passa un oggetto e ne estraiamo la proprietà page.
test("shows a motivational quote on open and can be dismissed", async ({ page }) => {
  // Apre la homepage: baseURL (playwright.config.ts) + "/", di default http://localhost:3000/.
  // await attende che la navigazione finisca prima di proseguire.
  await page.goto("/");
  // Locator: cerca l'elemento con data-testid="welcome-dialog" (messo in welcome-dialog.tsx).
  // Non cerca ancora nulla: la ricerca avviene quando lo usiamo (expect, click...).
  const dialog = page.getByTestId("welcome-dialog");
  // Asserzione: il dialog deve essere visibile. Se non lo è entro il timeout, il test fallisce.
  await expect(dialog).toBeVisible();
  // Il testo della citazione (<blockquote>) non deve essere vuoto: la citazione c'è davvero.
  // .not inverte l'asserzione, cioè "non vuoto".
  await expect(dialog.locator("blockquote")).not.toBeEmpty();
  // L'autore (<figcaption>) deve contenere il trattino lungo "—" che precede il nome.
  // toContainText cerca il testo anche come parte della stringa, non solo come uguaglianza.
  await expect(dialog.locator("figcaption")).toContainText("—");
  // getByRole("button", ...) trova il bottone tramite il suo ruolo e testo accessibile.
  // .click() simula il clic dell'utente sul bottone "Let's study" del componente.
  await dialog.getByRole("button", { name: "Let's study" }).click();
  // Dopo il clic il dialog deve sparire: il componente chiama close(), che imposta open a false.
  await expect(dialog).toBeHidden();

  // shown once per browser session
  // reload() ricarica la pagina nella stessa scheda. sessionStorage sopravvive al reload
  // (si cancella solo chiudendo la scheda), quindi il flag salvato al clic è ancora presente.
  await page.reload();
  // Dopo il reload la homepage mostra il titolo <h1> di app/page.tsx. getByRole("heading")
  // cerca per ruolo; name confronta il testo accessibile (di default parziale, non case-sensitive).
  await expect(page.getByRole("heading", { name: "Your path to senior engineer" })).toBeVisible();
  // Il dialog NON deve ricomparire: il flag in sessionStorage lo impedisce (SEEN_KEY).
  // toBeHidden passa anche se l'elemento non esiste affatto nel DOM.
  await expect(page.getByTestId("welcome-dialog")).toBeHidden();
});
