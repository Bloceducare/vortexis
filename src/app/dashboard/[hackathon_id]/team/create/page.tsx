"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import useTeams from "@/hooks/useTeams";
import { useParams } from "next/navigation";


export default function CreateTeam() {
      const params = useParams();
        const hackathon_id = params?.hackathon_id as string;
  const { createTeamMutation } = useTeams();

  const [formData, setFormData] = useState({
    name: "",
    members: [] as string[],
  });
  const [memberInput, setMemberInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddMember = () => {
    const email = memberInput.trim().toLowerCase();
    if (email && isValidEmail(email) && !formData.members.includes(email)) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, email],
      }));
      setMemberInput("");
    }
  };

  const handleRemoveMember = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== email),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Team name is required.");
      return;
    }

    
    try {
      await createTeamMutation.mutateAsync({
        hackathon_id,
        name: formData.name,
        members: formData.members,
      });
    
    } catch (err: any) {
      setError(err.message || "Failed to create team.");
    }
  };

  const onClose = () => {
    window.history.back();
  }

  return (
    <div className="bg-white h-screen rounded-xl z-50 flex justify-center items-center">


      <div className="bg-white w-full max-w-2xl sm:rounded-2xl border border-gray-200 p-8 overflow-y-auto">
        <h2 className="font-semibold mb-6 text-2xl text-gray-900 text-center">
          Create a Team
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 p-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Team Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Team Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter team name"
              className="mt-2 border-gray-300 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Members */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Members
            </label>
            <div className="flex gap-2 mt-2">
              <Input
                name="members"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                placeholder="Enter member email"
                className="border-gray-300 focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddMember}
                disabled={!memberInput}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            {/* Member chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.members.map((email) => (
                <span
                  key={email}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(email)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

        
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={createTeamMutation.isPending}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTeamMutation.isPending}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
            >
              {createTeamMutation.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
