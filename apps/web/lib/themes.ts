// Questo file è l'elenco unico dei temi grafici dell'app. Non disegna nulla: contiene solo
// dati (i temi) e una piccola funzione di supporto.
//
// Dove viene usato:
// - components/providers.tsx: passa gli id a <ThemeProvider themes={...}> di next-themes,
//   che scrive data-theme="plum" | "midnight" | "campus" sull'elemento <html>.
// - components/theme-toggle.tsx: costruisce il menu di scelta trasformando THEMES con .map().
// - components/mermaid.tsx e components/learning-map.tsx: chiamano isDarkTheme per dire
//   alle librerie esterne (Mermaid, React Flow) se usare lo sfondo scuro o chiaro.
//
// Collegamento con il CSS: ogni id qui deve avere un blocco [data-theme="..."] in
// app/globals.css, altrimenti scegliere il tema non cambia i colori. TypeScript non controlla
// questo legame: va tenuto allineato a mano.
//
// Concetti TypeScript usati in questo file:
// - export: rende THEMES e isDarkTheme importabili da altri file, es.
//   import { THEMES } from "@/lib/themes". "@/" è un alias che indica la root di apps/web
//   (vedi "paths" in tsconfig.json).
// - Il tipo "string" dopo i due punti è un'annotazione: serve solo a TypeScript e sparisce
//   quando il codice viene trasformato in JavaScript.
// - Next.js 16 / React 19: questo file non usa API specifiche di Next.js, è TypeScript puro.
//   Riferimento: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

/** The three palettes from Resources/UI; each is a `data-theme` block in globals.css. */
export const THEMES = [
  // Elenco dei temi: ogni voce è un oggetto con id (valore tecnico, usato dal CSS e salvato
  // nel browser), label (nome mostrato nel menu) e hint (breve descrizione).
  { id: "plum", label: "Plum", hint: "Dark · gamified app" },
  { id: "midnight", label: "Midnight", hint: "Dark · electric blue" },
  { id: "campus", label: "Campus", hint: "Light · navy" },
  // as const: l'array diventa di sola lettura e ogni id ha il tipo letterale esatto ("plum", non
  // un generico string). Così THEMES[number]["id"] è l'unione "plum" | "midnight" | "campus" e
  // un id scritto male viene segnalato dal compilatore.
] as const;

// isDarkTheme: restituisce true se il tema è scuro. È scuro tutto tranne "campus", quindi
// anche undefined (tema non ancora letto) risulta scuro, come il defaultTheme "plum".
// (theme?: string): il "?" rende il parametro opzionale, può essere omesso o undefined.
// La scrittura "() => ..." è una arrow function: una funzione assegnata alla costante.
// Il confronto !== restituisce già true/false, senza bisogno di if.

/** For libraries that only know light/dark (Mermaid, React Flow). */
export const isDarkTheme = (theme?: string) => theme !== "campus";
