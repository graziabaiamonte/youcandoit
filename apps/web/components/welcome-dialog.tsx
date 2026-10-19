"use client";

import { useEffect, useState } from "react";
import { FlameIcon, QuoteIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, type Quote } from "@/lib/api";
import { useStats } from "@/lib/hooks";

const SEEN_KEY = "ycdi:welcome-seen";

/** A random motivational quote, shown once per browser session when the app opens. */
export function WelcomeDialog() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [open, setOpen] = useState(false);
  const { data: stats } = useStats();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      // storage blocked: just show the dialog
    }
    api<Quote>("/quotes/random")
      .then((q) => {
        setQuote(q);
        setOpen(true);
      })
      .catch(() => {});
  }, []);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-lg" data-testid="welcome-dialog">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium text-muted-foreground">Welcome back</DialogTitle>
          <DialogDescription className="sr-only">Motivational quote of the day</DialogDescription>
        </DialogHeader>
        {quote && (
          <figure className="space-y-3">
            <QuoteIcon className="size-7 text-primary" aria-hidden />
            <blockquote className="text-xl leading-relaxed font-medium text-balance">{quote.text}</blockquote>
            <figcaption className="text-sm text-muted-foreground">— {quote.author}</figcaption>
          </figure>
        )}
        {stats && (
          <div className="flex gap-3 text-sm">
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-streak">
              <FlameIcon className="size-4" aria-hidden /> {stats.streak}-day streak
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-xp">
              <SparklesIcon className="size-4" aria-hidden /> Level {stats.level} · {stats.xp} XP
            </span>
          </div>
        )}
        <DialogFooter>
          <Button onClick={close} autoFocus>
            Let&apos;s study
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
