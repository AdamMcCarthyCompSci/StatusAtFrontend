export interface TenantTheme {
  primary_color?: string;
  secondary_color?: string;
  text_color?: string;
}

export interface Tenant {
  uuid: string;
  name: string;
  description?: string;
  theme?: TenantTheme;
  logo?: string;
  contact_phone?: string;
  contact_email?: string;
  tier: 'FREE' | 'statusat_starter' | 'statusat_professional';
  memberships?: TenantMembership[];
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
export type SubscriptionTier = 'statusat_starter' | 'statusat_professional';

export interface CheckoutSessionRequest {
  tier: SubscriptionTier;
  tenant_id: string;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
}

export interface CustomerPortalRequest {
  tenant_id: string;
}

export interface CustomerPortalResponse {
  portal_url: string;
}
