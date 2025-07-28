"use client";

export async function signInGithubAction() {
  try {
    // Redirect to GitHub OAuth
    const clientId = process.env.NEXT_PUBLIC_GITHUB_ID;
    // const redirectUri = encodeURIComponent(
    //   `${window.location.origin}/auth/callback`
    // );
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

    if (!code) {
      throw new Error("No authorization code received");
    }

    console.log("Received code:", code);
    // 7bae3f562e7ae7739a18

    // Send the code to your backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/github`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Backend error:", errorData);
      throw new Error("Failed to authenticate with backend");
    }

    const data = await res.json();
    console.log("Backend response:", data);

    // Check if tokens exist in the response
    if (!data.access_token || !data.refresh_token) {
      console.error("Tokens not found in response:", data);
      throw new Error("Invalid response from backend");
    }

    // Store the tokens in localStorage
    localStorage.setItem("accessToken", data.access_token.access_token);
    localStorage.setItem("refreshToken", data.access_token.refresh_token);

    // Verify tokens were stored
    console.log("Stored access token:", localStorage.getItem("accessToken"));
    console.log("Stored refresh token:", localStorage.getItem("refreshToken"));

    return true;
  } catch (error) {
    console.error("GitHub callback error:", error);
    throw error;
  }
}

export async function signOutAction() {
  // Clear tokens from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Redirect to home page
  window.location.href = "/";
}

// Generate a random state parameter to prevent CSRF attacks
function generateRandomState() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
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

    console.log("Redirecting to Google OAuth:", googleAuthUrl);
    window.location.href = googleAuthUrl;
  } catch (error) {
    console.error("Google sign in error:", error);
  }
}

export async function handleGoogleCallback() {
  try {
    console.log("Starting Google callback handler");
    console.log("Full URL:", window.location.href);

    const urlParams = new URLSearchParams(window.location.search);

    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (error) {
      throw new Error(`Google OAuth error: ${error}`);
    }

    const savedState = localStorage.getItem("googleOAuthState");
    if (!state || state !== savedState) {
      console.error("State mismatch. Saved:", savedState, "Received:", state);
      throw new Error("Invalid state parameter");
    }

    localStorage.removeItem("googleOAuthState");

    if (!code) {
      throw new Error("No authorization code received");
    }

    console.log("Received Google code:", code);

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
    console.log("Token exchange response:", tokenData);

    const idToken = tokenData.id_token;
    if (!idToken) {
      throw new Error("ID token not found in token exchange response");
    }

    // Send the ID token to your backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: idToken }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Backend error:", errorData);
      throw new Error("Failed to authenticate with backend");
    }

    const data = await res.json();
    console.log("Backend response:", data);

    if (!data.access_token || !data.refresh_token) {
      console.error("Tokens not found in response:", data);
      throw new Error("Invalid response from backend");
    }

    // Store the tokens in localStorage
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);

    // Verify tokens were stored
    console.log("Stored access token:", localStorage.getItem("accessToken"));
    console.log("Stored refresh token:", localStorage.getItem("refreshToken"));

    return true;
  } catch (error) {
    console.error("Google callback error:", error);
    throw error;
  }
}
