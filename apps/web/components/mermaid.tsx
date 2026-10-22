"use client";

/*
 * COSA FA QUESTO FILE
 * Trasforma un diagramma scritto come testo (linguaggio Mermaid: flowchart, mindmap...)
 * in un disegno SVG (grafica vettoriale) direttamente nel browser.
 * Esempio: in un file di lezione scrivi un blocco di codice con linguaggio "mermaid"
 * e qui diventa un'immagine.
 *
 * DOVE SI COLLOCA NEL PROGETTO
 * - Lo usa components/lesson.tsx: la funzione "pre" intercetta i blocchi "language-mermaid"
 *   e li sostituisce con <Mermaid chart={testo} label="Lesson diagram" />.
 * - Il testo arriva dalle lezioni in content/lessons/ (Markdown), mostrate nelle pagine lezione.
 * - Gli stili delle mindmap (colori per tracciato) stanno in app/globals.css (circa riga 288).
 *
 * CONCETTI PRINCIPALI
 * - "use client" (sopra, prima degli import): direttiva di Next.js (App Router, qui 16.4.2).
 *   Dice che il componente gira nel browser, dove si possono usare hook e stato.
 *   Doc: https://nextjs.org/docs/app/api-reference/directives/use-client
 * - Hook (React 19.3.0): funzioni che iniziano con "use" e collegano stato ed effetti
 *   al componente. Doc: https://react.dev/reference/react/hooks
 * - Componente React: una funzione che riceve "props" (argomenti) e restituisce JSX,
 *   una sintassi simile all'HTML dentro al JavaScript.
 * - Caricamento lazy: `await import("mermaid")` scarica la libreria solo quando serve,
 *   così non appesantisce le altre pagine.
 *   Doc: https://nextjs.org/docs/app/guides/lazy-loading
 * - dangerouslySetInnerHTML: inserisce HTML grezzo nel DOM. Sicuro qui perché l'SVG viene
 *   generato da Mermaid con securityLevel "strict"; non usarlo mai con testo non fidato.
 *   Doc: https://react.dev/reference/react-dom/components/common
 */

// import: porta dentro il file funzioni da altri moduli.
// useEffect = codice che gira dopo il render; useId = id unico; useState = stato locale
import { useEffect, useId, useState } from "react";
// hook di next-themes: restituisce il tema attivo (chiaro, scuro, campus...)
import { useTheme } from "next-themes";
// funzione nostra: true per tutti i temi tranne "campus". "@/" = cartella apps/web (tsconfig)
import { isDarkTheme } from "@/lib/themes";

/** Renders a Mermaid diagram client-side; mermaid is lazy-loaded so it never bloats other pages. */
// export: rende il componente importabile da altri file. Le props chart e label sono stringhe
// (il tipo sta dopo i due punti: `{ chart: string; label: string }`, sintassi TypeScript)
export function Mermaid({ chart, label }: { chart: string; label: string }) {
  // stato: l'SVG pronto (stringa vuota finché non è disegnato). Sintassi [valore, setter]
  const [svg, setSvg] = useState("");
  // stato: true se Mermaid non riesce a disegnare il diagramma
  const [failed, setFailed] = useState(false);
  // id unico per questo componente; replace toglie i caratteri non validi (ammessi: lettere,
  // numeri, _ e -) perché Mermaid usa questo id come id dell'SVG
  const id = useId().replace(/[^\w-]/g, "");
  // legge il tema attivo; resolvedTheme è il nome risolto ("light", "dark", "campus"...)
  const { resolvedTheme } = useTheme();

  // useEffect: esegue il codice DOPO il render. L'array in fondo [chart, id, resolvedTheme]
  // elenca i valori da cui dipende: se uno cambia, l'effetto si rifà
  useEffect(() => {
    // flag: se il componente cambia o si smonta prima della fine, il risultato viene ignorato
    let cancelled = false;
    // funzione async subito invocata (IIFE): useEffect non può essere async direttamente
    (async () => {
      // try: se qualcosa va storto il catch sotto gestisce l'errore senza far crashare la pagina
      try {
        // import() dinamico: carica il modulo mermaid solo ora, e restituisce una Promise.
        // { default: mermaid } prende l'export predefinito (l'oggetto con i metodi)
        const { default: mermaid } = await import("mermaid");
        // configurazione globale di Mermaid, da impostare prima di disegnare
        mermaid.initialize({
          // Mermaid di default disegna da solo i blocchi trovati nella pagina: lo disattiviamo
          // perché disegniamo noi con render() qui sotto
          startOnLoad: false,
          // tema grafico di Mermaid: "dark" o "default" (chiaro), scelto dal tema dell'app
          theme: isDarkTheme(resolvedTheme) ? "dark" : "default",
          // "strict": Mermaid pulisce il testo del diagramma, niente script o HTML iniettato
          securityLevel: "strict",
          // measure labels in the app's font, so text fits its boxes
          // getComputedStyle legge lo stile reale calcolato dal browser: qui la font del body
          fontFamily: getComputedStyle(document.body).fontFamily,
          // SVG labels: Mermaid's HTML labels only wrap when a measured width equals the max exactly,
          // which fails at fractional browser zoom (90%, 110%…) and leaves text cut off
          htmlLabels: false,
        });
        // render: disegna il diagramma e restituisce l'SVG (asincrono, quindi await).
        // "m" davanti all'id perché un id non può iniziare con un numero. Questo { svg } è una
        // variabile nuova che "copre" lo stato svg di sopra: per questo si usa setSvg(svg)
        const { svg } = await mermaid.render(`m${id}`, chart);
        // aggiorna lo stato solo se l'effetto non è stato annullato nel frattempo
        if (!cancelled) {
          setSvg(svg);
          setFailed(false);
        }
      // catch senza parametro (ES2019): ci basta sapere che è fallito, non serve l'errore
      } catch {
        // an unparseable chart, or the mermaid chunk failed to load
        if (!cancelled) setFailed(true);
      }
    })();
    // funzione di pulizia: React la chiama prima di rifare l'effetto o smontare il componente
    return () => {
      cancelled = true;
    };
  // chiude l'effetto e l'array delle dipendenze (vedi il commento sopra useEffect)
  }, [chart, id, resolvedTheme]);

  // a chart Mermaid can't parse shows its source instead of an empty gap
  // <pre>: mostra il testo come scritto, con spazi e a capo; se Mermaid fallisce, appare questo
  if (failed) return <pre className="overflow-x-auto text-sm">{chart}</pre>;

  // JSX: il return restituisce l'albero di elementi da mostrare (un <div> che contiene l'SVG)
  return (
    <div
      // role="img": dice ai lettori di schermo che il contenuto è un'immagine (accessibilità)
      role="img"
      // aria-label: la descrizione testuale letta al posto del disegno
      aria-label={label}
      // classi Tailwind: scroll orizzontale se il diagramma è largo, e centra/ridimensiona l'SVG
      className="overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
      // mermaid output is generated locally from our own outline with securityLevel "strict"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
