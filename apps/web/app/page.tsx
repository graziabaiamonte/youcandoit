"use client";

import Link from "next/link";
import { ArrowRightIcon, AwardIcon, FlameIcon, SparklesIcon, TargetIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { sessionProgress, trackColor } from "@/lib/api";
import { useRoadmap, useStats } from "@/lib/hooks";

export default function Dashboard() {
  const { data: stats } = useStats();
  const { data: tracks } = useRoadmap();
  const sessions = tracks?.flatMap((t) => t.modules.flatMap((m) => m.sessions)) ?? [];
  const next = sessions.find((s) => {
    const { done, total } = sessionProgress(s);
    return done < total;
  });

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Your path to senior engineer</h1>
        <p className="mt-1 text-muted-foreground">
          One topic at a time. Tick subchapters as you master them — consistency beats intensity.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Your stats">
        <StatCard icon={SparklesIcon} tone="text-xp" label="Level" value={stats?.level} hint={stats && `${stats.xp} XP total`} />
        <StatCard icon={FlameIcon} tone="text-streak" label="Streak" value={stats && `${stats.streak} days`} hint={stats && `Best: ${stats.best_streak} days`} />
        <StatCard icon={TargetIcon} tone="text-success" label="Done today" value={stats?.completed_today} hint="subchapters completed" />
      </section>

      {next && (
        <Card className="border-primary/30 bg-accent" style={{ "--track": trackColor(next.id.split(".")[0]) } as React.CSSProperties}>
          <CardHeader>
            <CardDescription>Continue where you left off</CardDescription>
            <CardTitle className="text-xl">
              Session {next.id} — {next.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Progress value={(sessionProgress(next).done / sessionProgress(next).total) * 100} className="h-2 [&>*]:bg-track" />
            <Button asChild>
              <Link href={`/session/${next.id}`}>
                Study <ArrowRightIcon aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="tracks-heading" className="space-y-3">
        <h2 id="tracks-heading" className="text-lg font-semibold">Tracks</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {!stats && Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          {stats?.tracks.map((t) => (
            <Card key={t.id} className="gap-2 border-l-4 border-l-track py-4" style={{ "--track": trackColor(t.id) } as React.CSSProperties}>
              <CardHeader className="px-4">
                <CardTitle className="flex items-baseline justify-between gap-2 text-sm">
                  <span>
                    <span className="text-track">Track {t.id}</span> · {t.title}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
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
            <Badge key={b.id} variant="secondary" className="gap-1.5 py-1" title={b.description}>
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
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value ?? "—"}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
