import React from 'react';
import { FlowStep, CanvasState, MinimapBounds } from '../types';
import { calculateMinimapBounds } from '../utils';

interface FlowMinimapProps {
  steps: FlowStep[];
  canvasState: CanvasState;
  containerWidth: number;
  containerHeight: number;
  onNavigate: (x: number, y: number) => void;
}

export const FlowMinimap: React.FC<FlowMinimapProps> = ({
  steps,
  canvasState,
  containerWidth,
  containerHeight,
  onNavigate,
}) => {
  const minimapWidth = 200;
  const minimapHeight = 150;
  
  const bounds = calculateMinimapBounds(steps);
  const scale = Math.min(minimapWidth / bounds.width, minimapHeight / bounds.height);
  
  // Calculate viewport in world coordinates
  const viewportWorldX = -canvasState.panX / canvasState.zoom;
  const viewportWorldY = -canvasState.panY / canvasState.zoom;
  const viewportWorldWidth = containerWidth / canvasState.zoom;
  const viewportWorldHeight = containerHeight / canvasState.zoom;
  
  // Convert to minimap coordinates
  const viewportMinimapX = (viewportWorldX - bounds.minX) * scale;
  const viewportMinimapY = (viewportWorldY - bounds.minY) * scale;
  const viewportMinimapWidth = viewportWorldWidth * scale;
  const viewportMinimapHeight = viewportWorldHeight * scale;
  
  // Check if viewport is out of bounds
  const isOutOfBounds = (
    viewportMinimapX + viewportMinimapWidth < 0 ||
    viewportMinimapX > minimapWidth ||
    viewportMinimapY + viewportMinimapHeight < 0 ||
    viewportMinimapY > minimapHeight
  );
  
  const handleMinimapClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert minimap coordinates to world coordinates
    const worldX = bounds.minX + clickX / scale;
    const worldY = bounds.minY + clickY / scale;
    
    // Calculate new pan values to center the clicked point
    const newPanX = containerWidth / 2 - worldX * canvasState.zoom;
    const newPanY = containerHeight / 2 - worldY * canvasState.zoom;
    
    onNavigate(newPanX, newPanY);
  };
  
  return (
    <div className="fixed top-40 right-4 bg-background/90 backdrop-blur border rounded-lg p-2 shadow-lg z-10 select-none">
      <div className="text-xs font-medium mb-2 text-foreground">Minimap</div>
      <div 
        className="relative bg-muted rounded cursor-pointer overflow-hidden"
        style={{ width: minimapWidth, height: minimapHeight }}
        onClick={handleMinimapClick}
      >
        {/* Render nodes */}
        {steps.map((step) => {
          const nodeX = (step.x - bounds.minX) * scale;
          const nodeY = (step.y - bounds.minY) * scale;
          const nodeWidth = 128 * scale;
          const nodeHeight = 80 * scale;
          
          return (
            <div
              key={step.id}
              className="absolute bg-blue-500 rounded-sm"
              style={{
                left: nodeX,
                top: nodeY,
                width: Math.max(nodeWidth, 2),
                height: Math.max(nodeHeight, 2),
              }}
            />
          );
        })}
        
        {/* Viewport indicator */}
        {!isOutOfBounds && (
          <div
            className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none"
            style={{
              left: Math.max(0, viewportMinimapX),
              top: Math.max(0, viewportMinimapY),
              width: Math.min(viewportMinimapWidth, minimapWidth - Math.max(0, viewportMinimapX)),
              height: Math.min(viewportMinimapHeight, minimapHeight - Math.max(0, viewportMinimapY)),
            }}
          />
        )}
        
        {/* Out of bounds indicators */}
        {isOutOfBounds && (
          <>
            {/* Red overlay */}
            <div className="absolute inset-0 bg-red-500/30 pointer-events-none" />
            
            {/* Directional arrows */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-red-600 font-bold text-lg">
                {viewportMinimapX + viewportMinimapWidth < 0 && '←'}
                {viewportMinimapX > minimapWidth && '→'}
                {viewportMinimapY + viewportMinimapHeight < 0 && '↑'}
                {viewportMinimapY > minimapHeight && '↓'}
                {viewportMinimapX + viewportMinimapWidth < 0 && viewportMinimapY + viewportMinimapHeight < 0 && '↖'}
                {viewportMinimapX > minimapWidth && viewportMinimapY + viewportMinimapHeight < 0 && '↗'}
                {viewportMinimapX + viewportMinimapWidth < 0 && viewportMinimapY > minimapHeight && '↙'}
                {viewportMinimapX > minimapWidth && viewportMinimapY > minimapHeight && '↘'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
