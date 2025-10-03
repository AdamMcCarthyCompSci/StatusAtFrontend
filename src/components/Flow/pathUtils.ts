import { FlowStep, CanvasState } from './types';
import { findBestConnectionPoints } from './utils';

/**
 * Generate smart orthogonal path that avoids nodes
 */
export const generateOrthogonalPath = (fromStepId: string, toStepId: string, steps: FlowStep[]): string => {
  const fromNode = steps.find(s => s.id === fromStepId);
  const toNode = steps.find(s => s.id === toStepId);
  
  if (!fromNode || !toNode) return 'M 0 0 L 0 0';
  
  // Find the best connection points
  const connection = findBestConnectionPoints(fromNode, toNode);
  const startX = connection.from.x;
  const startY = connection.from.y;
  const endX = connection.to.x;
  const endY = connection.to.y;
  
  // Node dimensions
  const nodeWidth = 128;
  const nodeHeight = 80;
  const padding = 20; // Extra space around nodes
  
  // Get all nodes except the source and target
  const obstacleNodes = steps.filter(step => step.id !== fromStepId && step.id !== toStepId);
  
  // Check if a horizontal line intersects with any node
  const lineIntersectsNode = (lineY: number, lineX1: number, lineX2: number) => {
    const minX = Math.min(lineX1, lineX2);
    const maxX = Math.max(lineX1, lineX2);
    
    return obstacleNodes.some(node => {
      const nodeLeft = node.x - padding;
      const nodeRight = node.x + nodeWidth + padding;
      const nodeTop = node.y - padding;
      const nodeBottom = node.y + nodeHeight + padding;
      
      // Check if line passes through node vertically and horizontally overlaps
      return lineY >= nodeTop && lineY <= nodeBottom && 
             maxX >= nodeLeft && minX <= nodeRight;
    });
  };
  
  // Check if a vertical line intersects with any node
  const verticalLineIntersectsNode = (lineX: number, lineY1: number, lineY2: number) => {
    const minY = Math.min(lineY1, lineY2);
    const maxY = Math.max(lineY1, lineY2);
    
    return obstacleNodes.some(node => {
      const nodeLeft = node.x - padding;
      const nodeRight = node.x + nodeWidth + padding;
      const nodeTop = node.y - padding;
      const nodeBottom = node.y + nodeHeight + padding;
      
      // Check if line passes through node horizontally and vertically overlaps
      return lineX >= nodeLeft && lineX <= nodeRight && 
             maxY >= nodeTop && minY <= nodeBottom;
    });
  };
  
  // Try different routing strategies with more direct approaches
  
  // For head-on attacks, use shorter intermediate segments
  const minOffset = 30; // Minimum distance before turning
  
  // Get connection info for routing decisions
  const sourceNode = steps.find(s => s.id === fromStepId)!;
  const targetNode = steps.find(s => s.id === toStepId)!;
  const connectionInfo = findBestConnectionPoints(sourceNode, targetNode);
  
  // Strategy 1a: Horizontal first with shorter segments for direct approach
  if ((connectionInfo.fromSide === 'right' && connectionInfo.toSide === 'left') ||
      (connectionInfo.fromSide === 'left' && connectionInfo.toSide === 'right')) {
    // Direct horizontal approach - minimal vertical deviation
    const midX = startX + (endX - startX) * 0.7; // Closer to target
    if (!lineIntersectsNode(startY, startX, midX) && 
        !verticalLineIntersectsNode(midX, startY, endY) && 
        !lineIntersectsNode(endY, midX, endX)) {
      return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    }
  }
  
  // Strategy 1b: Vertical first with shorter segments for direct approach  
  if ((connectionInfo.fromSide === 'top' && connectionInfo.toSide === 'bottom') ||
      (connectionInfo.fromSide === 'bottom' && connectionInfo.toSide === 'top')) {
    // Direct vertical approach - minimal horizontal deviation
    const midY = startY + (endY - startY) * 0.7; // Closer to target
    if (!verticalLineIntersectsNode(startX, startY, midY) && 
        !lineIntersectsNode(midY, startX, endX) && 
        !verticalLineIntersectsNode(endX, midY, endY)) {
      return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
    }
  }
  
  // Strategy 2: Standard L-shapes with minimum offset for cleaner approach
  const offsetDistance = Math.max(minOffset, Math.abs(endX - startX) * 0.3);
  
  // Horizontal first
  const midX1 = connectionInfo.fromSide === 'right' ? startX + offsetDistance : startX - offsetDistance;
  if (!lineIntersectsNode(startY, startX, midX1) && 
      !verticalLineIntersectsNode(midX1, startY, endY) && 
      !lineIntersectsNode(endY, midX1, endX)) {
    return `M ${startX} ${startY} L ${midX1} ${startY} L ${midX1} ${endY} L ${endX} ${endY}`;
  }
  
  // Vertical first  
  const midY1 = connectionInfo.fromSide === 'bottom' ? startY + offsetDistance : startY - offsetDistance;
  if (!verticalLineIntersectsNode(startX, startY, midY1) && 
      !lineIntersectsNode(midY1, startX, endX) && 
      !verticalLineIntersectsNode(endX, midY1, endY)) {
    return `M ${startX} ${startY} L ${startX} ${midY1} L ${endX} ${midY1} L ${endX} ${endY}`;
  }
  
  // Strategy 3: Go around obstacles - try going above/below
  if (sourceNode && targetNode) {
    // Find the highest and lowest points of nodes in the path
    const relevantNodes = obstacleNodes.filter(node => {
      const nodeLeft = node.x - padding;
      const nodeRight = node.x + nodeWidth + padding;
      const pathLeft = Math.min(startX, endX);
      const pathRight = Math.max(startX, endX);
      
      // Node is in the horizontal path area
      return nodeRight >= pathLeft && nodeLeft <= pathRight;
    });
    
    if (relevantNodes.length > 0) {
      const highestPoint = Math.min(...relevantNodes.map(n => n.y)) - padding - 10;
      const lowestPoint = Math.max(...relevantNodes.map(n => n.y + nodeHeight)) + padding + 10;
      
      // Try going above obstacles
      if (highestPoint > Math.max(sourceNode.y, targetNode.y) + nodeHeight + 10) {
        const routeY = highestPoint;
        return `M ${startX} ${startY} L ${startX} ${routeY} L ${endX} ${routeY} L ${endX} ${endY}`;
      }
      
      // Try going below obstacles
      if (lowestPoint < Math.min(sourceNode.y, targetNode.y) - 10) {
        const routeY = lowestPoint;
        return `M ${startX} ${startY} L ${startX} ${routeY} L ${endX} ${routeY} L ${endX} ${endY}`;
      }
    }
  }
  
  // Strategy 4: Go around obstacles - try going left/right
  if (sourceNode && targetNode) {
    const relevantNodes = obstacleNodes.filter(node => {
      const nodeTop = node.y - padding;
      const nodeBottom = node.y + nodeHeight + padding;
      const pathTop = Math.min(startY, endY);
      const pathBottom = Math.max(startY, endY);
      
      // Node is in the vertical path area
      return nodeBottom >= pathTop && nodeTop <= pathBottom;
    });
    
    if (relevantNodes.length > 0) {
      const leftmostPoint = Math.min(...relevantNodes.map(n => n.x)) - padding - 10;
      const rightmostPoint = Math.max(...relevantNodes.map(n => n.x + nodeWidth)) + padding + 10;
      
      // Try going left of obstacles
      if (leftmostPoint > Math.max(sourceNode.x + nodeWidth, targetNode.x + nodeWidth) + 10) {
        const routeX = leftmostPoint;
        return `M ${startX} ${startY} L ${routeX} ${startY} L ${routeX} ${endY} L ${endX} ${endY}`;
      }
      
      // Try going right of obstacles
      if (rightmostPoint < Math.min(sourceNode.x, targetNode.x) - 10) {
        const routeX = rightmostPoint;
        return `M ${startX} ${startY} L ${routeX} ${startY} L ${routeX} ${endY} L ${endX} ${endY}`;
      }
    }
  }
  
  // Fallback: Simple direct path with offset to avoid most overlaps
  const offsetY = startY + (endY > startY ? -30 : 30);
  return `M ${startX} ${startY} L ${startX} ${offsetY} L ${endX} ${offsetY} L ${endX} ${endY}`;
};

/**
 * Convert path to screen coordinates
 */
export const convertPathToScreen = (pathData: string, canvasState: CanvasState): string => {
  return pathData.replace(/([ML])\s*([0-9.-]+)\s+([0-9.-]+)/g, (_, command, x, y) => {
    const screenX = parseFloat(x) * canvasState.zoom + canvasState.panX;
    const screenY = parseFloat(y) * canvasState.zoom + canvasState.panY;
    return `${command} ${screenX} ${screenY}`;
  });
};
