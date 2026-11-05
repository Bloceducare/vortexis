"use client";

import React from "react";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
  title?: string;
}

export default function StatusModal({ isOpen, onClose, type, message, title }: StatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-sm text-center transition-colors">
        <h2
          className={`text-xl font-bold mb-3 ${
            type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {type === "success" 
            ? (title || "Registered 🎉") 
            : (title || "Oops 😢")}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{message}</p>

        <button
          onClick={onClose}
          className="w-full sm:w-auto min-w-[120px] py-2.5 px-6 rounded-xl bg-[#605DEC] hover:bg-[#5046d8] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
