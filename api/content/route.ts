import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import {
  getAllContent,
  createContentItem,
  deleteContentItem,
} from "@/lib/models";
import { createContentSchema } from "@/lib/validation";
import { mockContentItems } from "@/lib/mock-data";
import fs from "fs";
import path from "path";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_VIDEO_TYPES = ["video/mp4"];

function verifyAdminToken(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(authHeader.slice(7), "base64").toString()
    );
    return payload.role === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
  }

  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      const items = await getAllContent();
      return NextResponse.json(items);
    } catch (error) {
      console.error("Ошибка получения контента:", error);
      return NextResponse.json(
        { error: "Ошибка получения данных из DynamoDB" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(mockContentItems);
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
  }

  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return NextResponse.json(
      { error: "База данных недоступна в статическом режиме" },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Файл обязателен" }, { status: 400 });
  }

  const parsed = createContentSchema.safeParse({
    type,
    title,
    fileUrl: "placeholder",
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const allowedTypes =
    parsed.data.type === "video" || parsed.data.type === "video_template"
      ? ALLOWED_VIDEO_TYPES
      : ALLOWED_IMAGE_TYPES;

  if (!allowedTypes.includes(file.type)) {
    const typeLabel =
      parsed.data.type === "video" || parsed.data.type === "video_template"
        ? "видео"
        : "изображения";
    return NextResponse.json(
      {
        error: `Неподдерживаемый формат файла. Для ${typeLabel} допустимы: ${allowedTypes.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const maxSize =
    parsed.data.type === "video" || parsed.data.type === "video_template"
      ? 50 * 1024 * 1024
      : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    const mb = maxSize / 1024 / 1024;
    return NextResponse.json(
      { error: `Файл слишком большой. Максимальный размер: ${mb}MB` },
      { status: 400 }
    );
  }

  const ext =
    file.name.split(".").pop() ||
    (parsed.data.type === "video" || parsed.data.type === "video_template"
      ? "mp4"
      : "jpg");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);

  const fileUrl = `/uploads/${filename}`;

  try {
    const item = await createContentItem({
      id: crypto.randomUUID(),
      type: parsed.data.type,
      title: parsed.data.title,
      fileUrl,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Ошибка создания контента:", error);
    return NextResponse.json(
      { error: "Ошибка создания контента" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
  }

  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return NextResponse.json(
      { error: "База данных недоступна в статическом режиме" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Параметр id обязателен" },
        { status: 400 }
      );
    }

    await deleteContentItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка удаления контента:", error);
    return NextResponse.json(
      { error: "Ошибка удаления контента" },
      { status: 500 }
    );
  }
}
