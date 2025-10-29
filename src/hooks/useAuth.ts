import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { decodeJWTUserId, isTokenExpired } from "@/lib/communications";

export const useAuth = () => {
  const { token, getToken, clearToken } = useAuthStore();
  const { user } = useUserStore();

  const getValidToken = () => {
    const currentToken = getToken();
    if (!currentToken) {
      // If no token in store, try localStorage as fallback
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) {
          return storedToken;
        }
      }
      return null;
    }

    return currentToken;
  };

  const getUserId = () => {
    const currentToken = getValidToken();
    if (!currentToken) return null;

    const userId = decodeJWTUserId(currentToken);
    return userId || user?.id || null;
  };

  const isAuthenticated = () => {
    return getValidToken() !== null && getUserId() !== null;
  };

  return {
    token: getValidToken(),
    userId: getUserId(),
    isAuthenticated: isAuthenticated(),
    clearToken,
  };
};
