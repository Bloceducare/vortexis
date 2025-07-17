"use client"
import { LucideIcon } from "lucide-react";


interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export function QuickActionButton({ icon: Icon, label, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={label}
      className="w-full flex border-blue-400 justify-start gap-3 h-auto py-3 px-4 text-blue-600 border hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}