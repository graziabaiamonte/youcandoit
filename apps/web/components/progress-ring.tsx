/*
 * ─── COSA FA QUESTO FILE ─────────────────────────────────────────────────────
 * Definisce ProgressRing: un piccolo "anello di avanzamento" circolare che mostra una
 * percentuale (es. 40%). È un COMPONENTE React: una funzione che restituisce JSX
 * (la sintassi "HTML dentro JavaScript") e che si usa come un tag: <ProgressRing />.
 *
 * DOVE SI USA:
 *  - app/page.tsx (dashboard): mostra l'anello della prossima sessione da completare.
 *  - components/learning-map.tsx (mappa del percorso): un anello per ogni modulo/track.
 * Entrambi i file iniziano con "use client" (vedi la nota in quei file), quindi questo
 * componente finisce nel bundle del browser. Non ha "use client" perché non usa hook
 * (useState, useEffect...) né eventi: è codice puro, quindi può girare ovunque.
 *
 * COSA IMPORTA:
 *  - cn da lib/utils: piccolo helper che unisce più stringhe di classi CSS (Tailwind),
 *    scartando quelle vuote/false. Esempio: cn("a", cond && "b") -> "a" oppure "a b".
 *
 * SU NEXT.JS 16 / REACT 19: (package.json: next 16.4.2, react 19.3.0)
 *  - Le guide in apps/web/node_modules/next/dist/docs/01-app/ confermano che di default
 *    pagine e layout sono Server Components, mentre "use client" serve solo per
 *    interattività o API del browser. Questo file non ha bisogno di nessuna delle due cose.
 *  - Doc ufficiali: https://nextjs.org/docs (Server and Client Components)
 *    https://react.dev/reference/rsc/use-client
 *
 * CONCETTI CHIAVE DEL FILE:
 *  - Props: i dati passati al componente dal chiamante (qui percent e className).
 *    Il tipo { percent: number; className?: string } dice a TypeScript quali
 *    proprietà servono; "?" rende className opzionale.
 *  - conic-gradient: sfumatura di colore a "torta" (a settori) che disegna l'arco.
 *  - mask: maschera CSS che rende trasparente il centro, trasformando il disco pieno
 *    in un anello (ciambella).
 */
import { cn } from "@/lib/utils";

/** Circular progress in the element's --track colour; the hole is masked so it sits on any background. */
// "export function" = esporta il componente: altri file lo importano con { ProgressRing }.
// Il parametro { percent, className } è la destrutturazione delle props: estrae i due campi
// direttamente, invece di scrivere props.percent ogni volta.
export function ProgressRing({ percent, className }: { percent: number; className?: string }) {
  // "return (" restituisce il JSX da disegnare. Le parentesi tonde permettono di scrivere
  // il JSX su più righe senza che JavaScript inserisca un ";" nel punto sbagliato.
  return (
    // Il <div> è il contenitore esterno (vedi commenti sotto per ogni attributo).
    // Dentro il tag di apertura valgono i commenti // (JavaScript), tra un attributo e l'altro.
    <div
      // role="img": dice agli screen reader che questo blocco è un'immagine unica, non un
      // insieme di testi sparsi. aria-label è il testo che leggono al posto del contenuto.
      role="img"
      aria-label={`${percent}% complete`}
      // Le classi Tailwind (stile diretto nel JSX, niente file CSS separato):
      // relative = posizionamento di riferimento per lo span assoluto;
      // grid + place-items-center = centra il contenuto (la percentuale) in orizzontale/verticale;
      // size-12 = larghezza e altezza 3rem; shrink-0 = non si schiaccia in un layout flex;
      // rounded-full = angoli arrotondati al massimo, cioè un cerchio;
      // text-xs / font-semibold / tabular-nums = dimensione, grassetto, cifre di uguale larghezza.
      // className (prop) viene aggiunta in fondo: il chiamante può sovrascrivere la dimensione.
      // cn(...) unisce le due stringhe di classi (es. size-12 + size-16 nel dashboard).
      className={cn("relative grid size-12 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums", className)}
    >
      {/* Lo <span> vuoto disegna l'anello. Il testo sotto è la percentuale visibile. */}
      {/* aria-hidden: lo span decorativo è nascosto agli screen reader (c'è già aria-label). */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          // Lo style accetta un oggetto JS: le chiavi sono camelCase e i valori sono stringhe.
          // conic-gradient: colore --track (il colore della traccia, es. della mappa) fino a
          // percent * 3.6 gradi, poi --muted (grigio) per il resto. 360 gradi / 100 = 3.6.
          // Esempio: 50% -> 180deg colorati, 180deg grigi.
          background: `conic-gradient(var(--track) ${percent * 3.6}deg, var(--muted) 0)`,
          // mask: maschera. Dal centro fino al 76% del raggio è trasparente (il buco), oltre il 77%
          // è opaco (visibile): il disco colorato diventa un anello. Conta l'opacità, non il nero.
          mask: "radial-gradient(farthest-side, transparent 76%, #000 77%)",
        }}
      />
      {/* ${percent}% dentro {} stampa il valore della variabile: JSX come "testo + valore". */}
      {percent}%
    </div>
  );
}
