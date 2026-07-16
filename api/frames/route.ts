import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { getContentByType } from "@/lib/models";
import { mockContentItems } from "@/lib/mock-data";

export async function GET(_request: NextRequest) {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      const frames = await getContentByType("frame");
      return NextResponse.json(frames);
    } catch (error) {
      console.error("Ошибка получения рамок:", error);
      return NextResponse.json(
        { error: "Ошибка получения данных из DynamoDB" },
        { status: 500 }
      );
    }
  }

  const frames = mockContentItems.filter((item) => item.type === "frame");
  return NextResponse.json(frames);
}
