import { apiRequest } from './client';
import { buildQueryString } from '../utils';
import {
  Member,
  MemberListParams,
  MemberListResponse,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from '../../types/member';

/**
 * Member API methods
 * Handles tenant membership operations
 */
export const memberApi = {
  /**
   * Get members of a tenant with optional filtering
   * @param tenantUuid - UUID of the tenant
   * @param params - Optional query parameters
   * @returns Paginated list of members
   */
  getMembers: async (
    tenantUuid: string,
    params?: MemberListParams
  ): Promise<MemberListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = `/tenants/${tenantUuid}/memberships${queryString ? `?${queryString}` : ''}`;
    return apiRequest<MemberListResponse>(url);
  },

  /**
   * Get a single member by UUID
   * @param tenantUuid - UUID of the tenant
   * @param memberUuid - UUID of the member
   * @returns Member data
   */
  getMember: (tenantUuid: string, memberUuid: string): Promise<Member> =>
    apiRequest<Member>(`/tenants/${tenantUuid}/memberships/${memberUuid}`),

  /**
   * Update member (e.g., change role)
   * @param tenantUuid - UUID of the tenant
   * @param memberUuid - UUID of the member
   * @param memberData - Member data to update
   * @returns Updated member data
   */
  updateMember: (
    tenantUuid: string,
    memberUuid: string,
    memberData: UpdateMemberRequest
  ): Promise<UpdateMemberResponse> =>
    apiRequest<UpdateMemberResponse>(
      `/tenants/${tenantUuid}/memberships/${memberUuid}`,
      {
        method: 'PATCH',
        body: JSON.stringify(memberData),
      }
    ),

  /**
   * Remove member from tenant
   * @param tenantUuid - UUID of the tenant
   * @param memberUuid - UUID of the member
   */
  deleteMember: (tenantUuid: string, memberUuid: string): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/memberships/${memberUuid}`, {
      method: 'DELETE',
    }),

  /**
   * Leave a tenant (self-remove)
   * @param tenantUuid - UUID of the tenant
   * @returns Confirmation message with tenant details
   */
  leaveTenant: (
    tenantUuid: string
  ): Promise<{
    message: string;
    tenant_name: string;
    previous_role: string;
    membership_uuid: string;
  }> =>
    apiRequest<{
      message: string;
      tenant_name: string;
      previous_role: string;
      membership_uuid: string;
    }>(`/tenants/${tenantUuid}/memberships/leave_tenant`, {
      method: 'POST',
    }),
};
