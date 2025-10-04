import { FlowTransition, FlowStep } from './types';
import { NODE_DIMENSIONS, CONNECTION_BUFFER } from './constants';

// Generate unique ID
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Loop detection using DFS
export const wouldCreateLoop = (
  fromStepId: string, 
  toStepId: string, 
  transitions: FlowTransition[]
): boolean => {
  if (fromStepId === toStepId) return true;
  
  const visited = new Set<string>();
  const stack = [toStepId];
  
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);
    
    if (current === fromStepId) return true;
    
    const outgoingTransitions = transitions.filter(t => t.fromStepId === current);
    for (const transition of outgoingTransitions) {
      stack.push(transition.toStepId);
    }
  }
  
  return false;
};

// Get all connection points for a node (with buffer)
export const getNodeConnectionPoints = (node: FlowStep) => {
  const nodeWidth = NODE_DIMENSIONS.WIDTH;
  const nodeHeight = NODE_DIMENSIONS.HEIGHT;
  const buffer = CONNECTION_BUFFER;
  
  return {
    top: { x: node.x + nodeWidth / 2, y: node.y - buffer },
    right: { x: node.x + nodeWidth + buffer, y: node.y + nodeHeight / 2 },
    bottom: { x: node.x + nodeWidth / 2, y: node.y + nodeHeight + buffer },
    left: { x: node.x - buffer, y: node.y + nodeHeight / 2 }
  };
};

// Find the best connection points between two nodes (favoring perpendicular approaches)
export const findBestConnectionPoints = (fromNode: FlowStep, toNode: FlowStep) => {
  const fromPoints = getNodeConnectionPoints(fromNode);
  const toPoints = getNodeConnectionPoints(toNode);
  
  // Calculate the general direction from source to target
  const deltaX = toNode.x - fromNode.x;
  const deltaY = toNode.y - fromNode.y;
  
  // Determine the primary direction (which axis has larger difference)
  const isHorizontalPrimary = Math.abs(deltaX) > Math.abs(deltaY);
  
  let bestFromSide: 'top' | 'right' | 'bottom' | 'left';
  let bestToSide: 'top' | 'right' | 'bottom' | 'left';
  
  if (isHorizontalPrimary) {
    // Horizontal movement is primary - use left/right connections
    if (deltaX > 0) {
      bestFromSide = 'right';
      bestToSide = 'left';
    } else {
      bestFromSide = 'left';
      bestToSide = 'right';
    }
  } else {
    // Vertical movement is primary - use top/bottom connections
    if (deltaY > 0) {
      bestFromSide = 'bottom';
      bestToSide = 'top';
    } else {
      bestFromSide = 'top';
      bestToSide = 'bottom';
    }
  }
  
  // Check if we should switch to secondary direction for more head-on approach
  const primaryDistance = isHorizontalPrimary ? Math.abs(deltaX) : Math.abs(deltaY);
  const secondaryDistance = isHorizontalPrimary ? Math.abs(deltaY) : Math.abs(deltaX);
  
  // More aggressive switching - if nodes are almost aligned in primary axis but offset in secondary
  const nodeSize = 128; // Approximate node size for reference
  const shouldSwitchDirection = primaryDistance < Math.max(secondaryDistance, nodeSize);
  
  if (shouldSwitchDirection) {
    if (isHorizontalPrimary) {
      // Switch to vertical approach
      if (deltaY > 0) {
        bestFromSide = 'bottom';
        bestToSide = 'top';
      } else {
        bestFromSide = 'top';
        bestToSide = 'bottom';
      }
    } else {
      // Switch to horizontal approach
      if (deltaX > 0) {
        bestFromSide = 'right';
        bestToSide = 'left';
      } else {
        bestFromSide = 'left';
        bestToSide = 'right';
      }
    }
  }
  
  return {
    from: fromPoints[bestFromSide],
    to: toPoints[bestToSide],
    fromSide: bestFromSide,
    toSide: bestToSide
  };
};