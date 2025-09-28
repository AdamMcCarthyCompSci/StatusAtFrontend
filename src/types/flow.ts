export interface Flow {
  uuid: string;
  name: string;
  tenant_name: string;
  tenant_uuid: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFlowRequest {
  name: string;
}

export interface CreateFlowResponse {
  uuid: string;
  name: string;
  tenant_name: string;
}

export interface FlowListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Flow[];
}

export interface FlowListParams {
  page?: number;
  page_size?: number;
  search?: string;
}
