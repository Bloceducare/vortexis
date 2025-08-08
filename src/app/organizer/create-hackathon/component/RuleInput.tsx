"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import TipTap (no SSR)
const TiptapEditor = dynamic(() => import("@/components/ui/TipTapEditor"), {
  ssr: false,
});

interface RuleInputProps {
  rules: string[];
  setRules: (rules: string[]) => void;
}

export default function RuleInput({ rules, setRules }: RuleInputProps) {
  const [editorValue, setEditorValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = editorValue.trim();
      if (trimmed) {
        setRules([trimmed]); 
        setEditorValue("");
      }
    }
  };

  const removeRule = () => {
    setRules([]);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {rules.length > 0 && (
          <div className="bg-blue-500 text-white rounded-xl p-3 flex items-center gap-3">
            <span
              dangerouslySetInnerHTML={{ __html: rules[0] }}
              className="text-white"
            />
            <button
              type="button"
              onClick={removeRule}
              className="hover:text-gray-300 text-xl"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {/* TipTap Input */}
      <div onKeyDown={handleKeyDown}>
        <TiptapEditor value={editorValue} onChange={setEditorValue} />
        <p className="text-sm text-gray-500 mt-2">
          Press <kbd>Enter</kbd> to add rule. Use <kbd>Shift + Enter</kbd> for line break.
        </p>
      </div>
    </div>
  );
}
