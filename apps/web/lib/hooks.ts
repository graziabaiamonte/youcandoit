"use client";

/*
 * File degli "hook" di dati: ogni funzione esportata qui sotto chiama l'API e tiene il
 * risultato in cache tramite SWR (libreria per il recupero dati in React).
 * SWR restituisce subito i dati gia' in cache e li riaggiorna in background ("revalidate"),
 * cosi' la UI non resta vuota ogni volta che si cambia pagina.
 *
 * Chi lo usa: app/page.tsx, app/news/page.tsx, components/learning-map.tsx,
 * components/stats-mini.tsx, components/welcome-dialog.tsx, components/command-bar.tsx,
 * components/app-sidebar.tsx, components/star-button.tsx.
 * Cosa usa: fetcher e i tipi di lib/api.ts, che parla con /api/* (proxy verso FastAPI).
 *
 * Concetti chiave:
 * - Hook = funzione che inizia con "use" e puo' chiamare altri hook. Va usata solo dentro
 *   componenti React o altri hook, mai dentro if o cicli.
 *   Regole: https://react.dev/reference/rules/rules-of-hooks
 * - "use client": direttiva di Next.js (App Router), va in cima al file. Indica che il file
 *   gira nel browser: SWR usa stato ed effetti React, che non esistono sul server.
 *
 * Versioni (da package.json e node_modules): Next 16.4.2, React 19.3.0, SWR 2.5.1.
 * Doc: https://swr.vercel.app/ , https://nextjs.org/docs , https://react.dev/
 */

// import: useSWR (default) e' l'hook di lettura con cache; mutate e' l'aggiornamento globale.
// Le graffe servono per gli export "con nome"; senza graffe si prenderebbe solo il default.
import useSWR, { mutate } from "swr";
// "./api" = lib/api.ts (stessa cartella). `type` davanti ad Article/Stats/TrackNode indica
// che sono solo tipi TypeScript: spariscono nel JS finale. fetcher e' la funzione che fa la
// richiesta HTTP vera e propria.
import { fetcher, type Article, type Stats, type TrackNode } from "./api";

// Hook per la roadmap. `export const` rende la funzione importabile dagli altri file.
// Il generic <TrackNode[]> dice a TypeScript che `data` sara' una lista di TrackNode.
// "/roadmap" e' la chiave della cache: SWR la passa a fetcher, che chiama GET /api/roadmap.
export const useRoadmap = () => useSWR<TrackNode[]>("/roadmap", fetcher);
// Come useRoadmap, ma per le statistiche (XP, livello, streak...) letta da "/stats".
export const useStats = () => useSWR<Stats>("/stats", fetcher);
// Il parametro `favorites` ha un valore di default (false). Entra nella chiave con la query
// string: "/articles?favorites=true" e "/articles?favorites=false" sono cache separate.
// Il backtick con ${...} e' un template literal: inserisce il valore della variabile nella stringa.
export const useArticles = (favorites = false) =>
  useSWR<Article[]>(`/articles?favorites=${favorites}`, fetcher);

// refreshArticles NON e' un hook (non inizia con "use"): e' una normale funzione che si chiama
// dentro un gestore di eventi, come in star-button.tsx o news/page.tsx, dopo una modifica.
// mutate(filtro) senza secondo argomento "rivalida": SWR rifa la richiesta per ogni chiave
// gia' in cache che supera il filtro. Il filtro riceve la chiave; `typeof key === "string"`
// evita errori se la chiave non e' una stringa (SWR accetta anche array come chiavi).
// startsWith("/articles") prende tutte le liste di articoli, con o senza query string.
/** Revalidate every article list (all, favorites, any limit). */
export const refreshArticles = () => mutate((key) => typeof key === "string" && key.startsWith("/articles"));
