import { useCallback, useState } from 'react';
import { CanvasState } from '../types';

interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

interface TouchState {
  isPanning: boolean;
  isZooming: boolean;
  lastPanPoint: TouchPoint | null;
  lastZoomDistance: number | null;
  lastZoomCenter: TouchPoint | null;
}

interface UseTouchInteractionsProps {
  canvasState: CanvasState;
  setCanvasState: (updater: (prev: CanvasState) => CanvasState) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const useTouchInteractions = ({
  canvasState,
  setCanvasState,
  canvasRef,
}: UseTouchInteractionsProps) => {
  const [touchState, setTouchState] = useState<TouchState>({
    isPanning: false,
    isZooming: false,
    lastPanPoint: null,
    lastZoomDistance: null,
    lastZoomCenter: null,
  });

  // Helper function to get distance between two touch points
  const getDistance = useCallback((touch1: TouchPoint, touch2: TouchPoint) => {
    const dx = touch1.x - touch2.x;
    const dy = touch1.y - touch2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Helper function to get center point between two touch points
  const getCenter = useCallback((touch1: TouchPoint, touch2: TouchPoint) => {
    return {
      x: (touch1.x + touch2.x) / 2,
      y: (touch1.y + touch2.y) / 2,
      id: -1, // Special ID for center point
    };
  }, []);

  // Helper function to convert touch to canvas coordinates
  const getCanvasCoordinates = useCallback((clientX: number, clientY: number, id: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0, id };
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      id,
    };
  }, [canvasRef]);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Check if the touch target is a node - if so, don't handle canvas panning
    const target = e.target as HTMLElement;
    const isNodeTouch = target.closest('[data-flow-node]') !== null;
    
    if (isNodeTouch) {
      // Don't prevent default or handle canvas panning for node touches
      return;
    }
    
    e.preventDefault();
    
    const touches = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier,
    }));

    if (touches.length === 1) {
      // Single touch - start panning
      const canvasCoords = getCanvasCoordinates(touches[0].x, touches[0].y, touches[0].id);
      setTouchState({
        isPanning: true,
        isZooming: false,
        lastPanPoint: canvasCoords,
        lastZoomDistance: null,
        lastZoomCenter: null,
      });
    } else if (touches.length === 2) {
      // Two touches - start zooming
      const canvasCoords1 = getCanvasCoordinates(touches[0].x, touches[0].y, touches[0].id);
      const canvasCoords2 = getCanvasCoordinates(touches[1].x, touches[1].y, touches[1].id);
      
      const distance = getDistance(canvasCoords1, canvasCoords2);
      const center = getCenter(canvasCoords1, canvasCoords2);
      
      setTouchState({
        isPanning: false,
        isZooming: true,
        lastPanPoint: null,
        lastZoomDistance: distance,
        lastZoomCenter: center,
      });
    }
  }, [getCanvasCoordinates, getDistance, getCenter]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Check if the touch target is a node - if so, don't handle canvas panning
    const target = e.target as HTMLElement;
    const isNodeTouch = target.closest('[data-flow-node]') !== null;
    
    if (isNodeTouch) {
      // Don't prevent default or handle canvas panning for node touches
      return;
    }
    
    e.preventDefault();
    
    const touches = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier,
    }));

    if (touchState.isPanning && touches.length === 1 && touchState.lastPanPoint) {
      // Single touch panning
      const canvasCoords = getCanvasCoordinates(touches[0].x, touches[0].y, touches[0].id);
      const deltaX = canvasCoords.x - touchState.lastPanPoint.x;
      const deltaY = canvasCoords.y - touchState.lastPanPoint.y;
      
      setCanvasState(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY,
      }));
      
      setTouchState(prev => ({
        ...prev,
        lastPanPoint: canvasCoords,
      }));
    } else if (touchState.isZooming && touches.length === 2 && touchState.lastZoomDistance && touchState.lastZoomCenter) {
      // Two touch zooming
      const canvasCoords1 = getCanvasCoordinates(touches[0].x, touches[0].y, touches[0].id);
      const canvasCoords2 = getCanvasCoordinates(touches[1].x, touches[1].y, touches[1].id);
      
      const distance = getDistance(canvasCoords1, canvasCoords2);
      const center = getCenter(canvasCoords1, canvasCoords2);
      
      const zoomFactor = distance / touchState.lastZoomDistance;
      const newZoom = Math.max(0.1, Math.min(3, canvasState.zoom * zoomFactor));
      
      // Calculate zoom center in world coordinates
      const worldX = (center.x - canvasState.panX) / canvasState.zoom;
      const worldY = (center.y - canvasState.panY) / canvasState.zoom;
      
      // Calculate new pan to keep zoom center fixed
      const newPanX = center.x - worldX * newZoom;
      const newPanY = center.y - worldY * newZoom;
      
      setCanvasState(prev => ({
        ...prev,
        zoom: newZoom,
        panX: newPanX,
        panY: newPanY,
      }));
      
      setTouchState(prev => ({
        ...prev,
        lastZoomDistance: distance,
        lastZoomCenter: center,
      }));
    }
  }, [
    touchState,
    canvasState,
    setCanvasState,
    getCanvasCoordinates,
    getDistance,
    getCenter,
  ]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Check if the touch target is a node - if so, don't handle canvas panning
    const target = e.target as HTMLElement;
    const isNodeTouch = target.closest('[data-flow-node]') !== null;
    
    if (isNodeTouch) {
      // Don't prevent default or handle canvas panning for node touches
      return;
    }
    
    e.preventDefault();
    
    // If no touches remain, reset touch state
    if (e.touches.length === 0) {
      setTouchState({
        isPanning: false,
        isZooming: false,
        lastPanPoint: null,
        lastZoomDistance: null,
        lastZoomCenter: null,
      });
    } else if (e.touches.length === 1 && touchState.isZooming) {
      // Transition from zooming to panning
      const touch = e.touches[0];
      const canvasCoords = getCanvasCoordinates(touch.clientX, touch.clientY, touch.identifier);
      
      setTouchState({
        isPanning: true,
        isZooming: false,
        lastPanPoint: canvasCoords,
        lastZoomDistance: null,
        lastZoomCenter: null,
      });
    }
  }, [touchState.isZooming, getCanvasCoordinates]);

  // Handle touch cancel
  const handleTouchCancel = useCallback((e: React.TouchEvent) => {
    // Check if the touch target is a node - if so, don't handle canvas panning
    const target = e.target as HTMLElement;
    const isNodeTouch = target.closest('[data-flow-node]') !== null;
    
    if (isNodeTouch) {
      // Don't prevent default or handle canvas panning for node touches
      return;
    }
    
    e.preventDefault();
    setTouchState({
      isPanning: false,
      isZooming: false,
      lastPanPoint: null,
      lastZoomDistance: null,
      lastZoomCenter: null,
    });
  }, []);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    touchState,
  };
};
