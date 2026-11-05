"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useIsLoggedIn } from "@/lib/logged-In";
import useHackathon from "@/hooks/useHackathon";
import { ArrowRight, Sparkles, Trophy, Users, Rocket } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const Hero: React.FC = () => {
  const isLoggedIn = useIsLoggedIn();
  const { getPlatformPublicStats } = useHackathon();
  getPlatformPublicStats();

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F7F6FE] via-[#EEF0FF] to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 transition-colors pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#605dec12_1px,transparent_1px),linear-gradient(to_bottom,#605dec12_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Ambient Gradient Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[600px] sm:h-[500px] bg-gradient-to-tr from-[#605DEC]/25 via-[#8A85FF]/20 to-purple-400/20 blur-3xl rounded-full pointer-events-none -z-0" />
      <div className="absolute top-36 -left-20 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-600/10 blur-3xl rounded-full pointer-events-none -z-0" />
      <div className="absolute top-44 -right-20 w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 blur-3xl rounded-full pointer-events-none -z-0" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Top Kicker Pill */}
        <motion.div variants={fadeUp} className="inline-block">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 border border-indigo-200/70 dark:border-indigo-500/30 backdrop-blur-md shadow-xs mb-6 sm:mb-8 hover:border-indigo-300 dark:hover:border-indigo-400/40 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-[#605DEC] animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
              Run • Join • Win
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
              The Modern Hackathon Hub
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.14] mb-5 sm:mb-6 max-w-4xl mx-auto"
        >
          Everything Hackathon,{" "}
          <span className="bg-gradient-to-r from-[#605DEC] via-[#7B73F6] to-[#A259FF] bg-clip-text text-transparent block sm:inline">
            All In One Place.
          </span>
        </motion.h1>

        {/* Subtitle with Role Badges */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 font-normal leading-relaxed max-w-2xl lg:max-w-3xl mx-auto mb-8 sm:mb-10 px-2 sm:px-0"
        >
          Vortexis makes it easy to{" "}
          <span className="text-gray-900 dark:text-white font-medium">host hackathons</span>,{" "}
          <span className="text-gray-900 dark:text-white font-medium">collaborate with teammates</span>, and{" "}
          <span className="text-gray-900 dark:text-white font-medium">build innovative projects</span>  {" "}
          whether you&apos;re an{" "}
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold">
            organizer
          </span>
          ,{" "}
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-purple-100/70 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-semibold">
            hacker
          </span>
          .
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto"
        >
          <Link
            href={isLoggedIn ? "/hackathon" : "/auth/signup"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#605DEC] to-[#7B73F6] hover:from-[#514ecb] hover:to-[#6c64eb] text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
          >
            <span>Start Your Hackathon Journey</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/hackathon"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold text-sm sm:text-base rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Trophy className="w-4 h-4 text-indigo-500" />
            <span>Explore Hackathons</span>
          </Link>
        </motion.div>

        {/* Feature Highlights Row */}
        <motion.div
          variants={fadeUp}
          className="mt-12 sm:mt-16 pt-8 border-t border-gray-200/60 dark:border-gray-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-left"
        >
          {[
            {
              icon: Rocket,
              title: "Instant Setup",
              desc: "Launch in minutes",
            },
            {
              icon: Users,
              title: "Team Matching",
              desc: "Find collaborators",
            },
            {
              icon: Trophy,
              title: "Fair Evaluation",
              desc: "Transparent judging",
            },
            {
              icon: Sparkles,
              title: "Live Analytics",
              desc: "Track real-time stats",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-[#605DEC] dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {item.title}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
