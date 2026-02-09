"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCountries, Country } from "@/app/api/country/getCountries";
import { useParams, useRouter } from "next/navigation";
import useOrganizer from "@/hooks/useOrganizers";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Search,
  ExternalLink,
  Trophy,
  Calendar,
  Filter,
} from "lucide-react";
import TableSkeleton from "@/components/TableSkeleton";

interface Member {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_creator: boolean;
}

interface Team {
  id: number;
  name: string;
  organizer: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  creator: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  members: Member[];
  hackathon: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
  };
  projects: Array<{ id: number; title: string }>;
  submissions: Array<{ id: number; project_title: string }>;
  created_at: string;
  updated_at: string;
}

function Participants() {
  const teamsPerPage = 8;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());

  const { useParticipants } = useOrganizer();
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;

  const { data, isLoading, isError } = useParticipants(hackathon_id);

  const teams: Team[] = data ?? [];

  const filteredTeams = teams.filter((team) => {
    const teamName = team.name.toLowerCase();
    const creatorName =
      `${team.creator.first_name} ${team.creator.last_name}`.toLowerCase();
    const memberNames = team.members
      .map((m) => `${m.first_name} ${m.last_name}`.toLowerCase())
      .join(" ");

    const search = searchTerm.toLowerCase();
    return (
      teamName.includes(search) ||
      creatorName.includes(search) ||
      memberNames.includes(search)
    );
  });

  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);
  const startIndex = (currentPage - 1) * teamsPerPage;
  const paginatedTeams = filteredTeams.slice(
    startIndex,
    startIndex + teamsPerPage
  );

  // Count total participants
  const totalParticipants = teams.reduce(
    (sum, team) => sum + team.members.length,
    0
  );

  const toggleTeamExpansion = (teamId: number) => {
    setExpandedTeams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () =>
    currentPage < totalPages && handlePageChange(currentPage + 1);
  const handlePrev = () => currentPage > 1 && handlePageChange(currentPage - 1);

  if (isLoading) return <TableSkeleton />;

  if (isError)
    return (
      <p className="p-10 text-lg text-red-500">Failed to load participants.</p>
    );

  return (
    <section className="bg-gradient-to-br dark:bg-gray-800  from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl dark:text-indigo-400 font-bold text-title mb-2">
            Participant Management
          </h1>
          <p className=" opacity-60">
            View and manage hackathon participants by teams
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm  opacity-60 mb-1">Total Teams</p>
                <p className="text-3xl font-bold text-title">{teams.length}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm  opacity-60 mb-1">Total Participants</p>
                <p className="text-3xl font-bold text-title">
                  {totalParticipants}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm  opacity-60 mb-1">Projects Submitted</p>
                <p className="text-3xl font-bold text-title">
                  {teams.reduce((sum, team) => sum + team.projects.length, 0)}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by team name or participant..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl  focus:outline-none focus:border-primary transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Teams List */}
        <div className="space-y-4">
          {paginatedTeams.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No teams found matching your search.
              </p>
            </motion.div>
          ) : (
            paginatedTeams.map((team, index) => {
              const isExpanded = expandedTeams.has(team.id);
              const memberColors = [
                "bg-red-500",
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-purple-500",
                "bg-pink-500",
                "bg-indigo-500",
              ];

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-title">
                          {team.name}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-sm font-semibold rounded-full">
                          {team.members.length} Members
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm  opacity-60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined{" "}
                          {new Date(team.created_at).toLocaleDateString()}
                        </span>
                        {team.projects.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            {team.projects.length} Project
                            {team.projects.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTeamExpansion(team.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Members Preview (Always Visible) */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm  opacity-60">Team Lead:</span>
                    <div
                      onClick={() => router.push(`/profile/${team.creator.id}`)}
                      className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-8 h-8 ${memberColors[0]} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                      >
                        {team.creator.first_name[0]}
                        {team.creator.last_name[0]}
                      </div>
                      <span className="text-sm font-medium text-title">
                        {team.creator.first_name} {team.creator.last_name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4"
                    >
                      {/* All Members */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold  opacity-60 mb-3">
                          All Team Members ({team.members.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {team.members.map((member, idx) => (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() =>
                                router.push(`/profile/${member.id}`)
                              }
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
                            >
                              <div
                                className={`w-10 h-10 ${
                                  memberColors[idx % memberColors.length]
                                } rounded-full flex items-center justify-center text-white font-semibold`}
                              >
                                {member.first_name[0]}
                                {member.last_name[0]}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-title text-sm">
                                  {member.first_name} {member.last_name}
                                </p>
                                <p className="text-xs  opacity-60">
                                  @{member.username}
                                  {member.is_creator && (
                                    <span className="ml-2 text-primary font-semibold">
                                      • Team Lead
                                    </span>
                                  )}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Projects */}
                      {team.projects.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold  opacity-60 mb-3">
                            Project
                          </h4>
                          <div className="space-y-2">
                            {team.projects.map((project) => (
                              <div
                                key={project.id}
                                className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                              >
                                <Trophy className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-title">
                                  {project.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <p className="text-sm  opacity-60">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + teamsPerPage, filteredTeams.length)} of{" "}
              {filteredTeams.length} teams
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Participants;
