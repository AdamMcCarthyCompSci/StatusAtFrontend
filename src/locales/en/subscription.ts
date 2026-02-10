export default {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
  upgrade: 'Upgrade',
  downgrade: 'Downgrade',
  manage: 'Manage Subscription',
  billingPortal: 'Billing Portal',
  currentSubscription: 'Current Subscription',
  manageBilling: 'Manage Billing',
  startFreeTrial: 'Start Your 7-Day Free Trial',
  freeTrialDescription:
    'Try any plan risk-free with full access to all features. No credit card charged until after 7 days. Cancel anytime.',
  planName: {
    adminMode: 'Admin Mode',
    pendingSetup: 'Pending Setup',
    cancelled: 'Cancelled',
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  },
  perMonth: 'per month',
  unlimited: 'unlimited',
  notActive: 'not active',
  inactive: 'inactive',
  features: 'Features',
  limitations: 'Limitations',
  currentPlan: 'Current Plan',
  upgradeToPlan: 'Upgrade to {{plan}}',
  downgradeToPlan: 'Downgrade to {{plan}}',
  switchToPlan: 'Switch to {{plan}}',
  confirmPlanUpgrade: 'Confirm Plan Upgrade',
  confirmPlanDowngrade: 'Confirm Plan Downgrade',
  upgradeDescription:
    "You're about to upgrade from {{current}} to {{new}}. Your subscription will be updated immediately with prorated billing. You'll be charged for the difference based on your billing cycle.",
  downgradeDescription:
    "You're about to downgrade from {{current}} to {{new}}. Your subscription will be updated immediately with prorated billing. You'll receive a credit for the unused time on your current plan, which will be applied to your next billing cycle.",
  confirmUpgrade: 'Confirm Upgrade',
  confirmDowngrade: 'Confirm Downgrade',
  ownerOnly:
    'Only organization owners can manage subscriptions. Contact your organization owner to upgrade.',
  loadingSubscription: 'Loading subscription information...',
  billingInfo: 'Billing Information',
  freeTrialIncluded: 'All new subscriptions include a 7-day free trial',
  chargedAfterTrial: "You'll only be charged after the trial period ends",
  billedMonthly:
    'Subscriptions are billed monthly and can be cancelled anytime',
  planChangesImmediate:
    'Plan changes take effect immediately with prorated billing',
  securePayments: 'All payments are processed securely through Stripe',

  activateFreePlan: 'Start Free Plan',

  // Subscription Plan Details
  plans: {
    INTERNAL: {
      name: 'Admin Mode',
      price: '€0',
      period: 'unlimited',
      description: 'Full access for testing and administration (not a trial)',
      features: {
        unlimitedUpdates: 'Unlimited status updates',
        unlimitedCases: 'Unlimited active cases',
        unlimitedManagers: 'Unlimited managers',
        allFeaturesEnabled: 'All features enabled',
        internalUse: 'For internal use only',
      },
    },
    FREE: {
      name: 'Free',
      price: '€0',
      period: 'forever',
      description:
        'Get started with the basics — upgrade anytime for full features',
      features: {
        activeCases: '25 active cases',
        statusUpdates: '100 status updates/month',
        managers: '1 manager',
        customFlows: 'Custom status flows',
        qrEnrollment: 'QR code enrollment',
        mobilePortal: 'Mobile responsive portal',
      },
      limitations: {
        noDocuments: 'No document uploading',
        noEmail: 'No email notifications',
        noWhatsApp: 'No WhatsApp notifications',
        noBranding: 'No custom branding',
      },
    },
    CREATED: {
      name: 'Pending Setup',
      price: '€0',
      period: 'not active',
      description: 'Organization created but not yet configured',
      features: {
        noUpdates: 'No status updates available',
        setupRequired: 'Setup required',
      },
      limitations: {
        cannotSendUpdates: 'Cannot send status updates',
        mustSelectPlan: 'Must select a subscription plan',
      },
    },
    CANCELLED: {
      name: 'Cancelled',
      price: '€0',
      period: 'inactive',
      description: 'Subscription has been cancelled',
      features: {
        noUpdates: 'No status updates available',
        readOnlyAccess: 'Read-only access to historical data',
      },
      limitations: {
        cannotSendUpdates: 'Cannot send status updates',
        cannotCreateCases: 'Cannot create new cases',
        reactivationRequired: 'Reactivation required',
      },
    },
    STARTER: {
      name: 'Starter',
      price: '€49',
      period: 'per month',
      description:
        'Ideal for: Solo practitioners and small firms just getting started',
      features: {
        activeCases: '25 active cases',
        statusUpdates: '100 status updates/month',
        managers: '1 manager',
        noBranding: 'No branding',
        priorityEmail: 'Priority Email (24h)',
      },
      limitations: {
        limitedCases: 'Only 25 active cases',
        limitedUpdates: 'Only 100 status updates/month',
        limitedManagers: 'Only 1 manager',
        noCustomBranding: 'No custom branding',
      },
    },
    PROFESSIONAL: {
      name: 'Professional',
      price: '€99',
      period: 'per month',
      description:
        'Ideal for: Growing service businesses with multiple team members',
      features: {
        activeCases: '100 active cases',
        statusUpdates: '500 status updates/month',
        managers: '5 managers',
        uploadLogo: 'Upload logo',
        priorityEmail: 'Priority email (24h)',
      },
      limitations: {
        limitedCases: 'Only 100 active cases',
        limitedUpdates: 'Only 500 status updates/month',
        limitedManagers: 'Only 5 managers',
        noCustomColors: 'No custom colors',
        noDedicatedManager: 'No dedicated manager',
      },
    },
    ENTERPRISE: {
      name: 'Enterprise',
      price: '€199',
      period: 'per month',
      description:
        'Ideal for: Larger firms and organizations with specific needs',
      features: {
        unlimitedCases: 'Unlimited active cases',
        statusUpdates: '2000 status updates/month',
        unlimitedManagers: 'Unlimited managers',
        brandColors: 'Brand colours and upload logo',
        dedicatedSupport: 'Dedicated support',
      },
    },
  },
};
