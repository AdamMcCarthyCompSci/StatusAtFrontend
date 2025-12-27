import { useAuthStore } from '../../stores/useAuthStore';
import { ApiError, ApiErrorData } from '../../types/api';
import { logger } from '../logger';
import { getApiBaseUrl } from '../../config/env';

const API_BASE_URL = getApiBaseUrl();

/**
 * Enhanced fetch wrapper with authentication and error handling
 * Handles token refresh automatically on 401 responses
 *
 * @param endpoint - API endpoint path (e.g., '/user/me')
 * @param options - Fetch options (method, body, headers, etc.)
 * @param requireAuth - Whether authentication is required (default: true)
 * @returns Promise resolving to the typed response data
 * @throws {ApiError} When the API request fails
 */
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
      } catch (error) {
        // Log the actual error for debugging
        logger.error('Token refresh failed', {
          error,
          endpoint: '/token/refresh',
        });

        // Clear tokens on any refresh failure
        useAuthStore.getState().clearTokens();

        // Provide more context about the failure
        if (error instanceof Error) {
          throw new Error(`Authentication expired: ${error.message}`);
        }
        throw new Error(
          'Authentication expired: Unknown error during token refresh'
        );
      }
    } else {
      useAuthStore.getState().clearTokens();
      throw new Error('Authentication required');
    }
  }

  if (!response.ok) {
    const rawErrorData = await response.json().catch(() => null);

    // Handle case where API returns a plain string instead of an object
    let errorMessage: string;
    let errorData: ApiErrorData;

    if (typeof rawErrorData === 'string') {
      // API returned plain string (e.g., "Your email has already been confirmed")
      errorMessage = rawErrorData;
      errorData = { detail: rawErrorData };
    } else if (rawErrorData && typeof rawErrorData === 'object') {
      // API returned an object with detail/message fields
      errorData = rawErrorData as ApiErrorData;
      errorMessage = errorData.detail || errorData.message || '';

      // Handle "user_not_found" specifically - clear tokens and flag for navigation
      if (response.status === 401 && errorData.code === 'user_not_found') {
        useAuthStore.getState().clearTokens();

        // Log the issue for debugging
        logger.warn('User not found - account may have been deleted', {
          code: errorData.code,
        });

        // Set flag to indicate navigation is needed (handled by error boundary/component)
        throw new ApiError(
          'User account not found. Please sign in again.',
          { ...errorData, shouldRedirectHome: true },
          response.status
        );
      }
    } else {
      // No parseable response body
      errorMessage = '';
      errorData = {};
    }

    throw new ApiError(errorMessage, errorData, response.status);
  }

  // Handle 204 No Content responses (like DELETE)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
