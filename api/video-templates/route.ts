import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { getContentByType } from "@/lib/models";
import { mockContentItems } from "@/lib/mock-data";

export async function GET(_request: NextRequest) {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      const templates = await getContentByType("video_template");
      return NextResponse.json(templates);
    } catch (error) {
      console.error("Ошибка получения видео-шаблонов:", error);
      return NextResponse.json(
        { error: "Ошибка получения данных из DynamoDB" },
        { status: 500 }
      );
    }
  }

  const templates = mockContentItems.filter(
    (item) => item.type === "video_template"
  );
  return NextResponse.json(templates);
}
