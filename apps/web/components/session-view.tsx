"use client";

// ============================================================================
// COSA FA QUESTO FILE: mostra UNA sessione del percorso (es. "0.1.1") con intestazione e
// progresso, obiettivi, lezione, sotto-capitoli apribili con checkbox, mappa mentale, fonti
// e pulsanti Precedente / Successiva. Esporta un solo componente: <SessionView id="0.1.1" />.
//
// DOVE SI USA: app/session/[id]/page.tsx lo rende passandogli l'id preso dall'URL. Non fa
// la richiesta da solo: i dati arrivano via SWR da GET /sessions/{id} dell'API FastAPI
// (passando dal proxy /api/*, vedi lib/api.ts e lib/hooks.ts). Per segnare un sotto-capitolo
// come fatto chiama PUT/DELETE /progress/{id}, poi ricarica /stats e /roadmap.
// Le parti interne sono: components/lesson.tsx (testo), components/mermaid.tsx (diagramma),
// components/tutor-sheet.tsx (pannello chat del tutor).
//
// CONCETTI CHIAVE (nessuna conoscenza pregressa richiesta):
// - "use client" (qui sopra): direttiva di Next.js App Router. Senza di essa il file girerebbe
//   solo sul server, che non puo' usare stato, eventi (onClick) o hook.
//   Doc di Next 16 nel progetto: node_modules/next/dist/docs/01-app/02-guides/
//   server-and-client-boundary.md
// - Hook: funzioni che iniziano con "use" (es. useSWR). Vanno chiamate in cima al componente,
//   mai dentro un if o un ciclo. Riferimento: react.dev/reference/react/hooks (React 19).
// - SWR: libreria che carica dati, li mette in cache e li ricarica. La "chiave" e' una stringa
//   che identifica i dati; il "fetcher" e' la funzione che fa la richiesta HTTP.
// - Componente: funzione che ritorna JSX (sintassi simile all'HTML scritta dentro JavaScript).
//   Quando dati o stato cambiano, la funzione viene rieseguita e il JSX si aggiorna.
// ============================================================================

// next/link: <Link> cambia pagina in modo rapido, senza ricaricare tutto il sito.
import Link from "next/link";
// SWR: useSWR carica e tiene in cache i dati; useSWRConfig da' accesso alla cache globale.
import useSWR, { useSWRConfig } from "swr";
// sonner: notifiche a comparsa (toast) per errori, badge sbloccati e salite di livello.
import { toast } from "sonner";
// lucide-react: libreria di icone. Ogni icona e' un componente usato come tag JSX (<TargetIcon />).
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ExternalLinkIcon,
  HammerIcon,
  NetworkIcon,
  TargetIcon,
} from "lucide-react";
// I componenti in components/ui/ sono di shadcn/ui: codice nostro, copiato e modificabile.
// "@/" e' un alias (tsconfig.json) che punta alla cartella apps/web.
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// Componenti del progetto: lezione Markdown, diagramma Mermaid, pannello chat del tutor.
import { Lesson } from "@/components/lesson";
import { Mermaid } from "@/components/mermaid";
import { TutorSheet } from "@/components/tutor-sheet";
// api: funzione per chiamate con metodo diverso da GET. fetcher: GET per SWR.
// trackStyle: colore della traccia come variabile CSS. "type" davanti a un nome = solo tipo
// TypeScript (SessionDetail, Stats), cancellato a runtime: serve solo al controllo dei tipi.
import { api, fetcher, trackStyle, type SessionDetail, type Stats } from "@/lib/api";
// cn: unisce classi CSS (Tailwind) e le condizioni: cn("a", vero && "b") ritorna "a b".
import { cn } from "@/lib/utils";

// Un sotto-capitolo e' un "esercizio" se il titolo inizia con "Practice:". Arrow function:
// funzione corta assegnata a una costante. Ritorna true o false.
const isPractice = (title: string) => title.startsWith("Practice:");

// Crea il testo della mappa mentale nella sintassi "mindmap" di Mermaid (diagrammi a parole).
function sessionMindmap(s: SessionDetail) {
  // Toglie i caratteri che rompono la sintassi Mermaid. Regex /[...]/g: cerca tutti quei caratteri
  // (g = globale). replace(cerca, nuovo) sostituisce; /^Practice: / cerca solo all'inizio (^).
  const clean = (t: string) => t.replace(/[()[\]{}"]/g, "").replace(/^Practice: /, "🛠 ");
  // (…) = rounded box, the app's card shape
  // Array di righe: "mindmap", la radice, poi un nodo per sotto-capitolo. "...": spread, inserisce
  // tutti gli elementi dell'array qui. join("\n") le unisce con un a capo.
  return ["mindmap", `  root(${clean(s.title)})`, ...s.subchapters.map((c, i) => `    n${i}(${clean(c.title)})`)].join("\n");
}

// Divide il Markdown della lezione: il testo prima del primo "## " e poi un pezzo per ogni sezione.
/** Splits a lesson into the text before the first `##` and one body per `##` section (heading dropped). */
function splitLesson(md: string | null | undefined) {
  // parts = array di array di righe. Parte da una lista vuota (il testo introduttivo).
  const parts: string[][] = [[]];
  // true quando siamo dentro un blocco di codice (```): dentro, un "## " non e' un titolo.
  let fenced = false;
  // ?? (nullish): se md e' null o undefined usa la stringa vuota. split("\n"): riga per riga.
  for (const line of (md ?? "").split("\n")) {
    // Regex /^```/: la riga INIZIA con tre backtick. ! inverte il valore: apre o chiude il blocco.
    if (/^```/.test(line)) fenced = !fenced;
    // Titolo di sezione fuori dai blocchi di codice: apre un nuovo array vuoto.
    // Altrimenti la riga va nell'ultimo array (parts[parts.length - 1]).
    if (!fenced && line.startsWith("## ")) parts.push([]);
    else parts[parts.length - 1].push(line);
  }
  // Primo pezzo = intro, gli altri = sezioni. map ripulisce ogni pezzo unendo le righe.
  // [intro, ...sections] = destrutturazione: "intro" prende il primo elemento, "sections" il resto.
  const [intro, ...sections] = parts.map((p) => p.join("\n").trim());
  // Ritorna un oggetto: { intro, sections } e' come { intro: intro, sections: sections }.
  return { intro, sections };
}

// export: rende il componente importabile da altri file. Il tipo delle props e' scritto inline
// dopo i due punti: { id }: { id: string } = riceve un oggetto con la proprieta' id, di tipo testo.
export function SessionView({ id }: { id: string }) {
  // Chiave della cache SWR: se cambia l'id, SWR caricherà i dati della sessione nuova.
  const key = `/sessions/${id}`;
  // useSWR<SessionDetail>: <T> e' un tipo generico (dice a TypeScript la forma di data).
  // Destrutturazione: prende data (rinominata "s"), error e mutate dall'oggetto ritornato.
  // mutate serve per ricaricare o modificare i dati in cache.
  const { data: s, error, mutate } = useSWR<SessionDetail>(key, fetcher);
  // Accesso alla cache globale: mutateGlobal aggiorna qualunque chiave (es. "/stats").
  const { mutate: mutateGlobal, cache } = useSWRConfig();

  // Errore: mostra il messaggio in rosso. return esce subito, quindi il JSX sotto non viene fatto.
  if (error) return <p className="text-destructive">{error.message}</p>;
  // Dati non ancora arrivati (!s = s e' undefined): mostra uno scheletro grigio di caricamento.
  if (!s) return <Skeleton className="h-96 rounded-xl" />;

  // Spezza la lezione in intro e sezioni (vedi splitLesson sopra).
  const { intro, sections } = splitLesson(s.lesson);
  // filter tiene solo i sotto-capitoli con done = true; .length conta quanti sono.
  const done = s.subchapters.filter((c) => c.done).length;

  // async: la funzione puo' usare await (aspettare una risposta di rete) senza bloccare la pagina.
  // Segna o toglie il completamento di un sotto-capitolo (subId) quando la checkbox cambia.
  async function toggle(subId: string, checked: boolean) {
    // read the cache, not render-time state: quick consecutive ticks must not overwrite each other
    // Legge la cache, non lo stato del render: due click veloci di seguito non si sovrascrivono.
    // ?.data: se /stats non e' in cache, undefined invece di errore. "as Stats": dice il tipo.
    const prev = cache.get("/stats")?.data as Stats | undefined;
    // Aggiornamento ottimistico: la UI cambia subito. false = non ricaricare dal server ora.
    // cur && {...}: se cur e' vuoto non fa niente. ...cur copia le proprieta' dell'oggetto.
    // map crea un nuovo array dove solo il sotto-capitolo con quell'id ha done aggiornato.
    mutate(
      (cur) => cur && { ...cur, subchapters: cur.subchapters.map((c) => (c.id === subId ? { ...c, done: checked } : c)) },
      false,
    );
    // try: prova le operazioni. Se una lancia un errore, il codice salta al catch (sotto).
    try {
      // await: aspetta la risposta. PUT segna come fatto, DELETE lo toglie. Torna le Stats.
      const stats = await api<Stats>(`/progress/${subId}`, { method: checked ? "PUT" : "DELETE" });
      // Promise.all: aspetta insieme tutte le richieste. Aggiorna /stats, ricarica /roadmap
      // (la mappa del percorso) e rifa la richiesta di questa sessione con mutate().
      await Promise.all([mutateGlobal("/stats", stats, false), mutateGlobal("/roadmap"), mutate()]);
      // Le notifiche di premio servono solo quando si segna come fatto, non quando si toglie.
      if (checked) {
        // filter: nuovo array con i badge che NON c'erano prima. some: true se uno corrisponde.
        const newBadges = stats.badges.filter((b) => !prev?.badges.some((p) => p.id === b.id));
        // forEach: esegue la funzione per ogni badge nuovo. toast.success mostra un avviso verde.
        newBadges.forEach((b) => toast.success(`🏅 Badge unlocked: ${b.title}`, { description: b.description }));
        // Se il livello e' salito mostra il level up; else if: altrimenti mostra gli XP guadagnati.
        if (prev && stats.level > prev.level) toast.success(`⭐ Level up! You reached level ${stats.level}`);
        else if (prev) toast(`+${stats.xp - prev.xp} XP`);
      }
    } catch (e) {
      // catch: eseguito solo in caso di errore (es. rete assente). mutate() senza argomenti
      // ricarica i dati veri dal server, annullando l'aggiornamento ottimistico.
      mutate();
      // (e as Error): dice a TypeScript che e' un oggetto Error, cosi' si puo' leggere .message.
      toast.error((e as Error).message);
    }
  }

  // Da qui in poi il JSX: il contenuto che il componente disegna. Le parentesi tonde servono
  // per poter andare a capo. Il primo elemento e' <article>, il contenitore di tutta la pagina.
  return (
    <article className="space-y-6" style={trackStyle(s.track_id)}>
      {/* Intestazione: sfondo di traccia, bordo, angoli tondi e ombra (classi Tailwind). */}
      <header className="surface-track space-y-3 rounded-3xl border p-6 shadow-xs">
        {/* Riga "Track N · titolo / modulo". {s.track_id} e' un valore JS dentro le graffe. */}
        <p className="text-sm font-medium text-track">
          Track {s.track_id} · {s.track_title} <span className="text-muted-foreground">/ {s.module_title}</span>
        </p>
        {/* Titolo: l'id in grigio, poi il nome della sessione. text-balance: a capo bilanciato. */}
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          <span className="text-muted-foreground">{s.id}</span> {s.title}
        </h1>
        {/* Barra di progresso: percentuale = fatti / totali * 100. aria-label la descrive. */}
        <div className="flex items-center gap-3">
          <Progress value={(done / s.subchapters.length) * 100} className="h-2 [&>*]:bg-track" aria-label="Session progress" />
          {/* Contatore "fatti/totali". tabular-nums: cifre tutte della stessa larghezza. */}
          <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {done}/{s.subchapters.length}
          </span>
        </div>
        {/* Pulsante che apre il pannello laterale (Sheet) con la chat del tutor. */}
        <div className="flex flex-wrap gap-2 pt-1">
          <TutorSheet sessionId={s.id} sessionTitle={s.title} />
        </div>
      </header>

      {/* Card degli obiettivi di apprendimento della sessione. */}
      <Card className="bg-primary/12">
        <CardContent className="flex gap-3">
          {/* aria-hidden: l'icona e' solo decorativa, gli screen reader la saltano. */}
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/24 text-primary" aria-hidden>
            <TargetIcon className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">By the end of this session you will</h2>
            <p className="mt-1 leading-relaxed">{s.outcomes}</p>
          </div>
        </CardContent>
      </Card>

      {/* && : "se intro esiste, mostra Lesson". Se e' vuoto, React non disegna nulla. */}
      {intro && <Lesson markdown={intro} />}

      {/* Sezione dei sotto-capitoli. aria-labelledby la collega al titolo (accessibilita'). */}
      <section aria-labelledby="subchapters-heading" className="space-y-3">
        <h2 id="subchapters-heading" className="flex items-center gap-2 text-lg font-semibold">
          <BookOpenIcon className="size-5 text-track" aria-hidden /> Subchapters
        </h2>
        {/* Accordion a fisarmonica: type="multiple" permette di aprire piu' pannelli insieme. */}
        <Accordion type="multiple" className="gap-2">
          {/* map: crea un elemento per ogni sotto-capitolo. c = il capitolo, i = indice (da 0). */}
          {s.subchapters.map((c, i) => {
            // Testo della lezione di questo sotto-capitolo (undefined se non ce n'e').
            const body = sections[i];
            // row = JSX salvato in una variabile, cosi' si puo' riusare nel trigger o nel div.
            const row = (
              <>
                {/* Cerchio col numero, o col martello per gli esercizi. cn sceglie il colore. */}
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
                    c.done ? "bg-track text-white dark:text-background" : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {/* Ternario ( condizione ? se-vero : se-falso ): un if-else in una riga. */}
                  {isPractice(c.title) ? <HammerIcon className="size-4" /> : i + 1}
                </span>
                {/* Titolo del sotto-capitolo; barrato quando e' fatto (line-through). */}
                <span className={cn("flex-1 leading-snug", c.done && "text-muted-foreground line-through")}>
                  {/* Esercizi: "Practice:" colorato, poi il resto del titolo. */}
                  {isPractice(c.title) ? (
                    <>
                      <span className="font-semibold text-track">Practice:</span>
                      {c.title.slice("Practice:".length)}
                    </>
                  ) : (
                    c.title
                  )}
                </span>
              </>
            );
            // key: id unico che React usa nelle liste per riconoscere gli elementi.
            // value: id dell'elemento Accordion, usato per aprire/chiudere quel pannello.
            // cn(...): le classi fisse piu' quelle aggiunte solo se la condizione (&&) e' vera.
            return (
              <AccordionItem
                key={c.id}
                value={c.id}
                className={cn(
                  "relative rounded-2xl border bg-card transition-colors hover:border-track/50",
                  c.done && "bg-muted/50",
                  isPractice(c.title) && "border-dashed border-track/60",
                )}
              >
                {/* Con testo: la riga e' un pulsante che apre/chiude. Senza: un div fisso. */}
                {body ? (
                  <AccordionTrigger className="items-center gap-4 border-0 p-4 pr-14 text-base font-normal hover:no-underline">
                    {row}
                  </AccordionTrigger>
                ) : (
                  <div className="flex items-center gap-4 p-4 pr-14">{row}</div>
                )}
                {/* sibling of the trigger: a checkbox inside a <button> is invalid and would toggle the panel */}
                {/* Checkbox controllata: checked da c.done; onCheckedChange chiama toggle. */}
                <Checkbox
                  checked={c.done}
                  onCheckedChange={(v) => toggle(c.id, v === true)}
                  aria-label={`Mark "${c.title}" as ${c.done ? "not done" : "done"}`}
                  data-testid={`sub-${c.id}`}
                  className="absolute top-[22px] right-4 size-5"
                />
                {/* Pannello espanso: la lezione del sotto-capitolo (solo se body esiste). */}
                {body && (
                  <AccordionContent className="px-4 pb-4 text-base">
                    <Lesson markdown={body} />
                  </AccordionContent>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Mappa mentale a scomparsa: Collapsible mostra/nasconde il contenuto col trigger. */}
      <Collapsible className="rounded-xl border bg-card">
        {/* Titolo cliccabile; "show diagram" e' il testo piccolo a destra (ml-auto). */}
        <CollapsibleTrigger className="flex w-full items-center gap-2 p-4 text-left font-semibold">
          <NetworkIcon className="size-5 text-track" aria-hidden /> Session map
          <span className="ml-auto text-xs font-normal text-muted-foreground">show diagram</span>
        </CollapsibleTrigger>
        {/* Contenuto nascosto finche' non si apre: il diagramma Mermaid di sessionMindmap. */}
        <CollapsibleContent className="session-mindmap px-4 pb-4">
          <Mermaid chart={sessionMindmap(s)} label={`Mind map of the subchapters of ${s.title}`} />
        </CollapsibleContent>
      </Collapsible>

      {/* Elenco delle fonti di studio: ogni fonte e' un link esterno. */}
      <section aria-labelledby="sources-heading" className="space-y-3">
        <h2 id="sources-heading" className="text-lg font-semibold">Study from these sources</h2>
        {/* Griglia: una colonna su telefono, due su schermi piccoli o piu' grandi (sm:). */}
        <ul className="grid gap-2 sm:grid-cols-2">
          {/* Un elemento della lista per ogni fonte. key = url, unico per ciascuna. */}
          {s.sources.map((src) => (
            <li key={src.url}>
              {/* target="_blank" apre in nuova scheda; rel="noreferrer" non passa l'origine. */}
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/50"
              >
                {/* Icona decorativa. shrink-0: non si schiaccia quando il testo e' lungo. */}
                <ExternalLinkIcon className="size-4 shrink-0 text-primary" aria-hidden />
                {/* Titolo della fonte e, sotto, il solo dominio (es. "developer.mozilla.org"). */}
                <span className="min-w-0">
                  <span className="block truncate font-medium">{src.title}</span>
                  {/* replace: toglie "https://" (regex). split("/")[0]: prende il dominio. */}
                  <span className="block truncate text-xs text-muted-foreground">{src.url.replace(/^https?:\/\//, "").split("/")[0]}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Navigazione: precedente e successiva. justify-between: una a sinistra, una a destra. */}
      <nav className="flex justify-between gap-2 border-t pt-6" aria-label="Session navigation">
        {/* Sessione precedente: pulsante-link, oppure uno span vuoto che tiene il posto. */}
        {/* asChild: il Button non crea un <button> ma passa il suo stile al figlio (il Link). */}
        {s.prev_id ? (
          <Button variant="outline" asChild>
            <Link href={`/session/${s.prev_id}`}>
              <ArrowLeftIcon aria-hidden /> Previous
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {/* && : il pulsante "Next session" compare solo se esiste una sessione successiva. */}
        {s.next_id && (
          <Button asChild>
            <Link href={`/session/${s.next_id}`}>
              Next session <ArrowRightIcon aria-hidden />
            </Link>
          </Button>
        )}
      </nav>
    </article>
  );
}
