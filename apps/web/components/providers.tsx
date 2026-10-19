"use client";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SWRConfig value={{ revalidateOnFocus: false }}>
        <TooltipProvider>{children}</TooltipProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
