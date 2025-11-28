import { FlowStepAPI, FlowTransitionAPI } from '@/types/flowBuilder';

import { FlowStep, FlowTransition } from '../types';
import { NODE_DIMENSIONS, GRID_LAYOUT } from '../constants';

/**
 * Converts a backend API step to internal frontend format
 * Handles coordinate conversion from center (backend) to top-left (frontend)
 *
 * @param apiStep - Step data from the API
 * @param index - Step index for fallback positioning
 * @returns Internal FlowStep format
 */
export const convertApiStepToInternal = (
  apiStep: FlowStepAPI,
  index: number
): FlowStep => {
  // Backend stores top-left coordinates directly (no conversion needed)
  let x, y;

  if (apiStep.metadata?.x !== undefined && apiStep.metadata?.y !== undefined) {
    // Backend already uses top-left coordinates
    x = parseInt(apiStep.metadata.x);
    y = parseInt(apiStep.metadata.y);
  } else {
    // Fallback to consistent default based on index
    x = GRID_LAYOUT.START_X + (index % 3) * 250;
    y = GRID_LAYOUT.START_Y + Math.floor(index / 3) * GRID_LAYOUT.SPACING_Y;
  }

  return {
    id: apiStep.uuid,
    name: apiStep.name,
    x,
    y,
  };
};

/**
 * Converts a backend API transition to internal frontend format
 *
 * @param apiTransition - Transition data from the API
 * @returns Internal FlowTransition format
 */
export const convertApiTransitionToInternal = (
  apiTransition: FlowTransitionAPI
): FlowTransition => {
  return {
    id: apiTransition.uuid,
    fromStepId: apiTransition.from_step,
    toStepId: apiTransition.to_step,
  };
};

/**
 * Converts frontend top-left coordinates to backend format (also top-left)
 *
 * @param x - Frontend x coordinate (top-left)
 * @param y - Frontend y coordinate (top-left)
 * @returns Object with top-left coordinates as strings
 */
export const convertToBackendCoordinates = (x: number, y: number) => {
  return {
    x: x.toString(),
    y: y.toString(),
  };
};
