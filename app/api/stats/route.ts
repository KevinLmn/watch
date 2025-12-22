import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [total, unread, favorites, toStudy, watchLater] = await Promise.all([
      prisma.item.count(),
      prisma.item.count({ where: { isRead: false } }),
      prisma.item.count({ where: { isFavorite: true } }),
      prisma.item.count({ where: { toStudy: true } }),
      prisma.item.count({ where: { watchLater: true } }),
    ]);

    return NextResponse.json({ total, unread, favorites, toStudy, watchLater });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
