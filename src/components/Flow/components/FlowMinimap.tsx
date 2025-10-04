import React from 'react';
import { ArrowUp, ArrowDown, ArrowRight, ArrowLeftIcon } from 'lucide-react';
import { FlowStep, CanvasState } from '../types';
import { NODE_DIMENSIONS } from '../constants';

interface FlowMinimapProps {
  steps: FlowStep[];
  canvasRef: React.RefObject<HTMLDivElement | null>;
  canvasState: CanvasState;
  onFitToView: (steps: FlowStep[], width: number, height: number) => void;
  onSetCanvasState: (updater: (prev: CanvasState) => CanvasState) => void;
}

export const FlowMinimap: React.FC<FlowMinimapProps> = ({
  steps,
  canvasRef,
  canvasState,
  onFitToView,
  onSetCanvasState,
}) => {
  if (steps.length === 0) return null;

  const minimapSize = 200;
  const padding = 20;
  
  // Calculate content bounds
  const minX = Math.min(...steps.map(s => s.x));
  const maxX = Math.max(...steps.map(s => s.x + 128));
  const minY = Math.min(...steps.map(s => s.y));
  const maxY = Math.max(...steps.map(s => s.y + 80));
  
  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  
  // Calculate scale to fit content in minimap
  const scale = Math.min(
    (minimapSize - padding * 2) / contentWidth,
    (minimapSize - padding * 2) / contentHeight
  );

  // Calculate viewport in world coordinates
  const rect = canvasRef.current?.getBoundingClientRect();
  if (!rect) return null;
  
  const viewportWorldX = -canvasState.panX / canvasState.zoom;
  const viewportWorldY = -canvasState.panY / canvasState.zoom;
  const viewportWorldWidth = rect.width / canvasState.zoom;
  const viewportWorldHeight = rect.height / canvasState.zoom;
  
  // Convert viewport to minimap coordinates
  const viewportMinimapX = (viewportWorldX - minX) * scale + padding;
  const viewportMinimapY = (viewportWorldY - minY) * scale + padding;
  const viewportMinimapWidth = viewportWorldWidth * scale;
  const viewportMinimapHeight = viewportWorldHeight * scale;

  // Check if viewport is completely out of bounds (no overlap with minimap)
  const isCompletelyOutOfBounds = 
    viewportMinimapX + viewportMinimapWidth < padding ||
    viewportMinimapX > minimapSize - padding ||
    viewportMinimapY + viewportMinimapHeight < padding ||
    viewportMinimapY > minimapSize - padding;

  // Get direction indicators for out of bounds
  const getDirectionIndicators = () => {
    const indicators = [];
    const contentCenterX = (minX + maxX) / 2;
    const contentCenterY = (minY + maxY) / 2;
    
    if (viewportWorldX + viewportWorldWidth / 2 < contentCenterX) {
      indicators.push(<ArrowRight key="right" className="h-4 w-4 animate-pulse" />);
    }
    if (viewportWorldX + viewportWorldWidth / 2 > contentCenterX) {
      indicators.push(<ArrowLeftIcon key="left" className="h-4 w-4 animate-pulse" />);
    }
    if (viewportWorldY + viewportWorldHeight / 2 < contentCenterY) {
      indicators.push(<ArrowDown key="down" className="h-4 w-4 animate-pulse" />);
    }
    if (viewportWorldY + viewportWorldHeight / 2 > contentCenterY) {
      indicators.push(<ArrowUp key="up" className="h-4 w-4 animate-pulse" />);
    }
    
    return indicators;
  };

  const handleMinimapClick = (e: React.MouseEvent) => {
    if (isCompletelyOutOfBounds) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        onFitToView(steps, rect.width, rect.height);
      }
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const worldX = (clickX - padding) / scale + minX;
    const worldY = (clickY - padding) / scale + minY;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    onSetCanvasState(prev => ({
      ...prev,
      panX: canvasRect.width / 2 - worldX * prev.zoom,
      panY: canvasRect.height / 2 - worldY * prev.zoom,
    }));
  };

  return (
    <div className="fixed top-48 right-4 bg-background/90 backdrop-blur border rounded-lg p-2 shadow-lg z-10 select-none">
      <div className="text-xs text-muted-foreground mb-2 text-center">
        {isCompletelyOutOfBounds ? 'Minimap - Out of View' : 'Minimap'}
      </div>
      <div 
        className="relative bg-muted rounded cursor-pointer overflow-hidden"
        style={{ width: minimapSize, height: minimapSize }}
        onClick={handleMinimapClick}
        title={isCompletelyOutOfBounds ? 'Click to fit view' : 'Click to navigate'}
      >
        {/* Content nodes */}
        {steps.map(step => {
          const x = (step.x - minX) * scale + padding;
          const y = (step.y - minY) * scale + padding;
          const width = NODE_DIMENSIONS.WIDTH * scale;
          const height = NODE_DIMENSIONS.HEIGHT * scale;
          
          return (
            <div
              key={step.id}
              className="absolute bg-primary rounded"
              style={{
                left: x,
                top: y,
                width: Math.max(2, width),
                height: Math.max(2, height),
              }}
            />
          );
        })}
        
        {/* Viewport indicator or out-of-bounds overlay */}
        {isCompletelyOutOfBounds ? (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-red-600 font-medium mb-1">Out of View</div>
              <div className="flex gap-1 justify-center">
                {getDirectionIndicators()}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
            style={{
              left: Math.max(0, Math.min(viewportMinimapX, minimapSize)),
              top: Math.max(0, Math.min(viewportMinimapY, minimapSize)),
              width: Math.max(0, Math.min(
                viewportMinimapX < 0 ? viewportMinimapWidth + viewportMinimapX : viewportMinimapWidth,
                minimapSize - Math.max(0, viewportMinimapX)
              )),
              height: Math.max(0, Math.min(
                viewportMinimapY < 0 ? viewportMinimapHeight + viewportMinimapY : viewportMinimapHeight,
                minimapSize - Math.max(0, viewportMinimapY)
              )),
            }}
          />
        )}
      </div>
    </div>
  );
};
