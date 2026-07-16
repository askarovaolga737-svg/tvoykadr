"use client";

import { useState, useRef, useEffect } from "react";
import {
  Download,
  Type,
  RotateCcw,
  ChevronLeft,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentItem } from "@/lib/models";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;
const TEXT_BOX_HEIGHT = 160;
const FONT_SIZE = 48;
const MIN_FONT_SIZE = 24;

interface TemplateStudioProps {
  templates: ContentItem[];
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function TemplateStudio({ templates }: TemplateStudioProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentItem | null>(
    null
  );
  const [userText, setUserText] = useState("");
  const [compositedUrl, setCompositedUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateImgRef = useRef<HTMLImageElement | null>(null);
  const templateLoadedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (compositedUrl) URL.revokeObjectURL(compositedUrl);
    };
  }, [compositedUrl]);

  function renderText() {
    const templateImg = templateImgRef.current;
    const canvas = canvasRef.current;
    if (!templateImg || !canvas) return;

    setIsRendering(true);

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(templateImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (userText.trim()) {
      const textBoxY = CANVAS_HEIGHT - TEXT_BOX_HEIGHT;

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(0, textBoxY, CANVAS_WIDTH, TEXT_BOX_HEIGHT);

      const maxTextWidth = CANVAS_WIDTH - 80;
      let fontSize = FONT_SIZE;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let lines: string[] = [];
      let lineHeight: number;

      do {
        ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
        lineHeight = fontSize * 1.3;
        lines = wrapText(ctx, userText, maxTextWidth);
        fontSize -= 2;
      } while (lines.length > 2 && fontSize >= MIN_FONT_SIZE);

      if (fontSize < MIN_FONT_SIZE) {
        fontSize = MIN_FONT_SIZE;
        ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
        lineHeight = fontSize * 1.3;
        lines = wrapText(ctx, userText, maxTextWidth);
      }

      ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;

      const totalHeight = lines.length * lineHeight;
      const startY =
        textBoxY + (TEXT_BOX_HEIGHT - totalHeight) / 2 + lineHeight / 2;

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], CANVAS_WIDTH / 2, startY + i * lineHeight);
      }
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCompositedUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
        }
        setIsRendering(false);
      },
      "image/png",
      0.95
    );
  }

  const handleTemplateSelect = (template: ContentItem) => {
    setCompositedUrl(null);
    setUserText("");
    setSelectedTemplate(template);
    templateLoadedRef.current = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      templateImgRef.current = img;
      templateLoadedRef.current = true;
      if (userText.trim()) {
        renderText();
      }
    };
    img.onerror = () => {
      toast.error("Не удалось загрузить шаблон");
    };
    img.src = template.fileUrl;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserText(e.target.value);
    if (templateLoadedRef.current) {
      renderText();
    }
  };

  const handleDownload = () => {
    if (!compositedUrl) return;
    const a = document.createElement("a");
    a.href = compositedUrl;
    a.download = "template-image.png";
    a.click();
    toast.success("Изображение сохранено");
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setUserText("");
    setCompositedUrl(null);
    templateImgRef.current = null;
    templateLoadedRef.current = false;
  };

  const showLoader = selectedTemplate && !compositedUrl && isRendering;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Выберите шаблон</h2>
          {selectedTemplate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Сбросить
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all duration-200 ${
                selectedTemplate?.id === template.id
                  ? "ring-violet-500 ring-offset-violet-50 scale-[1.02]"
                  : "ring-transparent hover:ring-muted-foreground/30 hover:scale-[1.02]"
              }`}
            >
              <img
                src={template.fileUrl}
                alt={template.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs font-medium text-white truncate">
                  {template.title}
                </p>
              </div>
              {selectedTemplate?.id === template.id && (
                <div className="absolute inset-0 ring-2 ring-violet-500 rounded-xl pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <h2 className="text-lg font-semibold">Предпросмотр</h2>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-[10/7] bg-muted/30 flex items-center justify-center relative">
              <canvas ref={canvasRef} className="hidden" />

              {!selectedTemplate && (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                  <p className="text-sm">Выберите шаблон слева</p>
                </div>
              )}

              {showLoader && (
                <div className="flex flex-col items-center gap-3">
                  <Skeleton className="h-full w-full absolute inset-0" />
                  <p className="text-sm text-muted-foreground z-10 bg-background/80 px-3 py-1 rounded-full">
                    Генерация...
                  </p>
                </div>
              )}

              {compositedUrl && (
                <img
                  src={compositedUrl}
                  alt="Результат"
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {selectedTemplate && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <label
                htmlFor="template-text"
                className="text-sm font-medium text-muted-foreground"
              >
                Введите текст
              </label>
            </div>
            <Input
              id="template-text"
              placeholder="Например: С днём рождения!"
              value={userText}
              onChange={handleTextChange}
              className="text-base"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleDownload}
            disabled={!compositedUrl || !userText.trim()}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Скачать
          </Button>
        </div>

        {(!selectedTemplate || !userText.trim()) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            {!selectedTemplate
              ? "Выберите шаблон слева"
              : "Введите текст для предпросмотра"}
          </div>
        )}
      </div>
    </div>
  );
}
