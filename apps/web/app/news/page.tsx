"use client";

// FILE: app/news/page.tsx : la pagina /news, cioe' la "reading list" (articoli letti/salvati).
//
// Ruolo nel progetto:
// - Next.js App Router: ogni cartella dentro app/ con un file page.tsx diventa una URL.
//   Quindi app/news/page.tsx = http://localhost:3000/news. Il "export default" qui sotto e'
//   il componente che Next mostra per quella URL.
// - "use client" (in cima, prima degli import): dice a Next che il file gira nel BROWSER
//   (Client Component). Serve perche' usiamo stato (useState), click e hook. Senza, il file
//   sarebbe un Server Component e non potrebbe usare useState.
//   Guida Next nella repo: node_modules/next/dist/docs/01-app/01-getting-started/
//   (file 05-server-and-client-components.md)
// - Dati: lib/hooks.ts (SWR) legge /api/articles; lib/api.ts e' il fetch verso /api, che
//   app/api/[...path]/route.ts inoltra al backend FastAPI (apps/api/app/routes/articles.py).
// - Componenti condivisi: Chat (components/chat.tsx), StarButton (components/star-button.tsx),
//   e la UI shadcn/ui in components/ui/.
//
// Concetti chiave usati nel file:
// - Componente React: funzione che restituisce JSX (markup scritto dentro JavaScript).
//   Doc: https://react.dev/learn (cerca "Your first component")
// - Hook: funzioni che iniziano con "use" (useState, useRef, useArticles). Vanno chiamate
//   sempre in cima al componente, mai dentro if o cicli.
// - Stato: useState(valore) restituisce [valoreAttuale, funzioneCheLoCambia]. Cambiarlo
//   fa ri-disegnare il componente con il nuovo valore.
// - Import: "import { x } from" prende un export con nome; "import X from" prende il default.
// - "@/..." e' un alias (tsconfig.json: "@/*" punta alla radice di apps/web).
// - Tipi TypeScript (": string", "<T>", "type Article"): servono solo al controllo del codice,
//   spariscono nel JavaScript finale.

import { useRef, useState } from "react";
// Notifiche a comparsa (toast): toast.success(...) per il successo, toast.error(...) per l'errore.
import { toast } from "sonner";
// Icone SVG dalla libreria lucide-react: si usano come tag, es. <RefreshCwIcon />.
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  MessagesSquareIcon,
  RefreshCwIcon,
  WandSparklesIcon,
} from "lucide-react";
// Converte testo Markdown (**grassetto**, liste, ...) in elementi HTML: usato per i riassunti AI.
import ReactMarkdown from "react-markdown";
// Componenti shadcn/ui: copiati dentro il progetto (components/ui/), quindi modificabili.
// Button = bottone; Card = riquadro con bordo (con CardHeader/CardTitle/CardContent come parti).
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Tabs = schede cliccabili: ogni TabsContent mostra il contenuto della scheda selezionata.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Skeleton = segnaposto grigio animato mentre i dati stanno ancora arrivando.
import { Skeleton } from "@/components/ui/skeleton";
// Componenti del progetto (cartelle components/): la chat RAG e la stellina preferiti.
import { Chat } from "@/components/chat";
import { StarButton } from "@/components/star-button";
// api = funzione per chiamare il backend; "type Article" importa solo il TIPO di un articolo.
import { api, type Article } from "@/lib/api";
// Hook SWR e funzione di ricarica della cache degli articoli (vedi lib/hooks.ts).
import { refreshArticles, useArticles } from "@/lib/hooks";
// cn unisce classi CSS (Tailwind) anche condizionali: cn("a", cond && "b").
import { cn } from "@/lib/utils";

// "export default": la funzione principale del file, il componente della pagina. Nessuna prop
// (i dati arrivano dagli hook, non dal genitore). Next la monta automaticamente su /news.
export default function NewsPage() {
  // Stato "sta aggiornando?": false all'inizio. Lo usiamo per disattivare il bottone e
  // far girare l'icona. Il primo nome e' il valore, il secondo la funzione per cambiarlo.
  const [refreshing, setRefreshing] = useState(false);

  // "async" = funzione asincrona: dentro si puo' usare "await" per aspettare il server
  // senza bloccare la pagina. Definita dentro il componente per poter leggere setRefreshing.
  async function refresh() {
    // Accende lo spinner e disattiva il bottone.
    setRefreshing(true);
    // try/catch/finally: "try" prova le operazioni, "catch" gestisce un eventuale errore,
    // "finally" viene eseguito SEMPRE (anche in caso di errore).
    try {
      // POST /articles/refresh: chiede al backend di scaricare le nuove notizie. "await" attende
      // la risposta. "{ new: count }" estrae la proprieta' "new" e la chiama "count" (new e'
      // parola riservata in JS, quindi serve rinominarla). <{ new: number }> dice il tipo.
      const { new: count } = await api<{ new: number }>("/articles/refresh", { method: "POST" });
      // Ricarica la lista di articoli da mostrare a schermo.
      await refreshArticles();
      // Ternario "condizione ? sePiuDiZero : seZero": messaggio diverso se ci sono novita'.
      toast.success(count ? `${count} new articles` : "You're up to date");
    } catch (e) {
      // "e" e' l'errore lanciato da api(); "as Error" dice a TypeScript che e' un Error.
      toast.error((e as Error).message);
    } finally {
      // Spegne lo spinner, sia che sia andata bene sia che sia andata male.
      setRefreshing(false);
    }
  }

  // "return (...)": cio' che il componente disegna. Le parentesi permettono di andare a capo.
  // JSX: un unico elemento radice (qui il <div>) che contiene tutto il resto.
  return (
    <div className="space-y-6">
      {/* Intestazione: titolo + sottotitolo a sinistra, bottone "Refresh" a destra.
          Tailwind: flex = layout a riga, gap-3 = spazio tra figli,
          space-y-6 = spazio verticale. */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        {/* Gruppo titolo + sottotitolo. className (non "class") e' il nome della classe CSS in JSX.
            Le classi text-*, font-*, tracking-* sono utility di Tailwind (stile direttamente
            nel markup, senza file CSS separato). */}
        <div>
          {/* h1 = titolo principale della pagina (importante per l'accessibilita' e la SEO). */}
          <h1 className="text-3xl font-semibold tracking-tight">News & reading list</h1>
          <p className="text-muted-foreground">Fetched every morning from engineering, AI and DevOps sources.</p>
        </div>
        {/* Bottone: variant = aspetto (contorno); onClick = funzione da eseguire al click
            (refresh, senza parentesi: passiamo la funzione, non la chiamiamo subito);
            disabled = non cliccabile mentre sta aggiornando. */}
        <Button variant="outline" onClick={refresh} disabled={refreshing}>
          {/* Icona che ruota (animate-spin) solo mentre refreshing e' true. Operatore ternario
              dentro {...}. aria-hidden = icona decorativa, nascosta agli screen reader. */}
          <RefreshCwIcon className={refreshing ? "animate-spin" : ""} aria-hidden /> Refresh now
        </Button>
      </header>

      {/* Riquadro della chat RAG ("chiedi alla tua reading list"). */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {/* Icona + titolo del riquadro. */}
            <MessagesSquareIcon className="size-5 text-primary" aria-hidden /> Ask your reading list
          </CardTitle>
        </CardHeader>
        {/* h-80 = altezza fissa (20rem) per la chat. */}
        <CardContent className="h-80">
          {/* Chat e' un componente riutilizzabile: le "props" (attributi tra le virgolette) sono
              i suoi parametri. endpoint = URL del backend che risponde (/ai/ask, cioe' RAG);
              placeholder = testo di esempio nel campo;
              suggestions = domande pronte da cliccare. */}
          <Chat
            endpoint="/ai/ask"
            placeholder="What have I read about…?"
            suggestions={["What's new in AI agents this week?", "Summarise what I saved about Kubernetes."]}
          />
        </CardContent>
      </Card>

      {/* Schede: defaultValue="all" = la scheda "All articles" si apre per prima. Ogni
          TabsTrigger e' il bottone della scheda; il suo value collega il bottone al TabsContent
          con lo stesso value, che viene mostrato solo quando la scheda e' selezionata. */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All articles</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        {/* Qui "<AllArticles />" e' un altro componente di questo file (definito piu' sotto):
            un tag con la maiuscola = componente React. "favorites" senza valore = true. */}
        <TabsContent value="all">
          <AllArticles />
        </TabsContent>
        <TabsContent value="favorites">
          <ArticleGrid favorites />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Vista "All articles": raggruppa gli articoli per fonte (una riga orizzontale per fonte).
// Nessun "export": e' un componente privato di questo file, usato solo da NewsPage.
function AllArticles() {
  // useArticles(false) = carica TUTTI gli articoli (false = non solo i preferiti). Restituisce
  // data (la lista, o undefined mentre carica) ed error (l'errore, se c'e').
  const { data, error } = useArticles(false);
  // Fonte scelta nel filtro: null = nessun filtro ("All sources").
  const [source, setSource] = useState<string | null>(null);
  // Guardie "early return": se c'e' un errore, mostra il messaggio ed esci subito.
  if (error) return <p className="text-destructive">{error.message}</p>;
  // Finche' data e' undefined i dati stanno arrivando: mostra un segnaposto.
  if (!data) return <Skeleton className="h-64 rounded-xl" />;
  // Lista vuota: messaggio al posto degli articoli. "!data.length" = lunghezza 0.
  if (!data.length) return <p className="py-8 text-center text-muted-foreground">No articles yet. Try “Refresh now”.</p>;
  // data is newest first, so sources are ordered by their latest article
  // (italiano: data e' ordinato dal piu' recente, quindi le fonti seguono l'articolo piu' recente)
  // Map = dizionario chiave -> valore: fonte -> lista di articoli di quella fonte.
  const bySource = new Map<string, Article[]>();
  // Per ogni articolo lo aggiunge alla lista della sua fonte (spread "...": copia gli elementi).
  for (const a of data) bySource.set(a.source, [...(bySource.get(a.source) ?? []), a]);
  // Se c'e' un filtro, mostra solo quella fonte; altrimenti tutte
  // (le coppie [nome, lista] della Map).
  // "as const" = tupla di sola lettura, per dire a TypeScript che sono esattamente due elementi.
  const shown = source ? [[source, bySource.get(source) ?? []] as const] : [...bySource];
  return (
    <div className="space-y-6" data-testid="articles-grid">
      {/* Barra dei filtri per fonte. role="group" + aria-label = gruppo etichettato per gli
          screen reader. overflow-x-auto = scorrimento orizzontale su mobile; md:flex-wrap =
          su schermi medi (prefisso md:) va a capo. */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap" role="group" aria-label="Filter by source">
        {/* .map() trasforma ogni elemento di un array in un elemento JSX: qui un bottone per
            fonte. [null, ...bySource.keys()] = un bottone "All sources" (null)
            piu' i nomi delle fonti.
            "key" = identificatore unico richiesto da React quando si disegna una lista. */}
        {[null, ...bySource.keys()].map((s) => (
          <Button
            key={s ?? "all"}
            size="sm"
            // Il bottone della fonte attiva diventa "default" (pieno), gli altri "outline".
            variant={source === s ? "default" : "outline"}
            // aria-pressed = dice agli screen reader che il bottone e' "premuto" (attivo).
            aria-pressed={source === s}
            // Al click imposta la fonte scelta: la lista si aggiorna perche' cambia lo stato.
            onClick={() => setSource(s)}
          >
            {/* "??" = se s e' null/undefined mostra il testo a destra ("All sources"). */}
            {s ?? "All sources"}
          </Button>
        ))}
      </div>
      {/* Una riga (SourceRow) per ogni fonte da mostrare. */}
      {shown.map(([name, articles]) => (
        <SourceRow key={name} name={name} articles={articles} />
      ))}
    </div>
  );
}

// Una riga orizzontale scorrevole con gli articoli di UNA fonte.
// Props tipizzate: { name: string; articles: Article[] } = oggetto con due campi e i loro tipi.
function SourceRow({ name, articles }: { name: string; articles: Article[] }) {
  // useRef = "puntatore" all'elemento <ul> nel DOM (la lista orizzontale). Non causa re-render.
  // <HTMLUListElement> dice a TypeScript che e' una lista non ordinata;
  // vale null finche' il componente non e' montato a schermo.
  const ref = useRef<HTMLUListElement>(null);
  // Scorre la lista di 80% della sua larghezza visibile: dir = -1 sinistra, 1 destra.
  // "?." = optional chaining: se ref.current e' null non fa nulla (nessun errore).
  // behavior: "smooth" = scorrimento animato.
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    // section = sezione semantica; space-y-2 = spazio verticale tra i figli.
    <section className="space-y-2">
      {/* Titolo della fonte a sinistra, frecce a destra. */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{name}</h2>
        <div className="flex gap-1">
          {/* Freccia sinistra. Le arrow function "() => scroll(-1)" evitano di chiamare subito la
              funzione: viene eseguita solo al click.
              aria-label = nome accessibile (icona senza testo). */}
          <Button variant="ghost" size="icon" onClick={() => scroll(-1)} aria-label={`Scroll ${name} left`}>
            <ChevronLeftIcon aria-hidden />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll(1)} aria-label={`Scroll ${name} right`}>
            <ChevronRightIcon aria-hidden />
          </Button>
        </div>
      </div>
      {/* ref={ref} collega questo <ul> al puntatore sopra. snap-x/snap-mandatory = lo scorrimento
          "si aggancia" alle card. */}
      <ul ref={ref} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {/* Una card per articolo. w-72 = larghezza fissa; shrink-0 = non si restringe;
            snap-start = punto di aggancio dello scorrimento. */}
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} className="w-72 shrink-0 snap-start" />
        ))}
      </ul>
    </section>
  );
}

// Griglia semplice di articoli. Usata sia per "Favorites" sia, in generale, per una lista piatta.
// Prop "favorites": booleano (true/false) passato dal genitore come <ArticleGrid favorites />.
function ArticleGrid({ favorites }: { favorites: boolean }) {
  // Carica i preferiti (favorites = true) oppure tutti gli articoli (false).
  const { data, error } = useArticles(favorites);
  // Stessi controlli di AllArticles: errore, caricamento, lista vuota (in ordine).
  if (error) return <p className="text-destructive">{error.message}</p>;
  if (!data) return <Skeleton className="h-64 rounded-xl" />;
  // Lista vuota: messaggio diverso a seconda della scheda.
  // "if" senza parentesi graffe: una sola istruzione.
  if (!data.length)
    return (
      <p className="py-8 text-center text-muted-foreground">
        {/* Operatore ternario dentro il JSX: sceglie il testo in base a favorites. */}
        {favorites ? "No favorites yet — star articles to keep them forever." : "No articles yet. Try “Refresh now”."}
      </p>
    );
  return (
    // grid + md:grid-cols-2 = due colonne su schermi medi. data-testid = etichetta per i test E2E
    // (Playwright la usa per trovare l'elemento); non influisce sull'aspetto.
    <ul className="grid gap-3 md:grid-cols-2" data-testid={favorites ? "favorites-grid" : "articles-grid"}>
      {/* Una card per articolo. key = identificatore unico per React (l'id dell'articolo). */}
      {data.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </ul>
  );
}

// Una singola card-articolo. Props: "article" (rinominato in "a" qui dentro, con i due punti)
// e "className" opzionale (classi CSS extra decise dal genitore, es. la larghezza in SourceRow).
// Il punto e virgola ";" separa i tipi: { article: Article; className?: string }. "?" = opzionale.
function ArticleCard({ article: a, className }: { article: Article; className?: string }) {
  // Stato "sto generando il riassunto?": serve a mostrare uno spinner e disattivare il bottone.
  const [loading, setLoading] = useState(false);

  // Chiede al backend un riassunto AI dell'articolo (POST /articles/{id}/summary), poi ricarica.
  // Template literal: la stringa con backtick `...${a.id}...` inserisce il valore della variabile.
  async function summarize() {
    setLoading(true);
    try {
      await api(`/articles/${a.id}/summary`, { method: "POST" });
      // Ricarica la lista: il riassunto appena creato compare nella card.
      await refreshArticles();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      // Spegne lo spinner in ogni caso (successo o errore).
      setLoading(false);
    }
  }

  return (
    // li = elemento di una lista (la card sta dentro un <ul>). cn(...) unisce le classi fisse
    // con className se esiste. rounded-xl/border/bg-card/p-4 = angoli, bordo, colore, padding.
    // data-testid = etichetta per i test E2E.
    <li className={cn("flex flex-col gap-2 rounded-xl border bg-card p-4", className)} data-testid="article-card">
      {/* Riga con titolo (link) e stellina preferiti. */}
      <div className="flex items-start gap-2">
        {/* Link esterno: href = destinazione; target="_blank" = apri in una nuova scheda;
            rel="noreferrer" = per sicurezza non passa al sito esterno la pagina di provenienza. */}
        <a href={a.url} target="_blank" rel="noreferrer" className="flex-1 font-medium leading-snug hover:text-primary">
          {a.title}
        </a>
        {/* Componente condiviso: riceve l'articolo e gestisce il preferito da solo. */}
        <StarButton article={a} />
      </div>
      {/* Riga piccola con fonte e data. */}
      <p className="text-xs text-muted-foreground">
        {a.source}
        {/* "&&": se published_at esiste, mostra la data; se e' null non mostra nulla.
            toLocaleDateString() formatta la data secondo la lingua del browser. */}
        {a.published_at && ` · ${new Date(a.published_at).toLocaleDateString()}`}
      </p>
      {/* Se c'e' gia' un riassunto AI, lo mostra come Markdown; altrimenti mostra l'estratto e il
          bottone per generarlo. Il ternario "? ... : ..." sceglie uno dei due blocchi. */}
      {a.ai_summary ? (
        // [&_li]:ml-4 e [&_ul]:list-disc = stili (Tailwind arbitrary variant) applicati agli
        // elementi <li>/<ul> generati dal Markdown, che altrimenti non avrebbero i puntini.
        <div className="space-y-1 rounded-lg bg-accent/60 p-3 text-sm [&_li]:ml-4 [&_ul]:list-disc">
          {/* ReactMarkdown trasforma il testo Markdown del riassunto in HTML sicuro. */}
          <ReactMarkdown>{a.ai_summary}</ReactMarkdown>
        </div>
      ) : (
        // Frammento <>...</>: contenitore invisibile per piu' elementi senza un <div> in piu'.
        <>
          {/* "a.excerpt &&": mostra l'estratto solo se esiste. line-clamp-3 = massimo 3 righe. */}
          {a.excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>}
          {/* Bottone "Summarise with AI": onClick={summarize} esegue la funzione al click;
              disabled={loading} lo blocca durante la richiesta. */}
          <Button variant="ghost" size="sm" className="self-start" onClick={summarize} disabled={loading}>
            {/* Mentre carica mostra lo spinner, altrimenti l'icona della bacchetta magica. */}
            {loading ? <Loader2Icon className="animate-spin" aria-hidden /> : <WandSparklesIcon aria-hidden />}
            Summarise with AI
          </Button>
        </>
      )}
    </li>
  );
}
