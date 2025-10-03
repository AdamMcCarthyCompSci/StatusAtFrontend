import { useQuery } from '@tanstack/react-query';
import { enrollmentApi } from '@/lib/api';
import { EnrollmentHistoryListParams, EnrollmentHistoryListResponse } from '@/types/enrollmentHistory';

// Query key factory for enrollment history
export const enrollmentHistoryKeys = {
  all: ['enrollmentHistory'] as const,
  tenant: (tenantUuid: string) => [...enrollmentHistoryKeys.all, tenantUuid] as const,
  enrollment: (tenantUuid: string, enrollmentUuid: string) => 
    [...enrollmentHistoryKeys.tenant(tenantUuid), enrollmentUuid] as const,
  list: (tenantUuid: string, enrollmentUuid: string, params?: EnrollmentHistoryListParams) => 
    [...enrollmentHistoryKeys.enrollment(tenantUuid, enrollmentUuid), 'list', params] as const,
};

export function useEnrollmentHistory(
  tenantUuid: string,
  enrollmentUuid: string,
  params?: EnrollmentHistoryListParams
) {
  return useQuery<EnrollmentHistoryListResponse, Error>({
    queryKey: enrollmentHistoryKeys.list(tenantUuid, enrollmentUuid, params),
    queryFn: () => enrollmentApi.getEnrollmentHistory(tenantUuid, enrollmentUuid, params),
    enabled: !!tenantUuid && !!enrollmentUuid,
  });
}
