// Мок-данные для статического режима (без БД)
// Используются когда USE_DATABASE=false или БД недоступна

import { Service } from "./models";
import type { ContentItem, Order, FeedbackMessage } from "./models";

export const mockServices: Service[] = [
  {
    id: "mock-service-1",
    name: "API Gateway",
    description: "Шлюз для микросервисной архитектуры",
    status: "active",
    url: "https://api.example.com",
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: "mock-service-2",
    name: "Auth Service",
    description: "Сервис аутентификации и авторизации",
    status: "active",
    url: "https://auth.example.com",
    createdAt: new Date("2024-02-01").toISOString(),
    updatedAt: new Date("2024-02-01").toISOString(),
  },
  {
    id: "mock-service-3",
    name: "ML Pipeline",
    description: "Пайплайн для обработки данных с AI",
    status: "deploying",
    url: undefined,
    createdAt: new Date("2024-03-10").toISOString(),
    updatedAt: new Date("2024-03-10").toISOString(),
  },
];

export const mockContentItems: ContentItem[] = [
  {
    id: "mock-frame-1",
    type: "frame",
    title: "Винтажная рамка",
    fileUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    createdAt: new Date("2025-01-10").toISOString(),
    updatedAt: new Date("2025-01-10").toISOString(),
  },
  {
    id: "mock-frame-2",
    type: "frame",
    title: "Цветочная рамка",
    fileUrl:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
    createdAt: new Date("2025-01-15").toISOString(),
    updatedAt: new Date("2025-01-15").toISOString(),
  },
  {
    id: "mock-frame-3",
    type: "frame",
    title: "Золотая рамка",
    fileUrl:
      "https://images.unsplash.com/photo-1609602645313-3aae1f5b7edc?w=400",
    createdAt: new Date("2025-02-05").toISOString(),
    updatedAt: new Date("2025-02-05").toISOString(),
  },
  {
    id: "mock-frame-4",
    type: "frame",
    title: "Морская рамка",
    fileUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
    createdAt: new Date("2025-02-20").toISOString(),
    updatedAt: new Date("2025-02-20").toISOString(),
  },
  {
    id: "mock-frame-5",
    type: "frame",
    title: "Романтическая рамка",
    fileUrl:
      "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400",
    createdAt: new Date("2025-03-05").toISOString(),
    updatedAt: new Date("2025-03-05").toISOString(),
  },
  {
    id: "mock-frame-6",
    type: "frame",
    title: "Геометрическая рамка",
    fileUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400",
    createdAt: new Date("2025-03-15").toISOString(),
    updatedAt: new Date("2025-03-15").toISOString(),
  },
  {
    id: "mock-image-1",
    type: "image",
    title: "Поздравительная открытка",
    fileUrl:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400",
    createdAt: new Date("2025-02-01").toISOString(),
    updatedAt: new Date("2025-02-01").toISOString(),
  },
  {
    id: "mock-image-2",
    type: "image",
    title: "Плакат мотивационный",
    fileUrl:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400",
    createdAt: new Date("2025-02-10").toISOString(),
    updatedAt: new Date("2025-02-10").toISOString(),
  },
  {
    id: "mock-video-1",
    type: "video",
    title: "Ролик промо",
    fileUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    createdAt: new Date("2025-03-01").toISOString(),
    updatedAt: new Date("2025-03-01").toISOString(),
  },
  {
    id: "mock-video-2",
    type: "video",
    title: "Обучающее видео",
    fileUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    createdAt: new Date("2025-03-10").toISOString(),
    updatedAt: new Date("2025-03-10").toISOString(),
  },
  {
    id: "mock-video-3",
    type: "video",
    title: "Творческий процесс",
    fileUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    createdAt: new Date("2025-03-15").toISOString(),
    updatedAt: new Date("2025-03-15").toISOString(),
  },
  {
    id: "mock-video-4",
    type: "video",
    title: "Закадровые моменты",
    fileUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    createdAt: new Date("2025-03-20").toISOString(),
    updatedAt: new Date("2025-03-20").toISOString(),
  },
  {
    id: "mock-video-5",
    type: "video",
    title: "Презентация продукта",
    fileUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    createdAt: new Date("2025-03-25").toISOString(),
    updatedAt: new Date("2025-03-25").toISOString(),
  },
  {
    id: "mock-video-6",
    type: "video",
    title: "Туториал",
    fileUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    createdAt: new Date("2025-04-01").toISOString(),
    updatedAt: new Date("2025-04-01").toISOString(),
  },
  {
    id: "mock-vt-1",
    type: "video_template",
    title: "Поздравительное видео",
    fileUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    createdAt: new Date("2025-06-01").toISOString(),
    updatedAt: new Date("2025-06-01").toISOString(),
  },
  {
    id: "mock-vt-2",
    type: "video_template",
    title: "Рекламный шаблон",
    fileUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    createdAt: new Date("2025-06-05").toISOString(),
    updatedAt: new Date("2025-06-05").toISOString(),
  },
  {
    id: "mock-vt-3",
    type: "video_template",
    title: "Титульная заставка",
    fileUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    createdAt: new Date("2025-06-10").toISOString(),
    updatedAt: new Date("2025-06-10").toISOString(),
  },
  {
    id: "mock-cartoon-1",
    type: "cartoon_template",
    title: "Супергерой",
    fileUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    createdAt: new Date("2025-07-01").toISOString(),
    updatedAt: new Date("2025-07-01").toISOString(),
  },
  {
    id: "mock-cartoon-2",
    type: "cartoon_template",
    title: "Принцесса",
    fileUrl: "https://images.unsplash.com/photo-1518495973-e3e38a8e3f9c?w=600",
    createdAt: new Date("2025-07-01").toISOString(),
    updatedAt: new Date("2025-07-01").toISOString(),
  },
  {
    id: "mock-cartoon-3",
    type: "cartoon_template",
    title: "Космонавт",
    fileUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600",
    createdAt: new Date("2025-07-01").toISOString(),
    updatedAt: new Date("2025-07-01").toISOString(),
  },
];

export const mockFeedbackMessages: FeedbackMessage[] = [
  {
    id: "mock-feedback-1",
    name: "Елена Смирнова",
    email: "elena@example.com",
    message:
      "Здравствуйте! Подскажите, можно ли заказать индивидуальный дизайн рамки для свадебного альбома?",
    createdAt: new Date("2025-06-12").toISOString(),
  },
  {
    id: "mock-feedback-2",
    name: "Алексей Кузнецов",
    email: "alexey@example.com",
    message:
      "Отличный сервис! Всё работает быстро и качественно. Единственное пожелание — добавить больше мульт-шаблонов.",
    createdAt: new Date("2025-06-14").toISOString(),
  },
];

export const mockOrders: Order[] = [
  {
    id: "mock-order-1",
    userName: "Анна Петрова",
    userEmail: "anna@example.com",
    description:
      "Нужно смонтировать небольшой свадебный ролик из 3 коротких видео. Хочу добавить плавные переходы и фоновую музыку.",
    fileName: "wedding_clips.zip",
    fileType: "application/zip",
    fileData: "",
    status: "new",
    createdAt: new Date("2025-06-10").toISOString(),
    updatedAt: new Date("2025-06-10").toISOString(),
  },
  {
    id: "mock-order-2",
    userName: "Иван Соколов",
    userEmail: "ivan@example.com",
    description:
      "Есть фото товара, нужно вырезать фон и добавить его на белый фон для каталога.",
    fileName: "product_photo.jpg",
    fileType: "image/jpeg",
    fileData: "",
    status: "completed",
    createdAt: new Date("2025-06-08").toISOString(),
    updatedAt: new Date("2025-06-09").toISOString(),
  },
];
