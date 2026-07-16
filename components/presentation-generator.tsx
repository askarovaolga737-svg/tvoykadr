"use client";

import { useState, useRef, useCallback } from "react";
import {
  Download,
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Palette,
  Sparkles,
  FileDown,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  generatePresentationContent,
  SLIDE_COLORS_WITHOUT_PHOTOS,
  SLIDE_ICONS,
} from "@/lib/presentation-content";
import type { SlideData } from "@/lib/presentation-content";

const CANVAS_W = 1920;
const CANVAS_H = 1080;

function getSlideImageUrl(topic: string, index: number): string {
  const seed = encodeURIComponent(`${topic}-slide-${index}`.toLowerCase());
  return `https://picsum.photos/seed/${seed}/${CANVAS_W}/${CANVAS_H}`;
}

function drawSlideOnCanvas(
  ctx: CanvasRenderingContext2D,
  slide: SlideData,
  index: number,
  total: number,
  style: "withPhotos" | "withoutPhotos",
  topic: string,
  bgImage: HTMLImageElement | null
) {
  const w = CANVAS_W;
  const h = CANVAS_H;

  ctx.clearRect(0, 0, w, h);

  if (style === "withPhotos" && bgImage) {
    const scale = Math.max(w / bgImage.naturalWidth, h / bgImage.naturalHeight);
    const sw = bgImage.naturalWidth * scale;
    const sh = bgImage.naturalHeight * scale;
    const sx = (w - sw) / 2;
    const sy = (h - sh) / 2;
    ctx.drawImage(bgImage, sx, sy, sw, sh);

    const grad = ctx.createLinearGradient(0, h * 0.5, 0, h);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.75)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);
  } else if (style === "withoutPhotos") {
    const colors =
      SLIDE_COLORS_WITHOUT_PHOTOS[index % SLIDE_COLORS_WITHOUT_PHOTOS.length];
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const patternGrad = ctx.createRadialGradient(
      w * 0.8,
      h * 0.2,
      0,
      w * 0.8,
      h * 0.2,
      w * 0.6
    );
    patternGrad.addColorStop(0, "rgba(255,255,255,0.08)");
    patternGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = patternGrad;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  const boxX = w * 0.08;
  const boxY =
    slide.layout === "title" || slide.layout === "conclusion"
      ? h * 0.35
      : h * 0.2;
  const boxW = w * 0.84;
  const boxH = slide.layout === "content" ? h * 0.55 : h * 0.4;
  const radius = 24;

  ctx.beginPath();
  ctx.moveTo(boxX + radius, boxY);
  ctx.lineTo(boxX + boxW - radius, boxY);
  ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + radius);
  ctx.lineTo(boxX + boxW, boxY + boxH - radius);
  ctx.quadraticCurveTo(
    boxX + boxW,
    boxY + boxH,
    boxX + boxW - radius,
    boxY + boxH
  );
  ctx.lineTo(boxX + radius, boxY + boxH);
  ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - radius);
  ctx.lineTo(boxX, boxY + radius);
  ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#333";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  if (style === "withoutPhotos") {
    const icon = SLIDE_ICONS[index % SLIDE_ICONS.length];
    const iconSize =
      slide.layout === "title" || slide.layout === "conclusion" ? 80 : 56;
    ctx.font = `${iconSize}px serif`;
    ctx.fillText(
      icon,
      w / 2,
      boxY -
        (slide.layout === "title" || slide.layout === "conclusion" ? 80 : 60)
    );
  }

  if (slide.layout === "title") {
    ctx.fillStyle = "#1a1a2e";
    ctx.font = `bold 64px "Inter", "Geist", sans-serif`;
    ctx.fillText(slide.title, w / 2, boxY + boxH * 0.4);

    if (slide.subtitle) {
      ctx.fillStyle = "#888";
      ctx.font = `28px "Inter", "Geist", sans-serif`;
      ctx.fillText(slide.subtitle, w / 2, boxY + boxH * 0.65);
    }
  } else if (slide.layout === "conclusion") {
    ctx.fillStyle = "#1a1a2e";
    ctx.font = `bold 56px "Inter", "Geist", sans-serif`;
    ctx.fillText(slide.title, w / 2, boxY + boxH * 0.4);

    if (slide.subtitle) {
      ctx.fillStyle = "#888";
      ctx.font = `28px "Inter", "Geist", sans-serif`;
      ctx.fillText(slide.subtitle, w / 2, boxY + boxH * 0.65);
    }
  } else {
    ctx.fillStyle = "#1a1a2e";
    ctx.font = `bold 42px "Inter", "Geist", sans-serif`;
    ctx.fillText(slide.title, w / 2, boxY + boxH * 0.18);

    ctx.textAlign = "left";
    ctx.fillStyle = "#555";
    ctx.font = `30px "Inter", "Geist", sans-serif`;

    const startY = boxY + boxH * 0.35;
    const lineH = 52;
    const bulletX = boxX + 80;

    slide.content.forEach((line, i) => {
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.arc(bulletX - 20, startY + i * lineH - 4, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#555";
      ctx.fillText(line, bulletX, startY + i * lineH);
    });
  }

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.font = `18px "Inter", "Geist", sans-serif`;
  ctx.fillText(`${index + 1} / ${total}`, w - 48, h - 24);
}

export function PresentationGenerator() {
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(5);
  const [style, setStyle] = useState<"withPhotos" | "withoutPhotos">(
    "withPhotos"
  );
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bgImages, setBgImages] = useState<Record<number, HTMLImageElement>>(
    {}
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const hasResults = slides.length > 0;

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error("Введите тему презентации");
      return;
    }

    setIsGenerating(true);
    setCurrentSlide(0);
    setBgImages({});
    setImagesLoaded(false);

    const generated = generatePresentationContent(topic, slideCount);
    setSlides(generated);

    if (style === "withPhotos") {
      const imgs: Record<number, HTMLImageElement> = {};
      let loaded = 0;
      const total = generated.length;

      await new Promise<void>((resolve) => {
        generated.forEach((_, i) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            imgs[i] = img;
            loaded++;
            if (loaded >= total) {
              setBgImages({ ...imgs });
              setImagesLoaded(true);
              resolve();
            }
          };
          img.onerror = () => {
            loaded++;
            if (loaded >= total) {
              setBgImages({ ...imgs });
              setImagesLoaded(true);
              resolve();
            }
          };
          img.src = getSlideImageUrl(topic, i);
        });
      });
    } else {
      setImagesLoaded(true);
    }

    setIsGenerating(false);
    toast.success(`Презентация «${topic}» готова`);
  }, [topic, slideCount, style]);

  const handleDownloadSlide = useCallback(
    (slideIndex: number) => {
      const slide = slides[slideIndex];
      if (!slide) return;

      const canvas = hiddenCanvasRef.current;
      if (!canvas) return;

      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      drawSlideOnCanvas(
        ctx,
        slide,
        slideIndex,
        slides.length,
        style,
        topic,
        bgImages[slideIndex] || null
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Ошибка при создании изображения");
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `slide-${slideIndex + 1}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Слайд ${slideIndex + 1} сохранён`);
      }, "image/png");
    },
    [slides, style, topic, bgImages]
  );

  const handleDownloadAll = useCallback(async () => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas || slides.length === 0) return;

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const toastId = toast.loading("Подготовка слайдов...");

    for (let i = 0; i < slides.length; i++) {
      await new Promise<void>((resolve) => {
        if (style === "withPhotos" && !bgImages[i]) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            drawSlideOnCanvas(
              ctx,
              slides[i],
              i,
              slides.length,
              style,
              topic,
              img
            );
            downloadCanvasAsBlob(canvas, i);
            resolve();
          };
          img.onerror = () => {
            drawSlideOnCanvas(
              ctx,
              slides[i],
              i,
              slides.length,
              style,
              topic,
              null
            );
            downloadCanvasAsBlob(canvas, i);
            resolve();
          };
          img.src = getSlideImageUrl(topic, i);
        } else {
          drawSlideOnCanvas(
            ctx,
            slides[i],
            i,
            slides.length,
            style,
            topic,
            bgImages[i] || null
          );
          downloadCanvasAsBlob(canvas, i);
          resolve();
        }
      });
    }

    toast.success("Все слайды сохранены", { id: toastId });
  }, [slides, style, topic, bgImages]);

  function downloadCanvasAsBlob(canvas: HTMLCanvasElement, index: number) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `slide-${index + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const renderSlidePreview = (slide: SlideData, index: number) => {
    const isFirstOrLast =
      slide.layout === "title" || slide.layout === "conclusion";

    if (style === "withPhotos") {
      const imgUrl = getSlideImageUrl(topic, index);
      return (
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl"
          style={{ aspectRatio: "16/9" }}
        >
          <img
            src={imgUrl}
            alt={`Слайд ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative z-10 w-full px-8 md:px-16">
            <div className="bg-white/95 rounded-2xl p-6 md:p-10 shadow-xl mx-auto max-w-3xl">
              {isFirstOrLast ? (
                <div className="text-center space-y-3">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl text-gray-500">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center">
                    {slide.title}
                  </h2>
                  <ul className="space-y-3">
                    {slide.content.map((line, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-base md:text-lg text-gray-600"
                      >
                        <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-violet-500 shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    const colors =
      SLIDE_COLORS_WITHOUT_PHOTOS[index % SLIDE_COLORS_WITHOUT_PHOTOS.length];
    const icon = SLIDE_ICONS[index % SLIDE_ICONS.length];

    return (
      <div
        className="relative w-full flex items-center justify-center overflow-hidden rounded-xl"
        style={{
          aspectRatio: "16/9",
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        }}
      >
        <div
          className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.3), transparent)",
          }}
        />
        <div className="relative z-10 w-full px-8 md:px-16">
          <div className="bg-white/95 rounded-2xl p-6 md:p-10 shadow-xl mx-auto max-w-3xl">
            <div className="text-center mb-4">
              <span className="text-5xl md:text-6xl">{icon}</span>
            </div>
            {isFirstOrLast ? (
              <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl text-gray-500">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center">
                  {slide.title}
                </h2>
                <ul className="space-y-3">
                  {slide.content.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base md:text-lg text-gray-600"
                    >
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-white/80 shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-3 right-4 text-xs font-medium text-white/60">
          {index + 1} / {slides.length}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg">
            <FileDown className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Генератор презентаций
          </h1>
        </div>
        <p className="text-muted-foreground">
          Введите тему, выберите количество слайдов и стиль — и получите готовую
          презентацию для скачивания
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">
                Тема презентации
              </label>
              <Input
                id="topic"
                placeholder="Например: Искусственный интеллект"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slide-count" className="text-sm font-medium">
                Количество слайдов
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSlideCount((c) => Math.max(3, c - 1))}
                  disabled={slideCount <= 3}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold tabular-nums min-w-8 text-center">
                  {slideCount}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSlideCount((c) => Math.min(10, c + 1))}
                  disabled={slideCount >= 10}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Стиль</label>
              <div className="flex gap-2">
                <Button
                  variant={style === "withPhotos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStyle("withPhotos")}
                  className="gap-2 flex-1"
                >
                  <ImageIcon className="h-4 w-4" />С фото
                </Button>
                <Button
                  variant={style === "withoutPhotos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStyle("withoutPhotos")}
                  className="gap-2 flex-1"
                >
                  <Palette className="h-4 w-4" />
                  Без фото
                </Button>
              </div>
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                size="lg"
                className="gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isGenerating ? "Генерация..." : "Сгенерировать"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasResults && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Предпросмотр</h2>
              <Badge variant="secondary" className="text-xs">
                {currentSlide + 1} / {slides.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setCurrentSlide((c) => Math.max(0, c - 1))}
                disabled={currentSlide === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setCurrentSlide((c) => Math.min(slides.length - 1, c + 1))
                }
                disabled={currentSlide >= slides.length - 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0 bg-muted/30">
              {!imagesLoaded && style === "withPhotos" ? (
                <div
                  className="flex items-center justify-center"
                  style={{ aspectRatio: "16/9" }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                    <p className="text-sm text-muted-foreground">
                      Загрузка изображений...
                    </p>
                  </div>
                </div>
              ) : (
                renderSlidePreview(slides[currentSlide], currentSlide)
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? "w-8 bg-violet-500"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleDownloadSlide(currentSlide)}
                disabled={!imagesLoaded && style === "withPhotos"}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Скачать слайд {currentSlide + 1}
              </Button>
              <Button
                onClick={handleDownloadAll}
                disabled={!imagesLoaded && style === "withPhotos"}
                className="gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white"
              >
                <FileDown className="h-4 w-4" />
                Скачать все
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            {style === "withPhotos"
              ? "Фото подбираются автоматически по теме презентации"
              : "Слайды оформлены цветовыми блоками с иконками"}
          </div>
        </>
      )}

      {!hasResults && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FileDown className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">
            Введите тему и нажмите «Сгенерировать»
          </p>
          <p className="text-sm mt-1">
            Система создаст стильную презентацию с текстом и фото
          </p>
        </div>
      )}

      <canvas ref={hiddenCanvasRef} className="hidden" />
    </div>
  );
}
