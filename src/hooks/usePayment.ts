import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/lib/api';
import { CheckoutSessionRequest, CustomerPortalRequest } from '@/types/tenant';

// Hook for creating checkout sessions
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
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.checkout_url;
    },
    onError: (error: any) => {
      console.error('Failed to create checkout session:', error);
    },
  });
};

// Hook for accessing customer portal
export const useCreateCustomerPortalSession = () => {
  return useMutation({
    mutationFn: (portalData: CustomerPortalRequest) => 
      paymentApi.createCustomerPortalSession(portalData),
    onSuccess: (data) => {
      // Redirect to Stripe customer portal
      window.location.href = data.portal_url;
    },
    onError: (error: any) => {
      console.error('Failed to create customer portal session:', error);
    },
  });
};
