/**
 * lib/utils.ts: file di utilità con una sola riga di codice, il "re-export" di `cn`.
 * Questo file non definisce nulla: prende `cn` da un altro modulo e lo riespone,
 * così chi importa da qui non deve sapere da dove arriva davvero.
 *
 * Perché esiste: shadcn/ui (components.json, alias "utils": "@/lib/utils") genera i
 * suoi componenti importando `cn` da questo percorso. Il progetto lo usa in 6 file:
 * components/lesson.tsx, star-button.tsx, progress-ring.tsx, session-view.tsx,
 * learning-map.tsx e app/news/page.tsx. Il prefisso "@/" è un alias definito in
 * tsconfig.json ("paths"): significa "dalla radice di apps/web".
 *
 * Cos'è `cn`: una funzione che riceve classi CSS di Tailwind e le unisce in un'unica
 * stringa. Ignora i valori falsi/vuoti (come clsx) e, quando due classi entrano in
 * conflitto, tiene solo l'ultima (come tailwind-merge): cn("px-2", "px-4") -> "px-4".
 * Serve perché un componente ha classi di default e il genitore può sovrascriverle
 * tramite la prop className.
 *
 * Da dove arriva: "cn" NON è un file del progetto. Senza "./" o "@/" davanti, il nome
 * indica un pacchetto npm: è in "dependencies" di package.json e sta in node_modules.
 * Il pacchetto (v0.5.0 installata in node_modules) è un sostituto drop-in di clsx e
 * tailwind-merge, come dichiara il suo README.
 *
 * Concetto: `export { x } from "y"` importa `x` dal modulo `y` e lo esporta in un colpo solo.
 * Riferimenti: https://tailwindcss.com/docs (Tailwind v4 come da package.json).
 */
// `export` rende `cn` visibile agli altri file; `from "cn"` dice da quale pacchetto prenderlo.
export { cn } from "cn"
