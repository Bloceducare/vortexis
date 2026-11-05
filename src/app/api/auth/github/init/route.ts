import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
  try {
    const clientId = process.env.GITHUB_ID;

    if (!clientId) {
      return NextResponse.json(
        { error: "GitHub client ID not configured" },
        { status: 500 }
      );
    }

    const scope = encodeURIComponent("read:user user:email");
    const appUrl = "https://vortexis.web3bridgegarage.com";
    const redirectUri = encodeURIComponent(`${appUrl}/auth/callback`);

    // Generate secure random state
    const state = crypto.randomBytes(32).toString("hex");
    
    // Store state in secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("githubOAuthState", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    return NextResponse.json({ authUrl: githubAuthUrl, state });
  } catch (error) {
    console.error("GitHub OAuth init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize GitHub OAuth" },
      { status: 500 }
    );
  }
}

