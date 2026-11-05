"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getLeaderboard,
  getReleaseStatus,
  LeaderboardItem,
  ReleaseStatusResponse,
} from "@/services/hackathonApi";
import { ReleaseResultsButton } from "@/components/ReleaseResultsButton";
import {
  Trophy,
  ExternalLink,
  Github,
  RefreshCw,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  MessageSquare,
  Lock,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HackathonLeaderboardProps {
  hackathonId: number | string;
  approvedOnly?: boolean;
  className?: string;
  showReleaseControl?: boolean;
}

export function HackathonLeaderboard({
  hackathonId,
  approvedOnly = true,
  className = "",
  showReleaseControl = true,
}: HackathonLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [resultsReleased, setResultsReleased] = useState<boolean | null>(null);
  const [resultsReleasedAt, setResultsReleasedAt] = useState<string | null>(null);
  const [releaseMessage, setReleaseMessage] = useState<string | null>(null);
  const [isOrganizerPreview, setIsOrganizerPreview] = useState(false);
  const [releaseStatus, setReleaseStatus] = useState<ReleaseStatusResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchReleaseStatus = useCallback(async () => {
    if (!hackathonId || !showReleaseControl) return;
    try {
      const status = await getReleaseStatus(hackathonId);
      setReleaseStatus(status);
      if (typeof status?.results_released === "boolean") {
        setResultsReleased(status.results_released);
      }
    } catch {
      // Regular participants may get 403 or non-organizer response; silence gracefully
      setReleaseStatus(null);
    }
  }, [hackathonId, showReleaseControl]);

  const fetchLeaderboard = useCallback(async (isManual = false) => {
    if (!hackathonId) return;
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getLeaderboard(hackathonId, approvedOnly);
      const items = Array.isArray(data?.leaderboard)
        ? data.leaderboard
        : Array.isArray(data)
        ? data
        : [];
      setLeaderboard(items);

      if (data && typeof data === "object") {
        if ("results_released" in data) {
          setResultsReleased(Boolean(data.results_released));
        }
        if ("results_released_at" in data) {
          setResultsReleasedAt(data.results_released_at || null);
        }
        if ("message" in data) {
          setReleaseMessage(data.message || null);
        }
        if ("is_organizer_preview" in data) {
          setIsOrganizerPreview(Boolean(data.is_organizer_preview));
        }
      }
    } catch (err: any) {
      console.error("Error loading leaderboard:", err);
      setError(err?.message || "Failed to load leaderboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hackathonId, approvedOnly]);

  const handleFullRefresh = useCallback(() => {
    fetchLeaderboard(true);
    fetchReleaseStatus();
  }, [fetchLeaderboard, fetchReleaseStatus]);

  useEffect(() => {
    fetchLeaderboard();
    fetchReleaseStatus();
  }, [fetchLeaderboard, fetchReleaseStatus]);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 shadow-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-500" /> 1st Place
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-400/15 text-slate-600 dark:text-slate-300 border border-slate-400/30">
          <Award className="w-3.5 h-3.5 text-slate-400" /> 2nd Place
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-700/15 text-amber-700 dark:text-amber-300 border border-amber-700/30">
          <Award className="w-3.5 h-3.5 text-amber-600" /> 3rd Place
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
        #{rank}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-[#111927] border border-gray-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 transition-colors ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-[#111927] border border-gray-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-sm transition-colors ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-indigo-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400 border border-amber-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Ranked live by validated judge scores
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {isOrganizerPreview ? (
            <span className="inline-flex items-center gap-1.5 text-xs bg-amber-500/15 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Organizer Preview
            </span>
          ) : resultsReleased ? (
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Official Results
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/50 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Live Rankings
            </span>
          )}

          {releaseStatus && (
            <ReleaseResultsButton
              hackathonId={hackathonId}
              isReleased={Boolean(resultsReleased ?? releaseStatus.results_released)}
              canRelease={releaseStatus.can_release}
              onUpdate={handleFullRefresh}
            />
          )}

          <button
            onClick={handleFullRefresh}
            disabled={refreshing}
            title="Refresh Leaderboard"
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-500" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Organizer Preview Notice Banner */}
      {isOrganizerPreview && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg shrink-0 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Organizer Preview Mode
                </span>
                <span className="text-[10px] bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  Hidden From Participants
                </span>
              </div>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-1">
                Results have not been released publicly. Review verified judge scores and rankings before publishing them to participants.
              </p>
            </div>
          </div>
          {releaseStatus?.can_release && (
            <div className="shrink-0">
              <ReleaseResultsButton
                hackathonId={hackathonId}
                isReleased={false}
                canRelease={true}
                onUpdate={handleFullRefresh}
              />
            </div>
          )}
        </div>
      )}

      {error ? (
        <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={handleFullRefresh}
            className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : resultsReleased === false && !isOrganizerPreview ? (
        <div className="py-12 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Results Not Released Yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2 leading-relaxed">
            {releaseMessage ||
              "Results for this hackathon have not been released by the organizer yet. Stay tuned!"}
          </p>
          {releaseStatus?.can_release && (
            <div className="mt-6">
              <ReleaseResultsButton
                hackathonId={hackathonId}
                isReleased={false}
                canRelease={true}
                onUpdate={handleFullRefresh}
              />
            </div>
          )}
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <Layers className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            No Evaluated Submissions Yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
            Scores and rankings will automatically update here as judges evaluate approved submissions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((item) => {
            const isExpanded = expandedId === item.submission_id;
            const score = Number(item.average_overall_score || 0);

            return (
              <motion.div
                key={item.submission_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border transition-all ${
                  item.rank === 1
                    ? "bg-amber-50/40 dark:bg-amber-950/10 border-amber-200/70 dark:border-amber-900/30"
                    : item.rank === 2
                    ? "bg-slate-50/60 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800"
                    : item.rank === 3
                    ? "bg-orange-50/40 dark:bg-orange-950/10 border-orange-200/70 dark:border-orange-900/30"
                    : "bg-gray-50/50 dark:bg-slate-900/40 border-gray-100 dark:border-slate-800/80 hover:border-gray-200 dark:hover:border-slate-700"
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Rank, Title, Team, Links */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="pt-0.5 shrink-0">{getRankBadge(item.rank)}</div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                          {item.project?.title || "Untitled Project"}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-gray-200/60 dark:border-gray-700/60">
                          Team: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.team?.name}</span>
                        </span>
                      </div>

                      {item.project?.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                          {item.project.description}
                        </p>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                        {item.project?.live_link && (
                          <a
                            href={item.project.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                          </a>
                        )}
                        {item.project?.github_url && (
                          <a
                            href={item.project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                          >
                            <Github className="w-3.5 h-3.5" /> Repository
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores & Breakdown Toggle */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-200/50 dark:border-slate-800 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="flex items-center md:justify-end gap-1.5">
                        <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          {score > 0 ? score.toFixed(1) : "—"}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">/10</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <MessageSquare className="w-3 h-3" />
                        <span>{item.review_count} review{item.review_count !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {item.score_breakdown && (
                      <button
                        onClick={() => toggleExpand(item.submission_id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
                        title="View Rubric Breakdown"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Score Breakdown Accordion */}
                <AnimatePresence>
                  {isExpanded && item.score_breakdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200/60 dark:border-slate-800/80 px-5 py-3.5 bg-white/60 dark:bg-slate-900/60 rounded-b-xl"
                    >
                      <p className="text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2.5">
                        Rubric Criteria Averages
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                        {item.score_breakdown.average_innovation !== undefined && (
                          <div className="bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg border border-gray-100 dark:border-slate-700">
                            <span className="text-gray-500 dark:text-gray-400 text-[11px] block">Innovation</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {Number(item.score_breakdown.average_innovation).toFixed(1)}/10
                            </span>
                          </div>
                        )}
                        {item.score_breakdown.average_technical !== undefined && (
                          <div className="bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg border border-gray-100 dark:border-slate-700">
                            <span className="text-gray-500 dark:text-gray-400 text-[11px] block">Technical</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {Number(item.score_breakdown.average_technical).toFixed(1)}/10
                            </span>
                          </div>
                        )}
                        {item.score_breakdown.average_user_experience !== undefined && (
                          <div className="bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg border border-gray-100 dark:border-slate-700">
                            <span className="text-gray-500 dark:text-gray-400 text-[11px] block">UX & Design</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {Number(item.score_breakdown.average_user_experience).toFixed(1)}/10
                            </span>
                          </div>
                        )}
                        {item.score_breakdown.average_impact !== undefined && (
                          <div className="bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg border border-gray-100 dark:border-slate-700">
                            <span className="text-gray-500 dark:text-gray-400 text-[11px] block">Impact</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {Number(item.score_breakdown.average_impact).toFixed(1)}/10
                            </span>
                          </div>
                        )}
                        {item.score_breakdown.average_presentation !== undefined && (
                          <div className="bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg border border-gray-100 dark:border-slate-700">
                            <span className="text-gray-500 dark:text-gray-400 text-[11px] block">Presentation</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {Number(item.score_breakdown.average_presentation).toFixed(1)}/10
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default HackathonLeaderboard;

