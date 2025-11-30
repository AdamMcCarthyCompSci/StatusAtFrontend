import { useState, useCallback } from 'react';

import { CanvasState } from '../types';
import { NODE_DIMENSIONS } from '../constants';

export const useCanvasState = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0, // Will be updated to center when container dimensions are available
    panY: 0, // Will be updated to center when container dimensions are available
  });

  const updateCanvasState = useCallback((updates: Partial<CanvasState>) => {
    setCanvasState(prev => ({ ...prev, ...updates }));
  }, []);

  const zoomIn = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 3),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.1),
    }));
  }, []);

  const resetView = useCallback(
    (containerWidth?: number, containerHeight?: number) => {
      // If container dimensions are provided, center the origin (0,0) in the middle of the screen
      if (containerWidth && containerHeight) {
        setCanvasState({
          zoom: 1,
          panX: containerWidth / 2,
          panY: containerHeight / 2,
        });
      } else {
        // Fallback to top-left origin if dimensions not available
        setCanvasState({
          zoom: 1,
          panX: 0,
          panY: 0,
        });
      }
    },
    []
  );

  const fitToView = useCallback(
    (steps: any[], containerWidth: number, containerHeight: number) => {
      if (steps.length === 0) return;

      const padding = 50;
      const bottomPadding = 80; // Extra padding at the bottom to shift content up
      const nodeWidth = NODE_DIMENSIONS.WIDTH;
      const nodeHeight = NODE_DIMENSIONS.HEIGHT;

      const minX = Math.min(...steps.map(s => s.x)) - padding;
      const maxX = Math.max(...steps.map(s => s.x + nodeWidth)) + padding;
      const minY = Math.min(...steps.map(s => s.y)) - padding;
      const maxY = Math.max(...steps.map(s => s.y + nodeHeight)) + padding;

      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;

      const scaleX = (containerWidth - padding * 2) / contentWidth;
      const scaleY = (containerHeight - padding * 2) / contentHeight;
      const scale = Math.min(scaleX, scaleY, 1);

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      const panX = containerWidth / 2 - centerX * scale;
      const panY = containerHeight / 2 - centerY * scale - bottomPadding;

      setCanvasState({
        zoom: scale,
        panX,
        panY,
      });
    },
    []
  );

  const centerOnNode = useCallback(
    (node: any, containerWidth: number, containerHeight: number) => {
      setCanvasState(prev => ({
        ...prev,
        panX:
          containerWidth / 2 - (node.x + NODE_DIMENSIONS.WIDTH / 2) * prev.zoom,
        panY:
          containerHeight / 2 -
          (node.y + NODE_DIMENSIONS.HEIGHT / 2) * prev.zoom,
      }));
    },
    []
  );

  const initializeCanvas = useCallback(
    (containerWidth: number, containerHeight: number) => {
      // Initialize canvas with origin (0,0) centered on screen
      setCanvasState({
        zoom: 1,
        panX: containerWidth / 2,
        panY: containerHeight / 2,
      });
    },
    []
  );

  return {
    canvasState,
    setCanvasState,
    updateCanvasState,
    zoomIn,
    zoomOut,
    resetView,
    fitToView,
    centerOnNode,
    initializeCanvas,
  };
};
