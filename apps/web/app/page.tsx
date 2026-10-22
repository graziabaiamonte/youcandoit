"use client";

/*
 * PAGINA "DASHBOARD" (URL "/"): la home dell'app. È il primo schermo che vede lo studente:
 * mostra la prossima sessione da studiare, livello, XP, streak, una heatmap delle attività
 * degli ultimi mesi, il progresso per track e i badge guadagnati.
 *
 * COME SI COLLEGA AL RESTO DEL PROGETTO:
 * - In Next.js (App Router) ogni file `page.tsx` dentro `app/` diventa la pagina di una route.
 *   La cartella indica l'URL: `app/page.tsx` = "/", `app/session/...` = "/session/...".
 * - `app/layout.tsx` avvolge questa pagina con sidebar, header e i provider
 *   (components/providers.tsx).
 * - La pagina NON chiama direttamente il backend FastAPI: usa gli hook `useStats` e
 *   `useRoadmap` (lib/hooks.ts), che fanno richieste a `/api/*`. La route
 *   `app/api/[...path]/route.ts` le inoltra al server Python.
 * - Helper da lib/api.ts (allSessions, sessionProgress, trackStyle), anello di progresso da
 *   components/progress-ring.tsx, componenti grafici da components/ui/ (shadcn/ui).
 *
 * CONCETTI DA CONOSCERE:
 * - "use client" (riga 1): direttiva che dice a Next.js che questo file gira nel BROWSER.
 *   Di default in App Router i componenti sono Server Components (girano sul server e non
 *   possono usare hook come useState o useSWR). Qui servono hook e dati aggiornati, quindi
 *   la direttiva è necessaria. Guida locale (node_modules/next/dist/docs/...):
 *   01-app/01-getting-started/05-server-and-client-components.md
 * - Componente React: una funzione che restituisce JSX (sintassi simile all'HTML dentro
 *   JavaScript). Le graffe { } dentro il JSX inseriscono valori JavaScript.
 * - Dati asincroni: SWR fa la richiesta, memorizza il risultato e restituisce { data, error }.
 *   Finché data è undefined la pagina mostra gli Skeleton (placeholder grigi).
 * - Versioni: Next.js 16.4.2 e React 19 (vedi apps/web/package.json).
 *   Riferimenti ufficiali: https://nextjs.org/docs e https://react.dev/
 */

// Link di Next.js: naviga tra pagine senza ricaricare tutta l'app (come una SPA).
import Link from "next/link";
// Icone SVG dalla libreria lucide-react. Si usano come componenti: <FlameIcon />.
import { ArrowRightIcon, AwardIcon, FlameIcon, SparklesIcon, TargetIcon } from "lucide-react";
// Componenti shadcn/ui: il codice sta nel progetto in components/ui/ (modificabili).
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
// Componente nostro (components/progress-ring.tsx): anello circolare con una percentuale.
import { ProgressRing } from "@/components/progress-ring";
// Helper di lib/api.ts: appiattiscono l'albero del roadmap e calcolano i progressi.
import { allSessions, sessionProgress, trackStyle } from "@/lib/api";
// Hook SWR: caricano i dati dall'API e li tengono aggiornati. Restituiscono { data, error }.
import { useRoadmap, useStats } from "@/lib/hooks";

// `export default` = questa è la pagina esportata che Next.js mostra per la route "/".
// Il nome "Dashboard" è libero: Next guarda solo l'export default.
export default function Dashboard() {
  // Hook: estrae `data` rinominandolo `stats` ed `error` rinominandolo `statsError`.
  // Gli hook vanno chiamati sempre in cima alla funzione, mai dentro if o cicli.
  const { data: stats, error: statsError } = useStats();
  // Stesso schema per il roadmap (la lista delle track con moduli e sessioni).
  const { data: tracks, error: roadmapError } = useRoadmap();
  // `??` (nullish coalescing): usa il primo valore se non è null/undefined, altrimenti il secondo.
  const error = statsError ?? roadmapError;
  // Cerca la prima sessione con almeno un subchapter non spuntato. `.find` restituisce
  // l'elemento trovato oppure undefined. `allSessions` gestisce tracks undefined (caricamento).
  const next = allSessions(tracks).find((s) => {
    // Destructuring dell'oggetto restituito: estrae le proprietà done e total.
    const { done, total } = sessionProgress(s);
    // Vero se la sessione non è ancora completata.
    return done < total;
  });
  // `&&` (cortocircuito): se next è undefined, nextProgress resta undefined, nessun calcolo.
  const nextProgress = next && sessionProgress(next);

  // Il JSX della pagina. Le parentesi tonde servono solo per andare a capo su più righe.
  return (
    // Contenitore principale: `className` (non "class", parola riservata in JS) accetta classi
    // Tailwind CSS. `space-y-8` = spazio verticale tra i figli diretti.
    <div className="space-y-8">
      {/* Sezione d'intestazione: titolo e sottotitolo della pagina. */}
      <section>
        {/* Titolo principale; text-3xl e font-semibold sono classi Tailwind (dimensione, peso). */}
        <h1 className="text-3xl font-semibold tracking-tight">Your path to senior engineer</h1>
        {/* Sottotitolo in colore attenuato (muted-foreground, un colore del tema). */}
        <p className="mt-1 text-muted-foreground">
          One topic at a time. Tick subchapters as you master them — consistency beats intensity.
        </p>
        {/* Rendering condizionale: `error && <p>` mostra il messaggio solo se error esiste.
            Se error è undefined/null, React non renderizza nulla. `&apos;` è l'apostrofo
            (in JSX l'apostrofo nudo non si scrive, per regole di ESLint/HTML). */}
        {error && <p className="mt-2 text-destructive">Can&apos;t reach the API: {error.message}</p>}
      </section>

      {/* Griglia delle "card" di riepilogo: su desktop (lg) 4 colonne. aria-label dà un nome
          alla sezione per gli screen reader (chi non vede lo schermo). */}
      <section className="grid gap-3 lg:grid-cols-4" aria-label="Overview">
        {/* Primo blocco (ternario a tre rami, come if/else/else): mostra la prossima sessione
            se esiste, altrimenti "roadmap completo" se i dati sono arrivati, altrimenti uno
            skeleton. `a && b ? X : Y` valuta prima `a && b`, poi sceglie X o Y. */}
        {next && nextProgress ? (
          // Card della prossima sessione. `lg:col-span-2 lg:row-span-2` = occupa 2 colonne e
          // 2 righe su desktop. `surface-track` è una classe personalizzata del progetto.
          // `style` accetta un oggetto di stili inline. trackStyle imposta la variabile CSS
          // --track con il colore della track. `next.id.split(".")` spezza "1.2.3" in
          // ["1", "2", "3"]; [0] prende la prima parte, cioè il numero di track.
          <Card
            className="surface-track rounded-3xl lg:col-span-2 lg:row-span-2"
            style={trackStyle(next.id.split(".")[0])}
          >
            {/* CardHeader/CardTitle/CardDescription sono sottocomponenti di shadcn che danno
                struttura e stile standard alla card. */}
            <CardHeader>
              {/* Etichetta piccola in maiuscolo: `text-xs tracking-wider uppercase` sono classi
                  Tailwind per dimensione, spaziatura e maiuscole. */}
              <CardDescription className="text-xs tracking-wider uppercase">Next session</CardDescription>
              {/* ID della sessione (es. 1.2.3) in font monospazio; `text-track` usa il colore
                  della track impostato sopra con style. */}
              <span className="font-mono text-sm text-track">{next.id}</span>
              {/* Titolo della sessione: {next.title} inserisce il valore JavaScript nel JSX. */}
              <CardTitle className="font-heading text-2xl leading-tight">{next.title}</CardTitle>
            </CardHeader>
            {/* `mt-auto` = margin-top automatico: spinge il contenuto in fondo alla card
                (la card è un contenitore flex in colonna). */}
            <CardContent className="mt-auto space-y-4">
              {/* Riga con anello e testo affiancati (flex, centrati in verticale). */}
              <div className="flex items-center gap-3">
                {/* ProgressRing riceve `percent` (prop = parametro del componente). Math.round
                    arrotonda al numero intero più vicino. */}
                <ProgressRing
                  percent={Math.round((nextProgress.done / nextProgress.total) * 100)}
                  className="size-16 text-sm"
                />
                {/* Testo "3/10 subchapters done": ogni {} stampa un valore calcolato. */}
                <p className="font-mono text-xs text-muted-foreground">
                  {nextProgress.done}/{nextProgress.total} subchapters done
                </p>
              </div>
              {/* `asChild` (da Radix UI, su cui si basa shadcn): il Button NON crea un <button>,
                  ma passa il suo stile al figlio, qui il Link. Risultato: un link che sembra
                  un bottone, e HTML valido (niente <button> dentro <a>). */}
              <Button asChild className="rounded-full">
                {/* Link di Next.js: href con template literal (backtick) per l'URL, es.
                    /session/1.2.3. Next carica la pagina senza ricaricare il browser. */}
                <Link href={`/session/${next.id}`}>
                  {/* Testo "Study" seguito da una freccia: aria-hidden nasconde l'icona agli
                      screen reader, che leggono solo la parola. */}
                  Study <ArrowRightIcon aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : tracks ? (
          // Ramo "roadmap completo": i dati ci sono (tracks) ma non ci sono sessioni incomplete.
          <Card className="rounded-3xl lg:col-span-2 lg:row-span-2">
            <CardHeader>
              <CardDescription className="text-xs tracking-wider uppercase">Roadmap complete</CardDescription>
              <CardTitle className="font-heading text-2xl leading-tight">Every session is done. Time to build.</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          // Ramo di caricamento: placeholder animato finché i dati non arrivano dall'API.
          <Skeleton className="h-48 rounded-3xl lg:col-span-2 lg:row-span-2" />
        )}
        {/* StatCard (definito più in basso) è una card piccola con icona, etichetta, valore e
            testo secondario. Qui: livello. `stats && ...`: finché stats non c'è, il valore è
            undefined e StatCard mostra "—". `padStart(2, "0")` aggiunge lo zero: 3 diventa
            "03". */}
        <StatCard icon={SparklesIcon} tone="text-xp" label="Level" value={stats && `LV ${String(stats.level).padStart(2, "0")}`} hint={stats && `${stats.xp} XP total`} />
        {/* Stessa struttura per le streak: giorni consecutivi attuali e il record. */}
        <StatCard icon={FlameIcon} tone="text-streak" label="Streak" value={stats && `${stats.streak} d`} hint={stats && `Best: ${stats.best_streak} days`} />
        {/* Card della heatmap: occupa 2 colonne su desktop. py-4 = padding verticale. */}
        <Card className="gap-2 py-4 lg:col-span-2">
          {/* Intestazione con etichetta a sinistra e conteggio di oggi a destra. */}
          <CardHeader className="px-4">
            {/* `justify-between` spinge i due elementi agli estremi opposti della riga. */}
            <CardDescription className="flex items-center justify-between text-xs tracking-wider uppercase">
              {/* Icona bersaglio decorativa (aria-hidden) e testo. `text-success` = colore. */}
              <span className="flex items-center gap-1.5"><TargetIcon className="size-4 text-success" aria-hidden /> Last 24 weeks</span>
              {/* `?.` (optional chaining): se stats è undefined non va in errore ma dà undefined.
                  `?? 0` (nullish coalescing) poi mette 0 al posto di undefined. */}
              <span className="font-mono normal-case">{stats?.completed_today ?? 0} today</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            {/* Se stats è arrivato mostra la heatmap, altrimenti uno Skeleton. `activity` è un
                dizionario { "YYYY-MM-DD": numero di subchapter completati }. */}
            {stats ? <Heatmap activity={stats.activity} /> : <Skeleton className="h-24" />}
          </CardContent>
        </Card>
      </section>

      {/* Sezione "Tracks": una card per ogni track del roadmap. `aria-labelledby` collega la
          sezione al suo titolo (id="tracks-heading") per gli screen reader. */}
      <section aria-labelledby="tracks-heading" className="space-y-3">
        {/* Titolo della sezione. L'`id` deve combaciare con aria-labelledby sopra. */}
        <h2 id="tracks-heading" className="text-lg font-semibold">Tracks</h2>
        {/* Griglia: una colonna su mobile, due da `sm` (schermi medi) in su. */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Finché le stats non arrivano, mostra 6 placeholder. `Array.from({ length: 6 }, fn)`
              crea un array di 6 elementi: `_` è il valore (non usato), `i` è l'indice 0..5.
              `key` è obbligatoria quando si genera una lista: aiuta React a riconoscere gli
              elementi tra un render e l'altro. `!stats` = stats non ancora arrivato. */}
          {!stats && Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          {/* `.map` trasforma ogni track in un elemento JSX (una card). `stats?.tracks` usa
              l'optional chaining: se stats non c'è, la lista è undefined e non rende nulla. */}
          {stats?.tracks.map((t) => (
            // Una card per track. `key={t.id}` è l'identificatore univoco richiesto da React.
            // `style={trackStyle(t.id)}` imposta il colore della track (vedi sopra).
            <Card key={t.id} className="surface-track gap-2 rounded-2xl py-4" style={trackStyle(t.id)}>
              <CardHeader className="px-4">
                {/* `items-baseline` allinea i testi sulla linea di base; `justify-between` separa
                    il titolo dal contatore. */}
                <CardTitle className="flex items-baseline justify-between gap-2 text-sm">
                  <span>
                    {/* "T1" in colore track e poi il titolo. `·` è un carattere separatore. */}
                    <span className="font-mono text-track">T{t.id}</span> · {t.title}
                  </span>
                  {/* Contatore "done/total". `tabular-nums` rende le cifre di larghezza uguale. */}
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {t.done}/{t.total}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                {/* Barra di progresso (0-100). Se total è 0 (nessun subchapter) mostra 0: così
                    non si divide per zero, che darebbe NaN. `[&>*]:bg-track` è una variante
                    Tailwind "arbitraria": colora con il colore track il figlio interno della barra.
                    aria-label descrive la barra per gli screen reader. */}
                <Progress value={t.total ? (t.done / t.total) * 100 : 0} className="h-1.5 [&>*]:bg-track" aria-label={`Track ${t.id} progress`} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sezione "Badges" (medaglie guadagnate). Stessa logica di aria-labelledby della sezione
          Tracks. */}
      <section aria-labelledby="badges-heading" className="space-y-3">
        {/* Titolo della sezione, collegato tramite id. */}
        <h2 id="badges-heading" className="text-lg font-semibold">Badges</h2>
        {/* Messaggio incoraggiante: compare solo se stats è arrivato e la lista è vuota.
            `!stats.badges.length`: la lunghezza 0 è "falsy", quindi il `!` diventa true.
            `stats && ... && (...)`: se una parte è falsa, React non mostra nulla. */}
        {stats && !stats.badges.length && (
          <p className="text-sm text-muted-foreground">Complete your first subchapter to earn your first badge.</p>
        )}
        {/* Badge affiancati; `flex-wrap` li manda a capo se non ci stanno sulla riga. */}
        <div className="flex flex-wrap gap-2">
          {/* Un Badge per ogni elemento di stats.badges (`?.` evita errori se stats non c'è). */}
          {stats?.badges.map((b) => (
            // `title` mostra la descrizione come tooltip nativo al passaggio del mouse.
            // `variant="secondary"` è uno stile predefinito di shadcn.
            <Badge key={b.id} variant="secondary" className="h-auto gap-1.5 px-3 py-1" title={b.description}>
              {/* Icona premio decorativa (aria-hidden) seguita dal nome del badge. */}
              <AwardIcon className="size-3.5 text-xp" aria-hidden /> {b.title}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}

// Componente di supporto, definito in questo file e non esportato. Riceve le sue "props"
// (parametri) e le estrae con il destructuring `{ icon: Icon, tone, ... }`. Il nome `Icon`
// è maiuscolo: i componenti React devono iniziare con la maiuscola, altrimenti JSX li
// tratterebbe come tag HTML (<icon> invece di <Icon>).
function StatCard({
  icon: Icon,
  tone,
  label,
  value,
  hint,
}: {
  // Tipi TypeScript delle props (annotazione dopo i due punti). `React.ComponentType` = un
  // componente React qualsiasi; `React.ReactNode` = tutto ciò che si può mostrare (testo,
  // numeri, JSX, null). Il namespace `React` è disponibile come tipo senza import.
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  label: string;
  value: React.ReactNode;
  hint: React.ReactNode;
}) {
  // Stesso JSX di una card: il corpo è un CardContent con tre righe (label, valore, hint).
  return (
    // `gap-1 py-4`: spazi ridotti tra le parti e padding verticale.
    <Card className="gap-1 py-4">
      <CardContent className="px-4">
        {/* Etichetta con icona. `<Icon />` renderizza il componente ricevuto come prop. */}
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {/* Il template literal con backtick inserisce la classe colore dentro className. */}
          <Icon className={`size-4 ${tone}`} /> {label}
        </p>
        {/* Valore grande. `value ?? "—"`: se value è null/undefined mostra un trattino. */}
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{value ?? "—"}</p>
        {/* Testo secondario piccolo sotto il valore. */}
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

// Costante: quante settimane mostra la heatmap. Nome in MAIUSCOLO per convenzione (valore fisso).
const WEEKS = 24;
// Funzione freccia che converte una Date in una stringa "YYYY-MM-DD": è la chiave usata nel
// dizionario `activity` che arriva dal backend. `getMonth()` parte da 0 (gennaio = 0), per
// questo +1. `padStart(2, "0")` aggiunge lo zero iniziale (es. "05"). Deve combaciare con le
// chiavi dell'API, altrimenti i giorni non vengono colorati.
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** GitHub-style grid: columns are weeks (Monday first), the last column ends today. */
function Heatmap({ activity }: { activity: Record<string, number> }) {
  // Data di oggi (il momento in cui il componente viene disegnato).
  const today = new Date();
  // Crea le 168 celle (24 settimane x 7 giorni). `i` è l'indice da 0 a 167.
  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
    // Copia di today: le Date sono mutabili (setDate le modifica), l'originale resta intatto.
    const d = new Date(today);
    // Calcolo del giorno. `getDay()` va da 0 (domenica) a 6 (sabato); `(getDay() + 6) % 7`
    // porta lunedì a 0, così la settimana inizia di lunedì. Si sottrae questo valore per
    // arrivare al lunedì della settimana corrente, poi `(WEEKS - 1) * 7` per tornare alle
    // settimane precedenti, e infine `+ i` per l'offset di questa cella.
    // `setDate` accetta anche numeri negativi e sistema il mese/anno da solo.
    d.setDate(today.getDate() - ((today.getDay() + 6) % 7) - (WEEKS - 1) * 7 + i);
    // Oggetto con la chiave della data e il flag `future` (giorno successivo a oggi).
    // `d > today` confronta le due Date perché JavaScript le converte in numeri.
    return { key: dayKey(d), future: d > today };
  });
  return (
    // Griglia CSS: 7 righe (i giorni della settimana). `grid-flow-col` riempie le colonne
    // (settimane) una dopo l'altra dall'alto in basso. `gap-[3px]` = spazio tra le celle
    // (valore arbitrario Tailwind tra parentesi quadre).
    // role="img" + aria-label: l'intera griglia è letta come una singola immagine con descrizione,
    // perché le singole celle non hanno testo.
    <div className="grid grid-flow-col grid-rows-7 gap-[3px]" role="img" aria-label="Subchapters completed per day, last 24 weeks">
      {/* Una <i> per ogni cella. `key` identifica la cella (la data) per React. */}
      {cells.map(({ key, future }) => {
        // Numero di subchapter completati quel giorno; `?? 0` usa 0 se il giorno non c'è.
        const n = activity[key] ?? 0;
        return (
          // <i> è un elemento HTML neutro, qui usato come quadratino colorato.
          // key = identificatore della cella; title = tooltip con data e conteggio (undefined per
          // i giorni futuri, quindi nessun tooltip); className: `aspect-square` = quadrato,
          // `rounded-[2px]` = angoli arrotondati.
          // style: colore di sfondo. Trasparente per i giorni futuri. Per gli altri, `color-mix`
          // (CSS moderno) mescola il colore primario con il grigio di sfondo. Più attività = più
          // colore: `Math.min(n, 4) * 25` dà una percentuale da 0 a 100 (fermata a 4).
          <i
            key={key}
            title={future ? undefined : `${key}: ${n}`}
            className="aspect-square rounded-[2px]"
            style={{
              background: future
                ? "transparent"
                : `color-mix(in srgb, var(--primary) ${Math.min(n, 4) * 25}%, color-mix(in srgb, var(--foreground) 8%, transparent))`,
            }}
          />
        );
      })}
    </div>
  );
}
