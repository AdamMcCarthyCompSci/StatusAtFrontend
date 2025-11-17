/**
 * Unified API exports
 * Import all API methods from this central location
 *
 * @example
 * import { userApi, flowApi, authApi } from '@/lib/api';
 *
 * // Use the APIs
 * const user = await userApi.getCurrentUser();
 * const flows = await flowApi.getFlows(tenantUuid);
 */

// Export the base client for advanced use cases
export { apiRequest } from './client';

// Export all domain APIs
export { authApi } from './auth';
export { userApi } from './user';
export { tenantApi } from './tenant';
export { flowApi } from './flow';
export { memberApi } from './member';
export { enrollmentApi } from './enrollment';
export { flowBuilderApi } from './flowBuilder';
export { messageApi, notificationApi, inviteApi } from './message';
export { paymentApi } from './payment';
