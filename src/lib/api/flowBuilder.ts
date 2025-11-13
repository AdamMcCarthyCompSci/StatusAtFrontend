import { apiRequest } from './client';
import {
  FlowStepAPI,
  FlowTransitionAPI,
  CreateFlowStepRequest,
  CreateFlowTransitionRequest,
  UpdateFlowStepRequest,
  UpdateFlowTransitionRequest,
  FlowStepsListResponse,
  FlowTransitionsListResponse,
  OrganizeFlowRequest,
  OrganizeFlowResponse,
} from '../../types/flowBuilder';

/**
 * FlowBuilder API methods
 * Handles flow step and transition operations for the flow builder
 */
export const flowBuilderApi = {
  /**
   * Get all steps for a flow
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @returns List of flow steps
   */
  getFlowSteps: (
    tenantUuid: string,
    flowUuid: string
  ): Promise<FlowStepsListResponse> =>
    apiRequest<FlowStepsListResponse>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/steps`
    ),

  /**
   * Create a new flow step
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param stepData - Step creation data
   * @returns Newly created flow step
   */
  createFlowStep: (
    tenantUuid: string,
    flowUuid: string,
    stepData: CreateFlowStepRequest
  ): Promise<FlowStepAPI> =>
    apiRequest<FlowStepAPI>(`/tenants/${tenantUuid}/flows/${flowUuid}/steps`, {
      method: 'POST',
      body: JSON.stringify(stepData),
    }),

  /**
   * Update a flow step
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param stepUuid - UUID of the step
   * @param stepData - Step update data
   * @returns Updated flow step
   */
  updateFlowStep: (
    tenantUuid: string,
    flowUuid: string,
    stepUuid: string,
    stepData: UpdateFlowStepRequest
  ): Promise<FlowStepAPI> =>
    apiRequest<FlowStepAPI>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/steps/${stepUuid}`,
      {
        method: 'PATCH',
        body: JSON.stringify(stepData),
      }
    ),

  /**
   * Delete a flow step
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param stepUuid - UUID of the step
   */
  deleteFlowStep: (
    tenantUuid: string,
    flowUuid: string,
    stepUuid: string
  ): Promise<void> =>
    apiRequest<void>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/steps/${stepUuid}`,
      {
        method: 'DELETE',
      }
    ),

  /**
   * Get all transitions for a flow
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @returns List of flow transitions
   */
  getFlowTransitions: (
    tenantUuid: string,
    flowUuid: string
  ): Promise<FlowTransitionsListResponse> =>
    apiRequest<FlowTransitionsListResponse>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/transitions`
    ),

  /**
   * Create a new flow transition
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param transitionData - Transition creation data
   * @returns Newly created flow transition
   */
  createFlowTransition: (
    tenantUuid: string,
    flowUuid: string,
    transitionData: CreateFlowTransitionRequest
  ): Promise<FlowTransitionAPI> =>
    apiRequest<FlowTransitionAPI>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/transitions`,
      {
        method: 'POST',
        body: JSON.stringify(transitionData),
      }
    ),

  /**
   * Update a flow transition
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param transitionUuid - UUID of the transition
   * @param transitionData - Transition update data
   * @returns Updated flow transition
   */
  updateFlowTransition: (
    tenantUuid: string,
    flowUuid: string,
    transitionUuid: string,
    transitionData: UpdateFlowTransitionRequest
  ): Promise<FlowTransitionAPI> =>
    apiRequest<FlowTransitionAPI>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/transitions/${transitionUuid}`,
      {
        method: 'PATCH',
        body: JSON.stringify(transitionData),
      }
    ),

  /**
   * Delete a flow transition
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param transitionUuid - UUID of the transition
   */
  deleteFlowTransition: (
    tenantUuid: string,
    flowUuid: string,
    transitionUuid: string
  ): Promise<void> =>
    apiRequest<void>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/transitions/${transitionUuid}`,
      {
        method: 'DELETE',
      }
    ),

  /**
   * Auto-organize flow layout
   * @param tenantUuid - UUID of the tenant
   * @param flowUuid - UUID of the flow
   * @param organizeData - Organization preferences
   * @param apply - Whether to apply the changes (default: true)
   * @returns Organization results with new positions
   */
  organizeFlow: (
    tenantUuid: string,
    flowUuid: string,
    organizeData: OrganizeFlowRequest,
    apply: boolean = true
  ): Promise<OrganizeFlowResponse> =>
    apiRequest<OrganizeFlowResponse>(
      `/tenants/${tenantUuid}/flows/${flowUuid}/organize${apply ? '?apply=true' : ''}`,
      {
        method: 'POST',
        body: JSON.stringify(organizeData),
      }
    ),
};
