import { apiRequest } from './client';
import { User } from '../../types/user';

/**
 * User API methods
 * Handles user profile operations
 */
export const userApi = {
  /**
   * Get current authenticated user
   * @returns Current user data
   */
  getCurrentUser: (): Promise<User> => apiRequest('/user/me'),

  /**
   * Update user profile
   * @param userId - User ID
   * @param userData - Partial user data to update
   * @returns Updated user data
   */
  updateUser: (userId: number, userData: Partial<User>): Promise<User> =>
    apiRequest(`/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),

  /**
   * Delete user account
   * @param userId - User ID to delete
   */
  deleteUser: (userId: number): Promise<void> =>
    apiRequest(`/user/${userId}`, {
      method: 'DELETE',
    }),

  /**
   * Unsubscribe from emails
   * @param token - Unsubscribe token from email link
   * @param onlyMarketing - If true, only unsubscribe from marketing emails
   */
  unsubscribe: (token: string, onlyMarketing?: boolean): Promise<void> =>
    apiRequest(
      '/public/unsubscribe',
      {
        method: 'POST',
        body: JSON.stringify({
          token,
          ...(onlyMarketing !== undefined && { only_marketing: onlyMarketing }),
        }),
      },
      false // Public endpoint, no auth required
    ),
};
