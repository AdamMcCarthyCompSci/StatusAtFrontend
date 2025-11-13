import { apiRequest } from './client';
import { buildQueryString } from '../utils';
import {
  Flow,
  CreateFlowRequest,
  CreateFlowResponse,
  FlowListResponse,
  FlowListParams,
} from '../../types/flow';

/**
 * Flow API methods
 * Handles flow management operations
 */
export const flowApi = {
  /**
   * Create a new flow
   * @param tenantUuid - UUID of the tenant
   * @param flowData - Flow creation data
   * @returns Newly created flow
   */
  createFlow: (
    tenantUuid: string,
    flowData: CreateFlowRequest
  ): Promise<CreateFlowResponse> =>
    apiRequest<CreateFlowResponse>(`/tenants/${tenantUuid}/flows`, {
      method: 'POST',
      body: JSON.stringify(flowData),
    }),

  /**
   * Get flows with optional filtering and pagination
   * @param tenantUuid - UUID of the tenant
   * @param params - Optional query parameters
   * @returns Paginated list of flows
   */
  getFlows: async (
    tenantUuid: string,
    params?: FlowListParams
  ): Promise<FlowListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = `/tenants/${tenantUuid}/flows${queryString ? `?${queryString}` : ''}`;
    return apiRequest<FlowListResponse>(url);
  },

  /**
   * Get a single flow by UUID
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @returns Flow data
   */
  getFlow: (tenantUuid: string, flowUuid: string): Promise<Flow> =>
    apiRequest<Flow>(`/tenants/${tenantUuid}/flows/${flowUuid}`),

  /**
   * Update flow
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param flowData - Partial flow data to update
   * @returns Updated flow data
   */
  updateFlow: (
    tenantUuid: string,
    flowUuid: string,
    flowData: Partial<CreateFlowRequest>
  ): Promise<Flow> =>
    apiRequest<Flow>(`/tenants/${tenantUuid}/flows/${flowUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(flowData),
    }),

  /**
   * Delete flow
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   */
  deleteFlow: (tenantUuid: string, flowUuid: string): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/flows/${flowUuid}`, {
      method: 'DELETE',
    }),
};
