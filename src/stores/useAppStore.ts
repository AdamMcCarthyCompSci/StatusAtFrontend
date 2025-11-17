import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
  
  // App State
  isOnline: boolean;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setIsOnline: (online: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
        (set) => ({
        // Initial state
        sidebarOpen: false,
        theme: 'light',
        isOnline: true,
        
        // Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
        setIsOnline: (online) => set({ isOnline: online }),
      }),
      {
        name: 'app-store',
        // Only persist certain values
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);
