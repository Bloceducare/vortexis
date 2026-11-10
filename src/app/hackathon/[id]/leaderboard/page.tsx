"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useHackathon from "@/hooks/useHackathon";
import { useHackathonStore } from "@/store/useHackathonStore";
import { HackathonLeaderboard } from "@/components/HackathonLeaderboard";
import { LiveJudgeReviews } from "@/components/LiveJudgeReviews";
import { ArrowLeft, Trophy, Sparkles, Calendar, Users } from "lucide-react";

export default function HackathonLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "";
  const hackathonSlug = decodeURIComponent(rawId).toLowerCase().replace(/\s+/g, "-");

  const { getHackathonByName, getHackathonById } = useHackathon();

  // Try fetching by name/slug if string, or ID if numeric
  const isNumeric = /^\d+$/.test(rawId);
  const { data: hackathonByNameData, isLoading: loadingByName } = getHackathonByName(
    !isNumeric ? hackathonSlug : ""
  );

  const activeHackathon = useHackathonStore((state) => state.activeHackathon);
  const storeId = activeHackathon?.id ? String(activeHackathon.id) : "";
  const targetLookupId = isNumeric ? rawId : storeId;

  const { data: hackathonByIdData, isLoading: loadingById } = getHackathonById(
    targetLookupId
  );

  const hackathonDetail =
    hackathonByIdData ||
    hackathonByNameData?.hackathon ||
    hackathonByNameData ||
    activeHackathon;

  const numericHackathonId =
    hackathonDetail?.id || (isNumeric ? Number(rawId) : undefined);

  const title = hackathonDetail?.title || "Hackathon Leaderboard";
  const isLoading = (!numericHackathonId && (loadingByName || loadingById));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href={`/hackathon/${rawId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hackathon Overview
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Official Results
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-10 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium">
                <Trophy className="w-4 h-4 text-amber-300" /> Evaluation & Standings
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {title}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base max-w-2xl">
                Explore the verified submission rankings, judge rubric score breakdowns, and live evaluation updates.
              </p>
            </div>

            {hackathonDetail?.grand_prize && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-right shrink-0">
                <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block">
                  Grand Prize Pool
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                  ${Number(hackathonDetail.grand_prize).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
            <p className="text-sm">Loading hackathon data...</p>
          </div>
        ) : numericHackathonId ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leaderboard Table (2 cols) */}
            <div className="lg:col-span-2">
              <HackathonLeaderboard
                hackathonId={numericHackathonId}
                approvedOnly={true}
              />
            </div>
          </div>
        ) : (
          <div className="p-10 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Could not determine hackathon identifier.
            </p>
            <Link
              href="/hackathon"
              className="mt-3 inline-block text-sm text-indigo-600 dark:text-indigo-400 underline font-semibold"
            >
              Browse all hackathons
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

