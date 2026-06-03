"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";
import { Provider } from "./provider";
import RouteGuard from "@/components/routeGuard";
import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import SessionHandler from "@/components/SessionExpired";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isOrganizerRoute = pathname.includes("/organizer");
  const isJudgesRoute = pathname.includes("/judges");
  const isDashboardRoute = pathname.includes("/dashboard");

  const { initTheme } = useThemeStore();

  // Initialize dark mode globally
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <html lang="en">
      <Provider>
        <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <SessionHandler>
            <RouteGuard>
            {!isJudgesRoute && !isDashboardRoute && !isOrganizerRoute && (
              <Header />
            )}

            {/* Main content grows to fill available space */}
            <main className="flex-1">{children}</main>

            {!isOrganizerRoute && !isDashboardRoute && !isJudgesRoute && (
              <Footer />
            )}
            </RouteGuard>
          </SessionHandler>
        </body>
      </Provider>
    </html>
  );
}
