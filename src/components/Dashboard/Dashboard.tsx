import {
  Building2,
  Users,
  Package,
  Settings,
  Crown,
  User,
  Briefcase,
  AlertCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  UserPlus,
  Clock,
  MoveRight,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { useTenantsByName } from '@/hooks/useTenantQuery';
import { useTenantStatus } from '@/hooks/useTenantStatus';
import {
  useEnrollmentStats,
  useFlowsForFiltering,
} from '@/hooks/useEnrollmentQuery';
import SubscriptionManagement from '@/components/Payment/SubscriptionManagement';
import { InviteCustomerModal } from '@/components/Customer/InviteCustomerModal';
import { inviteApi } from '@/lib/api';
import { logger } from '@/lib/logger';

const Dashboard = () => {
  const { t } = useTranslation();
  const { data: user, isLoading } = useCurrentUser();
  const { user: authUser } = useAuthStore(); // Get user from auth store as fallback
  const { selectedTenant } = useTenantStore();
  const { isRestrictedTenant, tenantTier } = useTenantStatus();
  const queryClient = useQueryClient();

  // Fetch enrollment stats for the selected tenant (used in hero card)
  const { data: enrollmentStats } = useEnrollmentStats(selectedTenant || '');

  // Fetch flows for invite modal
  const { data: availableFlows = [] } = useFlowsForFiltering(
    selectedTenant || ''
  );

  // Invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Use user from query or fallback to auth store
  const currentUser = user || authUser;

  // Get tenant names from enrollments for the organization cards
  const tenantNames = currentUser?.enrollments?.map(e => e.tenant_name) || [];
  const uniqueTenantNames = [...new Set(tenantNames)]; // Remove duplicates

  // Fetch tenant data using public endpoint for organization cards
  const { tenants } = useTenantsByName(uniqueTenantNames);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">{t('auth.pleaseLogin')}</p>
        </div>
      </div>
    );
  }

  const hasMemberships =
    currentUser.memberships && currentUser.memberships.length > 0;

  // Get current selected tenant membership
  const selectedMembership = currentUser.memberships?.find(
    m => m.tenant_uuid === selectedTenant
  );

  // Group enrollments by tenant name for organization cards
  const enrollmentsByTenantName =
    currentUser.enrollments?.reduce(
      (acc, enrollment) => {
        if (!acc[enrollment.tenant_name]) {
          acc[enrollment.tenant_name] = [];
        }
        acc[enrollment.tenant_name].push(enrollment);
        return acc;
      },
      {} as Record<string, typeof currentUser.enrollments>
    ) || {};

  const hasEnrollments = Object.keys(enrollmentsByTenantName).length > 0;

  // Invite customer handlers
  const handleInviteCustomer = async (email: string, flowUuid: string) => {
    if (!selectedTenant) {
      logger.error('No tenant selected');
      return;
    }

    setIsInviting(true);
    setInviteError(null);

    try {
      await inviteApi.createTenantInvite(selectedTenant, {
        email,
        invite_type: 'flow_enrollment',
        flow: flowUuid,
      });

      // Close modal on success
      setIsInviteModalOpen(false);

      // Invalidate stats query to refresh the dashboard
      queryClient.invalidateQueries({
        queryKey: ['enrollments', selectedTenant, 'stats'],
      });

      logger.info(`Successfully sent invite to ${email}`);
    } catch (error: any) {
      logger.error('Failed to invite customer', error);

      // Handle specific error cases
      if (error?.response?.status === 403) {
        setInviteError(
          error?.response?.data?.detail || t('customers.customerLimitReached')
        );
      } else if (error?.data?.email?.[0]) {
        setInviteError(error.data.email[0]);
      } else if (error?.response?.data?.detail) {
        setInviteError(error.response.data.detail);
      } else {
        setInviteError(t('customers.inviteError'));
      }
    } finally {
      setIsInviting(false);
    }
  };

  const handleOpenInviteModal = () => {
    setInviteError(null);
    setIsInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteError(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4" />;
      case 'STAFF':
        return <Users className="h-4 w-4" />;
      case 'MEMBER':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t('dashboard.welcome', {
              name: currentUser.name || currentUser.email,
            })}
          </p>
        </div>

        {/* Create Organization Section - Only show if user has no memberships */}
        {!hasMemberships && (
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {t('dashboard.createFirstOrg')}
                  </CardTitle>
                  <CardDescription>{t('dashboard.getStarted')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/create-organization">
                  <Building2 className="mr-2 h-4 w-4" />
                  {t('dashboard.createOrganization')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Restricted Tenant Warning - CREATED/CANCELLED */}
        {isRestrictedTenant && selectedMembership && (
          <Card className="border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                <div>
                  <CardTitle className="text-lg text-yellow-800 dark:text-yellow-300">
                    {tenantTier === 'CREATED'
                      ? t('dashboard.completeSubscription')
                      : t('dashboard.subscriptionCancelled')}
                  </CardTitle>
                  <CardDescription className="text-yellow-700 dark:text-yellow-400">
                    {tenantTier === 'CREATED'
                      ? t('dashboard.subscribeToStart')
                      : t('dashboard.subscriptionCancelledDescription')}
                  </CardDescription>
                </div>
              </div>

              {/* Subscription Management for restricted tenants */}
              <div className="mt-4">
                <SubscriptionManagement />
              </div>
            </CardHeader>
          </Card>
        )}

        {/* No Tenant Selected Warning */}
        {hasMemberships && !selectedTenant && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-lg text-destructive">
                    {t('dashboard.selectOrganization')}
                  </CardTitle>
                  <CardDescription>
                    {t('dashboard.selectOrganizationDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Management Actions - Only show if tenant is selected and NOT restricted */}
        {hasMemberships && selectedMembership && !isRestrictedTenant && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {t('dashboard.managementTools')}
              </h2>
            </div>

            {/* Hero Card: Customer Management */}
            <Card className="via-primary/3 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background transition-all hover:border-primary/30 hover:shadow-lg">
              <CardHeader>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2 flex items-center gap-3 text-2xl">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      {t('customers.manageCustomers')}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t('customers.heroDescription')}
                    </CardDescription>
                  </div>

                  {/* Stats Grid */}
                  {enrollmentStats && (
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-2xl font-bold">
                          <Users className="h-5 w-5 text-primary" />
                          {enrollmentStats.total_count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t('dashboard.totalCustomers')}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                          <TrendingUp className="h-5 w-5" />
                          {enrollmentStats.active_count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t('dashboard.activeCustomers')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recent Activity */}
                {enrollmentStats &&
                  enrollmentStats.recently_updated &&
                  enrollmentStats.recently_updated.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {t('dashboard.recentActivity')}
                      </div>
                      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-border/80 max-h-[300px] space-y-2 overflow-y-auto pr-2">
                        {enrollmentStats.recently_updated.map(enrollment => (
                          <div
                            key={enrollment.uuid}
                            className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/50 p-3 text-sm transition-colors hover:bg-accent"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="truncate font-medium">
                                      {enrollment.user?.name ||
                                        enrollment.user_name}
                                    </span>
                                    {enrollment.identifier && (
                                      <Badge
                                        variant="outline"
                                        className="flex-shrink-0 py-0 text-[10px]"
                                      >
                                        {enrollment.identifier}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="truncate text-xs text-muted-foreground">
                                    {enrollment.flow?.name ||
                                      enrollment.flow_name}
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  enrollment.is_active ? 'default' : 'secondary'
                                }
                                className="ml-2 flex-shrink-0"
                              >
                                {enrollment.is_active
                                  ? t('customers.active')
                                  : t('customers.inactive')}
                              </Badge>
                            </div>

                            {/* Activity transition information */}
                            {enrollment.activity && (
                              <div className="flex items-center gap-2 rounded bg-muted/50 px-2 py-1.5 text-xs">
                                {enrollment.activity.is_backward ? (
                                  <RotateCcw className="h-3 w-3 text-orange-500" />
                                ) : (
                                  <MoveRight className="h-3 w-3 text-green-500" />
                                )}
                                <span className="text-muted-foreground">
                                  {enrollment.activity.is_backward
                                    ? enrollment.activity.to_step
                                    : enrollment.activity.from_step}
                                </span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">
                                  {enrollment.activity.is_backward
                                    ? enrollment.activity.from_step
                                    : enrollment.activity.to_step}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="flex-1 px-8 py-6" size="lg">
                    <Link to="/customer-management">
                      <User className="mr-2 h-5 w-5" />
                      {t('customers.viewAllCustomers')}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleOpenInviteModal}
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    {t('customers.inviteCustomer')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Management Tools */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="flex flex-col transition-shadow hover:shadow-md">
                <CardHeader className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" />
                    {t('flows.manageFlows')}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {t('flows.manageFlowsDescription', {
                      tenant: selectedMembership.tenant_name,
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/flows">
                      <Package className="mr-2 h-4 w-4" />
                      {t('flows.manageFlows')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex flex-col transition-shadow hover:shadow-md">
                <CardHeader className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    {t('members.manageMembers')}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {t('members.manageMembersDescription', {
                      tenant: selectedMembership.tenant_name,
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/members">
                      <Users className="mr-2 h-4 w-4" />
                      {t('members.manageMembers')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex flex-col transition-shadow hover:shadow-md">
                <CardHeader className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    {t('settings.organizationSettings')}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {t('settings.customizeBranding')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/organization-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      {t('settings.manageOrganization')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tenant Cards - Your Status Tracking */}
        {hasEnrollments && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">
                {t('dashboard.yourOrganizations')}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {t('dashboard.allOrganizations')}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tenants.map(tenant => {
                const tenantEnrollments =
                  enrollmentsByTenantName[tenant.name] || [];
                const membership = currentUser.memberships?.find(
                  m => m.tenant_name === tenant.name
                );
                const isManaged = membership !== undefined;

                return (
                  <Card
                    key={tenant.name}
                    className={`group overflow-hidden transition-all duration-200 hover:shadow-lg ${
                      isManaged ? 'ring-2 ring-primary/20' : ''
                    }`}
                    style={{
                      borderColor: tenant.theme?.primary_color
                        ? `${tenant.theme.primary_color}20`
                        : undefined,
                    }}
                  >
                    {/* Header with theme colors */}
                    <div
                      className="relative overflow-hidden p-6 text-white"
                      style={{
                        backgroundColor:
                          tenant.theme?.primary_color || 'hsl(var(--primary))',
                      }}
                    >
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 bg-black/10"></div>

                      <div className="relative mb-4 flex items-center gap-4">
                        {/* Logo */}
                        {tenant.logo && (
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white/20 backdrop-blur-sm">
                            <img
                              src={
                                tenant.logo.startsWith('http') ||
                                tenant.logo.startsWith('data:')
                                  ? tenant.logo
                                  : `${import.meta.env.VITE_API_HOST}${tenant.logo}`
                              }
                              alt={`${tenant.name} logo`}
                              className="h-8 w-8 object-contain"
                              onError={e => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3
                            className="truncate text-lg font-bold"
                            style={{
                              color: tenant.theme?.text_color || 'white',
                            }}
                          >
                            {tenant.name}
                          </h3>
                          {tenant.description && (
                            <p
                              className="truncate text-sm opacity-90"
                              style={{
                                color: tenant.theme?.text_color || 'white',
                              }}
                            >
                              {tenant.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Role badge - only show for managed organizations */}
                      {isManaged && membership && (
                        <Badge
                          variant="secondary"
                          className="border-white/30 bg-white/20 text-white"
                          style={{
                            backgroundColor: tenant.theme?.secondary_color
                              ? `${tenant.theme.secondary_color}40`
                              : 'rgba(255,255,255,0.2)',
                            color: tenant.theme?.text_color || 'white',
                          }}
                        >
                          {getRoleIcon(membership.role)}
                          <span className="ml-1">{membership.role}</span>
                        </Badge>
                      )}

                      {/* Managed indicator */}
                      {isManaged && (
                        <div className="absolute right-2 top-2">
                          <div className="h-3 w-3 rounded-full border border-white/20 bg-white shadow-sm"></div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Enrollment count */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {t('dashboard.activeFlows')}:
                          </span>
                          <Badge variant="outline">
                            {tenantEnrollments.length}
                          </Badge>
                        </div>

                        {/* Recent enrollments preview */}
                        {tenantEnrollments.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              {t('dashboard.recent')}:
                            </p>
                            {tenantEnrollments.slice(0, 2).map(enrollment => (
                              <div
                                key={enrollment.uuid}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="flex-1 truncate">
                                  {enrollment.flow_name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                  style={{
                                    backgroundColor: tenant.theme
                                      ?.secondary_color
                                      ? `${tenant.theme.secondary_color}20`
                                      : undefined,
                                    color:
                                      tenant.theme?.secondary_color ||
                                      undefined,
                                  }}
                                >
                                  {enrollment.current_step_name}
                                </Badge>
                              </div>
                            ))}
                            {tenantEnrollments.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                {t('dashboard.moreFlows', {
                                  count: tenantEnrollments.length - 2,
                                })}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action button */}
                        <Button
                          asChild
                          className="w-full transition-colors group-hover:bg-primary/90"
                          style={{
                            backgroundColor:
                              tenant.theme?.primary_color || undefined,
                          }}
                        >
                          <Link to={`/${encodeURIComponent(tenant.name)}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('dashboard.viewOrganization')}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('settings.accountSettings')}
            </CardTitle>
            <CardDescription>{t('settings.managePreferences')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  {t('settings.manageProfile')}
                </div>
              </div>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/account">
                  <Settings className="mr-2 h-4 w-4" />
                  {t('settings.manageAccount')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* No Organizations Found - Only for users with no memberships AND no enrollments */}
        {!hasMemberships && !hasEnrollments && (
          <div className="py-12 text-center">
            <Building2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              {t('dashboard.noOrganizations')}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {t('dashboard.noAccess')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.contactAdmin')}
            </p>
          </div>
        )}
      </div>

      {/* Invite Customer Modal */}
      <InviteCustomerModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        onInvite={handleInviteCustomer}
        availableFlows={availableFlows}
        isInviting={isInviting}
        error={inviteError}
      />
    </div>
  );
};

export default Dashboard;
