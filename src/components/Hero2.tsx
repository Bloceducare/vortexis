"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Trophy,
  Rocket,
  CheckCircle,
  X,
  Mail,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function HackathonCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = useAuthStore.getState().getToken();

    useEffect(() => {
      const checkLoginStatus = () => {
        setIsLoggedIn(!!token);
      };
  
      checkLoginStatus();
      window.addEventListener("storage", checkLoginStatus);
  
      return () => {
        window.removeEventListener("storage", checkLoginStatus);
      };
    }, []);
  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full bg-linear-to-br from-[#605DEC] via-[#5046d8] to-[#4a3ec4] overflow-hidden rounded-3xl p-4 sm:p-12 shadow-2xl"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 25, repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"
            />
          </div>

          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-8 right-8 opacity-20"
          >
            <Trophy className="w-20 h-20" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-8 left-8 opacity-20"
          >
            <Users className="w-20 h-20" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto text-white">
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Start Your Journey</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Join or Host a Hackathon
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-xl mb-10 leading-relaxed text-white/90 max-w-2xl mx-auto"
            >
              Whether you're new to hackathons or ready to host one, we've got
              you covered. Connect with innovators, build amazing projects, or
              organize your own impactful event.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link href={isLoggedIn ? "/dashboard" : "/auth/signin"}>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2  px-8 py-4 bg-white text-[#605DEC] font-semibold rounded-xl shadow-lg hover:bg-gray-50 transition-all cursor-pointer text-sm md:text-lg"
                >
                  <Rocket className="w-5 h-5" />
                  Join as Participant
                </motion.button>
              </Link>

              <Link href="/guide">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#605DEC] rounded-xl font-semibold transition-all cursor-pointer text-sm md:text-lg"
                >
                  <Users className="w-5 h-5" />
                  Learn How to Host
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8"
        >
          {[
            { value: "0", label: "Active Participants" },
            { value: "0", label: "Hackathons Hosted" },
            { value: "0", label: "Organizations" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="text-3xl font-bold text-[#605DEC] dark:text-indigo-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
