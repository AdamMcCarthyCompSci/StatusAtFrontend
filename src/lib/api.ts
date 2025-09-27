import { User } from '../types/user';
import { useAuthStore } from '../stores/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_HOST || 'http://localhost:8000';

// Enhanced fetch wrapper with authentication and better error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
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

  return response.json() as Promise<T>;
}

// API functions for user data
export const userApi = {
  getCurrentUser: (): Promise<User> => apiRequest('/user/me'),

  updateUser: (userData: Partial<User>): Promise<User> =>
    apiRequest('/user/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
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