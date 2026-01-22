"use client";
import React from "react";
import All from "./component/All";
import useOrganizer from "@/hooks/useOrganizers";
import { useParams } from "next/navigation";

function SubmitProject() {
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;

  const { useSubmissionById } = useOrganizer();
  const { data, isLoading, isError, refetch, isFetching } =
    useSubmissionById(hackathon_id);

  return (
    <section className="bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-10 rounded-2xl py-5 mb-10 shadow-lg transition-colors w-full overflow-hidden">
      {/* Header */}
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#605DEC] dark:text-indigo-400">
          Submissions
        </h1>
        <p className="text-sm sm:text-base text-[#212121] dark:text-gray-300">
          Review and manage hackathon submissions
        </p>
      </div>

      {/* Content Area */}
      <div className="mt-8 lg:mt-12">
        <All
          submissions={data}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          refetch={refetch}
        />
      </div>
    </section>
  );
}

export default SubmitProject;