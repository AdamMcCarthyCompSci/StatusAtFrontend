import { apiRequest } from './client';
import { buildQueryString } from '../utils';
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
  InviteValidationResponse,
} from '../../types/message';

/**
 * Message API methods
 * Handles inbox messages and notifications
 */
export const messageApi = {
  /**
   * Get messages with optional filtering
   * @param params - Optional query parameters
   * @returns Paginated list of messages
   */
  getMessages: (params?: MessageListParams): Promise<MessageListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    return apiRequest<MessageListResponse>(
      `/messages${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Mark message as read
   * @param messageUuid - UUID of the message
   * @returns Updated message data
   */
  markMessageAsRead: (messageUuid: string): Promise<Message> =>
    apiRequest<Message>(`/messages/${messageUuid}/mark_read`, {
      method: 'POST',
    }),

  /**
   * Take action on a message (accept/reject)
   * @param messageUuid - UUID of the message
   * @param actionData - Action to take
   * @returns Updated message data
   */
  takeMessageAction: (
    messageUuid: string,
    actionData: MessageActionRequest
  ): Promise<Message> =>
    apiRequest<Message>(`/messages/${messageUuid}/take_action`, {
      method: 'POST',
      body: JSON.stringify(actionData),
    }),

  /**
   * Mark all messages as read
   * @returns Confirmation message with count
   */
  markAllMessagesAsRead: (): Promise<{
    message: string;
    updated_count: number;
  }> =>
    apiRequest<{ message: string; updated_count: number }>(
      '/messages/mark_all_read',
      {
        method: 'POST',
      }
    ),
};

/**
 * Notification Preferences API methods
 * Handles user notification preferences
 */
export const notificationApi = {
  /**
   * Get notification preferences
   * @returns User's notification preferences
   */
  getNotificationPreferences: (): Promise<NotificationPreferences> =>
    apiRequest<NotificationPreferences>('/notification-preferences'),

  /**
   * Update notification preferences
   * @param preferences - Preferences to update
   * @returns Updated notification preferences
   */
  updateNotificationPreferences: (
    preferences: UpdateNotificationPreferencesRequest
  ): Promise<NotificationPreferences> =>
    apiRequest<NotificationPreferences>('/notification-preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    }),
};

/**
 * Invite API methods
 * Handles tenant invitations
 */
export const inviteApi = {
  /**
   * Get tenant invites
   * @param tenantUuid - UUID of the tenant
   * @returns List of invites
   */
  getTenantInvites: (tenantUuid: string): Promise<InviteListResponse> =>
    apiRequest<InviteListResponse>(`/tenants/${tenantUuid}/invites`),

  /**
   * Create tenant invite
   * @param tenantUuid - UUID of the tenant
   * @param inviteData - Invite creation data
   * @returns Newly created invite
   */
  createTenantInvite: (
    tenantUuid: string,
    inviteData: CreateInviteRequest
  ): Promise<Invite> =>
    apiRequest<Invite>(`/tenants/${tenantUuid}/invites`, {
      method: 'POST',
      body: JSON.stringify(inviteData),
    }),

  /**
   * Accept tenant invite
   * @param tenantUuid - UUID of the tenant
   * @param inviteUuid - UUID of the invite
   * @returns Updated invite data
   */
  acceptTenantInvite: (
    tenantUuid: string,
    inviteUuid: string
  ): Promise<Invite> =>
    apiRequest<Invite>(`/tenants/${tenantUuid}/invites/${inviteUuid}/accept`, {
      method: 'POST',
      body: JSON.stringify({ action: 'accept' }),
    }),

  /**
   * Reject tenant invite
   * @param tenantUuid - UUID of the tenant
   * @param inviteUuid - UUID of the invite
   * @returns Updated invite data
   */
  rejectTenantInvite: (
    tenantUuid: string,
    inviteUuid: string
  ): Promise<Invite> =>
    apiRequest<Invite>(`/tenants/${tenantUuid}/invites/${inviteUuid}/reject`, {
      method: 'POST',
      body: JSON.stringify({ action: 'reject' }),
    }),

  /**
   * Validate invite token (public endpoint, no auth required)
   * @param token - Invite token
   * @returns Invite validation result
   */
  validateInviteToken: (token: string): Promise<InviteValidationResponse> =>
    apiRequest<InviteValidationResponse>(
      `/invite/validate/${token}`,
      {},
      false
    ),
};
