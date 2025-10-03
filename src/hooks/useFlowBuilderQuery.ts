import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flowBuilderApi } from '../lib/api';
import { 
  FlowStepAPI, 
  FlowTransitionAPI, 
  CreateFlowStepRequest, 
  CreateFlowTransitionRequest, 
  UpdateFlowStepRequest, 
  UpdateFlowTransitionRequest 
} from '../types/flowBuilder';

// Query keys
export const flowBuilderKeys = {
  all: ['flowBuilder'] as const,
  steps: (tenantUuid: string, flowUuid: string) => [...flowBuilderKeys.all, 'steps', tenantUuid, flowUuid] as const,
  transitions: (tenantUuid: string, flowUuid: string) => [...flowBuilderKeys.all, 'transitions', tenantUuid, flowUuid] as const,
};

// Flow Steps Hooks
export function useFlowSteps(tenantUuid: string, flowUuid: string) {
  return useQuery({
    queryKey: flowBuilderKeys.steps(tenantUuid, flowUuid),
    queryFn: () => flowBuilderApi.getFlowSteps(tenantUuid, flowUuid),
    enabled: !!tenantUuid && !!flowUuid,
  });
}

export function useCreateFlowStep(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (stepData: CreateFlowStepRequest) => 
      flowBuilderApi.createFlowStep(tenantUuid, flowUuid, stepData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowBuilderKeys.steps(tenantUuid, flowUuid) });
    },
  });
}

export function useUpdateFlowStep(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ stepUuid, stepData }: { stepUuid: string; stepData: UpdateFlowStepRequest }) => 
      flowBuilderApi.updateFlowStep(tenantUuid, flowUuid, stepUuid, stepData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowBuilderKeys.steps(tenantUuid, flowUuid) });
    },
  });
}

export function useDeleteFlowStep(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (stepUuid: string) => 
      flowBuilderApi.deleteFlowStep(tenantUuid, flowUuid, stepUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowBuilderKeys.steps(tenantUuid, flowUuid) });
      queryClient.invalidateQueries({ queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid) });
    },
  });
}

// Flow Transitions Hooks
export function useFlowTransitions(tenantUuid: string, flowUuid: string) {
  return useQuery({
    queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid),
    queryFn: () => flowBuilderApi.getFlowTransitions(tenantUuid, flowUuid),
    enabled: !!tenantUuid && !!flowUuid,
  });
}

export function useCreateFlowTransition(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transitionData: CreateFlowTransitionRequest) => 
      flowBuilderApi.createFlowTransition(tenantUuid, flowUuid, transitionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid) });
    },
  });
}

export function useUpdateFlowTransition(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ transitionUuid, transitionData }: { transitionUuid: string; transitionData: UpdateFlowTransitionRequest }) => 
      flowBuilderApi.updateFlowTransition(tenantUuid, flowUuid, transitionUuid, transitionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid) });
    },
  });
}

export function useDeleteFlowTransition(tenantUuid: string, flowUuid: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transitionUuid: string) => 
      flowBuilderApi.deleteFlowTransition(tenantUuid, flowUuid, transitionUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flowBuilderKeys.transitions(tenantUuid, flowUuid) });
    },
  });
}
