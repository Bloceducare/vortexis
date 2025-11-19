"use client";

import React, { useState, useEffect } from "react";
import Invitation from "./component/Invitation";
import JudgesList from "./component/JudgesList";
import { useParams } from "next/navigation";
import useOrganizer from "@/hooks/useOrganizers";

const tab = ["Judges List", "Invite Judges"];

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

  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;

  const { data, isLoading, isFetching, isError, refetch } =
    getHackathonJudges(hackathon_id);

  useEffect(() => {
    if (data) {
      if (data.length > 0) {
        setActiveTab("Judges List");
      } else {
        setActiveTab("Invite Judges");
      }
    }
  }, [data]);

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
      <div className="flex space-x-4 mb-6">
        {tab.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`px-8 py-4 rounded-lg transition cursor-pointer ${
              activeTab === item
                ? "bg-[#605DEC] text-white"
                : "bg-[#F4F3FE] dark:bg-gray-700 text-[#C5C0DB] dark:text-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
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
