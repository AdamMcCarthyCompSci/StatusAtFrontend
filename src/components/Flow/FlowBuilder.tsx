import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFlow } from '@/hooks/useFlowQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { FlowStep, FlowTransition, DragState, ConnectionState } from './types';
import { generateId, wouldCreateLoop, getNodeConnectionPoints, findBestConnectionPoints } from './utils';
import { generateOrthogonalPath, convertPathToScreen } from './pathUtils';
import { useCanvasState } from './hooks/useCanvasState';
import { FlowBuilderToolbar } from './components/FlowBuilderToolbar';
import { FlowMinimap } from './components/FlowMinimap';

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
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: '100%',
              height: '100%',
              zIndex: 5,
            }}
          >
            <defs>
              {/* Right-pointing arrow */}
              <marker
                id="arrowhead-right"
                markerWidth="10"
                markerHeight="10"
                refX="7"
                refY="3.5"
                orient="0"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3b82f6"
                />
              </marker>
              
              {/* Left-pointing arrow */}
              <marker
                id="arrowhead-left"
                markerWidth="10"
                markerHeight="10"
                refX="7"
                refY="3.5"
                orient="180"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3b82f6"
                />
              </marker>
              
              {/* Down-pointing arrow */}
              <marker
                id="arrowhead-down"
                markerWidth="10"
                markerHeight="10"
                refX="7"
                refY="3.5"
                orient="90"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3b82f6"
                />
              </marker>
              
              {/* Up-pointing arrow */}
              <marker
                id="arrowhead-up"
                markerWidth="10"
                markerHeight="10"
                refX="7"
                refY="3.5"
                orient="270"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3b82f6"
                />
              </marker>
              
              {/* Temporary arrow (auto-orient) */}
              <marker
                id="arrowhead-temp"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3b82f6"
                />
              </marker>
            </defs>

            {/* Existing connections */}
            {transitions.map((transition) => {
              const fromStep = steps.find(s => s.id === transition.fromStepId);
              const toStep = steps.find(s => s.id === transition.toStepId);
              
              if (!fromStep || !toStep) return null;

              // Find the best connection points to determine arrow direction
              const connection = findBestConnectionPoints(fromStep, toStep);
              const pathData = generateOrthogonalPath(transition.fromStepId, transition.toStepId, steps);
              const screenPath = convertPathToScreen(pathData, canvasState);
              
              // Determine which arrow to use based on the target connection side
              // Arrow should point in the direction the connection is coming FROM
              let arrowId = 'arrowhead-right'; // default
              switch (connection.toSide) {
                case 'top':
                  arrowId = 'arrowhead-down'; // Coming from above, so arrow points down
                  break;
                case 'right':
                  arrowId = 'arrowhead-left'; // Coming from left, so arrow points left
                  break;
                case 'bottom':
                  arrowId = 'arrowhead-up'; // Coming from below, so arrow points up
                  break;
                case 'left':
                  arrowId = 'arrowhead-right'; // Coming from right, so arrow points right
                  break;
              }

              return (
                <g key={transition.id}>
                  {/* Main connection path */}
                  <path
                    d={screenPath}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    markerEnd={`url(#${arrowId})`}
                  />
                  {/* Invisible clickable area for deletion */}
                  <path
                    d={screenPath}
                    stroke="transparent"
                    strokeWidth="12"
                    fill="none"
                    className="cursor-pointer pointer-events-auto"
                    onClick={() => deleteTransition(transition.id)}
                  />
                </g>
              );
            })}

            {/* Temporary connection during dragging */}
            {connectionState.tempConnection && connectionState.fromNodeId && (() => {
              const fromNode = steps.find(s => s.id === connectionState.fromNodeId);
              if (!fromNode) return null;
              
              // For temporary connections, use a simple path from the best connection point
              const fromPoints = getNodeConnectionPoints(fromNode);
              const tempX = connectionState.tempConnection.toX;
              const tempY = connectionState.tempConnection.toY;
              
              // Choose the best connection point based on direction to cursor
              let bestPoint = fromPoints.right;
              let minDistance = Infinity;
              
              Object.values(fromPoints).forEach(point => {
                const distance = Math.abs(point.x - tempX) + Math.abs(point.y - tempY);
                if (distance < minDistance) {
                  minDistance = distance;
                  bestPoint = point;
                }
              });
              
              const pathData = `M ${bestPoint.x} ${bestPoint.y} L ${tempX} ${tempY}`;
              
              return (
                <path
                  d={convertPathToScreen(pathData, canvasState)}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  fill="none"
                  markerEnd="url(#arrowhead-temp)"
                />
              );
            })()}
          </svg>

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
              
              return (
                <div
                  key={step.id}
                  className={`absolute w-32 h-20 rounded-lg shadow-lg cursor-pointer select-none ${
                    // Disable transitions during dragging for performance
                    !isDragging ? 'transition-all duration-200' : ''
                  } ${
                    isSelected 
                      ? 'bg-blue-600 border-4 border-blue-700 ring-4 ring-blue-300 shadow-xl scale-105' 
                      : isHovered && isConnectionTarget
                      ? 'bg-green-500 border-4 border-green-600 ring-4 ring-green-300 shadow-xl'
                      : isConnectionTarget
                      ? 'bg-blue-500 border-2 border-blue-400 ring-2 ring-blue-200'
                      : 'bg-blue-500 border-2 border-blue-400'
                  }`}
                  style={{
                    left: step.x,
                    top: step.y,
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, step.id)}
                  onDoubleClick={() => handleNodeDoubleClick(step.id)}
                  onMouseEnter={() => handleNodeMouseEnter(step.id)}
                  onMouseLeave={handleNodeMouseLeave}
                  onMouseUp={() => isConnectionTarget && handleConnectionEnd(step.id)}
                >
                  {/* Connection handles - visible only when not connecting or when this is the source */}
                  {(!connectionState.isConnecting || connectionState.fromNodeId === step.id) && (
                    <>
                      {/* Top handle */}
                      <div
                        className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full shadow-sm left-1/2 -top-1.5 transform -translate-x-1/2 cursor-crosshair hover:w-4 hover:h-4 hover:-top-2 hover:left-1/2 hover:-translate-x-1/2"
                        onMouseDown={(e) => handleConnectionStart(e, step.id)}
                      />
                      
                      {/* Right handle */}
                      <div
                        className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full shadow-sm -right-1.5 top-1/2 transform -translate-y-1/2 cursor-crosshair hover:w-4 hover:h-4 hover:-right-2 hover:top-1/2 hover:-translate-y-1/2"
                        onMouseDown={(e) => handleConnectionStart(e, step.id)}
                      />
                      
                      {/* Bottom handle */}
                      <div
                        className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full shadow-sm left-1/2 -bottom-1.5 transform -translate-x-1/2 cursor-crosshair hover:w-4 hover:h-4 hover:-bottom-2 hover:left-1/2 hover:-translate-x-1/2"
                        onMouseDown={(e) => handleConnectionStart(e, step.id)}
                      />
                      
                      {/* Left handle */}
                      <div
                        className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full shadow-sm -left-1.5 top-1/2 transform -translate-y-1/2 cursor-crosshair hover:w-4 hover:h-4 hover:-left-2 hover:top-1/2 hover:-translate-y-1/2"
                        onMouseDown={(e) => handleConnectionStart(e, step.id)}
                      />
                    </>
                  )}
                  
                  {/* Node content */}
                  <div className="p-2 h-full flex items-center justify-center text-white text-sm font-medium pointer-events-none">
                    {editingNodeId === step.id ? (
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => updateNode(step.id, { name: e.target.value })}
                        onBlur={() => setEditingNodeId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingNodeId(null);
                        }}
                        className="bg-transparent border-none outline-none text-center w-full text-white placeholder-white/70 pointer-events-auto"
                        autoFocus
                      />
                    ) : (
                      step.name
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Flow Builder Tutorial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><strong>Creating Connections:</strong> Drag from the blue circle on the right of a node to the blue circle on the left of another node.</p>
                  <p><strong>Deleting Connections:</strong> Click on any connection line to delete it.</p>
                  <p><strong>Renaming Nodes:</strong> Double-click on a node to edit its name.</p>
                  <p><strong>Moving Nodes:</strong> Click and drag nodes to reposition them.</p>
                  <p><strong>Canvas Navigation:</strong> Click and drag empty space to pan, scroll to zoom.</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Current connections: {transitions.length}
                </div>
                <Button onClick={() => setShowTutorial(false)} className="w-full">
                  Got it!
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowBuilder;