export interface Enrollment {
  uuid: string;
  user_id: number;
  user_name: string;
  user_email: string;
  flow_name: string;
  flow_uuid: string;
  tenant_name: string;
  tenant_uuid: string;
  current_step_name: string;
  current_step_uuid: string;
  created_at: string;
  updated_at?: string;
}

export interface EnrollmentListParams {
  page?: number;
  page_size?: number;
  search_user?: string;
  flow?: string;
  current_step?: string;
}

export interface EnrollmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Enrollment[];
}

export interface FlowStep {
  uuid: string;
  name: string;
  metadata?: {
    [key: string]: string;
  };
}

export interface FlowStepListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FlowStep[];
}

export interface FlowWithSteps {
  uuid: string;
  name: string;
  steps: FlowStep[];
}
