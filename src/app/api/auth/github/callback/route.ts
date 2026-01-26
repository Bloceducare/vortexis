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

    const clientId = process.env.GITHUB_ID;
    const clientSecret = process.env.GITHUB_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "GitHub OAuth not properly configured" },
        { status: 500 }
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Base URL not configured" },
        { status: 500 }
      );
    }

    // Exchange authorization code for access token with GitHub
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${baseUrl}/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("GitHub token exchange error:", errorData);
      return NextResponse.json(
        { error: "Failed to exchange authorization code for tokens" },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Access token not found in GitHub response" },
        { status: 400 }
      );
    }

    // Send access token to backend for user authentication
    const res = await fetch(`${baseUrl}/auth/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: tokenData.access_token }),
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

