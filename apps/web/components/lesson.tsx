"use client";

import type { Element, Root } from "hast";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { FlaskConicalIcon, InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Mermaid } from "@/components/mermaid";
import { cn } from "@/lib/utils";

const CALLOUTS = {
  // each type differs by background tint and icon; the icon sits in a stronger tint of the same colour
  note: { label: "Note", Icon: InfoIcon, className: "bg-primary/12", chip: "bg-primary/24", accent: "text-primary" },
  tip: { label: "Tip", Icon: LightbulbIcon, className: "bg-success/12", chip: "bg-success/24", accent: "text-success" },
  warning: { label: "Warning", Icon: TriangleAlertIcon, className: "bg-destructive/12", chip: "bg-destructive/24", accent: "text-destructive" },
  example: { label: "Example", Icon: FlaskConicalIcon, className: "bg-track/12", chip: "bg-track/24", accent: "text-track" },
};
const MARKER = /^\[!(NOTE|TIP|WARNING|EXAMPLE)\]\s*/;

/** Rehype plugin: a blockquote starting with `[!NOTE]` etc. loses the marker and gets `dataCallout`. */
function rehypeCallouts() {
  const walk = (node: Root | Element) => {
    for (const child of node.children) {
      if (child.type !== "element") continue;
      if (child.tagName === "blockquote") {
        const p = child.children.find((c) => c.type === "element");
        const text = p?.type === "element" ? p.children[0] : undefined;
        const m = text?.type === "text" ? MARKER.exec(text.value) : null;
        if (m && text?.type === "text") {
          text.value = text.value.slice(m[0].length);
          child.properties.dataCallout = m[1].toLowerCase();
        }
      }
      walk(child);
    }
  };
  return walk;
}

const components: Components = {
  pre({ node, children, ...props }) {
    const code = node?.children[0];
    if (code?.type === "element" && code.tagName === "code") {
      const cls = code.properties.className;
      const lang = Array.isArray(cls) ? String(cls[0]) : "";
      const text = code.children[0]?.type === "text" ? code.children[0].value : "";
      if (lang === "language-mermaid")
        return (
          <div className="not-prose my-6">
            <Mermaid chart={text} label="Lesson diagram" />
          </div>
        );
    }
    return <pre {...props}>{children}</pre>;
  },
  // wide tables scroll inside their own box instead of the page on phones
  table({ children }) {
    return (
      <div className="overflow-x-auto">
        <table>{children}</table>
      </div>
    );
  },
  blockquote({ node, children, ...props }) {
    const c = CALLOUTS[node?.properties.dataCallout as keyof typeof CALLOUTS];
    if (!c) return <blockquote {...props}>{children}</blockquote>;
    return (
      <Card className={cn("my-6", c.className)}>
        <CardContent className="flex gap-3">
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", c.chip, c.accent)} aria-hidden>
            <c.Icon className="size-5" />
          </span>
          <div className="min-w-0 [&>:last-child]:mb-0 [&>p:nth-child(2)]:mt-1">
            <p className={cn("not-prose text-sm font-semibold", c.accent)}>{c.label}</p>
            {children}
          </div>
        </CardContent>
      </Card>
    );
  },
};

/** A session's lesson: Markdown with GFM, colour-coded callouts and Mermaid diagrams. */
export function Lesson({ markdown }: { markdown: string }) {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeCallouts]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
