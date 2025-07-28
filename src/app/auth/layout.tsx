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
      className="py-8 bg-cover flex justify-center items-start bg-center text-white "
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div>{children}</div>
    </div>
  );
}
