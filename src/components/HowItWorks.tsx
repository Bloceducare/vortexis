"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import image3 from "@/public/assets/image3.svg";
import icon1 from "@/public/assets/icon1.svg";
import icon2 from "@/public/assets/icon2.svg";
import icon3 from "@/public/assets/icon3.svg";
import icon4 from "@/public/assets/icon4.svg";

const features = [
  {
    step: "01",
    icon: icon4,
    title: "All-In-One Platform",
    text: "Manage, build, and ideate in one workspace without switching between tools.",
  },
  {
    step: "02",
    icon: icon3,
    title: "Team Collaboration",
    text: "Work seamlessly across time zones and roles with integrated communication tools.",
  },
  {
    step: "03",
    icon: icon2,
    title: "Real-Time Analytics",
    text: "Get actionable data on participation, engagement, and submissions.",
  },
  {
    step: "04",
    icon: icon1,
    title: "Built For Devs",
    text: "API support, submission tracking, and powerful toolkits for technical teams.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative w-full mx-auto px-4 py-12 sm:px-6 sm:py-20 bg-gradient-to-b from-white via-[#FBFBFF] to-white dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900 overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-semibold tracking-wide uppercase w-fit mb-4 sm:mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.18] mb-3 sm:mb-4">
              Bringing Teams Together{" "}
              <span className="bg-gradient-to-r from-[#605DEC] via-[#7B73F6] to-[#A259FF] bg-clip-text text-transparent">
                To Innovate.
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
              Bringing organizations and developers together to create, inspire,
              and innovate — with a unified workspace built for speed and seamless collaboration.
            </p>

            {/* Illustrated Image with Frame and Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative rounded-3xl p-2.5 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent max-w-md w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800">
                <Image
                  src={image3}
                  alt="Team collaboration with laptops around a table"
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Floating Live Badge */}
              <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-gray-100 dark:border-gray-700/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#605DEC] to-[#8A85FF] flex items-center justify-center text-white shadow-md shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    Live Collaboration
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    Built for Fast Iteration
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Interactive Feature Cards */}
          <div className="space-y-3.5 sm:space-y-4 pt-4 lg:pt-0">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200/70 dark:border-gray-700/70 shadow-xs hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="shrink-0 relative">
                  <Image
                    src={feature.icon}
                    alt=""
                    aria-hidden="true"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {feature.title}
                    </h3>
                    <span className="text-xs font-bold text-indigo-500/70 dark:text-indigo-400/60 font-mono">
                      {feature.step}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
