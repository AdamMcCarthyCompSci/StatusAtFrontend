import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../lib/api';
import { User } from '../types/user';
import { useAuthStore } from '../stores/useAuthStore';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation<User, Error, { userId: number; userData: Partial<User> }>({
    mutationFn: ({ userId, userData }) => userApi.updateUser(userId, userData),
    onSuccess: (updatedUser) => {
      // Update the user in auth store
      setUser(updatedUser);
      
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { clearTokens } = useAuthStore();

  return useMutation<void, Error, number>({
    mutationFn: (userId) => userApi.deleteUser(userId),
    onSuccess: () => {
      // Clear auth state since user is deleted
      clearTokens();
      
      // Clear all cached data
      queryClient.clear();
    },
  });
}
