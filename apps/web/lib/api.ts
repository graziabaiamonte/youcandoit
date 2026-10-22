/*
 * lib/api.ts: il "ponte" tipizzato tra il browser e l'API FastAPI (apps/api).
 *
 * COS'È QUESTO FILE (per chi inizia)
 * Non è un componente né una pagina: è una raccolta di funzioni e tipi riutilizzabili.
 * Chi lo usa (i file verificati sono tutti "use client"):
 *  - app/*.tsx e components/*.tsx importano `api` (chiamate POST/PUT/DELETE) e i tipi;
 *  - components/session-view.tsx e lib/hooks.ts passano `fetcher` a SWR (chiamate GET);
 *  - app/page.tsx, components/learning-map.tsx, app-sidebar.tsx e command-bar.tsx usano gli
 *    helper di calcolo (`trackStyle`, `sessionProgress`, `trackPercent`, `allSessions`).
 *
 * FLUSSO DI UNA RICHIESTA
 * componente -> api("/progress/…") -> fetch("/api/progress/…") sul sito Next (porta 3000)
 * -> app/api/[...path]/route.ts inoltra a FastAPI (porta 8000) -> risposta JSON al browser.
 * Il browser non conosce mai la porta 8000, quindi non servono configurazioni CORS.
 *
 * TIPI GENERATI
 * lib/api-types.ts viene generato da `npm run gen:api` (openapi-typescript) leggendo lo schema
 * OpenAPI del backend. NON modificarlo a mano: va rigenerato dopo ogni cambio alle API.
 * Qui si danno solo nomi brevi (alias) a quei tipi.
 *
 * CONCETTI USATI (TypeScript)
 *  - `import type`: importa solo il tipo; sparisce quando il codice viene compilato.
 *    Doc: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
 *  - `type X = ...`: alias di tipo. `components["schemas"]["X"]` è un "indexed access type":
 *    prende il tipo chiamato X dentro l'oggetto generato.
 *  - Generics `<T>`: parametro di tipo. `api<Stats>(…)` significa "la risposta è di tipo Stats".
 *  - `Promise<T>` e `async/await`: la rete è asincrona; `await` aspetta la risposta.
 *  - `CSSProperties`: tipo React per lo `style` inline; accetta anche le variabili CSS
 *    custom che iniziano con `--` (es. `--track`).
 *  - Doc React 19: https://react.dev/  Doc Next.js (16.4.2): https://nextjs.org/docs/app
 *    Né React né Next sono "usati" come hook qui: questo file è codice TypeScript puro.
 */
import type { CSSProperties } from "react";
// Tipi generati dallo schema OpenAPI del backend: solo tipi, nessun codice a runtime.
import type { components } from "./api-types";

// Scorciatoia: `Schemas` è l'oggetto con TUTTI gli schemi generati dal backend.
// Sotto ogni riga prende uno schema per nome e lo ri-esporta (`export`) con un nome corto,
// così gli altri file possono fare `import { type Article } from "@/lib/api"`.
type Schemas = components["schemas"];
// Una track della roadmap, con dentro i suoi moduli e le sessioni.
export type TrackNode = Schemas["TrackNode"];
// Una sessione (lezione) con il suo titolo e i sotto-capitoli (subchapter) con il progresso.
export type SessionNode = Schemas["SessionNode"];
// Dettaglio di una sessione: come SessionNode più fonti, navigazione prev/next e testo lezione.
export type SessionDetail = Schemas["SessionDetail"];
// Statistiche di gamification: XP, livello, streak, badge e progresso per track.
export type Stats = Schemas["StatsOut"];
// Un articolo della rassegna news (titolo, url, eventuale riassunto AI e data preferito).
export type Article = Schemas["ArticleOut"];
// Una citazione motivazionale (testo + autore), mostrata nel dialog di benvenuto.
export type Quote = Schemas["QuoteOut"];
// Risposta del tutor AI: il testo e le citazioni (fonti numerate).
export type Answer = Schemas["AnswerOut"];
// Un messaggio della chat: `role` è "user" o "assistant", più il `content` testuale.
export type Turn = Schemas["Turn"];

// Errore "leggibile" lanciato quando il backend risponde con un codice d'errore (4xx/5xx).
// `extends Error` = è un normale Error JavaScript, quindi ha `.message` e lo stack trace.
class ApiError extends Error {}

/** fetch wrapper for the /api proxy: JSON in, JSON out, readable errors. */
// `export async function`: funzione asincrona disponibile agli altri file.
// `<T>` è il tipo della risposta (deciso dal chiamante); `path` è l'URL senza "/api" davanti;
// `init?` è un parametro OPZIONALE (il `?`) con metodo HTTP (default GET) e corpo JSON.
// La funzione restituisce `Promise<T>`: il chiamante deve usare `await` per avere il dato.
export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  // `fetch` è l'API nativa del browser per le richieste HTTP; l'URL è relativo, quindi
  // va sullo stesso sito (porta 3000) e passa dal proxy app/api/[...path]/route.ts.
  const response = await fetch(`/api${path}`, {
    // `??` = "se è null/undefined usa il valore a destra": se non c'è un metodo, è GET.
    method: init?.method ?? "GET",
    // Dichiara che il corpo è JSON. Se non c'è corpo, `undefined` = nessun header extra.
    headers: init?.body ? { "content-type": "application/json" } : undefined,
    // Il corpo deve essere una stringa, quindi `JSON.stringify` converte l'oggetto in testo.
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  // Legge la risposta come JSON. Se il corpo non è JSON (es. risposta vuota), `.catch`
  // evita l'errore e usa un oggetto vuoto `{}`.
  const data = await response.json().catch(() => ({}));
  // `response.ok` è true per i codici 200-299. Altrimenti lancia l'errore con il messaggio
  // che FastAPI mette nel campo `detail` (vedi apps/api/app/main.py), o un messaggio generico.
  // Limite noto: per gli errori di validazione (422) `detail` è un array, non una stringa.
  if (!response.ok) throw new ApiError(data.detail ?? `Request failed (${response.status})`);
  // `as T` dice a TypeScript "fidati, questo è del tipo T": il controllo a runtime non c'è.
  return data as T;
}

// Funzione per SWR (libreria di caching/fetch usata in lib/hooks.ts): SWR passa la chiave
// (l'URL, es. "/roadmap") e questa chiama `api` con il metodo GET di default.
// La freccia `=>` è una funzione senza `{}`: il valore a destra viene restituito direttamente.
export const fetcher = <T>(path: string) => api<T>(path);

/** Track N uses colour token --track-(N+1). */
// Le track hanno id stringa ("0", "1", …). `Number(...)` la converte in numero; `% 12` fa
// "resto della divisione per 12" perché i colori sono 12 e si ripetono (vedi globals.css).
// Il template literal `…${x}…` (backtick) inserisce il valore dentro la stringa.
// Il risultato è una stringa tipo "var(--track-3)": la sintassi CSS per leggere una variabile.
export const trackColor = (trackId: string) => `var(--track-${(Number(trackId) % 12) + 1})`;

/** Sets --track for the `*-track` utilities on an element and its children. */
// Restituisce l'oggetto `style` per un elemento React: la chiave "--track" è una variabile CSS
// custom. `as CSSProperties` dice a TypeScript che è un oggetto di stili valido.
// Le classi Tailwind che iniziano con `*-track` leggono questa variabile (vedi globals.css).
export const trackStyle = (trackId: string) => ({ "--track": trackColor(trackId) }) as CSSProperties;

// Appiattisce tutte le sessioni di tutte le track in un unico array.
// `tracks: TrackNode[] = []` = parametro con valore di default (se manca, è un array vuoto).
// `flatMap` = "map + appiattisci": per ogni track/modulo prende le sue sessioni e le unisce.
export const allSessions = (tracks: TrackNode[] = []) => tracks.flatMap((t) => t.modules.flatMap((m) => m.sessions));

// Conta quanti subchapter di una sessione sono completati. `filter` tiene quelli con `done`
// true, `.length` conta. La funzione restituisce un oggetto { done, total }.
export const sessionProgress = (s: SessionNode) => ({
  done: s.subchapters.filter((c) => c.done).length,
  total: s.subchapters.length,
});

// Percentuale (0-100) dei subchapter completati in una intera track.
export function trackPercent(track: TrackNode) {
  // Raccoglie tutti i subchapter della track (track -> moduli -> sessioni -> subchapter).
  const subs = track.modules.flatMap((m) => m.sessions.flatMap((s) => s.subchapters));
  // Evita la divisione per zero: se non ci sono subchapter la percentuale è 0.
  // `Math.round` arrotonda all'intero più vicino.
  return subs.length ? Math.round((subs.filter((c) => c.done).length / subs.length) * 100) : 0;
}
