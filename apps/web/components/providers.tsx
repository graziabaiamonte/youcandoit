"use client";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { THEMES } from "@/lib/themes";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      themes={THEMES.map((t) => t.id)}
      defaultTheme="plum"
      enableSystem={false}
      // new key, so the old "light"/"dark"/"system" values don't leave an unknown theme
      storageKey="ycdi-theme"
      disableTransitionOnChange
    >
      <SWRConfig value={{ revalidateOnFocus: false }}>
        <TooltipProvider>{children}</TooltipProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
