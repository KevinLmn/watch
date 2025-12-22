import Parser from "rss-parser";
import { prisma } from "./db";

// Custom parser with YouTube media fields
const parser: Parser<Record<string, unknown>, {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  description?: string;
  "media:group"?: {
    "media:thumbnail"?: Array<{ $: { url: string } }>;
    "media:community"?: {
      "media:statistics"?: Array<{ $: { views: string } }>;
      "media:starRating"?: Array<{ $: { count: string } }>;
    };
  };
  "yt:videoId"?: string;
}> = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Veille-Feed-Reader/1.0",
  },
  customFields: {
    item: [
      ["media:group", "media:group"],
      ["yt:videoId", "yt:videoId"],
    ],
  },
});

interface FeedItem {
  title: string;
  link: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  description?: string;
  thumbnail?: string;
  viewCount?: number;
  likeCount?: number;
  videoId?: string;
  wordCount?: number;
}

function countWords(text: string | undefined): number {
  if (!text) return 0;
  // Remove HTML tags and count words
  const cleanText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!cleanText) return 0;
  return cleanText.split(/\s+/).length;
}

export async function parseFeed(url: string): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    const isYouTube = url.includes("youtube.com/feeds");

    return (feed.items || []).map((item) => {
      let thumbnail: string | undefined;
      let viewCount: number | undefined;
      let likeCount: number | undefined;
      const videoId = item["yt:videoId"];

      // Extract YouTube-specific data
      if (isYouTube && videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

        // Try to get media stats if available
        const mediaGroup = item["media:group"];
        if (mediaGroup) {
          const stats = mediaGroup["media:community"]?.["media:statistics"]?.[0]?.$;
          if (stats?.views) {
            viewCount = parseInt(stats.views, 10);
          }
          const rating = mediaGroup["media:community"]?.["media:starRating"]?.[0]?.$;
          if (rating?.count) {
            likeCount = parseInt(rating.count, 10);
          }
        }
      }

      // Calculate word count for articles (not YouTube videos)
      const wordCount = !isYouTube
        ? countWords(item.content || item.description || item.contentSnippet)
        : undefined;

      return {
        title: item.title || "Untitled",
        link: item.link || "",
        pubDate: item.pubDate,
        isoDate: item.isoDate,
        contentSnippet: item.contentSnippet,
        content: item.content,
        description: item.description,
        thumbnail,
        viewCount,
        likeCount,
        videoId,
        wordCount,
      };
    });
  } catch (error) {
    console.error(`Failed to parse feed ${url}:`, error);
    return [];
  }
}

export async function refreshAllFeeds(): Promise<{
  added: number;
  errors: string[];
}> {
  const sources = await prisma.source.findMany({
    where: { enabled: true },
  });

  let totalAdded = 0;
  const errors: string[] = [];

  for (const source of sources) {
    try {
      const items = await parseFeed(source.url);

      for (const item of items) {
        if (!item.link) continue;

        const publishedAt = item.isoDate || item.pubDate;

        // For YouTube, generate thumbnail from URL if not provided
        let thumbnail: string | null | undefined = item.thumbnail;
        if (!thumbnail && source.type === "youtube") {
          thumbnail = extractYouTubeThumbnail(item.link);
        }
        if (!thumbnail) {
          thumbnail = extractThumbnail(item.content || item.description);
        }

        try {
          await prisma.item.upsert({
            where: { url: item.link },
            update: {
              // Update view/like counts if we have them
              ...(item.viewCount !== undefined && { viewCount: item.viewCount }),
              ...(item.likeCount !== undefined && { likeCount: item.likeCount }),
            },
            create: {
              sourceId: source.id,
              title: item.title,
              url: item.link,
              description:
                item.contentSnippet || item.description || item.content || null,
              thumbnail: thumbnail || null,
              publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
              viewCount: item.viewCount || null,
              likeCount: item.likeCount || null,
              wordCount: item.wordCount || null,
            },
          });
          totalAdded++;
        } catch {
          // Item already exists, skip
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      errors.push(`${source.name}: ${message}`);
    }
  }

  return { added: totalAdded, errors };
}

function extractYouTubeThumbnail(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
  }
  return null;
}

function extractThumbnail(content: string | undefined): string | null {
  if (!content) return null;

  // Try to find YouTube thumbnail in content
  const ytMatch = content.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
  }

  // Try to find any image in content
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch) {
    return imgMatch[1];
  }

  return null;
}

export async function refreshSource(sourceId: string): Promise<number> {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
  });

  if (!source) {
    throw new Error("Source not found");
  }

  const items = await parseFeed(source.url);
  let added = 0;

  for (const item of items) {
    if (!item.link) continue;

    const publishedAt = item.isoDate || item.pubDate;

    let thumbnail: string | null | undefined = item.thumbnail;
    if (!thumbnail && source.type === "youtube") {
      thumbnail = extractYouTubeThumbnail(item.link);
    }
    if (!thumbnail) {
      thumbnail = extractThumbnail(item.content || item.description);
    }

    try {
      await prisma.item.upsert({
        where: { url: item.link },
        update: {
          ...(item.viewCount !== undefined && { viewCount: item.viewCount }),
          ...(item.likeCount !== undefined && { likeCount: item.likeCount }),
        },
        create: {
          sourceId: source.id,
          title: item.title,
          url: item.link,
          description:
            item.contentSnippet || item.description || item.content || null,
          thumbnail: thumbnail || null,
          publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
          viewCount: item.viewCount || null,
          likeCount: item.likeCount || null,
          wordCount: item.wordCount || null,
        },
      });
      added++;
    } catch {
      // Item already exists
    }
  }

  return added;
}
