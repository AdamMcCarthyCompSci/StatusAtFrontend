import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';

export function useLeaveTenantMutation() {
  const queryClient = useQueryClient();
  const { clearSelectedTenant } = useTenantStore();

  return useMutation({
    mutationFn: (tenantUuid: string) =>
      memberApi.leaveTenant(tenantUuid),
    onSuccess: (data, tenantUuid) => {
      // Invalidate user data to refresh memberships
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      
      // Clear selected tenant if it's the one we just left
      const { selectedTenant } = useTenantStore.getState();
      if (selectedTenant === tenantUuid) {
        clearSelectedTenant();
      }
      
      // Invalidate member queries for this tenant
      queryClient.invalidateQueries({ queryKey: ['members', tenantUuid] });
      
      // Log success message
      console.log(`Successfully left ${data.tenant_name} (was ${data.previous_role})`);
    },
    onError: (error) => {
      console.error('Failed to leave organization:', error);
    },
  });
}
