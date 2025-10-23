import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Loader2, CreditCard, Settings, Check, X, AlertCircle, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { useCreateCheckoutSession, useUpgradeSubscription, useCreateCustomerPortalSession } from '@/hooks/usePayment';
import { useTenantByUuid } from '@/hooks/useTenantQuery';
import { SubscriptionTier } from '@/types/tenant';

const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free Trial',
    price: '€0',
    period: 'for 7 days',
    features: [
      '5 active cases',
      '10 status updates',
      '1 manager',
      'statusat.com/COMPANY',
      'No branding',
    ],
    limitations: [
      'Limited to 7 days',
      'Only 5 active cases',
      'Only 10 status updates',
      'No priority support',
      'No custom branding',
    ],
  },
  statusat_starter: {
    name: 'Starter',
    price: '€49',
    period: 'per month',
    description: 'Ideal for: Solo practitioners and small firms just getting started',
    features: [
      '25 active cases',
      '100 status updates/month',
      '1 manager',
      'statusat.com/COMPANY',
      'No branding',
      'Priority Email (24h)',
    ],
    limitations: [
      'Only 25 active cases',
      'Only 100 status updates/month',
      'Only 1 manager',
      'No custom branding',
      'Limited to subdomain',
    ],
  },
  statusat_professional: {
    name: 'Professional',
    price: '€99',
    period: 'per month',
    description: 'Ideal for: Growing service businesses with multiple team members',
    features: [
      '100 active cases',
      '500 status updates/month',
      '5 managers',
      'statusat.com/COMPANY',
      'Upload logo',
      'Priority email (24h)',
    ],
    limitations: [
      'Only 100 active cases',
      'Only 500 status updates/month',
      'Only 5 managers',
      'Limited to subdomain',
      'No custom colors',
      'No dedicated manager',
    ],
  },
  statusat_enterprise: {
    name: 'Enterprise',
    price: '€199',
    period: 'per month',
    description: 'Ideal for: Larger firms and organizations with specific needs',
    features: [
      'Unlimited active cases',
      '2000 status updates/month',
      'Unlimited managers',
      'COMPANY.statusat.com',
      'Brand colours and upload logo',
      'Dedicated support',
    ],
    limitations: [],
    lookupKey: 'statusat_enterprise',
  },
};

interface SubscriptionManagementProps {
  className?: string;
}

const SubscriptionManagement = ({ className }: SubscriptionManagementProps) => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<{ tier: SubscriptionTier; planName: string; isDowngrade: boolean } | null>(null);

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
  const { data: tenant, isLoading: tenantLoading } = useTenantByUuid(selectedTenant || '');

  // Extract ownership info from user memberships
  const currentMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);
  const isOwner = currentMembership?.role === 'OWNER';

  // Determine if user has an active paid subscription
  const hasSubscription = tenant?.tier !== 'FREE';

  // Normalize tier name to match SUBSCRIPTION_PLANS keys
  const normalizeTier = (tier?: string): keyof typeof SUBSCRIPTION_PLANS => {
    if (!tier) return 'FREE';

    // Map various backend tier formats to frontend keys
    const tierMap: Record<string, keyof typeof SUBSCRIPTION_PLANS> = {
      'FREE': 'FREE',
      'STARTER': 'statusat_starter',
      'statusat_starter': 'statusat_starter',
      'PROFESSIONAL': 'statusat_professional',
      'statusat_professional': 'statusat_professional',
      'ENTERPRISE': 'statusat_enterprise',
      'statusat_enterprise': 'statusat_enterprise',
    };

    const normalizedTier = tierMap[tier] || 'FREE';

    // Debug logging to see what the backend returns
    if (!tierMap[tier] && tier !== 'FREE') {
      console.warn(`Unknown tier from backend: "${tier}". Falling back to FREE. Please update tierMap.`);
    }

    return normalizedTier;
  };

  // Get current tier from tenant data with normalization
  const currentTier = normalizeTier(tenant?.tier);

  const handleSubscribe = (tier: SubscriptionTier, planName: string, isDowngrade = false) => {
    if (!selectedTenant) {
      console.error('No tenant selected');
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
      console.error('No tenant selected');
      return;
    }

    createPortalMutation.mutate({
      tenant_id: selectedTenant,
    });
  };

  const getTierDisplayName = (tier: string) => {
    return SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]?.name || tier;
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return 'secondary';
      case 'statusat_starter':
        return 'default';
      case 'statusat_professional':
        return 'destructive';
      case 'ENTERPRISE':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (tenantLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading subscription information...</span>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Only organization owners can manage subscriptions. Contact your organization owner to upgrade.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      {/* Upgrade/Downgrade Confirmation Dialog */}
      <ConfirmationDialog
        open={showUpgradeConfirm}
        onOpenChange={setShowUpgradeConfirm}
        title={pendingUpgrade?.isDowngrade ? "Confirm Plan Downgrade" : "Confirm Plan Upgrade"}
        description={
          pendingUpgrade?.isDowngrade
            ? `You're about to downgrade from ${getTierDisplayName(currentTier)} to ${pendingUpgrade.planName}. Your subscription will be updated immediately with prorated billing. You'll receive a credit for the unused time on your current plan, which will be applied to your next billing cycle.`
            : `You're about to upgrade from ${getTierDisplayName(currentTier)} to ${pendingUpgrade?.planName || ''}. Your subscription will be updated immediately with prorated billing. You'll be charged for the difference based on your billing cycle.`
        }
        confirmText={pendingUpgrade?.isDowngrade ? "Confirm Downgrade" : "Confirm Upgrade"}
        cancelText="Cancel"
        variant={pendingUpgrade?.isDowngrade ? "warning" : "info"}
        onConfirm={confirmUpgrade}
        loading={upgradeSubscriptionMutation.isPending}
      />

      {/* Current Subscription Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={getTierBadgeVariant(currentTier)} className="mb-2">
                {getTierDisplayName(currentTier)}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {SUBSCRIPTION_PLANS[currentTier]?.price || 'N/A'} {SUBSCRIPTION_PLANS[currentTier]?.period || ''}
              </p>
            </div>
            {currentTier !== 'FREE' && (
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
                Manage Billing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {tenant?.usage && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usage This Month
            </CardTitle>
            <CardDescription>
              Track your status updates and stay within your plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Updates Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Status Updates</span>
                <span className="text-muted-foreground">
                  {tenant.usage.current_usage} / {tenant.usage.limit}
                </span>
              </div>
              <Progress
                value={tenant.usage.percentage_used}
                className="h-2"
              />
              {tenant.usage.overage > 0 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Overage Alert:</strong> You've used {tenant.usage.overage} extra status updates.
                    Additional cost: €{(tenant.usage.overage * 0.05).toFixed(2)} (€0.05 per update)
                  </AlertDescription>
                </Alert>
              )}
              <div className="text-xs text-muted-foreground">
                Billing period started: {new Date(tenant.usage.billing_period_start).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Free Trial Banner */}
      {!hasSubscription && (
        <Alert className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">Start Your 7-Day Free Trial</h3>
              <p className="text-sm text-muted-foreground">
                Try any plan risk-free with full access to all features. No credit card charged until after 7 days. Cancel anytime.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* Error Messages */}
      {(createCheckoutMutation.error || createPortalMutation.error || upgradeSubscriptionMutation.error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {createCheckoutMutation.error?.message || createPortalMutation.error?.message || upgradeSubscriptionMutation.error?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(SUBSCRIPTION_PLANS)
          .filter(([tier]) => tier !== 'FREE') // Hide FREE tier since it's baked into all plans
          .map(([tier, plan]) => {
          const isCurrentTier = tier === currentTier;
          const isPaidTier = tier !== 'FREE';

          // Determine button action based on current tier and target tier
          const getButtonAction = () => {
            if (isCurrentTier) return 'current';

            // Define tier hierarchy for upgrade/downgrade logic
            const tierOrder = ['FREE', 'statusat_starter', 'statusat_professional', 'statusat_enterprise'];
            const currentIndex = tierOrder.indexOf(currentTier);
            const targetIndex = tierOrder.indexOf(tier);

            if (targetIndex > currentIndex) return 'upgrade';
            if (targetIndex < currentIndex) return 'downgrade';
            return 'switch';
          };

          const buttonAction = getButtonAction();

          return (
            <Card key={tier} className={`relative flex flex-col ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}>
              {isCurrentTier && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary">Current Plan</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    {plan.name}
                    {!isCurrentTier && !hasSubscription && (
                      <Badge className="ml-2 bg-green-500 hover:bg-green-600 text-white">
                        7-Day Free Trial
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                  </div>
                </CardTitle>
                <CardDescription>
                  {plan.description || (isPaidTier ? 'Full-featured plan' : 'Basic plan with limitations')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations (only for FREE tier) */}
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-muted-foreground">Limitations</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
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
                    Current Plan
                  </Button>
                ) : buttonAction === 'upgrade' ? (
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(tier as SubscriptionTier, plan.name)}
                    disabled={createCheckoutMutation.isPending || upgradeSubscriptionMutation.isPending}
                  >
                    {(createCheckoutMutation.isPending || upgradeSubscriptionMutation.isPending) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {hasSubscription ? `Upgrade to ${plan.name}` : 'Start Free Trial'}
                  </Button>
                ) : buttonAction === 'downgrade' ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSubscribe(tier as SubscriptionTier, plan.name, true)}
                    disabled={createCheckoutMutation.isPending || upgradeSubscriptionMutation.isPending}
                  >
                    {(createCheckoutMutation.isPending || upgradeSubscriptionMutation.isPending) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Downgrade to {plan.name}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSubscribe(tier as SubscriptionTier, plan.name)}
                    disabled={createCheckoutMutation.isPending || upgradeSubscriptionMutation.isPending}
                  >
                    {(createCheckoutMutation.isPending || upgradeSubscriptionMutation.isPending) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Switch to {plan.name}
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
              <strong>Billing Information:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              {!hasSubscription && (
                <>
                  <li>• <strong className="text-foreground">All new subscriptions include a 7-day free trial</strong></li>
                  <li>• <strong className="text-foreground">You'll only be charged after the trial period ends</strong></li>
                </>
              )}
              <li>• Subscriptions are billed monthly and can be cancelled anytime</li>
              <li>• Plan changes take effect immediately with prorated billing</li>
              <li>• All payments are processed securely through Stripe</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
