"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Users, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHackathonStore } from "@/store/useHackathonStore";
import { slugify } from "@/lib/utils";

interface Hackathon {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  venue: string;
  country: string;
  banner_image?: string;
  banner_image_file: string
  grand_prize?: number;
  participants_count?: number;
}

interface HackathonCardProps {
  hackathon: Hackathon;
  index: number;
  onClick: (id: string) => void;
  onRegister: (id: string) => void; 
  isRegistering: boolean;
  registered: boolean;
}

export const HackathonCard: React.FC<HackathonCardProps> = React.memo(
  ({ hackathon, index, onClick, onRegister, isRegistering, registered }) => {
    const router = useRouter();
    const { setActiveHackathon } = useHackathonStore();

    const now = new Date();
    const start = new Date(hackathon.start_date);
    const end = new Date(hackathon.end_date);

    const daysLeft = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isUpcoming = start > now;
    const isActive = start <= now && end >= now;
    const isEnded = end < now;

    const status = isEnded
      ? { text: "Ended", color: "bg-gray-500" }
      : isActive
      ? { text: "Active", color: "bg-green-500" }
      : { text: "Upcoming", color: "bg-blue-500" };

    const handleRegister = async (e: React.MouseEvent) => {
      e.stopPropagation();
         onRegister(hackathon.id);
       setActiveHackathon(hackathon);
         const slug = slugify(hackathon.title);
      router.push(`/dashboard/${slug}/hackathon`);
    };

  
    const handleViewDashboard = (e: React.MouseEvent) => {
      e.stopPropagation();
        setActiveHackathon(hackathon);
         const slug = slugify(hackathon.title);
      router.push(`/dashboard/${slug}/hackathon`);
    };

    const handleNavigation = (hackathon: any) => {
  setActiveHackathon(hackathon);
 const slug = slugify(hackathon.title);
  router.push(`/hackathon/${slug}`);
};

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
      >
        <div
          className="relative h-48 bg-linear-to-br from-primary/20 to-primary/5 cursor-pointer"
          onClick={() => handleNavigation(hackathon)}
        >
          {hackathon.banner_image ? (
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              src={hackathon.banner_image}
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy className="w-16 h-16 text-primary/30" />
            </div>
          )}

          <div
            className={`absolute top-3 right-3 ${status.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}
          >
            {status.text}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div
          onClick={() => handleNavigation(hackathon)}
            className="cursor-pointer"
          >
            <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
              {hackathon.title}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-sm opacity-60">
              <MapPin className="w-4 h-4" />
              <span>
                {hackathon.venue}, {hackathon.country}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 opacity-60">
              <Calendar className="w-4 h-4" />
              <span>{start.toLocaleDateString()}</span>
            </div>

            {daysLeft > 0 && (
              <div className="flex items-center gap-1 text-primary">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{daysLeft}d left</span>
              </div>
            )}
          </div>

          {/* Prize & Participants */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-lg font-bold">
                ${hackathon.grand_prize?.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1 opacity-60">
              <Users className="w-4 h-4" />
              <span>{hackathon.participants_count}</span>
            </div>
          </div>


<div className="flex gap-2 pt-2">
  {registered ? (
    <>
      {/* Big Registered Status - Non-clickable indicator */}
      <div className="flex-1 flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 py-3 rounded-xl font-bold border border-green-200 dark:border-green-800">
        <Users className="w-5 h-5" />
        Registered
      </div>

      {/* Small Icon-only Dashboard Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleViewDashboard}
        title="View Dashboard"
        className="w-14 flex items-center cursor-pointer justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-primary hover:text-white transition-all"
      >
        <Trophy className="w-6 h-6" /> 
      </motion.button>
    </>
  ) : (isUpcoming || isActive) && (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleRegister}
      disabled={isRegistering}
      className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
    >
      {isRegistering ? (
        <span className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 animate-spin" />
          Registering...
        </span>
      ) : (
        "Register Now"
      )}
    </motion.button>
  )}
</div>
        </div>
      </motion.div>
    );
  }
);

HackathonCard.displayName = "HackathonCard";
