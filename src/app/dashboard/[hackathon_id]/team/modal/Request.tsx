"use client";

import React from "react";
import { X, User, Mail, Calendar, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface JoinRequest {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  team: {
    id: number;
    name: string;
    hackathon: {
      id: number;
      title: string;
    };
  };
  status: string;
  created_at: string;
}

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: JoinRequest[];
  onApprove: (requestId: number, teamId: number, userId: number) => void;
  onReject: (requestId: number, teamId: number, userId: number) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

function RequestModal({
  isOpen,
  onClose,
  requests,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: RequestModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  // Count only pending requests
  const pendingCount = requests.filter(req => req.status === "pending").length;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Join Requests</h2>
            <p className="text-sm text-indigo-100">
              {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No requests
              </p>
            </div>
          ) : (
            requests.map((request) => {
              const isApproved = request.status === "approved";
              const isRejected = request.status === "rejected";
              const isPending = request.status === "pending";

              return (
                <div
                  key={request.id}
                  className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border-2 transition-all ${
                    isApproved
                      ? "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isRejected
                      ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                  }`}
                >
                  {/* User Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {request.user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {request.user.first_name} {request.user.last_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          @{request.user.username}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge or View Profile Button */}
                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Approved
                        </div>
                      )}
                      {isRejected && (
                        <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          <XCircle className="w-4 h-4" />
                          Rejected
                        </div>
                      )}
                      <button
                        onClick={() => router.push(`/profile/${request.user.id}`)}
                        className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 transition"
                      >
                        View
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      {request.user.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      Requested {new Date(request.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Wants to join
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {request.team.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {request.team.hackathon.title}
                    </p>
                  </div>

                  {/* Action Buttons - Only show for pending requests */}
                  {isPending && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => onApprove(request.id, request.team.id, request.user.id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isApproving ? "Approving..." : "Approve"}
                      </button>
                      <button
                        onClick={() => onReject(request.id, request.team.id, request.user.id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isRejecting ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestModal;