import React from 'react';

import {
  FlowStep,
  FlowTransition,
  ConnectionState,
  CanvasState,
} from '../types';
import { findBestConnectionPoints, getNodeConnectionPoints } from '../utils';
import { generateOrthogonalPath, convertPathToScreen } from '../pathUtils';

interface FlowConnectionsProps {
  steps: FlowStep[];
  transitions: FlowTransition[];
  connectionState: ConnectionState;
  canvasState: CanvasState;
  onDeleteTransition: (transitionId: string) => void;
}

export const FlowConnections: React.FC<FlowConnectionsProps> = ({
  steps,
  transitions,
  connectionState,
  canvasState,
  onDeleteTransition,
}) => {
  return (
    <svg
      className="pointer-events-none absolute inset-0"
      style={{
        width: '100%',
        height: '100%',
        zIndex: 5,
      }}
    >
      <defs>
        {/* Right-pointing arrow */}
        <marker
          id="arrowhead-right"
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="3.5"
          orient="0"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>

        {/* Left-pointing arrow */}
        <marker
          id="arrowhead-left"
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="3.5"
          orient="180"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>

        {/* Down-pointing arrow */}
        <marker
          id="arrowhead-down"
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="3.5"
          orient="90"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>

        {/* Up-pointing arrow */}
        <marker
          id="arrowhead-up"
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="3.5"
          orient="270"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>

        {/* Temporary arrow (auto-orient) */}
        <marker
          id="arrowhead-temp"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
      </defs>

      {/* Existing connections */}
      {transitions.map(transition => {
        const fromStep = steps.find(s => s.id === transition.fromStepId);
        const toStep = steps.find(s => s.id === transition.toStepId);

        if (!fromStep || !toStep) return null;

        // Find the best connection points to determine arrow direction
        const connection = findBestConnectionPoints(fromStep, toStep);
        const pathData = generateOrthogonalPath(
          transition.fromStepId,
          transition.toStepId,
          steps
        );
        const screenPath = convertPathToScreen(pathData, canvasState);

        // Determine which arrow to use based on the target connection side
        // Arrow should point in the direction the connection is coming FROM
        let arrowId = 'arrowhead-right'; // default
        switch (connection.toSide) {
          case 'top':
            arrowId = 'arrowhead-down'; // Coming from above, so arrow points down
            break;
          case 'right':
            arrowId = 'arrowhead-left'; // Coming from left, so arrow points left
            break;
          case 'bottom':
            arrowId = 'arrowhead-up'; // Coming from below, so arrow points up
            break;
          case 'left':
            arrowId = 'arrowhead-right'; // Coming from right, so arrow points right
            break;
        }

        return (
          <g key={transition.id}>
            {/* Main connection path */}
            <path
              d={screenPath}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              markerEnd={`url(#${arrowId})`}
            />
            {/* Invisible clickable area for deletion */}
            <path
              d={screenPath}
              stroke="transparent"
              strokeWidth="12"
              fill="none"
              className="pointer-events-auto cursor-pointer"
              onClick={() => onDeleteTransition(transition.id)}
              onTouchEnd={e => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteTransition(transition.id);
              }}
            />
          </g>
        );
      })}

      {/* Temporary connection during dragging */}
      {connectionState.tempConnection &&
        connectionState.fromNodeId &&
        (() => {
          const fromNode = steps.find(s => s.id === connectionState.fromNodeId);
          if (!fromNode) return null;

          // For temporary connections, use a simple path from the best connection point
          const fromPoints = getNodeConnectionPoints(fromNode);
          const tempX = connectionState.tempConnection.toX;
          const tempY = connectionState.tempConnection.toY;

          // Choose the best connection point based on direction to cursor
          let bestPoint = fromPoints.right;
          let minDistance = Infinity;

          Object.values(fromPoints).forEach(point => {
            const distance =
              Math.abs(point.x - tempX) + Math.abs(point.y - tempY);
            if (distance < minDistance) {
              minDistance = distance;
              bestPoint = point;
            }
          });

          const pathData = `M ${bestPoint.x} ${bestPoint.y} L ${tempX} ${tempY}`;

          return (
            <path
              d={convertPathToScreen(pathData, canvasState)}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="8,4"
              fill="none"
              markerEnd="url(#arrowhead-temp)"
            />
          );
        })()}
    </svg>
  );
};
