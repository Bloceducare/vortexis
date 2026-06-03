"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useHackathon from "@/hooks/useHackathon";
import { Trophy } from "lucide-react";

export default function ExploreActiveHackathons() {
  const router = useRouter();
  const { getAllHackathon } = useHackathon();
  const { data: apiData = {}, isLoading } = getAllHackathon();
  const hackathons = apiData.data || [];

  // ✅ Memoize filtering and limiting so it doesn’t recalc on every render
  const activeHackathons = useMemo(() => {
    const hackathonList = Array.isArray(hackathons) ? hackathons : [];
    return hackathonList
      .filter((h: any) => !h.end_date || new Date(h.end_date) >= new Date())
      .slice(0, 6);
  }, [hackathons]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-indigo-500 dark:text-indigo-400 mb-8">
        Explore Active Hackathons
      </h2>

      {/* Skeleton loader */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse"
            >
              <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : activeHackathons.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800/80 max-w-xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
            No Active Hackathons
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            There are currently no active hackathons running. Check back soon or host your own to get started!
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.12 },
              },
            }}
          >
            {activeHackathons.map((hackathon: any) => (
              <motion.div
                key={hackathon.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer flex flex-col"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                onClick={() => router.push(`/hackathon/${hackathon.id}`)}
              >
                {/* Image */}
                <div className="relative h-40 w-full mb-4">
                  {hackathon.banner_image?.trim() ? (
                    <img
                      src={hackathon.banner_image}
                      alt={hackathon.title}
                      className="rounded-lg h-40 w-full object-cover"
                      loading="lazy" // ✅ better memory usage
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-500">
                      <Trophy className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 font-spectral">
                  <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-1">
                    {hackathon.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    By{" "}
                    <span className="font-medium">
                      {hackathon.organization?.name}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Judges: {hackathon.judges?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Team Size: {hackathon.min_team_size} -{" "}
                    {hackathon.max_team_size}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    Created:{" "}
                    {new Date(hackathon.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center mb-1">
                    <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      ${hackathon.grand_prize?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      grand prize
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {hackathon.participants_count} participants
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ✅ See More Button */}
          {hackathons.length > 12 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => router.push("/hackathon")}
                className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition cursor-pointer"
              >
                See More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
