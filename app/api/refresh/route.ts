import { NextResponse } from "next/server";
import { refreshAllFeeds } from "@/lib/feed-parser";

export async function POST() {
  try {
    const result = await refreshAllFeeds();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to refresh feeds:", error);
    return NextResponse.json(
      { error: "Failed to refresh feeds" },
      { status: 500 }
    );
  }
}

export const maxDuration = 60;
