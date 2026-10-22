"use client";

// ============================================================================
// components/tutor-sheet.tsx: il bottone "Ask the tutor" che apre un pannello laterale
// con la chat del tutor AI, limitata alle fonti della sessione corrente.
// ============================================================================
// DOVE SI USA (verificato con grep): components/session-view.tsx, nell'header della lezione:
//   <TutorSheet sessionId={s.id} sessionTitle={s.title} />
//
// RUOLO: questo file e' solo il "contenitore" grafico (bottone + pannello + titolo).
// La chat vera e propria e' in components/chat.tsx, che chiama l'endpoint "/ai/tutor" del
// backend (apps/api/app/routes/ai.py) e riceve { answer, citations }.
//
// CONCETTI (Next.js 16.4 e React 19.3, dalla documentazione ufficiale):
//  - "use client" (riga 1): il componente usa stato ed eventi (apri/chiudi), quindi gira nel
//    BROWSER. In Next.js i componenti sono di default Server Components, senza stato.
//    https://nextjs.org/docs/app/api-reference/directives/use-client
//  - Props: i dati che il genitore passa, es. sessionId. Il destructuring
//    `{ sessionId, sessionTitle }` li legge; il tipo dopo i due punti dice a TypeScript
//    che sono stringhe obbligatorie. https://react.dev/learn/passing-props-to-a-component
//  - Componente: una funzione che restituisce JSX (HTML scritto dentro il JavaScript).
//    https://react.dev/learn/your-first-component
//  - asChild (Radix UI): SheetTrigger non crea un bottone suo, ma passa la sua funzione
//    "apri" al figlio <Button>. https://www.radix-ui.com/primitives/docs/guides/composition
//  - Sheet (components/ui/sheet.tsx) e' costruito su Dialog di Radix UI: gestisce da solo
//    focus, tasto Esc e chiusura cliccando fuori.

// Gli import portano dentro il file i pezzi che servono (vedi commento in cima per il dettaglio).
// Icona della libreria lucide-react (cappello da laureato, usato come icona del tutor).
import { GraduationCapIcon } from "lucide-react";
// Il Button stilizzato di shadcn/ui; "@/" e' un alias che punta alla cartella apps/web.
import { Button } from "@/components/ui/button";
// I pezzi del pannello laterale (Sheet) definiti in components/ui/sheet.tsx.
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// La chat RAG riutilizzabile (domanda -> risposta con fonti).
import { Chat } from "@/components/chat";

// export function = componente esportato, importabile da altri file. Le props hanno la forma
// descritta dal tipo inline: { sessionId: string; sessionTitle: string }.
export function TutorSheet({ sessionId, sessionTitle }: { sessionId: string; sessionTitle: string }) {
  // return = il JSX che React disegna. <Sheet> e' il contenitore: tiene traccia se il pannello
  // e' aperto o chiuso (stato gestito internamente da Radix, quindi niente useState qui).
  return (
    <Sheet>
      {/* SheetTrigger = cio' che apre il pannello. asChild = non disegna un <button> suo: usa
          il figlio (il nostro Button) come elemento cliccabile. */}
      <SheetTrigger asChild>
        {/* variant="secondary" = stile grigio di shadcn/ui. aria-hidden sull'icona = e' decorativa:
            la lettura la fa il testo "Ask the tutor" (accessibilita'). */}
        <Button variant="secondary">
          <GraduationCapIcon aria-hidden /> Ask the tutor
        </Button>
      </SheetTrigger>
      {/* SheetContent = il pannello laterale. className con Tailwind: colonna flex, larghezza
          piena su mobile e larghezza massima "lg" dal breakpoint sm in su. */}
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        {/* SheetHeader = intestazione. Radix richiede un titolo per i dialog (accessibilita'). */}
        <SheetHeader>
          {/* SheetTitle = titolo visibile e annunciato agli screen reader. */}
          <SheetTitle>AI tutor</SheetTitle>
          {/* SheetDescription = sottotitolo. &apos; e' l'apostrofo scritto come entita' HTML, la
              forma sicura da usare in JSX. {sessionId} e {sessionTitle} sono espressioni JS
              inserite nel testo: vengono sostituite con i valori delle props. */}
          <SheetDescription>
            Answers come from this session&apos;s sources and cite them. Session {sessionId}: {sessionTitle}
          </SheetDescription>
        </SheetHeader>
        {/* div = contenitore della chat. min-h-0 e flex-1 la fanno occupare lo spazio rimasto nel
            pannello senza uscirne; px-4 e pb-4 sono margini interni (Tailwind). */}
        <div className="min-h-0 flex-1 px-4 pb-4">
          {/* Chat = componente riutilizzabile (components/chat.tsx). Le props che gli passiamo:
              - endpoint: dove inviare la domanda ("/ai/tutor" = tutor RAG);
              - extraBody: dati extra spediti con ogni domanda. Qui session_id, cosi' il backend
                cerca solo tra le fonti di questa lezione;
              - placeholder: testo guida nel campo di input;
              - suggestions: tre domande pronte da cliccare (array di stringhe). */}
          <Chat
            endpoint="/ai/tutor"
            extraBody={{ session_id: sessionId }}
            placeholder="Ask anything about this topic…"
            suggestions={[
              "Explain this topic to me like I'm new to programming.",
              "Give me a real-world analogy and a small example.",
              "What are the most common mistakes beginners make here?",
            ]}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
