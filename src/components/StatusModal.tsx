"use client"
import React from "react";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
}

export default function StatusModal({ isOpen, onClose, type, message }: StatusModalProps) {
  if (!isOpen) return null; // Don't render if closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 h-full">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[100%] max-w-sm text-center animate-fade-in">
        <h2
          className={`text-xl font-bold mb-4 ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </h2>
        <p className="mb-6 text-gray-700">{message}</p>

        <button
          onClick={onClose}
          className="w-full py-2 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
