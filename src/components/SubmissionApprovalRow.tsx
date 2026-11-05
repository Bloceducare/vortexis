"use client";

import React, { useState } from "react";
import { approveSubmission, rejectSubmission } from "@/services/hackathonApi";
import { Check, X, Loader2, AlertCircle } from "lucide-react";

interface SubmissionApprovalButtonsProps {
  hackathonId: number | string;
  submissionId: number | string;
  isApproved: boolean;
  onStatusChange: () => void;
  className?: string;
}

export function SubmissionApprovalButtons({
  hackathonId,
  submissionId,
  isApproved,
  onStatusChange,
  className = "",
}: SubmissionApprovalButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await approveSubmission(hackathonId, submissionId);
      onStatusChange();
    } catch (e: any) {
      console.error("Error approving submission:", e);
      setErrorMsg(e?.response?.data?.message || e?.message || "Failed to approve submission");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await rejectSubmission(hackathonId, submissionId, rejectReason.trim() || undefined);
      setShowRejectModal(false);
      setRejectReason("");
      onStatusChange();
    } catch (e: any) {
      console.error("Error rejecting submission:", e);
      setErrorMsg(e?.response?.data?.message || e?.message || "Failed to reject submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {errorMsg && (
        <span className="text-[11px] text-red-500 flex items-center gap-1" title={errorMsg}>
          <AlertCircle className="w-3.5 h-3.5" /> Error
        </span>
      )}

      {!isApproved ? (
        <button
          onClick={handleApprove}
          disabled={loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          <span>Approve</span>
        </button>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-500/20">
          <Check className="w-3.5 h-3.5" /> Approved
        </span>
      )}

      <button
        onClick={() => setShowRejectModal(true)}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-300/60 dark:border-rose-800/50 rounded-lg font-medium transition cursor-pointer disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        <span>Reject</span>
      </button>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Reject Submission
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Provide an optional reason for rejecting this project submission.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Missing live deployment link or GitHub repo is private."
              rows={3}
              className="w-full p-3 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-rose-500 dark:focus:border-rose-400 mb-4 resize-none"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SubmissionApprovalButtons;

