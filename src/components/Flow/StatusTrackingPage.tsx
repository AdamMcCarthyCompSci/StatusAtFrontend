import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useEnrollment } from '@/hooks/useEnrollmentQuery';
import { StatusTrackingViewer } from './StatusTrackingViewer';

const StatusTrackingPage = () => {
  const { tenantUuid, enrollmentId } = useParams<{ tenantUuid: string; enrollmentId: string }>();
  const { data: user, isLoading: userLoading } = useCurrentUser();

  // Fetch enrollment data using the tenant from URL parameters
  const { data: enrollment, isLoading: enrollmentLoading, error: enrollmentError } = useEnrollment(
    tenantUuid || '',
    enrollmentId || ''
  );

  if (userLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading status tracking...</p>
        </div>
      </div>
    );
  }

  if (!user || !enrollmentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Enrollment not found.</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (enrollmentError || !enrollment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Enrollment not found.</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
        }}
      />
    </>
  );
};

export default StatusTrackingPage;
