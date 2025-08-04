"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/auth", "/forgot-password"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("access_token");

      // If no token and trying to access protected route
      if (!accessToken && !isPublicRoute) {
        router.push("/auth");
        return;
      }

      // If has token and on auth page, redirect to dashboard
      if (accessToken && pathname === "/auth") {
        router.push("/dashboard");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router, isPublicRoute]);

  // Show loading while checking
  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
