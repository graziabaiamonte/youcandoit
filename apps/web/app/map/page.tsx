/*
 * File: app/map/page.tsx
 * Pagina "Learning map", raggiungibile all'URL /map.
 *
 * Come si collega al resto del progetto:
 * - Next.js (App Router) costruisce l'URL dalle cartelle: app/map/page.tsx diventa /map.
 *   Il nome "page.tsx" è una convenzione: dice "questo è il contenuto della pagina".
 * - La voce "Learning map" della sidebar (components/app-sidebar.tsx, href="/map") porta qui.
 * - Il layout condiviso app/layout.tsx avvolge questa pagina in <main>. Questo file imposta
 *   l'attributo data-fullbleed, che il layout legge per togliere margini e larghezza massima.
 * - La mappa vera (nodi, collegamenti, zoom, click) sta in components/learning-map.tsx.
 *   Questo file fa solo da contenitore: titolo, testo di aiuto e la mappa.
 *
 * Concetti usati qui:
 * - Server Component: in App Router ogni page.tsx è per default un Server Component, cioè
 *   gira sul server. Non c'è "use client" qui, quindi questa pagina non è interattiva.
 *   Guida: https://nextjs.org/docs/app/getting-started/server-and-client-components
 *   (versione del progetto: Next.js 16.4.2; docs locali in node_modules/next/dist/docs/)
 * - Client Component: learning-map.tsx ha "use client" in cima, quindi React Flow, i click
 *   e il tema girano nel browser. Una pagina server può contenere componenti client.
 *   Riferimento React: https://react.dev/reference/rsc/use-client
 * - Alias "@/": definito in tsconfig.json (paths "@/*": ["./*"]), punta alla radice di apps/web.
 * - Export default: Next.js prende la funzione esportata come default e la usa come pagina.
 *   Il nome MapPage è libero; ciò che conta è l'export default.
 * - JSX: il codice <div>...</div> dentro return è JSX, una sintassi simile all'HTML
 *   scritta dentro JavaScript. React la trasforma in una descrizione della UI.
 * - Tailwind CSS: le stringhe className contengono classi di utilità (flex, px-4, ecc.).
 *   Ogni classe fa una sola cosa di stile. Riferimento: https://tailwindcss.com/docs
 */

// import: porta dentro questo file il componente LearningMap. Le graffe indicano un export
// con nome (named export), non un export default.
import { LearningMap } from "@/components/learning-map";

// export default: Next.js usa questa funzione come contenuto della pagina /map.
// Una funzione che restituisce JSX è un componente React. Non riceve props perché
// la pagina non ha parametri nell'URL.
export default function MapPage() {
  // return: restituisce la descrizione della UI. Le parentesi tonde evitano il problema per cui,
  // se "return" va a capo, JavaScript restituisce undefined invece del JSX.
  return (
    // <div data-fullbleed>: contenitore a tutta area. "data-fullbleed" è un attributo data-*,
    // cioè un attributo personalizzato, usato come "marcatore" dal layout (app/layout.tsx).
    // className: in JSX si scrive className invece di class, perché class è parola riservata.
    // h-[calc(100svh-3rem)]: altezza = viewport visibile meno 3rem (48px), cioè l'header del
    // layout (h-12). flex flex-col: il contenuto si dispone in colonna verticale.
    <div data-fullbleed className="flex h-[calc(100svh-3rem)] flex-col">
      {/* header: intestazione della pagina. border-b = linea sotto; px-4 py-4 = spazi interni;
          md:px-8 = più spazio laterale dagli schermi medi in su (prefisso md: di Tailwind) */}
      <header className="border-b px-4 py-4 md:px-8">
        {/* h1: titolo principale, unico per pagina (importante per accessibilità e SEO).
            text-3xl = dimensione grande; font-semibold = grassetto medio;
            tracking-tight = lettere più vicine tra loro */}
        <h1 className="text-3xl font-semibold tracking-tight">Learning map</h1>
        {/* p: testo di aiuto che spiega come usare la mappa (resta in inglese come l'UI).
            Clic su una pillola = entri nel modulo; trascina = sposti la vista; rotella = zoom.
            text-muted-foreground = colore attenuato, dal tema shadcn/ui (variabile CSS) */}
        <p className="text-muted-foreground">
          Your journey, track by track. Each pill is a module — click it to jump in. Drag to pan, scroll to zoom.
        </p>
      </header>
      {/* LearningMap: il componente interattivo (React Flow) che disegna i nodi del percorso.
          Il tag <LearningMap /> con / finale è autochiudente: non ha figli da passargli. */}
      <LearningMap />
    </div>
  );
}
