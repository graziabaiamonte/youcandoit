import { cn } from "@/lib/utils";

/** Circular progress in the element's --track colour; the hole is masked so it sits on any background. */
export function ProgressRing({ percent, className }: { percent: number; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`${percent}% complete`}
      className={cn("relative grid size-12 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums", className)}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(var(--track) ${percent * 3.6}deg, var(--muted) 0)`,
          mask: "radial-gradient(farthest-side, transparent 76%, #000 77%)",
        }}
      />
      {percent}%
    </div>
  );
}
