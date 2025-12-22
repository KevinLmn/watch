"use client";

import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "./Tooltip";

interface Source {
  id: string;
  name: string;
  type: string;
  icon: string | null;
}

interface Item {
  id: string;
  title: string;
  url: string;
  description: string | null;
  thumbnail: string | null;
  publishedAt: string;
  isRead: boolean;
  isFavorite: boolean;
  toStudy: boolean;
  watchLater: boolean;
  notes: string | null;
  viewCount: number | null;
  likeCount: number | null;
  duration: number | null;
  wordCount: number | null;
  source: Source;
}

interface FeedItemProps {
  item: Item;
  isSelected: boolean;
  onToggleRead: (id: string, isRead: boolean) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onToggleToStudy: (id: string, toStudy: boolean) => void;
  onToggleWatchLater: (id: string, watchLater: boolean) => void;
  onOpenNotes: (item: Item) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatReadingTime(wordCount: number): string {
  // Average reading speed: 200-250 words per minute
  const minutes = Math.ceil(wordCount / 200);
  if (minutes < 1) return "< 1 min";
  return `${minutes} min`;
}

function getYouTubeThumbnail(url: string): string | null {
  // Extract video ID from various YouTube URL formats
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

export function FeedItem({
  item,
  isSelected,
  onToggleRead,
  onToggleFavorite,
  onToggleToStudy,
  onToggleWatchLater,
  onOpenNotes,
}: FeedItemProps) {
  const handleClick = () => {
    if (!item.isRead) {
      onToggleRead(item.id, true);
    }
    window.open(item.url, "_blank");
  };

  // Get thumbnail - prefer stored one, fallback to extracting from URL for YouTube
  const thumbnail =
    item.thumbnail ||
    (item.source.type === "youtube" ? getYouTubeThumbnail(item.url) : null);

  return (
    <article
      className={`p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
        isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
      } ${item.isRead ? "opacity-60" : ""}`}
      onClick={handleClick}
    >
      <div className="flex gap-3 sm:gap-4">
        {thumbnail && item.source.type === "youtube" && (
          <div className="flex-shrink-0 relative">
            <img
              src={thumbnail}
              alt=""
              className="w-24 h-16 sm:w-40 sm:h-24 object-cover rounded"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center opacity-90">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-base font-medium line-clamp-2 ${
                item.isRead
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {item.title}
            </h3>

            <div className="flex gap-1 flex-shrink-0">
              <Tooltip content={item.notes ? "Modifier les notes" : "Ajouter des notes"}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenNotes(item);
                  }}
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    item.notes
                      ? "text-purple-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={item.notes ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </Tooltip>

              <Tooltip content={item.watchLater ? "Retirer de 'À regarder'" : "À regarder plus tard"}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchLater(item.id, !item.watchLater);
                  }}
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    item.watchLater
                      ? "text-orange-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={item.watchLater ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </Tooltip>

              <Tooltip content={item.toStudy ? "Retirer de 'À étudier'" : "À étudier"}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleToStudy(item.id, !item.toStudy);
                  }}
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    item.toStudy
                      ? "text-blue-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={item.toStudy ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </button>
              </Tooltip>

              <Tooltip content={item.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id, !item.isFavorite);
                  }}
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    item.isFavorite
                      ? "text-yellow-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={item.isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              </Tooltip>

              <Tooltip content={item.isRead ? "Marquer comme non lu" : "Marquer comme lu"}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRead(item.id, !item.isRead);
                  }}
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    item.isRead
                      ? "text-green-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        item.isRead
                          ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      }
                    />
                  </svg>
                </button>
              </Tooltip>
            </div>
          </div>

          {item.description && (
            <p className="hidden sm:block mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {item.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                item.source.type === "youtube"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              }`}
            >
              {item.source.name}
            </span>
            <span>
              {formatDistanceToNow(new Date(item.publishedAt), {
                addSuffix: true,
              })}
            </span>

            {/* View count */}
            {item.viewCount !== null && item.viewCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatNumber(item.viewCount)}
              </span>
            )}

            {/* Like count */}
            {item.likeCount !== null && item.likeCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                {formatNumber(item.likeCount)}
              </span>
            )}

            {/* Duration for videos */}
            {item.duration !== null && item.duration > 0 && (
              <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDuration(item.duration)}
              </span>
            )}

            {/* Reading time for articles */}
            {item.wordCount !== null && item.wordCount > 0 && (
              <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {formatReadingTime(item.wordCount)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
