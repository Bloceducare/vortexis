import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_ID;
    
    if (!clientId) {
      return NextResponse.json(
        { error: "Google client ID not configured" },
        { status: 500 }
      );
    }

    const redirectUri = process.env.REDIRECT_URI;
    if (!redirectUri) {
      return NextResponse.json(
        { error: "Google redirect URI not configured" },
        { status: 500 }
      );
    }

    // Generate secure random state
    const state = crypto.randomBytes(32).toString("hex");
    
    // Store state in secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("googleOAuthState", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    const scope = encodeURIComponent("email profile");
    const responseType = "code";
    const accessType = "offline";
    const prompt = "consent";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}&access_type=${accessType}&prompt=${prompt}&state=${state}`;

    return NextResponse.json({ authUrl: googleAuthUrl, state });
  } catch (error) {
    console.error("Google OAuth init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize Google OAuth" },
      { status: 500 }
    );
  }
}

