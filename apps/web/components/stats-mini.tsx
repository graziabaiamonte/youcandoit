"use client";

/*
 * COSA FA QUESTO FILE
 * Mostra in cima alla sidebar un riquadro compatto con il livello, la barra di avanzamento
 * verso il livello successivo e la serie di giorni di studio (streak). E' un "componente
 * React": una funzione che restituisce JSX, una sintassi simile all'HTML scritta dentro il
 * JavaScript. Il componente e' esportato con "export function", quindi altri file possono
 * importarlo con: import { StatsMini } from "@/components/stats-mini".
 *
 * DOVE SI COLLOCA NEL PROGETTO
 * - Chi lo usa: components/app-sidebar.tsx lo importa e lo mette dentro SidebarHeader,
 *   avvolto in un div che lo nasconde quando la sidebar e' ridotta a sole icone.
 * - Da dove arrivano i dati: hook useStats() in lib/hooks.ts, che chiama GET /stats tramite
 *   SWR (libreria di fetch con cache). Il tipo Stats viene da lib/api-types.ts, generato dallo
 *   schema Pydantic StatsOut in apps/api/app/routes/progress.py (npm run gen:api).
 * - Stili: classi Tailwind CSS e colori token --xp e --streak (app/globals.css).
 *
 * CONCETTI IMPORTANTI
 * - "use client" (sopra): direttiva di Next.js App Router (Next 16.4.2 nel progetto). Dice che
 *   il file gira nel browser: serve perche' usa hook come useStats, che leggono lo stato.
 *   Doc: https://nextjs.org/docs/app/getting-started/server-and-client-components
 * - Hook (useX): funzioni che iniziano con "use" e che React chiama solo al primo livello del
 *   componente, mai dentro if o cicli. Doc React 19: https://react.dev/reference/react/hooks
 * - Props: il componente non ne riceve nessuna; i dati arrivano dall'hook.
 * - Dati asincroni: al primo render data e' undefined; quando la risposta arriva, React
 *   ridisegna il componente da solo.
 */

// import: prende le icone SVG dalla libreria lucide-react (solo le due che servono).
import { FlameIcon, SparklesIcon } from "lucide-react";
// Hook personalizzato del progetto: restituisce { data, error, ... } per l'endpoint /stats.
import { useStats } from "@/lib/hooks";
// Barra di avanzamento shadcn/ui (components/ui/progress.tsx), costruita su Radix UI.
import { Progress } from "@/components/ui/progress";

/** Level, XP towards next level and streak — always visible in the sidebar header. */
export function StatsMini() {
  // Nome con maiuscola: React tratta <StatsMini /> come componente, non come tag HTML.
  // Destructuring: estrae solo la proprietà "data" dall'oggetto restituito dall'hook.
  const { data } = useStats();
  // Early return: finché i dati non ci sono, mostra un box vuoto alto come quello reale,
  // così la sidebar non "salta" quando arrivano i numeri.
  if (!data) return <div className="h-12" />;
  // Le parentesi tonde servono: senza di esse, un return seguito da un a capo restituirebbe
  // undefined. Dentro, il JSX è l'albero di elementi disegnato dal componente.
  return (
    // Contenitore esterno: spazio verticale tra le righe, sfondo e padding; data-testid
    // è un'etichetta stabile che i test automatici possono usare per trovarlo.
    <div className="space-y-1.5 rounded-lg bg-sidebar-accent/60 p-2.5 text-xs" data-testid="stats-mini">
      {/* Riga superiore: livello a sinistra, giorni di streak a destra (justify-between) */}
      <div className="flex items-center justify-between">
        {/* Livello in colore XP. Le graffe {} inseriscono un valore JS dentro il testo. */}
        <span className="flex items-center gap-1 font-semibold text-xp">
          {/* aria-hidden nasconde l'icona decorativa agli screen reader: il testo basta. */}
          <SparklesIcon className="size-3.5" aria-hidden /> Level {data.level}
        </span>
        {/* Serie di giorni consecutivi. title mostra un tooltip al passaggio del mouse. */}
        <span className="flex items-center gap-1 font-semibold text-streak" title="Study streak">
          {/* Icona fiamma decorativa; poi il numero e la parola al plurale o singolare. */}
          <FlameIcon className="size-3.5" aria-hidden /> {data.streak} day{data.streak === 1 ? "" : "s"}
        </span>
      </div>
      {/* Barra di avanzamento. value è una percentuale 0-100: XP già guadagnati nel livello
          diviso XP necessari per il successivo, moltiplicato per 100. */}
      <Progress
        value={(data.xp_into_level / data.xp_for_next_level) * 100}
        className="h-1.5 [&>*]:bg-xp"
        aria-label="Progress to next level"
      />
      {/* Testo sotto la barra: XP totali e quanti ne mancano al livello successivo, cioè la
          differenza (sottrazione) tra XP necessari e XP già guadagnati nel livello. */}
      <p className="text-muted-foreground" data-testid="xp-total">
        {data.xp} XP · {data.xp_for_next_level - data.xp_into_level} to level {data.level + 1}
      </p>
    </div>
  );
}
