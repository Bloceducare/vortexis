import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  id: string;
  icon?: string;
}

export default function Input({
  type = "text",
  placeholder = "",
  id,
  icon = "one",
}: InputProps) {
  return (
    <input
      className={`${
        icon !== "one" ? "pr-10" : ""
      } border-secondary shadow-2xl focus:border-secondary mt-1 min-w-[99%] rounded-2xl border-2 py-1 pl-10 outline-none`}
      type={type}
      placeholder={placeholder}
      id={id}
    />
  );
}
