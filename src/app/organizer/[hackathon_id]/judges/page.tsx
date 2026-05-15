"use client";

import React, { useState, useEffect } from "react";
import Invitation from "./component/Invitation";
import JudgesList from "./component/JudgesList";
import { useParams } from "next/navigation";
import useOrganizer from "@/hooks/useOrganizers";
import { motion } from "framer-motion";
import { useHackathonStore } from "@/store/useHackathonStore";

const defaultTabs = ["Judges List", "Invite Judges"];

function JudgesSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Tabs Skeleton */}
      <div className="flex space-x-4">
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* List Skeleton */}
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-lg w-full"></div>
        ))}
      </div>
    </div>
  );
}

function Judges() {
  const [activeTab, setActiveTab] = useState("");

  const { getHackathonJudges } = useOrganizer();

    const activeHackathon = useHackathonStore((state) => state.activeHackathon);
       const hackathon_id = activeHackathon?.id as string;

  const { data, isLoading, isFetching, isError, refetch } =
    getHackathonJudges(hackathon_id);

  const { getHackathonById } = useOrganizer();
  const { data: hackathonData } = getHackathonById(hackathon_id);

  const hasEnded = hackathonData?.end_date
    ? new Date() > new Date(hackathonData.end_date)
    : false;

  const tabs = hasEnded ? ["Judges List"] : defaultTabs;

  useEffect(() => {
    if (data) {
      if (data.length > 0 || hasEnded) {
        setActiveTab("Judges List");
      } else {
        setActiveTab("Invite Judges");
      }
    }
  }, [data, hasEnded]);

  if (isLoading || isFetching) {
    return (
      <section className="bg-white dark:bg-gray-800 px-10 rounded-2xl py-5 transition-colors">
        <JudgesSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        Failed to load judges.
        <br />
        <button
          onClick={() => refetch}
          className="mt-2 underline text-blue-600 dark:text-blue-400 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 px-10 rounded-2xl py-5 transition-colors">
      {/* Tabs */}
<div className="flex gap-2 mb-6 bg-[#F4F3FE] dark:bg-gray-900 p-2 rounded-xl w-fit">
  {tabs.map((item) => {
    const isActive = activeTab === item;

    return (
      <button
        key={item}
        onClick={() => setActiveTab(item)}
        className="relative px-6 py-2.5 rounded-lg text-sm font-medium z-10 cursor-pointer"
      >
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-[#605DEC] rounded-lg"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}

        <span
          className={`relative z-10 transition-colors ${
            isActive ? "text-white" : "text-[#6B66A3] dark:text-gray-300"
          }`}
        >
          {item}
        </span>
      </button>
    );
  })}
</div>


      {/* Content */}
      <div>
        {activeTab === "Invite Judges" && (
          <Invitation hackathon_id={hackathon_id} />
        )}
        {activeTab === "Judges List" && (
          <JudgesList
            judges={data}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            refetch={refetch}
          />
        )}
      </div>
    </section>
  );
}

export default Judges;
