import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { Building2, Users, Package, Settings, Crown, User, Briefcase, AlertCircle, Eye, LogOut, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useSoleOwnership } from '@/hooks/useSoleOwnership';
import { useLeaveTenantMutation } from '@/hooks/useLeaveTenantMutation';
import { useDeleteEnrollment } from '@/hooks/useEnrollmentQuery';

const Dashboard = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { user: authUser } = useAuthStore(); // Get user from auth store as fallback
  const { selectedTenant } = useTenantStore();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const { soleOwnerships } = useSoleOwnership(user || authUser);
  const leaveTenantMutation = useLeaveTenantMutation();
  const deleteEnrollmentMutation = useDeleteEnrollment();
  
  // Use user from query or fallback to auth store
  const currentUser = user || authUser;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const hasMemberships = currentUser.memberships && currentUser.memberships.length > 0;
  
  // Get current selected tenant membership
  const selectedMembership = currentUser.memberships?.find(m => m.tenant_uuid === selectedTenant);
  
  // Filter enrollments by selected tenant, or show all if no tenant selected
  const filteredEnrollments = selectedTenant 
    ? currentUser.enrollments?.filter(enrollment => enrollment.tenant_uuid === selectedTenant) || []
    : currentUser.enrollments || [];
  
  const hasEnrollments = filteredEnrollments.length > 0;

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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'default';
      case 'STAFF':
        return 'secondary';
      case 'MEMBER':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleLeaveOrganization = async () => {
    if (!selectedMembership) return;

    // Check if user is sole owner
    const isSoleOwner = soleOwnerships.some(
      ownership => ownership.tenant_uuid === selectedMembership.tenant_uuid
    );

    const warningMessage = isSoleOwner
      ? `You are the sole owner of "${selectedMembership.tenant_name}". Leaving this organization will delete it permanently, including all flows, members, and data. This action cannot be undone.`
      : `Are you sure you want to leave "${selectedMembership.tenant_name}"? You will lose access to all flows and data in this organization.`;

    const confirmed = await confirm({
      title: 'Leave Organization',
      description: warningMessage,
      variant: 'destructive',
      confirmText: isSoleOwner ? 'Delete Organization' : 'Leave Organization',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await leaveTenantMutation.mutateAsync(selectedMembership.tenant_uuid);
      } catch (error) {
        console.error('Failed to leave organization:', error);
      }
    }
  };

  const handleLeaveFlow = async (enrollmentUuid: string, flowName: string, tenantUuid: string) => {
    const confirmed = await confirm({
      title: 'Leave Flow',
      description: `Are you sure you want to leave "${flowName}"? You will lose access to your status tracking.`,
      variant: 'destructive',
      confirmText: 'Leave Flow',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteEnrollmentMutation.mutateAsync({ tenantUuid, enrollmentUuid });
      } catch (error) {
        console.error('Failed to leave flow:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.name || currentUser.email}
          </p>
        </div>

        {/* Current Organization Context */}
        {selectedMembership && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <CardTitle className="text-lg">{selectedMembership.tenant_name}</CardTitle>
                    <CardDescription>
                      You are managing this organization as {selectedMembership.role.toLowerCase()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(selectedMembership.role)} className="flex items-center gap-1">
                    {getRoleIcon(selectedMembership.role)}
                    {selectedMembership.role}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLeaveOrganization}
                    disabled={leaveTenantMutation.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {leaveTenantMutation.isPending ? 'Leaving...' : 'Leave Organization'}
                  </Button>
                </div>
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
                  <CardTitle className="text-lg text-destructive">No Organization Selected</CardTitle>
                  <CardDescription>
                    Please select an organization from the menu to access management features.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Management Actions - Only show if tenant is selected */}
        {selectedMembership && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Manage Flows
                </CardTitle>
                <CardDescription>
                  Create and manage status tracking workflows for {selectedMembership.tenant_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link to="/flows">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Flows
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Manage Members
                </CardTitle>
                <CardDescription>
                  Manage team members and their roles in {selectedMembership.tenant_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link to="/members">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Members
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Manage Customers
                </CardTitle>
                <CardDescription>
                  View and manage customer enrollments in {selectedMembership.tenant_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link to="/customer-management">
                    <User className="h-4 w-4 mr-2" />
                    Manage Customers
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Organization Settings */}
            <Card className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Organization Settings
                </CardTitle>
                <CardDescription>
                  Customize your organization's branding and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link to="/organization-settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Customize Branding
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customer Enrollments */}
        {hasEnrollments && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Your Status Tracking</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEnrollments.map((enrollment) => (
                <Card key={enrollment.uuid} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{enrollment.flow_name}</CardTitle>
                    <CardDescription>
                      in {enrollment.tenant_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Step:</span>
                        <Badge variant="secondary">{enrollment.current_step_name}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Started: {new Date(enrollment.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link to={`/status-tracking/${enrollment.uuid}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Flow
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleLeaveFlow(enrollment.uuid, enrollment.flow_name, enrollment.tenant_uuid)}
                          disabled={deleteEnrollmentMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm">Current Tier: <Badge variant="outline" className="ml-1 capitalize">{currentUser.tier.toLowerCase()}</Badge></div>
                <div className="text-xs text-muted-foreground">Manage your profile, theme, and account settings</div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/account">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {!hasMemberships && !hasEnrollments && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Organizations Found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have access to any organizations yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to get access to an organization.
            </p>
          </div>
        )}

        {/* No Enrollments for Selected Tenant */}
        {hasMemberships && !hasEnrollments && selectedTenant && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Status Tracking</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any active status tracking in this organization.
            </p>
            <p className="text-sm text-muted-foreground">
              Ask your administrator to enroll you in a flow, or scan a QR code invitation.
            </p>
          </div>
        )}
      </div>
      
      <ConfirmationDialog />
    </div>
  );
};

export default Dashboard;