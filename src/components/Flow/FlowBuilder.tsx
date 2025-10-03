import { useState, useRef, useEffect } from 'react';
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
  
  // Fetch flow data
  const { data: flowData, isLoading: isLoadingFlow, error: flowError } = useFlow(
    selectedTenant || '', 
    flowId || ''
  );

  // Fetch flow steps and transitions from backend
  const { data: stepsData, isLoading: isLoadingSteps, error: stepsError } = useFlowSteps(
    selectedTenant || '', 
    flowId || ''
  );
  
  const { data: transitionsData, isLoading: isLoadingTransitions, error: transitionsError } = useFlowTransitions(
    selectedTenant || '', 
    flowId || ''
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

  // Convert API data to internal format
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [transitions, setTransitions] = useState<FlowTransition[]>([]);

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
    console.log('Steps data changed:', stepsData);
    if (stepsData && Array.isArray(stepsData)) {
      const convertedSteps = stepsData.map(convertApiStepToInternal);
      console.log('Converted steps:', convertedSteps);
      setSteps(convertedSteps);
    }
  }, [stepsData]);

  useEffect(() => {
    console.log('Transitions data changed:', transitionsData);
    if (transitionsData && Array.isArray(transitionsData)) {
      const convertedTransitions = transitionsData.map(convertApiTransitionToInternal);
      console.log('Converted transitions:', convertedTransitions);
      setTransitions(convertedTransitions);
    }
  }, [transitionsData]);

  // Helper functions

  const addNode = async (x: number, y: number) => {
    try {
      console.log('Creating node at:', { x, y });
      const result = await createStepMutation.mutateAsync({
        name: 'New Step',
        metadata: {
          x: x.toString(),
          y: y.toString(),
        },
      });
      console.log('Node created successfully:', result);
    } catch (error) {
      console.error('Failed to create step:', error);
    }
  };

  const updateNode = async (nodeId: string, updates: Partial<FlowStep>) => {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) {
        updateData.name = updates.name;
      }
      
      if (updates.x !== undefined || updates.y !== undefined) {
        // Get current step to preserve existing metadata
        const currentStep = steps.find(s => s.id === nodeId);
        updateData.metadata = {
          ...currentStep?.x !== undefined ? { x: currentStep.x.toString() } : {},
          ...currentStep?.y !== undefined ? { y: currentStep.y.toString() } : {},
          ...(updates.x !== undefined ? { x: updates.x.toString() } : {}),
          ...(updates.y !== undefined ? { y: updates.y.toString() } : {}),
        };
      }
      
      await updateStepMutation.mutateAsync({
        stepUuid: nodeId,
        stepData: updateData,
      });
    } catch (error) {
      console.error('Failed to update step:', error);
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
    transitions,
    canvasState,
    canvasRef,
    setCanvasState,
    updateNode,
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

  // Debug logging
  console.log('Rendering FlowBuilder with steps:', steps, 'transitions:', transitions);

  return (
    <div className="fixed inset-0 top-16 bg-background flex flex-col">
      <FlowBuilderToolbar
        flowName={flowData?.name || 'Unknown Flow'}
        steps={steps}
        selectedNodeId={selectedNodeId}
        onCreateNode={handleCreateNode}
        onDeleteNode={handleDeleteNode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onFitToView={handleFitToView}
        onJumpToNode={handleJumpToNode}
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