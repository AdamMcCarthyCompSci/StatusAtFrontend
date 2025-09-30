import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser, useLogout } from '@/hooks/useUserQuery';
import { getUserRole } from '@/types/user';
import { useAuthStore } from '@/stores/useAuthStore';
import { Building2, Users, Package, Settings, LogOut, Crown, User, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { user: authUser } = useAuthStore(); // Get user from auth store as fallback
  const logoutMutation = useLogout();
  
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

  const userRole = getUserRole(currentUser);
  const hasMemberships = currentUser.memberships && currentUser.memberships.length > 0;
  const hasEnrollments = currentUser.enrollments && currentUser.enrollments.length > 0;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4" />;
      case 'STAFF':
        return <Briefcase className="h-4 w-4" />;
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {currentUser.name || currentUser.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="capitalize">
                {currentUser.tier.toLowerCase()}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Admin Section - Memberships */}
          {hasMemberships && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Organizations You Manage</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentUser.memberships.map((membership) => (
                  <Card key={membership.uuid} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{membership.tenant_name}</CardTitle>
                        <Badge 
                          variant={getRoleBadgeVariant(membership.role)}
                          className="flex items-center gap-1"
                        >
                          {getRoleIcon(membership.role)}
                          {membership.role}
                        </Badge>
                      </div>
                      <CardDescription>
                        Managing as {membership.role.toLowerCase()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Link to={`/members?tenant=${membership.tenant_uuid}`}>
                          <Button size="sm" className="w-full">
                            <Users className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Quick Actions for Admins */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Manage Flows</CardTitle>
                    <CardDescription>Create and manage status tracking workflows</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={currentUser.memberships.length === 1 
                      ? `/flows?tenant=${currentUser.memberships[0].tenant_uuid}` 
                      : '/flows'
                    }>
                      <Button className="w-full">
                        <Package className="h-4 w-4 mr-2" />
                        Manage Flows
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">View Analytics</CardTitle>
                    <CardDescription>Track performance and engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Manage Customers</CardTitle>
                    <CardDescription>View and manage enrolled customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={currentUser.memberships.length === 1 
                      ? `/customers?tenant=${currentUser.memberships[0].tenant_uuid}` 
                      : '/customers'
                    }>
                      <Button variant="outline" className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        View Customers
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Customer Section - Enrollments */}
          {hasEnrollments && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Your Status Tracking</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentUser.enrollments.map((enrollment) => (
                  <Card key={enrollment.uuid} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{enrollment.flow_name}</CardTitle>
                      <CardDescription>
                        {enrollment.tenant_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Status:</span>
                          <Badge variant="secondary">
                            {enrollment.current_step_name}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Started: {new Date(enrollment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!hasMemberships && !hasEnrollments && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Status Tracking Yet</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any status flows or enrollments yet.
              </p>
              <Button>Get Started</Button>
            </div>
          )}

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{currentUser.name || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <p className="text-sm text-muted-foreground capitalize">{currentUser.color_scheme}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marketing Consent</label>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.marketing_consent ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <Link to="/account">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Account
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
