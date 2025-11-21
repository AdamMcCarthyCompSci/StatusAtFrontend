export interface TenantTheme {
  primary_color?: string;
  secondary_color?: string;
  text_color?: string;
}

export interface TenantUsage {
  current_usage: number;
  limit: number;
  remaining: number;
  overage: number;
  percentage_used: number;
  billing_period_start: string;
}

export interface Tenant {
  uuid: string;
  name: string;
  description?: string;
  theme?: TenantTheme;
  logo?: string;
  contact_phone?: string;
  contact_email?: string;
  tier:
    | 'FREE'
    | 'CREATED'
    | 'CANCELLED'
    | 'STARTER'
    | 'PROFESSIONAL'
    | 'ENTERPRISE';
  usage?: TenantUsage;
  active_cases_count?: number; // Current number of active enrollments
  active_cases_limit?: number | null; // Limit based on tier (null = unlimited)
  membership_count?: number; // Current number of memberships
  membership_limit?: number | null; // Limit based on tier (null = unlimited)
  memberships?: TenantMembership[];
  auto_generate_enrollment_identifiers?: boolean; // Auto-generate human-friendly identifiers (e.g., CASE-0001)
  created_at?: string;
  updated_at?: string;
}

export interface TenantMembership {
  uuid: string;
  user_id: number;
  user_name: string;
  user_email: string;
  role: string;
  tenant_uuid: string;
  tenant_name: string;
  created_at: string;
  updated_at: string;
}

export interface TenantUpdateRequest {
  name?: string;
  description?: string;
  theme?: TenantTheme;
  logo?: string;
  contact_phone?: string;
  contact_email?: string;
  auto_generate_enrollment_identifiers?: boolean;
}

export interface TenantListParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface TenantListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tenant[];
}

// Payment-related types
export type SubscriptionTier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface CheckoutSessionRequest {
  tier: SubscriptionTier;
  tenant_id: string;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
}

export interface CustomerPortalRequest {
  tenant_id: string;
}

export interface CustomerPortalResponse {
  customer_portal_url: string;
}

export interface UpgradeSubscriptionRequest {
  tier: SubscriptionTier;
  tenant_id: string;
}

export interface UpgradeSubscriptionResponse {
  success: boolean;
  message: string;
}
