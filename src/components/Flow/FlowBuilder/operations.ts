import { UseMutationResult } from '@tanstack/react-query';

import { logger } from '@/lib/logger';

import { FlowStep, FlowTransition } from '../types';
import { wouldCreateLoop, generateId } from '../utils';
import { NODE_DIMENSIONS, MAX_NODES } from '../constants';

/**
 * Hook parameters for CRUD operations
 */
export interface FlowOperationsParams {
  steps: FlowStep[];
  transitions: FlowTransition[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createStepMutation: UseMutationResult<any, Error, any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStepMutation: UseMutationResult<any, Error, any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteStepMutation: UseMutationResult<any, Error, any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createTransitionMutation: UseMutationResult<any, Error, any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteTransitionMutation: UseMutationResult<any, Error, any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organizeFlowMutation: UseMutationResult<any, Error, any, unknown>;

  confirm: (options: {
    title: string;
    description: string;
    variant: 'destructive' | 'warning' | 'info';
    confirmText: string;
    cancelText?: string;
  }) => Promise<boolean>;
}

/**
 * Creates CRUD operation handlers for flow builder
 */
export const createFlowOperations = (params: FlowOperationsParams) => {
  const {
    steps,
    transitions,
    createStepMutation,
    updateStepMutation,
    deleteStepMutation,
    createTransitionMutation,
    deleteTransitionMutation,
    organizeFlowMutation,
    confirm,
  } = params;

  /**
   * Add a new node at the specified coordinates
   */
  const addNode = async (x: number, y: number) => {
    // Check node limit
    if (steps.length >= MAX_NODES) {
      await confirm({
        title: 'Maximum Nodes Reached',
        description: `You've reached the maximum limit of ${MAX_NODES} nodes per flow. This helps maintain optimal performance and readability.`,
        variant: 'warning',
        confirmText: 'Understood',
        cancelText: undefined,
      });
      return;
    }

    try {
      await createStepMutation.mutateAsync({
        name: 'New Step',
        metadata: {
          x: x.toString(),
          y: y.toString(),
        },
      });
    } catch (error: any) {
      // Handle backend limit restrictions (403 errors)
      if (error?.response?.status === 403) {
        const message =
          error?.response?.data?.detail ||
          `You've reached the maximum limit of ${MAX_NODES} nodes per flow. Please contact support if you need more capacity.`;

        await confirm({
          title: 'Step Limit Reached',
          description: message,
          variant: 'warning',
          confirmText: 'Understood',
          cancelText: undefined,
        });
      } else {
        logger.error('Failed to create step', error);
      }
    }
  };

  /**
   * Update node name
   */
  const updateNodeName = async (nodeId: string, name: string) => {
    try {
      await updateStepMutation.mutateAsync({
        stepUuid: nodeId,
        stepData: { name },
      });
    } catch (error) {
      logger.error('Failed to update step name', error);
    }
  };

  /**
   * Update node properties (name, description, etc.)
   */
  const updateNodeProperties = async (
    nodeId: string,
    updates: { name?: string; description?: string }
  ) => {
    try {
      await updateStepMutation.mutateAsync({
        stepUuid: nodeId,
        stepData: updates,
      });
    } catch (error) {
      logger.error('Failed to update step properties', error);
    }
  };

  /**
   * Delete a node with confirmation
   */
  const deleteNode = async (nodeId: string) => {
    const step = steps.find(s => s.id === nodeId);
    const stepName = step?.name || 'Unknown Step';

    const confirmed = await confirm({
      title: 'Delete Step',
      description: `Are you sure you want to delete "${stepName}"? This step and all its connections will be permanently removed. Any enrollments on this step will be moved by the system.`,
      variant: 'destructive',
      confirmText: 'Delete Step',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    try {
      await deleteStepMutation.mutateAsync(nodeId);
    } catch (error) {
      logger.error('Failed to delete step', error);
    }
  };

  /**
   * Add a transition between two steps with validation
   */
  const addTransition = async (fromStepId: string, toStepId: string) => {
    // Check if transition already exists
    const exists = transitions.some(
      t => t.fromStepId === fromStepId && t.toStepId === toStepId
    );
    if (exists) return;

    // Check for loops
    if (wouldCreateLoop(fromStepId, toStepId, transitions)) {
      const fromNode = steps.find(s => s.id === fromStepId);
      const toNode = steps.find(s => s.id === toStepId);

      await confirm({
        title: 'Cannot Create Connection',
        description: `Creating a connection from "${fromNode?.name || 'Unknown'}" to "${toNode?.name || 'Unknown'}" would create a loop in your flow. Flows must be uni-directional to prevent infinite loops.`,
        variant: 'warning',
        confirmText: 'Understood',
        cancelText: undefined,
      });
      return;
    }

    // Create the new transition temporarily to check for multiple start points
    const newTransition: FlowTransition = {
      id: generateId(),
      fromStepId,
      toStepId,
    };
    const futureTransitions = [...transitions, newTransition];

    // Check for multiple start points (nodes with outputs but no inputs)
    const startNodes = steps.filter(step => {
      const hasOutputs = futureTransitions.some(t => t.fromStepId === step.id);
      const hasInputs = futureTransitions.some(t => t.toStepId === step.id);
      return hasOutputs && !hasInputs;
    });

    if (startNodes.length > 1) {
      const startNodeNames = startNodes.map(node => node.name).join('", "');

      await confirm({
        title: 'Cannot Create Multiple Start Points',
        description: `This connection would create multiple starting points in your flow: "${startNodeNames}". All customers must start from the same node to ensure a consistent experience.`,
        variant: 'warning',
        confirmText: 'Understood',
        cancelText: undefined,
      });
      return;
    }

    // Create the transition via API
    try {
      await createTransitionMutation.mutateAsync({
        from_step: fromStepId,
        to_step: toStepId,
      });
    } catch (error) {
      logger.error('Failed to create transition', error);
    }
  };

  /**
   * Delete a transition with confirmation
   */
  const deleteTransition = async (transitionId: string) => {
    const transition = transitions.find(t => t.id === transitionId);
    if (!transition) return;

    const fromStep = steps.find(s => s.id === transition.fromStepId);
    const toStep = steps.find(s => s.id === transition.toStepId);

    const fromStepName = fromStep?.name || 'Unknown Step';
    const toStepName = toStep?.name || 'Unknown Step';

    const confirmed = await confirm({
      title: 'Delete Transition',
      description: `Are you sure you want to delete the transition from "${fromStepName}" to "${toStepName}"? This will remove the connection between these steps and may affect the flow logic.`,
      variant: 'destructive',
      confirmText: 'Delete Transition',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    try {
      await deleteTransitionMutation.mutateAsync(transitionId);
    } catch (error) {
      logger.error('Failed to delete transition', error);
    }
  };

  /**
   * Organize flow layout automatically
   */
  const organizeFlow = async () => {
    const confirmed = await confirm({
      title: 'Organize Flow',
      description:
        'This will automatically arrange your flow steps in a clean tree layout. Connected steps will be organized hierarchically, and disconnected steps will be moved to the side. This action cannot be undone.',
      variant: 'info',
      confirmText: 'Organize Flow',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    try {
      // Analyze the current flow structure
      const connectedSteps: string[] = [];
      const disconnectedSteps: string[] = [];

      steps.forEach(step => {
        const hasIncoming = transitions.some(t => t.toStepId === step.id);
        const hasOutgoing = transitions.some(t => t.fromStepId === step.id);

        if (hasIncoming || hasOutgoing) {
          connectedSteps.push(step.id);
        } else {
          disconnectedSteps.push(step.id);
        }
      });

      // Prepare the organize request data
      const organizeData = {
        connected_steps: connectedSteps.map(stepId => {
          const step = steps.find(s => s.id === stepId)!;
          return {
            step_uuid: step.id,
            step_name: step.name,
            // Backend uses top-left coordinates
            x: step.x,
            y: step.y,
            width: NODE_DIMENSIONS.WIDTH,
            height: NODE_DIMENSIONS.HEIGHT,
          };
        }),
        disconnected_steps: disconnectedSteps.map(stepId => {
          const step = steps.find(s => s.id === stepId)!;
          return {
            step_uuid: step.id,
            step_name: step.name,
            // Backend uses top-left coordinates
            x: step.x,
            y: step.y,
            width: NODE_DIMENSIONS.WIDTH,
            height: NODE_DIMENSIONS.HEIGHT,
          };
        }),
        layout_info: {
          total_steps: steps.length,
          connected_count: connectedSteps.length,
          disconnected_count: disconnectedSteps.length,
        },
      };

      // Execute the organize operation
      await organizeFlowMutation.mutateAsync({ organizeData, apply: true });

      // Note: fit-to-view is handled by the parent component via useEffect
      // after the mutation completes and steps are updated
    } catch (error) {
      logger.error('Failed to organize flow', error);
    }
  };

  return {
    addNode,
    updateNodeName,
    updateNodeProperties,
    deleteNode,
    addTransition,
    deleteTransition,
    organizeFlow,
  };
};
