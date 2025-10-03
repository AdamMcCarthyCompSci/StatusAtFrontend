import React from 'react';
import { FlowStep, FlowConnection, ConnectionState } from '../types';
import { findBestConnectionPoints, createOrthogonalPath, getArrowDirection, getNodeConnectionPoints } from '../utils';

interface FlowConnectionsProps {
  steps: FlowStep[];
  connections: FlowConnection[];
  connectionState: ConnectionState;
  onConnectionClick: (connectionId: string) => void;
}

export const FlowConnections: React.FC<FlowConnectionsProps> = ({
  steps,
  connections,
  connectionState,
  onConnectionClick,
}) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* Arrow markers */}
        <marker
          id="arrowhead-right"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3b82f6"
          />
        </marker>
        <marker
          id="arrowhead-left"
          markerWidth="10"
          markerHeight="7"
          refX="1"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="10 0, 0 3.5, 10 7"
            fill="#3b82f6"
          />
        </marker>
        <marker
          id="arrowhead-up"
          markerWidth="7"
          markerHeight="10"
          refX="3.5"
          refY="1"
          orient="auto"
        >
          <polygon
            points="0 10, 3.5 0, 7 10"
            fill="#3b82f6"
          />
        </marker>
        <marker
          id="arrowhead-down"
          markerWidth="7"
          markerHeight="10"
          refX="3.5"
          refY="9"
          orient="auto"
        >
          <polygon
            points="0 0, 3.5 10, 7 0"
            fill="#3b82f6"
          />
        </marker>
      </defs>

      {/* Render existing connections */}
      {connections.map((connection) => {
        const fromStep = steps.find(s => s.id === connection.fromStepId);
        const toStep = steps.find(s => s.id === connection.toStepId);
        
        if (!fromStep || !toStep) return null;
        
        const route = findBestConnectionPoints(fromStep, toStep);
        const pathData = createOrthogonalPath(
          route.from,
          route.to,
          route.fromSide,
          route.toSide,
          steps,
          connection.fromStepId,
          connection.toStepId
        );
        const arrowId = getArrowDirection(route.toSide);
        
        return (
          <path
            key={connection.id}
            d={pathData}
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            markerEnd={`url(#${arrowId})`}
            className="cursor-pointer pointer-events-auto hover:stroke-blue-400"
            onClick={() => onConnectionClick(connection.id)}
          />
        );
      })}

      {/* Render temporary connection during creation */}
      {connectionState.isConnecting && connectionState.fromNodeId && connectionState.tempConnection && (
        (() => {
          const fromStep = steps.find(s => s.id === connectionState.fromNodeId);
          if (!fromStep) return null;
          
          const fromPoints = getNodeConnectionPoints(fromStep);
          const startPoint = fromPoints.right; // Default to right for temp connection
          
          return (
            <line
              x1={startPoint.x}
              y1={startPoint.y}
              x2={connectionState.tempConnection.x}
              y2={connectionState.tempConnection.y}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="pointer-events-none"
            />
          );
        })()
      )}
    </svg>
  );
};
