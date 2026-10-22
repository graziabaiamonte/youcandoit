/*
 * PAGINA DI UNA SESSIONE (route: /session/[id]), in Next.js 16 App Router.
 *
 * Cos'e' questo file: ogni cartella dentro app/ con un file page.tsx diventa una URL.
 * Qui "[id]" e' un segmento dinamico: /session/0.1.1 fa scattare questo componente
 * con id = "0.1.1" (l'id di una sessione del ROADMAP.md, vedi il README della roadmap).
 *
 * Chi la usa: Link in app/page.tsx, components/app-sidebar.tsx, components/learning-map.tsx,
 * components/command-bar.tsx e i pulsanti prev/next dentro components/session-view.tsx.
 * Gli e2e (apps/web/e2e/*.spec.ts) la aprono direttamente con page.goto("/session/0.1.1").
 *
 * Cosa carica: questo file NON scarica i dati. Passa l'id a <SessionView>, un Client
 * Component (ha "use client" in cima) che li recupera dal browser con useSWR (libreria SWR)
 * usando il fetcher di lib/api.ts, che chiama l'API tramite il proxy /api/* di Next.
 *
 * Concetti chiave:
 * - Server Component (default in App Router): questo file gira sul server, non nel browser.
 *   Non ha "use client", quindi non puo' usare useState/useEffect ne' hook di SWR.
 * - PageProps<"/session/[id]">: tipo helper GLOBALE generato da Next (niente import).
 *   Descrive le props che Next passa alla pagina: qui solo "params".
 * - params e' una Promise (non un oggetto semplice) dalla versione 15 in poi: il valore
 *   arriva in modo asincrono, quindi non si puo' leggere params.id in modo sincrono.
 *   Doc: https://nextjs.org/docs/app/api-reference/file-conventions/page
 * - Suspense (da "react"): mostra il "fallback" finche' un contenuto non e' pronto e poi
 *   lo sostituisce. Qui il fallback e' uno scheletro grigio animato. Doc React 19:
 *   https://react.dev/reference/react/Suspense
 * - Streaming: Next invia l'HTML della pagina a pezzi; il confine <Suspense> decide
 *   quale parte puo' arrivare piu' tardi. Doc:
 *   https://nextjs.org/docs/app/guides/streaming
 */
// Importa il componente Suspense da React: serve per mostrare un fallback durante l'attesa
import { Suspense } from "react";
// Importa lo scheletro (placeholder di caricamento) dalla libreria shadcn/ui gia' nel progetto
import { Skeleton } from "@/components/ui/skeleton";
// Importa il componente che mostra davvero la sessione (lezione, sotto-capitoli, ecc.)
import { SessionView } from "@/components/session-view";

// Esporta di default la funzione del componente pagina: Next la usa per /session/[id]
// Il parametro { params } e' destrutturato: dalle props prende solo "params"
// Il tipo PageProps<"/session/[id]"> dice a TypeScript quali props e quale forma ha params
export default function SessionPage({ params }: PageProps<"/session/[id]">) {
  // Ritorna il JSX (la descrizione di cio' che va renderizzato) della pagina
  return (
    // Suspense: finche' il contenuto non e' pronto, React mostra il fallback passato in props
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      {/* params.then(...) attende la Promise dei params; quando risolve, esegue la funzione
          con l'oggetto { id } e il risultato (il JSX di SessionView) viene mostrato.
          Nota: la Promise viene passata come figlio, quindi Suspense attende il risultato
          senza che la funzione della pagina debba essere async. */}
      {params.then(({ id }) => (
        // Rende SessionView passandogli l'id letto dall'URL (es. "0.1.1")
        <SessionView id={id} />
      ))}
    </Suspense>
  );
}
