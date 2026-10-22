/**
 * ROOT LAYOUT (app/layout.tsx): il "guscio" di tutta l'applicazione.
 *
 * Cos'è un layout in Next.js (App Router): un componente che avvolge le pagine. Questo è il
 * layout RADICE: è l'unico che definisce <html> e <body>. Le pagine (app/page.tsx,
 * app/map/page.tsx, ...) non scrivono <html>: il loro contenuto arriva qui come `children`
 * e viene inserito dentro <main>. Next.js usa questo file in automatico: nessuno lo importa.
 *
 * Come si collega al resto del progetto:
 * - importa i componenti in components/ (sidebar, barra comandi, toggle tema, dialog di
 *   benvenuto, Toaster per le notifiche) e Providers (components/providers.tsx), che fornisce
 *   il tema (next-themes, attributo data-theme), SWR (cache delle chiamate all'API) e il
 *   TooltipProvider;
 * - importa globals.css (Tailwind v4 + variabili CSS dei temi): vale per tutto il sito;
 * - i font caricati qui diventano variabili CSS (--font-sans, --font-geist-mono,
 *   --font-display) che globals.css e le classi Tailwind usano.
 *
 * Concetti chiave:
 * - Server Component: questo file NON ha "use client" in cima, quindi gira sul server.
 *   I pezzi interattivi (Providers, Toaster, ...) sono Client Component con "use client".
 *   Doc: https://nextjs.org/docs/app/getting-started/layouts-and-pages
 * - Idratazione (hydration): il server manda HTML già pronto; poi React "risveglia" la pagina
 *   nel browser collegando il JavaScript. Se server e browser non concordano, React avvisa:
 *   per questo esiste suppressHydrationWarning (vedi sotto).
 */

// Tipo Metadata: la forma dell'oggetto con title/description che Next usa per l'<head>.
import type { Metadata } from "next";
// Font di Google: Next li scarica in fase di build (next/font) e li serve dal nostro dominio.
import { Inter, JetBrains_Mono, Unbounded } from "next/font/google";
// "@/" è un alias che punta alla cartella apps/web (vedi "paths" in tsconfig.json).
import { CommandBar } from "@/components/command-bar";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";
import { ThemeToggle } from "@/components/theme-toggle";
import { WelcomeDialog } from "@/components/welcome-dialog";
// Componenti della sidebar di shadcn/ui: contenitore, area principale e bottone apri/chiudi.
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// Toaster di shadcn/ui (basato su sonner): mostra i messaggi "toast" da qualunque componente.
import { Toaster } from "@/components/ui/sonner";
// Import di un file CSS (senza variabili): Next lo include nella pagina. Contiene Tailwind.
import "./globals.css";

// Ogni font è una funzione che restituisce un oggetto. "variable" crea una variabile CSS con
// quel nome; "subsets: ['latin']" scarica solo i caratteri latini (file più leggeri).
const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
// Font monospazio (per il codice). Il nome della variabile è --font-geist-mono, come
// atteso da globals.css: non va cambiato senza cambiare anche lì.
const jetbrainsMono = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Font per i titoli: globals.css lo mappa su --font-heading.
const unbounded = Unbounded({ variable: "--font-display", subsets: ["latin"] });

// "export const metadata": Next legge questo oggetto e genera <title> e <meta description>.
// È statico (valori fissi), quindi non serve una funzione generateMetadata.
export const metadata: Metadata = {
  title: "YouCanDoIt",
  description: "Your roadmap from junior developer to senior software engineer in AI and DevOps.",
};

// "export default": questo è il componente che Next usa per il layout radice.
// LayoutProps<"/">: tipo globale generato da Next (non va importato). "/" è la route: il root,
// quindi il layout vale per tutto il sito. { children } estrae la prop con il contenuto
// della pagina.
export default function RootLayout({ children }: LayoutProps<"/">) {
  // Il "return (" contiene il JSX: HTML scritto dentro JavaScript che descrive la pagina finale.
  return (
    // <html lang="en">: lingua del documento (usata da screen reader, traduzioni e SEO).
    // className: classi sull'html, cioè le variabili dei font + "antialiased" (testo più liscio).
    // suppressHydrationWarning: next-themes aggiunge data-theme all'html prima che React parta,
    // quindi server e browser differiscono su questo tag; così l'avviso viene zittito.
    // Doc: https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${unbounded.variable} antialiased`} suppressHydrationWarning>
      <body>
        {/* Providers: avvolge tutta l'app con tema, cache SWR e tooltip
            (components/providers.tsx) */}
        <Providers>
          {/* SidebarProvider: condivide con i figli lo stato della sidebar (aperta o chiusa) */}
          <SidebarProvider>
            {/* menu laterale di navigazione tra le sezioni del roadmap */}
            <AppSidebar />
            {/* SidebarInset: l'area principale affiancata alla sidebar */}
            <SidebarInset>
              {/* header: barra in alto "sticky" (resta visibile allo scroll). z-10 la tiene sopra
                  il contenuto; bg-background/80 + backdrop-blur = sfondo semitrasparente sfocato;
                  h-12 altezza, px-4 padding laterale, border-b linea sotto */}
              <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
                {/* SidebarTrigger: bottone per aprire/chiudere la sidebar */}
                <SidebarTrigger />
                {/* barra dei comandi (componente CommandBar) */}
                <CommandBar />
                {/* ml-auto: margine sinistro automatico, spinge il toggle del tema a destra */}
                <div className="ml-auto">
                  {/* selettore del tema colore (salvato in localStorage da next-themes) */}
                  <ThemeToggle />
                </div>
              </header>
              {/* a visible data-fullbleed root (the map) gets the whole area below the header; cacheComponents
                  keeps left pages in the DOM with an inline display:none, so those must not count */}
              {/* <main>: area del contenuto. Le pagine vengono inserite qui tramite {children}.
                  Classi Tailwind: mx-auto centra, max-w-5xl limita la larghezza, px/py = padding,
                  md: = schermi medi in su. has-[...] = variante arbitraria: se una pagina ha
                  un figlio data-fullbleed visibile (es. la mappa), toglie il limite di
                  larghezza e il padding */}
              <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 has-[[data-fullbleed]:not([style*=none])]:max-w-none has-[[data-fullbleed]:not([style*=none])]:p-0">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          {/* dialog di benvenuto con la citazione iniziale (components/welcome-dialog.tsx) */}
          <WelcomeDialog />
          {/* Toaster: contenitore dei toast (notifiche brevi); richColors = colori più vivaci */}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
