"use client";
import { useAuthStore } from "@/store/useAuthStore";

const threeDaysInSeconds = 3 * 24 * 60 * 60;

export async function signInGithubAction() {
  try {
    const res = await fetch("/api/auth/github/init");
    
    if (!res.ok) {
      throw new Error("Failed to initialize GitHub OAuth");
    }

    const data = await res.json();
    window.location.href = data.authUrl;
  } catch (error) {
    console.error("GitHub sign in error:", error);
  }
}

export async function handleGithubCallback() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) throw new Error("No authorization code received");

    const res = await fetch(`/api/auth/github/callback?code=${encodeURIComponent(code)}`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to authenticate");
    }

    const data = await res.json();

    if (!data.access_token || !data.refresh_token) {
      throw new Error("Invalid response from server");
    }

    const setToken = useAuthStore.getState().setToken;
    setToken(data.access_token, threeDaysInSeconds);

    return true;
  } catch (error) {
    console.error("GitHub callback error:", error);
    throw error;
  }
}

export async function signInGoogleAction() {
  try {
    const res = await fetch("/api/auth/google/init");
    
    if (!res.ok) {
      throw new Error("Failed to initialize Google OAuth");
    }

    const data = await res.json();
    window.location.href = data.authUrl;
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

    if (!code || !state) {
      throw new Error("Missing authorization code or state");
    }

    const res = await fetch(
      `/api/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to authenticate");
    }

    const data = await res.json();

    if (!data.access_token || !data.refresh_token) {
      throw new Error("Invalid response from server");
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
