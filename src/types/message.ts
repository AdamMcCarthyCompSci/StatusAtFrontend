// Message Types

export type MessageType = 'status_update' | 'tenant_invite' | 'flow_invite' | 'membership_update';

export interface Message {
  uuid: string;
  message_type: MessageType;
  title: string;
  content: string;
  requires_action: boolean;
  action_accepted: boolean | null;
  tenant_name: string | null;
  flow_name: string | null;
  sent_by_name: string | null;
  is_read: boolean;
  created: string; // ISO datetime
}

export interface MessageListParams {
  search?: string;
  message_type?: MessageType;
  is_read?: boolean;
  requires_action?: boolean;
  page?: number;
  page_size?: number;
}

export interface MessageListResponse {
  results: Message[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface MessageActionRequest {
  action: 'accept' | 'reject';
}

// Notification Preferences Types

export interface NotificationPreferences {
  email_enabled: boolean;
  email_status_updates: boolean;
  email_invites: boolean;
  email_membership_updates: boolean;
  whatsapp_enabled: boolean;
  whatsapp_status_updates: boolean;
  whatsapp_invites: boolean;
  whatsapp_membership_updates: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  email_enabled?: boolean;
  email_status_updates?: boolean;
  email_invites?: boolean;
  email_membership_updates?: boolean;
  whatsapp_enabled?: boolean;
  whatsapp_status_updates?: boolean;
  whatsapp_invites?: boolean;
  whatsapp_membership_updates?: boolean;
}

// Invite Types (for future use)

export type InviteType = 'tenant_member' | 'flow_enrollment';
export type InviteStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface Invite {
  uuid: string;
  email: string;
  invite_type: InviteType;
  status: InviteStatus;
  tenant_name: string;
  flow_name: string | null;
  role: string | null;
  invited_by_name: string;
  expires_at: string; // ISO datetime
  is_expired: boolean;
}

export interface CreateTenantMemberInviteRequest {
  email: string;
  invite_type: 'tenant_member';
  role: 'MEMBER' | 'STAFF' | 'OWNER';
}

export interface CreateFlowEnrollmentInviteRequest {
  email: string;
  invite_type: 'flow_enrollment';
  flow: string; // flow_uuid
}

export type CreateInviteRequest = CreateTenantMemberInviteRequest | CreateFlowEnrollmentInviteRequest;

export interface InviteActionRequest {
  action: 'accept' | 'reject';
}

export interface InviteListResponse {
  results: Invite[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface InviteValidationResponse {
  valid: boolean;
  should_redirect_to_inbox?: boolean;  // User already exists, redirect them
  invite?: {
    uuid: string;
    email: string;
    invite_type: string;
    status: string;
    tenant: string;
    tenant_name: string;
    flow: string | null;
    flow_name: string | null;
    role: string | null;
    expires_at: string;
    is_expired: boolean;
    token: string;
  };
  tenant_name?: string;
  flow_name?: string | null;
  invite_type?: string;
  role?: string | null;
  email?: string;
  expires_at?: string;
  error?: string;
}
