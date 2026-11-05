"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getLiveReviews, LiveReviewItem } from "@/services/hackathonApi";
import { Zap, MessageSquare, ExternalLink, RefreshCw, UserCheck } from "lucide-react";

interface LiveJudgeReviewsProps {
  hackathonId: number | string;
  pollIntervalMs?: number;
  className?: string;
}

export function LiveJudgeReviews({
  hackathonId,
  pollIntervalMs = 15000,
  className = "",
}: LiveJudgeReviewsProps) {
  const [reviews, setReviews] = useState<LiveReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = useCallback(async (manual = false) => {
    if (!hackathonId) return;
    if (manual) setRefreshing(true);

    try {
      const data = await getLiveReviews(hackathonId);
      const items = Array.isArray(data?.reviews)
        ? data.reviews
        : Array.isArray(data)
        ? data
        : [];
      setReviews(items);
    } catch (err) {
      console.error("Error fetching live reviews:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hackathonId]);

  useEffect(() => {
    fetchReviews();
    if (pollIntervalMs > 0) {
      const interval = setInterval(() => fetchReviews(), pollIntervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchReviews, pollIntervalMs]);

  return (
    <div
      className={`bg-white dark:bg-[#111927] border border-gray-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          Live Judges Feed
        </h3>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>

          <button
            onClick={() => fetchReviews(true)}
            disabled={refreshing}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Refresh Feed"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-500" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 bg-gray-100 dark:bg-slate-800/60 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No judge reviews submitted yet.</p>
          </div>
        ) : (
          reviews.map((r) => {
            const judgeName =
              r.judge?.first_name ||
              (r.judge?.username
                ? `@${r.judge.username}`
                : "Verified Judge");

            return (
              <div
                key={r.id}
                className="p-4 bg-gray-50/70 dark:bg-slate-900/80 rounded-xl border border-gray-200/70 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-gray-900 dark:text-white text-sm block truncate">
                      {r.project?.title || "Project"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by Team <strong className="font-semibold text-gray-700 dark:text-gray-300">{r.team?.name}</strong>
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                    {r.overall_score}/10
                  </span>
                </div>

                {r.review && (
                  <p className="text-xs text-gray-700 dark:text-slate-300 mt-2.5 italic bg-white/70 dark:bg-slate-800/60 p-2.5 rounded-lg border border-gray-100 dark:border-slate-800">
                    "{r.review}"
                  </p>
                )}

                <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{judgeName}</span>
                  </span>
                  <span>
                    {r.created_at
                      ? new Date(r.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export default LiveJudgeReviews;

