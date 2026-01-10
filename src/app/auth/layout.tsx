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
      className="md:pt-20 py-8 bg-cover flex justify-center items-start bg-center text-white min-h-screen
      bg-[linear-gradient(135deg,#605DEC_0%,#7C3AED_50%,#6366F1_100%)]
      dark:bg-[linear-gradient(135deg,#111827_0%,#1e1b4b_50%,#312e81_100%)]"
    >
      <div>{children}</div>
    </div>
  );
}
