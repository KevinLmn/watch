"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { format, subDays, addDays } from "date-fns";
import { Sidebar } from "@/components/Sidebar";
import { FeedList } from "@/components/FeedList";

interface Stats {
  total: number;
  unread: number;
  favorites: number;
  toStudy: number;
  watchLater: number;
}

function HistoryContent() {
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, favorites: 0, toStudy: 0, watchLater: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const goToPreviousDay = () => {
    setSelectedDate((d) => subDays(d, 1));
  };

  const goToNextDay = () => {
    setSelectedDate((d) => addDays(d, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex min-h-screen">
      <Sidebar stats={stats} />
      <main className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h2>
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Today
              </button>
            )}
          </div>

          <button
            onClick={goToNextDay}
            disabled={isToday}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <FeedList date={format(selectedDate, "yyyy-MM-dd")} onStatsUpdate={fetchStats} />
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

export default function HistoryPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <HistoryContent />
    </Suspense>
  );
}
