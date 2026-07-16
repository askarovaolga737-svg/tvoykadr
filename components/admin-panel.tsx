"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AdminLogin } from "@/components/admin-login";
import { AdminOrders } from "@/components/admin-orders";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Frame,
  ImageIcon,
  LogOut,
  Clock,
  Upload,
  Film,
  ShoppingCart,
  Video,
  Clapperboard,
  MessageSquareText,
} from "lucide-react";

interface ContentItem {
  id: string;
  type: "frame" | "image" | "video" | "video_template" | "cartoon_template";
  title: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  userName: string;
  userEmail: string;
  description: string;
  fileName: string;
  fileType: string;
  fileData: string;
  status: "new" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface AdminPanelProps {
  initialItems: ContentItem[];
  initialOrders: OrderItem[];
  initialFeedback: FeedbackItem[];
  dbAvailable: boolean;
}

const contentTypeLabels: Record<
  string,
  { label: string; icon: typeof Frame; color: string }
> = {
  frame: {
    label: "Рамка",
    icon: Frame,
    color: "text-violet-600 bg-violet-100",
  },
  image: {
    label: "Картинка",
    icon: ImageIcon,
    color: "text-pink-600 bg-pink-100",
  },
  video: { label: "Видео", icon: Film, color: "text-amber-600 bg-amber-100" },
  video_template: {
    label: "Видео-шаблон",
    icon: Video,
    color: "text-cyan-600 bg-cyan-100",
  },
  cartoon_template: {
    label: "Мульт-шаблон",
    icon: Clapperboard,
    color: "text-orange-600 bg-orange-100",
  },
};

export function AdminPanel({
  initialItems,
  initialOrders,
  initialFeedback,
  dbAvailable,
}: AdminPanelProps) {
  const [token, setToken] = useState<string | null>(null);
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [orders] = useState<OrderItem[]>(initialOrders);
  const [feedback] = useState<FeedbackItem[]>(initialFeedback);
  const [type, setType] = useState<
    "frame" | "image" | "video" | "video_template" | "cartoon_template"
  >("frame");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "frame" | "image" | "video" | "video_template" | "cartoon_template"
  >("all");
  const [adminSection, setAdminSection] = useState<
    "content" | "orders" | "feedback"
  >("content");

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) {
      try {
        const payload = JSON.parse(atob(saved));
        if (payload.role === "admin" && payload.exp > Date.now()) {
          setToken(saved);
        } else {
          localStorage.removeItem("admin_token");
        }
      } catch {
        localStorage.removeItem("admin_token");
      }
    }
  }, []);

  const handleLogin = useCallback((newToken: string) => {
    localStorage.setItem("admin_token", newToken);
    setToken(newToken);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
    toast.success("Вы вышли из панели");
  }, []);

  const refreshItems = useCallback(async () => {
    const response = await fetch("/api/content", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setItems(data);
    }
  }, [token]);

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("title", title);
      formData.append("file", file);

      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setFile(null);
        await refreshItems();
        toast.success("Контент добавлен");
      } else {
        const error = await response.json();
        toast.error(error.error || "Ошибка добавления");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContent = (id: string) => {
    toast("Удалить элемент?", {
      action: {
        label: "Удалить",
        onClick: async () => {
          try {
            const response = await fetch(`/api/content?id=${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
              await refreshItems();
              toast.success("Элемент удалён");
            } else {
              const error = await response.json();
              toast.error(error.error || "Ошибка удаления");
            }
          } catch {
            toast.error("Ошибка удаления");
          }
        },
      },
      cancel: { label: "Отмена", onClick: () => {} },
    });
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => item.type === activeTab);

  const counts = {
    all: items.length,
    frame: items.filter((i) => i.type === "frame").length,
    image: items.filter((i) => i.type === "image").length,
    video: items.filter((i) => i.type === "video").length,
    video_template: items.filter((i) => i.type === "video_template").length,
    cartoon_template: items.filter((i) => i.type === "cartoon_template").length,
  };

  return (
    <div className="space-y-8">
      {/* Header with logout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
            <Upload className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Управление контентом</h2>
            <p className="text-sm text-muted-foreground">
              {dbAvailable
                ? "Все изменения сохраняются в базу данных"
                : "Режим просмотра — база данных недоступна"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </Button>
      </div>

      {/* Section switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setAdminSection("content")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            adminSection === "content"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Upload className="h-4 w-4" />
          Контент
        </button>
        <button
          onClick={() => setAdminSection("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            adminSection === "orders"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Заказы
          {orders.filter((o) => o.status === "new").length > 0 && (
            <Badge className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0">
              {orders.filter((o) => o.status === "new").length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setAdminSection("feedback")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            adminSection === "feedback"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <MessageSquareText className="h-4 w-4" />
          Сообщения
        </button>
      </div>

      {adminSection === "orders" ? (
        <AdminOrders
          initialOrders={orders}
          dbAvailable={dbAvailable}
          token={token}
        />
      ) : adminSection === "feedback" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                <MessageSquareText className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Сообщения</h2>
                <p className="text-sm text-muted-foreground">
                  Вопросы и пожелания от пользователей
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              <MessageSquareText className="h-3.5 w-3.5 mr-1" />
              {feedback.length}{" "}
              {feedback.length === 1
                ? "сообщение"
                : feedback.length < 5
                  ? "сообщения"
                  : "сообщений"}
            </Badge>
          </div>

          {feedback.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <MessageSquareText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground font-medium">
                  Нет сообщений
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {[...feedback].reverse().map((msg) => (
                <Card key={msg.id} className="card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{msg.name}</CardTitle>
                        <CardDescription>{msg.email}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(msg.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {(
              [
                "all",
                "frame",
                "image",
                "video_template",
                "cartoon_template",
                "video",
              ] as const
            ).map((tab) => {
              const config =
                tab === "all"
                  ? {
                      label: "Весь контент",
                      icon: Upload,
                      color: "text-primary bg-primary/10",
                    }
                  : contentTypeLabels[tab];
              const Icon = config.icon;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left rounded-xl p-3 sm:p-4 ring-1 transition-all ${
                    activeTab === tab
                      ? "ring-primary bg-primary/5"
                      : "ring-foreground/5 hover:ring-foreground/20"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg mb-2 sm:mb-3 ${config.color}`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold">
                    {counts[tab]}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {config.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Add Content Form */}
          <Card>
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Добавить контент</CardTitle>
              </div>
              <CardDescription>
                Загрузите новый элемент в галерею платформы
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddContent} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Тип контента</label>
                    <select
                      value={type}
                      onChange={(e) =>
                        setType(
                          e.target.value as
                            | "frame"
                            | "image"
                            | "video"
                            | "video_template"
                            | "cartoon_template"
                        )
                      }
                      disabled={!dbAvailable || isLoading}
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="frame">Рамка</option>
                      <option value="image">Картинка-шаблон</option>
                      <option value="video_template">Видео-шаблон</option>
                      <option value="cartoon_template">Мульт-шаблон</option>
                      <option value="video">Видеоролик</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Название</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Например: Винтажная рамка"
                      disabled={!dbAvailable || isLoading}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Файл</label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        accept={
                          type === "video" || type === "video_template"
                            ? "video/mp4"
                            : "image/jpeg,image/png"
                        }
                        disabled={!dbAvailable || isLoading}
                        required
                        className="h-11 file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium"
                      />
                    </div>
                    {file && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Выбран: {file.name}
                        {file.type.startsWith("image/") && (
                          <span className="ml-2 inline-block">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              className="inline-block h-8 w-8 object-cover rounded"
                            />
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!dbAvailable || isLoading}
                  className="h-11 px-6"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isLoading ? "Загрузка..." : "Загрузить"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* Content List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                {activeTab === "all"
                  ? "Все материалы"
                  : contentTypeLabels[activeTab]?.label + "и"}
              </h2>
              <Badge variant="outline" className="text-sm">
                <Upload className="h-3.5 w-3.5 mr-1" />
                {filteredItems.length}{" "}
                {filteredItems.length === 1
                  ? "элемент"
                  : filteredItems.length < 5
                    ? "элемента"
                    : "элементов"}
              </Badge>
            </div>

            {filteredItems.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Контент не найден
                  </p>
                  {dbAvailable && (
                    <p className="text-sm text-muted-foreground">
                      Добавьте первый элемент с помощью формы выше
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => {
                  const config = contentTypeLabels[item.type];
                  const Icon = config.icon;
                  return (
                    <Card
                      key={item.id}
                      className="card-hover group overflow-hidden"
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {item.type === "video" ? (
                          <video
                            src={item.fileUrl}
                            className="h-full w-full object-cover"
                            preload="metadata"
                          />
                        ) : (
                          <Image
                            src={item.fileUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.color}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-base truncate">
                                {item.title}
                              </CardTitle>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {config.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {new Date(item.createdAt).toLocaleDateString(
                                "ru-RU"
                              )}
                            </span>
                          </div>
                          {dbAvailable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContent(item.id)}
                              className="size-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
