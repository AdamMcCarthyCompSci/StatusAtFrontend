import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  Globe,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  navigate: (path: string) => void;
  expandedHistoryId: string | null;

  setExpandedHistoryId: (id: string | null) => void;
}

const EnrollmentTabContent = ({
  enrollment,
  tenant,
  navigate,
  expandedHistoryId,
  setExpandedHistoryId,
}: EnrollmentTabContentProps) => {
  const { t } = useTranslation();

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
      <div className="mb-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="w-full min-w-0 flex-1">
            <h1
              className="truncate text-2xl font-bold sm:text-4xl"
              title={enrollment.flow_name}
            >
              {enrollment.flow_name}
            </h1>
          </div>
          <Button
            size="lg"
            onClick={() =>
              navigate(`/status-tracking/${tenant.uuid}/${enrollment.uuid}`)
            }
            className="w-full px-6 sm:w-auto sm:px-8"
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
      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        {/* Current Step - Left Side */}
        <div className="flex flex-1 items-start">
          <Card className="w-full border-0 shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6 text-center">
                {/* Current Step Title */}
                <div className="w-full">
                  <div className="mb-3 text-sm font-medium text-muted-foreground sm:text-base">
                    {t('tenant.currentStep')}
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex w-full justify-center">
                      <div
                        className="inline-flex max-w-full items-center truncate rounded-full px-6 py-3 text-2xl font-bold shadow-sm sm:px-10 sm:py-5 sm:text-4xl"
                        style={{
                          backgroundColor: `${accentColor}15`,
                          border: `2px solid ${accentColor}30`,
                          color: accentColor,
                        }}
                        title={enrollment.current_step_name}
                      >
                        <span className="truncate">
                          {enrollment.current_step_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Info */}
                <div className="border-t border-border pt-5">
                  <div className="flex flex-col items-center justify-center gap-3 text-xs text-muted-foreground sm:text-sm">
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t('tenant.started')}:{' '}
                        {new Date(enrollment.created_at).toLocaleDateString()}
                      </div>
                      {(enrollment as any).updated_at && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {t('tenant.updated')}:{' '}
                          {new Date(
                            (enrollment as any).updated_at
                          ).toLocaleDateString()}
                        </div>
                      )}
                      {fullEnrollment?.days_at_current_step !== undefined && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {fullEnrollment.days_at_current_step === 0
                            ? t('tenant.atStepToday')
                            : fullEnrollment.days_at_current_step === 1
                              ? t('tenant.atStepOneDay')
                              : t('tenant.atStepDays', {
                                  days: fullEnrollment.days_at_current_step,
                                })}
                        </div>
                      )}
                    </div>
                    {fullEnrollment?.identifier && (
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
                        <span className="font-medium">
                          {t('tenant.referenceId')}:
                        </span>
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
        <div className="space-y-4 lg:w-[420px]">
          {/* Next Steps Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowRight className="h-5 w-5" />
                {t('tenant.nextSteps')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrollmentLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : forwardTransitions.length > 0 ? (
                <div className="space-y-2">
                  {forwardTransitions.map(transition => (
                    <div
                      key={transition.uuid}
                      className="rounded-lg border p-3"
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
                        <div className="min-w-0 flex-1">
                          <div
                            className="truncate text-base font-medium"
                            title={transition.to_step_name}
                          >
                            {transition.to_step_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <CheckCircle className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {t('tenant.noUpcomingSteps')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader
              className="cursor-pointer pb-3 transition-colors hover:bg-muted/50"
              onClick={() =>
                setExpandedHistoryId(isHistoryExpanded ? null : enrollment.uuid)
              }
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5" />
                  {t('customers.history')}
                </CardTitle>
                <div>
                  {isHistoryExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
            {isHistoryExpanded && (
              <CardContent>
                {historyLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="text-center">
                      <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        {t('common.loading')}
                      </p>
                    </div>
                  </div>
                ) : !historyData?.results?.length ? (
                  <div className="py-6 text-center">
                    <History className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t('tenant.noHistoryYet')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {historyData.results.map(entry => (
                      <div
                        key={entry.uuid}
                        className="flex items-start gap-2 rounded-lg border p-3"
                      >
                        {/* Timeline indicator */}
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex min-w-0 items-center gap-2 text-sm">
                            <span
                              className="min-w-0 truncate font-medium"
                              title={entry.from_step_name}
                            >
                              {entry.from_step_name || (
                                <span className="italic text-muted-foreground">
                                  (deleted)
                                </span>
                              )}
                            </span>
                            {entry.is_backward ? (
                              <RotateCcw className="h-3 w-3 flex-shrink-0 text-orange-600 dark:text-orange-500" />
                            ) : (
                              <ArrowRight
                                className="h-3 w-3 flex-shrink-0"
                                style={{ color: accentColor }}
                              />
                            )}
                            <span
                              className="min-w-0 truncate font-medium"
                              title={entry.to_step_name}
                            >
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
                        {t('tenant.showingRecent', { count: 10 })}
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
  const { t } = useTranslation();
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
  const tenantEnrollments = useMemo(
    () =>
      user?.enrollments?.filter(
        enrollment => enrollment.tenant_uuid === tenant?.uuid
      ) || [],
    [user?.enrollments, tenant?.uuid]
  );

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
  }, [tenantEnrollments, activeTab]);

  if (userLoading || tenantLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>{t('tenant.loading')}</p>
        </div>
      </div>
    );
  }

  if (tenantError || !tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">
            {t('tenant.organizationNotFound')}
          </h1>
          <p className="mb-4 text-muted-foreground">
            {t('tenant.orgNotFoundMessage', { name: tenantName })}
          </p>
          <Button asChild>
            <Link to="/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('tenant.backToHome')}
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
        <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-5">
          <div
            className="relative overflow-hidden rounded-xl p-4 sm:p-6"
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
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              {tenant.logo && tenant.logo.trim() !== '' && (
                <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm sm:p-3">
                  <img
                    src={
                      tenant.logo.startsWith('http')
                        ? tenant.logo
                        : `${import.meta.env.VITE_API_HOST}${tenant.logo}`
                    }
                    alt={`${tenant.name} logo`}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h2
                  className="text-xl font-bold sm:text-2xl"
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
                    className="mt-1 text-sm opacity-90 sm:text-base"
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
                {tenant.website && (
                  <a
                    href={tenant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 transition-all duration-200 hover:underline sm:text-base"
                    style={{
                      color:
                        tenant.theme?.text_color ||
                        tenant.theme?.secondary_color ||
                        'hsl(var(--primary-foreground))',
                    }}
                  >
                    <Globe className="h-4 w-4" />
                    {tenant.website
                      .replace(/^https?:\/\//, '')
                      .replace(/\/$/, '')}
                  </a>
                )}
              </div>
              <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 bg-white/10 text-current hover:bg-white/20 sm:flex-initial"
                >
                  <Link to="/home">
                    <ArrowLeft className="mr-1 h-4 w-4 sm:mr-2" />
                    {t('tenant.home')}
                  </Link>
                </Button>
                {user && (
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 border-white/30 bg-white/20 text-current hover:bg-white/30 sm:flex-initial"
                  >
                    <Link to="/dashboard">{t('nav.dashboard')}</Link>
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
              <div className="container mx-auto px-4 sm:px-6">
                <div className="grid h-auto w-full grid-cols-1 bg-transparent p-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tenantEnrollments.map(enrollment => (
                    <button
                      key={enrollment.uuid}
                      onClick={() => setActiveTab(enrollment.uuid)}
                      className={`h-14 min-w-0 flex-1 border-r px-3 py-2 transition-all duration-200 last:border-r-0 sm:h-16 sm:px-4 sm:py-3 ${
                        activeTab === enrollment.uuid
                          ? 'border-b-2 border-primary bg-background shadow-sm'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex w-full items-center gap-2 sm:gap-3">
                        <div className="flex-shrink-0">
                          <PlayCircle className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <div className="truncate text-xs font-semibold text-foreground sm:text-sm">
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
            <div className="container mx-auto flex-1 px-4 py-4 sm:px-6 sm:py-5">
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
          <div className="flex h-full items-center justify-center px-4">
            <Card className="w-full max-w-md border-0 py-8 text-center shadow-md sm:py-12">
              <CardContent className="pt-4">
                <Briefcase className="mx-auto mb-3 h-12 w-12 text-muted-foreground sm:mb-4 sm:h-14 sm:w-14" />
                <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                  {t('tenant.noActiveFlows')}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {t('tenant.noActiveFlowsMessage', { tenant: tenant.name })}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {t('tenant.askAdminToEnroll')}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Not Signed In */}
        {!user && (
          <div className="flex h-full items-center justify-center px-4">
            <Card className="w-full max-w-md border-0 py-8 text-center shadow-md sm:py-12">
              <CardContent className="pt-4">
                <Building2 className="mx-auto mb-3 h-12 w-12 text-muted-foreground sm:mb-4 sm:h-14 sm:w-14" />
                <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                  {t('tenant.welcomeTo', { tenant: tenant.name })}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground sm:mb-6">
                  {t('tenant.signInToView')}
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/sign-in">{t('nav.signIn')}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link to="/sign-up">{t('nav.signUp')}</Link>
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
          <div className="container mx-auto px-4 py-2 sm:px-6">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <span className="text-xs font-medium text-muted-foreground">
                {t('tenant.contact')}:
              </span>
              {tenant.contact_phone && (
                <a
                  href={`tel:${tenant.contact_phone}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 transition-all duration-200 hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  {tenant.contact_phone}
                </a>
              )}
              {tenant.contact_email && (
                <a
                  href={`mailto:${tenant.contact_email}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 transition-all duration-200 hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  {tenant.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPage;
