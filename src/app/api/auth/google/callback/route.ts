import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return NextResponse.json(
        { error: `Google OAuth error: ${error}` },
        { status: 400 }
      );
    }

    // Verify state from cookie
    const cookieStore = await cookies();
    const savedState = cookieStore.get("googleOAuthState")?.value;

    if (!state || !savedState || state !== savedState) {
      return NextResponse.json(
        { error: "Invalid state parameter" },
        { status: 400 }
      );
    }

    // Remove state cookie
    cookieStore.delete("googleOAuthState");

    if (!code) {
      return NextResponse.json(
        { error: "No authorization code received" },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_ID;
    
    const clientSecret = process.env.GOOGLE_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: "Google OAuth not properly configured" },
        { status: 500 }
      );
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("Token exchange error:", errorData);
      return NextResponse.json(
        { error: "Failed to exchange authorization code for tokens" },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    const idToken = tokenData.id_token;
    if (!idToken) {
      return NextResponse.json(
        { error: "ID token not found in token exchange response" },
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

    // Send ID token to backend
    const res = await fetch(`${baseUrl}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: idToken }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Backend error:", errorData);
      return NextResponse.json(
        { error: errorData.detail || "Failed to authenticate with backend" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data.access_token || !data.refresh_token) {
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 400 }
      );
    }

    // Set secure HTTP-only cookies for tokens
    const threeDaysInSeconds = 3 * 24 * 60 * 60;
    
    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: threeDaysInSeconds,
      path: "/",
    });

    cookieStore.set("refresh_token", data.refresh_token, {
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
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

