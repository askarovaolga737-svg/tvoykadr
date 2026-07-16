import { isDatabaseAvailable } from "@/lib/db";
import { getContentByType } from "@/lib/models";
import { mockContentItems } from "@/lib/mock-data";
import type { ContentItem } from "@/lib/models";
import { CartoonStudio } from "@/components/cartoon-studio";

export const dynamic = "force-dynamic";

async function getCartoonTemplates(): Promise<ContentItem[]> {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      return await getContentByType("cartoon_template");
    } catch (error) {
      console.error("Ошибка получения мульт-шаблонов:", error);
    }
  }

  return mockContentItems.filter((item) => item.type === "cartoon_template");
}

export default async function CartoonsPage() {
  const templates = await getCartoonTemplates();

  return (
    <div className="min-h-[calc(100vh-9rem)]">
      <section className="gradient-hero-vibrant pattern-grid px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
            Мини-мультфильмы
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
            Выберите мульт-шаблон, загрузите своё фото и получите анимированный
            мини-мультфильм со своим лицом
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 -mt-10 pb-20">
        <CartoonStudio templates={templates} />
      </section>
    </div>
  );
}
