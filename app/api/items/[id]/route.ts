import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: { isRead?: boolean; isFavorite?: boolean; toStudy?: boolean; watchLater?: boolean; notes?: string } = {};

    if (typeof body.isRead === "boolean") {
      updateData.isRead = body.isRead;
    }

    if (typeof body.isFavorite === "boolean") {
      updateData.isFavorite = body.isFavorite;
    }

    if (typeof body.toStudy === "boolean") {
      updateData.toStudy = body.toStudy;
    }

    if (typeof body.watchLater === "boolean") {
      updateData.watchLater = body.watchLater;
    }

    if (typeof body.notes === "string") {
      updateData.notes = body.notes;
    }

    const item = await prisma.item.update({
      where: { id },
      data: updateData,
      include: { source: true },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
