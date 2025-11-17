import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useCanvasState } from '../../components/Flow/hooks/useCanvasState';
import { FlowStep } from '../../components/Flow/types';

describe('useCanvasState', () => {
  it('should initialize with default canvas state', () => {
    const { result } = renderHook(() => useCanvasState());
    
    expect(result.current.canvasState).toEqual({
      zoom: 1,
      panX: 0,
      panY: 0
    });
  });

  describe('zoom operations', () => {
    it('should zoom in correctly', () => {
      const { result } = renderHook(() => useCanvasState());
      
      act(() => {
        result.current.zoomIn();
      });
      
      expect(result.current.canvasState.zoom).toBeCloseTo(1.2);
    });

    it('should zoom out correctly', () => {
      const { result } = renderHook(() => useCanvasState());
      
      act(() => {
        result.current.zoomOut();
      });
      
      expect(result.current.canvasState.zoom).toBeCloseTo(0.833, 2);
    });

    it('should respect maximum zoom limit', () => {
      const { result } = renderHook(() => useCanvasState());
      
      // Zoom in multiple times to exceed limit
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.zoomIn();
        }
      });
      
      expect(result.current.canvasState.zoom).toBeLessThanOrEqual(3);
    });

    it('should respect minimum zoom limit', () => {
      const { result } = renderHook(() => useCanvasState());
      
      // Zoom out multiple times to go below limit
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.zoomOut();
        }
      });
      
      expect(result.current.canvasState.zoom).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe('resetView', () => {
    it('should reset canvas to default state', () => {
      const { result } = renderHook(() => useCanvasState());
      
      // Modify the state first
      act(() => {
        result.current.setCanvasState(prev => ({
          ...prev,
          zoom: 2,
          panX: 100,
          panY: 200
        }));
      });
      
      // Reset view
      act(() => {
        result.current.resetView();
      });
      
      expect(result.current.canvasState).toEqual({
        zoom: 1,
        panX: 0,
        panY: 0
      });
    });
  });

  describe('fitToView', () => {
    const mockSteps: FlowStep[] = [
      { id: '1', name: 'Node 1', x: 100, y: 100 },
      { id: '2', name: 'Node 2', x: 300, y: 200 },
      { id: '3', name: 'Node 3', x: 200, y: 300 },
    ];

    it('should fit all nodes in view', () => {
      const { result } = renderHook(() => useCanvasState());
      
      act(() => {
        result.current.fitToView(mockSteps, 800, 600);
      });
      
      const { canvasState } = result.current;
      
      // Should have adjusted zoom and pan to fit all nodes
      expect(canvasState.zoom).toBeGreaterThan(0);
      expect(canvasState.zoom).toBeLessThanOrEqual(1); // Should not zoom beyond 1:1
      expect(typeof canvasState.panX).toBe('number');
      expect(typeof canvasState.panY).toBe('number');
    });

    it('should handle empty steps array', () => {
      const { result } = renderHook(() => useCanvasState());
      const initialState = result.current.canvasState;
      
      act(() => {
        result.current.fitToView([], 800, 600);
      });
      
      // Should not change state for empty array
      expect(result.current.canvasState).toEqual(initialState);
    });

    it('should handle single node', () => {
      const { result } = renderHook(() => useCanvasState());
      const singleStep: FlowStep[] = [
        { id: '1', name: 'Single Node', x: 200, y: 150 }
      ];
      
      act(() => {
        result.current.fitToView(singleStep, 800, 600);
      });
      
      const { canvasState } = result.current;
      expect(canvasState.zoom).toBe(1); // Should not zoom for single node
      expect(typeof canvasState.panX).toBe('number');
      expect(typeof canvasState.panY).toBe('number');
    });
  });

  describe('centerOnNode', () => {
    it('should center view on specified node', () => {
      const { result } = renderHook(() => useCanvasState());
      const targetNode: FlowStep = { id: '1', name: 'Target', x: 200, y: 150 };
      
      act(() => {
        result.current.centerOnNode(targetNode, 800, 600);
      });
      
      const { canvasState } = result.current;

      // Should center the node (node center at 200+72, 150+48)
      // Node dimensions are now 144x96 (w-36 h-24 in Tailwind = 144px x 96px)
      // Container center at 400, 300
      // panX should be 400 - (272 * zoom)
      // panY should be 300 - (198 * zoom)
      const expectedPanX = 400 - (272 * canvasState.zoom);
      const expectedPanY = 300 - (198 * canvasState.zoom);

      expect(canvasState.panX).toBeCloseTo(expectedPanX);
      expect(canvasState.panY).toBeCloseTo(expectedPanY);
    });

    it('should preserve zoom level when centering', () => {
      const { result } = renderHook(() => useCanvasState());
      const targetNode: FlowStep = { id: '1', name: 'Target', x: 200, y: 150 };
      
      // Set a specific zoom level
      act(() => {
        result.current.setCanvasState(prev => ({ ...prev, zoom: 1.5 }));
      });
      
      const zoomBeforeCenter = result.current.canvasState.zoom;
      
      act(() => {
        result.current.centerOnNode(targetNode, 800, 600);
      });
      
      expect(result.current.canvasState.zoom).toBe(zoomBeforeCenter);
    });
  });

  describe('setCanvasState', () => {
    it('should update canvas state with function updater', () => {
      const { result } = renderHook(() => useCanvasState());
      
      act(() => {
        result.current.setCanvasState(prev => ({
          ...prev,
          zoom: 2,
          panX: 100
        }));
      });
      
      expect(result.current.canvasState.zoom).toBe(2);
      expect(result.current.canvasState.panX).toBe(100);
      expect(result.current.canvasState.panY).toBe(0); // Should preserve unchanged values
    });
  });

  describe('updateCanvasState', () => {
    it('should update canvas state with partial updates', () => {
      const { result } = renderHook(() => useCanvasState());
      
      act(() => {
        result.current.updateCanvasState({ zoom: 1.5, panX: 50 });
      });
      
      expect(result.current.canvasState.zoom).toBe(1.5);
      expect(result.current.canvasState.panX).toBe(50);
      expect(result.current.canvasState.panY).toBe(0); // Should preserve unchanged values
    });
  });
});
