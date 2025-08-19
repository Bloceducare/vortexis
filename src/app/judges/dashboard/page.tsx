"use client";

import { useState } from "react";

// Mock data for hackathon submissions
const submissionsData = [
  {
    id: 1,
    projectName: "BlockChain Vote - Secure Voting System",
    teamName: "CRYPTOCODERS",
    category: "Decentralized Applications",
    submissionDate: "2025-01-15",
    status: "pending",
    teamSize: 4,
    description:
      "A decentralized voting platform that ensures transparency and security using blockchain technology.",
    hackathon: "Web3 Innovation Challenge",
  },
  {
    id: 2,
    projectName: "AI-Powered Code Review Assistant",
    teamName: "DevMasters",
    category: "AI/ML",
    submissionDate: "2025-01-14",
    status: "reviewed",
    teamSize: 3,
    description:
      "An intelligent code review tool that uses machine learning to identify bugs and suggest improvements.",
    hackathon: "AI Innovation Summit",
  },
  {
    id: 3,
    projectName: "EcoTrack - Carbon Footprint Monitor",
    teamName: "GreenTech Warriors",
    category: "Sustainability",
    submissionDate: "2025-01-16",
    status: "pending",
    teamSize: 5,
    description:
      "A mobile app that tracks and helps reduce personal carbon footprint through gamification.",
    hackathon: "Climate Tech Challenge",
  },
  {
    id: 4,
    projectName: "HealthSync - Medical Data Platform",
    teamName: "MedTech Innovators",
    category: "Healthcare",
    submissionDate: "2025-01-13",
    status: "reviewed",
    teamSize: 4,
    description:
      "A secure platform for sharing medical records between healthcare providers.",
    hackathon: "HealthTech Hackathon",
  },
  {
    id: 5,
    projectName: "SmartCity Traffic Optimizer",
    teamName: "Urban Solutions",
    category: "IoT",
    submissionDate: "2025-01-17",
    status: "pending",
    teamSize: 6,
    description:
      "An IoT-based system that optimizes traffic flow in urban areas using real-time data.",
    hackathon: "Smart City Challenge",
  },
  {
    id: 6,
    projectName: "CryptoLearn - Blockchain Education",
    teamName: "EduChain",
    category: "Education",
    submissionDate: "2025-01-12",
    status: "reviewed",
    teamSize: 3,
    description:
      "An interactive platform for learning blockchain concepts through hands-on exercises.",
    hackathon: "EdTech Innovation",
  },
];

export default function SubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredSubmissions = submissionsData.filter((submission) => {
    const matchesSearch =
      submission.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || submission.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalSubmissions = submissionsData.length;
  const pendingReviews = submissionsData.filter(
    (s) => s.status === "pending"
  ).length;
  const completedReviews = submissionsData.filter(
    (s) => s.status === "reviewed"
  ).length;

  const handleReviewClick = (submissionId: number) => {
    // Navigate to review page - you can implement routing here
    console.log(`Reviewing submission ${submissionId}`);
    // Example: router.push(`/submissions/${submissionId}/review`)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hackathon Submissions
          </h1>
          <p className="text-gray-600">
            Review and evaluate all submitted projects
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 pb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Total Submissions
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold text-blue-600">
                {totalSubmissions}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 pb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Pending Reviews
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold text-orange-600">
                {pendingReviews}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 pb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Completed Reviews
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold text-green-600">
                {completedReviews}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by project or team name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Decentralized Applications">
                  Decentralized Applications
                </option>
                <option value="AI/ML">AI/ML</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Healthcare">Healthcare</option>
                <option value="IoT">IoT</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="grid gap-6">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => handleReviewClick(submission.id)}
              className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {submission.projectName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {submission.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {submission.status === "pending"
                          ? "Pending Review"
                          : "Reviewed"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>👥</span>
                        <span className="font-medium">
                          {submission.teamName}
                        </span>
                        <span>({submission.teamSize} members)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span>🏷️</span>
                        <span>{submission.category}</span>
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

                    <div className="mt-2">
                      <span className="text-sm text-blue-600 font-medium">
                        {submission.hackathon}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      View Details
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      {submission.status === "pending"
                        ? "Start Review"
                        : "View Review"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No submissions found matching your criteria.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
