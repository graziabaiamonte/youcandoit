"use client";

import { PaletteIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** The three palettes from Resources/UI; each is a `data-theme` block in globals.css. */
export const THEMES = [
  { id: "plum", label: "Plum", hint: "Dark · gamified app" },
  { id: "midnight", label: "Midnight", hint: "Dark · electric blue" },
  { id: "campus", label: "Campus", hint: "Light · navy" },
] as const;

/** For libraries that only know light/dark (Mermaid, React Flow). */
export const isDarkTheme = (theme?: string) => theme !== "campus";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Change theme">
          <PaletteIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {THEMES.map((t) => (
            <DropdownMenuRadioItem key={t.id} value={t.id} className="gap-3">
              {/* swatch: the theme's own tokens, scoped by data-theme */}
              <span
                data-theme={t.id}
                className="grid size-6 shrink-0 place-items-center rounded-full border bg-background"
                aria-hidden
              >
                <span className="size-3 rounded-full bg-primary" />
              </span>
              <span className="flex flex-col">
                <span>{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.hint}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
