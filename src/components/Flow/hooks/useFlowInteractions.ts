import { useState, useEffect, useCallback } from 'react';
import { FlowStep, FlowTransition, DragState, ConnectionState, CanvasState } from '../types';
import { generateId, wouldCreateLoop, getNodeConnectionPoints } from '../utils';

interface UseFlowInteractionsProps {
  steps: FlowStep[];
  transitions: FlowTransition[];
  canvasState: CanvasState;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  setCanvasState: (updater: (prev: CanvasState) => CanvasState) => void;
  updateNode: (nodeId: string, updates: Partial<FlowStep>) => void;
  addTransition: (fromStepId: string, toStepId: string) => void;
}

export const useFlowInteractions = ({
  steps,
  transitions,
  canvasState,
  canvasRef,
  setCanvasState,
  updateNode,
  addTransition,
}: UseFlowInteractionsProps) => {
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

  // Screen to world coordinate conversion
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const x = (screenX - rect.left - canvasState.panX) / canvasState.zoom;
    const y = (screenY - rect.top - canvasState.panY) / canvasState.zoom;

    return { x, y };
  }, [canvasState, canvasRef]);

  // Canvas event handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Deselect node when clicking on empty canvas
      setSelectedNodeId(null);
      setDragState({
        isDragging: true,
        dragType: 'canvas',
        startPos: { x: e.clientX, y: e.clientY },
      });
    }
  }, []);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
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
  }, [dragState, connectionState, setCanvasState, updateNode, screenToWorld]);

  const handleCanvasMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: null,
    });
    
    if (connectionState.isConnecting) {
      setConnectionState({
        isConnecting: false,
      });
    }
  }, [connectionState]);

  // Node event handlers
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
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
  }, [steps, screenToWorld]);

  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    setEditingNodeId(nodeId);
  }, []);

  const handleConnectionStart = useCallback((e: React.MouseEvent, nodeId: string) => {
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
  }, [steps, screenToWorld]);

  const handleConnectionEnd = useCallback((nodeId: string) => {
    if (connectionState.isConnecting && connectionState.fromNodeId && connectionState.fromNodeId !== nodeId) {
      addTransition(connectionState.fromNodeId, nodeId);
    }
    setConnectionState({
      isConnecting: false,
    });
    setHoveredNodeId(null);
  }, [connectionState, addTransition]);

  const handleNodeMouseEnter = useCallback((nodeId: string) => {
    if (connectionState.isConnecting && connectionState.fromNodeId !== nodeId) {
      setHoveredNodeId(nodeId);
    }
  }, [connectionState]);

  const handleNodeMouseLeave = useCallback(() => {
    if (connectionState.isConnecting) {
      setHoveredNodeId(null);
    }
  }, [connectionState]);

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
  }, [setCanvasState, canvasRef]);

  return {
    // State
    dragState,
    connectionState,
    selectedNodeId,
    editingNodeId,
    hoveredNodeId,
    
    // State setters
    setSelectedNodeId,
    setEditingNodeId,
    setHoveredNodeId,
    
    // Event handlers
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleNodeMouseDown,
    handleNodeDoubleClick,
    handleConnectionStart,
    handleConnectionEnd,
    handleNodeMouseEnter,
    handleNodeMouseLeave,
  };
};
