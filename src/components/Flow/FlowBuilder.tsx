import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
  useDeleteFlowTransition
} from '@/hooks/useFlowBuilderQuery';
import { FlowStepAPI, FlowTransitionAPI } from '@/types/flowBuilder';

const FlowBuilder = () => {
  const { flowId } = useParams<{ flowId: string }>();
  const { selectedTenant } = useTenantStore();
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

  // Canvas state
  const { canvasState, setCanvasState, zoomIn, zoomOut, resetView, fitToView, centerOnNode } = useCanvasState();
  
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

  // Convert API data to internal format
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [transitions, setTransitions] = useState<FlowTransition[]>([]);
  
  // Track pending position updates for debouncing
  const pendingUpdatesRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const updateTimeoutRef = useRef<number | undefined>(undefined);

  // Helper function to convert API step to internal format
  const convertApiStepToInternal = (apiStep: FlowStepAPI): FlowStep => {
    // Try to get position from metadata, fallback to default
    const x = apiStep.metadata?.x ? parseInt(apiStep.metadata.x) : Math.random() * 400 + 100;
    const y = apiStep.metadata?.y ? parseInt(apiStep.metadata.y) : Math.random() * 300 + 100;
    
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

  // Update internal state when API data changes
  useEffect(() => {
    if (stepsData && Array.isArray(stepsData)) {
      const convertedSteps = stepsData.map(convertApiStepToInternal);
      setSteps(convertedSteps);
    }
  }, [stepsData]);

  useEffect(() => {
    if (transitionsData && Array.isArray(transitionsData)) {
      const convertedTransitions = transitionsData.map(convertApiTransitionToInternal);
      setTransitions(convertedTransitions);
    }
  }, [transitionsData]);

  // Helper functions

  const addNode = async (x: number, y: number) => {
    // Check node limit
    const MAX_NODES = 50; // Reasonable limit for performance
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
      // Update UI optimistically
      setSteps(prev => prev.map(step => 
        step.id === nodeId ? { ...step, name } : step
      ));

      // Save to backend immediately
      await updateStepMutation.mutateAsync({
        stepUuid: nodeId,
        stepData: { name },
      });
    } catch (error) {
      console.error('Failed to update step name:', error);
      // Revert optimistic update on error
      setSteps(prev => prev.map(step => 
        step.id === nodeId ? { ...step, name: step.name } : step
      ));
    }
  };

  // Real-time position update for dragging (UI only, no API calls)
  const updateNodePositionRealtime = useCallback((nodeId: string, x: number, y: number) => {
    // Only update UI, don't trigger API calls or debouncing
    setSteps(prev => prev.map(step => 
      step.id === nodeId ? { ...step, x, y } : step
    ));
  }, []);


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
    try {
      await deleteTransitionMutation.mutateAsync(transitionId);
    } catch (error) {
      console.error('Failed to delete transition:', error);
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
                x: position.x.toString(),
                y: position.y.toString(),
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
    // Update UI immediately
    setSteps(prev => prev.map(step => 
      step.id === nodeId ? { ...step, x, y } : step
    ));

    // Track for debounced backend update
    pendingUpdatesRef.current.set(nodeId, { x, y });

    // Debounce the API call
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = window.setTimeout(debouncedSavePositions, 500); // 500ms delay
  }, [debouncedSavePositions]);

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
    handleWheelReact,
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
    await addNode(Math.random() * 400 + 200, Math.random() * 300 + 150);
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
        onCanvasWheel={handleWheelReact}
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