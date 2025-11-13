import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '../types/user';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthState {
  tokens: AuthTokens | null;
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User | null) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      user: null,
      isAuthenticated: false,
      
      setTokens: (tokens) => set({ tokens, isAuthenticated: true }),
      
      setUser: (user) => set({ user }),
      
      clearTokens: () => set({ tokens: null, user: null, isAuthenticated: false }),
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
