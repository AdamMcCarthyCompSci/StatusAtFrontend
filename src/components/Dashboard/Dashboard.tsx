import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { Building2, Users, Package, Settings, Crown, User, Briefcase, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { user: authUser } = useAuthStore(); // Get user from auth store as fallback
  const { selectedTenant } = useTenantStore();
  
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
  const hasEnrollments = currentUser.enrollments && currentUser.enrollments.length > 0;
  
  // Get current selected tenant membership
  const selectedMembership = currentUser.memberships?.find(m => m.tenant_uuid === selectedTenant);

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
                <Badge variant={getRoleBadgeVariant(selectedMembership.role)} className="flex items-center gap-1">
                  {getRoleIcon(selectedMembership.role)}
                  {selectedMembership.role}
                </Badge>
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
                  <Link to="/customers">
                    <User className="h-4 w-4 mr-2" />
                    Manage Customers
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
              {currentUser.enrollments.map((enrollment) => (
                <Card key={enrollment.uuid} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{enrollment.flow_name}</CardTitle>
                    <CardDescription>
                      in {enrollment.tenant_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Step:</span>
                        <Badge variant="secondary">{enrollment.current_step_name}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Started: {new Date(enrollment.created_at).toLocaleDateString()}
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
      </div>
    </div>
  );
};

export default Dashboard;