"use client";

/*
 * components/welcome-dialog.tsx: il popup "Welcome back" con una citazione motivazionale.
 *
 * COS'È QUESTO FILE (per chi inizia)
 * È un componente React: una funzione che restituisce pezzi di interfaccia (JSX).
 * Viene montato UNA sola volta in app/layout.tsx, che è il layout comune a tutte le pagine,
 * quindi il popup può comparire sopra qualsiasi schermata. Non riceve props: prende tutto
 * da solo (dati dall'API, stato interno).
 *
 * COSA FA, IN ORDINE
 *  1. controlla in sessionStorage se è già stato mostrato in questa scheda del browser;
 *  2. se no, chiede una citazione casuale all'API (GET /quotes/random, vedi
 *     apps/api/app/routes/quotes.py) e apre il dialog;
 *  3. mostra anche streak, livello e XP letti dall'hook useStats() (lib/hooks.ts);
 *  4. alla chiusura salva il flag in sessionStorage, così non riappare in quella sessione.
 *
 * CONCETTI USATI
 *  - "use client" (riga sopra): direttiva di Next.js. Dice che questo file gira nel browser,
 *    perché usa useState/useEffect e gli eventi (onClick). Senza, Next lo tratterebbe come
 *    Server Component e gli hook darebbero errore.
 *    Doc: https://nextjs.org/docs/app/api-reference/directives/use-client
 *  - Hook (useState, useEffect): funzioni che React fornisce ai componenti per avere uno stato
 *    che, cambiando, ridisegna la UI, e per eseguire codice dopo il render.
 *    Doc: https://react.dev/reference/react/hooks
 *  - sessionStorage: piccola memoria del browser legata alla scheda; si cancella chiudendo
 *    la scheda. (localStorage invece persiste anche dopo la chiusura.)
 *    Doc: https://developer.mozilla.org/it/docs/Web/API/Window/sessionStorage
 *  - Il dialog è un componente shadcn/ui (components/ui/dialog.tsx) costruito sopra Radix UI:
 *    gestisce da solo focus, tasto Esc, sfondo scuro e chiusura cliccando fuori.
 *    Doc: https://ui.shadcn.com/docs/components/dialog
 *
 * VERSIONI RILEVATE (apps/web/package.json): Next.js 16.4.2, React 19.3.0.
 * Doc React ufficiale: https://react.dev/
 */

// React: useState e useEffect sono "hook" (funzioni che iniziano con "use") forniti da React.
import { useEffect, useState } from "react";
// lucide-react: libreria di icone. Ogni icona è un componente, usato come tag: <FlameIcon />.
import { FlameIcon, QuoteIcon, SparklesIcon } from "lucide-react";
// "@/" è un alias (tsconfig.json): significa la cartella apps/web. Importa il Button shadcn.
import { Button } from "@/components/ui/button";
// Dialog* sono i pezzi del popup, usati annidati: Dialog contiene DialogContent, che contiene
// intestazione (DialogHeader), corpo e footer (DialogFooter).
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// api: funzione che chiama il backend FastAPI passando dal proxy /api (vedi lib/api.ts).
// "type Quote": importa solo il tipo TypeScript della citazione; sparisce a runtime.
import { api, type Quote } from "@/lib/api";
// useStats: hook SWR che legge /stats (streak, livello, XP), con cache e aggiornamenti automatici.
import { useStats } from "@/lib/hooks";

// Chiave con cui salviamo in sessionStorage il fatto che il dialog è già stato chiuso.
const SEEN_KEY = "ycdi:welcome-seen";

/** A random motivational quote, shown once per browser session when the app opens. */
export function WelcomeDialog() {
  // useState restituisce [valoreAttuale, funzionePerCambiarlo].
  // Cambiare il valore ridisegna il componente. Tipo <Quote | null>: all'inizio null.
  const [quote, setQuote] = useState<Quote | null>(null);
  // false = dialog chiuso. Parte chiuso e si apre solo quando la citazione è pronta.
  const [open, setOpen] = useState(false);
  // Destrutturazione: prende la proprietà "data" dell'oggetto restituito e la chiama "stats".
  // È undefined finché i dati non arrivano.
  const { data: stats } = useStats();

  // useEffect: codice eseguito DOPO il render (non durante). L'array finale [] significa
  // "solo al primo montaggio", quindi la chiamata API parte una volta sola.
  useEffect(() => {
    // try/catch: prova il blocco; se lancia un errore, esegue catch invece di bloccare l'app.
    try {
      // Se il flag è già salvato in questa scheda, esce subito: niente popup e niente chiamata.
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      // storage blocked: just show the dialog
    }
    // Chiede al backend una citazione casuale (GET /quotes/random). <Quote> dice a TypeScript
    // il tipo atteso. api(...) restituisce una Promise: un valore che arriverà più tardi.
    api<Quote>("/quotes/random")
      // .then: eseguito quando la risposta arriva. (q) => { ... } è una arrow function che
      // riceve la citazione, la salva nello stato e apre il dialog.
      .then((q) => {
        setQuote(q);
        setOpen(true);
      })
      // .catch: se la chiamata fallisce (API spenta, rete assente), non fa nulla:
      // il dialog semplicemente non compare. Le {} vuote sono il corpo vuoto della funzione.
      .catch(() => {});
  }, []);

  // Chiude il dialog e ricorda che è stato visto. Serve sia al bottone sia a Esc / clic fuori.
  function close() {
    // Chiude il dialog (open diventa false).
    setOpen(false);
    try {
      // Salva il flag: il valore "1" non conta, basta che la chiave esista.
      sessionStorage.setItem(SEEN_KEY, "1");
      // Se lo storage è bloccato (es. modalità privata) il salvataggio fallisce:
      // l'errore viene ignorato.
    } catch {}
  }

  // Da qui in poi c'è il JSX: la "forma" della UI. Le ( ) permettono di scriverlo su più righe.
  return (
    // open={open}: visibilità controllata dallo stato. onOpenChange: chiamato quando l'utente
    // chiude (Esc, X, clic fuori). "o" è false in chiusura, quindi "!o" è true e chiamiamo close().
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      {/* DialogContent: la "scatola" del popup. sm:max-w-lg = larghezza massima "lg" da schermi
          piccoli in su (classi Tailwind). data-testid: etichetta usata dai test Playwright
          (e2e/welcome.spec.ts) per trovare questo elemento. */}
      <DialogContent className="sm:max-w-lg" data-testid="welcome-dialog">
        {/* Intestazione del dialog: titolo visibile e descrizione per gli screen reader. */}
        <DialogHeader>
          {/* Titolo piccolo e grigio. text-muted-foreground è un colore del tema (CSS token). */}
          <DialogTitle className="text-sm font-medium text-muted-foreground">Welcome back</DialogTitle>
          {/* sr-only (Tailwind): nascosta a vista ma letta dagli screen reader (accessibilità). */}
          <DialogDescription className="sr-only">Motivational quote of the day</DialogDescription>
        </DialogHeader>
        {/* && = "se quote esiste, mostra il blocco". Così non compare nulla prima che arrivi. */}
        {quote && (
          // figure: contenitore semantico per una citazione; figcaption è la sua didascalia.
          <figure className="space-y-3">
            {/* Icona decorativa. aria-hidden la nasconde agli screen reader: non va letta. */}
            <QuoteIcon className="size-7 text-primary" aria-hidden />
            {/* blockquote: il testo della citazione. {quote.text} inserisce il valore dentro. */}
            <blockquote className="text-xl leading-relaxed font-medium text-balance">{quote.text}</blockquote>
            {/* Autore, preceduto da un trattino lungo (em dash). */}
            <figcaption className="text-sm text-muted-foreground">— {quote.author}</figcaption>
          </figure>
        )}
        {/* Mostra streak e livello solo quando stats è arrivato dall'API. */}
        {stats && (
          // div flex: le due "pillole" affiancate. gap-3 = spazio tra i figli.
          <div className="flex gap-3 text-sm">
            {/* Pillola streak: icona fiamma. text-streak è un colore definito in globals.css. */}
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-streak">
              <FlameIcon className="size-4" aria-hidden /> {stats.streak}-day streak
            </span>
            {/* Pillola livello e XP. text-xp è l'altro colore del tema. */}
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-xp">
              <SparklesIcon className="size-4" aria-hidden /> Level {stats.level} · {stats.xp} XP
            </span>
          </div>
        )}
        {/* Footer: area dei bottoni, in fondo al dialog. */}
        <DialogFooter>
          {/* Bottone che chiude il dialog. autoFocus: il focus va subito qui, quindi Invio chiude.
              &apos; è l'apostrofo scritto in modo sicuro dentro il JSX (al posto di '). */}
          <Button onClick={close} autoFocus>
            Let&apos;s study
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
