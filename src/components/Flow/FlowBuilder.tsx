import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useFlow } from '@/hooks/useFlowQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { FlowStep, FlowTransition } from './types';
import { generateId, wouldCreateLoop } from './utils';
import { useCanvasState } from './hooks/useCanvasState';
import { useFlowInteractions } from './hooks/useFlowInteractions';
import { FlowBuilderToolbar } from './components/FlowBuilderToolbar';
import { FlowCanvas } from './components/FlowCanvas';
import { FlowTutorial } from './components/FlowTutorial';
import { FlowLoadingState } from './components/FlowLoadingState';
import { FlowErrorState } from './components/FlowErrorState';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { 
  useFlowSteps, 
  useFlowTransitions, 
  useCreateFlowStep, 
  useUpdateFlowStep, 
  useDeleteFlowStep,
  useCreateFlowTransition,
  useDeleteFlowTransition,
  useOrganizeFlow,
  flowBuilderKeys
} from '@/hooks/useFlowBuilderQuery';
import { FlowStepAPI, FlowTransitionAPI, FlowStepsListResponse } from '@/types/flowBuilder';
import { NODE_DIMENSIONS, MAX_NODES, GRID_LAYOUT } from './constants';

const FlowBuilder = () => {
  const { flowId } = useParams<{ flowId: string }>();
  const { selectedTenant } = useTenantStore();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Real-time collaboration toggle
  const [enableRealtime, setEnableRealtime] = useState(false);

  // Fetch flow data
  const { data: flowData, isLoading: isLoadingFlow, error: flowError } = useFlow(
    selectedTenant || '', 
    flowId || ''
  );

  // Fetch flow steps and transitions from backend
  const { data: stepsData, isLoading: isLoadingSteps, error: stepsError } = useFlowSteps(
    selectedTenant || '', 
    flowId || '',
    enableRealtime
  );
  
  const { data: transitionsData, isLoading: isLoadingTransitions, error: transitionsError } = useFlowTransitions(
    selectedTenant || '', 
    flowId || '',
    enableRealtime
  );

  // API mutations
  const createStepMutation = useCreateFlowStep(selectedTenant || '', flowId || '');
  const updateStepMutation = useUpdateFlowStep(selectedTenant || '', flowId || '');
  const deleteStepMutation = useDeleteFlowStep(selectedTenant || '', flowId || '');
  const createTransitionMutation = useCreateFlowTransition(selectedTenant || '', flowId || '');
  const deleteTransitionMutation = useDeleteFlowTransition(selectedTenant || '', flowId || '');
  const organizeFlowMutation = useOrganizeFlow(selectedTenant || '', flowId || '');

  // Canvas state
  const { canvasState, setCanvasState, zoomIn, zoomOut, resetView, fitToView, centerOnNode, initializeCanvas } = useCanvasState();
  
  // Confirmation dialog for loop prevention
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(true);
  
  // Minimap toggle state - default to false on mobile, true on desktop
  const [showMinimap, setShowMinimap] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1280; // xl breakpoint
    }
    return true; // SSR fallback
  });

  // Track pending position updates for debouncing
  const pendingUpdatesRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const updateTimeoutRef = useRef<number | undefined>(undefined);

  // Helper function to convert API step to internal format
  const convertApiStepToInternal = (apiStep: FlowStepAPI, index: number): FlowStep => {
    // Backend stores center coordinates, convert to top-left for frontend
    let x, y;
    
    if (apiStep.metadata?.x && apiStep.metadata?.y) {
      // Convert from center (backend) to top-left (frontend) coordinates
      const centerX = parseInt(apiStep.metadata.x);
      const centerY = parseInt(apiStep.metadata.y);
      x = centerX - NODE_DIMENSIONS.WIDTH / 2;
      y = centerY - NODE_DIMENSIONS.HEIGHT / 2;
    } else {
      // Fallback to consistent default based on index
      x = GRID_LAYOUT.START_X + (index % 3) * 250;
      y = GRID_LAYOUT.START_Y + Math.floor(index / 3) * GRID_LAYOUT.SPACING_Y;
    }
    
    return {
      id: apiStep.uuid,
      name: apiStep.name,
      x,
      y,
    };
  };

  // Helper function to convert API transition to internal format
  const convertApiTransitionToInternal = (apiTransition: FlowTransitionAPI): FlowTransition => {
    return {
      id: apiTransition.uuid,
      fromStepId: apiTransition.from_step,
      toStepId: apiTransition.to_step,
    };
  };

  // Convert API data to internal format (derived state, no useState)
  const steps = stepsData && Array.isArray(stepsData) 
    ? stepsData.map((step, index) => convertApiStepToInternal(step, index))
    : [];

  const transitions = transitionsData && Array.isArray(transitionsData)
    ? transitionsData.map(convertApiTransitionToInternal)
    : [];

  // Helper functions

  const addNode = async (x: number, y: number) => {
    // Check node limit
    if (steps.length >= MAX_NODES) {
      await confirm({
        title: 'Maximum Nodes Reached',
        description: `You've reached the maximum limit of ${MAX_NODES} nodes per flow. This helps maintain optimal performance and readability.`,
        variant: 'warning',
        confirmText: 'Understood',
        cancelText: undefined
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
    } catch (error) {
      console.error('Failed to create step:', error);
    }
  };


  // Update node name (immediate API call since it's less frequent)
  const updateNodeName = async (nodeId: string, name: string) => {
    try {
      // Save to backend immediately (React Query will handle optimistic updates)
      await updateStepMutation.mutateAsync({
        stepUuid: nodeId,
        stepData: { name },
      });
    } catch (error) {
      console.error('Failed to update step name:', error);
    }
  };

  // Real-time position update for dragging (UI only, no API calls)
  const updateNodePositionRealtime = useCallback((nodeId: string, x: number, y: number) => {
    // Update React Query cache optimistically for immediate UI feedback
    const stepsQueryKey = flowBuilderKeys.steps(selectedTenant || '', flowId || '');
    
    queryClient.setQueryData<FlowStepsListResponse>(stepsQueryKey, (oldData) => {
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
            }
          };
        }
        return step;
      });
    });
  }, [selectedTenant, flowId, queryClient]);


  // Legacy updateNode function for backward compatibility
  const updateNode = (nodeId: string, updates: Partial<FlowStep>) => {
    if (updates.name !== undefined) {
      updateNodeName(nodeId, updates.name);
    }
    if (updates.x !== undefined || updates.y !== undefined) {
      const currentStep = steps.find(s => s.id === nodeId);
      const x = updates.x !== undefined ? updates.x : currentStep?.x || 0;
      const y = updates.y !== undefined ? updates.y : currentStep?.y || 0;
      updateNodePosition(nodeId, x, y);
    }
  };

  const deleteNode = async (nodeId: string) => {
    // Find the step to get its name for the confirmation dialog
    const step = steps.find(s => s.id === nodeId);
    const stepName = step?.name || 'Unknown Step';

    const confirmed = await confirm({
      title: 'Delete Step',
      description: `Are you sure you want to delete "${stepName}"? This step and all its connections will be permanently removed. Any enrollments on this step will be moved by the system.`,
      variant: 'destructive',
      confirmText: 'Delete Step',
      cancelText: 'Cancel'
    });

    if (!confirmed) {
      return; // User cancelled
    }

    try {
      await deleteStepMutation.mutateAsync(nodeId);
    } catch (error) {
      console.error('Failed to delete step:', error);
    }
  };


  const addTransition = async (fromStepId: string, toStepId: string) => {
    // Check if transition already exists
    const exists = transitions.some(t => t.fromStepId === fromStepId && t.toStepId === toStepId);
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
        cancelText: undefined // Hide cancel button for informational dialog
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
        cancelText: undefined // Hide cancel button for informational dialog
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
      console.error('Failed to create transition:', error);
    }
  };

  const deleteTransition = async (transitionId: string) => {
    // Find the transition to get step names for the confirmation dialog
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
      cancelText: 'Cancel'
    });

    if (!confirmed) {
      return; // User cancelled
    }

    try {
      await deleteTransitionMutation.mutateAsync(transitionId);
    } catch (error) {
      console.error('Failed to delete transition:', error);
    }
  };

  const organizeFlow = async () => {
    const confirmed = await confirm({
      title: 'Organize Flow',
      description: 'This will automatically arrange your flow steps in a clean tree layout. Connected steps will be organized hierarchically, and disconnected steps will be moved to the side. This action cannot be undone.',
      variant: 'info',
      confirmText: 'Organize Flow',
      cancelText: 'Cancel'
    });

    if (!confirmed) {
      return; // User cancelled
    }

    try {
      // Analyze the current flow structure
      const connectedSteps: string[] = [];
      const disconnectedSteps: string[] = [];
      
      // Find all steps that are connected (have incoming or outgoing transitions)
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
            // Convert from top-left (frontend) to center (backend) coordinates
            x: step.x + NODE_DIMENSIONS.WIDTH / 2,
            y: step.y + NODE_DIMENSIONS.HEIGHT / 2,
            width: NODE_DIMENSIONS.WIDTH,  // Consistent UI width (144px)
            height: NODE_DIMENSIONS.HEIGHT, // Consistent UI height (96px)
          };
        }),
        disconnected_steps: disconnectedSteps.map(stepId => {
          const step = steps.find(s => s.id === stepId)!;
          return {
            step_uuid: step.id,
            step_name: step.name,
            // Convert from top-left (frontend) to center (backend) coordinates
            x: step.x + NODE_DIMENSIONS.WIDTH / 2,
            y: step.y + NODE_DIMENSIONS.HEIGHT / 2,
            width: NODE_DIMENSIONS.WIDTH,  // Consistent UI width (144px)
            height: NODE_DIMENSIONS.HEIGHT, // Consistent UI height (96px)
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
      
      // The mutation's onSuccess handler will immediately update the cache with response data
      // and then invalidate to ensure consistency with backend
      
      // Fit the view to show the newly organized layout
      handleFitToView();
      
    } catch (error) {
      console.error('Failed to organize flow:', error);
      // Could add user-facing error notification here
    }
  };

  // Debounced function to save position updates to backend
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
      console.error('Failed to save position updates:', error);
    }
  }, [updateStepMutation]);

  // Update node position optimistically (UI only)
  const updateNodePosition = useCallback((nodeId: string, x: number, y: number) => {
    // Update React Query cache optimistically for immediate UI feedback
    const stepsQueryKey = flowBuilderKeys.steps(selectedTenant || '', flowId || '');
    
    queryClient.setQueryData<FlowStepsListResponse>(stepsQueryKey, (oldData) => {
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
            }
          };
        }
        return step;
      });
    });

    // Track for debounced backend update
    pendingUpdatesRef.current.set(nodeId, { x, y });

    // Debounce the API call
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = window.setTimeout(debouncedSavePositions, 500); // 500ms delay
  }, [debouncedSavePositions, selectedTenant, flowId, queryClient]);

  // Finalize position update after dragging ends (triggers API save)
  const finalizeNodePosition = useCallback((nodeId: string, x: number, y: number) => {
    // Track for debounced backend update
    pendingUpdatesRef.current.set(nodeId, { x, y });

    // Debounce the API call
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = window.setTimeout(debouncedSavePositions, 500); // 500ms delay
  }, [debouncedSavePositions]);

  // Force save any pending position updates
  const forceSavePendingUpdates = useCallback(async () => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    await debouncedSavePositions();
  }, [debouncedSavePositions]);

  // Cleanup timeout on unmount and save pending updates
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      // Note: Can't await in cleanup, but React Query will handle the request
      if (pendingUpdatesRef.current.size > 0) {
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

  // Initialize canvas with centered origin when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        initializeCanvas(rect.width, rect.height);
      }
    }
  }, [initializeCanvas]);

  // Track if we've done the initial fit-to-view
  const hasInitialFitRef = useRef(false);

  // Auto fit-to-view when steps data loads for the first time only
  useEffect(() => {
    if (stepsData && steps.length > 0 && canvasRef.current && !hasInitialFitRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          fitToView(steps, rect.width, rect.height);
          hasInitialFitRef.current = true; // Mark as completed
        }, 100);
      }
    }
  }, [stepsData, steps, fitToView]);

  // Flow interactions hook
  const {
    dragState,
    connectionState,
    selectedNodeId,
    editingNodeId,
    hoveredNodeId,
    setSelectedNodeId,
    setEditingNodeId,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleNodeMouseDown,
    handleNodeDoubleClick,
    handleConnectionStart,
    handleConnectionEnd,
    handleNodeMouseEnter,
    handleNodeMouseLeave,
  } = useFlowInteractions({
    steps,
    canvasState,
    canvasRef,
    setCanvasState,
    updateNode,
    updateNodeRealtime: updateNodePositionRealtime,
    finalizeNodePosition,
    addTransition,
  });

  // Toolbar handlers
  const handleCreateNode = async () => {
    // Use a predictable position based on current step count to avoid overlapping
    const stepCount = steps.length;
    const x = GRID_LAYOUT.START_X + (stepCount % GRID_LAYOUT.COLUMNS) * GRID_LAYOUT.SPACING_X;
    const y = GRID_LAYOUT.START_Y + Math.floor(stepCount / GRID_LAYOUT.COLUMNS) * GRID_LAYOUT.SPACING_Y;
    await addNode(x, y);
  };

  const handleDeleteNode = async () => {
    if (selectedNodeId) {
      await deleteNode(selectedNodeId);
      setSelectedNodeId(null);
    }
  };

  const handleFitToView = () => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      fitToView(steps, rect.width, rect.height);
    }
  };

  const handleJumpToNode = (step: FlowStep) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      centerOnNode(step, rect.width, rect.height);
    }
  };







  // Show loading state
  if (isLoadingFlow || isLoadingSteps || isLoadingTransitions) {
    return <FlowLoadingState />;
  }

  // Show error state
  if (flowError || stepsError || transitionsError) {
    const error = flowError || stepsError || transitionsError;
    return <FlowErrorState error={error} />;
  }

  return (
    <div className="fixed inset-0 top-16 bg-background flex flex-col">
      <FlowBuilderToolbar
        flowName={flowData?.name || 'Unknown Flow'}
        steps={steps}
        selectedNodeId={selectedNodeId}
        enableRealtime={enableRealtime}
        showMinimap={showMinimap}
        onCreateNode={handleCreateNode}
        onDeleteNode={handleDeleteNode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onFitToView={handleFitToView}
        onJumpToNode={handleJumpToNode}
        onToggleRealtime={setEnableRealtime}
        onToggleMinimap={setShowMinimap}
        onOrganizeFlow={organizeFlow}
        isOrganizing={organizeFlowMutation.isPending}
      />

      {/* Canvas */}
      <FlowCanvas
        steps={steps}
        transitions={transitions}
        dragState={dragState}
        connectionState={connectionState}
        canvasState={canvasState}
        selectedNodeId={selectedNodeId}
        editingNodeId={editingNodeId}
        hoveredNodeId={hoveredNodeId}
        showMinimap={showMinimap}
        canvasRef={canvasRef}
        onCanvasMouseDown={handleCanvasMouseDown}
        onCanvasMouseMove={handleCanvasMouseMove}
        onCanvasMouseUp={handleCanvasMouseUp}
        onNodeMouseDown={handleNodeMouseDown}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onConnectionEnd={handleConnectionEnd}
        onConnectionStart={handleConnectionStart}
        onNodeNameChange={(nodeId, name) => updateNode(nodeId, { name })}
        onEditingEnd={() => setEditingNodeId(null)}
        onDeleteTransition={deleteTransition}
        onFitToView={fitToView}
        onSetCanvasState={setCanvasState}
      />

      {/* Tutorial Overlay */}
      <FlowTutorial
        isVisible={showTutorial}
        connectionCount={transitions.length}
        onClose={() => setShowTutorial(false)}
      />

      {/* Loop Prevention Dialog */}
      <ConfirmationDialog />
    </div>
  );
};

export default FlowBuilder;