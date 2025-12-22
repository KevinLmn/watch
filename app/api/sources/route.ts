import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            items: { where: { isRead: false } },
          },
        },
      },
    });

    return NextResponse.json(sources);
  } catch (error) {
    console.error("Failed to fetch sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, url, type } = await request.json();

    // Validate input
    if (!name || !url || !type) {
      return NextResponse.json(
        { error: "Name, URL and type are required" },
        { status: 400 }
      );
    }

    // Check if source already exists
    const existing = await prisma.source.findUnique({
      where: { url },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Source with this URL already exists" },
        { status: 409 }
      );
    }

    const source = await prisma.source.create({
      data: {
        name,
        url,
        type,
        enabled: true,
      },
    });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error("Failed to create source:", error);
    return NextResponse.json(
      { error: "Failed to create source" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, enabled } = await request.json();

    const source = await prisma.source.update({
      where: { id },
      data: { enabled },
    });

    return NextResponse.json(source);
  } catch (error) {
    console.error("Failed to update source:", error);
    return NextResponse.json(
      { error: "Failed to update source" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Source ID is required" },
        { status: 400 }
      );
    }

    // Delete all items from this source first (cascade should handle this but being explicit)
    await prisma.item.deleteMany({
      where: { sourceId: id },
    });

    await prisma.source.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete source:", error);
    return NextResponse.json(
      { error: "Failed to delete source" },
      { status: 500 }
    );
  }
}
