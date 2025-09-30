import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFlow } from '@/hooks/useFlowQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Plus, ZoomIn, ZoomOut, Move, Maximize2, MapPin, ArrowUp, ArrowDown, ArrowRight, ArrowLeftIcon, Trash2 } from 'lucide-react';

// Types for our flow builder
interface FlowStep {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface FlowTransition {
  id: string;
  fromStepId: string;
  toStepId: string;
  condition?: string;
}

interface DragState {
  isDragging: boolean;
  dragType: 'canvas' | 'node' | 'connection' | null;
  draggedNodeId?: string;
  startPos?: { x: number; y: number };
  dragOffset?: { x: number; y: number };
}

interface ConnectionState {
  isConnecting: boolean;
  fromNodeId?: string;
  fromHandle?: 'output';
  tempConnection?: { fromX: number; fromY: number; toX: number; toY: number };
}

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}

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
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
  });

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

  // Helper functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

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

  // Loop detection using DFS
  const wouldCreateLoop = (fromStepId: string, toStepId: string): boolean => {
    if (fromStepId === toStepId) return true;
    
    const visited = new Set<string>();
    const stack = [toStepId];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      
      if (current === fromStepId) return true;
      
      const outgoingTransitions = transitions.filter(t => t.fromStepId === current);
      for (const transition of outgoingTransitions) {
        stack.push(transition.toStepId);
      }
    }
    
    return false;
  };

  const addTransition = (fromStepId: string, toStepId: string) => {
    // Check if transition already exists
    const exists = transitions.some(t => t.fromStepId === fromStepId && t.toStepId === toStepId);
    if (exists) return;
    
    // Check for loops
    if (wouldCreateLoop(fromStepId, toStepId)) {
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

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, prev.zoom * delta)),
    }));
  };

  // Add wheel event listener with passive: false to allow preventDefault
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Canvas controls
  const zoomIn = () => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.min(3, prev.zoom * 1.2),
    }));
  };

  const zoomOut = () => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(0.1, prev.zoom / 1.2),
    }));
  };

  const resetView = () => {
    setCanvasState({
      zoom: 1,
      panX: 0,
      panY: 0,
    });
  };

  const fitToView = () => {
    if (steps.length === 0) return;
    
    const padding = 100;
    const minX = Math.min(...steps.map(s => s.x)) - padding;
    const maxX = Math.max(...steps.map(s => s.x + 128)) + padding;
    const minY = Math.min(...steps.map(s => s.y)) - padding;
    const maxY = Math.max(...steps.map(s => s.y + 80)) + padding;
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scaleX = rect.width / contentWidth;
    const scaleY = rect.height / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    setCanvasState({
      zoom: scale,
      panX: rect.width / 2 - centerX * scale,
      panY: rect.height / 2 - centerY * scale,
    });
  };

  const centerOnNode = (nodeId: string) => {
    const node = steps.find(s => s.id === nodeId);
    if (!node) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setCanvasState(prev => ({
      ...prev,
      panX: rect.width / 2 - (node.x + 64) * prev.zoom,
      panY: rect.height / 2 - (node.y + 40) * prev.zoom,
    }));
  };

  // Get all connection points for a node (with buffer)
  const getNodeConnectionPoints = (node: FlowStep) => {
    const nodeWidth = 128;
    const nodeHeight = 80;
    const buffer = 10; // Buffer distance from node edge
    
    return {
      top: { x: node.x + nodeWidth / 2, y: node.y - buffer },
      right: { x: node.x + nodeWidth + buffer, y: node.y + nodeHeight / 2 },
      bottom: { x: node.x + nodeWidth / 2, y: node.y + nodeHeight + buffer },
      left: { x: node.x - buffer, y: node.y + nodeHeight / 2 }
    };
  };

  // Find the best connection points between two nodes (favoring perpendicular approaches)
  const findBestConnectionPoints = (fromNode: FlowStep, toNode: FlowStep) => {
    const fromPoints = getNodeConnectionPoints(fromNode);
    const toPoints = getNodeConnectionPoints(toNode);
    
    // Calculate the general direction from source to target
    const deltaX = toNode.x - fromNode.x;
    const deltaY = toNode.y - fromNode.y;
    
    // Determine the primary direction (which axis has larger difference)
    const isHorizontalPrimary = Math.abs(deltaX) > Math.abs(deltaY);
    
    let bestFromSide: 'top' | 'right' | 'bottom' | 'left';
    let bestToSide: 'top' | 'right' | 'bottom' | 'left';
    
    if (isHorizontalPrimary) {
      // Horizontal movement is primary - use left/right connections
      if (deltaX > 0) {
        // Moving right: from right side to left side
        bestFromSide = 'right';
        bestToSide = 'left';
      } else {
        // Moving left: from left side to right side
        bestFromSide = 'left';
        bestToSide = 'right';
      }
    } else {
      // Vertical movement is primary - use top/bottom connections
      if (deltaY > 0) {
        // Moving down: from bottom to top
        bestFromSide = 'bottom';
        bestToSide = 'top';
      } else {
        // Moving up: from top to bottom
        bestFromSide = 'top';
        bestToSide = 'bottom';
      }
    }
    
    // Switch to secondary direction when it would result in a more natural connection
    // (e.g., when nodes are reasonably aligned in the primary axis but offset in secondary axis)
    const primaryDistance = isHorizontalPrimary ? Math.abs(deltaX) : Math.abs(deltaY);
    const secondaryDistance = isHorizontalPrimary ? Math.abs(deltaY) : Math.abs(deltaX);
    
    // Switch to secondary direction if primary distance is small compared to secondary
    // OR if the primary distance is less than a reasonable threshold
    const nodeSize = 128; // Approximate node size for reference
    const shouldSwitchDirection = primaryDistance < Math.max(secondaryDistance, nodeSize);
    
    if (shouldSwitchDirection) {
      if (isHorizontalPrimary) {
        // Switch to vertical - nodes are almost horizontally aligned, use top/bottom
        if (deltaY > 0) {
          bestFromSide = 'bottom';
          bestToSide = 'top';
        } else {
          bestFromSide = 'top';
          bestToSide = 'bottom';
        }
      } else {
        // Switch to horizontal - nodes are almost vertically aligned, use left/right
        if (deltaX > 0) {
          bestFromSide = 'right';
          bestToSide = 'left';
        } else {
          bestFromSide = 'left';
          bestToSide = 'right';
        }
      }
    }
    
    return {
      from: fromPoints[bestFromSide],
      to: toPoints[bestToSide],
      fromSide: bestFromSide,
      toSide: bestToSide
    };
  };

  // Generate smart orthogonal path that avoids nodes
  const generateOrthogonalPath = (fromStepId: string, toStepId: string) => {
    const fromNode = steps.find(s => s.id === fromStepId);
    const toNode = steps.find(s => s.id === toStepId);
    
    if (!fromNode || !toNode) return 'M 0 0 L 0 0';
    
    // Find the best connection points
    const connection = findBestConnectionPoints(fromNode, toNode);
    const startX = connection.from.x;
    const startY = connection.from.y;
    const endX = connection.to.x;
    const endY = connection.to.y;
    
    // Node dimensions
    const nodeWidth = 128;
    const nodeHeight = 80;
    const padding = 20; // Extra space around nodes
    
    // Get all nodes except the source and target
    const obstacleNodes = steps.filter(step => step.id !== fromStepId && step.id !== toStepId);
    
    // Check if a horizontal line intersects with any node
    const lineIntersectsNode = (lineY: number, lineX1: number, lineX2: number) => {
      const minX = Math.min(lineX1, lineX2);
      const maxX = Math.max(lineX1, lineX2);
      
      return obstacleNodes.some(node => {
        const nodeLeft = node.x - padding;
        const nodeRight = node.x + nodeWidth + padding;
        const nodeTop = node.y - padding;
        const nodeBottom = node.y + nodeHeight + padding;
        
        // Check if line passes through node vertically and horizontally overlaps
        return lineY >= nodeTop && lineY <= nodeBottom && 
               maxX >= nodeLeft && minX <= nodeRight;
      });
    };
    
    // Check if a vertical line intersects with any node
    const verticalLineIntersectsNode = (lineX: number, lineY1: number, lineY2: number) => {
      const minY = Math.min(lineY1, lineY2);
      const maxY = Math.max(lineY1, lineY2);
      
      return obstacleNodes.some(node => {
        const nodeLeft = node.x - padding;
        const nodeRight = node.x + nodeWidth + padding;
        const nodeTop = node.y - padding;
        const nodeBottom = node.y + nodeHeight + padding;
        
        // Check if line passes through node horizontally and vertically overlaps
        return lineX >= nodeLeft && lineX <= nodeRight && 
               maxY >= nodeTop && minY <= nodeBottom;
      });
    };
    
    // Try different routing strategies with more direct approaches
    
    // For head-on attacks, use shorter intermediate segments
    const minOffset = 30; // Minimum distance before turning
    
    // Get connection info for routing decisions
    const sourceNode = steps.find(s => s.id === fromStepId)!;
    const targetNode = steps.find(s => s.id === toStepId)!;
    const connectionInfo = findBestConnectionPoints(sourceNode, targetNode);
    
    // Strategy 1a: Horizontal first with shorter segments for direct approach
    if ((connectionInfo.fromSide === 'right' && connectionInfo.toSide === 'left') ||
        (connectionInfo.fromSide === 'left' && connectionInfo.toSide === 'right')) {
      // Direct horizontal approach - minimal vertical deviation
      const midX = startX + (endX - startX) * 0.7; // Closer to target
      if (!lineIntersectsNode(startY, startX, midX) && 
          !verticalLineIntersectsNode(midX, startY, endY) && 
          !lineIntersectsNode(endY, midX, endX)) {
        return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
      }
    }
    
    // Strategy 1b: Vertical first with shorter segments for direct approach  
    if ((connectionInfo.fromSide === 'top' && connectionInfo.toSide === 'bottom') ||
        (connectionInfo.fromSide === 'bottom' && connectionInfo.toSide === 'top')) {
      // Direct vertical approach - minimal horizontal deviation
      const midY = startY + (endY - startY) * 0.7; // Closer to target
      if (!verticalLineIntersectsNode(startX, startY, midY) && 
          !lineIntersectsNode(midY, startX, endX) && 
          !verticalLineIntersectsNode(endX, midY, endY)) {
        return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
      }
    }
    
    // Strategy 2: Standard L-shapes with minimum offset for cleaner approach
    const offsetDistance = Math.max(minOffset, Math.abs(endX - startX) * 0.3);
    
    // Horizontal first
    const midX1 = connectionInfo.fromSide === 'right' ? startX + offsetDistance : startX - offsetDistance;
    if (!lineIntersectsNode(startY, startX, midX1) && 
        !verticalLineIntersectsNode(midX1, startY, endY) && 
        !lineIntersectsNode(endY, midX1, endX)) {
      return `M ${startX} ${startY} L ${midX1} ${startY} L ${midX1} ${endY} L ${endX} ${endY}`;
    }
    
    // Vertical first  
    const midY1 = connectionInfo.fromSide === 'bottom' ? startY + offsetDistance : startY - offsetDistance;
    if (!verticalLineIntersectsNode(startX, startY, midY1) && 
        !lineIntersectsNode(midY1, startX, endX) && 
        !verticalLineIntersectsNode(endX, midY1, endY)) {
      return `M ${startX} ${startY} L ${startX} ${midY1} L ${endX} ${midY1} L ${endX} ${endY}`;
    }
    
    // Strategy 3: Go around obstacles - try going above/below
    if (sourceNode && targetNode) {
      // Find the highest and lowest points of nodes in the path
      const relevantNodes = obstacleNodes.filter(node => {
        const nodeLeft = node.x - padding;
        const nodeRight = node.x + nodeWidth + padding;
        const pathLeft = Math.min(startX, endX);
        const pathRight = Math.max(startX, endX);
        
        // Node is in the horizontal path area
        return nodeRight >= pathLeft && nodeLeft <= pathRight;
      });
      
      if (relevantNodes.length > 0) {
        const highestPoint = Math.min(...relevantNodes.map(n => n.y)) - padding - 10;
        const lowestPoint = Math.max(...relevantNodes.map(n => n.y + nodeHeight)) + padding + 10;
        
        // Try going above obstacles
        if (highestPoint > Math.max(sourceNode.y, targetNode.y) + nodeHeight + 10) {
          const routeY = highestPoint;
          return `M ${startX} ${startY} L ${startX} ${routeY} L ${endX} ${routeY} L ${endX} ${endY}`;
        }
        
        // Try going below obstacles
        if (lowestPoint < Math.min(sourceNode.y, targetNode.y) - 10) {
          const routeY = lowestPoint;
          return `M ${startX} ${startY} L ${startX} ${routeY} L ${endX} ${routeY} L ${endX} ${endY}`;
        }
      }
    }
    
    // Strategy 4: Go around obstacles - try going left/right
    if (sourceNode && targetNode) {
      const relevantNodes = obstacleNodes.filter(node => {
        const nodeTop = node.y - padding;
        const nodeBottom = node.y + nodeHeight + padding;
        const pathTop = Math.min(startY, endY);
        const pathBottom = Math.max(startY, endY);
        
        // Node is in the vertical path area
        return nodeBottom >= pathTop && nodeTop <= pathBottom;
      });
      
      if (relevantNodes.length > 0) {
        const leftmostPoint = Math.min(...relevantNodes.map(n => n.x)) - padding - 10;
        const rightmostPoint = Math.max(...relevantNodes.map(n => n.x + nodeWidth)) + padding + 10;
        
        // Try going left of obstacles
        if (leftmostPoint > Math.max(sourceNode.x + nodeWidth, targetNode.x + nodeWidth) + 10) {
          const routeX = leftmostPoint;
          return `M ${startX} ${startY} L ${routeX} ${startY} L ${routeX} ${endY} L ${endX} ${endY}`;
        }
        
        // Try going right of obstacles
        if (rightmostPoint < Math.min(sourceNode.x, targetNode.x) - 10) {
          const routeX = rightmostPoint;
          return `M ${startX} ${startY} L ${routeX} ${startY} L ${routeX} ${endY} L ${endX} ${endY}`;
        }
      }
    }
    
    // Fallback: Simple direct path with offset to avoid most overlaps
    const offsetY = startY + (endY > startY ? -30 : 30);
    return `M ${startX} ${startY} L ${startX} ${offsetY} L ${endX} ${offsetY} L ${endX} ${endY}`;
  };

  // Convert path to screen coordinates
  const convertPathToScreen = (pathData: string) => {
    return pathData.replace(/([ML])\s*([0-9.-]+)\s+([0-9.-]+)/g, (_, command, x, y) => {
      const screenX = parseFloat(x) * canvasState.zoom + canvasState.panX;
      const screenY = parseFloat(y) * canvasState.zoom + canvasState.panY;
      return `${command} ${screenX} ${screenY}`;
    });
  };

  // Minimap rendering
  const renderMinimap = () => {
    if (steps.length === 0) return null;

    const minimapSize = 200;
    const padding = 20;
    
    // Calculate content bounds
    const minX = Math.min(...steps.map(s => s.x));
    const maxX = Math.max(...steps.map(s => s.x + 128));
    const minY = Math.min(...steps.map(s => s.y));
    const maxY = Math.max(...steps.map(s => s.y + 80));
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    // Calculate scale to fit content in minimap
    const scale = Math.min(
      (minimapSize - padding * 2) / contentWidth,
      (minimapSize - padding * 2) / contentHeight
    );

    // Calculate viewport in world coordinates
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    
    const viewportWorldX = -canvasState.panX / canvasState.zoom;
    const viewportWorldY = -canvasState.panY / canvasState.zoom;
    const viewportWorldWidth = rect.width / canvasState.zoom;
    const viewportWorldHeight = rect.height / canvasState.zoom;
    
    // Convert viewport to minimap coordinates
    const viewportMinimapX = (viewportWorldX - minX) * scale + padding;
    const viewportMinimapY = (viewportWorldY - minY) * scale + padding;
    const viewportMinimapWidth = viewportWorldWidth * scale;
    const viewportMinimapHeight = viewportWorldHeight * scale;

    // Check if viewport is out of bounds
    const isOutOfBounds = 
      viewportMinimapX + viewportMinimapWidth < padding ||
      viewportMinimapX > minimapSize - padding ||
      viewportMinimapY + viewportMinimapHeight < padding ||
      viewportMinimapY > minimapSize - padding;

    // Get direction indicators for out of bounds
    const getDirectionIndicators = () => {
      const indicators = [];
      const contentCenterX = (minX + maxX) / 2;
      const contentCenterY = (minY + maxY) / 2;
      
      if (viewportWorldX + viewportWorldWidth / 2 < contentCenterX) {
        indicators.push(<ArrowRight key="right" className="h-4 w-4 animate-pulse" />);
      }
      if (viewportWorldX + viewportWorldWidth / 2 > contentCenterX) {
        indicators.push(<ArrowLeftIcon key="left" className="h-4 w-4 animate-pulse" />);
      }
      if (viewportWorldY + viewportWorldHeight / 2 < contentCenterY) {
        indicators.push(<ArrowDown key="down" className="h-4 w-4 animate-pulse" />);
      }
      if (viewportWorldY + viewportWorldHeight / 2 > contentCenterY) {
        indicators.push(<ArrowUp key="up" className="h-4 w-4 animate-pulse" />);
      }
      
      return indicators;
    };

    const handleMinimapClick = (e: React.MouseEvent) => {
      if (isOutOfBounds) {
        fitToView();
        return;
      }
      
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      const worldX = (clickX - padding) / scale + minX;
      const worldY = (clickY - padding) / scale + minY;
      
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      
      setCanvasState(prev => ({
        ...prev,
        panX: canvasRect.width / 2 - worldX * prev.zoom,
        panY: canvasRect.height / 2 - worldY * prev.zoom,
      }));
    };

    return (
      <div className="fixed top-40 right-4 bg-background/90 backdrop-blur border rounded-lg p-2 shadow-lg z-10 select-none">
        <div className="text-xs text-muted-foreground mb-2 text-center">
          {isOutOfBounds ? 'Minimap - Out of View' : 'Minimap'}
        </div>
        <div 
          className="relative bg-muted rounded cursor-pointer overflow-hidden"
          style={{ width: minimapSize, height: minimapSize }}
          onClick={handleMinimapClick}
          title={isOutOfBounds ? 'Click to fit view' : 'Click to navigate'}
        >
          {/* Content nodes */}
          {steps.map(step => {
            const x = (step.x - minX) * scale + padding;
            const y = (step.y - minY) * scale + padding;
            const width = 128 * scale;
            const height = 80 * scale;
            
            return (
              <div
                key={step.id}
                className="absolute bg-primary rounded"
                style={{
                  left: x,
                  top: y,
                  width: Math.max(2, width),
                  height: Math.max(2, height),
                }}
              />
            );
          })}
          
          {/* Viewport indicator or out-of-bounds overlay */}
          {isOutOfBounds ? (
            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-red-600 font-medium mb-1">Out of View</div>
                <div className="flex gap-1 justify-center">
                  {getDirectionIndicators()}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/20 rounded"
              style={{
                left: Math.max(0, Math.min(minimapSize - viewportMinimapWidth, viewportMinimapX)),
                top: Math.max(0, Math.min(minimapSize - viewportMinimapHeight, viewportMinimapY)),
                width: Math.min(minimapSize, Math.max(10, viewportMinimapWidth)),
                height: Math.min(minimapSize, Math.max(10, viewportMinimapHeight)),
              }}
            />
          )}
        </div>
      </div>
    );
  };

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/flows">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Flows
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Flow Builder</h1>
                <p className="text-sm text-muted-foreground">
                  {flowData ? `Editing: ${flowData.name}` : 'Loading...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Canvas Controls */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button variant="ghost" size="sm" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2 py-1 bg-muted rounded">
                  {Math.round(canvasState.zoom * 100)}%
                </span>
                <Button variant="ghost" size="sm" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" onClick={resetView}>
                <Move className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              
              <Button variant="ghost" size="sm" onClick={fitToView}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Fit to View
              </Button>
              
              {/* Node Navigation */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Go to Node
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {steps.map(step => (
                    <DropdownMenuItem key={step.id} onClick={() => centerOnNode(step.id)}>
                      {step.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Node Creation */}
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => addNode(200, 200)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
              
              {/* Delete Selected Node */}
              {selectedNodeId && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => deleteNode(selectedNodeId)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Node
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative h-[calc(100vh-8rem)] overflow-hidden">
        {/* Minimap - Fixed position outside transformed canvas */}
        {renderMinimap()}
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
              const pathData = generateOrthogonalPath(transition.fromStepId, transition.toStepId);
              const screenPath = convertPathToScreen(pathData);
              
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
                  d={convertPathToScreen(pathData)}
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