"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { Loader2Icon, MessagesSquareIcon, RefreshCwIcon, WandSparklesIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Chat } from "@/components/chat";
import { StarButton } from "@/components/star-button";
import { api, type Article } from "@/lib/api";
import { useArticles } from "@/lib/hooks";

export default function NewsPage() {
  const { mutate } = useSWRConfig();
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    try {
      const { new: count } = await api<{ new: number }>("/articles/refresh", { method: "POST" });
      await mutate((key) => typeof key === "string" && key.startsWith("/articles"));
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
          <ArticleGrid favorites={false} />
        </TabsContent>
        <TabsContent value="favorites">
          <ArticleGrid favorites />
        </TabsContent>
      </Tabs>
    </div>
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

function ArticleCard({ article: a }: { article: Article }) {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  async function summarize() {
    setLoading(true);
    try {
      await api(`/articles/${a.id}/summary`, { method: "POST" });
      await mutate((key) => typeof key === "string" && key.startsWith("/articles"));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className="flex flex-col gap-2 rounded-xl border bg-card p-4" data-testid="article-card">
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
