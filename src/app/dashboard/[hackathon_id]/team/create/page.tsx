"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import useTeams from "@/hooks/useTeams";
import { useParams, useRouter } from "next/navigation";
import StatusModal from "@/components/StatusModal";

export default function CreateTeam() {
  const params = useParams();
  const router = useRouter();
  const hackathon_id = params?.hackathon_id as string;
  const { createTeamMutation } = useTeams();

  const [formData, setFormData] = useState({
    name: "",
    members: [] as string[],
  });
  const [memberInput, setMemberInput] = useState("");
  const [modal, setModal] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
    title?: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddMember = () => {
    const email = memberInput.trim().toLowerCase();
    
    if (!email) {
      setModal({
        open: true,
        type: "error",
        message: "Please enter an email address.",
        title: "Email Required",
      });
      return;
    }

    if (!isValidEmail(email)) {
      setModal({
        open: true,
        type: "error",
        message: "Please enter a valid email address.",
        title: "Invalid Email",
      });
      return;
    }

    if (formData.members.includes(email)) {
      setModal({
        open: true,
        type: "error",
        message: "This member has already been added.",
        title: "Duplicate Email",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, email],
    }));
    setMemberInput("");
  };

  const handleRemoveMember = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== email),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setModal({
        open: true,
        type: "error",
        message: "Team name is required. Please enter a name for your team.",
        title: "Team Name Required",
      });
      return;
    }

    try {
      await createTeamMutation.mutateAsync({
        hackathon_id,
        name: formData.name,
        members: formData.members,
      });

      setModal({
        open: true,
        type: "success",
        message: `Team "${formData.name}" has been created successfully! ${
          formData.members.length > 0
            ? `Invitations sent to ${formData.members.length} member${
                formData.members.length > 1 ? "s" : ""
              }.`
            : ""
        }`,
        title: "Team Created! 🎉",
      });


      setFormData({ name: "", members: [] });
      setMemberInput("");
    } catch (err: any) {
      setModal({
        open: true,
        type: "error",
        message: err?.message || "Failed to create team. Please try again.",
        title: "Creation Failed",
      });
    }
  };

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, open: false }));
    
    // If success, navigate back to team page
    if (modal.type === "success") {
      router.push(`/dashboard/${hackathon_id}/team`);
    }
  };

  const onClose = () => {
    router.back();
  };

  return (
<>
  <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Create a Team
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Form a team for your hackathon and invite members. Members will receive an invitation email to join.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Team Name Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter your team name"
                  className="w-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-900 dark:text-white rounded-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Give your team a unique and memorable name.
                </p>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="p-8">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Team Members <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Add team members by email. They will receive an invitation to join your team.
              </p>

              <div className="flex gap-3">
                <Input
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                  placeholder="team.member@example.com"
                  type="email"
                  className="flex-1 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-900 dark:text-white rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!memberInput.trim()}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Member List */}
              {formData.members.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Added Members ({formData.members.length})
                  </p>
                  <div className="space-y-2">
                    {formData.members.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 group hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="text-green-700 dark:text-green-400 font-medium text-sm">
                              {email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {email}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(email)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                          title="Remove member"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={createTeamMutation.isPending}
                className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTeamMutation.isPending}
                className="px-6 py-2.5 cursor-pointer rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createTeamMutation.isPending && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {createTeamMutation.isPending ? "Creating Team..." : "Create Team"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <StatusModal
    isOpen={modal.open}
    onClose={handleModalClose}
    type={modal.type}
    message={modal.message}
    title={modal.title}
  />
</>
  );
}