"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, File, CheckCircle2, Scissors, ArrowLeft } from "lucide-react";

export function OrderForm() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const maxSize = 10 * 1024 * 1024;
    if (selected.size > maxSize) {
      toast.error("Файл слишком большой. Максимальный размер — 10 МБ");
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (!validTypes.includes(selected.type)) {
      toast.error(
        "Поддерживаются только фото (JPG, PNG, WEBP) и видео (MP4, MOV, AVI)"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result as string);
    };
    reader.readAsDataURL(selected);
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !fileData) {
      toast.error("Пожалуйста, загрузите файл");
      return;
    }

    setIsLoading(true);
    const id = toast.loading("Отправка заказа...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userEmail,
          description,
          fileName: file.name,
          fileType: file.type,
          fileData,
        }),
      });

      if (response.ok) {
        toast.success("Заказ отправлен!", { id });
        setStep("success");
      } else {
        const error = await response.json();
        toast.error(error.error || "Ошибка отправки заказа", { id });
      }
    } catch {
      toast.error("Ошибка отправки заказа", { id });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " Б";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " КБ";
    return (bytes / (1024 * 1024)).toFixed(1) + " МБ";
  };

  if (step === "success") {
    return (
      <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4">
        <Card className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Заказ отправлен!
              </h2>
              <p className="text-muted-foreground">
                Спасибо, {userName}! Мы получили ваш заказ на монтаж и свяжемся
                с вами в ближайшее время по адресу{" "}
                <span className="font-medium text-foreground">{userEmail}</span>
                .
              </p>
            </div>
            <Button
              onClick={() => {
                setStep("form");
                setFile(null);
                setFileData("");
                setDescription("");
              }}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Отправить ещё один заказ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-9rem)] px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
              <Scissors className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Заказ монтажа
              </h1>
              <p className="text-muted-foreground">
                Загрузите фото или видео и опишите, что нужно сделать
              </p>
            </div>
          </div>
        </div>

        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader>
            <CardTitle className="text-lg">Данные для заказа</CardTitle>
            <CardDescription>
              Все поля обязательны для заполнения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ваше имя</label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Иван Петров"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="ivan@example.com"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Файл (фото или видео)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/x-msvideo"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {file ? (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100">
                          <File className="h-7 w-7 text-violet-600" />
                        </div>
                      </div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      <p className="text-sm text-primary">
                        Нажмите, чтобы выбрать другой файл
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted group-hover:bg-violet-100 transition-colors">
                          <Upload className="h-7 w-7 text-muted-foreground group-hover:text-violet-600 transition-colors" />
                        </div>
                      </div>
                      <p className="font-medium">
                        Нажмите, чтобы загрузить файл
                      </p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, WEBP, MP4, MOV, AVI — до 10 МБ
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Описание работы</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите, что нужно сделать: какие переходы, эффекты, музыка, обрезка, цветокоррекция..."
                  required
                  rows={5}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {description.length} / 5000
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !file}
                className="h-11 px-8 w-full sm:w-auto"
                size="lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? "Отправка..." : "Отправить заказ"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
