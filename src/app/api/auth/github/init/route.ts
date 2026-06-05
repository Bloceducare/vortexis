import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vortexis.web3bridgegarage.com";
    const redirectUri = encodeURIComponent(`${appUrl}/auth/callback`);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    return NextResponse.json({ authUrl: githubAuthUrl });
  } catch (error) {
    console.error("GitHub OAuth init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize GitHub OAuth" },
      { status: 500 }
    );
  }
}

