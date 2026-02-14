import { useQueries } from '@tanstack/react-query';

import { CACHE_TIMES } from '@/config/constants';

import { memberApi } from '../lib/api';
import { User } from '../types/user';

export function useSoleOwnership(user: User | null) {
  // Get all organizations where the user is an OWNER
  const ownerMemberships =
    user?.memberships?.filter(membership => membership.role === 'OWNER') || [];

  // For each organization, fetch the member list to count owners
  const memberQueries = useQueries({
    queries: ownerMemberships.map(membership => ({
      queryKey: ['members', membership.tenant_uuid, 'owner-check'],
      queryFn: () =>
        memberApi.getMembers(membership.tenant_uuid, { page_size: 100 }), // Get enough to count all owners
      enabled: !!membership.tenant_uuid,
      staleTime: CACHE_TIMES.STALE_TIME,
    })),
  });

  // Calculate which organizations have sole ownership
  const soleOwnerships = ownerMemberships.filter((_membership, index) => {
    const memberData = memberQueries[index]?.data;
    if (!memberData) return false; // Still loading or error

    // Count owners in this organization
    const ownerCount = memberData.results.filter(
      member => member.role === 'OWNER'
    ).length;
    return ownerCount === 1; // User is the sole owner
  });

  // Check if all queries are loaded
  const isLoading = memberQueries.some(query => query.isLoading);
  const hasError = memberQueries.some(query => query.error);

  return {
    soleOwnerships,
    isLoading,
    hasError,
    ownerMemberships, // All organizations where user is an owner
  };
}
