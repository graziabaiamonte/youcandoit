"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
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
import "@xyflow/react/dist/style.css";
import { MapPinIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ProgressRing } from "@/components/progress-ring";
import { isDarkTheme } from "@/lib/themes";
import { Skeleton } from "@/components/ui/skeleton";
import { sessionProgress, trackPercent, trackStyle, type TrackNode } from "@/lib/api";
import { useRoadmap } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const PER_ROW = 3;
const COL_W = 340;
const ROW_H = 310;

type ModuleInfo = { id: string; title: string; done: number; total: number; target: string };
type TrackData = { track: TrackNode; modules: ModuleInfo[]; percent: number; current: boolean };

function TrackCard({ data }: NodeProps<Node<TrackData>>) {
  const router = useRouter();
  const { track, modules, percent, current } = data;
  return (
    <div
      className={cn(
        "surface-track w-72 rounded-3xl border-2 bg-card p-4 shadow-sm",
        current ? "border-track ring-4 ring-track/20" : "border-border",
      )}
      style={trackStyle(track.id)}
      data-testid={`map-track-${track.id}`}
      data-percent={percent}
    >
      {HANDLES.map(([id, position]) => (
        <Handle key={`t-${id}`} id={`t-${id}`} type="target" position={position} className="opacity-0" />
      ))}
      {HANDLES.map(([id, position]) => (
        <Handle key={`s-${id}`} id={`s-${id}`} type="source" position={position} className="opacity-0" />
      ))}
      <div className="flex items-start gap-3">
        <ProgressRing percent={percent} />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-track">Track {track.id}</p>
          <p className="leading-tight font-semibold">{track.title}</p>
        </div>
        {current && <MapPinIcon className="ml-auto size-5 shrink-0 text-track" aria-label="You are here" />}
      </div>
      <div className="nodrag mt-3 flex flex-wrap gap-1.5">
        {modules.map((m) => (
          <button
            key={m.id}
            type="button"
            title={`${m.title} — ${m.done}/${m.total}`}
            onClick={() => router.push(`/session/${m.target}`)}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px] transition-colors hover:border-track",
              m.done === m.total ? "border-track bg-track text-white dark:text-background" : m.done ? "border-track/60 text-track" : "text-muted-foreground",
            )}
          >
            {m.title}
          </button>
        ))}
      </div>
    </div>
  );
}

const nodeTypes = { track: TrackCard };
const HANDLES = [
  ["left", Position.Left],
  ["right", Position.Right],
  ["top", Position.Top],
  ["bottom", Position.Bottom],
] as const;

function buildGraph(tracks: TrackNode[]) {
  const infos = tracks.map((track) => {
    const modules: ModuleInfo[] = track.modules.filter((m) => m.sessions.length).map((m) => {
      const prog = m.sessions.map(sessionProgress);
      const firstOpen = m.sessions.find((s) => sessionProgress(s).done < sessionProgress(s).total);
      return {
        id: m.id,
        title: m.title,
        done: prog.reduce((a, p) => a + p.done, 0),
        total: prog.reduce((a, p) => a + p.total, 0),
        target: (firstOpen ?? m.sessions[0]).id,
      };
    });
    return { track, modules, percent: trackPercent(track) };
  });
  const currentIdx = infos.findIndex((i) => i.percent < 100);
  const reached = currentIdx === -1 ? infos.length : currentIdx; // all done → whole path green

  // serpentine layout: left→right on even rows, right→left on odd rows
  const nodes: Node<TrackData>[] = infos.map((info, i) => {
    const row = Math.floor(i / PER_ROW);
    const col = row % 2 === 0 ? i % PER_ROW : PER_ROW - 1 - (i % PER_ROW);
    return {
      id: info.track.id,
      type: "track",
      position: { x: col * COL_W, y: row * ROW_H },
      data: { ...info, current: i === currentIdx },
    };
  });
  const edges: Edge[] = infos.slice(1).map((info, i) => {
    const row = Math.floor(i / PER_ROW);
    const sameRow = row === Math.floor((i + 1) / PER_ROW);
    const ltr = row % 2 === 0;
    // along a row the path runs sideways; between rows it drops straight down
    const [from, to] = !sameRow ? ["bottom", "top"] : ltr ? ["right", "left"] : ["left", "right"];
    return {
      id: `${infos[i].track.id}-${info.track.id}`,
      source: infos[i].track.id,
      target: info.track.id,
      sourceHandle: `s-${from}`,
      targetHandle: `t-${to}`,
      type: "smoothstep",
      animated: i + 1 === currentIdx,
      style: { strokeWidth: 3, stroke: i < reached ? "var(--success)" : "var(--muted-foreground)" },
    };
  });
  return { nodes, edges };
}

export function LearningMap() {
  const { data: tracks, error } = useRoadmap();
  const { resolvedTheme } = useTheme();
  const graph = useMemo(() => (tracks ? buildGraph(tracks) : null), [tracks]);
  if (error) return <p className="p-6 text-destructive">Could not load the roadmap: {error.message}</p>;
  if (!graph) return <Skeleton className="flex-1 rounded-none" />;
  return (
    <div className="min-h-0 flex-1 bg-card" data-testid="learning-map">
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
        <Background gap={24} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
