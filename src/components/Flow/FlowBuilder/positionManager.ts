import { useCallback, useRef, useEffect } from 'react';
import { useQueryClient, UseMutationResult } from '@tanstack/react-query';

import { FlowStepsListResponse } from '@/types/flowBuilder';
import { flowBuilderKeys } from '@/hooks/useFlowBuilderQuery';
import { logger } from '@/lib/logger';

import { NODE_DIMENSIONS } from '../constants';

/**
 * Hook parameters for position management
 */
export interface PositionManagerParams {
  selectedTenant: string;
  flowId: string;
  enableRealtime: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStepMutation: UseMutationResult<any, Error, any, unknown>;
}

/**
 * Custom hook for managing node position updates with debouncing
 * Handles optimistic UI updates and batched API calls
 */
export const usePositionManager = (params: PositionManagerParams) => {
  const { selectedTenant, flowId, enableRealtime, updateStepMutation } = params;
  const queryClient = useQueryClient();

  // Track pending position updates for debouncing
  const pendingUpdatesRef = useRef<Map<string, { x: number; y: number }>>(
    new Map()
  );
  const updateTimeoutRef = useRef<number | undefined>(undefined);

  /**
   * Save all pending position updates to backend
   */
  const debouncedSavePositions = useCallback(async () => {
    const updates = Array.from(pendingUpdatesRef.current.entries());
    if (updates.length === 0) return;

    // Clear pending updates
    pendingUpdatesRef.current.clear();

    // Save all pending position updates
    try {
      await Promise.all(
        updates.map(([nodeId, position]) =>
          updateStepMutation.mutateAsync({
            stepUuid: nodeId,
            stepData: {
              metadata: {
                // Convert from top-left (frontend) to center (backend) coordinates
                x: (position.x + NODE_DIMENSIONS.WIDTH / 2).toString(),
                y: (position.y + NODE_DIMENSIONS.HEIGHT / 2).toString(),
              },
            },
          })
        )
      );
    } catch (error) {
      logger.error('Failed to save position updates', error);
    }
  }, [updateStepMutation]);

  /**
   * Update node position in React Query cache optimistically (UI only, no API call)
   */
  const updateCachePosition = useCallback(
    (nodeId: string, x: number, y: number) => {
      const stepsQueryKey = flowBuilderKeys.steps(selectedTenant, flowId);

      queryClient.setQueryData<FlowStepsListResponse>(
        stepsQueryKey,
        oldData => {
          if (!oldData) return oldData;

          return oldData.map(step => {
            if (step.uuid === nodeId) {
              return {
                ...step,
                metadata: {
                  ...step.metadata,
                  // Store as center coordinates (like backend) so convertApiStepToInternal can convert properly
                  x: (x + NODE_DIMENSIONS.WIDTH / 2).toString(),
                  y: (y + NODE_DIMENSIONS.HEIGHT / 2).toString(),
                },
              };
            }
            return step;
          });
        }
      );
    },
    [selectedTenant, flowId, queryClient]
  );

  /**
   * Update node position for real-time dragging (optimistic UI update only)
   */
  const updateNodePositionRealtime = useCallback(
    (nodeId: string, x: number, y: number) => {
      updateCachePosition(nodeId, x, y);
    },
    [updateCachePosition]
  );

  /**
   * Update node position and schedule debounced API save
   */
  const updateNodePosition = useCallback(
    (nodeId: string, x: number, y: number) => {
      // Update cache optimistically
      updateCachePosition(nodeId, x, y);

      // Track for debounced backend update
      pendingUpdatesRef.current.set(nodeId, { x, y });

      // Debounce the API call
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = window.setTimeout(debouncedSavePositions, 500);
    },
    [updateCachePosition, debouncedSavePositions]
  );

  /**
   * Finalize position update after dragging ends (triggers API save)
   */
  const finalizeNodePosition = useCallback(
    (nodeId: string, x: number, y: number) => {
      // Track for debounced backend update
      pendingUpdatesRef.current.set(nodeId, { x, y });

      // Debounce the API call
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = window.setTimeout(debouncedSavePositions, 500);
    },
    [debouncedSavePositions]
  );

  /**
   * Force save any pending position updates immediately
   */
  const forceSavePendingUpdates = useCallback(async () => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    await debouncedSavePositions();
  }, [debouncedSavePositions]);

  // Cleanup timeout on unmount and save pending updates
  useEffect(() => {
    const pendingUpdates = pendingUpdatesRef.current;
    const updateTimeout = updateTimeoutRef.current;

    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      // Note: Can't await in cleanup, but React Query will handle the request
      if (pendingUpdates.size > 0) {
        debouncedSavePositions();
      }
    };
  }, [debouncedSavePositions]);

  // Save pending updates when switching to real-time mode
  useEffect(() => {
    if (enableRealtime && pendingUpdatesRef.current.size > 0) {
      forceSavePendingUpdates();
    }
  }, [enableRealtime, forceSavePendingUpdates]);

  return {
    updateNodePositionRealtime,
    updateNodePosition,
    finalizeNodePosition,
    forceSavePendingUpdates,
  };
};
