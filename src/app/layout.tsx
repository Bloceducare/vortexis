"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import  {Footer}  from "@/components/Footer";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";

// export const metadata: Metadata = {
//   title: "VORTEXIS",
//   description: "Vortexis by Web3bridge",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isOrganizerRoute = pathname.includes("/organizer");
  const isJudgesRoute = pathname.includes("/judges");

  return (
    <html lang="en">
      <body>
        {!isJudgesRoute && !isOrganizerRoute && <Header />}

        {children}
        <ToastContainer/>
        {!isOrganizerRoute && !isJudgesRoute && <Footer />}
      </body>
    </html>
  );
}
