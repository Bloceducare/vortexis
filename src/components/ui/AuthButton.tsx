import "@/app/auth/globals.css";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  disabled = false,
  children,
  type = "primary",
  className = "",
  onClick = () => {},
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${
        type === "primary"
          ? "bg-primary border-primary text-white"
          : "text-primary bg-white"
      } ${className} border-2 min-w-full cursor-pointer rounded-xl px-4 py-2 font-bold`}
      type="button"
    >
      {children}
    </button>
  );
}
