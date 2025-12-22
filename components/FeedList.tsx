"use client";

import { useEffect, useState, useCallback } from "react";
import { FeedItem } from "./FeedItem";
import { SearchBar } from "./SearchBar";
import { NotesEditor } from "./NotesEditor";

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

interface FeedListProps {
  type?: string;
  date?: string;
  favorites?: boolean;
  toStudy?: boolean;
  watchLater?: boolean;
  onStatsUpdate?: () => void;
}

export function FeedList({ type, date, favorites, toStudy, watchLater, onStatsUpdate }: FeedListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [notesItem, setNotesItem] = useState<Item | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (date) params.set("date", date);
      if (favorites) params.set("favorites", "true");
      if (toStudy) params.set("toStudy", "true");
      if (watchLater) params.set("watchLater", "true");
      if (search) params.set("search", search);

      const res = await fetch(`/api/items?${params}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  }, [type, date, favorites, toStudy, watchLater, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/refresh", { method: "POST" });
      await fetchItems();
      onStatsUpdate?.();
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });
      setItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, isRead } : item
        )
      );
      onStatsUpdate?.();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      });
      setItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, isFavorite } : item
        )
      );
      onStatsUpdate?.();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleToggleToStudy = async (id: string, toStudyValue: boolean) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStudy: toStudyValue }),
      });
      setItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, toStudy: toStudyValue } : item
        )
      );
      onStatsUpdate?.();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleToggleWatchLater = async (id: string, watchLater: boolean) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchLater }),
      });
      setItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, watchLater } : item
        )
      );
      onStatsUpdate?.();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case "j":
          setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
          break;
        case "k":
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "r":
          if (items[selectedIndex]) {
            handleToggleRead(items[selectedIndex].id, !items[selectedIndex].isRead);
          }
          break;
        case "f":
          if (items[selectedIndex]) {
            handleToggleFavorite(items[selectedIndex].id, !items[selectedIndex].isFavorite);
          }
          break;
        case "s":
          if (items[selectedIndex]) {
            handleToggleToStudy(items[selectedIndex].id, !items[selectedIndex].toStudy);
          }
          break;
        case "w":
          if (items[selectedIndex]) {
            handleToggleWatchLater(items[selectedIndex].id, !items[selectedIndex].watchLater);
          }
          break;
        case "n":
          if (items[selectedIndex]) {
            setNotesItem(items[selectedIndex]);
          }
          break;
        case "o":
        case "Enter":
          if (items[selectedIndex]) {
            window.open(items[selectedIndex].url, "_blank");
            if (!items[selectedIndex].isRead) {
              handleToggleRead(items[selectedIndex].id, true);
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex]);

  return (
    <div className="flex-1 flex flex-col">
      <SearchBar
        onSearch={setSearch}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>No items found</p>
            <button
              onClick={handleRefresh}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Refresh feeds
            </button>
          </div>
        ) : (
          <div>
            {items.map((item, index) => (
              <FeedItem
                key={item.id}
                item={item}
                isSelected={index === selectedIndex}
                onToggleRead={handleToggleRead}
                onToggleFavorite={handleToggleFavorite}
                onToggleToStudy={handleToggleToStudy}
                onToggleWatchLater={handleToggleWatchLater}
                onOpenNotes={(item) => setNotesItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Keyboard shortcuts - hidden on mobile */}
      <div className="hidden sm:block p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">j</kbd>/
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">k</kbd> navigate
        <span className="mx-2">|</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">o</kbd> open
        <span className="mx-2">|</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">r</kbd> read
        <span className="mx-2">|</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">f</kbd> favorite
        <span className="mx-2">|</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">s</kbd> study
        <span className="mx-2">|</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">w</kbd> watch later
        <span className="mx-2">|</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">n</kbd> notes
      </div>

      <NotesEditor
        item={notesItem}
        isOpen={notesItem !== null}
        onClose={() => setNotesItem(null)}
        onSave={handleSaveNotes}
      />
    </div>
  );
}
