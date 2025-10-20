import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Settings, Check, X, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { useCreateCheckoutSession, useCreateCustomerPortalSession } from '@/hooks/usePayment';
import { useTenantByUuid } from '@/hooks/useTenantQuery';
import { SubscriptionTier } from '@/types/tenant';

const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Up to 3 flows',
      'Up to 50 enrollments per month',
      'Basic email notifications',
      'Community support',
    ],
    limitations: [
      'Limited customization',
      'No advanced analytics',
      'No priority support',
    ],
  },
  statusat_starter: {
    name: 'Starter',
    price: '$29',
    period: 'per month',
    features: [
      'Unlimited flows',
      'Up to 500 enrollments per month',
      'Email & WhatsApp notifications',
      'Custom branding',
      'Basic analytics',
      'Email support',
    ],
    limitations: [],
  },
  statusat_professional: {
    name: 'Professional',
    price: '$99',
    period: 'per month',
    features: [
      'Everything in Starter',
      'Unlimited enrollments',
      'Advanced analytics & reporting',
      'API access',
      'Webhook integrations',
      'Priority support',
      'Custom integrations',
    ],
    limitations: [],
  },
};

interface SubscriptionManagementProps {
  className?: string;
}

const SubscriptionManagement = ({ className }: SubscriptionManagementProps) => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  
  const createCheckoutMutation = useCreateCheckoutSession();
  const createPortalMutation = useCreateCustomerPortalSession();

  // Get current tenant data
  const { data: tenant, isLoading: tenantLoading } = useTenantByUuid(selectedTenant || '');
  const currentMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);
  const isOwner = currentMembership?.role === 'OWNER';

  // Get current tier from tenant data
  const currentTier: keyof typeof SUBSCRIPTION_PLANS = tenant?.tier || 'FREE';

  const handleSubscribe = (tier: SubscriptionTier) => {
    if (!selectedTenant) {
      console.error('No tenant selected');
      return;
    }

    createCheckoutMutation.mutate({
      tier,
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Subscription Management</h2>
        <p className="text-muted-foreground">
          Manage your organization's subscription and billing settings.
        </p>
      </div>

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
                {SUBSCRIPTION_PLANS[currentTier].price} {SUBSCRIPTION_PLANS[currentTier].period}
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

      {/* Error Messages */}
      {(createCheckoutMutation.error || createPortalMutation.error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {createCheckoutMutation.error?.message || createPortalMutation.error?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(SUBSCRIPTION_PLANS).map(([tier, plan]) => {
          const isCurrentTier = tier === currentTier;
          const isPaidTier = tier !== 'FREE';
          const canUpgrade = currentTier === 'FREE' && isPaidTier;
          const canDowngrade = currentTier !== 'FREE' && tier === 'FREE';

          return (
            <Card key={tier} className={`relative ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}>
              {isCurrentTier && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary">Current Plan</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  <Badge variant={getTierBadgeVariant(tier)}>
                    {plan.price} {plan.period}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {isPaidTier ? 'Full-featured plan' : 'Basic plan with limitations'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
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

                  {/* Action Button */}
                  <div className="pt-4">
                    {isCurrentTier ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : canUpgrade ? (
                      <Button
                        className="w-full"
                        onClick={() => handleSubscribe(tier as SubscriptionTier)}
                        disabled={createCheckoutMutation.isPending}
                      >
                        {createCheckoutMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Upgrade to {plan.name}
                      </Button>
                    ) : canDowngrade ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleManageBilling}
                        disabled={createPortalMutation.isPending}
                      >
                        {createPortalMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Settings className="h-4 w-4 mr-2" />
                        )}
                        Manage in Billing Portal
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSubscribe(tier as SubscriptionTier)}
                        disabled={createCheckoutMutation.isPending}
                      >
                        {createCheckoutMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Switch to {plan.name}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
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
              <li>• Subscriptions are billed monthly and can be cancelled anytime</li>
              <li>• Changes take effect immediately</li>
              <li>• All payments are processed securely through Stripe</li>
              <li>• Contact support for enterprise pricing and custom plans</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
