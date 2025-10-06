import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { StatusTrackingViewer } from './StatusTrackingViewer';

const StatusTrackingPage = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
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

  // Find the enrollment
  const enrollment = user.enrollments?.find(e => e.uuid === enrollmentId);

  if (!enrollment) {
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
        tenantUuid={enrollment.tenant_uuid}
        flowUuid={enrollment.flow_uuid}
        currentStepUuid={enrollment.current_step_uuid}
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
