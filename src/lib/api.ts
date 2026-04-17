import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp && (payload.exp * 1000 < Date.now());
  } catch (e) {
    return true;
  }
};

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        if (isTokenExpired(token)) {
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes('/auth/login') && !currentPath.includes('/signin')) {
            localStorage.setItem("redirectUrl", currentPath);
          }
          const event = new CustomEvent("auth-session-expired");
          window.dispatchEvent(event);
          return Promise.reject(new axios.Cancel("Session expired"));
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname + window.location.search;
        if (!currentPath.includes('/auth/login') && !currentPath.includes('/signin')) {
          localStorage.setItem("redirectUrl", currentPath);
        }
        const event = new CustomEvent("auth-session-expired");
        window.dispatchEvent(event);
      }

    }
    return Promise.reject(error);
  }
);

export default api;