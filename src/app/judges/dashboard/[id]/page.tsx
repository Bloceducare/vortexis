"use client";

import JudgeError from "@/components/judgeReview/JudgeError";
import HtmlContent from "@/components/ui/HtMLContent";

import { useHackathon } from "@/hooks/useHackathonDetails";
import { useSubmissionReview } from "@/hooks/useSubmissionReview";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SubmissionsPage() {
  const params = useParams();
  const submissionId = params.id as string;

  const { hackathons, selectedHackathon, loading, error, selectHackathon } =
    useHackathon(submissionId);

  const {
    loading: loadingReview,
    error: errorReview,
    hackathonDetails,
  } = useSubmissionReview(submissionId);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get submissions from the selected hackathon
  const submissions = selectedHackathon || [];

  const transformedSubmissions = hackathons.map((submission) => ({
    id: submission.id,
    hackathonid: submission.hackathon,
    projectName: submission.project.title,
    teamName: submission.team.name,
    // category: "General",
    submissionDate: submission.created_at.split("T")[0],
    status: submission.status,
    teamSize: submission.team.members?.length || 0,
    description: submission.project.description,
    hackathon: hackathonDetails?.title || "",
    githubUrl: submission.project.github_url,
    liveLink: submission.project.live_link,
    presentationUrl: submission.project.presentation_url,
  }));

  const filteredSubmissions = transformedSubmissions.filter((submission) => {
    const matchesSearch =
      submission?.projectName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission?.teamName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || submission?.status === statusFilter;
    // const matchesCategory =
    //   categoryFilter === "all" || submission?.category === categoryFilter;

    // return matchesSearch && matchesStatus && matchesCategory;
    return matchesSearch && matchesStatus;
  });

  const totalSubmissions = transformedSubmissions.length;
  const pendingReviews = transformedSubmissions.filter(
    (s) => s.status === "pending"
  ).length;
  const completedReviews = transformedSubmissions.filter(
    (s) => s.status === "reviewed"
  ).length;

  const handleReviewClick = (submissionId: number) => {
    // Example: router.push(`/submissions/${submissionId}/review`)
  };

  if (loading || loadingReview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#605DEC] dark:border-indigo-400"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading submission details...
          </p>
        </div>
      </div>
    );
  }

  if (error || errorReview) {
    return (
      <JudgeError
        error={error || errorReview || "An unknown error occurred."}
      />
    );
  }

  return (
    <div className="min-h-screen max-w-96 md:max-w-full bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 break-words">
            Hackathon Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Review and evaluate all submitted projects
          </p>

          {/* Hackathon Selector */}
          {/* {hackathons.length > 1 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Hackathon:
              </label>
              <select
                onChange={(e) => selectHackathon(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {hackathons.map((hackathon, index) => (
                  <option key={hackathon.id} value={index}>
                    {hackathon.title}
                  </option>
                ))}
              </select>
            </div>
          )} */}

          {hackathonDetails && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
              <h2 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                {hackathonDetails.title}
              </h2>
              <div className="text-blue-700 dark:text-blue-300 text-sm break-words max-w-full overflow-hidden">
                <HtmlContent html={hackathonDetails.description} />
              </div>
            </div>
          )}
        </div>

        {/*  Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm transition-colors">
            <div className="p-6 pb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Submissions
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalSubmissions}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm transition-colors">
            <div className="p-6 pb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Pending Reviews
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {pendingReviews}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm transition-colors">
            <div className="p-6 pb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Completed Reviews
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {completedReviews}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm mb-6 transition-colors">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by project or team name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              >
                <option value="all">All Categories</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="grid gap-6">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => handleReviewClick(submission.id)}
                className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 break-words">
                            {submission.projectName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 break-words max-w-full overflow-hidden">
                            {submission.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                            submission.status === "pending"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                              : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          }`}
                        >
                          {submission.status === "pending"
                            ? "Pending Review"
                            : "Reviewed"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <span>👥</span>
                          <span className="font-medium">
                            {submission.teamName}
                          </span>
                          <span>({submission.teamSize} members)</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>
                            {new Date(
                              submission.submissionDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Project Links */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {submission.githubUrl && (
                          <a
                            href={submission.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            GitHub
                          </a>
                        )}
                        {submission.liveLink && (
                          <a
                            href={submission.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            Demo
                          </a>
                        )}
                        {submission.presentationUrl && (
                          <a
                            href={submission.presentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          >
                            Presentation
                          </a>
                        )}
                      </div>

                      <div className="mt-2">
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {submission.hackathon}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle view details
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View Details
                      </button> */}
                      <Link
                        href={`/judges/submission-review/${submission.hackathonid}`}
                      >
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          {submission.status === "pending"
                            ? "Start Review"
                            : "View Review"}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm transition-colors">
              <div className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedHackathon
                      ? "No submissions found for this hackathon."
                      : "No hackathons available."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
