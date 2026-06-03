"use client";

import { useEffect, useState } from "react";
import { handleGithubCallback } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function processCallback() {
      try {
        await handleGithubCallback();
        setStatus("success");
        // localStorage and the header / profile page reflect the logged-in user.
        window.location.href = "/hackathon";
      } catch (err) {
        console.error("Callback error:", err);
        setStatus("error");
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    processCallback();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg p-8 shadow-md">
        {status === "loading" && (
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
            <p>Processing your login...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center text-green-600">
            <p className="mb-2 text-lg font-semibold">Authentication successful!</p>
            <p>Redirecting you to the dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center text-red-600">
            <p className="mb-2 text-lg font-semibold">Authentication failed</p>
            <p>{error}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Return to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
