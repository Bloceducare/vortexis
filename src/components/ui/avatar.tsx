import React from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = "md" }) => {
  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className={`flex items-center justify-center rounded-full border border-gray-200 shadow-sm overflow-hidden bg-gray-100 text-gray-700 font-semibold ${sizes[size]} hover:shadow-md transition-shadow duration-200`}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;
