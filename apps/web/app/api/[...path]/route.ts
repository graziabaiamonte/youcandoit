// Forwards /api/* to the FastAPI backend. Read at request time, so API_URL can
// change per environment without rebuilding, and slow LLM calls aren't cut off.
//
// --- COS'È QUESTO FILE (per chi inizia) ---
// Questo file è una "Route Handler" di Next.js (App Router, cartella app/): Next lo usa come
// endpoint HTTP lato server. Il nome `route.ts` lo rende un'API e non una pagina.
// Il nome della cartella `[...path]` è un "catch-all": intercetta TUTTO ciò che inizia con
// /api/, anche su più livelli (/api/progress, /api/articles/3/favorite, ecc.), e mette i pezzi
// dell'URL in un array di stringhe (`path`), es. ["articles", "3", "favorite"].
//
// Perché serve: il browser non parla direttamente con FastAPI (la porta 8000), ma chiama
// /api/... sullo stesso sito Next (porta 3000). Questo file fa da "postino": riceve la
// richiesta, la inoltra al backend Python e restituisce la risposta al browser. Così il
// browser non conosce l'indirizzo dell'API e non serve configurare CORS.
//
// Chi lo usa: lib/api.ts fa `fetch(`/api${path}`)` dal browser; qui arriva tutto. Per i
// componenti/hook vedi lib/hooks.ts e components/*. Il backend è in apps/api (docker-compose).
//
// Next.js 16 (versione installata 16.4.2, docs in node_modules/next/dist/docs/01-app/):
// - Route Handler: https://nextjs.org/docs/app/api-reference/file-conventions/route
// - RouteContext<'/route'>: tipo globale generato da Next per tipizzare `params` della route.
// - Dal v15 `params` è una Promise: va sempre `await`-ata.
// - Le route non sono cachate di default; qui l'uso di `cache: "no-store"` (sotto) impedisce
//   che il fetch verso FastAPI riusi risposte vecchie.
//
// Nota sulla variabile d'ambiente: `process.env.API_URL` NON ha il prefisso NEXT_PUBLIC_, quindi
// non finisce nel JavaScript del browser. Viene letta lato server (in Docker è impostata in
// docker-compose.yml come http://api:8000) e non è "cotta" nel build.
//
// --- CODICE ---
const API_URL = process.env.API_URL ?? "http://localhost:8000";

// `async` = la funzione restituisce una Promise, quindi possiamo usare `await` al suo interno.
// `request: Request` è l'oggetto standard del web (non quello di Express/Node): contiene metodo,
// URL, header e body della richiesta che arriva dal browser.
// `ctx: RouteContext<"/api/[...path]">` = il secondo argomento di Next, con i parametri dinamici
// della route (qui `params.path`). Il tipo è generato da Next, quindi non va importato.
async function proxy(request: Request, ctx: RouteContext<"/api/[...path]">) {
  // Estrae `path` dal Promise `params` (Next 15+). Per /api/a/b, `path` vale ["a", "b"].
  const { path } = await ctx.params;
  // Legge l'URL completo e prende solo la parte `?chiave=valore` (search, vuota se assente).
  const { search } = new URL(request.url);
  // Il body (corpo) della richiesta: GET e HEAD non lo hanno (fetch lancerebbe errore), quindi
  // per loro è `undefined`. Per gli altri metodi (POST/PUT/DELETE) lo leggiamo come testo grezzo
  // senza interpretarlo come JSON: lo inoltriamo così com'è al backend.
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  // `try` = proviamo il blocco; se qualcosa lancia un errore, il `catch` in fondo prende il
  // controllo invece di far crashare il server (es. se il container api è spento).
  try {
    // `upstream` ("a monte") è la risposta di FastAPI. `fetch` è la funzione nativa per le
    // richieste HTTP. Costruiamo l'URL del backend: indirizzo base + segmenti + eventuale query.
    // `path.join("/")` trasforma ["a","b"] in "a/b".
    const upstream = await fetch(`${API_URL}/${path.join("/")}${search}`, {
      // Stesso metodo del browser (GET, POST, PUT o DELETE): il proxy è "trasparente".
      method: request.method,
      // Passiamo il Content-Type ricevuto; se manca, assumiamo JSON. `??` usa il valore a destra
      // solo quando quello a sinistra è null/undefined.
      headers: { "content-type": request.headers.get("content-type") ?? "application/json" },
      // Il corpo letto poco sopra (oppure undefined per GET/HEAD).
      body,
      // Opzione di Next esteso a `fetch`: non usare cache, ogni richiesta va davvero a FastAPI.
      // Utile perché i dati cambiano (progressi, articoli) e le risposte LLM sono lente.
      cache: "no-store",
    });
    // Rigiriamo al browser la risposta di FastAPI. `upstream.body` è un flusso (stream): i dati
    // passano senza essere caricati tutti in memoria, utile per risposte lunghe (es. tutor AI).
    // `new Response(...)` è la classe standard per costruire una risposta HTTP.
    return new Response(upstream.body, {
      // Stesso codice di stato di FastAPI (200, 404, 422, 503...).
      status: upstream.status,
      // Stesso tipo di contenuto (di solito application/json).
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    // Arriva qui solo se la richiesta non riesce proprio (rete, backend spento). Rispondiamo con
    // 502 "Bad Gateway" (gateway = questo proxy, che non riesce a parlare con il server a monte).
    // `Response.json(...)` crea una risposta JSON con il corpo dato.
    return Response.json({ detail: "The API is not reachable." }, { status: 502 });
  }
}

// Ogni `export` con un nome di metodo HTTP diventa il gestore di quel metodo: Next chiama
// GET per le GET, POST per le POST, ecc. `as` crea più alias della stessa funzione `proxy`.
// PATCH non è esportato qui (il backend non lo usa): una PATCH riceve 405 "Method Not Allowed".
export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE };
