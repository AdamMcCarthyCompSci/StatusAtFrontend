import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Loader2,
  CreditCard,
  Settings,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import {
  useCreateCheckoutSession,
  useUpgradeSubscription,
  useCreateCustomerPortalSession,
} from '@/hooks/usePayment';
import { useTenantByUuid } from '@/hooks/useTenantQuery';
import { SubscriptionTier } from '@/types/tenant';
import { logger } from '@/lib/logger';

const getSubscriptionPlans = (t: any) => ({
  FREE: {
    name: t('subscription.plans.FREE.name'),
    price: t('subscription.plans.FREE.price'),
    period: t('subscription.plans.FREE.period'),
    description: t('subscription.plans.FREE.description'),
    features: [
      t('subscription.plans.FREE.features.unlimitedUpdates'),
      t('subscription.plans.FREE.features.unlimitedCases'),
      t('subscription.plans.FREE.features.unlimitedManagers'),
      t('subscription.plans.FREE.features.allFeaturesEnabled'),
      t('subscription.plans.FREE.features.internalUse'),
    ],
    limitations: [],
  },
  CREATED: {
    name: t('subscription.plans.CREATED.name'),
    price: t('subscription.plans.CREATED.price'),
    period: t('subscription.plans.CREATED.period'),
    description: t('subscription.plans.CREATED.description'),
    features: [
      t('subscription.plans.CREATED.features.noUpdates'),
      t('subscription.plans.CREATED.features.setupRequired'),
    ],
    limitations: [
      t('subscription.plans.CREATED.limitations.cannotSendUpdates'),
      t('subscription.plans.CREATED.limitations.mustSelectPlan'),
    ],
  },
  CANCELLED: {
    name: t('subscription.plans.CANCELLED.name'),
    price: t('subscription.plans.CANCELLED.price'),
    period: t('subscription.plans.CANCELLED.period'),
    description: t('subscription.plans.CANCELLED.description'),
    features: [
      t('subscription.plans.CANCELLED.features.noUpdates'),
      t('subscription.plans.CANCELLED.features.readOnlyAccess'),
    ],
    limitations: [
      t('subscription.plans.CANCELLED.limitations.cannotSendUpdates'),
      t('subscription.plans.CANCELLED.limitations.cannotCreateCases'),
      t('subscription.plans.CANCELLED.limitations.reactivationRequired'),
    ],
  },
  STARTER: {
    name: t('subscription.plans.STARTER.name'),
    price: t('subscription.plans.STARTER.price'),
    period: t('subscription.plans.STARTER.period'),
    description: t('subscription.plans.STARTER.description'),
    features: [
      t('subscription.plans.STARTER.features.activeCases'),
      t('subscription.plans.STARTER.features.statusUpdates'),
      t('subscription.plans.STARTER.features.managers'),
      t('subscription.plans.STARTER.features.noBranding'),
      t('subscription.plans.STARTER.features.priorityEmail'),
    ],
    limitations: [
      t('subscription.plans.STARTER.limitations.limitedCases'),
      t('subscription.plans.STARTER.limitations.limitedUpdates'),
      t('subscription.plans.STARTER.limitations.limitedManagers'),
      t('subscription.plans.STARTER.limitations.noCustomBranding'),
    ],
  },
  PROFESSIONAL: {
    name: t('subscription.plans.PROFESSIONAL.name'),
    price: t('subscription.plans.PROFESSIONAL.price'),
    period: t('subscription.plans.PROFESSIONAL.period'),
    description: t('subscription.plans.PROFESSIONAL.description'),
    features: [
      t('subscription.plans.PROFESSIONAL.features.activeCases'),
      t('subscription.plans.PROFESSIONAL.features.statusUpdates'),
      t('subscription.plans.PROFESSIONAL.features.managers'),
      t('subscription.plans.PROFESSIONAL.features.uploadLogo'),
      t('subscription.plans.PROFESSIONAL.features.priorityEmail'),
    ],
    limitations: [
      t('subscription.plans.PROFESSIONAL.limitations.limitedCases'),
      t('subscription.plans.PROFESSIONAL.limitations.limitedUpdates'),
      t('subscription.plans.PROFESSIONAL.limitations.limitedManagers'),
      t('subscription.plans.PROFESSIONAL.limitations.noCustomColors'),
      t('subscription.plans.PROFESSIONAL.limitations.noDedicatedManager'),
    ],
  },
  ENTERPRISE: {
    name: t('subscription.plans.ENTERPRISE.name'),
    price: t('subscription.plans.ENTERPRISE.price'),
    period: t('subscription.plans.ENTERPRISE.period'),
    description: t('subscription.plans.ENTERPRISE.description'),
    features: [
      t('subscription.plans.ENTERPRISE.features.unlimitedCases'),
      t('subscription.plans.ENTERPRISE.features.statusUpdates'),
      t('subscription.plans.ENTERPRISE.features.unlimitedManagers'),
      t('subscription.plans.ENTERPRISE.features.brandColors'),
      t('subscription.plans.ENTERPRISE.features.dedicatedSupport'),
    ],
    limitations: [],
  },
});

interface SubscriptionManagementProps {
  className?: string;
}

const SubscriptionManagement = ({ className }: SubscriptionManagementProps) => {
  const { t } = useTranslation();
  const SUBSCRIPTION_PLANS = getSubscriptionPlans(t);
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<{
    tier: SubscriptionTier;
    planName: string;
    isDowngrade: boolean;
  } | null>(null);

  const createCheckoutMutation = useCreateCheckoutSession();
  const upgradeSubscriptionMutation = useUpgradeSubscription();
  const createPortalMutation = useCreateCustomerPortalSession();

  // Close dialog on successful upgrade
  if (upgradeSubscriptionMutation.isSuccess && showUpgradeConfirm) {
    setShowUpgradeConfirm(false);
    setPendingUpgrade(null);
    upgradeSubscriptionMutation.reset();
  }

  // Get current tenant data (contains tier, usage, etc)
  const { data: tenant, isLoading: tenantLoading } = useTenantByUuid(
    selectedTenant || ''
  );

  // Extract ownership info from user memberships
  const currentMembership = user?.memberships?.find(
    m => m.tenant_uuid === selectedTenant
  );
  const isOwner = currentMembership?.role === 'OWNER';

  // Determine if user has an active paid subscription
  const hasSubscription =
    tenant?.tier && !['FREE', 'CREATED', 'CANCELLED'].includes(tenant.tier);

  // Get current tier from tenant data (backend now returns correct tier names)
  const currentTier = (tenant?.tier ||
    'FREE') as keyof typeof SUBSCRIPTION_PLANS;

  const handleSubscribe = (
    tier: SubscriptionTier,
    planName: string,
    isDowngrade = false
  ) => {
    if (!selectedTenant) {
      logger.error('No tenant selected');
      return;
    }

    // If user has a subscription, show confirmation dialog before upgrading/downgrading
    // Otherwise, use checkout endpoint (redirects to Stripe)
    if (hasSubscription) {
      setPendingUpgrade({ tier, planName, isDowngrade });
      setShowUpgradeConfirm(true);
    } else {
      createCheckoutMutation.mutate({
        tier,
        tenant_id: selectedTenant,
      });
    }
  };

  const confirmUpgrade = async () => {
    if (!selectedTenant || !pendingUpgrade) return;

    upgradeSubscriptionMutation.mutate({
      tier: pendingUpgrade.tier,
      tenant_id: selectedTenant,
    });
  };

  const handleManageBilling = () => {
    if (!selectedTenant) {
      logger.error('No tenant selected');
      return;
    }

    createPortalMutation.mutate({
      tenant_id: selectedTenant,
    });
  };

  const getTierDisplayName = (tier: string) => {
    return (
      SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]?.name || tier
    );
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return 'secondary';
      case 'CREATED':
        return 'outline';
      case 'CANCELLED':
        return 'destructive';
      case 'statusat_starter':
        return 'default';
      case 'statusat_professional':
        return 'destructive';
      case 'statusat_enterprise':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (tenantLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t('subscription.loadingSubscription')}</span>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t('subscription.ownerOnly')}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      {/* Upgrade/Downgrade Confirmation Dialog */}
      <ConfirmationDialog
        open={showUpgradeConfirm}
        onOpenChange={setShowUpgradeConfirm}
        title={
          pendingUpgrade?.isDowngrade
            ? t('subscription.confirmPlanDowngrade')
            : t('subscription.confirmPlanUpgrade')
        }
        description={
          pendingUpgrade?.isDowngrade
            ? t('subscription.downgradeDescription', {
                current: getTierDisplayName(currentTier),
                new: pendingUpgrade.planName,
              })
            : t('subscription.upgradeDescription', {
                current: getTierDisplayName(currentTier),
                new: pendingUpgrade?.planName || '',
              })
        }
        confirmText={
          pendingUpgrade?.isDowngrade
            ? t('subscription.confirmDowngrade')
            : t('subscription.confirmUpgrade')
        }
        cancelText={t('common.cancel')}
        variant={pendingUpgrade?.isDowngrade ? 'warning' : 'info'}
        onConfirm={confirmUpgrade}
        loading={upgradeSubscriptionMutation.isPending}
      />

      {/* Current Subscription Status - Only show for active subscriptions */}
      {hasSubscription && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('subscription.currentSubscription')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge
                  variant={getTierBadgeVariant(currentTier)}
                  className="mb-2"
                >
                  {getTierDisplayName(currentTier)}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {SUBSCRIPTION_PLANS[currentTier]?.price || 'N/A'}{' '}
                  {SUBSCRIPTION_PLANS[currentTier]?.period || ''}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={createPortalMutation.isPending}
              >
                {createPortalMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
                {t('subscription.manageBilling')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Free Trial Banner */}
      {!hasSubscription && (
        <Alert className="mb-6 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <Check className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-bold text-foreground">
                {t('subscription.startFreeTrial')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('subscription.freeTrialDescription')}
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* Error Messages */}
      {(createCheckoutMutation.error ||
        createPortalMutation.error ||
        upgradeSubscriptionMutation.error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {createCheckoutMutation.error?.message ||
              createPortalMutation.error?.message ||
              upgradeSubscriptionMutation.error?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Object.entries(SUBSCRIPTION_PLANS)
          .filter(([tier]) => !['FREE', 'CREATED', 'CANCELLED'].includes(tier)) // Hide non-purchasable tiers
          .map(([tier, plan]) => {
            const isCurrentTier = tier === currentTier;
            const isPaidTier = tier !== 'FREE';

            // Determine button action based on current tier and target tier
            const getButtonAction = () => {
              if (isCurrentTier) return 'current';

              // Define tier hierarchy for upgrade/downgrade logic
              const tierOrder = [
                'FREE',
                'STARTER',
                'PROFESSIONAL',
                'ENTERPRISE',
              ];
              const currentIndex = tierOrder.indexOf(currentTier);
              const targetIndex = tierOrder.indexOf(tier);

              if (targetIndex > currentIndex) return 'upgrade';
              if (targetIndex < currentIndex) return 'downgrade';
              return 'switch';
            };

            const buttonAction = getButtonAction();

            return (
              <Card
                key={tier}
                className={`relative flex flex-col ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}
              >
                {isCurrentTier && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform">
                    <Badge className="bg-primary">
                      {t('subscription.currentPlan')}
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      {plan.name}
                      {!isCurrentTier && !hasSubscription && (
                        <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600">
                          7-Day Free Trial
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">
                        {plan.period}
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {plan.description ||
                      (isPaidTier
                        ? 'Full-featured plan'
                        : 'Basic plan with limitations')}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="mb-2 font-medium">
                        {t('subscription.features')}
                      </h4>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations (only for FREE tier) */}
                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-medium text-muted-foreground">
                          {t('subscription.limitations')}
                        </h4>
                        <ul className="space-y-1">
                          {plan.limitations.map((limitation, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <X className="h-4 w-4 text-red-500" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Action Button - Pinned to bottom */}
                <div className="p-6 pt-0">
                  {buttonAction === 'current' ? (
                    <Button variant="outline" className="w-full" disabled>
                      {t('subscription.currentPlan')}
                    </Button>
                  ) : buttonAction === 'upgrade' ? (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleSubscribe(tier as SubscriptionTier, plan.name)
                      }
                      disabled={
                        createCheckoutMutation.isPending ||
                        upgradeSubscriptionMutation.isPending
                      }
                    >
                      {createCheckoutMutation.isPending ||
                      upgradeSubscriptionMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {hasSubscription
                        ? t('subscription.upgradeToPlan', { plan: plan.name })
                        : 'Start Free Trial'}
                    </Button>
                  ) : buttonAction === 'downgrade' ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleSubscribe(
                          tier as SubscriptionTier,
                          plan.name,
                          true
                        )
                      }
                      disabled={
                        createCheckoutMutation.isPending ||
                        upgradeSubscriptionMutation.isPending
                      }
                    >
                      {createCheckoutMutation.isPending ||
                      upgradeSubscriptionMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {t('subscription.downgradeToPlan', { plan: plan.name })}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleSubscribe(tier as SubscriptionTier, plan.name)
                      }
                      disabled={
                        createCheckoutMutation.isPending ||
                        upgradeSubscriptionMutation.isPending
                      }
                    >
                      {createCheckoutMutation.isPending ||
                      upgradeSubscriptionMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {t('subscription.switchToPlan', { plan: plan.name })}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
      </div>

      {/* Additional Information */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>{t('subscription.billingInfo')}:</strong>
            </p>
            <ul className="ml-4 space-y-1">
              {!hasSubscription && (
                <>
                  <li>
                    •{' '}
                    <strong className="text-foreground">
                      {t('subscription.freeTrialIncluded')}
                    </strong>
                  </li>
                  <li>
                    •{' '}
                    <strong className="text-foreground">
                      {t('subscription.chargedAfterTrial')}
                    </strong>
                  </li>
                </>
              )}
              <li>• {t('subscription.billedMonthly')}</li>
              <li>• {t('subscription.planChangesImmediate')}</li>
              <li>• {t('subscription.securePayments')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
