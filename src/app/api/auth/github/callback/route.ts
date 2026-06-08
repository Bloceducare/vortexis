import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      return NextResponse.json(
        { error: `GitHub OAuth error: ${error}` },
        { status: 400 }
      );
    }

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vortexis-dev.vercel.app";
    const redirectUri = `${appUrl}/auth/callback`;

    // Send raw auth code + redirect_uri to backend — backend does the GitHub token exchange
    const res = await fetch(`${baseUrl}/auth/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("[GitHub Callback] Backend error:", res.status, errorData);
      return NextResponse.json(
        { error: errorData.detail || errorData.message || errorData.error || "Failed to authenticate with backend" },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("[GitHub Callback] Raw backend response:", JSON.stringify(data, null, 2));

    // Handle all possible token response structures from backend
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    if (typeof data.access_token === "string") {
      accessToken = data.access_token;
      refreshToken = data.refresh_token;
    } else if (data.access_token?.access_token) {
      accessToken = data.access_token.access_token;
      refreshToken = data.access_token.refresh_token;
    } else if (data.tokens?.access) {
      accessToken = data.tokens.access;
      refreshToken = data.tokens.refresh;
    } else if (data.token) {
      accessToken = data.token;
      refreshToken = data.refresh_token;
    }

    if (!accessToken || !refreshToken) {
      console.error("[GitHub Callback] Could not extract tokens. Response was:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const threeDaysInSeconds = 3 * 24 * 60 * 60;

    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: threeDaysInSeconds,
      path: "/",
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: threeDaysInSeconds,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("[GitHub Callback] Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
