import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Building2 } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useTenant } from '@/hooks/useTenantQuery';

const TenantPage = () => {
  const { tenantName } = useParams<{ tenantName: string }>();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  
  // Fetch tenant data by name
  const { data: tenant, isLoading: tenantLoading, error: tenantError } = useTenant(tenantName || '');

  if (userLoading || tenantLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (tenantError || !tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Organization Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The organization "{tenantName}" could not be found.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Filter user's enrollments for this tenant
  const tenantEnrollments = user?.enrollments?.filter(
    enrollment => enrollment.tenant_uuid === tenant.uuid
  ) || [];

  const hasEnrollments = tenantEnrollments.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Theme Colors */}
      <div 
        className="relative overflow-hidden"
        style={{
          backgroundColor: tenant.theme?.primary_color || 'hsl(var(--primary))',
          color: tenant.theme?.secondary_color || 'hsl(var(--primary-foreground))'
        }}
      >
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="container mx-auto p-6 relative">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              {tenant.logo && (
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <img 
                    src={tenant.logo} 
                    alt={`${tenant.name} logo`}
                    className="h-16 w-16 object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold">{tenant.name}</h1>
                <p className="text-lg opacity-90">Welcome to our organization</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button asChild variant="outline" className="bg-white/10 border-white/20 text-current hover:bg-white/20">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              {user && (
                <Button asChild className="bg-white/20 hover:bg-white/30 text-current border-white/30">
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 -mt-4 relative z-10">

        {/* User's Enrollments */}
        {user && hasEnrollments && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Your Status Tracking</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tenantEnrollments.map((enrollment) => (
                <Card 
                  key={enrollment.uuid} 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-0 shadow-md hover:shadow-xl"
                  onClick={() => window.location.href = `/status-tracking/${enrollment.uuid}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {enrollment.flow_name}
                    </CardTitle>
                    <CardDescription>
                      Track your progress in this flow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Step:</span>
                        <Badge 
                          variant="secondary"
                          className="font-medium"
                          style={{
                            backgroundColor: tenant.theme?.primary_color || 'hsl(var(--primary))',
                            color: tenant.theme?.secondary_color || 'hsl(var(--primary-foreground))'
                          }}
                        >
                          {enrollment.current_step_name}
                        </Badge>
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

        {/* No Enrollments */}
        {user && !hasEnrollments && (
          <Card className="text-center py-12 border-0 shadow-md">
            <CardContent className="pt-6">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Tracking</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any active status tracking in {tenant.name}.
              </p>
              <p className="text-sm text-muted-foreground">
                Ask your administrator to enroll you in a flow, or scan a QR code invitation.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Not Signed In */}
        {!user && (
          <Card className="text-center py-12 border-0 shadow-md">
            <CardContent className="pt-6">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Welcome to {tenant.name}</h3>
              <p className="text-muted-foreground mb-6">
                Sign in to view your status tracking and manage your enrollments.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TenantPage;
