import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { useTenantByUuid } from '@/hooks/useTenantQuery';

export const useTenantStatus = () => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();

  // Fetch the actual tenant data to get the tier
  const { data: tenant } = useTenantByUuid(selectedTenant || '');

  // Find the selected tenant's membership
  const selectedMembership = user?.memberships?.find(
    (m) => m.tenant_uuid === selectedTenant
  );

  // Get tier from tenant data (primary source) or membership (fallback)
  const tenantTier = tenant?.tier || selectedMembership?.tenant_tier;

  const isRestrictedTenant = tenantTier === 'CREATED' || tenantTier === 'CANCELLED';

  return {
    tenantTier,
    isRestrictedTenant,
    selectedMembership,
  };
};
