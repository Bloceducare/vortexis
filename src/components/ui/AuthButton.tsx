import "@/app/auth/globals.css";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: string;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  type = "primary",
  className = "",
  onClick = () => {},
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        type === "primary"
          ? "bg-btn-primary text-white"
          : "text-btn-primary bg-white"
      } ${className} min-w-full cursor-pointer rounded-2xl px-4 py-2 font-bold`}
      type="button"
    >
      {children}
    </button>
  );
}
