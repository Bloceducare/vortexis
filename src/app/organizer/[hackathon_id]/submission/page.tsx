"use client";
import React, { useEffect, useState } from "react";
import All from "./component/All";
import Pending from "./component/Pending";
import Reviewed from "./component/Reviewed";
import Rejected from "./component/Rejected";
import useOrganizer from "@/hooks/useOrganizers";
import { useParams } from "next/navigation";

function SubmitProject() {
  const [activeButton, setActiveButton] = useState("All Submission");
  const Buttons = ["All Submission", "Pending", "Reviewed", "Rejected"];
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;

  const { useSubmissionById } = useOrganizer();
  const { data, isLoading, isError, refetch, isFetching } =
    useSubmissionById(hackathon_id);

  const renderComponent = () => {
    switch (activeButton) {
      case "All Submission":
        return (
          <All
            submissions={data}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            refetch={refetch}
          />
        );
      case "Pending":
        return (
          <Pending
            submissions={data}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            refetch={refetch}
          />
        );
      case "Reviewed":
        return (
          <Reviewed
            submissions={data}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            refetch={refetch}
          />
        );
      case "Rejected":
        return (
          <Rejected
            submissions={data}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            refetch={refetch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-10 rounded-2xl py-5 mb-10 shadow-lg transition-colors">
      {/* Header */}
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#605DEC] dark:text-indigo-400">
          Submissions
        </h1>
        <p className="text-sm sm:text-base text-[#212121] dark:text-gray-300">
          Review and manage hackathon submissions
        </p>
      </div>

      {/* Tab Buttons - Improved Mobile Responsiveness */}
      <div className="mb-6 mt-4">
        {/* Mobile: 2x2 Grid */}
        <div className="grid grid-cols-2 sm:hidden gap-3">
          {Buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => setActiveButton(btn)}
              className={`py-3 px-2 rounded-lg transition cursor-pointer font-medium text-xs ${
                btn === activeButton
                  ? "bg-[#605DEC] text-white shadow-md"
                  : "bg-[#F4F3FE] dark:bg-gray-700 text-[#C5C0DB] dark:text-gray-300 hover:bg-[#E8E7FC] dark:hover:bg-gray-600"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Tablet & Desktop: Horizontal Layout */}
        <div className="hidden sm:flex flex-wrap lg:flex-nowrap gap-3">
          {Buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => setActiveButton(btn)}
              className={`flex-1 lg:flex-none lg:min-w-40 py-3 px-4 rounded-lg transition cursor-pointer font-medium text-sm ${
                btn === activeButton
                  ? "bg-[#605DEC] text-white shadow-md"
                  : "bg-[#F4F3FE] dark:bg-gray-700 text-[#C5C0DB] dark:text-gray-300 hover:bg-[#E8E7FC] dark:hover:bg-gray-600"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-8 lg:mt-12">
        {renderComponent()}
      </div>
    </section>
  );
}

export default SubmitProject;