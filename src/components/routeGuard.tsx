"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname, redirect } from "next/navigation";
import AuthErrorPage from "./authError";
import { useAuthStore } from "@/store/useAuthStore";

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page. Judge role required.
          </p>
          <button
            // onClick={() => window.history.back()}
            onClick={() => {
              localStorage.clear();
              router.push("/auth/login");
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore.getState().getToken();

  // Public routes that don't need authentication
  const publicRoutes = [ "/", "/guide", "/hackathon", "/auth", "/forgot-password", "/reset-password","/hackathons", "/features", "/about", "/faqs"];

  // Role-protected routes
  const judgeProtectedRoutes = ["/judges"];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isJudgeProtectedRoute = judgeProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Function to check if user has judge role
  const checkJudgeRole = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hackathon/judge/hackathons`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If 403, user doesn't have judge role
      if (response.status === 403) {
        setShowUnauthorized(true);
        return false;
      }

      // if token has expired
      if (response.status === 401) {
        localStorage.clear();
        router.push("/auth/login");
        window.location.reload();

        return false;
      }

      return response.ok;
    } catch (error) {
      console.error("Error checking judge role:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // If no token and trying to access protected route
      if (!token && !isPublicRoute) {
        setShowError(true);
        setIsLoading(false);
        return;
      }

      // If has token and on auth page, redirect to dashboard
      if (token && pathname === "/auth") {
        router.push("/dashboard");
        return;
      }

      // Check role-based access for judge-protected routes
      if (token && isJudgeProtectedRoute) {
        const hasJudgeRole = await checkJudgeRole(token);

        if (!hasJudgeRole) {
          setShowUnauthorized(true);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
      setShowError(false);
      setShowUnauthorized(false);
    };

    checkAuth();
  }, [pathname, router, isPublicRoute, isJudgeProtectedRoute, token]);

  // Show loading while checking auth for protected routes
  if (isLoading && (!isPublicRoute || isJudgeProtectedRoute)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">
            {isJudgeProtectedRoute ? "Checking permissions..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (showError) {
    return <AuthErrorPage />;
  }

  if (showUnauthorized) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
