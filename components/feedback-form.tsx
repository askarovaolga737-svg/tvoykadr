"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquareText, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const feedbackSchema = z.object({
  name: z.string().min(1, "Имя обязательно").max(100),
  email: z.string().email("Некорректный email"),
  message: z
    .string()
    .min(10, "Сообщение должно быть не менее 10 символов")
    .max(5000),
});

export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = feedbackSchema.safeParse({ name, email, message });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Сообщение отправлено!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Ошибка отправки");
      }
    } catch {
      toast.error("Ошибка отправки. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSubmitted(false);
    }, 200);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) handleClose();
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-xs lg:text-sm whitespace-nowrap h-9 sm:h-auto"
          />
        }
      >
        <MessageSquareText className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Есть вопрос?</span>
        <span className="inline sm:hidden">Вопрос?</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <DialogTitle className="text-xl">Сообщение отправлено!</DialogTitle>
            <DialogDescription>
              Спасибо! Мы получили ваше сообщение и ответим в ближайшее время.
            </DialogDescription>
            <Button onClick={handleClose} className="mt-4">
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Есть вопрос?</DialogTitle>
              <DialogDescription>
                Напишите нам, и мы ответим в ближайшее время.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ваше имя</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Петров"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ivan@example.com"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Сообщение</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Опишите ваш вопрос или пожелание..."
                  disabled={isLoading}
                  required
                  rows={4}
                  className="resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Отправка..." : "Отправить"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
