"use client";

import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ExternalLinkIcon,
  HammerIcon,
  NetworkIcon,
  TargetIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  // (…) = rounded box, the app's card shape
  return ["mindmap", `  root(${clean(s.title)})`, ...s.subchapters.map((c, i) => `    n${i}(${clean(c.title)})`)].join("\n");
}

/** Splits a lesson into the text before the first `##` and one body per `##` section (heading dropped). */
function splitLesson(md: string | null | undefined) {
  const parts: string[][] = [[]];
  let fenced = false;
  for (const line of (md ?? "").split("\n")) {
    if (/^```/.test(line)) fenced = !fenced;
    if (!fenced && line.startsWith("## ")) parts.push([]);
    else parts[parts.length - 1].push(line);
  }
  const [intro, ...sections] = parts.map((p) => p.join("\n").trim());
  return { intro, sections };
}

export function SessionView({ id }: { id: string }) {
  const key = `/sessions/${id}`;
  const { data: s, error, mutate } = useSWR<SessionDetail>(key, fetcher);
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data: prev } = useStats();

  if (error) return <p className="text-destructive">{error.message}</p>;
  if (!s) return <Skeleton className="h-96 rounded-xl" />;

  const { intro, sections } = splitLesson(s.lesson);
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
      <header className="surface-track space-y-3 rounded-3xl border p-6 shadow-xs">
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

      <Card className="bg-primary/12">
        <CardContent className="flex gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/24 text-primary" aria-hidden>
            <TargetIcon className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">By the end of this session you will</h2>
            <p className="mt-1 leading-relaxed">{s.outcomes}</p>
          </div>
        </CardContent>
      </Card>

      {intro && <Lesson markdown={intro} />}

      <section aria-labelledby="subchapters-heading" className="space-y-3">
        <h2 id="subchapters-heading" className="flex items-center gap-2 text-lg font-semibold">
          <BookOpenIcon className="size-5 text-track" aria-hidden /> Subchapters
        </h2>
        <Accordion type="multiple" className="gap-2">
          {s.subchapters.map((c, i) => {
            const body = sections[i];
            const row = (
              <>
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
              </>
            );
            return (
              <AccordionItem
                key={c.id}
                value={c.id}
                className={cn(
                  "relative rounded-2xl border bg-card transition-colors hover:border-track/50",
                  c.done && "bg-muted/50",
                  isPractice(c.title) && "border-dashed border-track/60",
                )}
              >
                {body ? (
                  <AccordionTrigger className="items-center gap-4 border-0 p-4 pr-14 text-base font-normal hover:no-underline">
                    {row}
                  </AccordionTrigger>
                ) : (
                  <div className="flex items-center gap-4 p-4 pr-14">{row}</div>
                )}
                {/* sibling of the trigger: a checkbox inside a <button> is invalid and would toggle the panel */}
                <Checkbox
                  checked={c.done}
                  onCheckedChange={(v) => toggle(c.id, v === true)}
                  aria-label={`Mark "${c.title}" as ${c.done ? "not done" : "done"}`}
                  data-testid={`sub-${c.id}`}
                  className="absolute top-[22px] right-4 size-5"
                />
                {body && (
                  <AccordionContent className="px-4 pb-4 text-base">
                    <Lesson markdown={body} />
                  </AccordionContent>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      <Collapsible className="rounded-xl border bg-card">
        <CollapsibleTrigger className="flex w-full items-center gap-2 p-4 text-left font-semibold">
          <NetworkIcon className="size-5 text-track" aria-hidden /> Session map
          <span className="ml-auto text-xs font-normal text-muted-foreground">show diagram</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="session-mindmap px-4 pb-4">
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
