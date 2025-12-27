import { apiRequest } from './client';
import { User } from '../../types/user';

/**
 * Authentication API methods
 * Handles login, signup, password reset, and email confirmation
 */
export const authApi = {
  /**
   * Login with email and password
   * @param credentials - User email and password
   * @returns Access and refresh tokens
   */
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ access: string; refresh: string }> => {
    const response = await apiRequest<{ access: string; refresh: string }>(
      '/token',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      false
    );
    return response;
  },

  /**
   * Create a new user account
   * @param userData - User registration data
   * @returns Newly created user
   */
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    marketing_consent: boolean;
    invite_token?: string;
  }): Promise<User> =>
    apiRequest<User>(
      '/user',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      false
    ),

  /**
   * Request password reset email
   * @param email - User email address
   * @returns Success message
   */
  forgotPassword: (email: string): Promise<{ message: string }> =>
    apiRequest<{ message: string }>(
      '/user/reset_password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
      false
    ),

  /**
   * Resend email confirmation
   * @param email - User email address
   * @returns Success message as plain string
   */
  resendConfirmation: (email: string): Promise<string> =>
    apiRequest<string>(
      '/user/request_confirmation_email',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
      false
    ),

  /**
   * Confirm email with token from confirmation email
   * @param token - Email confirmation token
   * @returns Success status and message
   */
  confirmEmail: (
    token: string
  ): Promise<{ message: string; success: boolean }> =>
    apiRequest<{ message: string; success: boolean }>(
      '/user/confirm_email',
      {
        method: 'POST',
        body: JSON.stringify({ token }),
      },
      false
    ),
};
