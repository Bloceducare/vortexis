"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Users, Clock } from "lucide-react";

interface HackathonCardProps {
  hackathon: any;
  index: number;
  onClick: () => void;
  onRegister: () => void;
  isRegistering: boolean;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  index,
  onClick,
  onRegister,
  isRegistering,
}) => {
  const now = new Date();
  const start = new Date(hackathon.start_date);
  const end = new Date(hackathon.end_date);
  const daysLeft = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUpcoming = start > now;
  const isActive = start <= now && end >= now;
  const isEnded = end < now;

  const getStatusBadge = () => {
    if (isEnded) return { text: "Ended", color: "bg-gray-500" };
    if (isActive) return { text: "Active", color: "bg-green-500" };
    return { text: "Upcoming", color: "bg-blue-500" };
  };

  const status = getStatusBadge();

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
      {/* Image */}
      <div
        className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden group cursor-pointer"
        onClick={onClick}
      >
        {hackathon.banner_image && hackathon.banner_image.trim() !== "" ? (
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

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 ${status.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}
        >
          {status.text}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div onClick={onClick} className="cursor-pointer">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary dark:hover:text-indigo-400 transition-colors line-clamp-2">
            {hackathon.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 mt-2 text-sm opacity-60 dark:opacity-70 dark:text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>
              {hackathon.venue}, {hackathon.country}
            </span>
          </div>
        </div>

        {/* Date Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-base opacity-60 dark:opacity-70 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>{start.toLocaleDateString()}</span>
          </div>
          {daysLeft > 0 && (
            <div className="flex items-center gap-1 text-primary dark:text-indigo-400">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{daysLeft}d left</span>
            </div>
          )}
        </div>

        {/* Prize & Participants */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-lg font-bold text-title dark:text-white">
              ${hackathon.grand_prize?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-base opacity-60 dark:opacity-70 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">{hackathon.participants_count}</span>
          </div>
        </div>

        {/* Register Button */}
        {(isUpcoming || isActive) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onRegister();
            }}
            disabled={isRegistering}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            {isRegistering ? "Registering..." : "Register Now"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
