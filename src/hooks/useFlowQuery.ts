import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CACHE_TIMES } from '@/config/constants';

import { flowApi } from '../lib/api';
import { Flow, CreateFlowRequest, FlowListResponse, FlowListParams } from '../types/flow';
import { logger } from '../lib/logger';

// Query keys for consistency
export const flowKeys = {
  all: ['flows'] as const,
  tenant: (tenantUuid: string) => [...flowKeys.all, 'tenant', tenantUuid] as const,
  lists: (tenantUuid: string, params?: FlowListParams) => [...flowKeys.tenant(tenantUuid), 'list', params] as const,
  flow: (tenantUuid: string, flowUuid: string) => [...flowKeys.tenant(tenantUuid), 'flow', flowUuid] as const,
};

// Hook to get flows for a tenant with pagination
export function useFlows(tenantUuid: string, params?: FlowListParams) {
  return useQuery<FlowListResponse, Error>({
    queryKey: flowKeys.lists(tenantUuid, params),
    queryFn: () => flowApi.getFlows(tenantUuid, params),
    enabled: !!tenantUuid,
    staleTime: CACHE_TIMES.STALE_TIME,
  });
}

// Hook to get a specific flow
export function useFlow(tenantUuid: string, flowUuid: string) {
  return useQuery({
    queryKey: flowKeys.flow(tenantUuid, flowUuid),
    queryFn: () => flowApi.getFlow(tenantUuid, flowUuid),
    enabled: !!(tenantUuid && flowUuid),
    staleTime: CACHE_TIMES.STALE_TIME,
  });
}

// Hook to create a new flow
export function useCreateFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantUuid, flowData }: { tenantUuid: string; flowData: CreateFlowRequest }) =>
      flowApi.createFlow(tenantUuid, flowData),
    onSuccess: (newFlow, { tenantUuid }) => {
      // Invalidate and refetch flows for this tenant
      queryClient.invalidateQueries({ queryKey: flowKeys.tenant(tenantUuid) });
      
      // Optionally add the new flow to the cache
      queryClient.setQueryData(flowKeys.flow(tenantUuid, newFlow.uuid), newFlow);
    },
    onError: (error) => {
      logger.error('Failed to create flow:', error);
    },
  });
}

// Hook to update a flow
export function useUpdateFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      tenantUuid, 
      flowUuid, 
      flowData 
    }: { 
      tenantUuid: string; 
      flowUuid: string; 
      flowData: Partial<CreateFlowRequest> 
    }) =>
      flowApi.updateFlow(tenantUuid, flowUuid, flowData),
    onSuccess: (updatedFlow, { tenantUuid, flowUuid }) => {
      // Update the specific flow in cache
      queryClient.setQueryData(flowKeys.flow(tenantUuid, flowUuid), updatedFlow);
      
      // Invalidate the flows list to ensure consistency
      queryClient.invalidateQueries({ queryKey: flowKeys.tenant(tenantUuid) });
    },
    onError: (error) => {
      logger.error('Failed to update flow:', error);
    },
  });
}

// Hook to delete a flow
export function useDeleteFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantUuid, flowUuid }: { tenantUuid: string; flowUuid: string }) =>
      flowApi.deleteFlow(tenantUuid, flowUuid),
    onSuccess: (_, { tenantUuid, flowUuid }) => {
      // Remove the flow from cache
      queryClient.removeQueries({ queryKey: flowKeys.flow(tenantUuid, flowUuid) });
      
      // Invalidate the flows list
      queryClient.invalidateQueries({ queryKey: flowKeys.tenant(tenantUuid) });
    },
    onError: (error) => {
      logger.error('Failed to delete flow:', error);
    },
  });
}
