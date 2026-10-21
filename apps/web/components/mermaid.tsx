"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";
import { isDarkTheme } from "@/lib/themes";

/** Renders a Mermaid diagram client-side; mermaid is lazy-loaded so it never bloats other pages. */
export function Mermaid({ chart, label }: { chart: string; label: string }) {
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);
  const id = useId().replace(/[^\w-]/g, "");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDarkTheme(resolvedTheme) ? "dark" : "default",
          securityLevel: "strict",
          // measure labels in the app's font, so text fits its boxes
          fontFamily: getComputedStyle(document.body).fontFamily,
          // SVG labels: Mermaid's HTML labels only wrap when a measured width equals the max exactly,
          // which fails at fractional browser zoom (90%, 110%…) and leaves text cut off
          htmlLabels: false,
        });
        const { svg } = await mermaid.render(`m${id}`, chart);
        if (!cancelled) {
          setSvg(svg);
          setFailed(false);
        }
      } catch {
        // an unparseable chart, or the mermaid chunk failed to load
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  // a chart Mermaid can't parse shows its source instead of an empty gap
  if (failed) return <pre className="overflow-x-auto text-sm">{chart}</pre>;

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
