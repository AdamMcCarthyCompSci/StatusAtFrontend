// Types for our flow builder
export interface FlowStep {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface FlowTransition {
  id: string;
  fromStepId: string;
  toStepId: string;
  condition?: string;
}

export interface DragState {
  isDragging: boolean;
  dragType: 'canvas' | 'node' | 'connection' | null;
  draggedNodeId?: string;
  startPos?: { x: number; y: number };
  dragOffset?: { x: number; y: number };
  hasMoved?: boolean;
}

export interface ConnectionState {
  isConnecting: boolean;
  fromNodeId?: string;
  fromHandle?: 'output';
  tempConnection?: { fromX: number; fromY: number; toX: number; toY: number };
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}
