"use client"

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AuthProvider from "@/components/ui/AuthProvider";
import { usePathname } from "next/navigation";

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

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {!isOrganizerRoute && <Header />}
        </AuthProvider>

        {children}
        {!isOrganizerRoute && <Footer />}
      </body>
    </html>
  );
}

