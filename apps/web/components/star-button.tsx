"use client";

// ----------------------------------------------------------------------------------------------
// star-button.tsx: il bottone a "stella" che salva un articolo tra i preferiti o lo toglie.
// E' un componente riutilizzabile (cartella components/) usato in due posti:
//   - app/news/page.tsx: la pagina delle news, una stella per ogni articolo;
//   - components/app-sidebar.tsx: la barra laterale, accanto agli articoli.
// Riceve UN solo articolo. Non conosce le altre liste: capisce se l'articolo e' gia' un
// preferito guardando article.favorite_at (una data se e' preferito, null se non lo e').
//
// Flusso di un click:
//   toggle() -> api("/articles/{id}/favorite") -> app/api/[...path]/route.ts (proxy)
//   -> FastAPI, apps/api/app/routes/articles.py (PUT = aggiungi, DELETE = togli)
//   -> refreshArticles() (lib/hooks.ts) ricarica le liste con SWR -> la stella cambia aspetto.
//
// Concetti chiave (versioni dal package.json: Next.js 16.4.2, React 19.3.0):
// - "use client": in Next.js App Router ogni file e' per default un Server Component (gira
//   sul server). Questo bottone usa onClick, useState e toast, cose che esistono solo nel
//   browser, quindi serve la direttiva. Deve essere la prima istruzione del file.
//   Guida: apps/web/node_modules/next/dist/docs/01-app/01-getting-started/
//   05-server-and-client-components.md
// - useState (https://react.dev/reference/react/useState): memorizza un valore che, quando
//   cambia, fa ridisegnare il componente. Qui "pending" blocca il bottone durante la richiesta.
// - Tipi TypeScript: "{ article: Article; className?: string }" descrive le props. Il "?"
//   rende className opzionale. Article arriva da lib/api-types.ts (schema ArticleOut).
// - sonner: libreria per i toast (messaggi temporanei). Il Toaster e' montato in app/layout.tsx.
// - Accessibilita': aria-pressed e aria-label servono allo screen reader (lettore di schermo).
// ----------------------------------------------------------------------------------------------

// useState: hook di React che tiene lo stato locale del componente (qui: "pending").
import { useState } from "react";
// StarIcon: l'icona a stella, un componente SVG della libreria lucide-react.
import { StarIcon } from "lucide-react";
// toast: funzione di sonner per mostrare messaggi temporanei (successo o errore).
import { toast } from "sonner";
// api: funzione di lib/api.ts che chiama il backend. "type Article" importa solo il TIPO
// (serve al controllo TypeScript e sparisce quando il codice gira nel browser).
// @/ e' un alias di percorso (vedi tsconfig.json): punta alla radice di apps/web.
import { api, type Article } from "@/lib/api";
// refreshArticles: ricarica in cache (SWR) le liste di articoli, cosi' la UI si aggiorna.
import { refreshArticles } from "@/lib/hooks";
// cn: helper di lib/utils.ts che unisce piu' classi CSS, ignorando quelle false o vuote.
import { cn } from "@/lib/utils";

// export: rende StarButton importabile dagli altri file. "function" dichiara un componente React,
// cioe' una funzione che restituisce cosa mostrare (JSX). Le graffe { article, className } sono
// le props lette per nome (destructuring): article e' obbligatorio, className e' opzionale.
export function StarButton({ article, className }: { article: Article; className?: string }) {
  // useState(false): pending parte come false. useState restituisce una coppia [valore, setter]:
  // il valore si legge con "pending", si cambia solo con setPending (mai assegnandolo a mano).
  const [pending, setPending] = useState(false);
  // Boolean(...) trasforma la data (o null) in true/false. Il valore non e' salvato da nessuna
  // parte: viene ricalcolato a ogni render a partire da article.favorite_at.
  const starred = Boolean(article.favorite_at);

  // Funzione chiamata al click. "async" permette di usare "await": aspetta le operazioni di rete
  // senza bloccare la pagina. E' definita dentro il componente per leggere article e starred.
  async function toggle() {
    // Blocca il bottone (vedi disabled piu' sotto) per evitare doppi click durante la richiesta.
    setPending(true);
    // try: prova le righe seguenti. Se una lancia un errore, l'esecuzione salta al catch.
    try {
      // Stesso URL per aggiungere e togliere; cambia solo il metodo HTTP. Il ternario "? :"
      // sceglie: DELETE se gia' preferito (togli), PUT altrimenti (aggiungi).
      // await: attende la risposta del server prima di passare alla riga successiva.
      await api(`/articles/${article.id}/favorite`, { method: starred ? "DELETE" : "PUT" });
      // Ricarica le liste di articoli, cosi' la stella (e le altre viste) mostra il nuovo stato.
      await refreshArticles();
      // !starred: prima del click non era preferito, quindi ora lo e' appena diventato.
      // Il toast di conferma compare solo quando si salva, non quando si toglie.
      if (!starred) toast.success("Saved to favorites — the full article is being indexed for RAG.");
    // catch (e): se una riga del try fallisce, arriva qui; "e" contiene l'errore.
    // "as Error" dice a TypeScript che e' un oggetto Error, cosi' possiamo leggere .message.
    } catch (e) {
      // Mostra all'utente il messaggio d'errore, invece di fallire in silenzio.
      toast.error((e as Error).message);
    // finally: viene eseguito SEMPRE, con successo o con errore. Qui sblocca il bottone.
    } finally {
      setPending(false);
    }
  }

  // return: restituisce il JSX, cioe' la "descrizione" di cosa disegnare sullo schermo.
  // Le parentesi tonde permettono di andare a capo su piu' righe.
  return (
    // Il bottone. Gli attributi (le "props" del tag HTML) sono spiegati qui sotto, riga per riga.
    // Commenti dentro la lista degli attributi non sono ammessi in JSX, quindi li mettiamo qui.
    // type="button": il default HTML sarebbe "submit", che invierebbe un form per errore.
    // onClick={toggle}: al click viene chiamata toggle (passiamo la funzione, senza parentesi).
    // disabled={pending}: mentre la richiesta e' in corso il bottone non risponde ai click.
    // aria-pressed={starred}: comunica allo screen reader se il bottone e' "attivo" (preferito).
    // aria-label: il testo letto dallo screen reader; ${article.title} inserisce il titolo.
    // className={cn(...)}: classi Tailwind (utility CSS scritte nel nome). shrink-0 = non si
    // restringe; rounded e p-1 = angoli e spazio interno; hover: e focus-visible: = stili su
    // passaggio del mouse e navigazione da tastiera; text-streak = colore del tema (globals.css).
    // "starred && ..." aggiunge il colore pieno solo se e' preferito. className in fondo permette
    // a chi usa il componente di aggiungere classi proprie.
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={starred}
      aria-label={starred ? `Remove "${article.title}" from favorites` : `Save "${article.title}" to favorites`}
      className={cn(
        "shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-streak focus-visible:outline-2",
        starred && "text-streak",
        className,
      )}
    >
      {/* StarIcon: l'icona. size-4 = 1rem di lato; fill-current riempie la stella se preferito. */}
      {/* aria-hidden: l'icona e' solo decorativa, lo screen reader la ignora (c'e' aria-label). */}
      <StarIcon className={cn("size-4", starred && "fill-current")} aria-hidden />
    </button>
  );
}
