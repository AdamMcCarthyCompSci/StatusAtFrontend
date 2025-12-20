import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useFlow, useUpdateFlow } from '@/hooks/useFlowQuery';
import { useTenantStore } from '@/stores/useTenantStore';
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
} from '@/hooks/useFlowBuilderQuery';

import { FlowStep } from './types';
import { useCanvasState } from './hooks/useCanvasState';
import { useFlowInteractions } from './hooks/useFlowInteractions';
import { useTouchInteractions } from './hooks/useTouchInteractions';
import { FlowBuilderToolbar } from './components/FlowBuilderToolbar';
import { FlowCanvas } from './components/FlowCanvas';
import { FlowTutorial } from './components/FlowTutorial';
import { FlowLoadingState } from './components/FlowLoadingState';
import { FlowErrorState } from './components/FlowErrorState';
import { NodePropertiesModal } from './components/NodePropertiesModal';
import { GRID_LAYOUT } from './constants';
import {
  convertApiStepToInternal,
  convertApiTransitionToInternal,
} from './FlowBuilder/dataConverters';
import { createFlowOperations } from './FlowBuilder/operations';
import { usePositionManager } from './FlowBuilder/positionManager';

const FlowBuilder = () => {
  const { t } = useTranslation();
  const { flowId } = useParams<{ flowId: string }>();
  const { selectedTenant } = useTenantStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Real-time collaboration toggle
  const [enableRealtime, setEnableRealtime] = useState(false);

  // Fetch flow data
  const {
    data: flowData,
    isLoading: isLoadingFlow,
    error: flowError,
  } = useFlow(selectedTenant || '', flowId || '');

  // Fetch flow steps and transitions from backend
  const {
    data: stepsData,
    isLoading: isLoadingSteps,
    error: stepsError,
  } = useFlowSteps(selectedTenant || '', flowId || '', enableRealtime);

  const {
    data: transitionsData,
    isLoading: isLoadingTransitions,
    error: transitionsError,
  } = useFlowTransitions(selectedTenant || '', flowId || '', enableRealtime);

  // API mutations
  const createStepMutation = useCreateFlowStep(
    selectedTenant || '',
    flowId || ''
  );
  const updateStepMutation = useUpdateFlowStep(
    selectedTenant || '',
    flowId || ''
  );
  const deleteStepMutation = useDeleteFlowStep(
    selectedTenant || '',
    flowId || ''
  );
  const createTransitionMutation = useCreateFlowTransition(
    selectedTenant || '',
    flowId || ''
  );
  const deleteTransitionMutation = useDeleteFlowTransition(
    selectedTenant || '',
    flowId || ''
  );
  const organizeFlowMutation = useOrganizeFlow(
    selectedTenant || '',
    flowId || ''
  );
  const updateFlowMutation = useUpdateFlow();

  // Canvas state
  const {
    canvasState,
    setCanvasState,
    zoomIn,
    zoomOut,
    resetView,
    fitToView,
    centerOnNode,
    initializeCanvas,
  } = useCanvasState();

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

  // Node properties modal state
  const [isNodePropertiesOpen, setIsNodePropertiesOpen] = useState(false);
  const [selectedNodeForEdit, setSelectedNodeForEdit] =
    useState<FlowStep | null>(null);

  // Position manager hook for debounced position updates
  const {
    updateNodePositionRealtime,
    updateNodePosition,
    finalizeNodePosition,
  } = usePositionManager({
    selectedTenant: selectedTenant || '',
    flowId: flowId || '',
    enableRealtime,
    updateStepMutation,
  });

  // Convert API data to internal format (memoized to prevent unnecessary rerenders)
  const steps = useMemo(
    () =>
      stepsData && Array.isArray(stepsData)
        ? stepsData.map((step, index) => convertApiStepToInternal(step, index))
        : [],
    [stepsData]
  );

  const transitions = useMemo(
    () =>
      transitionsData && Array.isArray(transitionsData)
        ? transitionsData.map(convertApiTransitionToInternal)
        : [],
    [transitionsData]
  );

  // CRUD operations
  const operations = createFlowOperations({
    steps,
    transitions,
    createStepMutation,
    updateStepMutation,
    deleteStepMutation,
    createTransitionMutation,
    deleteTransitionMutation,
    organizeFlowMutation,
    confirm,
  });

  // Legacy updateNode function for backward compatibility with hooks
  const updateNode = (nodeId: string, updates: Partial<FlowStep>) => {
    if (updates.name !== undefined) {
      operations.updateNodeName(nodeId, updates.name);
    }
    if (updates.x !== undefined || updates.y !== undefined) {
      const currentStep = steps.find(s => s.id === nodeId);
      const x = updates.x !== undefined ? updates.x : currentStep?.x || 0;
      const y = updates.y !== undefined ? updates.y : currentStep?.y || 0;
      updateNodePosition(nodeId, x, y);
    }
  };

  // Node properties modal handlers
  const handleOpenNodeProperties = (nodeId: string) => {
    const node = steps.find(s => s.id === nodeId);
    if (node) {
      setSelectedNodeForEdit(node);
      setIsNodePropertiesOpen(true);
    }
  };

  const handleCloseNodeProperties = () => {
    setIsNodePropertiesOpen(false);
    setSelectedNodeForEdit(null);
  };

  const handleSaveNodeProperties = (
    nodeId: string,
    updates: Partial<FlowStep>
  ) => {
    const stepUpdates: { name?: string; description?: string } = {};
    if (updates.name !== undefined) {
      stepUpdates.name = updates.name;
    }
    if (updates.description !== undefined) {
      stepUpdates.description = updates.description;
    }
    if (Object.keys(stepUpdates).length > 0) {
      operations.updateNodeProperties(nodeId, stepUpdates);
    }
  };

  // Initialize canvas with centered origin when component mounts
  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 64; // top-16 = 64px
    initializeCanvas(viewportWidth, viewportHeight);
  }, [initializeCanvas]);

  // Track if we've done the initial fit-to-view
  const hasInitialFitRef = useRef(false);

  // Track if we need to fit-to-view after organize completes
  const shouldFitAfterOrganizeRef = useRef(false);

  // Calculate and apply initial fit-to-view based on step data
  useEffect(() => {
    if (stepsData && steps.length > 0 && !hasInitialFitRef.current) {
      // Calculate viewport dimensions - canvas is fixed inset-0 top-16
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 64; // top-16 = 64px

      if (viewportWidth > 0 && viewportHeight > 0) {
        fitToView(steps, viewportWidth, viewportHeight);
        hasInitialFitRef.current = true;
      }
    }
  }, [stepsData, steps, fitToView]);

  // Fit to view after organize completes and steps are updated
  useEffect(() => {
    if (
      shouldFitAfterOrganizeRef.current &&
      !organizeFlowMutation.isPending &&
      steps.length > 0
    ) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 64; // top-16 = 64px

      fitToView(steps, viewportWidth, viewportHeight);
      shouldFitAfterOrganizeRef.current = false;
    }
  }, [organizeFlowMutation.isPending, steps, fitToView]);

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
    handleNodeTouchStart,
    handleNodeTouchMove,
    handleNodeTouchEnd,
  } = useFlowInteractions({
    steps,
    canvasState,
    canvasRef,
    setCanvasState,
    updateNode,
    updateNodeRealtime: updateNodePositionRealtime,
    finalizeNodePosition,
    addTransition: operations.addTransition,
    onOpenNodeProperties: handleOpenNodeProperties,
  });

  // Touch interactions hook
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  } = useTouchInteractions({
    canvasState,
    setCanvasState,
    canvasRef,
  });

  // Toolbar handlers
  const handleCreateNode = async () => {
    // Use a predictable position based on current step count to avoid overlapping
    const stepCount = steps.length;
    const x =
      GRID_LAYOUT.START_X +
      (stepCount % GRID_LAYOUT.COLUMNS) * GRID_LAYOUT.SPACING_X;
    const y =
      GRID_LAYOUT.START_Y +
      Math.floor(stepCount / GRID_LAYOUT.COLUMNS) * GRID_LAYOUT.SPACING_Y;
    await operations.addNode(x, y);
  };

  const handleDeleteNode = async () => {
    if (selectedNodeId) {
      await operations.deleteNode(selectedNodeId);
      setSelectedNodeId(null);
    }
  };

  const handleFitToView = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 64; // top-16 = 64px
    fitToView(steps, viewportWidth, viewportHeight);
  };

  const handleJumpToNode = (step: FlowStep) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 64; // top-16 = 64px
    centerOnNode(step, viewportWidth, viewportHeight);
  };

  const handleUpdateFlowName = async (newName: string) => {
    if (!selectedTenant || !flowId) return;

    await updateFlowMutation.mutateAsync({
      tenantUuid: selectedTenant,
      flowUuid: flowId,
      flowData: { name: newName },
    });
  };

  // Show loading state while fetching data
  if (isLoadingFlow || isLoadingSteps || isLoadingTransitions) {
    return <FlowLoadingState />;
  }

  // Show error state
  if (flowError || stepsError || transitionsError) {
    const error = flowError || stepsError || transitionsError;
    return <FlowErrorState error={error} />;
  }

  return (
    <div className="fixed inset-0 top-16 flex flex-col bg-background">
      <FlowBuilderToolbar
        flowName={flowData?.name || t('flows.unknownFlow')}
        steps={steps}
        selectedNodeId={selectedNodeId}
        enableRealtime={enableRealtime}
        showMinimap={showMinimap}
        onCreateNode={handleCreateNode}
        onDeleteNode={handleDeleteNode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToView={handleFitToView}
        onJumpToNode={handleJumpToNode}
        onToggleRealtime={setEnableRealtime}
        onToggleMinimap={setShowMinimap}
        onOrganizeFlow={async () => {
          shouldFitAfterOrganizeRef.current = true;
          await operations.organizeFlow();
        }}
        onUpdateFlowName={handleUpdateFlowName}
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
        onCanvasTouchStart={handleTouchStart}
        onCanvasTouchMove={handleTouchMove}
        onCanvasTouchEnd={handleTouchEnd}
        onCanvasTouchCancel={handleTouchCancel}
        onNodeMouseDown={handleNodeMouseDown}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onConnectionEnd={handleConnectionEnd}
        onConnectionStart={handleConnectionStart}
        onNodeNameChange={(nodeId, name) => updateNode(nodeId, { name })}
        onEditingEnd={() => setEditingNodeId(null)}
        onDeleteTransition={operations.deleteTransition}
        onFitToView={fitToView}
        onSetCanvasState={setCanvasState}
        onNodeTouchStart={handleNodeTouchStart}
        onNodeTouchMove={handleNodeTouchMove}
        onNodeTouchEnd={handleNodeTouchEnd}
      />

      {/* Tutorial Overlay */}
      <FlowTutorial
        isVisible={showTutorial}
        connectionCount={transitions.length}
        onClose={() => setShowTutorial(false)}
      />

      {/* Loop Prevention Dialog */}
      <ConfirmationDialog />

      {/* Node Properties Modal */}
      <NodePropertiesModal
        isOpen={isNodePropertiesOpen}
        node={selectedNodeForEdit}
        onClose={handleCloseNodeProperties}
        onSave={handleSaveNodeProperties}
      />
    </div>
  );
};

export default FlowBuilder;
