"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  ImageIcon,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentItem } from "@/lib/models";

const CANVAS_SIZE = 1000;

interface FrameStudioProps {
  frames: ContentItem[];
}

export function FrameStudio({ frames }: FrameStudioProps) {
  const [selectedFrame, setSelectedFrame] = useState<ContentItem | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [compositedUrl, setCompositedUrl] = useState<string | null>(null);
  const [isCompositing, setIsCompositing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameImgRef = useRef<HTMLImageElement | null>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const frameLoadedRef = useRef(false);
  const photoLoadedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (compositedUrl) URL.revokeObjectURL(compositedUrl);
    };
  }, [compositedUrl]);

  function runComposite() {
    const frameImg = frameImgRef.current;
    const photoImg = photoImgRef.current;
    const canvas = canvasRef.current;
    if (!frameImg || !photoImg || !canvas) return;

    setIsCompositing(true);

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const photoScale = Math.max(
      CANVAS_SIZE / photoImg.naturalWidth,
      CANVAS_SIZE / photoImg.naturalHeight
    );
    const photoW = photoImg.naturalWidth * photoScale;
    const photoH = photoImg.naturalHeight * photoScale;
    const photoX = (CANVAS_SIZE - photoW) / 2;
    const photoY = (CANVAS_SIZE - photoH) / 2;

    ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
    ctx.drawImage(frameImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCompositedUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
        }
        setIsCompositing(false);
      },
      "image/png",
      0.95
    );
  }

  const handleFrameSelect = (frame: ContentItem) => {
    setCompositedUrl(null);
    setSelectedFrame(frame);
    frameLoadedRef.current = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      frameImgRef.current = img;
      frameLoadedRef.current = true;
      if (photoLoadedRef.current) runComposite();
    };
    img.onerror = () => {
      toast.error("Не удалось загрузить рамку");
    };
    img.src = frame.fileUrl;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Пожалуйста, выберите изображение JPG или PNG");
      return;
    }

    setCompositedUrl(null);
    photoLoadedRef.current = false;

    const url = URL.createObjectURL(file);
    setUserImage(url);

    const img = new Image();
    img.onload = () => {
      photoImgRef.current = img;
      photoLoadedRef.current = true;
      if (frameLoadedRef.current) runComposite();
    };
    img.src = url;

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!compositedUrl) return;
    const a = document.createElement("a");
    a.href = compositedUrl;
    a.download = "photo-with-frame.png";
    a.click();
    toast.success("Изображение сохранено");
  };

  const handleReset = () => {
    setSelectedFrame(null);
    setUserImage(null);
    setCompositedUrl(null);
    frameImgRef.current = null;
    photoImgRef.current = null;
    frameLoadedRef.current = false;
    photoLoadedRef.current = false;
  };

  const showLoader =
    (selectedFrame || userImage) &&
    !compositedUrl &&
    (selectedFrame && userImage ? isCompositing : true);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Выберите рамку</h2>
          {selectedFrame && (
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
          {frames.map((frame) => (
            <button
              key={frame.id}
              onClick={() => handleFrameSelect(frame)}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all duration-200 ${
                selectedFrame?.id === frame.id
                  ? "ring-violet-500 ring-offset-violet-50 scale-[1.02]"
                  : "ring-transparent hover:ring-muted-foreground/30 hover:scale-[1.02]"
              }`}
            >
              <img
                src={frame.fileUrl}
                alt={frame.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs font-medium text-white truncate">
                  {frame.title}
                </p>
              </div>
              {selectedFrame?.id === frame.id && (
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
            <div className="aspect-square bg-muted/30 flex items-center justify-center relative">
              <canvas ref={canvasRef} className="hidden" />

              {!selectedFrame && !userImage && (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                  <p className="text-sm">Выберите рамку и загрузите фото</p>
                </div>
              )}

              {showLoader && (
                <div className="flex flex-col items-center gap-3">
                  <Skeleton className="h-full w-full absolute inset-0" />
                  <p className="text-sm text-muted-foreground z-10 bg-background/80 px-3 py-1 rounded-full">
                    {isCompositing ? "Наложение..." : "Загрузка..."}
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

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedFrame}
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
            onClick={handleDownload}
            disabled={!compositedUrl}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Скачать
          </Button>
        </div>

        {(!selectedFrame || !userImage) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            {!selectedFrame && !userImage
              ? "Выберите рамку слева, затем загрузите фото"
              : !selectedFrame
                ? "Выберите рамку слева"
                : "Загрузите фото"}
          </div>
        )}
      </div>
    </div>
  );
}
