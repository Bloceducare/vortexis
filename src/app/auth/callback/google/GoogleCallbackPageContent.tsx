"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleGoogleCallback } from "@/lib/actions";

interface DebugInfo {
  hasCode: boolean;
  hasState: boolean;
  error: string;
  fullUrl: string;
  search: string;
}

export default function GoogleCallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    hasCode: false,
    hasState: false,
    error: "none",
    fullUrl: "",
    search: "",
  });

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    setDebugInfo({
      hasCode: Boolean(code),
      hasState: Boolean(state),
      error: errorParam || "none",
      fullUrl: window.location.href,
      search: window.location.search,
    });

    if (!code && !errorParam) {
      setStatus("error");
      setError(
        "No authorization code found. This page should only be accessed as part of the Google sign-in flow."
      );
      return;
    }

    async function processCallback() {
      try {
        if (code) {
          const success = await handleGoogleCallback();
          if (success) {
            setStatus("success");
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }
        } else if (errorParam) {
          setStatus("error");
          setError(`Google authentication error: ${errorParam}`);
        }
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    }

    processCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg p-8 shadow-md">
        {/* <h1 className="mb-4 text-2xl font-bold">Google Authentication</h1> */}

        {status === "loading" && (
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
            <p>Processing your login...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center text-green-600">
            <p className="mb-2 text-lg font-semibold">
              Authentication successful!
            </p>
            <p>Redirecting you to the dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center text-red-600">
            <p className="mb-2 text-lg font-semibold">Authentication failed</p>
            <p>{error}</p>
            <button
              onClick={() => router.push("/auth/signin/participant")}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Return to login
            </button>
          </div>
        )}

        {/* {status === "error" && (
          <div className="mt-6 border-t pt-4 text-xs text-gray-500">
            <p className="font-semibold">Debug Information:</p>
            <pre className="mt-2 overflow-auto bg-gray-100 p-2">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )} */}
      </div>
    </div>
  );
}
