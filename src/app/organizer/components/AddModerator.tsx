"use client";

import React, { useState } from "react";
import useOrganizer from "@/hooks/useOrganizers";
import { X, Send } from "lucide-react";
import StatusModal from "@/components/StatusModal";

interface AddModeratorProps {
  onClose: () => void;
  orgName: string;
  orgId: string;
}

function AddModerator({ onClose, orgName, orgId }: AddModeratorProps) {
  const { inviteModeratorsMutation } = useOrganizer();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
    title?: string;
  }>({
    open: false,
    type: "success",
    message: "",
    title: "",
  });

  const handleInvite = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      alert("Please enter an email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await inviteModeratorsMutation.mutateAsync({
        organizationId: orgId,
        email: [trimmedEmail],
        message: message.trim() || "No mesage sent",
      });

      setModal({
        open: true,
        type: "success",
        title: "Invitation Sent Successfully",
        message:
          "You have successfully sent the invitation. They will receive an email notification with the invitation details.",
      });

      setEmail("");
      setMessage("");
    } catch (err: any) {
      setModal({
        open: true,
        type: "error",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-[#171717] text-2xl font-semibold">
            Add Moderator to <b>{orgName}</b>
          </h1>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Email Input Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Moderator Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Message Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message to the invitation..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleInvite}
          disabled={inviteModeratorsMutation.isPending}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {inviteModeratorsMutation.isPending ? "Sending..." : "Send Invite"}
        </button>
      </div>

      <StatusModal
        isOpen={modal.open}
        onClose={onClose}
        type={modal.type}
        message={modal.message}
      />

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default AddModerator;