"use client";

import React, { useState } from "react";
import useTeams from "@/hooks/useTeams";
import { UserTeam } from "@/app/api/utils/interface";
import { motion } from "framer-motion";
import { Search, Users, Calendar } from "lucide-react";

interface JoinTeamProps {
  onClose: () => void;
  hackathon_id: string;
}

export default function JoinTeam({ onClose, hackathon_id }: JoinTeamProps) {
  const { getAvailableTeams, joinTeamMutation } = useTeams();
  const { data, isLoading } = getAvailableTeams(hackathon_id);

  const { mutateAsync: joinTeam } = joinTeamMutation();

  const [search, setSearch] = useState("");
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJoinTeam = async (teamId: string, hackathon_id: string) => {
    setError(null);
    setJoiningTeamId(teamId);
    try {
      const response = await joinTeam({ teamId, hackathon_id });
      console.log("Joined successfully:", response);
      window.location.reload()
      onClose();
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
    <section className="min-h-screen bg-gray-50 rounded-xl p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:text-black transition"
        >
          ← Go back
        </button>
      </div>

      {/* Title & instructions */}
      <div className="text-center mb-8">
        <h2 className="font-bold text-3xl mb-2 text-gray-900">Join a Team</h2>
        <p className="text-gray-600">
          Find a team for this hackathon. You can only join{" "}
          <span className="font-semibold">one team</span>.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto mb-4 text-red-600 bg-red-100 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600">Loading teams...</span>
        </div>
      ) : filteredTeams && filteredTeams.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team: UserTeam, index: number) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {team.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Users size={16} className="mr-2" />
                  Members: {team.members?.length || 0}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={16} className="mr-2" />
                  {new Date(team.created_at).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() =>
                  handleJoinTeam(team.id.toString(), hackathon_id)
                }
                disabled={!!joiningTeamId}
                className={`mt-4 px-4 py-2 rounded-lg text-white transition cursor-pointer ${
                  joiningTeamId === team.id.toString()
                    ? "bg-blue-400 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {joiningTeamId === team.id.toString()
                  ? "Joining..."
                  : "Join Team"}
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col justify-center items-center h-40 text-gray-500 bg-gray-100 rounded-lg"
        >
          <Users size={40} className="mb-2 text-gray-400" />
          <p>No teams available yet.</p>
        </motion.div>
      )}
    </section>
  );
}
