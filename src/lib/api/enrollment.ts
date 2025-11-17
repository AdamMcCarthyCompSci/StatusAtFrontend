import { apiRequest } from './client';
import { buildQueryString } from '../utils';
import {
  Enrollment,
  EnrollmentListParams,
  EnrollmentListResponse,
  FlowStepListResponse,
} from '../../types/enrollment';
import {
  EnrollmentHistoryListParams,
  EnrollmentHistoryListResponse,
} from '../../types/enrollmentHistory';

/**
 * Enrollment API methods
 * Handles customer enrollment and enrollment history operations
 */
export const enrollmentApi = {
  /**
   * Get enrollments with optional filtering
   * @param tenantUuid - UUID of the tenant
   * @param params - Optional query parameters
   * @returns Paginated list of enrollments
   */
  getEnrollments: async (
    tenantUuid: string,
    params?: EnrollmentListParams
  ): Promise<EnrollmentListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = `/tenants/${tenantUuid}/enrollments${queryString ? `?${queryString}` : ''}`;
    return apiRequest<EnrollmentListResponse>(url);
  },

  /**
   * Get a single enrollment by UUID
   * @param tenantUuid - UUID of the tenant
   * @param enrollmentUuid - UUID of the enrollment
   * @returns Enrollment data
   */
  getEnrollment: (
    tenantUuid: string,
    enrollmentUuid: string
  ): Promise<Enrollment> =>
    apiRequest<Enrollment>(
      `/tenants/${tenantUuid}/enrollments/${enrollmentUuid}`
    ),

  /**
   * Delete enrollment
   * @param tenantUuid - UUID of the tenant
   * @param enrollmentUuid - UUID of the enrollment
   */
  deleteEnrollment: (
    tenantUuid: string,
    enrollmentUuid: string
  ): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/enrollments/${enrollmentUuid}`, {
      method: 'DELETE',
    }),

  /**
   * Update enrollment (e.g., move to different step, update identifier)
   * @param tenantUuid - UUID of the tenant
   * @param enrollmentUuid - UUID of the enrollment
   * @param updates - Enrollment updates (e.g., current_step, identifier)
   * @returns Updated enrollment data
   */
  updateEnrollment: (
    tenantUuid: string,
    enrollmentUuid: string,
    updates: { current_step?: string; identifier?: string }
  ): Promise<Enrollment> =>
    apiRequest<Enrollment>(
      `/tenants/${tenantUuid}/enrollments/${enrollmentUuid}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    ),

  /**
   * Get flow steps for a specific flow
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @returns List of flow steps
   */
  getFlowSteps: (
    tenantUuid: string,
    flowUuid: string
  ): Promise<FlowStepListResponse> =>
    apiRequest<FlowStepListResponse>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/steps`
    ),

  /**
   * Get enrollment history
   * @param tenantUuid - UUID of the tenant
   * @param enrollmentUuid - UUID of the enrollment
   * @param params - Optional query parameters
   * @returns Paginated enrollment history
   */
  getEnrollmentHistory: async (
    tenantUuid: string,
    enrollmentUuid: string,
    params?: EnrollmentHistoryListParams
  ): Promise<EnrollmentHistoryListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = `/tenants/${tenantUuid}/enrollments/${enrollmentUuid}/history${queryString ? `?${queryString}` : ''}`;
    return apiRequest<EnrollmentHistoryListResponse>(url);
  },

  /**
   * Create enrollment (for QR code invitations)
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param userId - ID of the user
   * @returns Newly created enrollment
   */
  createEnrollment: (
    tenantUuid: string,
    flowUuid: string,
    userId: number
  ): Promise<Enrollment> =>
    apiRequest<Enrollment>(`/tenants/${tenantUuid}/enrollments`, {
      method: 'POST',
      body: JSON.stringify({
        flow: flowUuid,
        user: userId,
      }),
    }),

  /**
   * Create public enrollment (for external users via QR code)
   * @param tenantName - Name of the tenant
   * @param flowName - Name of the flow
   * @param userEmail - Email of the user
   * @returns Newly created enrollment
   */
  createPublicEnrollment: (
    tenantName: string,
    flowName: string,
    userEmail: string
  ): Promise<Enrollment> =>
    apiRequest<Enrollment>(
      '/public/enrollments',
      {
        method: 'POST',
        body: JSON.stringify({
          tenant_name: tenantName,
          flow_name: flowName,
          user_email: userEmail,
        }),
      },
      false
    ),
};
