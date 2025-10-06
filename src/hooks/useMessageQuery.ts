import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi, notificationApi } from '../lib/api';
import { 
  MessageListParams, 
  MessageActionRequest,
  UpdateNotificationPreferencesRequest
} from '../types/message';
import { useAuthStore } from '../stores/useAuthStore';
import { userKeys } from './useUserQuery';

// Query keys - exactly like enrollment pattern
export const messageKeys = {
  all: ['messages'] as const,
  user: (userUuid: string) => [...messageKeys.all, 'user', userUuid] as const,
  lists: (userUuid: string, params?: MessageListParams) => [...messageKeys.user(userUuid), 'list', params] as const,
  detail: (userUuid: string, messageUuid: string) => [...messageKeys.user(userUuid), 'detail', messageUuid] as const,
};

export const notificationKeys = {
  all: ['notifications'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

// Message Hooks - exactly like enrollment pattern
export function useMessages(userUuid: string, params?: MessageListParams) {
  return useQuery({
    queryKey: messageKeys.lists(userUuid, params),
    queryFn: () => messageApi.getMessages(params),
    enabled: !!userUuid, // Only enabled when user is provided - like enrollment pattern
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: (messageUuid: string) => messageApi.markMessageAsRead(messageUuid),
    onSuccess: () => {
      // Invalidate message lists to refresh the data - user-scoped like enrollment pattern
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: messageKeys.user(user.id.toString()) });
      }
      
      // Invalidate the current user query to refresh dashboard message counts
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
    onError: (error) => {
      console.error('Failed to mark message as read:', error);
    },
  });
}

export function useTakeMessageAction() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: ({ messageUuid, actionData }: { messageUuid: string; actionData: MessageActionRequest }) =>
      messageApi.takeMessageAction(messageUuid, actionData),
    onSuccess: () => {
      // Invalidate message lists to refresh the data - user-scoped like enrollment pattern
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: messageKeys.user(user.id.toString()) });
      }
      
      // Invalidate the current user query to refresh dashboard message counts
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
    onError: (error) => {
      console.error('Failed to take message action:', error);
    },
  });
}

// Notification Preferences Hooks
export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationApi.getNotificationPreferences(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: UpdateNotificationPreferencesRequest) =>
      notificationApi.updateNotificationPreferences(preferences),
    onSuccess: (updatedPreferences) => {
      // Update the preferences cache
      queryClient.setQueryData(
        notificationKeys.preferences(),
        updatedPreferences
      );
    },
    onError: (error) => {
      console.error('Failed to update notification preferences:', error);
    },
  });
}

// Helper hook to get unread message count
export function useUnreadMessageCount() {
  const { user } = useAuthStore();
  const { data: messagesData } = useMessages(user?.id?.toString() || '', { 
    is_read: false,
    page: 1,
    page_size: 1 // We only need the count
  });
  
  return messagesData?.count || 0;
}

// Helper hook to get actionable message count
export function useActionableMessageCount() {
  const { user } = useAuthStore();
  const { data: messagesData } = useMessages(user?.id?.toString() || '', { 
    requires_action: true,
    page: 1,
    page_size: 1 // We only need the count
  });
  
  return messagesData?.count || 0;
}