import Link from "next/link";
import {
  Frame,
  ImageIcon,
  Scissors,
  Clapperboard,
  ArrowRight,
  Presentation,
} from "lucide-react";
import { HeroIllustration } from "@/components/hero-illustration";

const categories: {
  title: string;
  description: string;
  icon: typeof Frame;
  href?: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  hoverGradient: string;
}[] = [
  {
    title: "Рамки",
    description: "Наложите красивую рамку на ваше фото и скачайте результат",
    icon: Frame,
    href: "/frames",
    gradient: "from-violet-100 to-purple-100",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    hoverGradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    title: "Картинки",
    description:
      "Выберите шаблон, добавьте свой текст и получите готовую картинку",
    icon: ImageIcon,
    href: "/templates",
    gradient: "from-pink-100 to-rose-100",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    hoverGradient: "from-pink-500/10 to-rose-500/10",
  },
  {
    title: "Мультфильмы",
    description: "Загрузите своё фото и получите мини-мультфильм с вашим лицом",
    icon: Clapperboard,
    href: "/cartoons",
    gradient: "from-orange-100 to-rose-100",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    hoverGradient: "from-orange-500/10 to-rose-500/10",
  },
  {
    title: "Монтаж",
    description: "Закажите монтаж ваших фото и видео у профессионалов",
    icon: Scissors,
    href: "/orders",
    gradient: "from-emerald-100 to-teal-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    hoverGradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    title: "Презентации",
    description:
      "Введите тему и получите готовую презентацию с фото или цветными слайдами",
    icon: Presentation,
    href: "/presentations",
    gradient: "from-violet-100 to-indigo-100",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    hoverGradient: "from-violet-500/10 to-indigo-500/10",
  },
  {
    title: "Видео-шаблоны",
    description:
      "Выберите шаблон, добавьте свой текст и скачайте готовое видео",
    icon: Clapperboard,
    href: "/video-templates",
    gradient: "from-cyan-100 to-sky-100",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    hoverGradient: "from-cyan-500/10 to-sky-500/10",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-9rem)]">
      <section className="gradient-hero-vibrant pattern-grid px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center gap-8 sm:gap-12 lg:gap-16 justify-center">
          <HeroIllustration />
          <div className="text-center sm:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              ТвойКадр
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Творческая платформа для создания уникальных фото, картинок и
              видео
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 -mt-10 pb-20">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const Card = cat.href ? Link : "div";
            return (
              <Card
                key={cat.title}
                href={cat.href ?? "#"}
                className="group rounded-2xl bg-card ring-1 ring-foreground/5 overflow-hidden card-hover animate-in fade-in slide-in-from-bottom-4 duration-700 block"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`aspect-[4/3] bg-gradient-to-br ${cat.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div
                    className={`h-24 w-24 rounded-2xl ${cat.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-500`}
                  >
                    <Icon className={`h-12 w-12 ${cat.iconColor}`} />
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    Перейти <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
