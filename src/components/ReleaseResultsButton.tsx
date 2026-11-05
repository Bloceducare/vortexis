import React, { useState } from "react";
import { toggleHackathonResults } from "@/services/hackathonApi";

export interface ReleaseResultsButtonProps {
  hackathonId: number | string;
  isReleased: boolean;
  canRelease: boolean;
  onUpdate: () => void;
  className?: string;
}

export function ReleaseResultsButton({
  hackathonId,
  isReleased,
  canRelease,
  onUpdate,
  className = "",
}: ReleaseResultsButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!canRelease) return null; // Don't show to regular participants

  const handleToggle = async () => {
    const confirmMessage = isReleased
      ? "Are you sure you want to hide results from participants?"
      : "Are you sure you want to release results to all participants and publish the leaderboard?";

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    try {
      await toggleHackathonResults(hackathonId, !isReleased);
      onUpdate();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to update results status";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 text-sm font-semibold rounded-lg transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 inline-flex items-center justify-center gap-2 ${
        isReleased
          ? "bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 hover:bg-amber-600/30 dark:hover:bg-amber-600/40"
          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
      } ${className}`}
    >
      {loading
        ? "Processing..."
        : isReleased
        ? "🔒 Retract / Hide Results"
        : "🚀 Release Results to Public"}
    </button>
  );
}

export default ReleaseResultsButton;
