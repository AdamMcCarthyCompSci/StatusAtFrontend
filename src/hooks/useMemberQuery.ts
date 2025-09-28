import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '../lib/api';
import { Member, MemberListResponse, MemberListParams, UpdateMemberRequest } from '../types/member';

// Query keys for consistency
export const memberKeys = {
  all: ['members'] as const,
  tenant: (tenantUuid: string) => [...memberKeys.all, 'tenant', tenantUuid] as const,
  lists: (tenantUuid: string, params?: MemberListParams) => [...memberKeys.tenant(tenantUuid), 'list', params] as const,
  member: (tenantUuid: string, memberUuid: string) => [...memberKeys.tenant(tenantUuid), 'member', memberUuid] as const,
};

// Hook to get members for a tenant with pagination
export function useMembers(tenantUuid: string, params?: MemberListParams) {
  return useQuery<MemberListResponse, Error>({
    queryKey: memberKeys.lists(tenantUuid, params),
    queryFn: () => memberApi.getMembers(tenantUuid, params),
    enabled: !!tenantUuid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get a specific member
export function useMember(tenantUuid: string, memberUuid: string) {
  return useQuery<Member, Error>({
    queryKey: memberKeys.member(tenantUuid, memberUuid),
    queryFn: () => memberApi.getMember(tenantUuid, memberUuid),
    enabled: !!(tenantUuid && memberUuid),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to update a member's role
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateMemberRequest, 
    Error, 
    { tenantUuid: string; memberUuid: string; memberData: UpdateMemberRequest }
  >({
    mutationFn: ({ tenantUuid, memberUuid, memberData }) =>
      memberApi.updateMember(tenantUuid, memberUuid, memberData),
    onSuccess: (updatedMember, { tenantUuid, memberUuid }) => {
      // Update the specific member in cache
      queryClient.setQueryData(memberKeys.member(tenantUuid, memberUuid), updatedMember);
      
      // Invalidate the members list
      queryClient.invalidateQueries({ queryKey: memberKeys.tenant(tenantUuid) });
    },
    onError: (error) => {
      console.error('Failed to update member:', error);
    },
  });
}

// Hook to delete a member
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { tenantUuid: string; memberUuid: string }>({
    mutationFn: ({ tenantUuid, memberUuid }) =>
      memberApi.deleteMember(tenantUuid, memberUuid),
    onSuccess: (_, { tenantUuid, memberUuid }) => {
      // Remove the member from cache
      queryClient.removeQueries({ queryKey: memberKeys.member(tenantUuid, memberUuid) });
      
      // Invalidate the members list
      queryClient.invalidateQueries({ queryKey: memberKeys.tenant(tenantUuid) });
    },
    onError: (error) => {
      console.error('Failed to delete member:', error);
    },
  });
}
