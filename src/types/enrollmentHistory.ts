export interface EnrollmentHistoryEntry {
  uuid: string;
  enrollment: string;
  transition: string;
  changed_by: number;
  changed_by_name: string;
  changed_by_email: string;
  from_step_name: string | null; // Can be null if step was deleted
  to_step_name: string | null;   // Can be null if step was deleted
  is_backward: boolean;
  enrollment_user_name: string;
  enrollment_user_email: string;
  flow_name: string;
  timestamp: string;
}

export interface EnrollmentHistoryListParams {
  page?: number;
  page_size?: number;
}

export interface EnrollmentHistoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EnrollmentHistoryEntry[];
}
