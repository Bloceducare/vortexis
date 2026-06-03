"use client";

import React, { useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HackathonCard } from "./HackathonCard";
import { SkeletonCard } from "./SkeletonCard";
import useParticipants from "@/hooks/useParticipants";
import { useUserHackathonsStore } from "@/store/useUserHackathons";

interface Hackathon {
  id: string;
  title: string;
  start_date: string;
  banner_image_file: string;
  end_date: string;
  venue: string;
  country: string;
  [key: string]: any;
}

interface HackathonGridProps {
  hackathons: Hackathon[];
  isLoading: boolean;
  onCardClick: (id: string) => void;
  onRegister: (id: string) => void;
  activeHackathon: string | null;
  isRegistering: boolean;
  isDisabled?: boolean;
  onNavigate?: () => void;
}

export const HackathonGrid: React.FC<HackathonGridProps> = React.memo(
  ({
    hackathons,
    isLoading,
    onCardClick,
    onRegister,
    activeHackathon,
    isRegistering,
    isDisabled,
    onNavigate,
  }) => {
    const { getHackathons } = useParticipants();
    const {
      data: registeredHackathons = [],
      isLoading: isRegisteredLoading,
      isFetching: isRegisteredFetching,
    } = getHackathons();

    const { setHackathons } = useUserHackathonsStore();

useEffect(() => {
  if (!registeredHackathons?.length) return;

  // 1. Get current hackathons from your store state (or pass it into the effect)
  // Assuming 'hackathons' is your current state variable
  const prevIds = new Set(hackathons.map(h => h.id));
const newIds = new Set(registeredHackathons.map((h: Hackathon) => h.id));
  const isSame =
    hackathons.length === registeredHackathons.length &&
    [...prevIds].every((id) => newIds.has(id));

  // 2. Only call the setter if data actually changed
  if (!isSame) {
    setHackathons(registeredHackathons);
  }
}, [registeredHackathons, hackathons, setHackathons]);
    const registeredIds = useMemo(
      () => new Set(registeredHackathons.map((h: any) => h.id)),
      [registeredHackathons]
    );

    const isStillLoading =
      isLoading || isRegisteredLoading || isRegisteredFetching;

    if (isStillLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

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
              onClick={onCardClick}
              onRegister={onRegister}
              isRegistering={
                activeHackathon === hackathon.id && isRegistering
              }
              registered={registeredIds.has(hackathon.id)}
              isDisabled={isDisabled}
              onNavigate={onNavigate}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

HackathonGrid.displayName = "HackathonGrid";
