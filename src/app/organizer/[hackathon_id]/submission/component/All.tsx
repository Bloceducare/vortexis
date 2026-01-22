import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmissionProps } from "@/app/api/utils/interface";
import TableSkeleton from "@/components/TableSkeleton";
import LinkPreview from "@/components/LinkPreview";

const All: React.FC<SubmissionProps> = ({
  submissions,
  isLoading,
  isFetching,
  isError,
  refetch,
}) => {
  const SubmissionsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [showFull, setShowFull] = useState(false);

  const totalPages = Math.ceil(
    (submissions?.filter((sub) => {
      const matchesSearch = sub.project?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || sub.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    }).length ?? 0) / SubmissionsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const start = (currentPage - 1) * SubmissionsPerPage + 1;
  const end = Math.min(currentPage * SubmissionsPerPage, filteredSubmissions.length);

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  useEffect(() => {
    if (!submissions) return;

    const filtered = submissions.filter((sub) => {
      const matchesSearch = sub.project?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || sub.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const startIndex = (currentPage - 1) * SubmissionsPerPage;
    const endIndex = startIndex + SubmissionsPerPage;

    setFilteredSubmissions(sorted.slice(startIndex, endIndex));
  }, [submissions, searchTerm, sortOrder, statusFilter, currentPage]);

  if (isLoading) return <TableSkeleton />;

  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Failed to load submissions.
        <br />
        <button onClick={refetch} className="mt-2 underline text-blue-500 cursor-pointer">
          Retry
        </button>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="font-semibold text-xl md:text-2xl dark:text-white">
            All Participants
          </h1>
          <p className="text-[#16C098] dark:text-green-400 mt-1 text-sm md:text-base">
            Active Participants
          </p>
        </div>

        {/* Search, Filter & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-[#F9FBFF] dark:bg-gray-700 transition-colors w-full sm:w-auto sm:min-w-[200px]">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#7E7E7E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              className="shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

          {/* Status Filter Dropdown */}
          <div className="flex items-center bg-[#F9FBFF] dark:bg-gray-700 px-3 py-2.5 rounded-lg gap-2 transition-colors w-full sm:w-auto">
            <p className="text-[#7E7E7E] dark:text-gray-400 text-sm whitespace-nowrap">
              Status:
            </p>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="font-semibold text-sm cursor-pointer outline-none bg-transparent text-gray-700 dark:text-gray-300 w-full sm:w-auto"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center bg-[#F9FBFF] dark:bg-gray-700 px-3 py-2.5 rounded-lg gap-2 transition-colors w-full sm:w-auto">
            <p className="text-[#7E7E7E] dark:text-gray-400 text-sm whitespace-nowrap">
              Sort by:
            </p>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "newest" | "oldest");
                setCurrentPage(1);
              }}
              className="font-semibold text-sm cursor-pointer outline-none bg-transparent text-gray-700 dark:text-gray-300 w-full sm:w-auto"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-[#B5B7C0] dark:text-gray-400">
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">Project</th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">Team</th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">Date</th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">Approval</th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm md:text-base"
                >
                  No Submission found.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-[#EEEEEE] dark:border-gray-700 transition-colors"
                >
                  <td className="px-4 py-4" style={{ minWidth: "200px" }}>
                    <h1 className="font-bold text-[#212121] dark:text-white text-sm md:text-base line-clamp-1">
                      {sub.project.title}
                    </h1>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {sub.project.description.length > 80
                        ? `${sub.project.description.slice(0, 80)}...`
                        : sub.project.description}
                    </p>
                  </td>
                  <td className="px-4 py-4" style={{ minWidth: "120px" }}>
                    <h1 className="font-semibold text-[#212121] dark:text-white text-sm md:text-base">
                      {sub.team.name}
                    </h1>
                  </td>
                  <td className="px-4 py-4 text-[#292D32] dark:text-gray-300 font-medium text-xs md:text-sm whitespace-nowrap">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1.5 rounded-lg font-semibold bg-[#F9FBFF] dark:bg-gray-700 text-[#555] dark:text-gray-300 border border-[#DDD] dark:border-gray-600 text-xs md:text-sm whitespace-nowrap inline-block">
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
                      className="text-sm text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors whitespace-nowrap"
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            No Submission found.
          </div>
        ) : (
          filteredSubmissions.map((sub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 space-y-3"
            >
              <div>
                <h2 className="font-bold text-[#212121] dark:text-white text-base mb-1">
                  {sub.project.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {sub.project.description.length > 100
                    ? `${sub.project.description.slice(0, 100)}...`
                    : sub.project.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[#7E7E7E] dark:text-gray-400 text-xs mb-1">Team</p>
                  <p className="font-semibold text-[#212121] dark:text-white">{sub.team.name}</p>
                </div>
                <div>
                  <p className="text-[#7E7E7E] dark:text-gray-400 text-xs mb-1">Date</p>
                  <p className="font-medium text-[#292D32] dark:text-gray-300">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F9FBFF] dark:bg-gray-600 text-[#555] dark:text-gray-300 border border-[#DDD] dark:border-gray-500">
                    {sub.status}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      sub.approved
                        ? "bg-[#16C09861] text-[#16C098] border-[#16C098]"
                        : "bg-[#F9831C61] text-[#F9831C] border-[#F9831C]"
                    }`}
                  >
                    {sub.approved ? "Approved" : "Not Approved"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSubmission(sub)}
                  className="text-sm text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  View Details →
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <p className="text-[#727272] dark:text-gray-400 text-sm text-center sm:text-left">
          Showing {end === 0 ? "0" : start} to {end} of {submissions?.length ?? 0} entries
        </p>

        <nav className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 md:px-4 py-2 rounded-lg cursor-pointer bg-[#F5F5F5] dark:bg-gray-700 border border-[#EEEEEE] dark:border-gray-600 text-[#404B52] dark:text-gray-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">{"<"}</span>
          </button>

          <div className="flex gap-1 md:gap-2 overflow-x-auto max-w-[200px] sm:max-w-none">
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
            className="px-3 md:px-4 py-2 rounded-lg cursor-pointer bg-[#F5F5F5] dark:bg-gray-700 border border-[#EEEEEE] dark:border-gray-600 text-[#404B52] dark:text-gray-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">{">"}</span>
          </button>
        </nav>
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setSelectedSubmission(null);
              setShowFull(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#605DEC] to-[#7c79f5] dark:from-indigo-600 dark:to-indigo-700 p-6 md:p-8">
                <button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setShowFull(false);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                <div className="pr-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {selectedSubmission.project.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                      {selectedSubmission.team.name}
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                      {new Date(selectedSubmission.created_at).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        selectedSubmission.approved
                          ? "bg-green-500/90 text-white"
                          : "bg-orange-500/90 text-white"
                      }`}
                    >
                      {selectedSubmission.approved ? "✓ Approved" : "⊗ Not Approved"}
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Project Description
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {showFull
                      ? selectedSubmission.project.description
                      : `${selectedSubmission.project.description.slice(0, 200)}${
                          selectedSubmission.project.description.length > 200 ? "..." : ""
                        }`}
                  </p>
                  {selectedSubmission.project.description.length > 200 && (
                    <button
                      onClick={() => setShowFull(!showFull)}
                      className="mt-3 text-[#605DEC] dark:text-indigo-400 text-sm font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      {showFull ? (
                        <>
                          Show less
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </>
                      ) : (
                        <>
                          Read more
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Links Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Project Links
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* GitHub URL */}
                    {selectedSubmission.project.github_url ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700 dark:text-gray-300">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <h4 className="font-semibold text-gray-800 dark:text-white">GitHub Repository</h4>
                        </div>
                        <LinkPreview
                          url={selectedSubmission.project.github_url}
                          width="100%"
                          descriptionLength={80}
                          className="rounded-xl shadow-md border dark:border-gray-600 hover:shadow-lg transition-shadow"
                        />
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No GitHub URL provided</p>
                      </div>
                    )}

                    {/* Live URL */}
                    {selectedSubmission.project.live_link ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 dark:text-gray-300">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                          </svg>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Live Demo</h4>
                        </div>
                        <LinkPreview
                          url={selectedSubmission.project.live_link}
                          width="100%"
                          descriptionLength={80}
                          className="rounded-xl shadow-md border dark:border-gray-600 hover:shadow-lg transition-shadow"
                        />
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No live demo URL provided</p>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </motion.div>
          
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

export default All;