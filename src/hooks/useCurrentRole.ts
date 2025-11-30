import { useMemo } from 'react';

import { useAuthStore } from '../stores/useAuthStore';
import { useTenantStore } from '../stores/useTenantStore';
import { MemberRole, ROLE_HIERARCHY_VALUES } from '../types/user';

/**
 * Hook to get the current user's role in the selected tenant
 * Returns null if no tenant is selected or user has no membership in that tenant
 */
export const useCurrentRole = (): MemberRole | null => {
  const user = useAuthStore(state => state.user);
  const selectedTenant = useTenantStore(state => state.selectedTenant);

  return useMemo(() => {
    if (!user || !selectedTenant) return null;

    const membership = user.memberships?.find(
      m => m.tenant_uuid === selectedTenant
    );

    return membership?.role ?? null;
  }, [user, selectedTenant]);
};

/**
 * Hook to check if current user has minimum required role
 * @param minRole - The minimum role required (MEMBER, STAFF, or OWNER)
 * @returns true if user has the minimum role or higher
 */
export const useHasMinimumRole = (minRole: MemberRole): boolean => {
  const currentRole = useCurrentRole();

  return useMemo(() => {
    if (!currentRole) return false;

    return ROLE_HIERARCHY_VALUES[currentRole] >= ROLE_HIERARCHY_VALUES[minRole];
  }, [currentRole, minRole]);
};

/**
 * Hook to check if current user has exact role
 * @param role - The exact role to check (MEMBER, STAFF, or OWNER)
 * @returns true if user has exactly this role
 */
export const useHasExactRole = (role: MemberRole): boolean => {
  const currentRole = useCurrentRole();
  return currentRole === role;
};

/**
 * Hook to check if current user is an OWNER
 */
export const useIsOwner = (): boolean => {
  return useHasExactRole('OWNER');
};

/**
 * Hook to check if current user is STAFF or OWNER
 */
export const useIsStaffOrOwner = (): boolean => {
  return useHasMinimumRole('STAFF');
};
