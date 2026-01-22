"use client";

import React, { useState } from "react";
import useTeams from "@/hooks/useTeams";
import { UserTeam } from "@/app/api/utils/interface";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  Calendar,
  ArrowLeft,
  Crown,
  UserCircle,
  FolderKanban,
  FileCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { string } from "zod";



export default function JoinTeamPage() {
    const params = useParams();
    const hackathon_id = params?.hackathon_id as string;
  const { getAvailableTeams, joinTeamMutation } = useTeams();

  const { data, isLoading } = getAvailableTeams(hackathon_id);
  const { mutateAsync: joinTeam } = joinTeamMutation();

  const [search, setSearch] = useState("");
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<UserTeam | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJoinTeam = async ( { teamId, teamName }: { teamId: string; teamName: string }) => {
    setError(null);
    setJoiningTeamId(teamId);
    try {
      await joinTeam({ teamId, hackathon_id, teamName });
      window.location.href = `/dashboard/${hackathon_id}/team`;
    } catch (err: any) {
      console.error("Error joining team:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setJoiningTeamId(null);
    }
  };

  const filteredTeams = data?.filter((team: UserTeam) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/${hackathon_id}`}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Join a Team
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Users className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={24} />
            <div>
              <h2 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-1">
                Find Your Perfect Team
              </h2>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Browse available teams and join one that matches your interests. You can only join{" "}
                <span className="font-bold">one team per hackathon</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6"
            >
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teams by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">Loading available teams...</p>
          </div>
        ) : filteredTeams && filteredTeams.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team: UserTeam, index: number) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Team Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                    {team.name}
                  </h3>
                  
                  {/* Organizer */}
                  <Link
                    href={`/profile/${team.organizer.id}`}
                    className="flex items-center gap-2 mb-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                  >
                    <Crown className="text-yellow-500" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Team Lead</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {team.organizer.first_name} {team.organizer.last_name}
                      </p>
                    </div>
                  </Link>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users size={16} />
                      <span>{team.members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={16} />
                      <span>{new Date(team.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Users size={16} />
                    Team Members ({team.members?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {team.members && team.members.length > 0 ? (
                      team.members.map((member) => (
                        <Link
                          key={member.id}
                          href={`/profile/${member.id}`}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <UserCircle className="text-gray-400" size={20} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              @{member.username}
                            </p>
                          </div>
                          {member.is_creator && (
                            <Crown className="text-yellow-500 shrink-0" size={16} />
                          )}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No members yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Projects & Submissions */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FolderKanban size={16} />
                      <span>Projects</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {team.projects?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FileCheck size={16} />
                      <span>Submissions</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {team.submissions?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleJoinTeam({ teamId: team.id.toString(), teamName: team.name })}
                    disabled={!!joiningTeamId}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      joiningTeamId === team.id.toString()
                        ? "bg-blue-400 cursor-wait"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {joiningTeamId === team.id.toString() ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Joining...
                      </>
                    ) : (
                      "Join Team"
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            <Users size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No teams available yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {search ? "Try adjusting your search" : "Be the first to create a team!"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Team Details Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTeam(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTeam.name}
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Organizer Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Team Lead
                  </h3>
                  <Link
                    href={`/profile/${selectedTeam.organizer.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Crown className="text-yellow-500" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedTeam.organizer.first_name} {selectedTeam.organizer.last_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{selectedTeam.organizer.username}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* All Members */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    All Members ({selectedTeam.members?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {selectedTeam.members?.map((member) => (
                      <Link
                        key={member.id}
                        href={`/profile/${member.id}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <UserCircle className="text-gray-400" size={24} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{member.username}
                          </p>
                        </div>
                        {member.is_creator && (
                          <Crown className="text-yellow-500" size={20} />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                {selectedTeam.projects && selectedTeam.projects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Projects
                    </h3>
                    <div className="space-y-2">
                      {selectedTeam.projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                        >
                          <FolderKanban className="text-blue-500" size={20} />
                          <p className="text-gray-900 dark:text-white">{project.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleJoinTeam({ teamId: selectedTeam.id.toString(), teamName: selectedTeam.name });
                    setSelectedTeam(null);
                  }}
                  disabled={!!joiningTeamId}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {joiningTeamId === selectedTeam.id.toString() ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Joining...
                    </>
                  ) : (
                    "Join This Team"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}