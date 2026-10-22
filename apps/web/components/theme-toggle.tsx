"use client";

/*
 * ThemeToggle: il bottone "tavolozza" in alto a destra che fa scegliere il tema colore.
 *
 * Dove si trova: montato una sola volta in app/layout.tsx, dentro l'header della pagina.
 * Cosa usa:
 * - lib/themes.ts: l'elenco dei temi (THEMES), con id, nome e descrizione di ciascuno.
 * - components/providers.tsx: il ThemeProvider di next-themes che avvolge l'app. Lui salva
 *   la scelta in localStorage e scrive l'attributo data-theme sull'<html>, che attiva i
 *   colori CSS definiti in app/globals.css (blocchi [data-theme="..."]).
 * - components/ui/dropdown-menu.tsx e components/ui/button.tsx: componenti shadcn/ui
 *   (copiati nel progetto, costruiti sopra Radix UI) per il menu a tendina e il bottone.
 *
 * Concetti chiave:
 * - "use client" (prima riga): dice a Next che questo file gira nel browser. Di default i
 *   componenti sono Server Components; quelli con stato, hook o click devono essere client.
 *   Doc: https://nextjs.org/docs/app/api-reference/directives/use-client
 * - Hook: funzioni che iniziano con "use" e collegano il componente a uno stato o a un
 *   servizio (qui useTheme). Vanno chiamate solo ad alto livello dentro un componente.
 * - Componente: una funzione che restituisce JSX (HTML dentro JavaScript) da mostrare.
 * - Versioni del progetto: Next 16.4.2, React 19.3.0, next-themes 0.4.6, lucide-react 1.59.0.
 *   next-themes: documentazione nel README del repository pacocoursey/next-themes su GitHub.
 */
import { PaletteIcon } from "lucide-react";
// useTheme (next-themes): hook che restituisce il tema attivo e la funzione per cambiarlo.
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
import { THEMES } from "@/lib/themes";

// "export function": esporta il componente, così layout.tsx può importarlo con { ThemeToggle }.
export function ThemeToggle() {
  // Destructuring: estrae da useTheme() solo due valori. theme = id del tema attivo
  // ("plum", "midnight" o "campus"); setTheme = funzione che lo cambia e lo salva.
  const { theme, setTheme } = useTheme();
  // Il "return (" contiene il JSX del menu: è ciò che il componente mostra.
  return (
    // DropdownMenu (Radix): contenitore che gestisce apertura/chiusura del menu a tendina.
    <DropdownMenu>
      {/* asChild: il trigger non crea un proprio bottone ma passa il comportamento al figlio
          (il Button qui sotto), evitando un <button> dentro un altro <button>. */}
      <DropdownMenuTrigger asChild>
        {/* variant="ghost": stile senza sfondo; size="icon": bottone quadrato per sole icone;
            aria-label: nome letto dagli screen reader, perché il bottone non ha testo visibile. */}
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Change theme">
          {/* Icona della tavolozza (lucide-react). aria-hidden: la nasconde agli screen reader,
              che usano già aria-label del bottone. */}
          <PaletteIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      {/* Contenuto del menu che si apre. align="end": allineato al bordo destro del trigger. */}
      <DropdownMenuContent align="end" className="w-52">
        {/* Titolo non cliccabile del menu. */}
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {/* RadioGroup: gruppo di voci a scelta singola. value = tema attivo (segna il pallino),
            onValueChange = chiamata quando l'utente sceglie una voce: setTheme riceve l'id. */}
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {/* .map: trasforma ogni tema di THEMES in una voce di menu. Il JSX è una lista. */}
          {THEMES.map((t) => (
            // Una voce per tema. key={t.id}: React riconosce ogni voce tra un render e
            // l'altro (obbligatoria nelle liste). value={t.id}: va in setTheme alla scelta.
            <DropdownMenuRadioItem key={t.id} value={t.id} className="gap-3">
              {/* swatch: the theme's own tokens, scoped by data-theme */}
              {/* Pallino di anteprima. data-theme={t.id} applica i colori di QUEL tema solo
                  a questo span: ogni voce mostra i propri colori, anche se non è quella attiva. */}
              <span
                data-theme={t.id}
                className="grid size-6 shrink-0 place-items-center rounded-full border bg-background"
                aria-hidden
              >
                {/* Punto colorato interno con il colore primario del tema (classi Tailwind). */}
                <span className="size-3 rounded-full bg-primary" />
              </span>
              {/* Colonna con nome e descrizione (flex-col = elementi uno sotto l'altro). */}
              <span className="flex flex-col">
                {/* Nome del tema, es. "Plum". */}
                <span>{t.label}</span>
                {/* Descrizione breve, es. "Dark · gamified app"; text-xs = testo piccolo. */}
                <span className="text-xs text-muted-foreground">{t.hint}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// Fine del componente: la funzione è riutilizzabile ovunque, ma qui è montata solo nel layout.
