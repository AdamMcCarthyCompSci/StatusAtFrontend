import { useState, useCallback, useEffect } from 'react';

import { FlowStep, DragState, ConnectionState, CanvasState } from '../types';
import { getNodeConnectionPoints } from '../utils';

interface UseFlowInteractionsProps {
  steps: FlowStep[];
  canvasState: CanvasState;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  setCanvasState: (updater: (prev: CanvasState) => CanvasState) => void;
  updateNode: (nodeId: string, updates: Partial<FlowStep>) => void;
  updateNodeRealtime?: (nodeId: string, x: number, y: number) => void;
  finalizeNodePosition?: (nodeId: string, x: number, y: number) => void;
  addTransition: (fromStepId: string, toStepId: string) => void;
  onOpenNodeProperties?: (nodeId: string) => void;
}

export const useFlowInteractions = ({
  steps,
  canvasState,
  canvasRef,
  setCanvasState,
  updateNode,
  updateNodeRealtime,
  finalizeNodePosition,
  addTransition,
  onOpenNodeProperties,
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
  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };

      const x = (screenX - rect.left - canvasState.panX) / canvasState.zoom;
      const y = (screenY - rect.top - canvasState.panY) / canvasState.zoom;

      return { x, y };
    },
    [canvasState, canvasRef]
  );

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

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
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
        } else if (
          dragState.dragType === 'node' &&
          dragState.draggedNodeId &&
          dragState.dragOffset
        ) {
          // Check if significant movement has occurred (more than 5 pixels)
          if (dragState.startPos) {
            const deltaX = Math.abs(e.clientX - dragState.startPos.x);
            const deltaY = Math.abs(e.clientY - dragState.startPos.y);
            if ((deltaX > 5 || deltaY > 5) && !dragState.hasMoved) {
              setDragState(prev => ({ ...prev, hasMoved: true }));
            }
          }

          const worldPos = screenToWorld(e.clientX, e.clientY);
          const newX = worldPos.x - dragState.dragOffset.x;
          const newY = worldPos.y - dragState.dragOffset.y;

          // Use realtime update during dragging (no API calls)
          if (updateNodeRealtime) {
            updateNodeRealtime(dragState.draggedNodeId, newX, newY);
          } else {
            // Fallback to old behavior if realtime function not provided
            updateNode(dragState.draggedNodeId, { x: newX, y: newY });
          }
        }
      }

      // Update temporary connection
      if (connectionState.isConnecting && connectionState.tempConnection) {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        setConnectionState(prev => ({
          ...prev,
          tempConnection: prev.tempConnection
            ? {
                ...prev.tempConnection,
                toX: worldPos.x,
                toY: worldPos.y,
              }
            : undefined,
        }));
      }
    },
    [dragState, connectionState, setCanvasState, updateNode, screenToWorld]
  );

  const handleCanvasMouseUp = useCallback(() => {
    // Check if this was a click (no significant dragging) on a node
    const wasNodeClick =
      dragState.dragType === 'node' &&
      dragState.draggedNodeId &&
      dragState.startPos &&
      !dragState.hasMoved;

    // Finalize node position if we were dragging a node
    if (
      dragState.dragType === 'node' &&
      dragState.draggedNodeId &&
      finalizeNodePosition &&
      dragState.hasMoved
    ) {
      const node = steps.find(s => s.id === dragState.draggedNodeId);
      if (node) {
        finalizeNodePosition(dragState.draggedNodeId, node.x, node.y);
      }
    }

    // Open properties modal if it was a click without dragging
    if (wasNodeClick && onOpenNodeProperties && dragState.draggedNodeId) {
      onOpenNodeProperties(dragState.draggedNodeId);
    }

    setDragState({
      isDragging: false,
      dragType: null,
    });

    if (connectionState.isConnecting) {
      setConnectionState({
        isConnecting: false,
      });
    }
  }, [
    connectionState,
    dragState,
    steps,
    finalizeNodePosition,
    onOpenNodeProperties,
  ]);

  // Node event handlers
  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
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
    },
    [steps, screenToWorld]
  );

  // Touch event handlers for nodes
  const handleNodeTouchStart = useCallback(
    (e: React.TouchEvent, nodeId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      if (!touch) return;

      const node = steps.find(s => s.id === nodeId);
      if (!node) return;

      const worldPos = screenToWorld(touch.clientX, touch.clientY);
      const dragOffset = {
        x: worldPos.x - node.x,
        y: worldPos.y - node.y,
      };

      setDragState({
        isDragging: true,
        dragType: 'node',
        draggedNodeId: nodeId,
        startPos: { x: touch.clientX, y: touch.clientY },
        dragOffset,
      });
      setSelectedNodeId(nodeId);
    },
    [steps, screenToWorld]
  );

  const handleNodeTouchMove = useCallback(
    (e: React.TouchEvent, nodeId: string) => {
      e.preventDefault();

      if (dragState.dragType === 'node' && dragState.draggedNodeId === nodeId) {
        const touch = e.touches[0];
        if (!touch) return;

        // Check if significant movement has occurred (more than 5 pixels)
        if (dragState.startPos) {
          const deltaX = Math.abs(touch.clientX - dragState.startPos.x);
          const deltaY = Math.abs(touch.clientY - dragState.startPos.y);
          if ((deltaX > 5 || deltaY > 5) && !dragState.hasMoved) {
            setDragState(prev => ({ ...prev, hasMoved: true }));
          }
        }

        const worldPos = screenToWorld(touch.clientX, touch.clientY);
        const newX = worldPos.x - (dragState.dragOffset?.x || 0);
        const newY = worldPos.y - (dragState.dragOffset?.y || 0);

        // Use realtime update during dragging (no API calls)
        if (updateNodeRealtime) {
          updateNodeRealtime(nodeId, newX, newY);
        } else {
          // Fallback to old behavior if realtime function not provided
          updateNode(nodeId, { x: newX, y: newY });
        }
      }
    },
    [dragState, screenToWorld, updateNode, updateNodeRealtime, setDragState]
  );

  const handleNodeTouchEnd = useCallback(
    (e: React.TouchEvent, nodeId: string) => {
      e.preventDefault();

      // Check if this was a tap (no significant movement)
      const wasNodeTap =
        dragState.dragType === 'node' &&
        dragState.draggedNodeId === nodeId &&
        !dragState.hasMoved;

      // Finalize node position if we were dragging
      if (
        dragState.dragType === 'node' &&
        dragState.draggedNodeId === nodeId &&
        finalizeNodePosition &&
        dragState.hasMoved
      ) {
        const node = steps.find(s => s.id === nodeId);
        if (node) {
          finalizeNodePosition(nodeId, node.x, node.y);
        }
      }

      // Open properties modal if it was a tap without dragging
      if (wasNodeTap && onOpenNodeProperties) {
        onOpenNodeProperties(nodeId);
      }

      setDragState({
        isDragging: false,
        dragType: null,
      });
    },
    [dragState, steps, finalizeNodePosition, onOpenNodeProperties]
  );

  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      // Double-click now opens the properties modal (same as single click)
      if (onOpenNodeProperties) {
        onOpenNodeProperties(nodeId);
      }
    },
    [onOpenNodeProperties]
  );

  const handleConnectionStart = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      const node = steps.find(s => s.id === nodeId);
      if (!node) return;

      const worldPos = screenToWorld(e.clientX, e.clientY);
      const connectionPoints = getNodeConnectionPoints(node);

      // Find the closest connection point to where the user clicked
      let closestPoint = connectionPoints.right;
      let minDistance = Infinity;

      Object.values(connectionPoints).forEach(point => {
        const distance =
          Math.abs(point.x - worldPos.x) + Math.abs(point.y - worldPos.y);
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
    },
    [steps, screenToWorld]
  );

  const handleConnectionEnd = useCallback(
    (nodeId: string) => {
      if (
        connectionState.isConnecting &&
        connectionState.fromNodeId &&
        connectionState.fromNodeId !== nodeId
      ) {
        addTransition(connectionState.fromNodeId, nodeId);
      }
      setConnectionState({
        isConnecting: false,
      });
      setHoveredNodeId(null);
    },
    [connectionState, addTransition]
  );

  const handleNodeMouseEnter = useCallback(
    (nodeId: string) => {
      if (
        connectionState.isConnecting &&
        connectionState.fromNodeId !== nodeId
      ) {
        setHoveredNodeId(nodeId);
      }
    },
    [connectionState]
  );

  const handleNodeMouseLeave = useCallback(() => {
    if (connectionState.isConnecting) {
      setHoveredNodeId(null);
    }
  }, [connectionState]);

  // Native wheel event listener with non-passive option
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert to world coordinates
      const worldX = (mouseX - canvasState.panX) / canvasState.zoom;
      const worldY = (mouseY - canvasState.panY) / canvasState.zoom;

      // Calculate zoom
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(3, canvasState.zoom * zoomFactor));

      // Calculate new pan to keep mouse position fixed
      const newPanX = mouseX - worldX * newZoom;
      const newPanY = mouseY - worldY * newZoom;

      setCanvasState(prev => ({
        ...prev,
        zoom: newZoom,
        panX: newPanX,
        panY: newPanY,
      }));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvasState, setCanvasState, canvasRef]);

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

    // Touch event handlers
    handleNodeTouchStart,
    handleNodeTouchMove,
    handleNodeTouchEnd,
  };
};
