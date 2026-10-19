"use client";

import { FlameIcon, SparklesIcon } from "lucide-react";
import { useStats } from "@/lib/hooks";
import { Progress } from "@/components/ui/progress";

/** Level, XP towards next level and streak — always visible in the sidebar header. */
export function StatsMini() {
  const { data } = useStats();
  if (!data) return <div className="h-12" />;
  return (
    <div className="space-y-1.5 rounded-lg bg-sidebar-accent/60 p-2.5 text-xs" data-testid="stats-mini">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 font-semibold text-xp">
          <SparklesIcon className="size-3.5" aria-hidden /> Level {data.level}
        </span>
        <span className="flex items-center gap-1 font-semibold text-streak" title="Study streak">
          <FlameIcon className="size-3.5" aria-hidden /> {data.streak} day{data.streak === 1 ? "" : "s"}
        </span>
      </div>
      <Progress
        value={(data.xp_into_level / data.xp_for_next_level) * 100}
        className="h-1.5 [&>*]:bg-xp"
        aria-label="Progress to next level"
      />
      <p className="text-muted-foreground" data-testid="xp-total">
        {data.xp} XP · {data.xp_for_next_level - data.xp_into_level} to level {data.level + 1}
      </p>
    </div>
  );
}
