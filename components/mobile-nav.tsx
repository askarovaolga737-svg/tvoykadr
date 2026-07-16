"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const navLinks: { href: string; label: string }[] = [
  { href: "/frames", label: "Рамки" },
  { href: "/templates", label: "Картинки" },
  { href: "/video-templates", label: "Видео-шаблоны" },
  { href: "/cartoons", label: "Мультфильмы" },
  { href: "/presentations", label: "Презентации" },
  { href: "/admin", label: "Админ" },
  { href: "/orders", label: "Монтаж" },
];

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-6">
          {navLinks.map((link) => (
            <SheetClose
              key={link.href}
              render={
                <Link
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-base font-medium min-h-[48px]"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
