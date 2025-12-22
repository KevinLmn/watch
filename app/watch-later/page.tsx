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

function WatchLaterContent() {
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
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Later
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Content saved for later viewing
          </p>
        </div>
        <FeedList watchLater onStatsUpdate={fetchStats} />
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

export default function WatchLaterPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <WatchLaterContent />
    </Suspense>
  );
}
