import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrderById,
} from "@/lib/models";
import { createOrderSchema, updateOrderSchema } from "@/lib/validation";
import { mockOrders } from "@/lib/mock-data";

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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const dbAvailable = await isDatabaseAvailable();

  if (id) {
    if (dbAvailable) {
      try {
        const order = await getOrderById(id);
        if (!order) {
          return NextResponse.json(
            { error: "Заказ не найден" },
            { status: 404 }
          );
        }
        return NextResponse.json(order);
      } catch (error) {
        console.error("Ошибка получения заказа:", error);
        return NextResponse.json(
          { error: "Ошибка получения данных из DynamoDB" },
          { status: 500 }
        );
      }
    }
    const mockOrder = mockOrders.find((o) => o.id === id);
    if (!mockOrder) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }
    return NextResponse.json(mockOrder);
  }

  if (dbAvailable) {
    try {
      const orders = await getAllOrders();
      return NextResponse.json(orders);
    } catch (error) {
      console.error("Ошибка получения заказов:", error);
      return NextResponse.json(
        { error: "Ошибка получения данных из DynamoDB" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(mockOrders);
}

export async function POST(request: NextRequest) {
  const parsed = createOrderSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      const order = await createOrder({
        id: crypto.randomUUID(),
        ...parsed.data,
      });
      return NextResponse.json(order, { status: 201 });
    } catch (error) {
      console.error("Ошибка создания заказа:", error);
      return NextResponse.json(
        { error: "Ошибка создания заказа" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      id: "mock-" + crypto.randomUUID(),
      ...parsed.data,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}

export async function PATCH(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Параметр id обязателен" },
      { status: 400 }
    );
  }

  const parsed = updateOrderSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const order = await updateOrderStatus(id, parsed.data.status);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Ошибка обновления заказа:", error);
    return NextResponse.json(
      { error: "Ошибка обновления заказа" },
      { status: 500 }
    );
  }
}
