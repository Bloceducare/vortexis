"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useHackathon from "@/hooks/useHackathon";
import { useParams, useRouter } from "next/navigation";
import HtmlContent from "@/components/ui/HtMLContent";
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
} from "lucide-react";
import StatusModal from "@/components/StatusModal";
import { useUserHackathonsStore } from "@/store/useUserHackathons";
import { useQueryClient } from "@tanstack/react-query";

function Hack() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient()
  const { getHackathonById, registerUserForHackathon } = useHackathon();
  const { data, isLoading, error } = getHackathonById(id as string);
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

  const { hackathons, addHackathon } = useUserHackathonsStore();


  const [isRegisteredState, setIsRegisteredState] = useState(
  hackathons.some((h) => h?.id === Number(id))
);


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

  useEffect(() => {
    if (!data?.start_date) return;
    const interval = setInterval(() => {
      const start = new Date(data.start_date).getTime();
      const now = Date.now();
      const diff = start - now;

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
  }, [data?.start_date]);

  const onRegister = () => {
  if (isRegisteredState) {
    router.push(`/dashboard/${id}/hackathon`);
    return;
  }

  registerMutation.mutate(id as string, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participant_hackathon"] });
      setIsRegisteredState(true); 
      addHackathon(data.hackathon);
     
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">Failed to load hackathon details.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Banner */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        {data.banner_image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.banner_image})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center">
            <Trophy className="w-20 h-20 text-yellow-500/80" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
          >
            {data.title}
          </motion.h1>

          <div className="flex flex-wrap gap-4 justify-center text-white/90 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {formatDate(data.start_date)} - {formatDate(data.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{data.venue}</span>
            </div>
          </div>

          {countdown && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold"
            >
              <Clock className="w-5 h-5" />
              {countdown}
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-title mb-4">
                  Quick Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs opacity-60">Team Size</p>
                      <p className="font-semibold">
                        {data.min_team_size} - {data.max_team_size} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs opacity-60">Grand Prize</p>
                      <p className="font-semibold text-lg">
                        ${data.grand_prize}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs opacity-60">Participants</p>
                      <p className="font-semibold">
                        {data.participants_count || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration Status Badge */}
                {isRegisteredState && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold text-sm">
                        Already Registered
                      </span>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRegister}
                  disabled={registerMutation.isPending}
                  className={`mt-6 w-full flex items-center justify-center cursor-pointer gap-2 py-4 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg cursor-pointer ${
                    isRegisteredState
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                  }`}
                >
                  {registerMutation.isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Registering...
                    </>
                  ) : isRegisteredState ? (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      View Dashboard
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Register Now
                    </>
                  )}
                </motion.button>

                {isRegisteredState && (
                  <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                    Manage your team and projects in the dashboard
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-title mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                Overview
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <HtmlContent html={data.description} />
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-title mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Rules & Guidelines
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <HtmlContent html={safeParseContent(data.rules)} />
              </div>
            </div>

            {/* Prizes */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 shadow-lg border border-yellow-100 dark:border-yellow-800">
              <h2 className="text-2xl font-bold text-title mb-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-600" />
                Prizes & Rewards
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <HtmlContent html={safeParseContent(data.prizes)} />
              </div>
            </div>
          </motion.div>
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