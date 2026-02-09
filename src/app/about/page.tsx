"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Users, Zap, Heart, Award, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import CountUp from "@/components/CountUp";
import { useIsLoggedIn } from "@/lib/logged-In";

export default function AboutPage() {
  const stats = [
    { value: 1000, label: "Active Users" },
    { value: 500, label: "Hackathons" },
    { value: 100, label: "Organizations" },
    { value: 2000000, label: "Prizes Awarded" },
  ];
  const router = useRouter();
    const isLoggedIn = useIsLoggedIn();
  
  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We believe in pushing boundaries and challenging the status quo.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by hackers, for hackers. Your feedback shapes our platform.",
    },
    {
      icon: Zap,
      title: "Speed & Simplicity",
      description: "Focus on building, not bureaucracy. We handle the rest.",
    },
    {
      icon: Heart,
      title: "Passion for Tech",
      description: "We love technology and the amazing things it enables.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
            <Globe className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600 dark:text-white">About Vortexis</span>
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-title mb-6 dark:text-white">
            Empowering Innovation,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              One Hackathon at a Time
            </span>
          </h1>
          <p className="text-sm md:text-xl  opacity-70 max-w-3xl mx-auto leading-relaxed">
            Vortexis is the ultimate platform for creating, participating in, and
            winning hackathons. We connect innovators, organizers, and judges from
            around the world to build the future together.
          </p>
        </motion.div>

        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
>
  {stats.map((stat, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-center">
      <CountUp 
        end={stat.value}
        duration={2.5}
        className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600 mb-2"
      /> <p         className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">+</p>

      </div>


      <div className="text-sm opacity-60">{stat.label}</div>
    </motion.div>
  ))}
</motion.div>


        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-4 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 mb-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-title mb-4">Our Mission</h2>
            <p className="text-sm md:text-lg  opacity-70 leading-relaxed">
              To democratize hackathons and make them accessible to everyone,
              everywhere. We believe that great ideas can come from anywhere, and
              we're committed to providing the tools and platform that help turn
              those ideas into reality.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-title mb-3">{value.title}</h3>
                <p className=" opacity-70">{value.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 bg-linear-to-r from-purple-600 to-blue-600 rounded-3xl p-4 md:p-12 text-center shadow-2xl"
        >
          <h2 className="text-xl md:text-4xl font-bold text-white mb-4">
            Join the Vortexis Community
          </h2>
          <p className="text-sm md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Be part of something bigger. Connect with innovators, build amazing
            projects, and win awesome prizes.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 md:px-8 py-3 md:py-4 bg-white text-purple-600 rounded-xl text-sm md:text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg cursor-pointer"
            onClick={() => router.push(isLoggedIn ? "/dashboard" : "/auth/signup")}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}