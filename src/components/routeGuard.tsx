"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AuthErrorPage from "./authError";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
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
        setShowError(true);
        setIsLoading(false);
        return;
      }

      // If has token and on auth page, redirect to dashboard
      if (accessToken && pathname === "/auth") {
        router.push("/dashboard");
        return;
      }

      setIsLoading(false);
      setShowError(false);
    };

    checkAuth();
  }, [pathname, router, isPublicRoute]);

  // Show loading while checking auth for protected routes
  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showError) {
    return <AuthErrorPage />;
  }

  return <>{children}</>;
}
