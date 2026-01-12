import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = localStorage.getItem("oauth_state"); // Note: localStorage is client-side; use a server-side alternative like cookies or a DB

  if (!code || !state || state !== storedState) {
    return NextResponse.json(
      { error: "Invalid state or code" },
      { status: 400 }
    );
  }

  try {
    // Exchange code for tokens with your backend
    const response = await fetch("http://spicy-cheri-web3bridge-bc3db9dc.koyeb.app/api/v1/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with backend");
    }

    const data = await response.json();

    if (!data.access_token || !data.refresh_token) {
      return NextResponse.json(
        { error: "Tokens not found in response" },
        { status: 400 }
      );
    }

    // Store tokens (consider using cookies for security instead of localStorage)
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("access_token", data.access_token);
    redirectUrl.searchParams.set("refresh_token", data.refresh_token);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
