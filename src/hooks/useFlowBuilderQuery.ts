import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { flowBuilderApi } from '../lib/api';
import {
  CreateFlowStepRequest,
  CreateFlowTransitionRequest,
  UpdateFlowStepRequest,
  UpdateFlowTransitionRequest,
  OrganizeFlowRequest,
  FlowStepsListResponse,
  CreateDocumentFieldRequest,
  UpdateDocumentFieldRequest,
} from '../types/flowBuilder';
import { NODE_DIMENSIONS } from '../components/Flow/constants';
import { enrollmentKeys } from './useEnrollmentQuery';
import { enrollmentHistoryKeys } from './useEnrollmentHistoryQuery';
import { userKeys } from './useUserQuery';

// Query keys
export const flowBuilderKeys = {
  all: ['flowBuilder'] as const,
  steps: (tenantUuid: string, flowUuid: string) =>
    [...flowBuilderKeys.all, 'steps', tenantUuid, flowUuid] as const,
  transitions: (tenantUuid: string, flowUuid: string) =>
    [...flowBuilderKeys.all, 'transitions', tenantUuid, flowUuid] as const,
  documentFields: (tenantUuid: string, flowUuid: string, stepUuid: string) =>
    [
      ...flowBuilderKeys.all,
      'documentFields',
      tenantUuid,
      flowUuid,
      stepUuid,
    ] as const,
};

// Flow Steps Hooks
export function useFlowSteps(
  tenantUuid: string,
  flowUuid: string,
  enableRealtime = false
) {
  return useQuery({
    queryKey: flowBuilderKeys.steps(tenantUuid, flowUuid),
    queryFn: () => flowBuilderApi.getFlowSteps(tenantUuid, flowUuid),
    enabled: !!tenantUuid && !!flowUuid,
    // Enable polling for real-time updates when multiple users are editing
    refetchInterval: enableRealtime ? 3000 : false, // Poll every 3 seconds
    refetchIntervalInBackground: enableRealtime,
  });
}

export function useCreateFlowStep(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stepData: CreateFlowStepRequest) =>
      flowBuilderApi.createFlowStep(tenantUuid, flowUuid, stepData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.steps(tenantUuid, flowUuid),
      });
    },
  });
}

export function useUpdateFlowStep(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stepUuid,
      stepData,
    }: {
      stepUuid: string;
      stepData: UpdateFlowStepRequest;
    }) =>
      flowBuilderApi.updateFlowStep(tenantUuid, flowUuid, stepUuid, stepData),
    onSuccess: (_, variables) => {
      // Only invalidate if we're updating the name (which affects enrollments)
      // Position updates are handled optimistically by the position manager
      if (variables.stepData.name !== undefined) {
        // Invalidate flow builder data
        queryClient.invalidateQueries({
          queryKey: flowBuilderKeys.steps(tenantUuid, flowUuid),
        });

        // Invalidate enrollment-related data to reflect updated step names
        queryClient.invalidateQueries({
          queryKey: enrollmentKeys.tenant(tenantUuid),
        });
        queryClient.invalidateQueries({
          queryKey: enrollmentHistoryKeys.tenant(tenantUuid),
        });
        queryClient.invalidateQueries({ queryKey: userKeys.current() });
      }
      // For position-only updates (metadata), the cache is already updated optimistically
      // so we don't need to invalidate and refetch
    },
  });
}

export function useDeleteFlowStep(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stepUuid: string) =>
      flowBuilderApi.deleteFlowStep(tenantUuid, flowUuid, stepUuid),
    onSuccess: () => {
      // Invalidate flow builder data
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.steps(tenantUuid, flowUuid),
      });
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid),
      });

      // Invalidate enrollment-related data since step deletion affects enrollments
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.tenant(tenantUuid),
      });
      queryClient.invalidateQueries({
        queryKey: enrollmentHistoryKeys.tenant(tenantUuid),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
}

// Flow Transitions Hooks
export function useFlowTransitions(
  tenantUuid: string,
  flowUuid: string,
  enableRealtime = false
) {
  return useQuery({
    queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid),
    queryFn: () => flowBuilderApi.getFlowTransitions(tenantUuid, flowUuid),
    enabled: !!tenantUuid && !!flowUuid,
    // Enable polling for real-time updates when multiple users are editing
    refetchInterval: enableRealtime ? 3000 : false, // Poll every 3 seconds
    refetchIntervalInBackground: enableRealtime,
  });
}

export function useCreateFlowTransition(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transitionData: CreateFlowTransitionRequest) =>
      flowBuilderApi.createFlowTransition(tenantUuid, flowUuid, transitionData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid),
      });
    },
  });
}

export function useUpdateFlowTransition(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transitionUuid,
      transitionData,
    }: {
      transitionUuid: string;
      transitionData: UpdateFlowTransitionRequest;
    }) =>
      flowBuilderApi.updateFlowTransition(
        tenantUuid,
        flowUuid,
        transitionUuid,
        transitionData
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid),
      });
    },
  });
}

export function useDeleteFlowTransition(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transitionUuid: string) =>
      flowBuilderApi.deleteFlowTransition(tenantUuid, flowUuid, transitionUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid),
      });
    },
  });
}

export function useOrganizeFlow(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizeData,
      apply = true,
    }: {
      organizeData: OrganizeFlowRequest;
      apply?: boolean;
    }) =>
      flowBuilderApi.organizeFlow(tenantUuid, flowUuid, organizeData, apply),
    onSuccess: response => {
      // Update the steps cache with the new positions from the response
      const stepsQueryKey = flowBuilderKeys.steps(tenantUuid, flowUuid);

      // Get current steps data
      const currentStepsData =
        queryClient.getQueryData<FlowStepsListResponse>(stepsQueryKey);

      if (currentStepsData && response) {
        // Create a map of new positions from the response
        const newPositions = new Map<string, { x: number; y: number }>();

        // Add connected steps positions (organize returns top-left coordinates)
        response.connected_steps.forEach(step => {
          newPositions.set(step.step_uuid, {
            x: parseInt(step.x),
            y: parseInt(step.y),
          });
        });

        // Add disconnected steps positions (organize returns top-left coordinates)
        response.disconnected_steps.forEach(step => {
          newPositions.set(step.step_uuid, {
            x: parseInt(step.x),
            y: parseInt(step.y),
          });
        });

        // Update the steps data with new positions (store as top-left coordinates in metadata)
        const updatedStepsData = currentStepsData.map(step => {
          const newPosition = newPositions.get(step.uuid);
          if (newPosition) {
            return {
              ...step,
              metadata: {
                ...step.metadata,
                x: newPosition.x.toString(),
                y: newPosition.y.toString(),
              },
            };
          }
          return step;
        });

        // Update the cache immediately for instant UI update
        queryClient.setQueryData(stepsQueryKey, updatedStepsData);
      }

      // Backend persists with ?apply=true
    },
  });
}

// Document Fields Hooks
export function useDocumentFields(
  tenantUuid: string,
  flowUuid: string,
  stepUuid: string
) {
  return useQuery({
    queryKey: flowBuilderKeys.documentFields(tenantUuid, flowUuid, stepUuid),
    queryFn: () =>
      flowBuilderApi.getDocumentFields(tenantUuid, flowUuid, stepUuid),
    enabled: !!tenantUuid && !!flowUuid && !!stepUuid,
  });
}

export function useCreateDocumentField(
  tenantUuid: string,
  flowUuid: string,
  stepUuid: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fieldData: CreateDocumentFieldRequest) =>
      flowBuilderApi.createDocumentField(
        tenantUuid,
        flowUuid,
        stepUuid,
        fieldData
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.documentFields(
          tenantUuid,
          flowUuid,
          stepUuid
        ),
      });
    },
  });
}

export function useUpdateDocumentField(
  tenantUuid: string,
  flowUuid: string,
  stepUuid: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fieldUuid,
      fieldData,
    }: {
      fieldUuid: string;
      fieldData: UpdateDocumentFieldRequest;
    }) =>
      flowBuilderApi.updateDocumentField(
        tenantUuid,
        flowUuid,
        stepUuid,
        fieldUuid,
        fieldData
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.documentFields(
          tenantUuid,
          flowUuid,
          stepUuid
        ),
      });
    },
  });
}

export function useDeleteDocumentField(
  tenantUuid: string,
  flowUuid: string,
  stepUuid: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fieldUuid: string) =>
      flowBuilderApi.deleteDocumentField(
        tenantUuid,
        flowUuid,
        stepUuid,
        fieldUuid
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: flowBuilderKeys.documentFields(
          tenantUuid,
          flowUuid,
          stepUuid
        ),
      });
    },
  });
}
