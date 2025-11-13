"use client";

import React, { useState, useEffect } from "react";
import useHackathon from "@/hooks/useHackathon";
import { useParams } from "next/navigation";
import HtmlContent from "@/components/ui/HtMLContent";
import {
  MapPin,
  Trophy,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import StatusModal from "@/components/StatusModal";

function Hack() {
  const { id } = useParams();
  const { getHackathonById, registerUserForHackathon } = useHackathon();
  const { data, isLoading, error } = getHackathonById(id as string);
  const [countdown, setCountdown] = useState("");
  const user = useUserStore.getState().user;
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

  // --- Utilities ---
  function safeParseContent(content: string | null | undefined): string {
    if (!content) return "";
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed.join("");
      if (typeof parsed === "string") return parsed;
      return "";
    } catch {
      return content;
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --- Countdown ---
  useEffect(() => {
    if (!data?.start_date) return;
    const interval = setInterval(() => {
      const start = new Date(data.start_date).getTime();
      const now = Date.now();
      const diff = start - now;

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown("🚀 Hackathon is live!");
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
  }, [data?.start_date]);

  const Onregister = (hackathon_id: string) => {
    registerMutation.mutate(hackathon_id, {
      onSuccess: () => {
        setModal({
          open: true,
          type: "success",
          message: "You have successfully registered!",
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

  // --- Loading & Error States ---
  if (isLoading)
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4 animate-pulse">
        <div className="h-10 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-48 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-center text-red-500 dark:text-red-400">
          Failed to load hackathon. Please try again later.
        </p>
      </div>
    );

  // --- Main Layout ---
  return (
    data && (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
        {/* Banner */}
        <div
          className="relative h-[50vh] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${data.banner_image})` }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3">
              {data.title}
            </h1>
            <p className="text-gray-200 text-lg md:text-xl">
              {formatDate(data.start_date)} – {formatDate(data.end_date)}
            </p>
            <p className="text-gray-300">{data.venue}</p>
            <p className="text-blue-300 font-semibold mt-3 text-lg">
              ⏳ {countdown}
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="flex flex-1 flex-col md:flex-row md:items-start gap-8 md:gap-12 px-24 py-10 mx-auto w-full bg-white dark:bg-gray-900 transition-colors">
          {/* LEFT (Fixed Info Section) */}
          <div className="md:w-1/3 lg:w-1/4 md:sticky md:top-24 space-y-5 p-6 h-fit bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>
                {formatDate(data?.start_date)} - {formatDate(data?.end_date)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin className="w-5 h-5 text-red-500 dark:text-red-400" />
              <span>{data?.venue || "Venue to be announced"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Min Team Size: {data?.min_team_size}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Max Team Size: {data?.max_team_size}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              <span>Grand Prize: ${data?.grand_prize}</span>
            </div>

            <button
              disabled={registerMutation.isPending}
              className="mt-6 w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending
                ? "Registering......"
                : "Register Now"}
            </button>
          </div>

          {/* RIGHT (Scrollable Info Section) */}
          <div className="flex-1 overflow-y-auto h-screen p-8 hide-scrollbar bg-white dark:bg-gray-900 transition-colors">
            {/* Overview */}
            <div className="mb-10">
              <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2 dark:text-white">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Overview
              </h2>
              <div className="text-gray-700 dark:text-gray-300">
                <HtmlContent html={data?.description} />
              </div>
            </div>

            {/* Rules */}
            <div className="mb-10">
              <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2 dark:text-white">
                <Info className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                Rules
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-1" />
                  <div className="text-gray-700 dark:text-gray-300">
                    <HtmlContent html={safeParseContent(data?.rules)} />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Please make sure to follow all rules carefully.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="mb-10">
              <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2 dark:text-white">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Additional Information
              </h2>
              <div className="text-gray-700 dark:text-gray-300">
                <HtmlContent html={safeParseContent(data?.prizes)} />
              </div>
            </div>
          </div>
        </section>

        <StatusModal
          isOpen={modal.open}
          onClose={() => setModal((prev) => ({ ...prev, open: false }))}
          type={modal.type}
          message={modal.message}
        />
      </div>
    )
  );
}

export default Hack;
