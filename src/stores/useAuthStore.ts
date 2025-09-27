import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthState {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      isAuthenticated: false,
      
      setTokens: (tokens) => set({ tokens, isAuthenticated: true }),
      
      clearTokens: () => set({ tokens: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
