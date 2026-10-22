/**
 * PAGINA 404 (app/not-found.tsx): quella che Next.js mostra quando l'utente apre un indirizzo
 * che non esiste (es. /pagina-inventata).
 *
 * Come si collega al resto del progetto:
 * - Nessuno la importa: Next.js la trova da solo perché il nome "not-found.tsx" dentro app/ è
 *   una convenzione riservata (come layout.tsx e page.tsx).
 * - Si apre DENTRO il layout radice (app/layout.tsx): sidebar, barra comandi e tema restano
 *   visibili; questo file riempie solo la parte centrale.
 * - Usa Button (components/ui/button.tsx) per il bottone di ritorno alla home.
 *
 * Concetti chiave:
 * - File convention: Next.js cerca "not-found" da solo. Doc ufficiale per la versione del
 *   progetto (Next 16.4.2): https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 *   Copia locale: apps/web/node_modules/next/dist/docs/01-app/03-api-reference/
 *   03-file-conventions/not-found.md
 * - Due casi d'uso: (1) URL che non corrisponde a nessuna route, (2) una pagina che chiama
 *   notFound() (da next/navigation). Nel progetto non c'e' nessuna chiamata notFound(),
 *   quindi il file serve per gli URL sbagliati.
 * - Status HTTP: se la risposta non e' ancora partita, Next risponde 404. Aggiunge anche
 *   <meta name="robots" content="noindex"> cosi' i motori di ricerca non indicizzano la pagina.
 * - Server Component: nessun "use client" in cima, quindi gira sul server. Non riceve props.
 * - Non esporta "metadata": il titolo e le meta tag arrivano dal layout radice.
 */

// Link di Next.js: come <a href> ma la navigazione avviene nel browser senza ricaricare tutto.
import Link from "next/link";
// Button di shadcn/ui: non e' una libreria installata, ma codice copiato dentro components/ui/.
// "@/" e' un alias che punta alla cartella apps/web (vedi "paths" in tsconfig.json).
import { Button } from "@/components/ui/button";

// "export default": il componente che Next.js monta quando serve la pagina 404.
// "function NotFound()": una funzione che restituisce JSX, cioe' la descrizione dell'HTML.
export default function NotFound() {
  // return ( ... ): le parentesi permettono di scrivere JSX su piu' righe.
  // className (non "class", che in JS e' una parola riservata) applica le classi Tailwind:
  // space-y-4 spazia i figli in verticale, py-16 da' padding sopra e sotto, text-center centra.
  return (
    <div className="space-y-4 py-16 text-center">
      {/* h1: il titolo principale della pagina, per chi legge e per i lettori di schermo. */}
      {/* &apos; e' un apostrofo scritto come entita' HTML: l'apostrofo "nudo" in JSX farebbe */}
      {/* scattare un avviso di ESLint (react/no-unescaped-entities). Si vede comunque "isn't". */}
      <h1 className="text-2xl font-semibold">This page isn&apos;t on the roadmap</h1>
      {/* asChild: di norma Button disegna un <button>. Con asChild passa stile e comportamento
          al suo unico figlio (il Link) e non crea un <button>: cosi' otteniamo un <a> che sembra
          un bottone. Implementato con Slot di radix-ui (components/ui/button.tsx). */}
      <Button asChild>
        {/* href="/" porta alla home/dashboard (app/page.tsx). Link evita il ricaricamento della
            pagina, come spiegato sopra. */}
        <Link href="/">Back to the dashboard</Link>
      </Button>
    </div>
  );
}
