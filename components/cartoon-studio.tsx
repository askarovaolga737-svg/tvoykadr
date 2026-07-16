"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  ChevronLeft,
  RotateCcw,
  Clapperboard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentItem } from "@/lib/models";
import { cartoonTemplateMetadata } from "@/lib/cartoon-data";
import type { CartoonTemplateMeta } from "@/lib/cartoon-data";

const CANVAS_W = 640;
const CANVAS_H = 640;
const FPS = 12;
const DURATION_FRAMES = 36;

interface CartoonStudioProps {
  templates: ContentItem[];
}

function getMeta(templateId: string): CartoonTemplateMeta {
  const found = cartoonTemplateMetadata.find((m) => m.id === templateId);
  if (found) return found;
  return {
    id: templateId,
    faceCenterX: 0.5,
    faceCenterY: 0.25,
    faceRadius: 0.1,
    bodyColor: "#8b5cf6",
    secondaryColor: "#c084fc",
  };
}

function cropCircle(img: HTMLImageElement, radius: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = radius * 2;
  c.height = radius * 2;
  const ctx = c.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const s = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - s) / 2;
  const sy = (img.naturalHeight - s) / 2;
  ctx.drawImage(img, sx, sy, s, s, 0, 0, radius * 2, radius * 2);
  return c;
}

function drawSuperheroBody(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  meta: CartoonTemplateMeta,
  t: number
) {
  const cx = w / 2;
  const bodyTop = h * 0.32;
  const bodyW = w * 0.36;
  const bodyH = h * 0.35;
  const bounce = Math.sin(t * 0.15) * 3;

  ctx.save();
  ctx.translate(0, bounce);

  ctx.fillStyle = meta.secondaryColor;
  ctx.beginPath();
  ctx.roundRect(cx - bodyW / 2 - 6, bodyTop + 10, bodyW + 12, bodyH - 20, 18);
  ctx.fill();

  ctx.fillStyle = meta.bodyColor;
  ctx.beginPath();
  ctx.roundRect(cx - bodyW / 2, bodyTop, bodyW, bodyH, 14);
  ctx.fill();

  const starSize = w * 0.06;
  const starY = bodyTop + bodyH * 0.32;
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? starSize : starSize * 0.4;
    const x = cx + Math.cos(angle) * r;
    const y = starY + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = meta.secondaryColor;
  ctx.beginPath();
  ctx.roundRect(cx - bodyW / 2 - 12, bodyTop + 8, 10, bodyH * 0.55, 5);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(cx + bodyW / 2 + 2, bodyTop + 8, 10, bodyH * 0.55, 5);
  ctx.fill();

  ctx.fillStyle = meta.bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx, bodyTop - 6, bodyW * 0.28, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawPrincessBody(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  meta: CartoonTemplateMeta,
  t: number
) {
  const cx = w / 2;
  const bodyTop = h * 0.3;
  const bodyW = w * 0.4;
  const bodyH = h * 0.38;
  const bounce = Math.sin(t * 0.15) * 2;

  ctx.save();
  ctx.translate(0, bounce);

  ctx.fillStyle = meta.bodyColor;
  ctx.beginPath();
  ctx.moveTo(cx - bodyW / 2, bodyTop);
  ctx.quadraticCurveTo(
    cx - bodyW / 2 - 20,
    bodyTop + bodyH * 0.5,
    cx - bodyW / 2 + 10,
    bodyTop + bodyH
  );
  ctx.lineTo(cx + bodyW / 2 - 10, bodyTop + bodyH);
  ctx.quadraticCurveTo(
    cx + bodyW / 2 + 20,
    bodyTop + bodyH * 0.5,
    cx + bodyW / 2,
    bodyTop
  );
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = meta.secondaryColor;
  ctx.beginPath();
  ctx.roundRect(
    cx - bodyW * 0.02,
    bodyTop + bodyH * 0.08,
    bodyW * 0.04,
    bodyH * 0.7,
    3
  );
  ctx.fill();

  const collarW = w * 0.22;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(cx, bodyTop + 4, collarW / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = meta.secondaryColor;
  ctx.font = `bold ${w * 0.045}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦", cx, bodyTop + bodyH * 0.08);
  ctx.fillText("✦", cx - bodyW * 0.22, bodyTop + bodyH * 0.3);
  ctx.fillText("✦", cx + bodyW * 0.22, bodyTop + bodyH * 0.3);

  ctx.restore();
}

function drawAstronautBody(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  meta: CartoonTemplateMeta,
  t: number
) {
  const cx = w / 2;
  const bodyTop = h * 0.34;
  const bodyW = w * 0.34;
  const bodyH = h * 0.32;
  const bounce = Math.sin(t * 0.15) * 2;

  ctx.save();
  ctx.translate(0, bounce);

  ctx.fillStyle = meta.bodyColor;
  ctx.beginPath();
  ctx.roundRect(cx - bodyW / 2, bodyTop, bodyW, bodyH, 12);
  ctx.fill();

  ctx.fillStyle = "#64748b";
  ctx.beginPath();
  ctx.roundRect(
    cx - bodyW / 2 - 4,
    bodyTop + bodyH * 0.08,
    bodyW + 8,
    bodyH * 0.12,
    4
  );
  ctx.fill();

  ctx.fillStyle = meta.secondaryColor;
  ctx.beginPath();
  ctx.roundRect(
    cx - bodyW / 2 + 4,
    bodyTop + bodyH * 0.25,
    bodyW - 8,
    bodyH * 0.3,
    4
  );
  ctx.fill();

  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.roundRect(cx - bodyW / 2 - 10, bodyTop + 6, 8, bodyH * 0.5, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(cx + bodyW / 2 + 2, bodyTop + 6, 8, bodyH * 0.5, 4);
  ctx.fill();

  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.ellipse(cx, bodyTop - 4, bodyW * 0.3, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, bodyTop - 4, bodyW * 0.28, 7, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

export function CartoonStudio({ templates }: CartoonStudioProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentItem | null>(
    null
  );
  const [userImage, setUserImage] = useState<string | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sceneImgRef = useRef<HTMLImageElement | null>(null);
  const faceImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      if (userImage) URL.revokeObjectURL(userImage);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [recordedUrl, userImage]);

  const handleTemplateSelect = (template: ContentItem) => {
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setSelectedTemplate(template);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      sceneImgRef.current = img;
    };
    img.src = template.fileUrl;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Пожалуйста, выберите изображение JPG или PNG");
      return;
    }

    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    const url = URL.createObjectURL(file);
    setUserImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    const img = new Image();
    img.onload = () => {
      faceImgRef.current = img;
    };
    img.src = url;

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  function getBodyDrawFn(index: number) {
    const id = templates[index]?.id;
    if (id?.includes("cartoon-1") || id?.includes("superhero"))
      return drawSuperheroBody;
    if (id?.includes("cartoon-2") || id?.includes("princess"))
      return drawPrincessBody;
    if (id?.includes("cartoon-3") || id?.includes("space"))
      return drawAstronautBody;
    const fns = [drawSuperheroBody, drawPrincessBody, drawAstronautBody];
    return fns[index % fns.length];
  }

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    const sceneImg = sceneImgRef.current;
    const faceImg = faceImgRef.current;
    if (!canvas || !sceneImg || !faceImg || !selectedTemplate) return;

    setIsGenerating(true);
    chunksRef.current = [];
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    const ctx = canvas.getContext("2d")!;
    const meta = getMeta(selectedTemplate.id);
    const faceRadius = CANVAS_W * meta.faceRadius;
    const faceCx = CANVAS_W * meta.faceCenterX;
    const faceCy = CANVAS_H * meta.faceCenterY;
    const faceCanvas = cropCircle(faceImg, faceRadius);

    const templateIndex = templates.findIndex(
      (t) => t.id === selectedTemplate.id
    );
    const bodyDrawFn = getBodyDrawFn(templateIndex);

    const stream = canvas.captureStream(FPS);
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : "video/webm;codecs=vp9",
    });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setIsGenerating(false);
      toast.success("Мини-мультфильм готов к скачиванию");
    };

    recorder.start();

    let frame = 0;

    function renderFrame() {
      const t = frame / FPS;
      const w = CANVAS_W;
      const h = CANVAS_H;

      ctx.clearRect(0, 0, w, h);

      const sImg = sceneImg as HTMLImageElement;
      const scale = Math.max(w / sImg.naturalWidth, h / sImg.naturalHeight);
      const sw = sImg.naturalWidth * scale;
      const sh = sImg.naturalHeight * scale;
      const sx = (w - sw) / 2;
      const sy = (h - sh) / 2;
      ctx.drawImage(sImg, sx, sy, sw, sh);

      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, w, h);

      bodyDrawFn(ctx, w, h, meta, t);

      const faceBounce = Math.sin(t * 0.12) * 2;
      const faceScale = 1 + Math.sin(t * 0.2) * 0.02;

      ctx.save();
      ctx.translate(faceCx, faceCy + faceBounce);
      ctx.scale(faceScale, faceScale);
      ctx.drawImage(
        faceCanvas,
        -faceRadius,
        -faceRadius,
        faceRadius * 2,
        faceRadius * 2
      );

      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, faceRadius + 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      frame++;
      if (frame < DURATION_FRAMES) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      } else if (recorder.state === "recording") {
        recorder.stop();
      }
    }

    animFrameRef.current = requestAnimationFrame(renderFrame);
  };

  const handleDownload = () => {
    if (!recordedUrl) return;
    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = "mini-cartoon.webm";
    a.click();
    toast.success("Мини-мультфильм сохранён");
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setSelectedTemplate(null);
    setUserImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    sceneImgRef.current = null;
    faceImgRef.current = null;
  };

  const canGenerate = selectedTemplate && userImage && !isGenerating;
  const showPlaceholder = !selectedTemplate && !userImage;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Выберите мульт-шаблон</h2>
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
          {templates.map((template, _idx) => {
            const meta = getMeta(template.id);
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`group relative aspect-[4/3] rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all duration-200 ${
                  selectedTemplate?.id === template.id
                    ? "ring-orange-500 ring-offset-orange-50 scale-[1.02]"
                    : "ring-transparent hover:ring-muted-foreground/30 hover:scale-[1.02]"
                }`}
              >
                <img
                  src={template.fileUrl}
                  alt={template.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div
                  className="absolute w-10 h-10 rounded-full border-2 border-white/70 shadow-lg"
                  style={{
                    left: `${meta.faceCenterX * 100}%`,
                    top: `${meta.faceCenterY * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                      <Clapperboard className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    <p className="text-sm font-semibold text-white drop-shadow-lg">
                      {template.title}
                    </p>
                  </div>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="absolute inset-0 ring-2 ring-orange-500 rounded-xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <h2 className="text-lg font-semibold">Предпросмотр</h2>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-muted/30 flex items-center justify-center relative">
              <canvas ref={canvasRef} className="hidden" />

              {showPlaceholder && (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Clapperboard className="h-12 w-12" />
                  <p className="text-sm">
                    Выберите мульт-шаблон и загрузите фото
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="flex flex-col items-center gap-3 z-10">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  <p className="text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                    Создание мультфильма...
                  </p>
                </div>
              )}

              {selectedTemplate &&
                userImage &&
                !isGenerating &&
                !recordedUrl && (
                  <div className="flex flex-col items-center gap-3">
                    <Skeleton className="h-full w-full absolute inset-0" />
                    <p className="text-sm text-muted-foreground z-10 bg-background/80 px-3 py-1 rounded-full">
                      Нажмите &laquo;Создать мультфильм&raquo;
                    </p>
                  </div>
                )}

              {recordedUrl && (
                <video
                  src={recordedUrl}
                  controls
                  autoPlay
                  loop
                  className="h-full w-full"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedTemplate}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {userImage ? "Заменить фото" : "Загрузить фото"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
          >
            <Clapperboard className="h-4 w-4" />
            Создать мультфильм
          </Button>

          <Button
            onClick={handleDownload}
            disabled={!recordedUrl}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Скачать
          </Button>
        </div>

        {(!selectedTemplate || !userImage) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            {!selectedTemplate && !userImage
              ? "Выберите мульт-шаблон слева, затем загрузите фото"
              : !selectedTemplate
                ? "Выберите мульт-шаблон слева"
                : "Загрузите своё фото"}
          </div>
        )}
      </div>
    </div>
  );
}
