import { isDatabaseAvailable } from "@/lib/db";
import { getAllContent, getAllOrders, getAllFeedback } from "@/lib/models";
import {
  mockContentItems,
  mockOrders,
  mockFeedbackMessages,
} from "@/lib/mock-data";
import { AdminPanel } from "@/components/admin-panel";

export const dynamic = "force-dynamic";

async function getContent() {
  if (await isDatabaseAvailable()) {
    try {
      return { items: await getAllContent(), dbAvailable: true };
    } catch {
      // fall through to mock data
    }
  }
  return { items: mockContentItems, dbAvailable: false };
}

async function getOrders() {
  if (await isDatabaseAvailable()) {
    try {
      return await getAllOrders();
    } catch {
      // fall through to mock data
    }
  }
  return mockOrders;
}

async function getFeedback() {
  if (await isDatabaseAvailable()) {
    try {
      return await getAllFeedback();
    } catch {
      // fall through to mock data
    }
  }
  return mockFeedbackMessages;
}

export default async function AdminPage() {
  const { items, dbAvailable } = await getContent();
  const orders = await getOrders();
  const feedback = await getFeedback();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
        <p className="text-muted-foreground">
          Управление контентом платформы ТвойКадр
        </p>
      </div>
      <AdminPanel
        initialItems={items}
        initialOrders={orders}
        initialFeedback={feedback}
        dbAvailable={dbAvailable}
      />
    </div>
  );
}
