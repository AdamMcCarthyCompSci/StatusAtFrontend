import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFlow } from '@/hooks/useFlowQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { FlowStep, FlowTransition, DragState, ConnectionState } from './types';
import { generateId, wouldCreateLoop, getNodeConnectionPoints } from './utils';
import { useCanvasState } from './hooks/useCanvasState';
import { FlowBuilderToolbar } from './components/FlowBuilderToolbar';
import { FlowMinimap } from './components/FlowMinimap';
import { FlowNode } from './components/FlowNode';
import { FlowConnections } from './components/FlowConnections';
import { FlowTutorial } from './components/FlowTutorial';

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

  // Drag state
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
  });

  // Connection state
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: false,
  });

  // Node selection and editing
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

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

  // Toolbar handlers
  const handleCreateNode = () => {
    addNode(Math.random() * 400 + 200, Math.random() * 300 + 150);
  };

  const handleDeleteNode = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
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
    setSelectedNodeId(null);
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

  // Coordinate conversion
  const screenToWorld = (screenX: number, screenY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: screenX, y: screenY };
    
    const x = (screenX - rect.left - canvasState.panX) / canvasState.zoom;
    const y = (screenY - rect.top - canvasState.panY) / canvasState.zoom;
    return { x, y };
  };

  // Event handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Deselect node when clicking on empty canvas
      setSelectedNodeId(null);
      setDragState({
        isDragging: true,
        dragType: 'canvas',
        startPos: { x: e.clientX, y: e.clientY },
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (dragState.isDragging) {
      if (dragState.dragType === 'canvas' && dragState.startPos) {
        const deltaX = e.clientX - dragState.startPos.x;
        const deltaY = e.clientY - dragState.startPos.y;
        
        setCanvasState(prev => ({
          ...prev,
          panX: prev.panX + deltaX,
          panY: prev.panY + deltaY,
        }));
        
        setDragState(prev => ({
          ...prev,
          startPos: { x: e.clientX, y: e.clientY },
        }));
      } else if (dragState.dragType === 'node' && dragState.draggedNodeId && dragState.dragOffset) {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        updateNode(dragState.draggedNodeId, {
          x: worldPos.x - dragState.dragOffset.x,
          y: worldPos.y - dragState.dragOffset.y,
        });
      }
    }

    // Update temporary connection
    if (connectionState.isConnecting && connectionState.tempConnection) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      setConnectionState(prev => ({
        ...prev,
        tempConnection: prev.tempConnection ? {
          ...prev.tempConnection,
          toX: worldPos.x,
          toY: worldPos.y,
        } : undefined,
      }));
    }
  };

  const handleCanvasMouseUp = () => {
    setDragState({
      isDragging: false,
      dragType: null,
    });
    
    if (connectionState.isConnecting) {
      setConnectionState({
        isConnecting: false,
      });
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = steps.find(s => s.id === nodeId);
    if (!node) return;

    const worldPos = screenToWorld(e.clientX, e.clientY);
    const dragOffset = {
      x: worldPos.x - node.x,
      y: worldPos.y - node.y,
    };

    setDragState({
      isDragging: true,
      dragType: 'node',
      draggedNodeId: nodeId,
      startPos: { x: e.clientX, y: e.clientY },
      dragOffset,
    });
    setSelectedNodeId(nodeId);
  };

  const handleNodeDoubleClick = (nodeId: string) => {
    setEditingNodeId(nodeId);
  };

  const handleConnectionStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = steps.find(s => s.id === nodeId);
    if (!node) return;

    const worldPos = screenToWorld(e.clientX, e.clientY);
    const connectionPoints = getNodeConnectionPoints(node);
    
    // Find the closest connection point to where the user clicked
    let closestPoint = connectionPoints.right;
    let minDistance = Infinity;
    
    Object.values(connectionPoints).forEach(point => {
      const distance = Math.abs(point.x - worldPos.x) + Math.abs(point.y - worldPos.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });
    
    setConnectionState({
      isConnecting: true,
      fromNodeId: nodeId,
      fromHandle: 'output',
      tempConnection: {
        fromX: closestPoint.x,
        fromY: closestPoint.y,
        toX: worldPos.x,
        toY: worldPos.y,
      },
    });
  };

  const handleConnectionEnd = (nodeId: string) => {
    if (connectionState.isConnecting && connectionState.fromNodeId && connectionState.fromNodeId !== nodeId) {
      addTransition(connectionState.fromNodeId, nodeId);
    }
    setConnectionState({
      isConnecting: false,
    });
    setHoveredNodeId(null);
  };

  const handleNodeMouseEnter = (nodeId: string) => {
    if (connectionState.isConnecting && connectionState.fromNodeId !== nodeId) {
      setHoveredNodeId(nodeId);
    }
  };

  const handleNodeMouseLeave = () => {
    if (connectionState.isConnecting) {
      setHoveredNodeId(null);
    }
  };

  // Add wheel event listener with passive: false to allow preventDefault
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setCanvasState(prev => ({
        ...prev,
        zoom: Math.max(0.1, Math.min(3, prev.zoom * delta)),
      }));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [setCanvasState]);





  // Show loading state
  if (isLoadingFlow) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading flow...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (flowError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to Load Flow</h1>
          <p className="text-muted-foreground mb-4">
            {flowError instanceof Error ? flowError.message : 'An error occurred while loading the flow.'}
          </p>
          <Button asChild>
            <Link to="/flows">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Flows
            </Link>
          </Button>
        </div>
      </div>
    );
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
        <div className="flex-1 relative overflow-hidden">
        {/* Minimap - Fixed position outside transformed canvas */}
        <FlowMinimap
          steps={steps}
          canvasRef={canvasRef}
          canvasState={canvasState}
          onFitToView={fitToView}
          onSetCanvasState={setCanvasState}
        />
        <div
          ref={canvasRef}
          className={`w-full h-full relative ${
            dragState.isDragging && dragState.dragType === 'canvas' 
              ? 'cursor-grabbing' 
              : 'cursor-grab'
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${20 * canvasState.zoom}px ${20 * canvasState.zoom}px`,
            backgroundPosition: `${canvasState.panX}px ${canvasState.panY}px`,
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
        >
          {/* SVG for connections */}
          <FlowConnections
            steps={steps}
            transitions={transitions}
            connectionState={connectionState}
            canvasState={canvasState}
            onDeleteTransition={deleteTransition}
          />

          {/* Nodes */}
          <div
            className="absolute"
            style={{
              transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {steps.map((step) => {
              const isSelected = selectedNodeId === step.id;
              const isHovered = hoveredNodeId === step.id;
              const isConnectionTarget = connectionState.isConnecting && connectionState.fromNodeId !== step.id;
              const isDragging = dragState.isDragging && dragState.draggedNodeId === step.id;
              const isEditing = editingNodeId === step.id;
              
              return (
                <FlowNode
                  key={step.id}
                  step={step}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  isConnectionTarget={isConnectionTarget}
                  isDragging={isDragging}
                  isEditing={isEditing}
                  onMouseDown={handleNodeMouseDown}
                  onDoubleClick={handleNodeDoubleClick}
                  onMouseEnter={handleNodeMouseEnter}
                  onMouseLeave={handleNodeMouseLeave}
                  onMouseUp={handleConnectionEnd}
                  onConnectionStart={handleConnectionStart}
                  onNameChange={(nodeId, name) => updateNode(nodeId, { name })}
                  onEditingEnd={() => setEditingNodeId(null)}
                  connectionState={connectionState}
                />
              );
            })}
          </div>
        </div>

        {/* Tutorial Overlay */}
        <FlowTutorial
          isVisible={showTutorial}
          connectionCount={transitions.length}
          onClose={() => setShowTutorial(false)}
        />
      </div>
    </div>
  );
};

export default FlowBuilder;