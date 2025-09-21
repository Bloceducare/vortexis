import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import bg from "@/public/assets/bg.svg";

export const metadata: Metadata = {
  title: "sign in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="md:pt-20 py-8 bg-cover flex justify-center items-start bg-center text-white "
      style={{
        background:
          "linear-gradient(135deg, #605DEC  0%, #7C3AED 50%, #6366F1 100%)",
      }}
    >
      <div>{children}</div>
    </div>
  );
}
