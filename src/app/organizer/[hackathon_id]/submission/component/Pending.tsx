"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SubmissionProps, HackathonSubmission } from "@/app/api/utils/interface";
import TableSkeleton from "@/components/TableSkeleton";
import LinkPreview from "@/components/LinkPreview";

const Pending: React.FC<SubmissionProps> = ({
  submissions,
  isLoading,
  isFetching,
  isError,
  refetch,
}) => {
  const SubmissionPerPage = 8;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filteredSubmissions, setFilteredSubmissions] = useState<HackathonSubmission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [showFull, setShowFull] = useState(false);

  const pendingSubmissions = submissions.filter((item) => item?.status === "pending");

  const totalPages = Math.ceil(
    pendingSubmissions.filter((sub) =>
      sub.project?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / SubmissionPerPage
  );

  useEffect(() => {
    const filtered = pendingSubmissions.filter((sub) =>
      sub.project?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const startIndex = (currentPage - 1) * SubmissionPerPage;
    const endIndex = startIndex + SubmissionPerPage;
    setFilteredSubmissions(sorted.slice(startIndex, endIndex));
  }, [searchTerm, sortOrder, currentPage, submissions]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && handlePageChange(currentPage + 1);
  const handlePrev = () => currentPage > 1 && handlePageChange(currentPage - 1);

  const start = (currentPage - 1) * SubmissionPerPage + 1;
  const end = Math.min(currentPage * SubmissionPerPage, pendingSubmissions.length);

  if (isLoading) return <TableSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 px-3 xl:px-5 mb-6">
        <div>
          <h1 className="font-semibold text-xl md:text-2xl dark:text-white">
            All Participants
          </h1>
          <p className="text-[#16C098] dark:text-green-400 mt-1 text-sm md:text-base">
            Active Participants
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-[#F9FBFF] dark:bg-gray-700 transition-colors flex-1 sm:flex-none sm:min-w-62.5">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="shrink-0">
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#7E7E7E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 20.9984L16.65 16.6484"
                stroke="#7E7E7E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search submission"
              className="w-full outline-none border-none bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center bg-[#F9FBFF] dark:bg-gray-700 px-3 py-2.5 rounded-lg gap-2 transition-colors">
            <p className="text-[#7E7E7E] dark:text-gray-400 text-sm whitespace-nowrap">Sort by:</p>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "newest" | "oldest");
                setCurrentPage(1);
              }}
              className="font-semibold text-sm cursor-pointer outline-none bg-transparent text-gray-700 dark:text-gray-300"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-3 xl:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-[#B5B7C0] dark:text-gray-400">
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium">Project</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium">Team</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium">Approval</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm md:text-base">
                    No pending submissions found.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-[#EEEEEE] dark:border-gray-700 transition-colors"
                  >
                    <td className="px-4 py-4 min-w-50">
                      <h1 className="font-bold text-[#212121] dark:text-white text-sm md:text-base line-clamp-1">
                        {sub.project.title}
                      </h1>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {sub.project.description.length > 80
                          ? `${sub.project.description.slice(0, 80)}...`
                          : sub.project.description}
                      </p>
                    </td>
                    <td className="px-4 py-4 min-w-30">
                      <h1 className="font-semibold text-[#212121] dark:text-white text-sm md:text-base">
                        {sub.team.name}
                      </h1>
                    </td>
                    <td className="px-4 py-4 text-[#292D32] dark:text-gray-300 font-medium text-xs md:text-sm whitespace-nowrap">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1.5 rounded-lg font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 text-xs md:text-sm whitespace-nowrap">
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg font-semibold border text-xs md:text-sm whitespace-nowrap inline-block ${
                          sub.approved
                            ? "bg-[#16C09861] text-[#16C098] border-[#16C098]"
                            : "bg-[#F9831C61] text-[#F9831C] border-[#F9831C]"
                        }`}
                      >
                        {sub.approved ? "Approved" : "Not Approved"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-sm text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-3 xl:px-5">
        <p className="text-[#727272] dark:text-gray-400 text-sm text-center sm:text-left">
          Showing {end === 0 ? "0" : start} to {end} of {pendingSubmissions.length} entries
        </p>

        <nav className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 md:px-4 py-2 rounded-lg cursor-pointer bg-[#F5F5F5] dark:bg-gray-700 border border-[#EEEEEE] dark:border-gray-600 text-[#404B52] dark:text-gray-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">{"<"}</span>
          </button>

          <div className="flex gap-1 md:gap-2 overflow-x-auto max-w-50 sm:max-w-none">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === index + 1
                    ? "bg-[#5932EA] text-white"
                    : "bg-[#F5F5F5] dark:bg-gray-700 text-[#404B52] dark:text-gray-300 border border-[#EEEEEE] dark:border-gray-600 hover:bg-[#5932EA] hover:text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 md:px-4 py-2 rounded-lg cursor-pointer bg-[#F5F5F5] dark:bg-gray-700 border border-[#EEEEEE] dark:border-gray-600 text-[#404B52] dark:text-gray-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">{">"}</span>
          </button>
        </nav>
      </div>

      {/* Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSubmission(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
            >
              ✕
            </button>

            <h2 className="text-xl md:text-2xl font-bold mb-3 dark:text-white pr-8">
              {selectedSubmission.project.title}
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-300 mb-4 leading-relaxed">
              {showFull
                ? selectedSubmission.project.description
                : `${selectedSubmission.project.description.slice(0, 150)}${
                    selectedSubmission.project.description.length > 150 ? "..." : ""
                  }`}
            </p>

            {selectedSubmission.project.description.length > 150 && (
              <button
                onClick={() => setShowFull(!showFull)}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer mb-4"
              >
                {showFull ? "See less" : "See more"}
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="font-bold mb-3 dark:text-white text-sm md:text-base">Github URL</h3>
                {selectedSubmission.project.github_url && (
                  <LinkPreview
                    url={selectedSubmission.project.github_url}
                    width="100%"
                    descriptionLength={80}
                    className="rounded-lg shadow border dark:border-gray-700"
                  />
                )}
              </div>
              <div>
                <h3 className="font-bold mb-3 dark:text-white text-sm md:text-base">Live URL</h3>
                {selectedSubmission.project.live_link && (
                  <LinkPreview
                    url={selectedSubmission.project.live_link}
                    width="100%"
                    descriptionLength={80}
                    className="rounded-lg shadow border dark:border-gray-700"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Pending;