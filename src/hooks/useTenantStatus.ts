import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';

export const useTenantStatus = () => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();

  // Find the selected tenant's membership
  const selectedMembership = user?.memberships?.find(
    m => m.tenant_uuid === selectedTenant
  );

  // Get tier from membership (now always included by backend in /user/me)
  const tenantTier = selectedMembership?.tenant_tier;

  // Check if tenant is restricted (CREATED or CANCELLED status)
  const isRestrictedTenant =
    tenantTier === 'CREATED' || tenantTier === 'CANCELLED';

  return {
    tenantTier,
    isRestrictedTenant,
    selectedMembership,
  };
};
