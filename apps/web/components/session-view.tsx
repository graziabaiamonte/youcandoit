"use client";

import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  HammerIcon,
  NetworkIcon,
  TargetIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Lesson } from "@/components/lesson";
import { Mermaid } from "@/components/mermaid";
import { TutorSheet } from "@/components/tutor-sheet";
import { api, fetcher, trackColor, type SessionDetail, type Stats } from "@/lib/api";
import { useStats } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const isPractice = (title: string) => title.startsWith("Practice:");

function sessionMindmap(s: SessionDetail) {
  const clean = (t: string) => t.replace(/[()[\]{}"]/g, "").replace(/^Practice: /, "🛠 ");
  return ["mindmap", `  root((${clean(s.title)}))`, ...s.subchapters.map((c) => `    ${clean(c.title)}`)].join("\n");
}

export function SessionView({ id }: { id: string }) {
  const key = `/sessions/${id}`;
  const { data: s, error, mutate } = useSWR<SessionDetail>(key, fetcher);
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data: prev } = useStats();

  if (error) return <p className="text-destructive">{error.message}</p>;
  if (!s) return <Skeleton className="h-96 rounded-xl" />;

  const done = s.subchapters.filter((c) => c.done).length;

  async function toggle(subId: string, checked: boolean) {
    if (!s) return;
    // optimistic tick
    mutate({ ...s, subchapters: s.subchapters.map((c) => (c.id === subId ? { ...c, done: checked } : c)) }, false);
    try {
      const stats = await api<Stats>(`/progress/${subId}`, { method: checked ? "PUT" : "DELETE" });
      await Promise.all([mutateGlobal("/stats", stats, false), mutateGlobal("/roadmap"), mutate()]);
      if (checked) {
        const newBadges = stats.badges.filter((b) => !prev?.badges.some((p) => p.id === b.id));
        newBadges.forEach((b) => toast.success(`🏅 Badge unlocked: ${b.title}`, { description: b.description }));
        if (prev && stats.level > prev.level) toast.success(`⭐ Level up! You reached level ${stats.level}`);
        else toast(`+${stats.xp - (prev?.xp ?? 0)} XP`);
      }
    } catch (e) {
      mutate();
      toast.error((e as Error).message);
    }
  }

  return (
    <article className="space-y-6" style={{ "--track": trackColor(s.track_id) } as React.CSSProperties}>
      <header className="space-y-3 rounded-2xl border-t-4 border-t-track bg-card p-6 shadow-xs">
        <p className="text-sm font-medium text-track">
          Track {s.track_id} · {s.track_title} <span className="text-muted-foreground">/ {s.module_title}</span>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          <span className="text-muted-foreground">{s.id}</span> {s.title}
        </h1>
        <div className="flex items-center gap-3">
          <Progress value={(done / s.subchapters.length) * 100} className="h-2 [&>*]:bg-track" aria-label="Session progress" />
          <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {done}/{s.subchapters.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <TutorSheet sessionId={s.id} sessionTitle={s.title} />
        </div>
      </header>

      <Card className="border-l-4 border-l-primary bg-accent/50">
        <CardContent className="flex gap-3">
          <TargetIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold">By the end of this session you will</h2>
            <p className="mt-1 leading-relaxed">{s.outcomes}</p>
          </div>
        </CardContent>
      </Card>

      {s.lesson && (
        <section id="lesson" aria-labelledby="lesson-heading" className="space-y-3">
          <h2 id="lesson-heading" className="flex items-center gap-2 text-lg font-semibold">
            <GraduationCapIcon className="size-5 text-track" aria-hidden /> Lesson
          </h2>
          <Lesson markdown={s.lesson} />
        </section>
      )}

      <section aria-labelledby="subchapters-heading" className="space-y-3">
        <h2 id="subchapters-heading" className="flex items-center gap-2 text-lg font-semibold">
          <BookOpenIcon className="size-5 text-track" aria-hidden /> Subchapters
        </h2>
        <ol className="space-y-2">
          {s.subchapters.map((c, i) => (
            <li key={c.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-track/50",
                  c.done && "bg-muted/50",
                  isPractice(c.title) && "border-dashed border-track/60",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
                    c.done ? "bg-track text-white dark:text-background" : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {isPractice(c.title) ? <HammerIcon className="size-4" /> : i + 1}
                </span>
                <span className={cn("flex-1 leading-snug", c.done && "text-muted-foreground line-through")}>
                  {isPractice(c.title) ? (
                    <>
                      <span className="font-semibold text-track">Practice:</span>
                      {c.title.slice("Practice:".length)}
                    </>
                  ) : (
                    c.title
                  )}
                </span>
                <Checkbox
                  checked={c.done}
                  onCheckedChange={(v) => toggle(c.id, v === true)}
                  aria-label={`Mark "${c.title}" as ${c.done ? "not done" : "done"}`}
                  data-testid={`sub-${c.id}`}
                  className="size-5"
                />
              </label>
            </li>
          ))}
        </ol>
      </section>

      <Collapsible className="rounded-xl border bg-card">
        <CollapsibleTrigger className="flex w-full items-center gap-2 p-4 text-left font-semibold">
          <NetworkIcon className="size-5 text-track" aria-hidden /> Session map
          <span className="ml-auto text-xs font-normal text-muted-foreground">show diagram</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <Mermaid chart={sessionMindmap(s)} label={`Mind map of the subchapters of ${s.title}`} />
        </CollapsibleContent>
      </Collapsible>

      <section aria-labelledby="sources-heading" className="space-y-3">
        <h2 id="sources-heading" className="text-lg font-semibold">Study from these sources</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {s.sources.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/50"
              >
                <ExternalLinkIcon className="size-4 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{src.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{new URL(src.url).hostname}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <nav className="flex justify-between gap-2 border-t pt-6" aria-label="Session navigation">
        {s.prev_id ? (
          <Button variant="outline" asChild>
            <Link href={`/session/${s.prev_id}`}>
              <ArrowLeftIcon aria-hidden /> Previous
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {s.next_id && (
          <Button asChild>
            <Link href={`/session/${s.next_id}`}>
              Next session <ArrowRightIcon aria-hidden />
            </Link>
          </Button>
        )}
      </nav>
    </article>
  );
}
