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
    name: 'Free Trial',
    price: '€0',
    period: 'for 7 days',
    features: [
      '5 active cases',
      '20 status updates',
      '1 manager',
      'statusat.com/COMPANY',
      'No branding',
    ],
    limitations: [
      'Limited to 7 days',
      'Only 5 active cases',
      'Only 20 status updates',
      'No priority support',
      'No custom branding',
    ],
  },
  statusat_starter: {
    name: 'Starter',
    price: '€49',
    period: 'per month',
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
    features: [
      '100 active cases',
      'Unlimited status updates',
      '5 managers',
      'statusat.com/COMPANY',
      'Upload logo',
      'Priority email (24h)',
    ],
    limitations: [
      'Only 100 active cases',
      'Only 5 managers',
      'Limited to subdomain',
      'No custom colors',
      'No dedicated manager',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    features: [
      'Unlimited active cases',
      'Unlimited status updates',
      'Unlimited managers',
      'COMPANY.statusat.com',
      'Brand colours and upload logo',
      'Dedicated support manager',
    ],
    limitations: [],
    isEnterprise: true,
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
          const isEnterprise = plan.isEnterprise;
          
          // Determine button action based on current tier and target tier
          const getButtonAction = () => {
            if (isCurrentTier) return 'current';
            if (isEnterprise) return 'contact';
            
            // Define tier hierarchy for upgrade/downgrade logic
            const tierOrder = ['FREE', 'statusat_starter', 'statusat_professional'];
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
                  {plan.name}
                  <div className="text-right">
                    <div className="text-2xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                  </div>
                </CardTitle>
                <CardDescription>
                  {isPaidTier ? 'Full-featured plan' : 'Basic plan with limitations'}
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
                ) : buttonAction === 'contact' ? (
                  <Button
                    className="w-full"
                    onClick={() => window.location.href = 'mailto:hello@statusat.com?subject=Enterprise Plan Inquiry'}
                  >
                    Contact Us
                  </Button>
                ) : buttonAction === 'upgrade' ? (
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
                ) : buttonAction === 'downgrade' ? (
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
                    Downgrade to {plan.name}
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
