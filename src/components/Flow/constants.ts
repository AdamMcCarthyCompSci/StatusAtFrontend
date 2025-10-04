// Flow Builder Constants
// Centralized dimensions to ensure consistency across the application

/**
 * Standard node dimensions used throughout the Flow Builder
 * These match the CSS classes used in FlowNode.tsx (w-36 h-24)
 * Consistent across all screen sizes since the canvas is zoomable
 */
export const NODE_DIMENSIONS = {
  WIDTH: 144,  // Matches w-36 (144px) - consistent across all breakpoints
  HEIGHT: 96,  // Matches h-24 (96px) - consistent across all breakpoints
} as const;

/**
 * Connection point buffer distance from node edges
 */
export const CONNECTION_BUFFER = 10;

/**
 * Maximum number of nodes allowed per flow
 */
export const MAX_NODES = 50;

/**
 * Grid layout constants for new node positioning
 */
export const GRID_LAYOUT = {
  COLUMNS: 4,
  SPACING_X: 200,
  SPACING_Y: 150,
  START_X: 200,
  START_Y: 150,
} as const;
