import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Building2, Phone, Mail, PlayCircle, Clock, CheckCircle, ArrowRight, History, User, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useTenant } from '@/hooks/useTenantQuery';
import { useEnrollment } from '@/hooks/useEnrollmentQuery';
import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';

const TenantPage = () => {
  const { tenantName } = useParams<{ tenantName: string }>();
  const navigate = useNavigate();
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
  
  // Track which enrollment's history is expanded
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  

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
                      e.currentTarget.style.display = 'none';
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
                          <div className="font-semibold text-sm truncate text-foreground">{enrollment.flow_name}</div>
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
              {tenantEnrollments.map((enrollment) => {
                // Fetch full enrollment details to get available_transitions
                const { data: fullEnrollment, isLoading: enrollmentLoading } = useEnrollment(
                  tenant?.uuid || '',
                  enrollment.uuid
                );
                
                const forwardTransitions = fullEnrollment?.available_transitions?.filter(t => !t.is_backward) || [];
                
                // Fetch enrollment history
                const isHistoryExpanded = expandedHistoryId === enrollment.uuid;
                const { data: historyData, isLoading: historyLoading } = useEnrollmentHistory(
                  tenant?.uuid || '',
                  enrollment.uuid,
                  { page: 1, page_size: 10 }
                );
                
                return (
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
                            onClick={() => navigate(`/status-tracking/${tenant.uuid}/${enrollment.uuid}`)}
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

                      {/* Main Content Area */}
                      <div className="flex-1 flex flex-col lg:flex-row gap-6">
                        {/* Current Step - Left Side */}
                        <div className="flex-1 flex items-start justify-center">
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

                        {/* Right Sidebar - Next Steps & History */}
                        <div className="lg:w-96 space-y-6">
                          {/* Next Steps Card */}
                          <Card className="border-0 shadow-xl">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <ArrowRight className="h-5 w-5" />
                                Next Steps
                              </CardTitle>
                              <CardDescription>
                                What's coming up next in your flow
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {enrollmentLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                              ) : forwardTransitions.length > 0 ? (
                                <div className="space-y-3">
                                  {forwardTransitions.map((transition) => (
                                    <div
                                      key={transition.uuid}
                                      className="p-4 border rounded-lg bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                                    >
                                      <div className="flex items-center gap-3">
                                        <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                                        <div className="flex-1">
                                          <div className="font-medium">{transition.to_step_name}</div>
                                          <div className="text-xs text-muted-foreground mt-1">
                                            Next step in the process
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                  <p className="text-sm text-muted-foreground">
                                    No upcoming steps available
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* History Card */}
                          <Card className="border-0 shadow-xl">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    History
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    Your progress through this flow
                                  </CardDescription>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedHistoryId(isHistoryExpanded ? null : enrollment.uuid)}
                                >
                                  {isHistoryExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </CardHeader>
                            {isHistoryExpanded && (
                              <CardContent>
                                {historyLoading ? (
                                  <div className="flex items-center justify-center py-8">
                                    <div className="text-center">
                                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                      <p className="text-sm text-muted-foreground">Loading history...</p>
                                    </div>
                                  </div>
                                ) : !historyData?.results?.length ? (
                                  <div className="text-center py-8">
                                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No history entries yet</p>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {historyData.results.map((entry) => (
                                      <div
                                        key={entry.uuid}
                                        className="flex items-start gap-3 p-3 border rounded-lg"
                                      >
                                        {/* Timeline indicator */}
                                        <div className="flex-shrink-0 mt-1">
                                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1 flex-wrap text-sm">
                                            <span className="font-medium">
                                              {entry.from_step_name || (
                                                <span className="text-muted-foreground italic">(deleted)</span>
                                              )}
                                            </span>
                                            {entry.is_backward ? (
                                              <RotateCcw className="h-3 w-3 text-orange-600 dark:text-orange-500" />
                                            ) : (
                                              <ArrowRight className="h-3 w-3 text-green-600 dark:text-green-500" />
                                            )}
                                            <span className="font-medium">
                                              {entry.to_step_name || (
                                                <span className="text-muted-foreground italic">(deleted)</span>
                                              )}
                                            </span>
                                          </div>
                                          
                                          <div className="text-xs text-muted-foreground space-y-0.5">
                                            <div className="flex items-center gap-1">
                                              <User className="h-3 w-3" />
                                              <span>{entry.changed_by_name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {historyData.count > 10 && (
                                      <div className="text-center pt-2 text-xs text-muted-foreground">
                                        Showing 10 most recent
                                      </div>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
