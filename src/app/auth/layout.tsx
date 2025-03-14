import Image from "next/image";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import OTP from "@/public/assets/amico.jpg"; 



export const metadata: Metadata = {
  title: "sign in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="flex md:h-[95vh] flex-wrap content-center items-center justify-center py-5">
          <div className="relative flex-wrap justify-between md:flex">
            <Image
              src={OTP}
              className="object-contain p-6 md:p-16"
              alt="Logo"
            />
            <div className="relative sm:min-w-full md:min-w-[30rem]">
              {children}
            </div>
          </div>
        </div>
  );
}
