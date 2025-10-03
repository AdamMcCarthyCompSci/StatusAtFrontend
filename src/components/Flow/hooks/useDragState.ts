import { useState, useCallback } from 'react';
import { DragState } from '../types';

export const useDragState = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    startPos: null,
    draggedNodeId: null,
    nodeOffset: null,
  });

  const startCanvasDrag = useCallback((startPos: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      dragType: 'canvas',
      startPos,
      draggedNodeId: null,
      nodeOffset: null,
    });
  }, []);

  const startNodeDrag = useCallback((
    nodeId: string,
    startPos: { x: number; y: number },
    nodeOffset: { x: number; y: number }
  ) => {
    setDragState({
      isDragging: true,
      dragType: 'node',
      startPos,
      draggedNodeId: nodeId,
      nodeOffset,
    });
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: null,
      startPos: null,
      draggedNodeId: null,
      nodeOffset: null,
    });
  }, []);

  return {
    dragState,
    startCanvasDrag,
    startNodeDrag,
    endDrag,
  };
};
