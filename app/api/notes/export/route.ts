import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      where: {
        notes: {
          not: null,
        },
      },
      include: { source: true },
      orderBy: { publishedAt: "desc" },
    });

    const filteredItems = items.filter((item) => item.notes && item.notes.trim() !== "");

    if (filteredItems.length === 0) {
      return NextResponse.json(
        { error: "No notes to export" },
        { status: 404 }
      );
    }

    let markdown = `# Knowledge Base\n\n`;
    markdown += `> Exported on ${format(new Date(), "MMMM d, yyyy 'at' HH:mm")}\n\n`;
    markdown += `---\n\n`;

    for (const item of filteredItems) {
      markdown += `## ${item.title}\n\n`;
      markdown += `- **Source:** ${item.source.name}\n`;
      markdown += `- **Date:** ${format(new Date(item.publishedAt), "MMMM d, yyyy")}\n`;
      markdown += `- **URL:** ${item.url}\n`;
      if (item.toStudy) {
        markdown += `- **Status:** 📚 To Study\n`;
      }
      markdown += `\n### Notes\n\n`;
      markdown += `${item.notes}\n\n`;
      markdown += `---\n\n`;
    }

    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="knowledge-base-${format(new Date(), "yyyy-MM-dd")}.md"`,
      },
    });
  } catch (error) {
    console.error("Failed to export notes:", error);
    return NextResponse.json(
      { error: "Failed to export notes" },
      { status: 500 }
    );
  }
}
