"use client";

/*
 * COSA FA QUESTO FILE: trasforma il testo Markdown di una lezione in pagina HTML, con box colorati
 * ("callout") e diagrammi Mermaid. Esporta un solo componente: <Lesson markdown="..." />.
 *
 * DOVE SI USA: components/session-view.tsx (righe 114 e 173) lo richiama passandogli il testo
 * `s.lesson` ricevuto dall'API FastAPI (campo SessionDetail.lesson, apps/api). Il testo viene da
 * content/lessons/<traccia>/<modulo>/<sessione>.md, letto dal backend e indicizzato in RAG.
 * Il formato delle lezioni (titoli, callout, Mermaid) e' descritto in content/lessons/README.md.
 *
 * "use client" (prima riga): direttiva di Next.js (App Router). Indica che questo file gira nel
 * browser (Client Component), non solo sul server. Deve stare in cima, prima di import e codice.
 * Docs: https://nextjs.org/docs/app/api-reference/directives/use-client (Next 16.4.2).
 *
 * CONCETTI CHIAVE:
 * - Markdown: testo semplice con simboli: # titolo, **grassetto**, - elenco, > citazione,
 *   ``` blocco di codice. Un convertitore lo trasforma in HTML.
 * - react-markdown (v10): converte il Markdown in elementi React (JSX), senza usare innerHTML.
 *   Non interpreta l'HTML grezzo scritto nel Markdown (servirebbe il plugin rehype-raw).
 *   Docs: https://github.com/remarkjs/react-markdown
 * - remark / rehype: "plugin" che modificano l'albero del testo. remark lavora sul Markdown
 *   (mdast), rehype sull'HTML (hast). remark-gfm (v4) aggiunge tabelle, barrato, liste di task.
 * - hast (Element, Root): tipi TypeScript dell'albero HTML. Sono solo per il compilatore: `import
 *   type` sparisce dal JavaScript finale. Il pacchetto @types/hast e' una dipendenza indiretta.
 * - components: mappa "tag HTML -> componente React" che sostituisce il rendering di un tag.
 * - Tailwind CSS (v4): classi di utilita' scritte nel JSX (es. "flex gap-3"). La classe `prose`
 *   viene dal plugin @tailwindcss/typography (dichiarato in app/globals.css) e stila il testo.
 * - lucide-react: libreria di icone SVG; ogni icona e' un componente React.
 */

import type { Element, Root } from "hast";
// ReactMarkdown: il componente che fa il rendering; Components: tipo per la mappa "components"
import ReactMarkdown, { type Components } from "react-markdown";
// plugin GFM (GitHub Flavored Markdown): tabelle, testo barrato, liste di task
import remarkGfm from "remark-gfm";
// icone Lucide, importate una per una (il bundle include solo quelle usate)
import { FlaskConicalIcon, InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react";
// Card e CardContent: contenitori shadcn/ui (components/ui/card.tsx) usati per i callout
import { Card, CardContent } from "@/components/ui/card";
// componente che disegna un diagramma Mermaid a partire dal codice sorgente
import { Mermaid } from "@/components/mermaid";
// cn: unisce piu' classi Tailwind, eliminando i conflitti (lib/utils.ts)
import { cn } from "@/lib/utils";

// Mappa dei 4 tipi di callout. "@/..." e' un alias: punta alla cartella apps/web (vedi tsconfig).
const CALLOUTS = {
  // each type differs by background tint and icon; the icon sits in a stronger tint of the same colour
  // ogni voce: label = titolo; Icon = icona; className = sfondo;
  // chip = cerchio dell'icona;
  // accent = colore del testo. Le classi (bg-primary/12, ecc.) sono token colore del tema.
  note: { label: "Note", Icon: InfoIcon, className: "bg-primary/12", chip: "bg-primary/24", accent: "text-primary" },
  tip: { label: "Tip", Icon: LightbulbIcon, className: "bg-success/12", chip: "bg-success/24", accent: "text-success" },
  warning: { label: "Warning", Icon: TriangleAlertIcon, className: "bg-destructive/12", chip: "bg-destructive/24", accent: "text-destructive" },
  example: { label: "Example", Icon: FlaskConicalIcon, className: "bg-track/12", chip: "bg-track/24", accent: "text-track" },
};
// regex (espressione regolare): riconosce il marcatore "[!NOTE]", "[!TIP]", ecc.
// in cima alla citazione.
// ^ = inizio testo; \[ e \] = parentesi letterali (vanno escapate); (A|B) = una delle parole;
// \s* = zero o piu' spazi dopo il marcatore; "/.../" e' la sintassi delle regex in JavaScript.
const MARKER = /^\[!(NOTE|TIP|WARNING|EXAMPLE)\]\s*/;

/** Rehype plugin: a blockquote starting with `[!NOTE]` etc. loses the marker and gets `dataCallout`. */
// Un "plugin rehype" e' una funzione che riceve l'albero HTML e lo modifica prima del rendering.
function rehypeCallouts() {
  // walk: funzione ricorsiva (richiama se stessa) che scende in tutto l'albero dei nodi
  const walk = (node: Root | Element) => {
    // per ogni nodo figlio, controlla se e' una citazione da trasformare
    for (const child of node.children) {
      // salta i nodi di testo puri (es. gli a-capo): ci interessano solo gli elementi HTML
      if (child.type !== "element") continue;
      // una citazione Markdown ("> testo") diventa un tag <blockquote>
      if (child.tagName === "blockquote") {
        // il primo figlio di tipo elemento della citazione (di solito il <p> con il testo)
        const p = child.children.find((c) => c.type === "element");
        // "?." (optional chaining): se p non esiste non va in errore, ma vale undefined
        const text = p?.type === "element" ? p.children[0] : undefined;
        // exec: restituisce l'array del match (m[0] = marcatore, m[1] = parola) oppure null
        const m = text?.type === "text" ? MARKER.exec(text.value) : null;
        // il controllo ripetuto su text serve a TypeScript, per sapere che text.value esiste
        if (m && text?.type === "text") {
          // taglia il marcatore dal testo: slice(lunghezza) tiene solo quello che resta
          text.value = text.value.slice(m[0].length);
          // salva il tipo in minuscolo in dataCallout: in HTML diventa l'attributo data-callout
          child.properties.dataCallout = m[1].toLowerCase();
        }
      }
      // scende nei figli di questo nodo, cosi' le citazioni annidate vengono trattate
      walk(child);
    }
  };
  // il plugin restituisce la funzione di trasformazione: unified la chiama sull'albero
  return walk;
}

// components: sostituisce il rendering di alcuni tag HTML con componenti React personalizzati
const components: Components = {
  // sostituisce il tag <pre> (blocco di codice). Il primo argomento e' "destrutturato":
  // node = nodo HAST originale, children = contenuto, ...props = tutti gli altri attributi
  pre({ node, children, ...props }) {
    // un blocco ```lang diventa <pre><code>: prendiamo il <code> che sta dentro
    const code = node?.children[0];
    if (code?.type === "element" && code.tagName === "code") {
      // le classi CSS del <code>, es. ["language-mermaid"] (un array in HAST)
      const cls = code.properties.className;
      // primo elemento della lista di classi, convertito in stringa, es. "language-mermaid"
      const lang = Array.isArray(cls) ? String(cls[0]) : "";
      // il testo interno del codice (il sorgente del diagramma, se e' Mermaid)
      const text = code.children[0]?.type === "text" ? code.children[0].value : "";
      // se il linguaggio dichiarato e' "mermaid", disegniamo un diagramma invece del codice
      if (lang === "language-mermaid")
        return (
          // "not-prose" disattiva gli stili del plugin typography, cosi' il diagramma non viene
          // modificato. "my-6" = margine verticale. "label" = testo per lo screen reader.
          <div className="not-prose my-6">
            <Mermaid chart={text} label="Lesson diagram" />
          </div>
        );
    }
    // caso normale: un blocco di codice qualsiasi resta un <pre>. {...props} inoltra gli attributi.
    return <pre {...props}>{children}</pre>;
  },
  // wide tables scroll inside their own box instead of the page on phones
  table({ children }) {
    return (
      // il div con overflow-x-auto crea una scrollbar orizzontale: la tabella scorre dentro il box
      <div className="overflow-x-auto">
        {/* JSX: dentro i tag i commenti si scrivono cosi', tra graffe; "//" verrebbe stampato */}
        <table>{children}</table>
      </div>
    );
  },
  // sostituisce <blockquote> (citazione). Se e' un callout (dataCallout impostato dal plugin sopra)
  // lo mostra come box colorato, altrimenti come citazione normale.
  blockquote({ node, children, ...props }) {
    // legge il tipo di callout e cerca la configurazione in CALLOUTS. "as keyof typeof CALLOUTS"
    // dice a TypeScript che la stringa e' una chiave di CALLOUTS (note, tip, ...).
    const c = CALLOUTS[node?.properties.dataCallout as keyof typeof CALLOUTS];
    // nessun callout riconosciuto: rendering normale della citazione
    if (!c) return <blockquote {...props}>{children}</blockquote>;
    // Card (shadcn): contenitore con sfondo e bordi. cn() unisce "my-6" e il colore di sfondo.
    return (
      <Card className={cn("my-6", c.className)}>
        {/* CardContent: area interna della card. flex gap-3 = icona e testo affiancati */}
        <CardContent className="flex gap-3">
          {/* cerchio con l'icona. aria-hidden: l'icona e' decorativa, lo screen reader la salta */}
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", c.chip, c.accent)} aria-hidden>
            {/* c.Icon e' un componente (es. InfoIcon) scelto dinamicamente:
                va scritto con la maiuscola, altrimenti React lo tratta come tag HTML */}
            <c.Icon className="size-5" />
          </span>
          {/* colonna del testo. min-w-0 permette al testo di restringersi; le classi [&>...] sono
              varianti di Tailwind: l'ultimo figlio perde il margine in basso,
              il 2o figlio (primo paragrafo del testo) ha margine in alto */}
          <div className="min-w-0 [&>:last-child]:mb-0 [&>p:nth-child(2)]:mt-1">
            {/* titolo del callout, es. "Note", "Warning" */}
            <p className={cn("not-prose text-sm font-semibold", c.accent)}>{c.label}</p>
            {/* children = il resto della citazione (il marcatore [!NOTE] e' gia' stato tolto) */}
            {children}
          </div>
        </CardContent>
      </Card>
    );
  },
};

// "export function": la funzione e' esportata, quindi importabile da altri file
// { markdown }: il props destrutturato; ": { markdown: string }" e' il tipo (stringa).
/** A session's lesson: Markdown with GFM, colour-coded callouts and Mermaid diagrams. */
export function Lesson({ markdown }: { markdown: string }) {
  // un componente React ritorna JSX (sintassi simile all'HTML, ma dentro JavaScript)
  return (
    // "prose" (plugin typography): stili tipografici per testi lunghi (titoli, liste, paragrafi).
    // max-w-none: niente limite di larghezza; wrap-break-word: spezza le parole troppo lunghe;
    // dark:prose-invert: in tema scuro inverte i colori del testo.
    <div className="prose max-w-none wrap-break-word dark:prose-invert">
      {/* ReactMarkdown prende il testo Markdown come children e lo trasforma in elementi React.
          remarkPlugins/rehypePlugins: le estensioni applicate; components: i tag personalizzati */}
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeCallouts]} components={components}>
        {/* {markdown}: il testo passato dal genitore, inserito come contenuto tra i tag */}
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
