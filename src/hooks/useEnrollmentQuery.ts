import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentApi, flowApi } from '../lib/api';
import { Enrollment, EnrollmentListParams, EnrollmentListResponse, FlowStep } from '../types/enrollment';
import { Flow } from '../types/flow';
import { enrollmentHistoryKeys } from './useEnrollmentHistoryQuery';
import { userKeys } from './useUserQuery';

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  tenant: (tenantUuid: string) => [...enrollmentKeys.all, 'tenant', tenantUuid] as const,
  lists: (tenantUuid: string, params?: EnrollmentListParams) => [...enrollmentKeys.tenant(tenantUuid), 'list', params] as const,
  detail: (tenantUuid: string, enrollmentUuid: string) => [...enrollmentKeys.tenant(tenantUuid), 'detail', enrollmentUuid] as const,
  flows: (tenantUuid: string) => [...enrollmentKeys.tenant(tenantUuid), 'flows'] as const,
  flowSteps: (tenantUuid: string, flowUuid: string) => [...enrollmentKeys.tenant(tenantUuid), 'flow-steps', flowUuid] as const,
};

export function useEnrollments(tenantUuid: string, params?: EnrollmentListParams) {
  return useQuery<EnrollmentListResponse, Error>({
    queryKey: enrollmentKeys.lists(tenantUuid, params),
    queryFn: () => enrollmentApi.getEnrollments(tenantUuid, params),
    enabled: !!tenantUuid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useEnrollment(tenantUuid: string, enrollmentUuid: string) {
  return useQuery<Enrollment, Error>({
    queryKey: enrollmentKeys.detail(tenantUuid, enrollmentUuid),
    queryFn: () => enrollmentApi.getEnrollment(tenantUuid, enrollmentUuid),
    enabled: !!tenantUuid && !!enrollmentUuid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFlowsForFiltering(tenantUuid: string) {
  return useQuery<Flow[], Error>({
    queryKey: enrollmentKeys.flows(tenantUuid),
    queryFn: () => flowApi.getFlows(tenantUuid).then(response => response.results),
    enabled: !!tenantUuid,
    staleTime: 1000 * 60 * 10, // 10 minutes (flows don't change often)
  });
}

export function useFlowSteps(tenantUuid: string, flowUuid: string) {
  return useQuery<FlowStep[], Error>({
    queryKey: enrollmentKeys.flowSteps(tenantUuid, flowUuid),
    queryFn: () => enrollmentApi.getFlowSteps(tenantUuid, flowUuid).then(response => response.results),
    enabled: !!tenantUuid && !!flowUuid,
    staleTime: 1000 * 60 * 10, // 10 minutes (steps don't change often)
  });
}

export function useDeleteEnrollment() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { tenantUuid: string; enrollmentUuid: string }>({
    mutationFn: ({ tenantUuid, enrollmentUuid }) => enrollmentApi.deleteEnrollment(tenantUuid, enrollmentUuid),
    onSuccess: (_, { tenantUuid, enrollmentUuid }) => {
      // Invalidate enrollment lists to refresh the data
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists(tenantUuid) });
      // Remove the specific enrollment from cache
      queryClient.removeQueries({ queryKey: enrollmentKeys.detail(tenantUuid, enrollmentUuid) });
      // Invalidate the current user query to refresh dashboard enrollments
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
}

export function useUpdateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation<Enrollment, Error, { 
    tenantUuid: string; 
    enrollmentUuid: string; 
    updates: { current_step?: string };
  }>({
    mutationFn: ({ tenantUuid, enrollmentUuid, updates }) =>
      enrollmentApi.updateEnrollment(tenantUuid, enrollmentUuid, updates),
    onSuccess: (_, { tenantUuid, enrollmentUuid }) => {
      // Invalidate the enrollments list to refresh the data
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.tenant(tenantUuid) });
      
      // Invalidate the enrollment history to refresh after moves
      queryClient.invalidateQueries({ queryKey: enrollmentHistoryKeys.enrollment(tenantUuid, enrollmentUuid) });
      
      // Invalidate the current user query to refresh dashboard enrollments
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
}
