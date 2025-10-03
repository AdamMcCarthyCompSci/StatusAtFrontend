// Types for Flow Builder API integration

export interface FlowStepAPI {
  uuid: string;
  name: string;
  metadata?: {
    [key: string]: string;
  };
}

export interface FlowTransitionAPI {
  uuid: string;
  from_step: string;
  to_step: string;
  conditions?: {
    [key: string]: string;
  };
}

export interface CreateFlowStepRequest {
  name: string;
  metadata?: {
    [key: string]: string;
  };
}

export interface CreateFlowTransitionRequest {
  from_step: string;
  to_step: string;
  conditions?: {
    [key: string]: string;
  };
}

export interface UpdateFlowStepRequest {
  name?: string;
  metadata?: {
    [key: string]: string;
  };
}

export interface UpdateFlowTransitionRequest {
  from_step?: string;
  to_step?: string;
  conditions?: {
    [key: string]: string;
  };
}

// Since the endpoints are not paginated, they return arrays directly
export type FlowStepsListResponse = FlowStepAPI[];

export type FlowTransitionsListResponse = FlowTransitionAPI[];

// Helper function to convert API types to internal FlowBuilder types
export interface FlowStepWithPosition extends FlowStepAPI {
  x: number;
  y: number;
}

export interface FlowTransitionWithId extends FlowTransitionAPI {
  id: string;
  fromStepId: string;
  toStepId: string;
}
