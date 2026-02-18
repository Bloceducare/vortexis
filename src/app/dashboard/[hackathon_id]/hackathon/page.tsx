"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useHackathon from "@/hooks/useHackathon";
import HtmlContent from "@/components/ui/HtMLContent";
import {
  MapPin,
  Trophy,
  FileText,
  Calendar,
  Users,
  Clock,
  Award,
  ArrowRight,
  Plus,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import useTeams from "@/hooks/useTeams";
import { useUserHackathonsStore } from "@/store/useUserHackathons";
import { useEffect, useMemo } from "react";
import { useHackathonStore } from "@/store/useHackathonStore";
import { User } from "@/app/api/utils/interface";
import { useUserStore } from "@/store/useUserStore";
import { slugify } from "@/lib/utils";

const Hackathons = () => {


    const activeHackathon = useHackathonStore((state) => state.activeHackathon);
       const setclickedUser = useUserStore((state) => state.setclickedUser)
    
    const hackathon_id = activeHackathon?.id as string;
    const router = useRouter();

  const { getTeam } = useTeams();
  const { data: myTeam } = getTeam(hackathon_id);

  const { getHackathonById } = useHackathon();
  const { data, isLoading, error } = getHackathonById(hackathon_id);

  const addHackathon = useUserHackathonsStore((state) => state.addHackathon);

  useEffect(() => {
    if (myTeam) addHackathon(myTeam);
  }, [myTeam, addHackathon]);

  const safeParseContent = (content: string | null | undefined): string => {
    if (!content) return "";
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed.join("");
      if (typeof parsed === "string") return parsed;
      return "";
    } catch {
      return content;
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const memberColors = useMemo(() => {
    if (!myTeam?.members) return {};
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return myTeam.members.reduce(
      (acc: Record<string, string>, m: any, idx: number) => {
        acc[m.id] = colors[idx % colors.length];
        return acc;
      },
      {}
    );
  }, [myTeam?.members]);

  const calculateDaysLeft = () => {
    const now = new Date();
    const end = new Date(data?.end_date);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Hero Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg animate-pulse">
            <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse"
              >
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-red-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load hackathon details.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft();

    const viewProfiles = (user: User) => {
      setclickedUser(user)
      const slug = slugify(user.first_name)
      router.push(`/profile/${slug}`)
    }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          {/* Banner linear */}
          <div className="h-32 bg-linear-to-r from-primary via-blue-500 to-purple-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            {daysLeft > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {daysLeft} days left
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl md:text-5xl font-bold text-title mb-4">
                {data?.title}
              </h1>
              <div className="prose prose-lg max-w-none  opacity-80">
                <HtmlContent html={data?.description} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-sm  opacity-60 mb-1">Venue</div>
            <div className="font-bold text-title">{data?.venue}</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mb-3">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-sm  opacity-60 mb-1">Grand Prize</div>
            <div className="font-bold text-title">${data?.grand_prize}</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-sm  opacity-60 mb-1">Start Date</div>
            <div className="font-bold text-title">
              {formatDate(data.start_date)}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-sm  opacity-60 mb-1">
              Submission Deadline
            </div>
            <div className="font-bold text-title">
              {formatDate(data?.submission_deadline)}
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Rules & Prizes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rules Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-title">Rules</h2>
              </div>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <HtmlContent html={safeParseContent(data?.rules)} />
              </div>
            </motion.div>

            {/* Prizes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 md:p-8 shadow-lg border border-yellow-100 dark:border-yellow-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-title">
                  Prizes & Rewards
                </h2>
              </div>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <HtmlContent html={safeParseContent(data?.prizes)} />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Team Management */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700 sticky top-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-title">Your Team</h2>
              </div>

              {myTeam ? (
                <div className="space-y-6">
                  {/* Team Name */}
                  <div className="bg-linear-to-r from-primary/10 to-blue-500/10 rounded-xl p-4">
                    <div className="text-sm  opacity-60 mb-1">
                      Team Name
                    </div>
                    <div className="text-lg font-bold text-title">
                      {myTeam.name}
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <div className="text-sm font-semibold  opacity-60 mb-3">
                      Team Members ({myTeam.members?.length || 0})
                    </div>
                    {myTeam.members && myTeam.members.length > 0 ? (
                      <div className="space-y-3">
                        {myTeam.members.map((m: any) => {
                          const initials = m.username
                            ? m.username.slice(0, 2).toUpperCase()
                            : "??";
                          return (
                            <motion.div
                              key={m.id}
                              whileHover={{ x: 4 }}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                              onClick={() => viewProfiles(m)}
                            >
                              <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-sm ${memberColors[m.id]}`}
                              >
                                {initials}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-title">
                                  {m.username}
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4  opacity-40" />
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className=" opacity-60 text-sm">
                        No members yet
                      </p>
                    )}
                  </div>

                  {/* View Team Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      router.push(`/dashboard/${hackathon_id}/team`)
                    }
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                  >
                    Manage Team
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className=" opacity-60 mb-6">
                      You're not part of a team yet. Create or join one to
                      participate!
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      router.push(`/dashboard/${hackathon_id}/team/create`)
                    }
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Create Team
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      router.push(`/dashboard/${hackathon_id}/team/join`)
                    }
                    className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Join Team
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hackathons;
