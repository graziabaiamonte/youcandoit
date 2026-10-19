import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CommandBar } from "@/components/command-bar";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouCanDoIt",
  description: "Your roadmap from junior developer to senior software engineer in AI and DevOps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
      <body>
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
                <SidebarTrigger />
                <CommandBar />
              </header>
              <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <WelcomeDialog />
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
