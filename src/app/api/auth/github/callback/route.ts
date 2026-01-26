import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "No authorization code received" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "Base URL not configured" },
        { status: 500 }
      );
    }

    // Exchange code with backend
    const res = await fetch(`${baseUrl}/auth/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Backend error:", errorData);
      return NextResponse.json(
        { error: "Failed to authenticate with backend" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data.access_token?.access_token || !data.access_token?.refresh_token) {
      console.error("Tokens not found in response:", data);
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 400 }
      );
    }

    // Set secure HTTP-only cookies for tokens
    const cookieStore = await cookies();
    const threeDaysInSeconds = 3 * 24 * 60 * 60;
    
    cookieStore.set("access_token", data.access_token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: threeDaysInSeconds,
      path: "/",
    });

    cookieStore.set("refresh_token", data.access_token.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: threeDaysInSeconds,
      path: "/",
    });

    // Return token in response for client-side storage (backward compatibility)
    // The token is also stored in HTTP-only cookies for security
    return NextResponse.json({
      success: true,
      access_token: data.access_token.access_token,
      refresh_token: data.access_token.refresh_token,
    });
  } catch (error) {
    console.error("GitHub callback error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

