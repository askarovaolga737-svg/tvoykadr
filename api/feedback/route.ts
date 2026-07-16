import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { getAllFeedback, createFeedback } from "@/lib/models";
import { createFeedbackSchema } from "@/lib/validation";
import { mockFeedbackMessages } from "@/lib/mock-data";

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
      const messages = await getAllFeedback();
      return NextResponse.json(messages);
    } catch (error) {
      console.error("Ошибка получения сообщений:", error);
      return NextResponse.json(
        { error: "Ошибка получения данных из DynamoDB" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(mockFeedbackMessages);
}

export async function POST(request: NextRequest) {
  const parsed = createFeedbackSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      const message = await createFeedback({
        id: crypto.randomUUID(),
        ...parsed.data,
      });
      return NextResponse.json(message, { status: 201 });
    } catch (error) {
      console.error("Ошибка сохранения сообщения:", error);
      return NextResponse.json(
        { error: "Ошибка сохранения сообщения" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      id: "mock-" + crypto.randomUUID(),
      ...parsed.data,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
