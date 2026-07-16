"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  Eye,
  X,
  File,
  Mail,
  User,
  Scissors,
} from "lucide-react";

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

interface AdminOrdersProps {
  initialOrders: OrderItem[];
  dbAvailable: boolean;
  token: string;
}

export function AdminOrders({
  initialOrders,
  dbAvailable,
  token,
}: AdminOrdersProps) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "new" | "completed">(
    "all"
  );

  const refreshOrders = useCallback(async () => {
    const response = await fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    }
  }, [token]);

  const handleComplete = async (id: string) => {
    const loadingId = toast.loading("Обновление заказа...");
    try {
      const response = await fetch(`/api/orders?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      if (response.ok) {
        await refreshOrders();
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status: "completed" });
        }
        toast.success("Заказ отмечен как выполненный", { id: loadingId });
      } else {
        const error = await response.json();
        toast.error(error.error || "Ошибка обновления", { id: loadingId });
      }
    } catch {
      toast.error("Ошибка обновления заказа", { id: loadingId });
    }
  };

  const isImage = (type: string) => type.startsWith("image/");
  const isVideo = (type: string) => type.startsWith("video/");

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === "all") return true;
    return o.status === activeFilter;
  });

  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedOrder(null)}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Назад к списку
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                  <Eye className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Детали заказа</CardTitle>
                  <CardDescription>ID: {selectedOrder.id}</CardDescription>
                </div>
              </div>
              <Badge
                variant={
                  selectedOrder.status === "new" ? "default" : "secondary"
                }
                className={
                  selectedOrder.status === "new"
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    : ""
                }
              >
                {selectedOrder.status === "new" ? "Новый" : "Выполнен"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Имя
                </div>
                <p className="font-medium">{selectedOrder.userName}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="font-medium">{selectedOrder.userEmail}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <File className="h-4 w-4" />
                Файл
              </div>
              <p className="font-medium">{selectedOrder.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {selectedOrder.fileType}
              </p>
            </div>

            {selectedOrder.fileData && (
              <div className="rounded-xl overflow-hidden border bg-muted/30">
                {isImage(selectedOrder.fileType) ? (
                  <div className="p-4 flex justify-center">
                    <img
                      src={selectedOrder.fileData}
                      alt={selectedOrder.fileName}
                      className="max-h-80 rounded-lg object-contain"
                    />
                  </div>
                ) : isVideo(selectedOrder.fileType) ? (
                  <div className="p-4 flex justify-center">
                    <video
                      src={selectedOrder.fileData}
                      controls
                      className="max-h-80 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <File className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">
                      Предпросмотр недоступен для этого типа файла
                    </p>
                  </div>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Scissors className="h-4 w-4" />
                Описание работы
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {selectedOrder.description}
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
              <div>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Создан:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString("ru-RU")}
                </span>
              </div>
              <div>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Обновлён:{" "}
                  {new Date(selectedOrder.updatedAt).toLocaleString("ru-RU")}
                </span>
              </div>
            </div>

            {selectedOrder.status === "new" && dbAvailable && (
              <Button
                onClick={() => handleComplete(selectedOrder.id)}
                className="gap-2 w-full sm:w-auto"
              >
                <CheckCircle2 className="h-4 w-4" />
                Отметить как выполненный
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <ShoppingCart className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Заказы на монтаж</h2>
            <p className="text-sm text-muted-foreground">
              {dbAvailable
                ? "Управление заказами пользователей"
                : "Режим просмотра — база данных недоступна"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {(["all", "new", "completed"] as const).map((filter) => {
          const config =
            filter === "all"
              ? {
                  label: "Все",
                  icon: ShoppingCart,
                  color: "text-primary bg-primary/10",
                }
              : filter === "new"
                ? {
                    label: "Новые",
                    icon: Clock,
                    color: "text-amber-600 bg-amber-100",
                  }
                : {
                    label: "Выполненные",
                    icon: CheckCircle2,
                    color: "text-emerald-600 bg-emerald-100",
                  };
          const Icon = config.icon;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-left rounded-xl p-3 sm:p-4 ring-1 transition-all ${
                activeFilter === filter
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
                {counts[filter]}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {config.label}
              </p>
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground font-medium">
              {activeFilter === "new"
                ? "Новых заказов нет"
                : activeFilter === "completed"
                  ? "Выполненных заказов нет"
                  : "Заказов пока нет"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((order) => (
              <Card
                key={order.id}
                className="card-hover cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {order.userName}
                        </h3>
                        <Badge
                          variant={
                            order.status === "new" ? "default" : "secondary"
                          }
                          className={
                            order.status === "new"
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs"
                              : "text-xs"
                          }
                        >
                          {order.status === "new" ? "Новый" : "Выполнен"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {order.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <File className="h-3 w-3" />
                          {order.fileName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 size-9 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
