"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useHackathon from "@/hooks/useHackathon";
import useOrganizer from "@/hooks/useOrganizers";
import { useRouter, useParams } from "next/navigation";
import {
  MapPin,
  Trophy,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  Share2,
  Check,
  Building2,
  ShieldCheck,
  Layers,
  ChevronRight,
  ExternalLink,
  Flame,
  Globe,
} from "lucide-react";
import StatusModal from "@/components/StatusModal";
import { useUserHackathonsStore } from "@/store/useUserHackathons";
import { useQueryClient } from "@tanstack/react-query";
import { useHackathonStore } from "@/store/useHackathonStore";
import { slugify, normalizeContent } from "@/lib/utils";
import HackathonContentRenderer from "@/app/hackathon/component/HackathonContentRenderer";
import HackathonLeaderboard from "@/components/HackathonLeaderboard";
import LiveJudgeReviews from "@/components/LiveJudgeReviews";
import Link from "next/link";

type TabType = "overview" | "prizes" | "rules" | "schedule" | "leaderboard";

function Hack() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { getHackathonById, registerUserForHackathon, getHackathonByName } =
    useHackathon();
  const { getOrganizationById } = useOrganizer();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState("");

  const registerMutation = registerUserForHackathon();
  const [modal, setModal] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const hackathonSlug = params?.id
    ? decodeURIComponent(params.id as string)
        .toLowerCase()
        .replace(/\s+/g, "-")
    : "";

  const { data: hackathonDet, isLoading: isDetLoading } =
    getHackathonByName(hackathonSlug);

  const activeHackathon = useHackathonStore((state) => state.activeHackathon);
  const storeHackathonId = activeHackathon?.id;

  const { data: hackathonData, isLoading: isIdLoading } = getHackathonById(
    storeHackathonId as string
  );

  const hackathonDetail =
    hackathonData || hackathonDet?.hackathon || hackathonDet;

  const orgId =
    hackathonDetail?.organization_id ??
    (typeof hackathonDetail?.organization === "object"
      ? hackathonDetail?.organization?.id
      : hackathonDetail?.organization);

  const { data: organizationApiData } = getOrganizationById(
    orgId ? String(orgId) : ""
  );

  const organization =
    organizationApiData?.data ||
    organizationApiData ||
    (typeof hackathonDetail?.organization === "object"
      ? hackathonDetail?.organization
      : null);

  const organizerName =
    organization?.name ||
    hackathonDetail?.organization_name ||
    "Tangiro";

  const organizerLogo =
    organization?.logo ||
    organization?.logo_file ||
    hackathonDetail?.organization_logo ||
    null;

  const targetHackathonId =
    storeHackathonId || hackathonDetail?.id || hackathonDet?.hackathon?.id;

  const { hackathons, addHackathon } = useUserHackathonsStore();

  const isRegisteredState = Boolean(
    targetHackathonId &&
      hackathons.some((h) => Number(h?.id) === Number(targetHackathonId))
  );

  const isDeadlinePassed = useMemo(() => {
    const deadlineStr =
      hackathonDetail?.submission_deadline ||
      hackathonDetail?.end_date ||
      hackathonDetail?.start_date;
    if (!deadlineStr) return false;
    return new Date(deadlineStr).getTime() < Date.now();
  }, [
    hackathonDetail?.submission_deadline,
    hackathonDetail?.end_date,
    hackathonDetail?.start_date,
  ]);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "TBA";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    const targetDateStr =
      hackathonDetail?.start_date || hackathonDetail?.submission_deadline;
    if (!targetDateStr) return;

    const interval = setInterval(() => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown("🚀 Live Now!");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hackathonDetail?.start_date, hackathonDetail?.submission_deadline]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const onRegister = () => {
    if (isRegisteredState) {
      const slug = slugify(hackathonDetail?.title || hackathonSlug);
      router.push(`/dashboard/${slug}/hackathon`);
      return;
    }

    if (!targetHackathonId) return;

    registerMutation.mutate(String(targetHackathonId), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["participant_hackathon"] });
        addHackathon(hackathonDetail);
        setModal({
          open: true,
          type: "success",
          message: "You have successfully registered for this hackathon!",
        });
      },
      onError: (error: any) => {
        setModal({
          open: true,
          type: "error",
          message: error?.message || "Something went wrong. Please try again.",
        });
      },
    });
  };

  const isLoading = isDetLoading && isIdLoading && !hackathonDetail;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 pt-24">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-64 sm:h-80 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!hackathonDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
        >
          <div className="w-14 h-14 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Hackathon Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            We couldn't load the details for this hackathon. It may have been
            removed or the link is invalid.
          </p>
          <button
            onClick={() => router.push("/hackathon")}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all"
          >
            Explore Hackathons
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFE] dark:bg-[#0B0F17] transition-colors pb-24">
      {/* 1. HERO COVER BANNER (DoraHacks Style) */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-900">
        {hackathonDetail.banner_image ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
            style={{ backgroundImage: `url(${hackathonDetail.banner_image})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#0F172A]">
            {/* Geometric Cyber Mesh Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/50 to-transparent" />
      </div>

      {/* 2. HACKATHON PROFILE & METRICS HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 sm:-mt-32 md:-mt-36 z-10 bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-800/80 mb-8 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-gray-100 dark:border-gray-800/80">
            {/* Left: Avatar + Title & Meta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1 min-w-0">
              {/* Logo / Badge */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 p-1 shadow-xl shrink-0 flex items-center justify-center text-white">
                <div className="w-full h-full bg-[#121824] rounded-[14px] flex items-center justify-center overflow-hidden">
                  {organizerLogo ? (
                    <img
                      src={organizerLogo}
                      alt={organizerName}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)]" />
                  )}
                </div>
              </div>

              {/* Title & Tag Badges */}
              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      isDeadlinePassed
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                        : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/60"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDeadlinePassed
                          ? "bg-gray-400"
                          : "bg-emerald-500 animate-pulse"
                      }`}
                    />
                    {isDeadlinePassed ? "Registration Closed" : "Live & Active"}
                  </span>

                  {/* Format Badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-800/40">
                    <Globe className="w-3.5 h-3.5" />
                    {hackathonDetail.venue || "Virtual"}
                  </span>

                  {/* Web3 Chip */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/40 dark:border-purple-800/40">
                    <Flame className="w-3.5 h-3.5" />
                    Web3 Bounties
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                  {hackathonDetail.title}
                </h1>

                {/* Organizer Info */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {organizerLogo ? (
                    <img
                      src={organizerLogo}
                      alt={organizerName}
                      className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0 inline"
                    />
                  ) : (
                    <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  )}
                  <span>Hosted by</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                    {organizerName}
                    {organization?.is_approved && (
                      <ShieldCheck className="w-4 h-4 text-blue-500 inline" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Primary Action + Share */}
            <div className="flex sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all cursor-pointer"
                title="Share hackathon"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRegister}
                disabled={
                  registerMutation.isPending ||
                  (isDeadlinePassed && !isRegisteredState)
                }
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-lg transition-all ${
                  isRegisteredState
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-500/20"
                    : isDeadlinePassed
                    ? "bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-linear-to-r from-[#605DEC] via-indigo-600 to-purple-600 hover:from-[#5046d8] hover:to-purple-700 text-white cursor-pointer shadow-indigo-500/25"
                } ${registerMutation.isPending ? "opacity-60" : ""}`}
              >
                {registerMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : isRegisteredState ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    View Workspace
                  </>
                ) : isDeadlinePassed ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Registration Closed
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Register for Hackathon
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Quick Metrics Strip (DoraHacks Signature Stat Strip) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            {/* Stat 1: Prize Pool */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 truncate">
                  Total Prize Pool
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white truncate">
                  ${Number(hackathonDetail.grand_prize || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Stat 2: Participants */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/40">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                  Registered
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white truncate">
                  {hackathonDetail.participants_count || 0} Hackers
                </p>
              </div>
            </div>

            {/* Stat 3: Team Size */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/40">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-purple-600 dark:text-purple-400 truncate">
                  Team Size
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white truncate">
                  {hackathonDetail.min_team_size || 1} -{" "}
                  {hackathonDetail.max_team_size || 4} Hackers
                </p>
              </div>
            </div>

            {/* Stat 4: Timeline */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 truncate">
                  Hacking Window
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {formatDate(hackathonDetail.start_date)} -{" "}
                  {formatDate(hackathonDetail.end_date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TABS NAVIGATION BAR (DoraHacks Style) */}
        <div className="sticky top-16 sm:top-20 z-20 bg-white/90 dark:bg-[#121824]/90 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-1.5 mb-8 shadow-sm">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: "overview" as TabType, label: "Overview", icon: FileText },
              { id: "prizes" as TabType, label: "Prizes & Rewards", icon: Award },
              {
                id: "rules" as TabType,
                label: "Rules & Guidelines",
                icon: CheckCircle,
              },
              {
                id: "schedule" as TabType,
                label: "Timeline & Schedule",
                icon: Clock,
              },
              {
                id: "leaderboard" as TabType,
                label: "Leaderboard & Reviews",
                icon: Trophy,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. MAIN LAYOUT GRID (Content + Sticky DoraHacks Sidebar) */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: Tab Content */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* Overview Card */}
                  <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          Hackathon Overview
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Comprehensive brief, track focus, and builder expectations
                        </p>
                      </div>
                    </div>

                    {/* Styled Web3 Text Content */}
                    <HackathonContentRenderer
                      content={hackathonDetail.description}
                      fallbackText="No description provided for this hackathon."
                    />
                  </div>

                  {/* Highlights Banner Card */}
                  <div className="bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-transparent p-6 sm:p-8 rounded-3xl border border-indigo-200/40 dark:border-indigo-800/40">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-indigo-500" />
                          Ready to build the future of Web3?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Form a team, build an MVP, and pitch directly to ecosystem judges.
                        </p>
                      </div>
                      <button
                        onClick={onRegister}
                        className="px-6 py-2.5 rounded-xl bg-[#605DEC] hover:bg-[#5046d8] text-white text-sm font-semibold transition-all shadow-md shrink-0 cursor-pointer"
                      >
                        {isRegisteredState ? "Go to Workspace" : "Join Now"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "prizes" && (
                <motion.div
                  key="prizes"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* Grand Prize Showcase (DoraHacks Style) */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-transparent dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-transparent rounded-3xl p-8 sm:p-12 border-2 border-amber-300 dark:border-amber-700/60 shadow-xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                          🏆 GRAND PRIZE POOL
                        </span>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400">
                          ${Number(hackathonDetail.grand_prize || 0).toLocaleString()}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-md">
                          Awarded to top projects across innovation, technical execution, and ecosystem impact.
                        </p>
                      </div>

                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-500 dark:text-amber-300 shadow-inner">
                        <Award className="w-14 h-14" />
                      </div>
                    </div>
                  </div>

                  {/* Additional Prize Details */}
                  <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 dark:border-gray-800/80">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2.5">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Prize Distribution & Bounties
                    </h3>
                    <HackathonContentRenderer
                      content={normalizeContent(hackathonDetail.prizes)}
                      fallbackText="Prize distribution details will be announced soon by organizers."
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "rules" && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 dark:border-gray-800/80"
                >
                  <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Rules & Submission Guidelines
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Code of conduct, eligibility requirements, and evaluation policies
                      </p>
                    </div>
                  </div>

                  <HackathonContentRenderer
                    content={normalizeContent(hackathonDetail.rules)}
                    fallbackText="Standard hackathon rules apply. Be respectful, build original code, and submit before the deadline."
                  />
                </motion.div>
              )}

              {activeTab === "schedule" && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 dark:border-gray-800/80 space-y-8"
                >
                  <div className="flex items-center gap-3 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Hackathon Schedule
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Key milestones and deadlines for participants
                      </p>
                    </div>
                  </div>

                  {/* Visual Step Timeline */}
                  <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                    {/* Stage 1: Registration */}
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-[#121824] text-xs font-bold">
                        1
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Stage 1
                        </span>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                          Registration & Team Formation
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Starts on {formatDate(hackathonDetail.start_date)}. Sign up, join a team or invite peers.
                        </p>
                      </div>
                    </div>

                    {/* Stage 2: Hacking & Submissions */}
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-[#121824] text-xs font-bold">
                        2
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Stage 2
                        </span>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                          Hacking & Submission Deadline
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Closes on{" "}
                          {formatDate(
                            hackathonDetail.submission_deadline ||
                              hackathonDetail.end_date
                          )}
                          . Submit repo, live demo, and video.
                        </p>
                      </div>
                    </div>

                    {/* Stage 3: Judging & Winners */}
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-[#121824] text-xs font-bold">
                        3
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          Stage 3
                        </span>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                          Judging & Winner Announcement
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Concluding on {formatDate(hackathonDetail.end_date)}.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "leaderboard" && (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <HackathonLeaderboard
                    hackathonId={hackathonDetail?.id || storeHackathonId || ""}
                    approvedOnly={true}
                  />
                  <LiveJudgeReviews
                    hackathonId={hackathonDetail?.id || storeHackathonId || ""}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT 1 COLUMN: Sticky DoraHacks Hackathon Hub */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Card 1: Action & Countdown Widget */}
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800/80 space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Registration Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isDeadlinePassed ? "bg-gray-400" : "bg-emerald-500 animate-pulse"
                      }`}
                    />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {isDeadlinePassed ? "Deadline Passed" : countdown || "Open for Registration"}
                    </h4>
                  </div>
                </div>

                {isRegisteredState && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>You are registered for this hackathon!</span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRegister}
                  disabled={
                    registerMutation.isPending ||
                    (isDeadlinePassed && !isRegisteredState)
                  }
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-md ${
                    isRegisteredState
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-500/20"
                      : isDeadlinePassed
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-[#605DEC] hover:bg-[#5046d8] text-white cursor-pointer shadow-indigo-500/20"
                  } ${registerMutation.isPending ? "opacity-60" : ""}`}
                >
                  {registerMutation.isPending ? (
                    "Registering..."
                  ) : isRegisteredState ? (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      View Dashboard
                    </>
                  ) : isDeadlinePassed ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Registration deadline has passed
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Register Now
                    </>
                  )}
                </motion.button>
              </div>

              {/* Card 2: Quick Info Summary */}
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800/80 space-y-4">
                <h4 className="text-base font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
                  Quick Details
                </h4>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Grand Prize
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${Number(hackathonDetail.grand_prize || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500" />
                      Team Format
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {hackathonDetail.min_team_size || 1} -{" "}
                      {hackathonDetail.max_team_size || 4} Members
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      Venue
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[140px]">
                      {hackathonDetail.venue || "Virtual"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Starts
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {formatDate(hackathonDetail.start_date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      Ends
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {formatDate(hackathonDetail.end_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Organizer Spotlight */}
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Organizer
                  </span>
                  {organization?.is_approved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3.5">
                  {organizerLogo ? (
                    <img
                      src={organizerLogo}
                      alt={organizerName}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm shrink-0 bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/60 dark:to-purple-950/60 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-gray-900 dark:text-white truncate text-base">
                      {organizerName}
                    </h5>
                    {organization?.tagline ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {organization.tagline}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        Verified Hackathon Host
                      </p>
                    )}
                  </div>
                </div>

                {organization?.website && (
                  <a
                    href={
                      organization.website.startsWith("http")
                        ? organization.website
                        : `https://${organization.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={modal.open}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        type={modal.type}
        message={modal.message}
      />
    </div>
  );
}

export default Hack;
