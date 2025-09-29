"use client";
import { useAuthStore } from "@/store/useAuthStore";

const threeDaysInSeconds = 3 * 24 * 60 * 60;

export async function signInGithubAction() {
  try {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_ID;
    const scope = encodeURIComponent("read:user user:email");

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:3000/auth/callback&scope=${scope}`;
    window.location.href = githubAuthUrl;
  } catch (error) {
    console.error("GitHub sign in error:", error);
  }
}

export async function handleGithubCallback() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) throw new Error("No authorization code received");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Backend error:", errorData);
      throw new Error("Failed to authenticate with backend");
    }

    const data = await res.json();

    if (!data.access_token?.access_token || !data.access_token?.refresh_token) {
      console.error("Tokens not found in response:", data);
      throw new Error("Invalid response from backend");
    }

    const setToken = useAuthStore.getState().setToken;
    setToken(data.access_token.access_token, threeDaysInSeconds);

    return true;
  } catch (error) {
    console.error("GitHub callback error:", error);
    throw error;
  }
}

export async function signInGoogleAction() {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_ID;
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );
    const scope = encodeURIComponent("email profile");
    const responseType = "code";
    const accessType = "offline";
    const prompt = "consent";
    const state = generateRandomState();

    localStorage.setItem("googleOAuthState", state);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=${accessType}&prompt=${prompt}&state=${state}`;

    window.location.href = googleAuthUrl;
  } catch (error) {
    console.error("Google sign in error:", error);
  }
}

export async function handleGoogleCallback() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (error) throw new Error(`Google OAuth error: ${error}`);

    const savedState = localStorage.getItem("googleOAuthState");
    if (!state || state !== savedState) {
      throw new Error("Invalid state parameter");
    }

    localStorage.removeItem("googleOAuthState");

    if (!code) throw new Error("No authorization code received");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange error:", errorData);
      throw new Error("Failed to exchange authorization code for tokens");
    }

    const tokenData = await tokenResponse.json();

    const idToken = tokenData.id_token;
    if (!idToken)
      throw new Error("ID token not found in token exchange response");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: idToken }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.detail);
    }

    const data = await res.json();

    if (!data.access_token || !data.refresh_token) {
      throw new Error("Invalid response from backend");
    }

    const setToken = useAuthStore.getState().setToken;
    setToken(data.access_token, threeDaysInSeconds);

    return true;
  } catch (error) {
    console.error("Google callback error:", error);
    throw error;
  }
}

export async function signOutAction() {
  const clearToken = useAuthStore.getState().clearToken;
  clearToken();

  window.location.href = "/";
}

function generateRandomState() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
