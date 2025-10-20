import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { Building2, Users, Package, Settings, Crown, User, Briefcase, AlertCircle, Eye, LogOut, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useSoleOwnership } from '@/hooks/useSoleOwnership';
import { useLeaveTenantMutation } from '@/hooks/useLeaveTenantMutation';
import { useTenantsByName } from '@/hooks/useTenantQuery';

const Dashboard = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { user: authUser } = useAuthStore(); // Get user from auth store as fallback
  const { selectedTenant } = useTenantStore();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const { soleOwnerships } = useSoleOwnership(user || authUser);
  const leaveTenantMutation = useLeaveTenantMutation();
  
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
  
  // Get tenant names from enrollments for the organization cards
  const tenantNames = currentUser.enrollments?.map(e => e.tenant_name) || [];
  const uniqueTenantNames = [...new Set(tenantNames)]; // Remove duplicates

  // Fetch tenant data using public endpoint for organization cards
  const { tenants } = useTenantsByName(uniqueTenantNames);
  
  // Group enrollments by tenant name for organization cards
  const enrollmentsByTenantName = currentUser.enrollments?.reduce((acc, enrollment) => {
    if (!acc[enrollment.tenant_name]) {
      acc[enrollment.tenant_name] = [];
    }
    acc[enrollment.tenant_name].push(enrollment);
    return acc;
  }, {} as Record<string, typeof currentUser.enrollments>) || {};
  
  const hasEnrollments = Object.keys(enrollmentsByTenantName).length > 0;

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


  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Welcome back, {currentUser.name || currentUser.email}
          </p>
        </div>

        {/* Management Context Banner */}
        {selectedMembership && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-xl flex flex-col sm:flex-row sm:items-center gap-2">
                      <span>Management Mode</span>
                      <Badge variant={getRoleBadgeVariant(selectedMembership.role)} className="flex items-center gap-1 w-fit">
                        {getRoleIcon(selectedMembership.role)}
                        {selectedMembership.role}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-base">
                      You are managing <strong>{selectedMembership.tenant_name}</strong> as {selectedMembership.role?.toLowerCase()}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveOrganization}
                  disabled={leaveTenantMutation.isPending}
                  className="w-full sm:w-auto font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {leaveTenantMutation.isPending ? 'Leaving...' : 'Leave Organization'}
                </Button>
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
                  <CardTitle className="text-lg text-destructive">Select Organization to Manage</CardTitle>
                  <CardDescription>
                    Choose an organization from the hamburger menu to access management features like flows, members, and settings.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Management Actions - Only show if tenant is selected */}
        {hasMemberships && selectedMembership && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Management Tools</h2>
              <Badge variant="outline" className="text-xs">
                {selectedMembership.tenant_name}
              </Badge>
            </div>
            
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
          </div>
        )}

        {/* Divider between Management and Enrollment areas */}
        {hasMemberships && selectedMembership && hasEnrollments && (
          <div className="border-t border-border/50 my-8">
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-px bg-border flex-1 w-16"></div>
                <span className="px-3 py-1 bg-background rounded-full border border-border/50">
                  Management vs Enrollment
                </span>
                <div className="h-px bg-border flex-1 w-16"></div>
              </div>
            </div>
          </div>
        )}

        {/* Tenant Cards - Your Status Tracking */}
        {hasEnrollments && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Your Organizations</h2>
              <Badge variant="secondary" className="text-xs">
                All Organizations
              </Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tenants.map((tenant) => {
                const tenantEnrollments = enrollmentsByTenantName[tenant.name] || [];
                const membership = currentUser.memberships?.find(m => m.tenant_name === tenant.name);
                const isManaged = membership !== undefined;
                
                return (
                  <Card 
                    key={tenant.name} 
                    className={`hover:shadow-lg transition-all duration-200 overflow-hidden group ${
                      isManaged ? 'ring-2 ring-primary/20' : ''
                    }`}
                    style={{
                      borderColor: tenant.theme?.primary_color ? `${tenant.theme.primary_color}20` : undefined,
                    }}
                  >
                    {/* Header with theme colors */}
                    <div 
                      className="p-6 text-white relative overflow-hidden"
                      style={{
                        backgroundColor: tenant.theme?.primary_color || 'hsl(var(--primary))',
                      }}
                    >
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 bg-black/10"></div>
                      
                      <div className="relative flex items-center gap-4 mb-4">
                        {/* Logo */}
                        {tenant.logo && (
                          <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                            <img 
                              src={tenant.logo.startsWith('http') || tenant.logo.startsWith('data:') 
                                ? tenant.logo 
                                : `${import.meta.env.VITE_API_HOST}${tenant.logo}`
                              }
                              alt={`${tenant.name} logo`}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="text-lg font-bold truncate"
                            style={{ color: tenant.theme?.text_color || 'white' }}
                          >
                            {tenant.name}
                          </h3>
                          {tenant.description && (
                            <p 
                              className="text-sm opacity-90 truncate"
                              style={{ color: tenant.theme?.text_color || 'white' }}
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
                          className="bg-white/20 text-white border-white/30"
                          style={{
                            backgroundColor: tenant.theme?.secondary_color ? `${tenant.theme.secondary_color}40` : 'rgba(255,255,255,0.2)',
                            color: tenant.theme?.text_color || 'white',
                          }}
                        >
                          {getRoleIcon(membership.role)}
                          <span className="ml-1">{membership.role}</span>
                        </Badge>
                      )}
                      
                      {/* Managed indicator */}
                      {isManaged && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-white rounded-full shadow-sm border border-white/20"></div>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Enrollment count */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Active Flows:</span>
                          <Badge variant="outline">{tenantEnrollments.length}</Badge>
                        </div>
                        
                        {/* Recent enrollments preview */}
                        {tenantEnrollments.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Recent:</p>
                            {tenantEnrollments.slice(0, 2).map((enrollment) => (
                              <div key={enrollment.uuid} className="flex items-center justify-between text-sm">
                                <span className="truncate flex-1">{enrollment.flow_name}</span>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs ml-2"
                                  style={{
                                    backgroundColor: tenant.theme?.secondary_color ? `${tenant.theme.secondary_color}20` : undefined,
                                    color: tenant.theme?.secondary_color || undefined,
                                  }}
                                >
                                  {enrollment.current_step_name}
                                </Badge>
                              </div>
                            ))}
                            {tenantEnrollments.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{tenantEnrollments.length - 2} more flows
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Action button */}
                        <Button 
                          asChild 
                          className="w-full group-hover:bg-primary/90 transition-colors"
                          style={{
                            backgroundColor: tenant.theme?.primary_color || undefined,
                          }}
                        >
                          <Link to={`/${encodeURIComponent(tenant.name)}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Organization
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Manage your profile, theme, and account settings</div>
              </div>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/account">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* No Organizations Found - Only for users with no memberships AND no enrollments */}
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

      </div>
      
      <ConfirmationDialog />
    </div>
  );
};

export default Dashboard;