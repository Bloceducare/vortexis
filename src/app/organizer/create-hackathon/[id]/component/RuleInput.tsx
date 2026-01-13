"use client";

import React from "react";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/components/ui/TipTapEditor"), {
  ssr: false,
});

interface RuleInputProps {
  rule: string;
  setRule: (rule: string) => void;
}

export default function RuleInput({ rule, setRule }: RuleInputProps) {
  return (
    <div>
      <TiptapEditor
        value={rule}
        onChange={setRule} // ✅ single source of truth
        placeholder="Enter rules & guidelines..."
      />

    
    </div>
  );
}
