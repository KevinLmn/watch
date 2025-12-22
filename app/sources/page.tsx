"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

interface Stats {
  total: number;
  unread: number;
  favorites: number;
  toStudy: number;
  watchLater: number;
}

interface Source {
  id: string;
  name: string;
  url: string;
  type: string;
  icon: string | null;
  enabled: boolean;
  _count: {
    items: number;
  };
}

function SourcesContent() {
  const searchParams = useSearchParams();
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, favorites: 0, toStudy: 0, watchLater: 0 });
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<"youtube" | "newsletter">("youtube");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch("/api/sources");
      const data = await res.json();
      setSources(data);
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchSources();
  }, [fetchStats, fetchSources]);

  const toggleSource = async (id: string, enabled: boolean) => {
    try {
      await fetch("/api/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled }),
      });
      setSources((sources) =>
        sources.map((s) => (s.id === id ? { ...s, enabled } : s))
      );
    } catch (error) {
      console.error("Failed to toggle source:", error);
    }
  };

  const deleteSource = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and all its items?`)) return;

    try {
      await fetch(`/api/sources?id=${id}`, { method: "DELETE" });
      setSources((sources) => sources.filter((s) => s.id !== id));
      fetchStats();
    } catch (error) {
      console.error("Failed to delete source:", error);
    }
  };

  const addSource = async (name: string, url: string, type: string) => {
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, type }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to add source");
        return false;
      }

      await fetchSources();
      return true;
    } catch (error) {
      console.error("Failed to add source:", error);
      return false;
    }
  };

  const newsletters = sources.filter((s) => s.type === "newsletter");
  const youtube = sources.filter((s) => s.type === "youtube");

  return (
    <div className="flex min-h-screen">
      <Sidebar stats={stats} />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sources
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Newsletters ({newsletters.length})
                </h2>
                <button
                  onClick={() => {
                    setAddType("newsletter");
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              <div className="grid gap-3">
                {newsletters.map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    onToggle={toggleSource}
                    onDelete={deleteSource}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  YouTube ({youtube.length})
                </h2>
                <button
                  onClick={() => {
                    setAddType("youtube");
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Channel
                </button>
              </div>
              <div className="grid gap-3">
                {youtube.map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    onToggle={toggleSource}
                    onDelete={deleteSource}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {showAddModal && (
          <AddSourceModal
            type={addType}
            onClose={() => setShowAddModal(false)}
            onAdd={addSource}
          />
        )}
      </main>
    </div>
  );
}

function SourceCard({
  source,
  onToggle,
  onDelete,
}: {
  source: Source;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${
        !source.enabled ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {source.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {source.url}
        </p>
      </div>

      {source._count.items > 0 && (
        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
          {source._count.items} unread
        </span>
      )}

      <button
        onClick={() => onToggle(source.id, !source.enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          source.enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            source.enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      <button
        onClick={() => onDelete(source.id, source.name)}
        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Delete source"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function AddSourceModal({
  type,
  onClose,
  onAdd,
}: {
  type: "youtube" | "newsletter";
  onClose: () => void;
  onAdd: (name: string, url: string, type: string) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalUrl = url;
    let finalName = name;

    if (type === "youtube") {
      // If user provided a channel ID, construct the RSS URL
      if (channelId) {
        finalUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      }
      // If no name provided, use a default
      if (!finalName && channelId) {
        finalName = `YouTube Channel ${channelId.slice(0, 8)}...`;
      }
    }

    const success = await onAdd(finalName, finalUrl, type);
    setLoading(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add {type === "youtube" ? "YouTube Channel" : "Newsletter"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "youtube" ? "Channel name" : "Newsletter name"}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {type === "youtube" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Channel ID
                </label>
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="UCxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Find it on the channel page URL or use the RSS URL below
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RSS Feed URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/feeds/videos.xml?channel_id=..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                RSS Feed URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/feed.xml"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!url && !channelId)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Source"}
            </button>
          </div>
        </form>
      </div>
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

export default function SourcesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SourcesContent />
    </Suspense>
  );
}
