import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/lib/api';
import { NotificationPreferences, UpdateNotificationPreferencesRequest } from '@/types/message';

// Query key factory
export const notificationPreferencesKeys = {
  all: ['notificationPreferences'] as const,
  preferences: () => [...notificationPreferencesKeys.all, 'preferences'] as const,
};

// Hook to get notification preferences
export function useNotificationPreferencesQuery() {
  return useQuery({
    queryKey: notificationPreferencesKeys.preferences(),
    queryFn: () => notificationApi.getNotificationPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to update notification preferences
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: UpdateNotificationPreferencesRequest) =>
      notificationApi.updateNotificationPreferences(preferences),
    onSuccess: (updatedPreferences: NotificationPreferences) => {
      // Update the cached data
      queryClient.setQueryData(
        notificationPreferencesKeys.preferences(),
        updatedPreferences
      );
    },
    onError: (error) => {
      console.error('Failed to update notification preferences:', error);
    },
  });
}
