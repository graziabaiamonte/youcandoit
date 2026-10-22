"use client";

// ============================================================================
// app-sidebar.tsx: la barra laterale dell'app, presente su tutte le pagine principali.
// Contiene: menu di navigazione, mappa del roadmap (tracce > moduli > sessioni),
// notizie del giorno e preferiti. Non possiede dati propri: li legge con hook SWR.
//
// Chi la usa: app/layout.tsx la monta una sola volta, dentro <SidebarProvider>
// (che condivide con i figli lo stato aperto/chiuso della sidebar).
// Cosa usa: Link e usePathname da Next.js, componenti shadcn in components/ui/sidebar.tsx,
// hook useRoadmap/useArticles in lib/hooks.ts, helper in lib/api.ts.
//
// "use client" (riga sopra): dice a Next.js che questo file gira nel browser, non sul server.
// Serve perché usiamo hook (usePathname, useSWR) e interattività (click, espandi/chiudi).
// Versioni rilevate: Next.js 16.4.2, React 19.3.0 (apps/web/package.json e node_modules).
// Doc: https://nextjs.org/docs/app/getting-started/server-and-client-components
//
// Concetti chiave per chi inizia:
// - Componente React: funzione con nome maiuscolo che restituisce JSX (sintassi simile
//   all'HTML scritta dentro il JavaScript). Doc: https://react.dev/learn/your-first-component
// - Props: "parametri" passati ai componenti come attributi, es. <Icona label="x" />.
// - Hook: funzioni che iniziano con "use" (useState, useSWR...). Si chiamano sempre in cima
//   a un componente, mai dentro if o cicli. Doc: https://react.dev/reference/react/hooks
// - Tailwind CSS: le classi nel className (es. "flex gap-2") definiscono lo stile.
// - Commenti dentro il JSX (tra i tag) vanno scritti come {/* ... */}.
// ============================================================================

// Link di Next.js: come <a>, ma cambia pagina senza ricaricare tutto il sito e precarica il link.
import Link from "next/link";
// usePathname: hook che restituisce il percorso corrente, es. "/map" o "/session/1.2.1".
// Funziona solo nei Client Component (per questo il file inizia con "use client").
import { usePathname } from "next/navigation";
// Suspense (React): mostra il "fallback" (qui uno scheletro grigio) finché i figli caricano.
import { Suspense } from "react";
// lucide-react: libreria di icone. Ogni icona è un componente: si usa come <RocketIcon />.
import {
  ChevronRightIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  LayoutDashboardIcon,
  MapIcon,
  NewspaperIcon,
  RocketIcon,
} from "lucide-react";
// Componenti della sidebar shadcn/ui (copiati in components/ui/sidebar.tsx, non in node_modules):
// sono mattoncini da combinare, come un kit. Il codice sorgente è nostro da modificare.
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
// Collapsible: blocco che si apre e chiude al click (usato per le tracce del roadmap).
// L'alias "@/" è una scorciatoia per la cartella apps/web, definita in tsconfig.json.
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// Componente nostro con le statistiche sintetiche (XP, livello, ecc.) in cima alla sidebar.
import { StatsMini } from "@/components/stats-mini";
// Bottone a stella: aggiunge o toglie un articolo dai preferiti.
import { StarButton } from "@/components/star-button";
// Helper di lib/api.ts: calcolano avanzamenti e colori. "type SessionNode" è un import di solo
// tipo: serve al controllo TypeScript e sparisce quando il codice gira nel browser.
import { sessionProgress, trackPercent, trackStyle, type SessionNode } from "@/lib/api";
// Hook SWR di lib/hooks.ts: scaricano dati dall'API, li tengono in cache e restituiscono
// { data, error }. Finché data è undefined, stiamo ancora caricando.
import { useArticles, useRoadmap } from "@/lib/hooks";

// NAV: lista costante delle voci di menu principali. Ogni voce ha href (dove porta),
// label (testo visibile) e icon (componente icona, rinominato Icon più sotto).
const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/map", label: "Learning map", icon: MapIcon },
  { href: "/news", label: "News & reading list", icon: NewspaperIcon },
];

// export: rende la funzione importabile da altri file (qui, dal layout).
// function AppSidebar: componente React senza props; restituisce la sidebar completa.
// Il nome è in PascalCase (maiuscola iniziale): convenzione per riconoscere i componenti.
export function AppSidebar() {
  return (
    // Sidebar: contenitore principale. collapsible="icon" = quando si chiude, resta una
    // striscia di sole icone invece di sparire del tutto.
    <Sidebar collapsible="icon">
      {/* SidebarHeader: intestazione in alto. gap-3 = spazio tra i figli, p-3 = padding */}
      <SidebarHeader className="gap-3 p-3">
        {/* Logo + nome dell'app: cliccandolo si torna alla Dashboard (href="/") */}
        <Link href="/" className="flex items-center gap-2 px-1 font-semibold tracking-tight">
          {/* Cerchio colorato con l'icona razzo; grid + place-items-center la centra */}
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
            {/* aria-hidden: icona decorativa, nascosta agli screen reader (il nome c'è già) */}
            <RocketIcon className="size-4" aria-hidden />
          </span>
          {/* group-data-[...]: classe Tailwind attiva se il genitore ha
              data-collapsible=icon; qui nasconde il testo quando la sidebar è solo icone */}
          <span className="group-data-[collapsible=icon]:hidden">YouCanDoIt</span>
        </Link>
        {/* Statistiche: nascoste quando la sidebar è ridotta a icone (stessa logica sopra) */}
        <div className="group-data-[collapsible=icon]:hidden"><StatsMini /></div>
      </SidebarHeader>
      {/* SidebarContent: corpo scorrevole con tutti i gruppi di menu */}
      <SidebarContent>
        {/* Suspense: finché MainNav/RoadmapNav non sono pronti mostra NavSkeleton */}
        <Suspense fallback={<NavSkeleton />}>
          {/* Menu principale (Dashboard, Mappa, Notizie) e mappa del roadmap */}
          <MainNav />
          <RoadmapNav />
        </Suspense>
        {/* Gruppi che compaiono sotto il roadmap: notizie del giorno e preferiti */}
        <DailyNews />
        <Favorites />
      </SidebarContent>
    </Sidebar>
  );
}

// NavSkeleton: segnaposto grigio mostrato durante il caricamento. Array.from({ length: 8 })
// crea un array di 8 elementi vuoti; il "_" è il valore (ignorato) e "i" l'indice 0..7.
// key={i}: React usa la key per riconoscere gli elementi di una lista quando cambiano.
function NavSkeleton() {
  return (
    <SidebarGroup>
      {Array.from({ length: 8 }, (_, i) => (
        <SidebarMenuSkeleton key={i} showIcon />
      ))}
    </SidebarGroup>
  );
}

// MainNav: il menu delle voci fisse in NAV. Ogni voce è un Link,
// evidenziato se è la pagina attuale.
function MainNav() {
  // Hook: legge il percorso corrente per sapere quale voce evidenziare.
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {/* map: trasforma ogni voce di NAV in un elemento JSX. Destrutturazione: prendiamo
            solo href, label e icon dall'oggetto. "icon: Icon" rinomina icon in Icon
            (la maiuscola fa capire a React che è un componente) */}
        {NAV.map(({ href, label, icon: Icon }) => (
          // key: identificatore unico per ogni elemento della lista, richiesto da React
          <SidebarMenuItem key={href}>
            {/* asChild: non crea un <button> extra, ma passa lo stile al figlio (il Link).
                isActive: evidenzia la voce se siamo già su quella pagina.
                tooltip: testo di aiuto che appare al passaggio del mouse quando è solo icona */}
            <SidebarMenuButton asChild isActive={pathname === href} tooltip={label} className="rounded-full">
              {/* Link verso la pagina; dentro: icona decorativa e testo della voce */}
              <Link href={href}>
                {/* Icona decorativa, nascosta agli screen reader */}
                <Icon aria-hidden />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// StatusIcon: sceglie l'icona di stato di una sessione in base alle sottocapitoli completate.
// Il tipo { session: SessionNode } dopo i due punti è l'annotazione TypeScript della prop.
function StatusIcon({ session }: { session: SessionNode }) {
  // Calcola quante sottocapitoli sono fatte (done) su quante sono in totale (total).
  const { done, total } = sessionProgress(session);
  // Tutte completate: spunta verde. "text-success!" con ! = Tailwind "important".
  if (done === total) return <CircleCheckIcon className="text-success!" aria-label="Completed" />;
  // Alcune completate: cerchio tratteggiato (in corso). aria-label = testo per screen reader.
  if (done > 0) return <CircleDashedIcon className="text-track!" aria-label="In progress" />;
  // Nessuna completata: cerchio vuoto (non iniziata).
  return <CircleIcon className="text-muted-foreground!" aria-label="Not started" />;
}

// RoadmapNav: mappa del percorso di studio. Tracce (espandibili) > moduli > sessioni.
function RoadmapNav() {
  // Percorso corrente, es. "/session/1.2.1".
  const pathname = usePathname();
  // useRoadmap: { data: tracks, error }. "data: tracks" rinomina data in tracks.
  const { data: tracks, error } = useRoadmap();
  // Se siamo su una sessione, estrae il suo id: "/session/1.2.1".split("/")
  // dà ["", "session", "1.2.1"], quindi [2] è l'id. Altrimenti null (nessuna sessione aperta).
  const activeId = pathname.startsWith("/session/") ? pathname.split("/")[2] : null;

  return (
    // SidebarGroup: un blocco di menu con eventuale titolo
    <SidebarGroup>
      {/* Titolo "Roadmap" del gruppo */}
      <SidebarGroupLabel>Roadmap</SidebarGroupLabel>
      {/* Contenuto del gruppo */}
      <SidebarGroupContent>
        {/* Operatore && : mostra il messaggio solo se error esiste (condizione corta) */}
        {error && <p className="px-2 text-xs text-destructive">Could not load the roadmap.</p>}
        {/* Mentre tracks non è ancora arrivato e non c'è errore, mostra lo scheletro */}
        {!tracks && !error && <NavSkeleton />}
        {/* Lista di menu; aria-label dà un nome leggibile agli screen reader */}
        <SidebarMenu aria-label="Roadmap">
          {/* tracks?.map: "?." = optional chaining, se tracks è undefined non fa nulla.
              Per ogni traccia creiamo un blocco espandibile. */}
          {tracks?.map((track) => (
            // Collapsible: asChild fa fondere le sue props con SidebarMenuItem (niente div extra).
            // defaultOpen: la traccia parte aperta se la sessione attiva appartiene a lei
            // (gli id delle sessioni iniziano con "<id traccia>.", es. "1.").
            // className "group/track": nome di gruppo Tailwind, usato dalla freccia sotto.
            <Collapsible
              key={track.id}
              asChild
              defaultOpen={activeId?.startsWith(`${track.id}.`)}
              className="group/track"
            >
              {/* style: imposta la variabile CSS --track con il colore della traccia */}
              <SidebarMenuItem style={trackStyle(track.id)}>
                {/* CollapsibleTrigger: l'elemento che, cliccato, apre/chiude la traccia */}
                <CollapsibleTrigger asChild>
                  {/* h-auto py-1.5: altezza automatica e un po' di padding verticale.
                      tooltip: testo di aiuto quando la sidebar è ridotta a icone */}
                  <SidebarMenuButton className="h-auto py-1.5" tooltip={`${track.id}. ${track.title}`}>
                    {/* Pallino colorato con il colore della traccia (bg-track); decorativo */}
                    <span className="size-2.5 shrink-0 rounded-full bg-track" aria-hidden />
                    {/* Numero e titolo della traccia; truncate = "..." se è troppo lungo */}
                    <span className="flex-1 truncate">
                      {/* Il numero della traccia è in grigio */}
                      <span className="text-muted-foreground">{track.id}.</span> {track.title}
                    </span>
                    {/* Percentuale completata; tabular-nums = cifre di uguale larghezza */}
                    <span className="text-xs text-muted-foreground tabular-nums">{trackPercent(track)}%</span>
                    {/* Freccia che ruota di 90 gradi quando la traccia è aperta */}
                    <ChevronRightIcon
                      className="transition-transform group-data-[state=open]/track:rotate-90"
                      aria-hidden
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {/* CollapsibleContent: il contenuto che appare quando la traccia è aperta */}
                <CollapsibleContent>
                  {/* Per ogni modulo: titolo e lista delle sue sessioni */}
                  {track.modules.map((module) => (
                    // div con key: contenitore di un modulo (la key serve a React nelle liste)
                    <div key={module.id} className="mt-1">
                      {/* Titolo del modulo in maiuscolo piccolo; uppercase = solo CSS */}
                      <p className="truncate px-6 pt-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                        {module.title}
                      </p>
                      {/* Sottomenu: rientrato rispetto al menu della traccia */}
                      <SidebarMenuSub>
                        {/* Una voce per ogni sessione del modulo */}
                        {module.sessions.map((session) => (
                          // Elemento della lista; key = id univoco della sessione
                          <SidebarMenuSubItem key={session.id}>
                            {/* isActive: evidenzia la sessione aperta ora (confronto dell'id) */}
                            <SidebarMenuSubButton asChild size="sm" isActive={session.id === activeId}>
                              {/* Link alla sessione; i backtick con ${} = template literal */}
                              <Link href={`/session/${session.id}`}>
                                {/* Icona di stato: completata, in corso o non iniziata */}
                                <StatusIcon session={session} />
                                <span>{session.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </div>
                  ))}
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ArticleList: elenco di articoli. Props: favorites (solo preferiti?), limit (quanti mostrarne),
// empty (messaggio se la lista è vuota). Il tipo dopo i due punti descrive ogni prop.
function ArticleList({ favorites, limit, empty }: { favorites: boolean; limit: number; empty: string }) {
  // useArticles: scarica gli articoli, o solo i preferiti se favorites è true.
  const { data } = useArticles(favorites);
  // return anticipato: finché non ci sono dati, mostra lo scheletro e si ferma qui.
  if (!data) return <SidebarMenuSkeleton />;
  // Lista vuota (.length === 0): messaggio di invito. "!" = "non" (vale anche per array vuoti).
  if (!data.length) return <p className="px-2 text-xs text-muted-foreground">{empty}</p>;
  return (
    // Lista puntata HTML (<ul>) di articoli
    <ul className="space-y-1">
      {/* slice(0, limit): prende solo i primi "limit" elementi */}
      {data.slice(0, limit).map((a) => (
        // Riga di un articolo; hover:bg-... cambia sfondo al passaggio del mouse
        <li key={a.id} className="flex items-start gap-1 rounded-md px-2 py-1 hover:bg-sidebar-accent">
          {/* Link esterno: target="_blank" apre in una nuova scheda; noreferrer non invia
              informazioni sulla pagina di provenienza al sito esterno */}
          <a href={a.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 text-xs leading-snug">
            {/* Titolo dell'articolo, massimo 2 righe (line-clamp-2) */}
            <span className="line-clamp-2">{a.title}</span>
            {/* Nome della fonte (es. testata giornalistica) in piccolo */}
            <span className="text-[11px] text-muted-foreground">{a.source}</span>
          </a>
          {/* Stella per aggiungere o togliere l'articolo dai preferiti */}
          <StarButton article={a} />
        </li>
      ))}
    </ul>
  );
}

// DailyNews: gruppo "Daily news" con le ultime 6 notizie (non solo preferiti).
// Il componente non riceve props perché i valori sono fissi qui sotto.
function DailyNews() {
  return (
    // data-testid: etichetta usata dai test automatici (Playwright) per trovare questo blocco
    // group-data-...:hidden: nasconde il gruppo quando la sidebar è ridotta a icone
    <SidebarGroup data-testid="daily-news" className="group-data-[collapsible=icon]:hidden">
      {/* asChild: l'etichetta diventa un Link cliccabile verso la pagina notizie */}
      <SidebarGroupLabel asChild>
        <Link href="/news">Daily news</Link>
      </SidebarGroupLabel>
      {/* Contenitore del contenuto del gruppo */}
      <SidebarGroupContent>
        {/* favorites={false}: articoli normali; limit={6}: massimo 6; empty: messaggio vuoto */}
        <ArticleList favorites={false} limit={6} empty="News arrives every morning at 07:00." />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// Favorites: gruppo con gli articoli salvati con la stella (fino a 20).
function Favorites() {
  return (
    // data-testid="favorites": usato dai test e2e (vedi apps/web/e2e/news.spec.ts)
    <SidebarGroup data-testid="favorites" className="group-data-[collapsible=icon]:hidden">
      {/* Titolo del gruppo */}
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      {/* Contenitore del contenuto del gruppo */}
      <SidebarGroupContent>
        {/* "favorites" senza valore = favorites={true} (scorciatoia JSX per i booleani) */}
        <ArticleList favorites limit={20} empty="Star an article to keep it here." />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
