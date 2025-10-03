import React from 'react';
import { FlowStep } from '../types';

interface FlowNodeProps {
  step: FlowStep;
  isSelected: boolean;
  isHovered: boolean;
  isConnectionTarget: boolean;
  isDragging: boolean;
  showConnectionHandles: boolean;
  onMouseDown: (e: React.MouseEvent, stepId: string) => void;
  onMouseEnter: (stepId: string) => void;
  onMouseLeave: () => void;
  onMouseUp: (stepId: string) => void;
  onConnectionStart: (e: React.MouseEvent, stepId: string) => void;
  onDoubleClick: (stepId: string) => void;
  onNameChange: (stepId: string, newName: string) => void;
  editingNodeId: string | null;
}

export const FlowNode: React.FC<FlowNodeProps> = ({
  step,
  isSelected,
  isHovered,
  isConnectionTarget,
  isDragging,
  showConnectionHandles,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onConnectionStart,
  onDoubleClick,
  onNameChange,
  editingNodeId,
}) => {
  const isEditing = editingNodeId === step.id;

  return (
    <div
      className={`absolute w-32 h-20 rounded-lg shadow-lg cursor-pointer select-none ${
        // Disable transitions during dragging for performance
        !isDragging ? 'transition-all duration-200' : ''
      } ${
        isSelected 
          ? 'bg-blue-600 border-4 border-blue-700 ring-4 ring-blue-300 shadow-xl scale-105' 
          : isHovered && isConnectionTarget
          ? 'bg-green-500 border-4 border-green-600 ring-4 ring-green-300 shadow-xl'
          : isConnectionTarget
          ? 'bg-blue-500 border-2 border-blue-400 ring-2 ring-blue-200'
          : 'bg-blue-500 border-2 border-blue-400'
      }`}
      style={{
        left: step.x,
        top: step.y,
      }}
      onMouseDown={(e) => onMouseDown(e, step.id)}
      onDoubleClick={() => onDoubleClick(step.id)}
      onMouseEnter={() => onMouseEnter(step.id)}
      onMouseLeave={onMouseLeave}
      onMouseUp={() => isConnectionTarget && onMouseUp(step.id)}
    >
      {/* Connection handles - visible only when not connecting or when this is the source */}
      {showConnectionHandles && (
        <>
          {/* Top handle */}
          <div
            className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full shadow-sm left-1/2 -top-1.5 transform -translate-x-1/2 cursor-crosshair hover:w-4 hover:h-4 hover:-top-2 hover:left-1/2 hover:-translate-x-1/2"
            onMouseDown={(e) => onConnectionStart(e, step.id)}
          />
          
          {/* Right handle */}
          <div
            className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full shadow-sm -right-1.5 top-1/2 transform -translate-y-1/2 cursor-crosshair hover:w-4 hover:h-4 hover:-right-2 hover:top-1/2 hover:-translate-y-1/2"
            onMouseDown={(e) => onConnectionStart(e, step.id)}
          />
          
          {/* Bottom handle */}
          <div
            className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full shadow-sm left-1/2 -bottom-1.5 transform -translate-x-1/2 cursor-crosshair hover:w-4 hover:h-4 hover:-bottom-2 hover:left-1/2 hover:-translate-x-1/2"
            onMouseDown={(e) => onConnectionStart(e, step.id)}
          />
          
          {/* Left handle */}
          <div
            className="absolute w-3 h-3 bg-blue-600 border border-white rounded-full shadow-sm -left-1.5 top-1/2 transform -translate-y-1/2 cursor-crosshair hover:w-4 hover:h-4 hover:-left-2 hover:top-1/2 hover:-translate-y-1/2"
            onMouseDown={(e) => onConnectionStart(e, step.id)}
          />
        </>
      )}
      
      {/* Node content */}
      <div className="p-2 h-full flex items-center justify-center text-white text-sm font-medium pointer-events-none">
        {isEditing ? (
          <input
            type="text"
            defaultValue={step.name}
            className="bg-transparent text-white text-center text-sm font-medium border-none outline-none w-full pointer-events-auto"
            autoFocus
            onBlur={(e) => {
              onNameChange(step.id, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onNameChange(step.id, e.currentTarget.value);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-center">{step.name}</span>
        )}
      </div>
    </div>
  );
};
