import React from 'react';

import { FlowStep, ConnectionState } from '../types';

interface FlowNodeProps {
  step: FlowStep;
  isSelected: boolean;
  isHovered: boolean;
  isConnectionTarget: boolean;
  isDragging: boolean;
  isEditing: boolean;
  isCurrentStep?: boolean; // For status tracking highlighting
  readOnly?: boolean; // Hide connection dots in read-only mode
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onDoubleClick: (nodeId: string) => void;
  onMouseEnter: (nodeId: string) => void;
  onMouseLeave: () => void;
  onMouseUp: (nodeId: string) => void;
  onConnectionStart: (e: React.MouseEvent, nodeId: string) => void;
  onNameChange: (nodeId: string, name: string) => void;
  onEditingEnd: () => void;
  connectionState: ConnectionState;
  // Touch event handlers
  onTouchStart?: (e: React.TouchEvent, nodeId: string) => void;
  onTouchMove?: (e: React.TouchEvent, nodeId: string) => void;
  onTouchEnd?: (e: React.TouchEvent, nodeId: string) => void;
  onConnectionTouchStart?: (e: React.TouchEvent, nodeId: string) => void;
}

export const FlowNode: React.FC<FlowNodeProps> = ({
  step,
  isSelected,
  isHovered,
  isConnectionTarget,
  isDragging,
  isEditing: _isEditing,
  isCurrentStep = false,
  readOnly = false,
  onMouseDown,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onConnectionStart,
  onNameChange: _onNameChange,
  onEditingEnd: _onEditingEnd,
  connectionState,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onConnectionTouchStart,
}) => {
  // Inline editing has been replaced with modal-based editing
  // These variables are kept for backward compatibility
  return (
    <div
      data-flow-node={step.id}
      className={`absolute h-24 w-36 cursor-pointer touch-manipulation select-none rounded-lg shadow-lg ${
        // Disable transitions during dragging for performance
        !isDragging ? 'transition-all duration-200' : ''
      } ${
        isCurrentStep
          ? 'border-4 border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/50 ring-4 ring-primary/30'
          : isSelected
            ? 'scale-105 border-4 border-blue-700 bg-blue-600 shadow-xl ring-4 ring-blue-300'
            : isHovered && isConnectionTarget
              ? 'border-4 border-green-600 bg-green-500 shadow-xl ring-4 ring-green-300'
              : isConnectionTarget
                ? 'border-2 border-blue-400 bg-blue-500 ring-2 ring-blue-200'
                : 'border-2 border-blue-400 bg-blue-500'
      }`}
      style={{
        left: step.x,
        top: step.y,
      }}
      onMouseDown={e => onMouseDown(e, step.id)}
      onDoubleClick={() => onDoubleClick(step.id)}
      onMouseEnter={() => onMouseEnter(step.id)}
      onMouseLeave={onMouseLeave}
      onMouseUp={() => isConnectionTarget && onMouseUp(step.id)}
      onTouchStart={e => onTouchStart?.(e, step.id)}
      onTouchMove={e => onTouchMove?.(e, step.id)}
      onTouchEnd={e => onTouchEnd?.(e, step.id)}
    >
      {/* Connection handles - visible only when not connecting or when this is the source, and not in read-only mode */}
      {!readOnly &&
        (!connectionState.isConnecting ||
          connectionState.fromNodeId === step.id) && (
          <>
            {/* Top handle */}
            <div
              data-connection-handle="true"
              className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 transform cursor-crosshair touch-manipulation rounded-full border border-white bg-blue-600 shadow-sm hover:-top-2.5 hover:left-1/2 hover:h-5 hover:w-5 hover:-translate-x-1/2 sm:-top-1.5 sm:h-3 sm:w-3 sm:hover:-top-2 sm:hover:h-4 sm:hover:w-4"
              onMouseDown={e => onConnectionStart(e, step.id)}
              onTouchStart={e => onConnectionTouchStart?.(e, step.id)}
            />

            {/* Right handle */}
            <div
              data-connection-handle="true"
              className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-crosshair touch-manipulation rounded-full border border-white bg-blue-600 shadow-sm hover:-right-2.5 hover:top-1/2 hover:h-5 hover:w-5 hover:-translate-y-1/2 sm:-right-1.5 sm:h-3 sm:w-3 sm:hover:-right-2 sm:hover:h-4 sm:hover:w-4"
              onMouseDown={e => onConnectionStart(e, step.id)}
              onTouchStart={e => onConnectionTouchStart?.(e, step.id)}
            />

            {/* Bottom handle */}
            <div
              data-connection-handle="true"
              className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 transform cursor-crosshair touch-manipulation rounded-full border border-white bg-blue-600 shadow-sm hover:-bottom-2.5 hover:left-1/2 hover:h-5 hover:w-5 hover:-translate-x-1/2 sm:-bottom-1.5 sm:h-3 sm:w-3 sm:hover:-bottom-2 sm:hover:h-4 sm:hover:w-4"
              onMouseDown={e => onConnectionStart(e, step.id)}
              onTouchStart={e => onConnectionTouchStart?.(e, step.id)}
            />

            {/* Left handle */}
            <div
              data-connection-handle="true"
              className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-crosshair touch-manipulation rounded-full border border-white bg-blue-600 shadow-sm hover:-left-2.5 hover:top-1/2 hover:h-5 hover:w-5 hover:-translate-y-1/2 sm:-left-1.5 sm:h-3 sm:w-3 sm:hover:-left-2 sm:hover:h-4 sm:hover:w-4"
              onMouseDown={e => onConnectionStart(e, step.id)}
              onTouchStart={e => onConnectionTouchStart?.(e, step.id)}
            />
          </>
        )}

      {/* Node content */}
      <div
        className={`pointer-events-none flex h-full w-full items-center justify-center overflow-hidden p-2 text-sm font-medium ${
          isCurrentStep ? 'text-primary-foreground' : 'text-white'
        }`}
      >
        <div className="min-w-0 max-w-full text-center">
          <div className="line-clamp-2" title={step.name || 'Unnamed Step'}>
            {step.name || 'Unnamed Step'}
          </div>
          {isCurrentStep && (
            <div className="mt-1 text-xs opacity-90">Current Step</div>
          )}
        </div>
      </div>
    </div>
  );
};
