import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { useTenantByUuid } from '@/hooks/useTenantQuery';

const SubscriptionStatusCard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  
  const { data: tenant, isLoading } = useTenantByUuid(selectedTenant || '');
  const currentMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);
  const isOwner = currentMembership?.role === 'OWNER';

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return 'Free';
      case 'statusat_starter':
        return 'Starter';
      case 'statusat_professional':
        return 'Professional';
      default:
        return tier;
    }
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

  const handleManageSubscription = () => {
    navigate('/organization-settings');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant={getTierBadgeVariant(tenant?.tier || 'FREE')} className="mb-1">
              {getTierDisplayName(tenant?.tier || 'FREE')}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Current subscription plan
            </p>
          </div>
        </div>

        {isOwner && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManageSubscription}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
        )}

        {!isOwner && (
          <p className="text-xs text-muted-foreground">
            Only organization owners can manage subscriptions
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusCard;
