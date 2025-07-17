import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null;
  expiresAt: number | null; 
  setToken: (token: string, expiresInSeconds: number) => void;
  getToken: () => string | null;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      expiresAt: null,

      setToken: (token, expiresInSeconds) => {
        const now = Date.now();
        const expiresAt = now + expiresInSeconds * 1000;
        set({ token, expiresAt });
      },

      getToken: () => {
        const { token, expiresAt, clearToken } = get();
        if (!token || !expiresAt) return null;

        if (Date.now() > expiresAt) {
          clearToken();
          return null;
        }

        return token;
      },

      clearToken: () => set({ token: null, expiresAt: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
