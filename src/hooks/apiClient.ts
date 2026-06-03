import { useAuthStore } from "@/store/useAuthStore";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    try {
      const errorData = await response.json();

      if (
        errorData?.code === "token_not_valid" ||
        errorData?.detail?.includes("Token is expired")
      ) {
        const { clearToken } = useAuthStore.getState();
        clearToken();

        if (typeof window !== "undefined") {
          alert("Your session has expired. Please log in again.");
          window.location.href = "/auth/login";
        }
      }
    } catch {
      console.error("Failed to parse error response");
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "API request failed");
  }

  return response.json();
}
