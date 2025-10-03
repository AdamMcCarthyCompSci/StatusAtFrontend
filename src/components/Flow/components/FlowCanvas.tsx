import React, { useRef, useEffect, useState } from 'react';
import { FlowStep, FlowConnection, CanvasState, DragState, ConnectionState } from '../types';
import { FlowNode } from './FlowNode';
import { FlowConnections } from './FlowConnections';
import { screenToWorld } from '../utils';

interface FlowCanvasProps {
  steps: FlowStep[];
  connections: FlowConnection[];
  canvasState: CanvasState;
  dragState: DragState;
  connectionState: ConnectionState;
  selectedNodeId: string | null;
  editingNodeId: string | null;
  hoveredNodeId: string | null;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: () => void;
  onNodeMouseDown: (e: React.MouseEvent, stepId: string) => void;
  onNodeMouseEnter: (stepId: string) => void;
  onNodeMouseLeave: () => void;
  onNodeMouseUp: (stepId: string) => void;
  onConnectionStart: (e: React.MouseEvent, stepId: string) => void;
  onConnectionClick: (connectionId: string) => void;
  onNodeDoubleClick: (stepId: string) => void;
  onNodeNameChange: (stepId: string, newName: string) => void;
  containerWidth: number;
  containerHeight: number;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  steps,
  connections,
  canvasState,
  dragState,
  connectionState,
  selectedNodeId,
  editingNodeId,
  hoveredNodeId,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onNodeMouseDown,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onNodeMouseUp,
  onConnectionStart,
  onConnectionClick,
  onNodeDoubleClick,
  onNodeNameChange,
  containerWidth,
  containerHeight,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Handle wheel events for zooming
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Wheel handling will be managed by parent component
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const getCursorStyle = (): string => {
    if (connectionState.isConnecting) return 'crosshair';
    if (dragState.isDragging && dragState.dragType === 'canvas') return 'grabbing';
    if (dragState.isDragging && dragState.dragType === 'node') return 'grabbing';
    return 'grab';
  };

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 overflow-hidden bg-gray-50 dark:bg-gray-900"
      style={{ 
        cursor: getCursorStyle(),
        width: containerWidth,
        height: containerHeight,
      }}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * canvasState.zoom}px ${20 * canvasState.zoom}px`,
          backgroundPosition: `${canvasState.panX}px ${canvasState.panY}px`,
        }}
      />
      
      {/* Canvas content */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Render connections */}
        <FlowConnections
          steps={steps}
          connections={connections}
          connectionState={connectionState}
          onConnectionClick={onConnectionClick}
        />
        
        {/* Render nodes */}
        {steps.map((step) => {
          const isSelected = selectedNodeId === step.id;
          const isHovered = hoveredNodeId === step.id;
          const isConnectionTarget = connectionState.isConnecting && connectionState.fromNodeId !== step.id;
          const isDragging = dragState.isDragging && dragState.draggedNodeId === step.id;
          const showConnectionHandles = !connectionState.isConnecting || connectionState.fromNodeId === step.id;
          
          return (
            <FlowNode
              key={step.id}
              step={step}
              isSelected={isSelected}
              isHovered={isHovered}
              isConnectionTarget={isConnectionTarget}
              isDragging={isDragging}
              showConnectionHandles={showConnectionHandles}
              onMouseDown={onNodeMouseDown}
              onMouseEnter={onNodeMouseEnter}
              onMouseLeave={onNodeMouseLeave}
              onMouseUp={onNodeMouseUp}
              onConnectionStart={onConnectionStart}
              onDoubleClick={onNodeDoubleClick}
              onNameChange={onNodeNameChange}
              editingNodeId={editingNodeId}
            />
          );
        })}
      </div>
    </div>
  );
};
