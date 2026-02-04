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
    // console.error("GitHub sign in error:", error);
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
    // console.error("GitHub callback error:", error);
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
    // console.error("Google sign in error:", error);
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

    // Debug logging
    // console.log("🔍 OAuth callback response:", data);
    // console.log("🔍 User data received:", data.user);

    if (!data.access_token || !data.refresh_token) {
      throw new Error("Invalid response from server");
    }

    const setToken = useAuthStore.getState().setToken;
    setToken(data.access_token, threeDaysInSeconds);

    // Store access token in localStorage
    localStorage.setItem("access_token", data.access_token);

    // Backend doesn't return user data in OAuth response, so we need to fetch it
    if (!data.user) {
      // console.log("⚠️ No user data in OAuth response, fetching from API...");

      try {
        // Decode JWT to get user_id
        const { decodeJWTUserId } = await import("@/lib/communications");
        const userId = decodeJWTUserId(data.access_token);

        if (!userId) {
          throw new Error("Could not decode user ID from token");
        }

        // console.log("🔍 Decoded user_id:", userId);

        // Fetch user data from the API
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const userRes = await fetch(`${baseUrl}/auth/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userRes.ok) {
          throw new Error(`Failed to fetch user data: ${userRes.status}`);
        }

        const userData = await userRes.json();
        // console.log("✅ User data fetched from API:", userData);

        // API returns {user: {...}}, we need to unwrap it
        const actualUserData = userData.user || userData;
        // console.log("📦 Unwrapped user data:", actualUserData);

        // Store user data
        const { useUserStore } = await import("@/store/useUserStore");
        const setUser = useUserStore.getState().setUser;
        setUser(actualUserData);

        // console.log("✅ User data stored successfully!");
      } catch (error) {
        // console.error("❌ Failed to fetch/store user data:", error);
        // Don't throw - allow login to proceed even if user fetch fails
      }
    } else {
      // If backend does return user data (unlikely), store it
      const { useUserStore } = await import("@/store/useUserStore");
      const setUser = useUserStore.getState().setUser;
      setUser(data.user);
      // console.log("✅ User data stored from OAuth response:", data.user);
    }

    return true;
  } catch (error) {
    // console.error("Google callback error:", error);
    throw error;
  }
}

export async function signOutAction() {
  const clearToken = useAuthStore.getState().clearToken;
  clearToken();

  window.location.href = "/";
}
