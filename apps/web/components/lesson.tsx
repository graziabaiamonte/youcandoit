"use client";

import type { Element, Root } from "hast";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { FlaskConicalIcon, InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Mermaid } from "@/components/mermaid";
import { cn } from "@/lib/utils";

const CALLOUTS = {
  note: { label: "Note", Icon: InfoIcon, className: "border-l-primary bg-accent/50", accent: "text-primary" },
  tip: { label: "Tip", Icon: LightbulbIcon, className: "border-l-success bg-success/5", accent: "text-success" },
  warning: { label: "Warning", Icon: TriangleAlertIcon, className: "border-l-destructive bg-destructive/5", accent: "text-destructive" },
  example: { label: "Example", Icon: FlaskConicalIcon, className: "border-l-track bg-track/5", accent: "text-track" },
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
  blockquote({ node, children, ...props }) {
    const c = CALLOUTS[node?.properties.dataCallout as keyof typeof CALLOUTS];
    if (!c) return <blockquote {...props}>{children}</blockquote>;
    return (
      <Card className={cn("my-6 border-l-4", c.className)}>
        <CardContent className="flex gap-3">
          <c.Icon className={cn("mt-1 size-5 shrink-0", c.accent)} aria-hidden />
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
