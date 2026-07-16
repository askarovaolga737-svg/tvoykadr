export interface SlideData {
  title: string;
  subtitle?: string;
  content: string[];
  layout: "title" | "content" | "section" | "conclusion";
}

const TOPIC_SUFFIXES = [
  "история и развитие",
  "основные понятия",
  "ключевые аспекты",
  "современное состояние",
  "интересные факты",
  "применение на практике",
  "преимущества и недостатки",
  "тенденции и перспективы",
  "влияние на общество",
  "технологические решения",
  "известные примеры",
  "сравнительный анализ",
];

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generatePresentationContent(
  topic: string,
  slideCount: number
): SlideData[] {
  const slides: SlideData[] = [];
  const trimmedTopic = topic.trim();

  slides.push({
    title: trimmedTopic,
    subtitle: "Презентация",
    content: [],
    layout: "title",
  });

  const contentCount = slideCount - 2;

  const shuffled = [...TOPIC_SUFFIXES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < contentCount; i++) {
    const suffix = shuffled[i % shuffled.length];
    const bulletCount = 2 + Math.floor(Math.random() * 2);

    const bullets: string[] = [];
    for (let j = 0; j < bulletCount; j++) {
      bullets.push(
        `${capitalizeFirst(trimmedTopic)}: ${suffix} — аспект ${j + 1}`
      );
    }

    slides.push({
      title: `${capitalizeFirst(trimmedTopic)} — ${suffix}`,
      content: bullets,
      layout: i === 0 ? "section" : "content",
    });
  }

  slides.push({
    title: "Спасибо за внимание!",
    subtitle: trimmedTopic,
    content: [],
    layout: "conclusion",
  });

  return slides;
}

export const SLIDE_COLORS_WITHOUT_PHOTOS = [
  ["#6366f1", "#8b5cf6"],
  ["#ec4899", "#f43f5e"],
  ["#14b8a6", "#06b6d4"],
  ["#f59e0b", "#f97316"],
  ["#8b5cf6", "#d946ef"],
  ["#10b981", "#059669"],
  ["#3b82f6", "#6366f1"],
  ["#e11d48", "#db2777"],
  ["#0ea5e9", "#0284c7"],
  ["#84cc16", "#65a30d"],
];

export const SLIDE_ICONS = [
  "⭐",
  "💡",
  "🚀",
  "🎯",
  "📊",
  "🔬",
  "💎",
  "🌈",
  "🔥",
  "⚡",
  "🌟",
  "📈",
];
