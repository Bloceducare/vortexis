"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Rocket,
  Building2,
  MessageSquare,
  Users,
  UserCircle,
  Sparkles,
  Trophy,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Globe,
    title: "Join from Anywhere",
    description:
      "Participate in hackathons from any corner of the world. No borders, no limits—just pure innovation.",
    color: "from-blue-500 to-cyan-500",
    benefits: [
      "Remote participation",
      "Global networking",
      "Time zone flexibility",
    ],
  },
  {
    icon: Rocket,
    title: "Create Hackathons",
    description:
      "Launch your own hackathons with ease. Set challenges, define rules, and bring innovators together.",
    color: "from-purple-500 to-pink-500",
    benefits: [
      "Custom branding",
      "Flexible scheduling",
      "Prize management",
    ],
  },
  {
    icon: Building2,
    title: "Multiple Organizations",
    description:
      "Manage multiple organizations as an organizer. Scale your hackathon empire without limits.",
    color: "from-orange-500 to-red-500",
    benefits: [
      "Unlimited organizations",
      "Centralized dashboard",
      "Team collaboration",
    ],
  },
  {
    icon: MessageSquare,
    title: "Judge Collaboration",
    description:
      "Invite expert judges and collaborate in dedicated chat rooms. Make fair, informed decisions together.",
    color: "from-green-500 to-emerald-500",
    benefits: [
      "Private chat rooms",
      "Real-time collaboration",
      "Scoring system",
    ],
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Form multiple teams and participate in various hackathons simultaneously. Build your network.",
    color: "from-yellow-500 to-amber-500",
    benefits: [
      "Multiple teams",
      "Team invitations",
      "Role assignments",
    ],
  },
  {
    icon: UserCircle,
    title: "Personalized Profile",
    description:
      "Showcase your skills, achievements, and projects. Let your profile tell your innovation story.",
    color: "from-indigo-500 to-purple-500",
    benefits: [
      "Custom profiles",
      "Achievement badges",
      "Portfolio showcase",
    ],
  },
];

export default function FeaturesPage() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-500 py-16 px-4 sm:px-6 lg:px-8 mt-10  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 dark:text-white">
              Powerful Features
            </span>
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-title mb-6 dark:text-white">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
              Win
            </span>
          </h1>
          <p className="text-sm md:text-xl  opacity-70 max-w-3xl mx-auto">
            Vortexis provides all the tools you need to create, participate in, and
            win hackathons. Join thousands of innovators building the future.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-title mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-lg opacity-70 mb-6">
                    {feature.description}
                  </p>

                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm  opacity-60"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-5 md:p-12 text-center shadow-2xl"
        >
          <Trophy className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join Vortexis today and be part of a global community of innovators,
            creators, and winners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:px-8 px-4 py-3 md:py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg cursor-pointer"
              onClick={() => router.push("/auth/signup")}
            >
              Get Started Free
            </motion.button>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:px-8 px-4 py-3 md:py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              View Demo
            </motion.button> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

