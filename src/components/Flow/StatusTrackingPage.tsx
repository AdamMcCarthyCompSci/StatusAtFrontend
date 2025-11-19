import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useEnrollment } from '@/hooks/useEnrollmentQuery';

import { StatusTrackingViewer } from './StatusTrackingViewer';

const StatusTrackingPage = () => {
  const { t } = useTranslation();
  const { tenantUuid, enrollmentId } = useParams<{
    tenantUuid: string;
    enrollmentId: string;
  }>();
  const { data: user, isLoading: userLoading } = useCurrentUser();

  // Fetch enrollment data using the tenant from URL parameters
  const {
    data: enrollment,
    isLoading: enrollmentLoading,
    error: enrollmentError,
  } = useEnrollment(tenantUuid || '', enrollmentId || '');

  if (userLoading || enrollmentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>{t('flows.loadingStatusTracking')}</p>
        </div>
      </div>
    );
  }

  if (!user || !enrollmentId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">
            {t('flows.enrollmentNotFound')}
          </p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToDashboard')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (enrollmentError || !enrollment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">
            {t('flows.enrollmentNotFound')}
          </p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToDashboard')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Flow Viewer - Fixed positioned, outside normal document flow */}
      <StatusTrackingViewer
        tenantUuid={tenantUuid || ''}
        flowUuid={(enrollment as any).flow}
        currentStepUuid={(enrollment as any).current_step}
        flowName={enrollment.flow_name}
        enrollmentData={{
          current_step_name: enrollment.current_step_name,
          created_at: enrollment.created_at,
          tenant_name: enrollment.tenant_name,
          identifier: enrollment.identifier,
        }}
      />
    </>
  );
};

export default StatusTrackingPage;
