"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";
import { Provider } from "./provider";
import RouteGuard from "@/components/routeGuard";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isOrganizerRoute = pathname.includes("/organizer");
  const isJudgesRoute = pathname.includes("/judges");
  const isDashboardRoute = pathname.includes("/dashboard");

  // Initialize dark mode globally
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <html lang="en">
      <Provider>
        <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
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
        </body>
      </Provider>
    </html>
  );
}
