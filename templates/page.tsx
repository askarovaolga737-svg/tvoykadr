import { isDatabaseAvailable } from "@/lib/db";
import { getContentByType } from "@/lib/models";
import { mockContentItems } from "@/lib/mock-data";
import type { ContentItem } from "@/lib/models";
import { TemplateStudio } from "@/components/template-studio";

export const dynamic = "force-dynamic";

async function getTemplates(): Promise<ContentItem[]> {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      return await getContentByType("image");
    } catch (error) {
      console.error("Ошибка получения шаблонов:", error);
    }
  }

  return mockContentItems.filter((item) => item.type === "image");
}

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="min-h-[calc(100vh-9rem)]">
      <section className="gradient-hero-vibrant pattern-grid px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            Генерация картинок
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
            Выберите шаблон, введите свой текст и скачайте готовую картинку
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 -mt-10 pb-20">
        <TemplateStudio templates={templates} />
      </section>
    </div>
  );
}
