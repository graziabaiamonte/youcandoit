"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  MessagesSquareIcon,
  RefreshCwIcon,
  WandSparklesIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Chat } from "@/components/chat";
import { StarButton } from "@/components/star-button";
import { api, type Article } from "@/lib/api";
import { refreshArticles, useArticles } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function NewsPage() {
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    try {
      const { new: count } = await api<{ new: number }>("/articles/refresh", { method: "POST" });
      await refreshArticles();
      toast.success(count ? `${count} new articles` : "You're up to date");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">News & reading list</h1>
          <p className="text-muted-foreground">Fetched every morning from engineering, AI and DevOps sources.</p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={refreshing}>
          <RefreshCwIcon className={refreshing ? "animate-spin" : ""} aria-hidden /> Refresh now
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessagesSquareIcon className="size-5 text-primary" aria-hidden /> Ask your reading list
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Chat
            endpoint="/ai/ask"
            placeholder="What have I read about…?"
            suggestions={["What's new in AI agents this week?", "Summarise what I saved about Kubernetes."]}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All articles</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllArticles />
        </TabsContent>
        <TabsContent value="favorites">
          <ArticleGrid favorites />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AllArticles() {
  const { data, error } = useArticles(false);
  const [source, setSource] = useState<string | null>(null);
  if (error) return <p className="text-destructive">{error.message}</p>;
  if (!data) return <Skeleton className="h-64 rounded-xl" />;
  if (!data.length) return <p className="py-8 text-center text-muted-foreground">No articles yet. Try “Refresh now”.</p>;
  // data is newest first, so sources are ordered by their latest article
  const bySource = new Map<string, Article[]>();
  for (const a of data) bySource.set(a.source, [...(bySource.get(a.source) ?? []), a]);
  const shown = source ? [[source, bySource.get(source) ?? []] as const] : [...bySource];
  return (
    <div className="space-y-6" data-testid="articles-grid">
      <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap" role="group" aria-label="Filter by source">
        {[null, ...bySource.keys()].map((s) => (
          <Button
            key={s ?? "all"}
            size="sm"
            variant={source === s ? "default" : "outline"}
            aria-pressed={source === s}
            onClick={() => setSource(s)}
          >
            {s ?? "All sources"}
          </Button>
        ))}
      </div>
      {shown.map(([name, articles]) => (
        <SourceRow key={name} name={name} articles={articles} />
      ))}
    </div>
  );
}

function SourceRow({ name, articles }: { name: string; articles: Article[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{name}</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => scroll(-1)} aria-label={`Scroll ${name} left`}>
            <ChevronLeftIcon aria-hidden />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll(1)} aria-label={`Scroll ${name} right`}>
            <ChevronRightIcon aria-hidden />
          </Button>
        </div>
      </div>
      <ul ref={ref} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} className="w-72 shrink-0 snap-start" />
        ))}
      </ul>
    </section>
  );
}

function ArticleGrid({ favorites }: { favorites: boolean }) {
  const { data, error } = useArticles(favorites);
  if (error) return <p className="text-destructive">{error.message}</p>;
  if (!data) return <Skeleton className="h-64 rounded-xl" />;
  if (!data.length)
    return (
      <p className="py-8 text-center text-muted-foreground">
        {favorites ? "No favorites yet — star articles to keep them forever." : "No articles yet. Try “Refresh now”."}
      </p>
    );
  return (
    <ul className="grid gap-3 md:grid-cols-2" data-testid={favorites ? "favorites-grid" : "articles-grid"}>
      {data.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </ul>
  );
}

function ArticleCard({ article: a, className }: { article: Article; className?: string }) {
  const [loading, setLoading] = useState(false);

  async function summarize() {
    setLoading(true);
    try {
      await api(`/articles/${a.id}/summary`, { method: "POST" });
      await refreshArticles();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className={cn("flex flex-col gap-2 rounded-xl border bg-card p-4", className)} data-testid="article-card">
      <div className="flex items-start gap-2">
        <a href={a.url} target="_blank" rel="noreferrer" className="flex-1 font-medium leading-snug hover:text-primary">
          {a.title}
        </a>
        <StarButton article={a} />
      </div>
      <p className="text-xs text-muted-foreground">
        {a.source}
        {a.published_at && ` · ${new Date(a.published_at).toLocaleDateString()}`}
      </p>
      {a.ai_summary ? (
        <div className="space-y-1 rounded-lg bg-accent/60 p-3 text-sm [&_li]:ml-4 [&_ul]:list-disc">
          <ReactMarkdown>{a.ai_summary}</ReactMarkdown>
        </div>
      ) : (
        <>
          {a.excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>}
          <Button variant="ghost" size="sm" className="self-start" onClick={summarize} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" aria-hidden /> : <WandSparklesIcon aria-hidden />}
            Summarise with AI
          </Button>
        </>
      )}
    </li>
  );
}
