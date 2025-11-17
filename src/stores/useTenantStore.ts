import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Membership } from '../types/user';

interface TenantStore {
  selectedTenant: string | null;
  setSelectedTenant: (tenantUuid: string) => void;
  clearSelectedTenant: () => void;
  initializeTenant: (memberships: Membership[]) => void;
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      selectedTenant: null,

      setSelectedTenant: (tenantUuid: string) => {
        set({ selectedTenant: tenantUuid });
      },

      clearSelectedTenant: () => {
        set({ selectedTenant: null });
      },

      initializeTenant: (memberships: Membership[]) => {
        const current = get().selectedTenant;
        
        // If no memberships, clear selection
        if (!memberships || memberships.length === 0) {
          set({ selectedTenant: null });
          return;
        }

        // If current selection is still valid, keep it
        if (current && memberships.some(m => m.tenant_uuid === current)) {
          return;
        }

        // Auto-select first tenant if only one, or first available
        const firstTenant = memberships[0];
        if (firstTenant) {
          set({ selectedTenant: firstTenant.tenant_uuid });
        }
      },
    }),
    {
      name: 'tenant-selection',
      partialize: (state) => ({ selectedTenant: state.selectedTenant }),
    }
  )
);
