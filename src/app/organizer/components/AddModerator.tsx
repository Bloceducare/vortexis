"use client";

import React, { useState } from "react";
import useOrganizer from "@/hooks/useOrganizers";
import {
  X,
  Send,
  UserPlus,
  Users,
  Clock,
  Trash2,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import StatusModal from "@/components/StatusModal";

interface AddModeratorProps {
  onClose: () => void;
  orgName: string;
  orgId: string;
  existingModerators?: any[];
}

function AddModerator({
  onClose,
  orgName,
  orgId,
  existingModerators = [],
}: AddModeratorProps) {
  const {
    inviteModeratorsMutation,
    removeModeratorMutation,
    getSentInvitations,
    getOrganizationById,
  } = useOrganizer();

  const [activeTab, setActiveTab] = useState<"invite" | "sent" | "active">("invite");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [removingUser, setRemovingUser] = useState<string | null>(null);

  const {
    data: sentInvites,
    isLoading: loadingSent,
    refetch: refetchSent,
  } = getSentInvitations(orgId);

  const { data: currentOrg, refetch: refetchOrg } = getOrganizationById(orgId);

  // Active moderators list: prefer freshly fetched data, fallback to prop
  const activeModerators: any[] = currentOrg?.moderators ?? existingModerators ?? [];

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await inviteModeratorsMutation.mutateAsync({
        organizationId: orgId,
        email: trimmedEmail,
        message: message.trim() || "You are invited to join as an organization moderator.",
      });

      setEmail("");
      setMessage("");
      refetchSent();

      setModal({
        open: true,
        type: "success",
        title: "Invitation Sent",
        message: `An invitation has been sent to ${trimmedEmail}. They can accept the invite by clicking the link sent to their email.`,
      });
    } catch (err: any) {
      setModal({
        open: true,
        type: "error",
        title: "Failed to Send Invite",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleRemoveModerator = async (username: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${username}" from the moderators of ${orgName}?`
    );
    if (!confirmed) return;

    setRemovingUser(username);
    try {
      await removeModeratorMutation.mutateAsync({
        organizationId: orgId,
        username,
      });
      refetchOrg();
      refetchSent();
      setModal({
        open: true,
        type: "success",
        title: "Moderator Removed",
        message: `Successfully removed ${username} as moderator.`,
      });
    } catch (err: any) {
      setModal({
        open: true,
        type: "error",
        title: "Removal Failed",
        message: err?.message || "Failed to remove moderator.",
      });
    } finally {
      setRemovingUser(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="w-3 h-3" /> Accepted
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300">
            <X className="w-3 h-3" /> Declined
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <Clock className="w-3 h-3" /> Expired
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Manage Moderators
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Organization: <span className="font-semibold text-gray-700 dark:text-gray-300">{orgName}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 px-6 pt-2 bg-white dark:bg-gray-900">
          <button
            onClick={() => setActiveTab("invite")}
            className={`pb-3 px-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "invite"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <UserPlus size={16} /> Invite Moderator
          </button>

          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 px-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "active"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Users size={16} /> Active Moderators ({activeModerators.length})
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`pb-3 px-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "sent"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Mail size={16} /> Sent Invites ({sentInvites?.length ?? 0})
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: INVITE MODERATOR */}
          {activeTab === "invite" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  Invite anyone by email to help moderate your organization's hackathons. The invitee
                  does not need an account beforehand; they will receive a link to join.
                </p>
              </div>

              <div>
                <label className="block text-gray-900 dark:text-gray-100 text-sm font-semibold mb-1.5">
                  Moderator Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. colleague@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 dark:text-gray-100 text-sm font-semibold mb-1.5">
                  Invitation Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal note or instructions for the invitee..."
                  rows={4}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors resize-none text-sm"
                />
              </div>

              <button
                onClick={handleInvite}
                disabled={inviteModeratorsMutation.isPending || !email.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {inviteModeratorsMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Invitation...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Moderator Invite
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: ACTIVE MODERATORS */}
          {activeTab === "active" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Moderators have permission to manage hackathons, submissions, and judge invitations.
                </p>
                <button
                  onClick={() => refetchOrg()}
                  title="Refresh moderators"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {activeModerators.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="font-semibold text-sm">No Active Moderators Yet</p>
                  <p className="text-xs mt-1">
                    Invite your team members to help moderate hackathons.
                  </p>
                  <button
                    onClick={() => setActiveTab("invite")}
                    className="mt-3 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer"
                  >
                    Invite Moderator
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                  {activeModerators.map((mod: any, index: number) => {
                    const username =
                      typeof mod === "string"
                        ? mod
                        : mod?.username || mod?.email || `Moderator ${index + 1}`;
                    const name =
                      typeof mod === "object" && (mod.first_name || mod.last_name)
                        ? `${mod.first_name || ""} ${mod.last_name || ""}`.trim()
                        : "";
                    const emailAddress = typeof mod === "object" ? mod.email : null;

                    return (
                      <div
                        key={index}
                        className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                            {username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {username}
                              </p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                                Moderator
                              </span>
                            </div>
                            {(name || emailAddress) && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {name ? `${name} • ` : ""}
                                {emailAddress}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveModerator(username)}
                          disabled={removingUser === username}
                          className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                        >
                          {removingUser === username ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SENT INVITATIONS */}
          {activeTab === "sent" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Track the status of invitations sent to moderators.
                </p>
                <button
                  onClick={() => refetchSent()}
                  title="Refresh sent invites"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer"
                >
                  <RefreshCw size={14} className={loadingSent ? "animate-spin" : ""} />
                </button>
              </div>

              {loadingSent ? (
                <div className="p-8 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading sent invitations...
                </div>
              ) : !sentInvites || sentInvites.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                  <Mail className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="font-semibold text-sm">No Sent Invitations Found</p>
                  <p className="text-xs mt-1">
                    Send an invite to have pending invitations appear here.
                  </p>
                  <button
                    onClick={() => setActiveTab("invite")}
                    className="mt-3 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer"
                  >
                    Send First Invite
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                  {sentInvites.map((inv: any, index: number) => (
                    <div
                      key={inv.id || index}
                      className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {inv.email}
                          </p>
                          {getStatusBadge(inv.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          {inv.created_at && (
                            <span>
                              Sent: {new Date(inv.created_at).toLocaleDateString()}
                            </span>
                          )}
                          {inv.expires_at && (
                            <span>
                              Expires: {new Date(inv.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <StatusModal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}

export default AddModerator;
