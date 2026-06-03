import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const useIsLoggedIn = (): boolean => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = useAuthStore.getState().getToken();
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  return isLoggedIn;
};
