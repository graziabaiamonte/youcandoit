"use client";

import { StarIcon } from "lucide-react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { api, type Article } from "@/lib/api";
import { cn } from "@/lib/utils";

export function StarButton({ article, className }: { article: Article; className?: string }) {
  const { mutate } = useSWRConfig();
  const starred = Boolean(article.favorite_at);

  async function toggle() {
    try {
      await api(`/articles/${article.id}/favorite`, { method: starred ? "DELETE" : "PUT" });
      await mutate((key) => typeof key === "string" && key.startsWith("/articles"));
      if (!starred) toast.success("Saved to favorites — the full article is being indexed for RAG.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={starred}
      aria-label={starred ? `Remove "${article.title}" from favorites` : `Save "${article.title}" to favorites`}
      className={cn(
        "shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-streak focus-visible:outline-2",
        starred && "text-streak",
        className,
      )}
    >
      <StarIcon className={cn("size-4", starred && "fill-current")} aria-hidden />
    </button>
  );
}
