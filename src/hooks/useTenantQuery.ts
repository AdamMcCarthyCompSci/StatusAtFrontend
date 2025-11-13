import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantApi } from '@/lib/api';
import { Tenant } from '@/types/tenant';
import { useTenantStore } from '@/stores/useTenantStore';
import { CACHE_TIMES } from '@/config/constants';

export const tenantKeys = {
  all: ['tenants'] as const,
  byName: (name: string) => [...tenantKeys.all, 'byName', name] as const,
  byUuid: (uuid: string) => [...tenantKeys.all, 'byUuid', uuid] as const,
};

export function useTenant(tenantName: string) {
  return useQuery<Tenant, Error>({
    queryKey: tenantKeys.byName(tenantName),
    queryFn: () => tenantApi.getTenantByName(tenantName),
    enabled: !!tenantName,
    staleTime: CACHE_TIMES.STALE_TIME,
  });
}

export function useTenantByUuid(tenantUuid: string) {
  return useQuery<Tenant, Error>({
    queryKey: tenantKeys.byUuid(tenantUuid),
    queryFn: () => tenantApi.getTenant(tenantUuid),
    enabled: !!tenantUuid,
    staleTime: CACHE_TIMES.STALE_TIME,
  });
}

// Hook to fetch multiple tenants by UUID
export function useTenantsByUuid(tenantUuids: string[]) {
  const queries = useQueries({
    queries: tenantUuids.map(tenantUuid => ({
      queryKey: tenantKeys.byUuid(tenantUuid),
      queryFn: () => tenantApi.getTenant(tenantUuid),
      enabled: !!tenantUuid,
      staleTime: CACHE_TIMES.STALE_TIME,
    })),
  });

  const tenants = queries
    .filter(query => query.data)
    .map(query => query.data!);

  const isLoading = queries.some(query => query.isLoading);
  const hasError = queries.some(query => query.error);

  return {
    tenants,
    isLoading,
    hasError,
    queries,
  };
}

// Hook to fetch multiple tenants by name (public endpoint)
export function useTenantsByName(tenantNames: string[]) {
  const queries = useQueries({
    queries: tenantNames.map(tenantName => ({
      queryKey: tenantKeys.byName(tenantName),
      queryFn: () => tenantApi.getTenantByName(tenantName),
      enabled: !!tenantName,
      staleTime: CACHE_TIMES.STALE_TIME,
    })),
  });

  const tenants = queries
    .filter(query => query.data)
    .map(query => query.data!);

  const isLoading = queries.some(query => query.isLoading);
  const hasError = queries.some(query => query.error);

  return {
    tenants,
    isLoading,
    hasError,
    queries,
  };
}

// Hook to create a new tenant
export function useCreateTenant() {
  const queryClient = useQueryClient();
  const { setSelectedTenant } = useTenantStore();

  return useMutation({
    mutationFn: (tenantData: { name: string }) => tenantApi.createTenant(tenantData),
    onSuccess: (newTenant) => {
      // Invalidate user query to refetch memberships
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Auto-select the newly created tenant
      setSelectedTenant(newTenant.uuid);
    },
  });
}
