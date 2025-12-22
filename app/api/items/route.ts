import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay, subDays } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "newsletter" | "youtube" | null
    const date = searchParams.get("date"); // ISO date string
    const search = searchParams.get("search");
    const favorites = searchParams.get("favorites") === "true";
    const unread = searchParams.get("unread") === "true";
    const toStudy = searchParams.get("toStudy") === "true";
    const watchLater = searchParams.get("watchLater") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: {
      source?: { type: string };
      publishedAt?: { gte: Date; lte: Date };
      title?: { contains: string; mode: "insensitive" };
      isFavorite?: boolean;
      isRead?: boolean;
      toStudy?: boolean;
      watchLater?: boolean;
    } = {};

    if (type) {
      where.source = { type };
    }

    if (date) {
      const targetDate = new Date(date);
      where.publishedAt = {
        gte: startOfDay(targetDate),
        lte: endOfDay(targetDate),
      };
    } else if (!favorites && !search && !toStudy && !watchLater) {
      // Default: last 7 days
      where.publishedAt = {
        gte: subDays(new Date(), 7),
        lte: new Date(),
      };
    }

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (favorites) {
      where.isFavorite = true;
    }

    if (unread) {
      where.isRead = false;
    }

    if (toStudy) {
      where.toStudy = true;
    }

    if (watchLater) {
      where.watchLater = true;
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: { source: true },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.item.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
