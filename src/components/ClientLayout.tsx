"use client";

import type React from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import RouteGuard from "@/components/routeGuard";
import { useThemeStore } from "@/store/useThemeStore";
import SessionHandler from "@/components/SessionExpired";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  );
}
