import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Shield,
  Scissors,
  Presentation,
  Frame,
  ImageIcon,
  Clapperboard,
  Film,
} from "lucide-react";
import { BridgeProvider } from "@/components/bridge-provider";
import { Toaster } from "@/components/ui/sonner";
import { FeedbackForm } from "@/components/feedback-form";
import { MobileNav } from "@/components/mobile-nav";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const appName = "ТвойКадр";

export const metadata: Metadata = {
  title: appName,
  description: appName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("font-sans", geist.variable)}>
      <body className="antialiased min-h-screen bg-background flex flex-col">
        <BridgeProvider />
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center gap-2">
            <Link
              href="/"
              className="group flex items-center gap-2 text-base sm:text-lg font-semibold tracking-tight transition-all duration-300 hover:scale-105 shrink-0"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-violet-500/40">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-violet-500 group-hover:to-pink-400">
                {appName}
              </span>
            </Link>
            <div className="hidden sm:block">
              <FeedbackForm />
            </div>
            <nav className="hidden md:flex ml-auto items-center gap-1 lg:gap-4">
              <Link
                href="/frames"
                className="flex items-center gap-1.5 text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                <Frame className="h-3.5 w-3.5" />
                Рамки
              </Link>
              <Link
                href="/templates"
                className="flex items-center gap-1.5 text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Картинки
              </Link>
              <Link
                href="/video-templates"
                className="flex items-center gap-1.5 text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                <Film className="h-3.5 w-3.5" />
                Видео-шаблоны
              </Link>
              <Link
                href="/cartoons"
                className="flex items-center gap-1.5 text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                <Clapperboard className="h-3.5 w-3.5" />
                Мультфильмы
              </Link>
              <Link
                href="/presentations"
                className="flex items-center gap-1.5 text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                <Presentation className="h-3.5 w-3.5" />
                Презентации
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                <Shield className="h-3.5 w-3.5" />
                Админ
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-1.5 text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                <Scissors className="h-3.5 w-3.5" />
                Монтаж
              </Link>
            </nav>
            <MobileNav />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t">
          <div className="container mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {appName}
          </div>
        </footer>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
