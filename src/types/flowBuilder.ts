// Types for Flow Builder API integration

export interface FlowStepAPI {
  uuid: string;
  name: string;
  description?: string;
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
  description?: string;
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
  description?: string;
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

// Types for flow organization
export interface OrganizeStepDataRequest {
  step_uuid: string;
  step_name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OrganizeStepDataResponse {
  step_uuid: string;
  step_name: string;
  x: string; // Backend will return integer strings
  y: string; // Backend will return integer strings
}

export interface OrganizeLayoutInfo {
  total_steps: number;
  connected_count: number;
  disconnected_count: number;
}

export interface OrganizeFlowRequest {
  connected_steps: OrganizeStepDataRequest[];
  disconnected_steps: OrganizeStepDataRequest[];
  layout_info: OrganizeLayoutInfo;
}

export interface OrganizeFlowResponse {
  connected_steps: OrganizeStepDataResponse[];
  disconnected_steps: OrganizeStepDataResponse[];
  layout_info: OrganizeLayoutInfo;
}

// Types for document fields
export interface FlowStepDocumentField {
  uuid: string;
  name: string;
  uploaded_by: 'ADMIN' | 'CUSTOMER';
  is_required: boolean;
  is_active: boolean;
  description?: string;
  created: string;
  modified: string;
}

export interface CreateDocumentFieldRequest {
  name: string;
  uploaded_by: 'ADMIN' | 'CUSTOMER';
  is_required: boolean;
  description?: string;
}

export interface UpdateDocumentFieldRequest {
  name?: string;
  uploaded_by?: 'ADMIN' | 'CUSTOMER';
  is_required?: boolean;
  is_active?: boolean;
  description?: string;
}

export type DocumentFieldsListResponse = FlowStepDocumentField[];
