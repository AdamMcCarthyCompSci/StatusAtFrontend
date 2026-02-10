import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paymentApi } from '@/lib/api';
import {
  CheckoutSessionRequest,
  CustomerPortalRequest,
  UpgradeSubscriptionRequest,
  ActivateFreePlanRequest,
} from '@/types/tenant';
import { logger } from '@/lib/logger';

import { tenantKeys } from './useTenantQuery';
import { userKeys } from './useUserQuery';

// Hook for creating checkout sessions (for new subscriptions)
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (checkoutData: CheckoutSessionRequest) => {
      // Add success URL to the checkout data
      const checkoutDataWithUrls = {
        ...checkoutData,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/success?canceled=true`,
      };
      return paymentApi.createCheckoutSession(checkoutDataWithUrls);
    },
    onSuccess: data => {
      // Redirect to Stripe checkout
      window.location.href = data.checkout_url;
    },
    onError: (error: any) => {
      logger.error('Failed to create checkout session:', error);
    },
  });
};

// Hook for upgrading existing subscription (instant with proration)
export const useUpgradeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (upgradeData: UpgradeSubscriptionRequest) =>
      paymentApi.upgradeSubscription(upgradeData),
    onSuccess: (data, variables) => {
      // Invalidate tenant queries to refresh usage and tier info
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },
    onError: (error: any) => {
      logger.error('Failed to upgrade subscription:', error);
    },
  });
};

// Hook for activating the free (freemium) plan
export const useActivateFreePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivateFreePlanRequest) =>
      paymentApi.activateFreePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
    onError: (error: any) => {
      logger.error('Failed to activate free plan:', error);
    },
  });
};

// Hook for accessing customer portal
export const useCreateCustomerPortalSession = () => {
  return useMutation({
    mutationFn: (portalData: CustomerPortalRequest) =>
      paymentApi.createCustomerPortalSession(portalData),
    onSuccess: data => {
      // Redirect to Stripe customer portal
      if (data?.customer_portal_url) {
        window.location.href = data.customer_portal_url;
      } else {
        logger.error('No customer_portal_url in response:', data);
      }
    },
    onError: (error: any) => {
      logger.error('Failed to create customer portal session:', error);
    },
  });
};
