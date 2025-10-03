import { User } from '../types/user';
import { Flow, CreateFlowRequest, CreateFlowResponse, FlowListResponse, FlowListParams } from '../types/flow';
import { Member, MemberListParams, MemberListResponse, UpdateMemberRequest, UpdateMemberResponse } from '../types/member';
import { Enrollment, EnrollmentListParams, EnrollmentListResponse, FlowStepListResponse } from '../types/enrollment';
import { 
  FlowStepAPI, 
  FlowTransitionAPI, 
  CreateFlowStepRequest, 
  CreateFlowTransitionRequest, 
  UpdateFlowStepRequest, 
  UpdateFlowTransitionRequest,
  FlowStepsListResponse,
  FlowTransitionsListResponse
} from '../types/flowBuilder';
import { useAuthStore } from '../stores/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_HOST || 'http://localhost:8000';

// Enhanced fetch wrapper with authentication and better error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

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
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
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

  signup: (userData: { name: string; email: string; password: string; marketing_consent: boolean }): Promise<User> =>
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

// API functions for flow management
export const flowApi = {
  createFlow: (tenantUuid: string, flowData: CreateFlowRequest): Promise<CreateFlowResponse> =>
    apiRequest<CreateFlowResponse>(`/tenants/${tenantUuid}/flows`, {
      method: 'POST',
      body: JSON.stringify(flowData),
    }),

  getFlows: async (tenantUuid: string, params?: FlowListParams): Promise<FlowListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.page_size) searchParams.set('page_size', params.page_size.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const queryString = searchParams.toString();
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
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.page_size) searchParams.set('page_size', params.page_size.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const queryString = searchParams.toString();
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
};


// API functions for enrollment/customer management
export const enrollmentApi = {
  getEnrollments: async (tenantUuid: string, params?: EnrollmentListParams): Promise<EnrollmentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.page_size) searchParams.set('page_size', params.page_size.toString());
    if (params?.search_user) searchParams.set('search_user', params.search_user);
    if (params?.flow) searchParams.set('flow', params.flow);
    if (params?.current_step) searchParams.set('current_step', params.current_step);

    const queryString = searchParams.toString();
    const url = `/tenants/${tenantUuid}/enrollments${queryString ? `?${queryString}` : ''}`;


    return apiRequest<EnrollmentListResponse>(url);
  },

  getEnrollment: (tenantUuid: string, enrollmentUuid: string): Promise<Enrollment> =>
    apiRequest<Enrollment>(`/tenants/${tenantUuid}/enrollments/${enrollmentUuid}`),

  deleteEnrollment: (tenantUuid: string, enrollmentUuid: string): Promise<void> =>
    apiRequest<void>(`/tenants/${tenantUuid}/enrollments/${enrollmentUuid}`, {
      method: 'DELETE',
    }),

  // Get flow steps for a specific flow
  getFlowSteps: (tenantUuid: string, flowUuid: string): Promise<FlowStepListResponse> =>
    apiRequest<FlowStepListResponse>(`/tenants/${tenantUuid}/flows/${flowUuid}/steps`),
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
};