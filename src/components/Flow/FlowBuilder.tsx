import { useState, useRef } from 'react';
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

const FlowBuilder = () => {
  const { flowId } = useParams<{ flowId: string }>();
  const { selectedTenant } = useTenantStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Fetch flow data
  const { data: flowData, isLoading: isLoadingFlow, error: flowError } = useFlow(
    selectedTenant || '', 
    flowId || ''
  );

  // Canvas state
  const { canvasState, setCanvasState, zoomIn, zoomOut, resetView, fitToView, centerOnNode } = useCanvasState();

  // Flow steps and transitions (mutable state)
  const [steps, setSteps] = useState<FlowStep[]>([
    { id: '1', name: 'Start', x: 100, y: 100 },
    { id: '2', name: 'Process', x: 300, y: 200 },
    { id: '3', name: 'End', x: 500, y: 100 },
  ]);

  const [transitions, setTransitions] = useState<FlowTransition[]>([
    { id: 't1', fromStepId: '1', toStepId: '2' },
    { id: 't2', fromStepId: '2', toStepId: '3' },
  ]);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(true);

  // Helper functions

  const addNode = (x: number, y: number) => {
    const newNode: FlowStep = {
      id: generateId(),
      name: 'New Step',
      x,
      y,
    };
    setSteps(prev => [...prev, newNode]);
  };

  const updateNode = (nodeId: string, updates: Partial<FlowStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === nodeId ? { ...step, ...updates } : step
    ));
  };

  const deleteNode = (nodeId: string) => {
    setSteps(prev => prev.filter(step => step.id !== nodeId));
    setTransitions(prev => prev.filter(t => t.fromStepId !== nodeId && t.toStepId !== nodeId));
  };


  const addTransition = (fromStepId: string, toStepId: string) => {
    // Check if transition already exists
    const exists = transitions.some(t => t.fromStepId === fromStepId && t.toStepId === toStepId);
    if (exists) return;
    
    // Check for loops
    if (wouldCreateLoop(fromStepId, toStepId, transitions)) {
      alert('Cannot create connection: would create a loop');
      return;
    }
    
    const newTransition: FlowTransition = {
      id: generateId(),
      fromStepId,
      toStepId,
    };
    setTransitions(prev => [...prev, newTransition]);
  };

  const deleteTransition = (transitionId: string) => {
    setTransitions(prev => prev.filter(t => t.id !== transitionId));
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
  const handleCreateNode = () => {
    addNode(Math.random() * 400 + 200, Math.random() * 300 + 150);
  };

  const handleDeleteNode = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
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
  if (isLoadingFlow) {
    return <FlowLoadingState />;
  }

  // Show error state
  if (flowError) {
    return <FlowErrorState error={flowError} />;
  }

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
    </div>
  );
};

export default FlowBuilder;