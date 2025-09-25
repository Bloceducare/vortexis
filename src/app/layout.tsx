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
        <body className="flex flex-col min-h-screen">
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

