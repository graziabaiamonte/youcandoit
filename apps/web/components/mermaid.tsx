"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

/** Renders a Mermaid diagram client-side; mermaid is lazy-loaded so it never bloats other pages. */
export function Mermaid({ chart, label }: { chart: string; label: string }) {
  const [svg, setSvg] = useState("");
  const id = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        securityLevel: "strict",
      });
      try {
        const { svg } = await mermaid.render(`m${id}`, chart);
        if (!cancelled) setSvg(svg);
      } catch {
        if (!cancelled) setSvg("");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  return (
    <div
      role="img"
      aria-label={label}
      className="overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
      // mermaid output is generated locally from our own outline with securityLevel "strict"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
