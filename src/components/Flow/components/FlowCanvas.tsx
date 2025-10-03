import React from 'react';
import { FlowStep, FlowTransition, DragState, ConnectionState, CanvasState } from '../types';
import { FlowMinimap } from './FlowMinimap';
import { FlowConnections } from './FlowConnections';
import { FlowNode } from './FlowNode';

interface FlowCanvasProps {
  steps: FlowStep[];
  transitions: FlowTransition[];
  dragState: DragState;
  connectionState: ConnectionState;
  canvasState: CanvasState;
  selectedNodeId: string | null;
  editingNodeId: string | null;
  hoveredNodeId: string | null;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: () => void;
  onNodeMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onNodeDoubleClick: (nodeId: string) => void;
  onNodeMouseEnter: (nodeId: string) => void;
  onNodeMouseLeave: () => void;
  onConnectionEnd: (nodeId: string) => void;
  onConnectionStart: (e: React.MouseEvent, nodeId: string) => void;
  onNodeNameChange: (nodeId: string, name: string) => void;
  onEditingEnd: () => void;
  onDeleteTransition: (transitionId: string) => void;
  onFitToView: (steps: FlowStep[], width: number, height: number) => void;
  onSetCanvasState: (updater: (prev: CanvasState) => CanvasState) => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  steps,
  transitions,
  dragState,
  connectionState,
  canvasState,
  selectedNodeId,
  editingNodeId,
  hoveredNodeId,
  canvasRef,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onNodeMouseDown,
  onNodeDoubleClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onConnectionEnd,
  onConnectionStart,
  onNodeNameChange,
  onEditingEnd,
  onDeleteTransition,
  onFitToView,
  onSetCanvasState,
}) => {
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Minimap - Fixed position outside transformed canvas */}
      <FlowMinimap
        steps={steps}
        canvasRef={canvasRef}
        canvasState={canvasState}
        onFitToView={onFitToView}
        onSetCanvasState={onSetCanvasState}
      />
      
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
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
      >
        {/* SVG for connections */}
        <FlowConnections
          steps={steps}
          transitions={transitions}
          connectionState={connectionState}
          canvasState={canvasState}
          onDeleteTransition={onDeleteTransition}
        />

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
            const isEditing = editingNodeId === step.id;
            
            return (
              <FlowNode
                key={step.id}
                step={step}
                isSelected={isSelected}
                isHovered={isHovered}
                isConnectionTarget={isConnectionTarget}
                isDragging={isDragging}
                isEditing={isEditing}
                onMouseDown={onNodeMouseDown}
                onDoubleClick={onNodeDoubleClick}
                onMouseEnter={onNodeMouseEnter}
                onMouseLeave={onNodeMouseLeave}
                onMouseUp={onConnectionEnd}
                onConnectionStart={onConnectionStart}
                onNameChange={onNodeNameChange}
                onEditingEnd={onEditingEnd}
                connectionState={connectionState}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
