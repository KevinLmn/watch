"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { FeedList } from "@/components/FeedList";

interface Stats {
  total: number;
  unread: number;
  favorites: number;
  toStudy: number;
  watchLater: number;
}

function FavoritesContent() {
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, favorites: 0, toStudy: 0, watchLater: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="flex min-h-screen">
      <Sidebar stats={stats} />
      <main className="flex-1 flex flex-col">
        <FeedList favorites onStatsUpdate={fetchStats} />
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <FavoritesContent />
    </Suspense>
  );
}
