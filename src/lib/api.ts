import { User } from '../types/user';
import { Tenant, TenantUpdateRequest, CheckoutSessionRequest, CheckoutSessionResponse, CustomerPortalRequest, CustomerPortalResponse, UpgradeSubscriptionRequest, UpgradeSubscriptionResponse } from '../types/tenant';
import { Flow, CreateFlowRequest, CreateFlowResponse, FlowListResponse, FlowListParams } from '../types/flow';
import { Member, MemberListParams, MemberListResponse, UpdateMemberRequest, UpdateMemberResponse } from '../types/member';
import { Enrollment, EnrollmentListParams, EnrollmentListResponse, FlowStepListResponse } from '../types/enrollment';
import { EnrollmentHistoryListParams, EnrollmentHistoryListResponse } from '../types/enrollmentHistory';
import {
  FlowStepAPI,
  FlowTransitionAPI,
  CreateFlowStepRequest,
  CreateFlowTransitionRequest,
  UpdateFlowStepRequest,
  UpdateFlowTransitionRequest,
  FlowStepsListResponse,
  FlowTransitionsListResponse,
  OrganizeFlowRequest,
  OrganizeFlowResponse
} from '../types/flowBuilder';
import { useAuthStore } from '../stores/useAuthStore';
import {
  Message,
  MessageListParams,
  MessageListResponse,
  MessageActionRequest,
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
  Invite,
  InviteListResponse,
  CreateInviteRequest,
  InviteValidationResponse
} from '../types/message';
import { ApiError, ApiErrorData } from '../types/api';
import { buildQueryString } from './utils';

const API_BASE_URL = `${import.meta.env.VITE_API_HOST || 'http://localhost:8000'}/api/v1`;

// Enhanced fetch wrapper with authentication and better error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const headers: Record<string, string> = {};
  
  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Merge with any provided headers
  Object.assign(headers, options.headers as Record<string, string>);

  // Add authentication header if required and available
  if (requireAuth) {
    const tokens = useAuthStore.getState().tokens;
    if (tokens?.access) {
      headers.Authorization = `Bearer ${tokens.access}`;
    }
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - token refresh logic
  if (response.status === 401 && requireAuth) {
    const tokens = useAuthStore.getState().tokens;
    if (tokens?.refresh) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: tokens.refresh }),
        });

        if (refreshResponse.ok) {
          const { access: newAccessToken } = await refreshResponse.json();
          const newTokens = { ...tokens, access: newAccessToken };
          useAuthStore.getState().setTokens(newTokens);

          // Retry original request with new token
          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        } else {
          // Refresh failed, clear auth
          useAuthStore.getState().clearTokens();
          throw new Error('Authentication expired');
        }
        } catch {
        useAuthStore.getState().clearTokens();
        throw new Error('Authentication expired');
      }
    } else {
      useAuthStore.getState().clearTokens();
      throw new Error('Authentication required');
    }
  }

  if (!response.ok) {
    const errorData: ApiErrorData = await response.json().catch(() => ({ detail: 'An error occurred' }));

    // Handle "user_not_found" specifically - clear tokens and redirect to home
    if (response.status === 401 && errorData.code === 'user_not_found') {
      useAuthStore.getState().clearTokens();
      // Redirect to homepage
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw new ApiError('User account not found. Please sign in again.', errorData, response.status);
    }

    const errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(errorMessage, errorData, response.status);
  }

  // Handle 204 No Content responses (like DELETE)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// API functions for user data
export const userApi = {
  getCurrentUser: (): Promise<User> => apiRequest('/user/me'),

  updateUser: (userId: number, userData: Partial<User>): Promise<User> =>
    apiRequest(`/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),

  deleteUser: (userId: number): Promise<void> =>
    apiRequest(`/user/${userId}`, {
      method: 'DELETE',
    }),
};

// API functions for authentication
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<{ access: string; refresh: string }> => {
    const response = await apiRequest<{ access: string; refresh: string }>('/token', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);
    return response;
  },

  signup: (userData: { name: string; email: string; password: string; marketing_consent: boolean; invite_token?: string }): Promise<User> =>
    apiRequest<User>('/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false),

  forgotPassword: (email: string): Promise<{ message: string }> =>
    apiRequest<{ message: string }>('/user/reset_password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, false),

  resendConfirmation: (email: string): Promise<{ message: string }> =>
    apiRequest<{ message: string }>('/user/request_confirmation_email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, false),

  confirmEmail: (token: string): Promise<{ message: string; success: boolean }> =>
    apiRequest<{ message: string; success: boolean }>('/user/confirm_email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }, false),
};

// API functions for tenant management
export const tenantApi = {
  // Create tenant (creates membership automatically)
  createTenant: (tenantData: { name: string }): Promise<Tenant> =>
    apiRequest<Tenant>('/tenants', {
      method: 'POST',
      body: JSON.stringify(tenantData),
    }),

  // Get tenant by name (public endpoint)
  getTenantByName: (tenantName: string): Promise<Tenant> =>
    apiRequest<Tenant>(`/public/tenants/${tenantName}`, {}, false),

  // Get tenant by UUID (authenticated)
  getTenant: (tenantUuid: string): Promise<Tenant> =>
    apiRequest<Tenant>(`/tenants/${tenantUuid}`),

  // Update tenant (theme, logo, etc.)
  updateTenant: (tenantUuid: string, tenantData: Partial<TenantUpdateRequest>): Promise<Tenant> =>
    apiRequest<Tenant>(`/tenants/${tenantUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(tenantData),
    }),

  // Update tenant logo (file upload)
  updateTenantLogo: (tenantUuid: string, logoFile: File): Promise<Tenant> => {
    const formData = new FormData();
    formData.append('logo', logoFile);

    return apiRequest<Tenant>(`/tenants/${tenantUuid}`, {
      method: 'PATCH',
      body: formData,
    });
  },
};

// API functions for flow management
export const flowApi = {
  createFlow: (tenantUuid: string, flowData: CreateFlowRequest): Promise<CreateFlowResponse> =>
    apiRequest<CreateFlowResponse>(`/tenants/${tenantUuid}/flows`, {
      method: 'POST',
      body: JSON.stringify(flowData),
    }),

  getFlows: async (tenantUuid: string, params?: FlowListParams): Promise<FlowListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = `/tenants/${tenantUuid}/flows${queryString ? `?${queryString}` : ''}`;
    return apiRequest<FlowListResponse>(url);
  },

  getFlow: (tenantUuid: string, flowUuid: string): Promise<Flow> =>
    apiRequest<Flow>(`/tenants/${tenantUuid}/flows/${flowUuid}`),

  updateFlow: (tenantUuid: string, flowUuid: string, flowData: Partial<CreateFlowRequest>): Promise<Flow> =>
    apiRequest<Flow>(`/tenants/${tenantUuid}/flows/${flowUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(flowData),
    }),

  deleteFlow: (tenantUuid: string, flowUuid: string): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/flows/${flowUuid}`, {
      method: 'DELETE',
    }),
};

// API functions for member management
export const memberApi = {
  getMembers: async (tenantUuid: string, params?: MemberListParams): Promise<MemberListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = `/tenants/${tenantUuid}/memberships${queryString ? `?${queryString}` : ''}`;
    return apiRequest<MemberListResponse>(url);
  },

  getMember: (tenantUuid: string, memberUuid: string): Promise<Member> =>
    apiRequest<Member>(`/tenants/${tenantUuid}/memberships/${memberUuid}`),

  updateMember: (tenantUuid: string, memberUuid: string, memberData: UpdateMemberRequest): Promise<UpdateMemberResponse> =>
    apiRequest<UpdateMemberResponse>(`/tenants/${tenantUuid}/memberships/${memberUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(memberData),
    }),

  deleteMember: (tenantUuid: string, memberUuid: string): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/memberships/${memberUuid}`, {
      method: 'DELETE',
    }),

  leaveTenant: (tenantUuid: string): Promise<{ message: string; tenant_name: string; previous_role: string; membership_uuid: string }> =>
    apiRequest<{ message: string; tenant_name: string; previous_role: string; membership_uuid: string }>(`/tenants/${tenantUuid}/memberships/leave_tenant`, {
      method: 'POST',
    }),
};


// API functions for enrollment/customer management
export const enrollmentApi = {
  getEnrollments: async (tenantUuid: string, params?: EnrollmentListParams): Promise<EnrollmentListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = `/tenants/${tenantUuid}/enrollments${queryString ? `?${queryString}` : ''}`;
    return apiRequest<EnrollmentListResponse>(url);
  },

  getEnrollment: (tenantUuid: string, enrollmentUuid: string): Promise<Enrollment> =>
    apiRequest<Enrollment>(`/tenants/${tenantUuid}/enrollments/${enrollmentUuid}`),

  deleteEnrollment: (tenantUuid: string, enrollmentUuid: string): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/enrollments/${enrollmentUuid}`, {
      method: 'DELETE',
    }),

  // Update enrollment (e.g., move to different step)
  updateEnrollment: (tenantUuid: string, enrollmentUuid: string, updates: { current_step?: string }): Promise<Enrollment> =>
    apiRequest<Enrollment>(`/tenants/${tenantUuid}/enrollments/${enrollmentUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Get flow steps for a specific flow
  getFlowSteps: (tenantUuid: string, flowUuid: string): Promise<FlowStepListResponse> =>
    apiRequest<FlowStepListResponse>(`/tenants/${tenantUuid}/flows/${flowUuid}/steps`),

  // Get enrollment history
  getEnrollmentHistory: async (tenantUuid: string, enrollmentUuid: string, params?: EnrollmentHistoryListParams): Promise<EnrollmentHistoryListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = `/tenants/${tenantUuid}/enrollments/${enrollmentUuid}/history${queryString ? `?${queryString}` : ''}`;
    return apiRequest<EnrollmentHistoryListResponse>(url);
  },

  // Create enrollment (for QR code invitations)
  createEnrollment: (tenantUuid: string, flowUuid: string, userId: number): Promise<Enrollment> =>
    apiRequest<Enrollment>(`/tenants/${tenantUuid}/enrollments`, {
      method: 'POST',
      body: JSON.stringify({ 
        flow: flowUuid,
        user: userId 
      }),
    }),

  // Create public enrollment (for external users via QR code)
  createPublicEnrollment: (tenantName: string, flowName: string, userEmail: string): Promise<Enrollment> =>
    apiRequest<Enrollment>('/public/enrollments', {
      method: 'POST',
      body: JSON.stringify({
        tenant_name: tenantName,
        flow_name: flowName,
        user_email: userEmail
      }),
    }, false), // No auth required for public endpoint
};

// API functions for flow builder (steps and transitions)
export const flowBuilderApi = {
  // Flow Steps
  getFlowSteps: (tenantUuid: string, flowUuid: string): Promise<FlowStepsListResponse> =>
    apiRequest<FlowStepsListResponse>(`/tenants/${tenantUuid}/flows/${flowUuid}/steps`),

  createFlowStep: (tenantUuid: string, flowUuid: string, stepData: CreateFlowStepRequest): Promise<FlowStepAPI> =>
    apiRequest<FlowStepAPI>(`/tenants/${tenantUuid}/flows/${flowUuid}/steps`, {
      method: 'POST',
      body: JSON.stringify(stepData),
    }),

  updateFlowStep: (tenantUuid: string, flowUuid: string, stepUuid: string, stepData: UpdateFlowStepRequest): Promise<FlowStepAPI> =>
    apiRequest<FlowStepAPI>(`/tenants/${tenantUuid}/flows/${flowUuid}/steps/${stepUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(stepData),
    }),

  deleteFlowStep: (tenantUuid: string, flowUuid: string, stepUuid: string): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/flows/${flowUuid}/steps/${stepUuid}`, {
      method: 'DELETE',
    }),

  // Flow Transitions
  getFlowTransitions: (tenantUuid: string, flowUuid: string): Promise<FlowTransitionsListResponse> =>
    apiRequest<FlowTransitionsListResponse>(`/tenants/${tenantUuid}/flows/${flowUuid}/transitions`),

  createFlowTransition: (tenantUuid: string, flowUuid: string, transitionData: CreateFlowTransitionRequest): Promise<FlowTransitionAPI> =>
    apiRequest<FlowTransitionAPI>(`/tenants/${tenantUuid}/flows/${flowUuid}/transitions`, {
      method: 'POST',
      body: JSON.stringify(transitionData),
    }),

  updateFlowTransition: (tenantUuid: string, flowUuid: string, transitionUuid: string, transitionData: UpdateFlowTransitionRequest): Promise<FlowTransitionAPI> =>
    apiRequest<FlowTransitionAPI>(`/tenants/${tenantUuid}/flows/${flowUuid}/transitions/${transitionUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(transitionData),
    }),

  deleteFlowTransition: (tenantUuid: string, flowUuid: string, transitionUuid: string): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/flows/${flowUuid}/transitions/${transitionUuid}`, {
      method: 'DELETE',
    }),

  // Flow Organization
  organizeFlow: (tenantUuid: string, flowUuid: string, organizeData: OrganizeFlowRequest, apply: boolean = true): Promise<OrganizeFlowResponse> =>
    apiRequest<OrganizeFlowResponse>(`/tenants/${tenantUuid}/flows/${flowUuid}/organize${apply ? '?apply=true' : ''}`, {
      method: 'POST',
      body: JSON.stringify(organizeData),
    }),
};

// Message API
export const messageApi = {
  // Get messages with optional filtering
  getMessages: (params?: MessageListParams): Promise<MessageListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    return apiRequest<MessageListResponse>(`/messages${queryString ? `?${queryString}` : ''}`);
  },

  // Mark message as read
  markMessageAsRead: (messageUuid: string): Promise<Message> =>
    apiRequest<Message>(`/messages/${messageUuid}/mark_read`, {
      method: 'POST',
    }),

  // Take action on a message (accept/reject)
  takeMessageAction: (messageUuid: string, actionData: MessageActionRequest): Promise<Message> =>
    apiRequest<Message>(`/messages/${messageUuid}/take_action`, {
      method: 'POST',
      body: JSON.stringify(actionData),
    }),

  // Mark all messages as read
  markAllMessagesAsRead: (): Promise<{ message: string; updated_count: number }> =>
    apiRequest<{ message: string; updated_count: number }>('/messages/mark_all_read', {
      method: 'POST',
    }),
};

// Notification Preferences API
export const notificationApi = {
  // Get notification preferences
  getNotificationPreferences: (): Promise<NotificationPreferences> =>
    apiRequest<NotificationPreferences>('/notification-preferences'),

  // Update notification preferences
  updateNotificationPreferences: (preferences: UpdateNotificationPreferencesRequest): Promise<NotificationPreferences> =>
    apiRequest<NotificationPreferences>('/notification-preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    }),
};

// Invite API (for future use)
export const inviteApi = {
  // Get tenant invites
  getTenantInvites: (tenantUuid: string): Promise<InviteListResponse> =>
    apiRequest<InviteListResponse>(`/tenants/${tenantUuid}/invites`),

  // Create tenant invite
  createTenantInvite: (tenantUuid: string, inviteData: CreateInviteRequest): Promise<Invite> =>
    apiRequest<Invite>(`/tenants/${tenantUuid}/invites`, {
      method: 'POST',
      body: JSON.stringify(inviteData),
    }),

  // Accept tenant invite
  acceptTenantInvite: (tenantUuid: string, inviteUuid: string): Promise<Invite> =>
    apiRequest<Invite>(`/tenants/${tenantUuid}/invites/${inviteUuid}/accept`, {
      method: 'POST',
      body: JSON.stringify({ action: 'accept' }),
    }),

  // Reject tenant invite
  rejectTenantInvite: (tenantUuid: string, inviteUuid: string): Promise<Invite> =>
    apiRequest<Invite>(`/tenants/${tenantUuid}/invites/${inviteUuid}/reject`, {
      method: 'POST',
      body: JSON.stringify({ action: 'reject' }),
    }),

  // Validate invite token (public endpoint, no auth required)
  validateInviteToken: (token: string): Promise<InviteValidationResponse> =>
    apiRequest<InviteValidationResponse>(`/invite/validate/${token}`, {}, false),
};

// Payment API
export const paymentApi = {
  // Create checkout session for new subscription
  createCheckoutSession: (checkoutData: CheckoutSessionRequest): Promise<CheckoutSessionResponse> =>
    apiRequest<CheckoutSessionResponse>('/user/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),

  // Upgrade existing subscription (with proration)
  upgradeSubscription: (upgradeData: UpgradeSubscriptionRequest): Promise<UpgradeSubscriptionResponse> =>
    apiRequest<UpgradeSubscriptionResponse>('/user/upgrade', {
      method: 'POST',
      body: JSON.stringify(upgradeData),
    }),

  // Access customer portal for billing management
  createCustomerPortalSession: (portalData: CustomerPortalRequest): Promise<CustomerPortalResponse> =>
    apiRequest<CustomerPortalResponse>('/user/customer_portal', {
      method: 'POST',
      body: JSON.stringify(portalData),
    }),
};