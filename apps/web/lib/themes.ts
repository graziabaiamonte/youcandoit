/** The three palettes from Resources/UI; each is a `data-theme` block in globals.css. */
export const THEMES = [
  { id: "plum", label: "Plum", hint: "Dark · gamified app" },
  { id: "midnight", label: "Midnight", hint: "Dark · electric blue" },
  { id: "campus", label: "Campus", hint: "Light · navy" },
] as const;

/** For libraries that only know light/dark (Mermaid, React Flow). */
export const isDarkTheme = (theme?: string) => theme !== "campus";
