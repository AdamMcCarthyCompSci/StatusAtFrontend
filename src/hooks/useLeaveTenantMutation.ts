import { useMutation, useQueryClient } from '@tanstack/react-query';

import { memberApi } from '@/lib/api';
import { useTenantStore } from '@/stores/useTenantStore';
import { userKeys } from '@/hooks/useUserQuery';
import { logger } from '@/lib/logger';

export function useLeaveTenantMutation() {
  const queryClient = useQueryClient();
  const { clearSelectedTenant } = useTenantStore();

  return useMutation({
    mutationFn: (tenantUuid: string) => memberApi.leaveTenant(tenantUuid),
    onSuccess: (data, tenantUuid) => {
      // Invalidate user data to refresh memberships
      queryClient.invalidateQueries({ queryKey: userKeys.current() });

      // Clear selected tenant if it's the one we just left
      const { selectedTenant } = useTenantStore.getState();
      if (selectedTenant === tenantUuid) {
        clearSelectedTenant();
      }

      // Invalidate member queries for this tenant
      queryClient.invalidateQueries({ queryKey: ['members', tenantUuid] });

      // Log success message
      logger.info(
        `Successfully left ${data.tenant_name} (was ${data.previous_role})`
      );
    },
    onError: error => {
      logger.error('Failed to leave organization:', error);
    },
  });
}
