"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function JudgeInvitationPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    setToken(tokenParam);
  }, [searchParams]);

  const handleAcceptInvitation = async () => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid invitation token");
      return;
    }

    setIsLoading(true);
    setStatus("idle");

    const bearerToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hackathon/accept-judge-invitation/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        setStatus("success");
      } else {
        const errorData = await response.json();
        // Backend may return errors in different shapes:
        // { error: "msg" } | { detail: "msg" } | { token: ["msg"] } | { fieldName: ["msg"] }
        const message =
          errorData.error ||
          errorData.detail ||
          (Array.isArray(errorData.token)
            ? errorData.token[0]
            : undefined) ||
          Object.values(errorData)
            .flat()
            .filter((v) => typeof v === "string")[0] ||
          "An error occurred. Please try again.";
        setStatus("error");
        setErrorMessage(message as string);
      }
    } catch (error) {
      setStatus("error");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Invitation
            </h1>
            <p className="text-gray-600">
              The invitation link is invalid or has expired. Please check your
              email for the correct link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome Aboard!
            </h1>
            <p className="text-gray-600 mb-8">
              You're now officially a judge for this hackathon. Ready to
              discover amazing innovations?
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md"
            >
              Enter Judge Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">⚖️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Judge Invitation
          </h1>
          <p className="text-blue-100">
            You've been selected as a hackathon judge
          </p>
        </div>

        <div className="p-8">
          {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Ready to Judge?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accepting this invitation, you'll gain access to the judging
              dashboard where you can review and evaluate participant
              submissions.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAcceptInvitation}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Accepting Invitation...
                </span>
              ) : (
                "Accept Invitation"
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              New to our platform? Don't worry - we'll help you set up your
              account after accepting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
