"use client";

import React, { useState } from "react";
import useOrganizer from "@/hooks/useOrganizers";
import { X, Plus, Send } from "lucide-react";
import StatusModal from "@/components/StatusModal";

interface AddModeratorProps {
  onClose: () => void;
  orgName: string;
  orgId: string;
}

function AddModerator({ onClose, orgName, orgId }: AddModeratorProps) {
  const { inviteModeratorsMutation } = useOrganizer();
  const [emails, setEmails] = useState<string[]>([]);
  const [input, setInput] = useState("");
   const [modal, setModal] = useState<{open: boolean; type: "success"|"error"; message: string; title?: string}>({
        open: false, type: "success", message: "", title: ""
      });

  const handleAddEmail = () => {
    const trimmedEmail = input.trim();
  
 
    if (emails.includes(trimmedEmail)) {
      alert("This email is already added.");
      return;
    }
  
    if (emails.length >= 4) {
      alert("You can only add up to 4 emails.");
      return;
    }
  
    setEmails([...emails, trimmedEmail]);
    setInput("");
  };
  

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleInvite = async () => {
    if (emails.length === 0) {
      alert("Please add at least one email before sending invites.");
      return;
    }
  
    try {
      await inviteModeratorsMutation.mutateAsync({
        organizationId: orgId,
        moderators: emails,
      });
  
      setModal({
        open: true,
        type: "success",
        title: "Invitation Sent Successfully",
        message:
          "You have successfully sent the invitation. They will receive an email notification with the invitation details.",
      });
  
      setEmails([]);
    } catch (err: any) {
      setModal({
        open: true,
        type: "error",
        message:
          err?.message || "Something went wrong. Please try again.",
      });
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-[#171717] text-2xl font-semibold">
            Add Moderators to <b>{orgName}</b>
          </h1>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Enter Moderator Emails (max 4)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
              placeholder="Enter email and press Enter or +"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAddEmail}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Email List */}
        {emails.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {emails.map((email, idx) => (
              <div
                key={idx}
                className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {email}
                <X
                  size={14}
                  onClick={() => handleRemoveEmail(email)}
                  className="ml-2 text-gray-500 cursor-pointer hover:text-red-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleInvite}
          disabled={inviteModeratorsMutation.isPending}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Send size={18} />
          {inviteModeratorsMutation.isPending ? "Sending..." : "Send Invites"}
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
