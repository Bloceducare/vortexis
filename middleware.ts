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

  // Allow all requests through so RouteGuard and not-found can handle authentication and missing routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
