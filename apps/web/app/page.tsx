"use client";

import Link from "next/link";
import { ArrowRightIcon, AwardIcon, FlameIcon, SparklesIcon, TargetIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "@/components/progress-ring";
import { allSessions, sessionProgress, trackStyle } from "@/lib/api";
import { useRoadmap, useStats } from "@/lib/hooks";

export default function Dashboard() {
  const { data: stats, error: statsError } = useStats();
  const { data: tracks, error: roadmapError } = useRoadmap();
  const error = statsError ?? roadmapError;
  const next = allSessions(tracks).find((s) => {
    const { done, total } = sessionProgress(s);
    return done < total;
  });
  const nextProgress = next && sessionProgress(next);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Your path to senior engineer</h1>
        <p className="mt-1 text-muted-foreground">
          One topic at a time. Tick subchapters as you master them — consistency beats intensity.
        </p>
        {error && <p className="mt-2 text-destructive">Can&apos;t reach the API: {error.message}</p>}
      </section>

      <section className="grid gap-3 lg:grid-cols-4" aria-label="Overview">
        {next && nextProgress ? (
          <Card
            className="surface-track rounded-3xl lg:col-span-2 lg:row-span-2"
            style={trackStyle(next.id.split(".")[0])}
          >
            <CardHeader>
              <CardDescription className="text-xs tracking-wider uppercase">Next session</CardDescription>
              <span className="font-mono text-sm text-track">{next.id}</span>
              <CardTitle className="font-heading text-2xl leading-tight">{next.title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="flex items-center gap-3">
                <ProgressRing
                  percent={Math.round((nextProgress.done / nextProgress.total) * 100)}
                  className="size-16 text-sm"
                />
                <p className="font-mono text-xs text-muted-foreground">
                  {nextProgress.done}/{nextProgress.total} subchapters done
                </p>
              </div>
              <Button asChild className="rounded-full">
                <Link href={`/session/${next.id}`}>
                  Study <ArrowRightIcon aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : tracks ? (
          <Card className="rounded-3xl lg:col-span-2 lg:row-span-2">
            <CardHeader>
              <CardDescription className="text-xs tracking-wider uppercase">Roadmap complete</CardDescription>
              <CardTitle className="font-heading text-2xl leading-tight">Every session is done. Time to build.</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          <Skeleton className="h-48 rounded-3xl lg:col-span-2 lg:row-span-2" />
        )}
        <StatCard icon={SparklesIcon} tone="text-xp" label="Level" value={stats && `LV ${String(stats.level).padStart(2, "0")}`} hint={stats && `${stats.xp} XP total`} />
        <StatCard icon={FlameIcon} tone="text-streak" label="Streak" value={stats && `${stats.streak} d`} hint={stats && `Best: ${stats.best_streak} days`} />
        <Card className="gap-2 py-4 lg:col-span-2">
          <CardHeader className="px-4">
            <CardDescription className="flex items-center justify-between text-xs tracking-wider uppercase">
              <span className="flex items-center gap-1.5"><TargetIcon className="size-4 text-success" aria-hidden /> Last 24 weeks</span>
              <span className="font-mono normal-case">{stats?.completed_today ?? 0} today</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            {stats ? <Heatmap activity={stats.activity} /> : <Skeleton className="h-24" />}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="tracks-heading" className="space-y-3">
        <h2 id="tracks-heading" className="text-lg font-semibold">Tracks</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {!stats && Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          {stats?.tracks.map((t) => (
            <Card key={t.id} className="surface-track gap-2 rounded-2xl py-4" style={trackStyle(t.id)}>
              <CardHeader className="px-4">
                <CardTitle className="flex items-baseline justify-between gap-2 text-sm">
                  <span>
                    <span className="font-mono text-track">T{t.id}</span> · {t.title}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {t.done}/{t.total}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <Progress value={t.total ? (t.done / t.total) * 100 : 0} className="h-1.5 [&>*]:bg-track" aria-label={`Track ${t.id} progress`} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="badges-heading" className="space-y-3">
        <h2 id="badges-heading" className="text-lg font-semibold">Badges</h2>
        {stats && !stats.badges.length && (
          <p className="text-sm text-muted-foreground">Complete your first subchapter to earn your first badge.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {stats?.badges.map((b) => (
            <Badge key={b.id} variant="secondary" className="h-auto gap-1.5 px-3 py-1" title={b.description}>
              <AwardIcon className="size-3.5 text-xp" aria-hidden /> {b.title}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  label: string;
  value: React.ReactNode;
  hint: React.ReactNode;
}) {
  return (
    <Card className="gap-1 py-4">
      <CardContent className="px-4">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Icon className={`size-4 ${tone}`} /> {label}
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{value ?? "—"}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

const WEEKS = 24;
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** GitHub-style grid: columns are weeks (Monday first), the last column ends today. */
function Heatmap({ activity }: { activity: Record<string, number> }) {
  const today = new Date();
  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - ((today.getDay() + 6) % 7) - (WEEKS - 1) * 7 + i);
    return { key: dayKey(d), future: d > today };
  });
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[3px]" role="img" aria-label="Subchapters completed per day, last 24 weeks">
      {cells.map(({ key, future }) => {
        const n = activity[key] ?? 0;
        return (
          <i
            key={key}
            title={future ? undefined : `${key}: ${n}`}
            className="aspect-square rounded-[2px]"
            style={{
              background: future
                ? "transparent"
                : `color-mix(in srgb, var(--primary) ${Math.min(n, 4) * 25}%, color-mix(in srgb, var(--foreground) 8%, transparent))`,
            }}
          />
        );
      })}
    </div>
  );
}
