import React, { useState, useRef, useEffect } from 'react';

import { useFlowSteps, useFlowTransitions } from '@/hooks/useFlowBuilderQuery';
import { FlowStepAPI, FlowTransitionAPI } from '@/types/flowBuilder';

import { FlowStep, FlowTransition, DragState, ConnectionState } from './types';
import { useCanvasState } from './hooks/useCanvasState';
import { FlowCanvas } from './components/FlowCanvas';
import { FlowLoadingState } from './components/FlowLoadingState';
import { FlowErrorState } from './components/FlowErrorState';
import { StatusTrackingToolbar } from './components/StatusTrackingToolbar';
import { useTouchInteractions } from './hooks/useTouchInteractions';
import { GRID_LAYOUT } from './constants';

interface StatusTrackingViewerProps {
  tenantUuid: string;
  flowUuid: string;
  currentStepUuid: string;
  flowName: string;
  enrollmentData?: {
    current_step_name: string;
    created_at: string;
    tenant_name: string;
    identifier?: string;
  };
}

export const StatusTrackingViewer: React.FC<StatusTrackingViewerProps> = ({
  tenantUuid,
  flowUuid,
  currentStepUuid,
  flowName,
  enrollmentData,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Fetch flow data (no real-time needed for read-only view)
  const {
    data: stepsData,
    isLoading: stepsLoading,
    error: stepsError,
  } = useFlowSteps(tenantUuid, flowUuid, false);
  const {
    data: transitionsData,
    isLoading: transitionsLoading,
    error: transitionsError,
  } = useFlowTransitions(tenantUuid, flowUuid, false);

  // Canvas state management
  const {
    canvasState,
    setCanvasState,
    zoomIn,
    zoomOut,
    fitToView,
    centerOnNode,
  } = useCanvasState();

  // Minimap toggle state
  const [showMinimap, setShowMinimap] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1280; // xl breakpoint
    }
    return true;
  });

  // Convert API data to internal format
  const convertApiStepToInternal = (
    apiStep: FlowStepAPI,
    index: number
  ): FlowStep => {
    // Backend stores top-left coordinates directly (no conversion needed)
    let x, y;

    if (
      apiStep.metadata?.x !== undefined &&
      apiStep.metadata?.y !== undefined
    ) {
      // Backend already uses top-left coordinates
      x = parseInt(apiStep.metadata.x);
      y = parseInt(apiStep.metadata.y);
    } else {
      // Fallback to consistent default based on index
      x = GRID_LAYOUT.START_X + (index % 3) * 250;
      y = GRID_LAYOUT.START_Y + Math.floor(index / 3) * GRID_LAYOUT.SPACING_Y;
    }

    return {
      id: apiStep.uuid,
      name: apiStep.name,
      x,
      y,
    };
  };

  const convertApiTransitionToInternal = (
    apiTransition: FlowTransitionAPI
  ): FlowTransition => {
    return {
      id: apiTransition.uuid,
      fromStepId: apiTransition.from_step,
      toStepId: apiTransition.to_step,
    };
  };

  // Convert data - use derived state like FlowBuilder
  const steps =
    stepsData && Array.isArray(stepsData)
      ? stepsData.map((step, index) => convertApiStepToInternal(step, index))
      : [];

  const transitions =
    transitionsData && Array.isArray(transitionsData)
      ? transitionsData.map(convertApiTransitionToInternal)
      : [];

  // Track if we've done the initial fit-to-view
  const hasInitialFitRef = useRef(false);

  // Auto-fit to view when steps are loaded for the first time
  useEffect(() => {
    if (stepsData && steps.length > 0 && !hasInitialFitRef.current) {
      // Calculate viewport dimensions - canvas is fixed inset-0 top-16
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 64; // top-16 = 64px

      if (viewportWidth > 0 && viewportHeight > 0) {
        fitToView(steps, viewportWidth, viewportHeight);
        hasInitialFitRef.current = true;
      }
    }
  }, [stepsData, steps, fitToView]);

  // Canvas panning state for read-only mode
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Read-only drag and connection states
  const dragState: DragState = {
    isDragging: isPanning,
    dragType: isPanning ? 'canvas' : null,
  };

  const connectionState: ConnectionState = {
    isConnecting: false,
  };

  // Canvas interaction handlers for panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;

      setCanvasState(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY,
      }));

      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  // Touch interactions hook
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  } = useTouchInteractions({
    canvasState,
    setCanvasState,
    canvasRef,
  });

  // Global mouse event handlers for panning
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;

        setCanvasState(prev => ({
          ...prev,
          panX: prev.panX + deltaX,
          panY: prev.panY + deltaY,
        }));

        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isPanning, panStart, setCanvasState]);

  // Native wheel event listener for zoom (like FlowBuilder)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;

      setCanvasState(prev => {
        const newZoom = Math.max(0.1, Math.min(3, prev.zoom * delta));
        const zoomRatio = newZoom / prev.zoom;

        const newPanX = mouseX - (mouseX - prev.panX) * zoomRatio;
        const newPanY = mouseY - (mouseY - prev.panY) * zoomRatio;

        return {
          ...prev,
          zoom: newZoom,
          panX: newPanX,
          panY: newPanY,
        };
      });
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvasState, setCanvasState, canvasRef]);

  // Loading state
  if (stepsLoading || transitionsLoading) {
    return <FlowLoadingState />;
  }

  // Error state
  if (stepsError || transitionsError) {
    const error = stepsError || transitionsError;
    return <FlowErrorState error={error} />;
  }

  // Find current step for highlighting
  const currentStep = steps.find(step => step.id === currentStepUuid);

  return (
    <div className="fixed inset-0 top-16 flex flex-col bg-background">
      <StatusTrackingToolbar
        flowName={flowName}
        steps={steps}
        currentStep={currentStep}
        enrollmentData={enrollmentData}
        showMinimap={showMinimap}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToView={() => {
          if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            fitToView(steps, rect.width, rect.height);
          }
        }}
        onJumpToNode={(step: FlowStep) => {
          if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            centerOnNode(step, rect.width, rect.height);
          }
        }}
        onToggleMinimap={setShowMinimap}
      />

      <FlowCanvas
        canvasRef={canvasRef}
        steps={steps}
        transitions={transitions}
        dragState={dragState}
        connectionState={connectionState}
        canvasState={canvasState}
        selectedNodeId={null}
        editingNodeId={null}
        hoveredNodeId={null}
        currentStepId={currentStepUuid} // Pass current step for highlighting
        showMinimap={showMinimap}
        readOnly={true} // Hide connection dots in read-only mode
        onCanvasMouseDown={handleCanvasMouseDown}
        onCanvasMouseMove={handleCanvasMouseMove}
        onCanvasMouseUp={handleCanvasMouseUp}
        onCanvasTouchStart={handleTouchStart}
        onCanvasTouchMove={handleTouchMove}
        onCanvasTouchEnd={handleTouchEnd}
        onCanvasTouchCancel={handleTouchCancel}
        onNodeMouseDown={() => {}} // No-op
        onNodeDoubleClick={() => {}} // No-op
        onNodeMouseEnter={() => {}} // No-op
        onNodeMouseLeave={() => {}} // No-op
        onConnectionEnd={() => {}} // No-op
        onConnectionStart={() => {}} // No-op
        onNodeNameChange={() => {}} // No-op
        onEditingEnd={() => {}} // No-op
        onDeleteTransition={() => {}} // No-op
        onFitToView={fitToView}
        onSetCanvasState={setCanvasState}
      />
    </div>
  );
};
