import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Phone,
  Mail,
  PlayCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  History,
  User,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useTenant } from '@/hooks/useTenantQuery';
import { useEnrollment } from '@/hooks/useEnrollmentQuery';
import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';
import { Enrollment } from '@/types/user';
import { Tenant } from '@/types/tenant';
import { PAGINATION } from '@/config/constants';

// Separate component for enrollment tab content to properly handle hooks
interface EnrollmentTabContentProps {
  enrollment: Enrollment;
  tenant: Tenant;
  // eslint-disable-next-line no-unused-vars
  navigate: (path: string) => void;
  expandedHistoryId: string | null;
  // eslint-disable-next-line no-unused-vars
  setExpandedHistoryId: (id: string | null) => void;
}

const EnrollmentTabContent = ({
  enrollment,
  tenant,
  navigate,
  expandedHistoryId,
  setExpandedHistoryId,
}: EnrollmentTabContentProps) => {
  // Fetch full enrollment details to get available_transitions
  const { data: fullEnrollment, isLoading: enrollmentLoading } = useEnrollment(
    tenant?.uuid || '',
    enrollment.uuid
  );

  const forwardTransitions =
    fullEnrollment?.available_transitions?.filter(t => !t.is_backward) || [];

  // Fetch enrollment history
  const isHistoryExpanded = expandedHistoryId === enrollment.uuid;
  const { data: historyData, isLoading: historyLoading } = useEnrollmentHistory(
    tenant?.uuid || '',
    enrollment.uuid,
    { page: 1, page_size: PAGINATION.DEFAULT_PAGE_SIZE }
  );

  // Get theme colors with fallbacks
  const accentColor = tenant.theme?.secondary_color || 'hsl(var(--primary))';
  const primaryColor = tenant.theme?.primary_color || 'hsl(var(--primary))';
  const textColor =
    tenant.theme?.text_color || 'hsl(var(--primary-foreground))';

  return (
    <div className="flex h-full flex-col">
      {/* Flow Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{enrollment.flow_name}</h1>
          </div>
          <Button
            size="lg"
            onClick={() =>
              navigate(`/status-tracking/${tenant.uuid}/${enrollment.uuid}`)
            }
            className="px-8"
            style={{
              backgroundColor: primaryColor,
              color: textColor,
            }}
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            View Flow Details
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        {/* Current Step - Left Side */}
        <div className="flex flex-1 items-start justify-center">
          <Card className="w-full max-w-2xl border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="space-y-8 text-center">
                {/* Current Step Title */}
                <div>
                  <div className="mb-4 text-base font-medium text-muted-foreground">
                    Current Step
                  </div>
                  <div className="border-t border-border pt-6">
                    <div
                      className="inline-flex items-center rounded-full px-8 py-4 text-3xl font-bold shadow-sm"
                      style={{
                        backgroundColor: `${accentColor}15`,
                        border: `2px solid ${accentColor}30`,
                        color: accentColor,
                      }}
                    >
                      {enrollment.current_step_name}
                    </div>
                  </div>
                </div>

                {/* Progress Info */}
                <div className="border-t border-border pt-8">
                  <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Started:{' '}
                        {new Date(enrollment.created_at).toLocaleDateString()}
                      </div>
                      {(enrollment as any).updated_at && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Updated:{' '}
                          {new Date(
                            (enrollment as any).updated_at
                          ).toLocaleDateString()}
                        </div>
                      )}
                      {fullEnrollment?.days_at_current_step !== undefined && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {fullEnrollment.days_at_current_step === 0
                            ? 'At step: Today'
                            : fullEnrollment.days_at_current_step === 1
                              ? 'At step: 1 day'
                              : `At step: ${fullEnrollment.days_at_current_step} days`}
                        </div>
                      )}
                    </div>
                    {fullEnrollment?.identifier && (
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
                        <span className="font-medium">Reference ID:</span>
                        <span className="font-mono">
                          {fullEnrollment.identifier}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Next Steps & History */}
        <div className="space-y-6 lg:w-96">
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
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : forwardTransitions.length > 0 ? (
                <div className="space-y-3">
                  {forwardTransitions.map(transition => (
                    <div
                      key={transition.uuid}
                      className="rounded-lg border p-4"
                      style={{
                        backgroundColor: `${accentColor}10`,
                        borderColor: `${accentColor}30`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <ArrowRight
                          className="h-5 w-5 flex-shrink-0"
                          style={{ color: accentColor }}
                        />
                        <div className="flex-1">
                          <div className="font-medium">
                            {transition.to_step_name}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Next step in the process
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <CheckCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
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
                  onClick={() =>
                    setExpandedHistoryId(
                      isHistoryExpanded ? null : enrollment.uuid
                    )
                  }
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
                      <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        Loading history...
                      </p>
                    </div>
                  </div>
                ) : !historyData?.results?.length ? (
                  <div className="py-8 text-center">
                    <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No history entries yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyData.results.map(entry => (
                      <div
                        key={entry.uuid}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        {/* Timeline indicator */}
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-medium">
                              {entry.from_step_name || (
                                <span className="italic text-muted-foreground">
                                  (deleted)
                                </span>
                              )}
                            </span>
                            {entry.is_backward ? (
                              <RotateCcw className="h-3 w-3 text-orange-600 dark:text-orange-500" />
                            ) : (
                              <ArrowRight
                                className="h-3 w-3"
                                style={{ color: accentColor }}
                              />
                            )}
                            <span className="font-medium">
                              {entry.to_step_name || (
                                <span className="italic text-muted-foreground">
                                  (deleted)
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="space-y-0.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{entry.changed_by_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(entry.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {historyData.count > 10 && (
                      <div className="pt-2 text-center text-xs text-muted-foreground">
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
  );
};

const TenantPage = () => {
  const { tenantName } = useParams<{ tenantName: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useCurrentUser();

  // Fetch tenant data by name
  const {
    data: tenant,
    isLoading: tenantLoading,
    error: tenantError,
  } = useTenant(tenantName || '');

  // Filter user's enrollments for this tenant
  const tenantEnrollments =
    user?.enrollments?.filter(
      enrollment => enrollment.tenant_uuid === tenant?.uuid
    ) || [];

  const hasEnrollments = tenantEnrollments.length > 0;

  // Initialize active tab with first enrollment or empty string
  const [activeTab, setActiveTab] = useState<string>(() =>
    tenantEnrollments.length > 0 ? tenantEnrollments[0].uuid : ''
  );

  // Track which enrollment's history is expanded
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(
    null
  );

  // Update active tab when enrollments change
  useEffect(() => {
    if (tenantEnrollments.length > 0 && !activeTab) {
      setActiveTab(tenantEnrollments[0].uuid);
    }
  }, [tenantEnrollments.length, activeTab]);

  if (userLoading || tenantLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (tenantError || !tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">Organization Not Found</h1>
          <p className="mb-4 text-muted-foreground">
            The organization "{tenantName}" could not be found.
          </p>
          <Button asChild>
            <Link to="/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      {/* Organization Info - Large Header */}
      <div className="flex-shrink-0">
        <div className="container mx-auto p-8">
          <div
            className="relative overflow-hidden rounded-2xl p-8"
            style={{
              backgroundColor:
                tenant.theme?.primary_color || 'hsl(var(--primary))',
              color:
                tenant.theme?.text_color ||
                tenant.theme?.secondary_color ||
                'hsl(var(--primary-foreground))',
            }}
          >
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative flex items-center gap-6">
              {tenant.logo && tenant.logo.trim() !== '' && (
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <img
                    src={
                      tenant.logo.startsWith('http')
                        ? tenant.logo
                        : `${import.meta.env.VITE_API_HOST}${tenant.logo}`
                    }
                    alt={`${tenant.name} logo`}
                    className="h-16 w-16 object-contain"
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h2
                  className="text-3xl font-bold"
                  style={{
                    color:
                      tenant.theme?.text_color ||
                      tenant.theme?.secondary_color ||
                      'hsl(var(--primary-foreground))',
                  }}
                >
                  {tenant.name}
                </h2>
                {tenant.description && (
                  <p
                    className="mt-2 text-base opacity-90"
                    style={{
                      color:
                        tenant.theme?.text_color ||
                        tenant.theme?.secondary_color ||
                        'hsl(var(--primary-foreground))',
                    }}
                  >
                    {tenant.description}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 bg-white/10 text-current hover:bg-white/20"
                >
                  <Link to="/home">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Home
                  </Link>
                </Button>
                {user && (
                  <Button
                    asChild
                    className="border-white/30 bg-white/20 text-current hover:bg-white/30"
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Tab-Based Flow Focus */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* User's Enrollments - Tab-Based Layout */}
        {user && hasEnrollments && (
          <div className="flex h-full flex-col">
            {/* Tab Navigation */}
            <div className="border-b bg-background/95 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <div className="grid h-auto w-full grid-cols-1 bg-transparent p-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tenantEnrollments.map(enrollment => (
                    <button
                      key={enrollment.uuid}
                      onClick={() => setActiveTab(enrollment.uuid)}
                      className={`h-16 flex-1 border-r px-4 py-3 transition-all duration-200 last:border-r-0 ${
                        activeTab === enrollment.uuid
                          ? 'border-b-2 border-primary bg-background shadow-sm'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex w-full items-center gap-3">
                        <div className="flex-shrink-0">
                          <PlayCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <div className="truncate text-sm font-semibold text-foreground">
                            {enrollment.flow_name}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {enrollment.current_step_name}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="container mx-auto flex-1 p-6">
              {tenantEnrollments.map(enrollment => (
                <div
                  key={enrollment.uuid}
                  className={`h-full ${activeTab === enrollment.uuid ? 'block' : 'hidden'}`}
                >
                  <EnrollmentTabContent
                    enrollment={enrollment}
                    tenant={tenant}
                    navigate={navigate}
                    expandedHistoryId={expandedHistoryId}
                    setExpandedHistoryId={setExpandedHistoryId}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Enrollments */}
        {user && !hasEnrollments && (
          <div className="flex h-full items-center justify-center">
            <Card className="max-w-md border-0 py-16 text-center shadow-md">
              <CardContent className="pt-6">
                <Briefcase className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">No Active Flows</h3>
                <p className="mb-4 text-muted-foreground">
                  You don't have any active flows in {tenant.name}.
                </p>
                <p className="text-sm text-muted-foreground">
                  Ask your administrator to enroll you in a flow, or scan a QR
                  code invitation.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Not Signed In */}
        {!user && (
          <div className="flex h-full items-center justify-center">
            <Card className="max-w-md border-0 py-16 text-center shadow-md">
              <CardContent className="pt-6">
                <Building2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">
                  Welcome to {tenant.name}
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Sign in to view your flow progress and manage your
                  enrollments.
                </p>
                <div className="flex justify-center gap-4">
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
            <div className="space-y-2 text-center">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Contact Information
              </h3>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                {tenant.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <a
                      href={`tel:${tenant.contact_phone}`}
                      className="text-xs font-medium text-primary underline underline-offset-4 transition-all duration-200 hover:text-primary/80 hover:underline-offset-2"
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
                      className="text-xs font-medium text-primary underline underline-offset-4 transition-all duration-200 hover:text-primary/80 hover:underline-offset-2"
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
