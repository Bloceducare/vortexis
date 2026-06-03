"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Users, ShieldAlert, Award, Briefcase, BookOpen } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "participants" | "organizers" | "judges";
}

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "participants" | "organizers" | "judges">("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "general", label: "General", icon: BookOpen },
    { id: "participants", label: "Participants", icon: Users },
    { id: "organizers", label: "Organizers", icon: Briefcase },
    { id: "judges", label: "Judges", icon: Award },
  ];

  const faqs: FAQItem[] = [
    {
      category: "general",
      question: "What is Vortexis?",
      answer: "Vortexis is an all-in-one platform built to streamline the hackathon lifecycle. It enables organizers to host events, hackers to build teams and submit projects, and judges to review submissions—all in a unified, intuitive workspace.",
    },
    {
      category: "general",
      question: "Is Vortexis free to use?",
      answer: "Yes, Vortexis is free for basic hackathon participation. Organizers can host standard hackathons for free. For customized organizational features, advanced analytics, and custom domains, we offer premium enterprise plans.",
    },
    {
      category: "participants",
      question: "Do I need a team to register for a hackathon?",
      answer: "Not at all! You can register as an individual. Once registered, you can use our built-in team formation tools to find teammates who complement your skills, or choose to work as a solo participant.",
    },
    {
      category: "participants",
      question: "How do I submit my project?",
      answer: "When the submission window is open, navigate to your hackathon page and click 'Submit Project'. You will need to provide a project title, description, GitHub repository URL, and optionally a demo video link or presentation deck.",
    },
    {
      category: "organizers",
      question: "How do I create and customize my hackathon?",
      answer: "Go to your Organization Dashboard, click 'Create Hackathon', and follow our step-by-step wizard. You can set the timeline, write rules, define submission requirements, configure custom prizes, and design your landing page banner.",
    },
    {
      category: "organizers",
      question: "How can I invite judges to my event?",
      answer: "In your Organizer Console, go to the 'Judges' tab of your hackathon. Enter the emails of the judges you wish to invite. They will receive a secure email containing a unique link to join your event as a judge.",
    },
    {
      category: "judges",
      question: "How do I evaluate submissions?",
      answer: "Once the judging phase begins, you will gain access to your Judge Dashboard. From there, you can view assigned submissions, inspect deliverables (code, video, docs), and score them against the organizer's predefined evaluation criteria.",
    },
    {
      category: "judges",
      question: "Can organizers see live score updates?",
      answer: "Organizers can see real-time updates of which projects have been graded, but individual detailed scores remain private until the review window closes and results are finalized to ensure fairness.",
    },
  ];

  const filteredFaqs = faqs.filter(faq => activeCategory === "all" || faq.category === activeCategory);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F3F0FF] to-[#EBE8FF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-20 px-4 sm:px-6 lg:px-8 mt-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/60 dark:bg-indigo-900/30 backdrop-blur-sm rounded-full mb-4"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Got Questions?</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4"
          >
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Questions
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Find answers to common questions about hosting, participating, and judging hackathons on Vortexis.
          </motion.p>
        </div>

        {/* Category Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setExpandedIndex(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-xs cursor-pointer border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-gray-700/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Accordions */}
        <motion.div
          layout
          className="space-y-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl border border-white/50 dark:border-gray-800"
        >
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <motion.div
                  key={faq.question}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="border border-gray-200/60 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-gray-800 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => toggleExpand(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition duration-300 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-5 h-5 text-indigo-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-700/50 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50/30 dark:bg-gray-800/20">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <motion.div
              layout
              className="text-center py-10"
            >
              <ShieldAlert className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No questions found matching this category.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer Helper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
        >
          Still have questions? Check our{" "}
          <Link href="/about" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            About Page
          </Link>{" "}
          or reach out to us at{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">support@vortexis.com</span>.
        </motion.div>
      </div>
    </div>
  );
}
