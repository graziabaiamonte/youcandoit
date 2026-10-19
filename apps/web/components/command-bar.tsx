"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRoadmap } from "@/lib/hooks";

/** Header search box; ⌘K / Ctrl+K opens a session finder (matches id or title). */
export function CommandBar() {
  const router = useRouter();
  const { data: tracks } = useRoadmap();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = tracks?.flatMap((t) => t.modules.flatMap((m) => m.sessions)) ?? [];
    return all.filter((s) => !q || s.id.startsWith(q) || s.title.toLowerCase().includes(q)).slice(0, 8);
  }, [tracks, query]);

  const go = (id: string) => {
    setOpen(false);
    router.push(`/session/${id}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground hover:border-primary/50 sm:max-w-md"
      >
        <span className="font-mono text-primary" aria-hidden>&gt;</span>
        <span className="truncate">Search sessions…</span>
        <kbd className="ml-auto hidden rounded border px-1.5 font-mono text-[11px] sm:inline">⌘K</kbd>
      </button>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          setQuery("");
          setActive(0);
        }}
      >
        <DialogContent showCloseButton={false} className="top-[20%] translate-y-0 gap-0 p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">Search sessions</DialogTitle>
          <DialogDescription className="sr-only">Type a session id or title, then press Enter.</DialogDescription>
          <div className="flex items-center gap-2 border-b px-3">
            <SearchIcon className="size-4 text-muted-foreground" aria-hidden />
            <Input
              autoFocus
              value={query}
              placeholder="5.6.4 or “replication”"
              aria-label="Search sessions"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
                else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
                else if (e.key === "Enter" && results[active]) go(results[active].id);
              }}
            />
          </div>
          <ul className="max-h-80 overflow-auto p-1" role="listbox" aria-label="Sessions">
            {!results.length && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matching session.</li>}
            {results.map((s, i) => (
              <li key={s.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${i === active ? "bg-accent" : ""}`}
                >
                  <span className="w-14 shrink-0 font-mono text-xs text-primary">{s.id}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
