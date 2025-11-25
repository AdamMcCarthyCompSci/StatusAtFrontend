export interface AvailableTransition {
  uuid: string;
  to_step: string;
  to_step_name: string;
  conditions?: {
    [key: string]: string;
  };
  is_backward: boolean;
}

export interface EnrollmentUser {
  uuid: string;
  email: string;
  name: string;
}

export interface EnrollmentFlow {
  uuid: string;
  name: string;
}

export interface EnrollmentStep {
  uuid: string;
  name: string;
}

export interface EnrollmentActivity {
  timestamp: string;
  from_step: string;
  to_step: string;
  changed_by: string;
  is_backward: boolean;
}

export interface Enrollment {
  uuid: string;
  // Nested object structure (used by stats endpoint and newer endpoints)
  user?: EnrollmentUser;
  flow?: EnrollmentFlow;
  current_step?: EnrollmentStep;
  activity?: EnrollmentActivity; // Activity information (present in stats endpoint)

  // Common fields
  identifier?: string; // Optional user-defined identifier
  is_active?: boolean; // Whether enrollment is active
  created_at: string;
  updated_at?: string;

  // Legacy flat fields (deprecated - used by older endpoints, may be removed in future)
  user_id?: number;
  user_name?: string;
  user_email?: string;
  user_whatsapp_country_code?: string; // WhatsApp country code (e.g., "+1", "+44")
  user_whatsapp_phone_number?: string; // WhatsApp phone number without country code
  user_whatsapp_full_number?: string; // Complete formatted WhatsApp number (e.g., "+447911123456")
  flow_name?: string;
  flow_uuid?: string;
  tenant_name?: string;
  tenant_uuid?: string;
  current_step_name?: string;
  current_step_uuid?: string;
  available_transitions?: AvailableTransition[];
  days_at_current_step?: number; // Number of days at current step
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
