"use client";

import { useState, useRef, useEffect } from "react";
import {
  Download,
  Type,
  RotateCcw,
  ChevronLeft,
  Film,
  Play,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentItem } from "@/lib/models";

const TEXT_BOX_HEIGHT_RATIO = 0.15;
const FONT_SIZE_RATIO = 0.048;
const MIN_FONT_SIZE = 18;

interface VideoTemplateStudioProps {
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

export function VideoTemplateStudio({ templates }: VideoTemplateStudioProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentItem | null>(
    null
  );
  const [userText, setUserText] = useState("");
  const [, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [recordedUrl]);

  const handleTemplateSelect = (template: ContentItem) => {
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setUserText("");
    setSelectedTemplate(template);
    setIsPlaying(false);
    setIsRecording(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserText(e.target.value);
  };

  const handleGenerate = async () => {
    const video = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!video || !canvasEl || !userText.trim()) return;

    setIsRecording(true);
    chunksRef.current = [];

    canvasEl.width = video.videoWidth || 640;
    canvasEl.height = video.videoHeight || 360;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      setIsRecording(false);
      return;
    }

    const stream = canvasEl.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : "video/webm",
    });

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      setRecordedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setIsRecording(false);
      toast.success("Видео готово к скачиванию");
    };

    recorder.start();

    video.currentTime = 0;
    video.play();
    setIsPlaying(true);

    function renderLoop() {
      if (!video || video.ended) {
        setIsPlaying(false);
        if (recorder.state === "recording") recorder.stop();
        return;
      }

      const c = canvasEl;
      const renderCtx = c!.getContext("2d");
      if (renderCtx) {
        const w = c!.width;
        const h = c!.height;
        renderCtx.drawImage(video, 0, 0, w, h);

        if (userText.trim()) {
          const textBoxHeight = Math.round(h * TEXT_BOX_HEIGHT_RATIO);
          const textBoxY = h - textBoxHeight;

          renderCtx.fillStyle = "rgba(0, 0, 0, 0.6)";
          renderCtx.fillRect(0, textBoxY, w, textBoxHeight);

          const maxTextWidth = w - 80;
          let fontSize = Math.round(h * FONT_SIZE_RATIO);

          renderCtx.textAlign = "center";
          renderCtx.textBaseline = "middle";

          let lines: string[] = [];
          let lineHeight: number;

          do {
            renderCtx.font = `bold ${fontSize}px "Inter", sans-serif`;
            lineHeight = fontSize * 1.3;
            lines = wrapText(renderCtx, userText, maxTextWidth);
            fontSize -= 2;
          } while (lines.length > 2 && fontSize >= MIN_FONT_SIZE);

          if (fontSize < MIN_FONT_SIZE) {
            fontSize = MIN_FONT_SIZE;
            renderCtx.font = `bold ${fontSize}px "Inter", sans-serif`;
            lineHeight = fontSize * 1.3;
            lines = wrapText(renderCtx, userText, maxTextWidth);
          }

          renderCtx.font = `bold ${fontSize}px "Inter", sans-serif`;
          renderCtx.fillStyle = "#ffffff";
          renderCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
          renderCtx.shadowBlur = 4;

          const totalHeight = lines.length * lineHeight;
          const startY =
            textBoxY + (textBoxHeight - totalHeight) / 2 + lineHeight / 2;

          for (let i = 0; i < lines.length; i++) {
            renderCtx.fillText(lines[i], w / 2, startY + i * lineHeight);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    }

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  };

  const handleDownload = () => {
    if (!recordedUrl) return;
    const a = document.createElement("a");
    a.href = recordedUrl;
    const ext = recordedUrl.includes("mp4") ? "mp4" : "webm";
    a.download = `video-template.${ext}`;
    a.click();
    toast.success("Видео сохранено");
  };

  const handleReset = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.src = "";
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setSelectedTemplate(null);
    setUserText("");
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setIsPlaying(false);
    setIsRecording(false);
  };

  const showPreviewPlaceholder =
    selectedTemplate && !recordedUrl && !isRecording;

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
              className={`group relative aspect-video rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all duration-200 ${
                selectedTemplate?.id === template.id
                  ? "ring-cyan-500 ring-offset-cyan-50 scale-[1.02]"
                  : "ring-transparent hover:ring-muted-foreground/30 hover:scale-[1.02]"
              }`}
            >
              <video
                src={template.fileUrl}
                className="h-full w-full object-cover"
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-foreground">
                  <Play className="h-5 w-5 ml-0.5" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs font-medium text-white truncate">
                  {template.title}
                </p>
              </div>
              {selectedTemplate?.id === template.id && (
                <div className="absolute inset-0 ring-2 ring-cyan-500 rounded-xl pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <h2 className="text-lg font-semibold">Предпросмотр</h2>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted/30 flex items-center justify-center relative">
              {!selectedTemplate && (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Film className="h-12 w-12" />
                  <p className="text-sm">Выберите видео-шаблон слева</p>
                </div>
              )}

              {isRecording && (
                <div className="flex flex-col items-center gap-3 z-10">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
                  <p className="text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                    Генерация видео...
                  </p>
                </div>
              )}

              {showPreviewPlaceholder && (
                <div className="flex flex-col items-center gap-3">
                  <Skeleton className="h-full w-full absolute inset-0" />
                  <p className="text-sm text-muted-foreground z-10 bg-background/80 px-3 py-1 rounded-full">
                    Нажмите &laquo;Сгенерировать видео&raquo;
                  </p>
                </div>
              )}

              {recordedUrl && (
                <video src={recordedUrl} controls className="h-full w-full" />
              )}
            </div>
          </CardContent>
        </Card>

        {selectedTemplate && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <label
                  htmlFor="vt-text"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Введите текст
                </label>
              </div>
              <Input
                id="vt-text"
                placeholder="Например: С днём рождения!"
                value={userText}
                onChange={handleTextChange}
                className="text-base"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleGenerate}
                disabled={!userText.trim() || isRecording}
                className="gap-2"
              >
                {isRecording ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Сгенерировать видео
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
          </>
        )}

        {(!selectedTemplate || !userText.trim()) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            {!selectedTemplate
              ? "Выберите видео-шаблон слева"
              : "Введите текст для генерации"}
          </div>
        )}
      </div>

      <video
        ref={videoRef}
        className="hidden"
        preload="metadata"
        src={selectedTemplate?.fileUrl}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
