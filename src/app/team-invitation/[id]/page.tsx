"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useTeams from "@/hooks/useTeams";

export default function TeamInvitationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { acceptInvitation } = useTeams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAcceptInvite = async () => {
    try {
      setErrorMessage(null);
      await acceptInvitation.mutateAsync(id as string);
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "Unable to accept invitation");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🎉 You’ve been invited!
          </h1>
          <p className="text-gray-600">
            Click the button below to accept your team invitation.
          </p>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <button
          onClick={handleAcceptInvite}
          disabled={acceptInvitation.isPending}
          className={`w-full py-3 rounded-lg text-white font-medium transition ${
            acceptInvitation.isPending
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {acceptInvitation.isPending ? "Accepting Invite..." : "Accept Invitation"}
        </button>

        {/* Optional cancel or back button */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
