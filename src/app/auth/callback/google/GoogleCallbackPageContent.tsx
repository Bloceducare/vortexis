"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleGoogleCallback } from "@/lib/actions";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

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
          const success = await handleGoogleCallback(code, state ?? "");
          if (success) {
            setStatus("success");
            window.location.href = "/hackathon";
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
  }, [searchParams]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-md w-full mx-auto flex flex-col items-center justify-center">
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-[#605DEC] dark:border-gray-700 dark:border-t-indigo-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#605DEC] dark:bg-indigo-400 animate-ping" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Signing you in...
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-sm leading-relaxed">
              Please wait a moment while we authenticate your Google account and set up your workspace.
            </p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Authentication Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-sm leading-relaxed">
              Redirecting you to the hackathons dashboard...
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-sm mb-6 leading-relaxed">
              {error || "An unknown error occurred during Google sign-in."}
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-2.5 rounded-xl bg-[#605DEC] hover:bg-[#5046d8] text-white font-medium text-sm sm:text-base transition-all shadow-md cursor-pointer"
            >
              Return to Sign In
            </button>

            <details className="mt-8 text-left w-full max-w-md">
              <summary className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer text-center">
                View technical debug details
              </summary>
              <pre className="mt-3 overflow-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg text-xs border border-gray-200 dark:border-gray-700">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </motion.div>
        )}
      </div>
    </div>
  );
}
