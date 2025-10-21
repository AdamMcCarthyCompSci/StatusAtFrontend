import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Building2, Phone, Mail, PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useTenant } from '@/hooks/useTenantQuery';

const TenantPage = () => {
  const { tenantName } = useParams<{ tenantName: string }>();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  
  // Fetch tenant data by name
  const { data: tenant, isLoading: tenantLoading, error: tenantError } = useTenant(tenantName || '');
  
  // Filter user's enrollments for this tenant
  const tenantEnrollments = user?.enrollments?.filter(
    enrollment => enrollment.tenant_uuid === tenant?.uuid
  ) || [];

  const hasEnrollments = tenantEnrollments.length > 0;
  
  // Initialize active tab with first enrollment or empty string
  const [activeTab, setActiveTab] = useState<string>(() => 
    tenantEnrollments.length > 0 ? tenantEnrollments[0].uuid : ''
  );
  
  // Debug logging
  useEffect(() => {
    if (tenant) {
      console.log('🏢 Tenant page - tenant data:', tenant);
      console.log('🖼️ Tenant page - logo URL:', tenant.logo);
    }
  }, [tenant]);

  // Update active tab when enrollments change
  useEffect(() => {
    if (tenantEnrollments.length > 0 && !activeTab) {
      setActiveTab(tenantEnrollments[0].uuid);
    }
  }, [tenantEnrollments.length, activeTab]);

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
            <Link to="/home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background flex flex-col">
      {/* Organization Info - Large Header */}
      <div className="flex-shrink-0">
        <div className="container mx-auto p-8">
          <div 
            className="relative overflow-hidden rounded-2xl p-8"
            style={{
              backgroundColor: tenant.theme?.primary_color || 'hsl(var(--primary))',
              color: tenant.theme?.text_color || tenant.theme?.secondary_color || 'hsl(var(--primary-foreground))'
            }}
          >
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative flex items-center gap-6">
              {tenant.logo && tenant.logo.trim() !== '' && (
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <img 
                    src={tenant.logo.startsWith('http') ? tenant.logo : `${import.meta.env.VITE_API_HOST}${tenant.logo}`} 
                    alt={`${tenant.name} logo`}
                    className="h-16 w-16 object-contain"
                    onError={(e) => {
                      console.log('❌ Logo failed to load:', tenant.logo);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('✅ Logo loaded successfully:', tenant.logo);
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 
                  className="text-3xl font-bold"
                  style={{ color: tenant.theme?.text_color || tenant.theme?.secondary_color || 'hsl(var(--primary-foreground))' }}
                >
                  {tenant.name}
                </h2>
                {tenant.description && (
                  <p 
                    className="text-base opacity-90 mt-2"
                    style={{ color: tenant.theme?.text_color || tenant.theme?.secondary_color || 'hsl(var(--primary-foreground))' }}
                  >
                    {tenant.description}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <Button asChild variant="outline" className="bg-white/10 border-white/20 text-current hover:bg-white/20">
                  <Link to="/home">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Home
                  </Link>
                </Button>
                {user && (
                  <Button asChild className="bg-white/20 hover:bg-white/30 text-current border-white/30">
                    <Link to="/dashboard">
                      Dashboard
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Tab-Based Flow Focus */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* User's Enrollments - Tab-Based Layout */}
        {user && hasEnrollments && (
          <div className="h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="border-b bg-background/95 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-auto bg-transparent p-0">
                  {tenantEnrollments.map((enrollment) => (
                    <button
                      key={enrollment.uuid}
                      onClick={() => setActiveTab(enrollment.uuid)}
                      className={`flex-1 h-16 px-4 py-3 border-r last:border-r-0 transition-all duration-200 ${
                        activeTab === enrollment.uuid
                          ? 'bg-background shadow-sm border-b-2 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          <PlayCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate">{enrollment.flow_name}</div>
                          <div className="text-xs text-muted-foreground truncate">{enrollment.current_step_name}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 container mx-auto p-6">
              {tenantEnrollments.map((enrollment) => (
                <div 
                  key={enrollment.uuid} 
                  className={`h-full ${activeTab === enrollment.uuid ? 'block' : 'hidden'}`}
                >
                  <div className="h-full flex flex-col">
                    {/* Flow Header */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h1 className="text-3xl font-bold">{enrollment.flow_name}</h1>
                        </div>
                        <Button 
                          size="lg"
                          onClick={() => window.location.href = `/status-tracking/${tenant.uuid}/${enrollment.uuid}`}
                          className="px-8"
                          style={{
                            backgroundColor: tenant.theme?.primary_color || 'hsl(var(--primary))',
                            color: tenant.theme?.text_color || 'hsl(var(--primary-foreground))'
                          }}
                        >
                          <PlayCircle className="h-5 w-5 mr-2" />
                          View Flow Details
                        </Button>
                      </div>
                    </div>

                    {/* Current Step - Large Prominent Display */}
                    <div className="flex-1 flex items-center justify-center">
                      <Card className="w-full max-w-2xl border-0 shadow-xl">
                        <CardContent className="p-12">
                          <div className="text-center space-y-6">
                            {/* Current Step Icon */}
                            <div 
                              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: `${tenant.theme?.primary_color || 'hsl(var(--primary))'}20`,
                                border: `3px solid ${tenant.theme?.primary_color || 'hsl(var(--primary))'}40`
                              }}
                            >
                              <Clock 
                                className="h-10 w-10" 
                                style={{ color: tenant.theme?.primary_color || 'hsl(var(--primary))' }}
                              />
                            </div>

                            {/* Current Step Title */}
                            <div>
                              <div className="text-lg text-muted-foreground mb-3">Current Step</div>
                              <h2 
                                className="text-4xl font-bold"
                                style={{ color: tenant.theme?.primary_color || 'hsl(var(--primary))' }}
                              >
                                {enrollment.current_step_name}
                              </h2>
                            </div>

                            {/* Progress Info */}
                            <div className="pt-6 border-t border-border">
                              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Started: {new Date(enrollment.created_at).toLocaleDateString()}
                                </div>
                                {(enrollment as any).updated_at && (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Updated: {new Date((enrollment as any).updated_at).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Enrollments */}
        {user && !hasEnrollments && (
          <div className="flex items-center justify-center h-full">
            <Card className="text-center py-16 border-0 shadow-md max-w-md">
              <CardContent className="pt-6">
                <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Flows</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active flows in {tenant.name}.
                </p>
                <p className="text-sm text-muted-foreground">
                  Ask your administrator to enroll you in a flow, or scan a QR code invitation.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Not Signed In */}
        {!user && (
          <div className="flex items-center justify-center h-full">
            <Card className="text-center py-16 border-0 shadow-md max-w-md">
              <CardContent className="pt-6">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to {tenant.name}</h3>
                <p className="text-muted-foreground mb-6">
                  Sign in to view your flow progress and manage your enrollments.
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
          </div>
        )}
      </div>

      {/* Pinned Footer - Contact Information */}
      {(tenant.contact_phone || tenant.contact_email) && (
        <div className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-3">
            <div className="text-center space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact Information</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                {tenant.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <a 
                      href={`tel:${tenant.contact_phone}`}
                      className="text-primary hover:text-primary/80 underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 font-medium text-xs"
                    >
                      {tenant.contact_phone}
                    </a>
                  </div>
                )}
                {tenant.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <a 
                      href={`mailto:${tenant.contact_email}`}
                      className="text-primary hover:text-primary/80 underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 font-medium text-xs"
                    >
                      {tenant.contact_email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPage;
