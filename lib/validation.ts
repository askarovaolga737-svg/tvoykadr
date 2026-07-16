import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(1, "Пароль обязателен"),
});

export const createContentSchema = z.object({
  type: z.enum([
    "frame",
    "image",
    "video",
    "video_template",
    "cartoon_template",
  ]),
  title: z.string().min(1, "Название обязательно").max(200),
  fileUrl: z.string().min(1, "URL обязателен"),
});

export const createOrderSchema = z.object({
  userName: z.string().min(1, "Имя обязательно").max(100),
  userEmail: z.string().email("Некорректный email"),
  description: z
    .string()
    .min(10, "Описание должно быть не менее 10 символов")
    .max(5000),
  fileName: z.string().min(1, "Файл обязателен"),
  fileType: z.string().min(1),
  fileData: z.string().min(1, "Файл обязателен"),
});

export const updateOrderSchema = z.object({
  status: z.enum(["new", "completed"]),
});

export const createFeedbackSchema = z.object({
  name: z.string().min(1, "Имя обязательно").max(100),
  email: z.string().email("Некорректный email"),
  message: z
    .string()
    .min(10, "Сообщение должно быть не менее 10 символов")
    .max(5000),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateContentFormData = z.infer<typeof createContentSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type CreateFeedbackFormData = z.infer<typeof createFeedbackSchema>;
