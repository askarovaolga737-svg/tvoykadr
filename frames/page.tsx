import { isDatabaseAvailable } from "@/lib/db";
import { getContentByType } from "@/lib/models";
import { mockContentItems } from "@/lib/mock-data";
import type { ContentItem } from "@/lib/models";
import { FrameStudio } from "@/components/frame-studio";

export const dynamic = "force-dynamic";

async function getFrames(): Promise<ContentItem[]> {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      return await getContentByType("frame");
    } catch (error) {
      console.error("Ошибка получения рамок:", error);
    }
  }

  return mockContentItems.filter((item) => item.type === "frame");
}

export default async function FramesPage() {
  const frames = await getFrames();

  return (
    <div className="min-h-[calc(100vh-9rem)]">
      <section className="gradient-hero-vibrant pattern-grid px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            Галерея рамок
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
            Выберите рамку, загрузите своё фото и скачайте результат
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 -mt-10 pb-20">
        <FrameStudio frames={frames} />
      </section>
    </div>
  );
}
