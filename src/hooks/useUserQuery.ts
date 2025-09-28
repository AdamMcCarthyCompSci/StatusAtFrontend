import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, authApi } from '../lib/api';
import { User } from '../types/user';
import { useAuthStore } from '../stores/useAuthStore';

// Query keys for consistency
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
};

// Hook to get current user
export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: userApi.getCurrentUser,
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Hook to update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: (updatedUser: User) => {
      // Update the cache with the new user data
      queryClient.setQueryData(userKeys.current(), updatedUser);
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
}

// Authentication hooks
export function useLogin() {
  const queryClient = useQueryClient();
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setTokens(data); // Store tokens
      queryClient.invalidateQueries({ queryKey: userKeys.current() }); // Invalidate user query to fetch fresh user data
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (userData: { name: string; email: string; password: string; marketing_consent: boolean }) =>
      authApi.signup(userData),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

export function useResendConfirmation() {
  return useMutation({
    mutationFn: authApi.resendConfirmation,
  });
}

export function useConfirmEmail() {
  return useMutation({
    mutationFn: authApi.confirmEmail,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearTokens } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // Perform any backend logout if necessary
      clearTokens(); // Clear tokens from store
      queryClient.removeQueries({ queryKey: userKeys.all }); // Clear all user-related queries
      // Redirect to home page after logout
      window.location.href = '/';
    },
  });
}