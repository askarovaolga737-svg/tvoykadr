import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Админ-панель не настроена" },
      { status: 500 }
    );
  }

  if (parsed.data.password !== adminPassword) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const token = Buffer.from(
    JSON.stringify({ role: "admin", exp: Date.now() + 24 * 60 * 60 * 1000 })
  ).toString("base64");

  return NextResponse.json({ token });
}
