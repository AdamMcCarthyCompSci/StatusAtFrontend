import { useState, useCallback } from 'react';
import { CanvasState } from '../types';

export const useCanvasState = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
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

  const resetView = useCallback(() => {
    setCanvasState({
      zoom: 1,
      panX: 0,
      panY: 0,
    });
  }, []);

  const fitToView = useCallback((steps: any[], containerWidth: number, containerHeight: number) => {
    if (steps.length === 0) return;
    
    const padding = 50;
    const nodeWidth = 128;
    const nodeHeight = 80;
    
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
    const panY = containerHeight / 2 - centerY * scale;
    
    setCanvasState({
      zoom: scale,
      panX,
      panY,
    });
  }, []);

  const centerOnNode = useCallback((node: any, containerWidth: number, containerHeight: number) => {
    setCanvasState(prev => ({
      ...prev,
      panX: containerWidth / 2 - (node.x + 64) * prev.zoom,
      panY: containerHeight / 2 - (node.y + 40) * prev.zoom,
    }));
  }, []);

  return {
    canvasState,
    setCanvasState,
    updateCanvasState,
    zoomIn,
    zoomOut,
    resetView,
    fitToView,
    centerOnNode,
  };
};