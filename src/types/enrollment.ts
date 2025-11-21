export interface AvailableTransition {
  uuid: string;
  to_step: string;
  to_step_name: string;
  conditions?: {
    [key: string]: string;
  };
  is_backward: boolean;
}

export interface Enrollment {
  uuid: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_whatsapp_country_code?: string; // WhatsApp country code (e.g., "+1", "+44")
  user_whatsapp_phone_number?: string; // WhatsApp phone number without country code
  user_whatsapp_full_number?: string; // Complete formatted WhatsApp number (e.g., "+447911123456")
  flow_name: string;
  flow_uuid: string;
  tenant_name: string;
  tenant_uuid: string;
  current_step_name: string;
  current_step_uuid: string;
  is_active?: boolean; // Whether enrollment has forward transitions available
  available_transitions?: AvailableTransition[];
  identifier?: string; // Optional user-defined identifier
  days_at_current_step?: number; // Number of days at current step
  created_at: string;
  updated_at?: string;
}

export interface EnrollmentListParams {
  page?: number;
  page_size?: number;
  search_user?: string;
  identifier?: string;
  flow?: string;
  current_step?: string;
  is_active?: boolean;
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

export interface EnrollmentStatsResponse {
  total_count: number;
  active_count: number;
  recently_updated: Enrollment[];
}
