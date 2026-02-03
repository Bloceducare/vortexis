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
      <div className="bg-white dark:bg-gray-900 h-screen rounded-xl z-50 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800 w-full max-w-2xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-8 overflow-y-auto">
          <h2 className="font-semibold mb-6 text-2xl text-gray-900 dark:text-white text-center">
            Create a Team
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Team Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Team Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter team name"
                className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Members */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Members (Optional)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                Add team members by email. They will receive an invitation.
              </p>
              <div className="flex gap-2 mt-2">
                <Input
                  name="members"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                  placeholder="Enter member email"
                  className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!memberInput.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Add
                </button>
              </div>

              {/* Member chips */}
              {formData.members.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.members.map((email) => (
                    <span
                      key={email}
                      className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm border border-green-200 dark:border-green-700"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(email)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={createTeamMutation.isPending}
                className="px-5 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTeamMutation.isPending}
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {createTeamMutation.isPending && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {createTeamMutation.isPending ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
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