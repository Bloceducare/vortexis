import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public routes that don't need authentication
  const publicRoutes = [
    "/",
    "/guide",
    "/hackathon",
    "/auth",
    "/forgot-password",
    "/reset-password",
    "/hackathons",
    "/features",
    "/about",
    "/faqs",
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if user is authenticated via cookie
  const isAuthenticated = request.cookies.has("access_token") || request.cookies.has("refresh_token");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to protected routes if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
