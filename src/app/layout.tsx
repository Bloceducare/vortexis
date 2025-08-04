"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";
import { Provider } from "./provider";
import RouteGuard from "@/components/routeGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isOrganizerRoute = pathname.includes("/organizer");
  const isJudgesRoute = pathname.includes("/judges");
  const isDashboardRoute = pathname.includes("/dashboard");

  return (
    <html lang="en">
      <Provider>
        <body>
          <RouteGuard>
            {!isJudgesRoute && !isDashboardRoute && !isOrganizerRoute && (
              <Header />
            )}

            {children}
            {!isOrganizerRoute && !isDashboardRoute && !isJudgesRoute && (
              <Footer />
            )}
          </RouteGuard>
        </body>
      </Provider>
    </html>
  );
}
