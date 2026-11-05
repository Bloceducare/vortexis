"use client";

import { Suspense } from "react";
import GoogleCallbackPageContent from "./GoogleCallbackPageContent";

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-gray-900 transition-colors">
          <div className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-[#605DEC] dark:border-gray-700 dark:border-t-indigo-400 animate-spin mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Connecting to Google...
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Please wait a moment...
          </p>
        </div>
      }
    >
      <GoogleCallbackPageContent />
    </Suspense>
  );
}
