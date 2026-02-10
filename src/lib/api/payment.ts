import { apiRequest } from './client';
import {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  CustomerPortalRequest,
  CustomerPortalResponse,
  UpgradeSubscriptionRequest,
  UpgradeSubscriptionResponse,
  ActivateFreePlanRequest,
  ActivateFreePlanResponse,
} from '../../types/tenant';

/**
 * Payment API methods
 * Handles Stripe payment operations
 */
export const paymentApi = {
  /**
   * Create checkout session for new subscription
   * @param checkoutData - Checkout session data
   * @returns Checkout session with redirect URL
   */
  createCheckoutSession: (
    checkoutData: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> =>
    apiRequest<CheckoutSessionResponse>('/user/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),

  /**
   * Upgrade existing subscription (with proration)
   * @param upgradeData - Upgrade request data
   * @returns Upgrade session with redirect URL
   */
  upgradeSubscription: (
    upgradeData: UpgradeSubscriptionRequest
  ): Promise<UpgradeSubscriptionResponse> =>
    apiRequest<UpgradeSubscriptionResponse>('/user/upgrade', {
      method: 'POST',
      body: JSON.stringify(upgradeData),
    }),

  /**
   * Access customer portal for billing management
   * @param portalData - Customer portal request data
   * @returns Customer portal session with redirect URL
   */
  createCustomerPortalSession: (
    portalData: CustomerPortalRequest
  ): Promise<CustomerPortalResponse> =>
    apiRequest<CustomerPortalResponse>('/user/customer_portal', {
      method: 'POST',
      body: JSON.stringify(portalData),
    }),

  /**
   * Activate the free (freemium) plan for a tenant
   * @param data - Activate free plan request data
   * @returns Success response
   */
  activateFreePlan: (
    data: ActivateFreePlanRequest
  ): Promise<ActivateFreePlanResponse> =>
    apiRequest<ActivateFreePlanResponse>('/user/activate_free', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
