"use client";

/*
 * COMMAND BAR: la barra di ricerca nell'header (in alto) che trova una sessione per id o titolo.
 * Si apre cliccandola oppure con ⌘K (Mac) / Ctrl+K (Windows/Linux).
 *
 * Dove si trova: montata in app/layout.tsx, dentro l'<header> sopra a ogni pagina.
 * Cosa usa:
 * - useRoadmap() (lib/hooks.ts) scarica la roadmap dall'API /roadmap tramite SWR;
 * - allSessions() (lib/api.ts) appiattisce tracce > moduli > sessioni in un unico array;
 * - Dialog e Input (components/ui/) sono componenti shadcn/ui, costruiti su Radix UI;
 * - router.push() (next/navigation) porta a /session/[id] (app/session/[id]/page.tsx).
 *
 * Concetti chiave per chi inizia:
 * - "use client": la direttiva di sopra dice a Next.js che questo componente gira nel BROWSER
 *   (Client Component), perché usa stato e tastiera. Doc Next.js 16:
 *   https://nextjs.org/docs/app/getting-started/server-and-client-components
 * - Hook React (useState, useEffect, useMemo): funzioni che iniziano con "use" e danno a un
 *   componente funzione stato, effetti collaterali e memoria dei calcoli. Doc React 19:
 *   https://react.dev/reference/react/hooks
 * - SWR (useRoadmap): scarica i dati e li tiene in cache. `data` è undefined mentre carica.
 * - Componente controllato: Dialog si mostra o si nasconde in base allo stato `open`.
 * - Accessibilità (aria-*, role, sr-only): aiutano gli screen reader.
 *   sr-only = classe Tailwind: visibile solo agli screen reader, non a schermo.
 *
 * Non invia dati al server: legge la roadmap già scaricata e filtra in memoria.
 */

// IMPORT: "import { x } from 'y'" porta nel file la cosa x esportata dal modulo y.
// Hook React: useEffect (effetti dopo il render), useMemo (memorizza calcoli), useState (stato).
import { useEffect, useMemo, useState } from "react";
// useRouter: hook di Next.js per cambiare pagina dal codice (vedi router.push più sotto).
// Doc: https://nextjs.org/docs/app/api-reference/functions/use-router
import { useRouter } from "next/navigation";
// SearchIcon: icona a forma di lente, disegnata come SVG dalla libreria lucide-react.
import { SearchIcon } from "lucide-react";
// Dialog e figli: finestra modale (popup). "@/" è un alias che punta alla cartella apps/web.
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
// Input: campo di testo già stilizzato (shadcn/ui).
import { Input } from "@/components/ui/input";
// allSessions: helper in lib/api.ts che raccoglie tutte le sessioni della roadmap in un array.
import { allSessions } from "@/lib/api";
// useRoadmap: hook SWR (lib/hooks.ts) che scarica la roadmap da /roadmap e la tiene in cache.
import { useRoadmap } from "@/lib/hooks";

/** Header search box; ⌘K / Ctrl+K opens a session finder (matches id or title). */
// export: rende il componente importabile da altri file (app/layout.tsx lo importa).
// Componente React = funzione che restituisce JSX (una sintassi simile all'HTML dentro al JS).
export function CommandBar() {
  // useRouter(): oggetto per navigare; lo usiamo in go() con router.push().
  const router = useRouter();
  // Destrutturazione: da ciò che restituisce useRoadmap() prende solo "data" e la chiama tracks.
  // SWR lascia data undefined mentre carica: per questo allSessions ha il default [].
  const { data: tracks } = useRoadmap();
  // useState(valore) restituisce [valoreAttuale, funzioneDiCambio]. Qui: la finestra è aperta?
  // Ogni cambio di stato fa ri-disegnare il componente con il nuovo valore.
  const [open, setOpen] = useState(false);
  // Testo digitato nel campo di ricerca.
  const [query, setQuery] = useState("");
  // Indice (0 = primo) della voce evidenziata nella lista dei risultati.
  const [active, setActive] = useState(0);

  // useEffect: esegue il codice DOPO che il componente è stato disegnato ("effetto collaterale").
  // Qui agganciamo un ascoltatore globale ai tasti premuti (keydown) su tutta la finestra.
  useEffect(() => {
    // Funzione chiamata a ogni tasto. "e" è l'evento: contiene quale tasto è stato premuto.
    // TypeScript: "(e: KeyboardEvent)" dichiara il tipo di e (un evento di tastiera del DOM).
    const onKey = (e: KeyboardEvent) => {
      // e.key è il tasto; metaKey = tasto ⌘ su Mac, ctrlKey = tasto Ctrl su Windows/Linux.
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        // Blocca l'azione predefinita del browser (alcuni browser usano ⌘K/Ctrl+K per la ricerca).
        e.preventDefault();
        // Inverte lo stato: aperta diventa chiusa e viceversa.
        // (o) => ... usa il valore più recente dello stato.
        setOpen((o) => !o);
      }
    };
    // Registra il listener sulla finestra del browser.
    window.addEventListener("keydown", onKey);
    // Funzione di pulizia: React la chiama quando il componente sparisce, così il listener
    // non resta attivo "orfano" (altrimenti si accumulerebbero a ogni montaggio).
    return () => window.removeEventListener("keydown", onKey);
    // Array di dipendenze vuoto: l'effetto viene eseguito una sola volta, al montaggio.
  }, []);

  // useMemo: memorizza il risultato e lo ricalcola solo quando cambiano tracks o query.
  const results = useMemo(() => {
    // q = testo cercato, senza spazi ai lati e in minuscolo, per un confronto "case-insensitive".
    const q = query.trim().toLowerCase();
    // Filtro: tiene le sessioni il cui id inizia con q, oppure il cui titolo contiene q.
    // Se q è vuoto (!q è true) le tiene tutte. filter crea un nuovo array,
    // senza toccare l'originale.
    // slice(0, 8) prende al massimo 8 risultati (posizioni dalla 0 alla 7).
    return allSessions(tracks).filter((s) => !q || s.id.startsWith(q) || s.title.toLowerCase().includes(q)).slice(0, 8);
    // Dipendenze: React ricalcola results solo se cambiano questi due valori.
  }, [tracks, query]);

  // Funzione helper: "id" è il codice della sessione (es. "0.1.1"). Chiude la finestra e naviga.
  const go = (id: string) => {
    // Chiude la finestra prima di cambiare pagina.
    setOpen(false);
    // Naviga alla pagina della sessione. I backtick (`) creano una stringa template:
    // ${id} inserisce il valore di id dentro il testo.
    router.push(`/session/${id}`);
  };

  // return: il JSX che il componente disegna. <>...</> è un "Fragment": un contenitore invisibile
  // che permette di restituire più elementi fratelli senza aggiungere un <div> in più.
  return (
    <>
      {/* Pulsante che sembra una barra di ricerca. type="button" evita che invii un form.
          onClick apre la finestra. className = classi Tailwind (CSS a "utility": flex, ...). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground hover:border-primary/50 sm:max-w-md"
      >
        {/* Il simbolo ">" in stile terminale. &gt; è l'entità HTML per ">". aria-hidden lo nasconde
            agli screen reader, perché è solo decorativo. */}
        <span className="font-mono text-primary" aria-hidden>&gt;</span>
        {/* Testo segnaposto. truncate = se è troppo lungo lo tronca con "...". */}
        <span className="truncate">Search sessions…</span>
        {/* kbd = tag HTML per una scorciatoia da tastiera. "hidden sm:inline" = nascosto su schermi
            piccoli e visibile dal breakpoint "sm" in su (prefissi Tailwind responsive). */}
        <kbd className="ml-auto hidden rounded border px-1.5 font-mono text-[11px] sm:inline">⌘K</kbd>
      </button>
      {/* Dialog: finestra popup. open={open} la mostra o nasconde in base al nostro stato.
          onOpenChange (sotto) gestisce le chiusure fatte dall'utente (tasto Esc, clic fuori). */}
      <Dialog
        open={open}
        onOpenChange={(o) => {
          // Aggiorna lo stato con il valore che Dialog ci passa (true = aperta, false = chiusa).
          setOpen(o);
          // Alla chiusura svuota la ricerca...
          setQuery("");
          // ...e riporta l'evidenziazione alla prima voce.
          setActive(0);
        }}
      >
        {/* DialogContent: il riquadro vero e proprio. showCloseButton={false} nasconde la "X".
            Le classi spostano la finestra più in alto (top-[20%]) e tolgono il padding (p-0). */}
        <DialogContent showCloseButton={false} className="top-[20%] translate-y-0 gap-0 p-0 sm:max-w-lg">
          {/* DialogTitle e DialogDescription: titolo e descrizione per gli screen reader.
              sr-only = visibili solo agli screen reader, non a schermo. */}
          <DialogTitle className="sr-only">Search sessions</DialogTitle>
          <DialogDescription className="sr-only">Type a session id or title, then press Enter.</DialogDescription>
          {/* Riga con lente e campo di testo. flex items-center = affiancati e centrati. */}
          <div className="flex items-center gap-2 border-b px-3">
            {/* Icona lente decorativa: aria-hidden la nasconde agli screen reader. */}
            <SearchIcon className="size-4 text-muted-foreground" aria-hidden />
            {/* Campo di ricerca. autoFocus: il cursore è già nel campo quando la finestra si apre.
                placeholder = testo di esempio grigio; aria-label = nome per gli screen reader;
                className toglie il bordo e l'ombra per fondersi con la finestra. */}
            <Input
              autoFocus
              value={query}
              placeholder="5.6.4 or “replication”"
              aria-label="Search sessions"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              onChange={(e) => {
                // e.target.value è il testo corrente del campo: lo salviamo nello stato.
                setQuery(e.target.value);
                // Ogni nuova ricerca riparte dalla prima voce.
                setActive(0);
              }}
              onKeyDown={(e) => {
                // Freccia giù / su: spostano l'evidenziazione. Math.min e Math.max la tengono
                // dentro i limiti della lista (né oltre l'ultima voce, né sotto la prima).
                if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
                else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
                // Invio: naviga alla voce evidenziata, solo se esiste (results[active] non vuoto).
                else if (e.key === "Enter" && results[active]) go(results[active].id);
              }}
            />
          </div>
          {/* Lista dei risultati. role="listbox" dice agli screen reader che è una lista di scelte.
              max-h-80 + overflow-auto: se è troppo lunga compare lo scroll. */}
          <ul className="max-h-80 overflow-auto p-1" role="listbox" aria-label="Sessions">
            {/* Se non ci sono risultati mostra un messaggio. !results.length è true quando la
                lista è vuota (lunghezza 0). && mostra il JSX solo se la parte sinistra è vera. */}
            {!results.length && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matching session.</li>}
            {/* .map trasforma ogni sessione in un <li>. (s, i) = la sessione e la sua posizione.
                key={s.id} è un identificativo unico: React lo usa per aggiornare la lista in
                modo efficiente. role="option" e aria-selected segnano la voce attiva. */}
            {results.map((s, i) => (
              // <li> per ogni risultato: stessa key e aria-selected spiegati sopra.
              <li key={s.id} role="option" aria-selected={i === active}>
                {/* Ogni voce è un bottone: cliccandolo si naviga. onMouseEnter: passando il mouse
                    sopra, la voce diventa attiva, così mouse e frecce restano sincronizzati. */}
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${i === active ? "bg-accent" : ""}`}
                >
                  {/* Id della sessione (es. 0.1.1) in colore primario; w-14 = larghezza fissa,
                      così i titoli risultano allineati. */}
                  <span className="w-14 shrink-0 font-mono text-xs text-primary">{s.id}</span>
                  {/* Titolo della sessione. truncate = se è lungo lo tronca. */}
                  <span className="truncate">{s.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
