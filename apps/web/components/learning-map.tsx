"use client";

/*
 * File: components/learning-map.tsx
 * La mappa visiva del percorso: ogni Track è una "card" collegata alla successiva da una
 * freccia. Le card sono disposte a serpentina (sinistra→destra, poi destra→sinistra, ecc.).
 *
 * Come si collega al resto del progetto:
 * - È usata solo da app/map/page.tsx (rotta /map), con il tag <LearningMap />.
 * - I dati arrivano da useRoadmap() in lib/hooks.ts, che chiama GET /api/roadmap. Il proxy
 *   app/api/[...path]/route.ts lo inoltra all'API FastAPI. I tipi TrackNode e SessionNode
 *   arrivano da lib/api-types.ts, generato dallo schema OpenAPI (vedi lib/api.ts).
 * - Calcoli di avanzamento (sessionProgress, trackPercent, trackStyle) in lib/api.ts.
 * - ProgressRing (components/progress-ring.tsx) disegna l'anello di percentuale.
 * - Il click su un modulo apre la prima sessione non completata di quel modulo (router.push).
 *
 * Concetti usati qui:
 * - "use client" in cima: questo file è un Client Component. Gira nel browser perché React
 *   Flow usa mouse, zoom e stato.
 *   Guida Next.js: https://nextjs.org/docs/app/getting-started/server-and-client-components
 *   Riferimento React: https://react.dev/reference/rsc/use-client
 * - React Flow (@xyflow/react, v12): libreria che disegna nodi (Node) e collegamenti (Edge)
 *   su una tela con zoom e pan. Ogni nodo usa un componente personalizzato (nodeTypes).
 *   Docs: https://reactflow.dev/learn
 * - Hook React: funzioni che iniziano con "use" (useMemo, useRouter, useTheme, useRoadmap).
 *   Vanno chiamate sempre al primo livello del componente, mai dentro if o cicli.
 *   Riferimento: https://react.dev/reference/react/hooks
 * - useMemo: memorizza il risultato di buildGraph e lo ricalcola solo se "tracks" cambia.
 * - Props tipizzate: NodeProps<Node<TrackData>> dice a TypeScript la forma dei dati del nodo.
 * - "as const": fissa i valori di un array letterale, così TypeScript conosce i tipi esatti.
 * - Alias "@/": punta alla radice di apps/web (vedi tsconfig.json).
 */

// useMemo: hook React che memorizza un valore calcolato tra un render e l'altro.
import { useMemo } from "react";
// useRouter (next/navigation): hook per cambiare pagina via codice, es. router.push("/x").
import { useRouter } from "next/navigation";
// Import con graffe = named import: prendo solo i pezzi che mi servono da @xyflow/react.
// "type" davanti a un nome indica che serve solo per i tipi e viene cancellato a runtime.
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
// Import "solo effetto": carica il CSS di base di React Flow (senza nomi importati).
import "@xyflow/react/dist/style.css";
// Icona "segnaposto" (lucide-react, libreria di icone SVG) usata per la track corrente.
import { MapPinIcon } from "lucide-react";
// useTheme (next-themes): restituisce il tema attivo, es. "plum", "midnight" o "campus".
import { useTheme } from "next-themes";
// Componente del progetto (components/progress-ring.tsx): anello di percentuale.
import { ProgressRing } from "@/components/progress-ring";
// Helper del progetto: dice se il tema è scuro (React Flow vuole solo "light" o "dark").
import { isDarkTheme } from "@/lib/themes";
// Skeleton shadcn/ui: riquadro grigio animato mostrato mentre i dati si caricano.
import { Skeleton } from "@/components/ui/skeleton";
// Funzioni di calcolo e tipo TrackNode. "type" davanti serve solo per il tipo.
import { sessionProgress, trackPercent, trackStyle, type TrackNode } from "@/lib/api";
// Hook SWR del progetto che scarica la roadmap (vedi lib/hooks.ts).
import { useRoadmap } from "@/lib/hooks";
// cn: unisce più classi CSS condizionali in una sola stringa (helper shadcn/ui).
import { cn } from "@/lib/utils";

// Costanti "magiche" con nome: colonne per riga, larghezza colonna e altezza riga in pixel.
// Maiuscole = costante che non cambia. Sono usate in buildGraph per calcolare le posizioni.
const PER_ROW = 3;
const COL_W = 340;
const ROW_H = 310;

// "type" crea un alias di tipo (non esiste a runtime). Descrive un modulo già calcolato.
type ModuleInfo = { id: string; title: string; done: number; total: number; target: string };
// Dati completi di una card: la track, i suoi moduli, la percentuale e se è quella attuale.
type TrackData = { track: TrackNode; modules: ModuleInfo[]; percent: number; current: boolean };

// Componente React: una funzione che restituisce JSX. Il nome inizia con maiuscola, come
// convenzione per i componenti. Riceve le "props" come oggetto destrutturato: { data }.
// NodeProps<Node<TrackData>> è il tipo di React Flow che include "data" con il tipo TrackData.
function TrackCard({ data }: NodeProps<Node<TrackData>>) {
  // Hook: ottiene l'oggetto router per cambiare pagina quando si clicca un modulo.
  const router = useRouter();
  // Destrutturazione: estrae le proprietà di "data" in variabili separate, più leggibili.
  const { track, modules, percent, current } = data;
  // "return" dice a React cosa disegnare. Il blocco tra parentesi tonde è JSX.
  return (
    // Radice della card. Gli attributi (sotto) danno aspetto e dati di test:
    // - className: classi Tailwind; "border-track" usa il colore della track (token CSS).
    // - style: imposta la variabile --track per le classi *-track (vedi trackStyle in lib/api.ts).
    // - data-testid / data-percent: attributi "data-*" letti dai test Playwright (vedi e2e/).
    <div
      className={cn(
        // Classi base della card, poi bordo/alone colorato solo se è la track corrente.
        "surface-track w-72 rounded-3xl border-2 bg-card p-4 shadow-sm",
        current ? "border-track ring-4 ring-track/20" : "border-border",
      )}
      style={trackStyle(track.id)}
      data-testid={`map-track-${track.id}`}
      data-percent={percent}
    >
      {/* Handle = punti di aggancio delle frecce. "target" riceve, "source" parte.
          Ogni lato (HANDLES) ha un handle per tipo; opacity-0 li rende invisibili. */}
      {HANDLES.map(([id, position]) => (
        <Handle key={`t-${id}`} id={`t-${id}`} type="target" position={position} className="opacity-0" />
      ))}
      {/* Stessa cosa per i punti di partenza ("source"), uno per lato. */}
      {HANDLES.map(([id, position]) => (
        <Handle key={`s-${id}`} id={`s-${id}`} type="source" position={position} className="opacity-0" />
      ))}
      {/* Riga superiore: anello di avanzamento, titolo della track e segnaposto (se attuale). */}
      <div className="flex items-start gap-3">
        {/* Anello con la percentuale della track. */}
        <ProgressRing percent={percent} />
        <div className="min-w-0">
          {/* "min-w-0" permette al testo di restringersi invece di uscire dalla card. */}
          <p className="text-xs font-semibold text-track">Track {track.id}</p>
          <p className="leading-tight font-semibold">{track.title}</p>
        </div>
        {/* "&&": se current è false, React non disegna nulla. ml-auto spinge l'icona a destra. */}
        {current && <MapPinIcon className="ml-auto size-5 shrink-0 text-track" aria-label="You are here" />}
      </div>
      {/* "nodrag" è una classe speciale di React Flow: impedisce di trascinare la card
          quando si clicca un modulo. flex-wrap manda a capo i pulsanti. */}
      <div className="nodrag mt-3 flex flex-wrap gap-1.5">
        {/* Un pulsante per ogni modulo: il click apre la sessione corrispondente. */}
        {modules.map((m) => (
          // "key" aiuta React a riconoscere ogni elemento di una lista quando cambia.
          <button
            key={m.id}
            type="button"
            title={`${m.title} — ${m.done}/${m.total}`}
            onClick={() => router.push(`/session/${m.target}`)}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px] transition-colors hover:border-track",
              // Tre stati: modulo completo (pieno), iniziato (bordo chiaro), non iniziato (grigio).
              // "a ? b : c" è l'operatore ternario: "se a allora b, altrimenti c".
              m.done === m.total ? "border-track bg-track text-white dark:text-background" : m.done ? "border-track/60 text-track" : "text-muted-foreground",
            )}
          >
            {/* Testo del pulsante: il titolo del modulo. */}
            {m.title}
          </button>
        ))}
      </div>
    </div>
  );
}

// Registro dei tipi di nodo: dice a React Flow che i nodi di tipo "track" usano TrackCard.
const nodeTypes = { track: TrackCard };
// Quattro lati della card, con la Position di React Flow. "as const" fissa i valori esatti.
// Non è un problema che sia definito dopo TrackCard: viene letto solo quando la card si disegna.
const HANDLES = [
  ["left", Position.Left],
  ["right", Position.Right],
  ["top", Position.Top],
  ["bottom", Position.Bottom],
] as const;

// Trasforma le track (dati dall'API) in { nodes, edges }, ciò che React Flow disegna.
// È una funzione "pura": stessi dati in ingresso = stesso risultato, senza effetti collaterali.
function buildGraph(tracks: TrackNode[]) {
  // Primo passaggio: per ogni track calcola moduli e percentuale (il "modello" della card).
  const infos = tracks.map((track) => {
    // Scarta i moduli senza sessioni (filter) e poi li trasforma (map) in ModuleInfo.
    const modules: ModuleInfo[] = track.modules.filter((m) => m.sessions.length).map((m) => {
      // Un array con {done, total} per ogni sessione del modulo.
      const prog = m.sessions.map(sessionProgress);
      // Prima sessione non completata: è dove porta il click. Se tutte sono fatte, undefined.
      const firstOpen = m.sessions.find((s) => sessionProgress(s).done < sessionProgress(s).total);
      return {
        id: m.id,
        title: m.title,
        done: prog.reduce((a, p) => a + p.done, 0),
        total: prog.reduce((a, p) => a + p.total, 0),
        target: (firstOpen ?? m.sessions[0]).id,
      };
    });
    // Shorthand di proprietà: { track: track } si scrive { track }.
    return { track, modules, percent: trackPercent(track) };
  });
  // Indice della prima track non completata: è la "posizione attuale" sulla mappa. -1 = nessuna.
  const currentIdx = infos.findIndex((i) => i.percent < 100);
  const reached = currentIdx === -1 ? infos.length : currentIdx; // all done → whole path green

  // serpentine layout: left→right on even rows, right→left on odd rows
  // Node<TrackData>[] = array di nodi di React Flow, con "data" tipizzato come TrackData.
  // "map" crea un nuovo array trasformando ogni elemento; "i" è la posizione (0, 1, 2...).
  const nodes: Node<TrackData>[] = infos.map((info, i) => {
    // Math.floor arrotonda per difetto: con PER_ROW=3, indici 0-2 finiscono nella riga 0.
    const row = Math.floor(i / PER_ROW);
    const col = row % 2 === 0 ? i % PER_ROW : PER_ROW - 1 - (i % PER_ROW);
    return {
      // id univoco del nodo (uguale all'id della track). "type" dice quale componente disegnare.
      id: info.track.id,
      type: "track",
      position: { x: col * COL_W, y: row * ROW_H },
      // "..." (spread) copia tutte le proprietà di info; poi aggiunge il flag "current".
      data: { ...info, current: i === currentIdx },
    };
  });
  // Le frecce collegano ogni track alla successiva. slice(1) salta la prima, quindi
  // in questo map "info" è infos[i+1] e infos[i] è la track di partenza.
  const edges: Edge[] = infos.slice(1).map((info, i) => {
    // Riga della track di partenza.
    const row = Math.floor(i / PER_ROW);
    // true se partenza e arrivo sono nella stessa riga (freccia orizzontale).
    const sameRow = row === Math.floor((i + 1) / PER_ROW);
    // true se la riga va da sinistra a destra (riga pari).
    const ltr = row % 2 === 0;
    // along a row the path runs sideways; between rows it drops straight down
    const [from, to] = !sameRow ? ["bottom", "top"] : ltr ? ["right", "left"] : ["left", "right"];
    return {
      // id univoco dell'arco, es. "0-1". Serve a React Flow per riconoscere ogni freccia.
      id: `${infos[i].track.id}-${info.track.id}`,
      source: infos[i].track.id,
      target: info.track.id,
      sourceHandle: `s-${from}`,
      targetHandle: `t-${to}`,
      type: "smoothstep",
      // Freccia animata (tratteggio in movimento) solo verso la track attuale.
      animated: i + 1 === currentIdx,
      // Colore: verde ("success") se la freccia è già percorsa, grigio se deve ancora essere.
      // "var(--...)" usa una variabile CSS definita in globals.css.
      style: { strokeWidth: 3, stroke: i < reached ? "var(--success)" : "var(--muted-foreground)" },
    };
  });
  // Restituisce i due array: React Flow li riceve come props nodes ed edges.
  return { nodes, edges };
}

// "export function": componente esportato, importato da app/map/page.tsx.
// Non riceve props: legge tutto da SWR e dal tema.
export function LearningMap() {
  // Hook SWR: "data" sono i tracks quando arrivano, "error" se la richiesta fallisce.
  // "data: tracks" è una rinominazione in destrutturazione: la variabile si chiama tracks.
  const { data: tracks, error } = useRoadmap();
  // Hook next-themes: "resolvedTheme" è il tema reale attivo (plum, midnight o campus).
  const { resolvedTheme } = useTheme();
  // Ricalcola il grafo solo quando cambiano i dati (array di dipendenze [tracks]).
  // Se i dati non ci sono ancora, il valore è null.
  const graph = useMemo(() => (tracks ? buildGraph(tracks) : null), [tracks]);
  // Stato di errore: messaggio in rosso. "return" anticipato: esce dalla funzione subito.
  if (error) return <p className="p-6 text-destructive">Could not load the roadmap: {error.message}</p>;
  // Stato di caricamento: mostra uno skeleton finché il grafo non è pronto.
  if (!graph) return <Skeleton className="flex-1 rounded-none" />;
  // Stato normale: il contenitore che occupa lo spazio disponibile ("flex-1") e lo sfondo.
  return (
    // data-testid: etichetta per i test Playwright (e2e/layout.spec.ts la usa).
    <div className="min-h-0 flex-1 bg-card" data-testid="learning-map">
      {/* ReactFlow: la tela interattiva. Le props (sotto) ne configurano il comportamento:
          - nodes / edges: cosa disegnare (calcolati da buildGraph).
          - nodeTypes: quali componenti usare per ogni tipo di nodo (qui "track" -> TrackCard).
          - fitView: all'avvio zooma per far stare tutti i nodi nello schermo.
          - colorMode: "dark" o "light", in base al tema, per colori di sfondo e controlli.
          - nodesDraggable / nodesConnectable={false}: niente trascinamento, niente nuovi link.
          - proOptions.hideAttribution: nasconde la scritta di attribuzione di React Flow.
          - minZoom: zoom minimo consentito (0.3 = 30%). */}
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        fitView
        colorMode={isDarkTheme(resolvedTheme) ? "dark" : "light"}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
      >
        {/* Background: la trama di puntini sullo sfondo. gap = distanza tra i puntini in px. */}
        <Background gap={24} />
        {/* Controls: i pulsanti zoom +/-, fit e lucchetto. showInteractive=false nasconde
            il pulsante "interattivo" (blocca nodi/zoom), non necessario qui. */}
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
