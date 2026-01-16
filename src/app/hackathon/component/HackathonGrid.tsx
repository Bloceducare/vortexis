"use client";
import { motion, AnimatePresence } from "framer-motion";
import { HackathonCard } from "./HackathonCard";
import { SkeletonCard } from "./SkeletonCard";
import { useHackathonStore } from "@/store/useHackathonStore";

interface HackathonGridProps {
  hackathons: any[];
  isLoading: boolean;
  onCardClick: (id: string) => void;
  onRegister: (id: string) => void;
  activeHackathon: string | null;
  isRegistering: boolean;
}

export const HackathonGrid: React.FC<HackathonGridProps> = ({
  hackathons,
  isLoading,
  onCardClick,
  onRegister,
  activeHackathon,
  isRegistering,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );
  }

  const hackathonsRegisteredFor = useHackathonStore((state) => state.hackathons);
  const registeredIds = hackathonsRegisteredFor.map(h => h.id);
  console.log(hackathonsRegisteredFor)


  if (hackathons.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <p className="text-xl opacity-60 dark:opacity-70 dark:text-gray-300">
          No hackathons found matching your filters.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <AnimatePresence mode="popLayout">
        {hackathons.map((hackathon, index) => (
          <HackathonCard
            key={hackathon.id}
            hackathon={hackathon}
            index={index}
            onClick={() => onCardClick(hackathon.id)}
            onRegister={() => onRegister(hackathon.id)}
            isRegistering={activeHackathon === hackathon.id && isRegistering}
            registered={registeredIds.includes(hackathon.id)}
            />
        ))}
      </AnimatePresence>
    </div>
  );
};
