import { MemberRole } from './user';

export interface MemberListParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface MemberListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Member[];
}

export interface Member {
  uuid: string;
  user_id: number;
  user_name: string;
  user_email: string;
  role: MemberRole;
  tenant_uuid: string;
  tenant_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateMemberRequest {
  role: MemberRole;
}

export interface UpdateMemberResponse {
  uuid: string;
  user_id: number;
  user_name: string;
  user_email: string;
  role: MemberRole;
  tenant_uuid: string;
  tenant_name: string;
  updated_at: string;
}
