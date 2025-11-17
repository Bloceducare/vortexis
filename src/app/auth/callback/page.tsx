"use client";

import { useEffect, useState } from "react";
import { handleGithubCallback } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleGithubCallback();

        // If we get here, authentication was successful
        router.push("/");
      } catch (err) {
        console.error("Callback error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    processCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Authentication Error
          </h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/auth")}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Processing sign in...</h1>
        <p className="mt-2 text-gray-600">
          Please wait while we complete the authentication process.
        </p>
      </div>
    </div>
  );
}
