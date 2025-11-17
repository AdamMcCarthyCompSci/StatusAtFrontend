import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCurrentUser } from '@/hooks/useUserQuery';
import { User } from '@/types/user';

// Helper function to determine redirect destination based on user's memberships and enrollments
export const getRedirectDestination = (user: User): string => {
  const hasMemberships = user.memberships && user.memberships.length > 0;
  const hasEnrollments = user.enrollments && user.enrollments.length > 0;
  
  // If user has memberships (admin roles), go to dashboard
  if (hasMemberships) {
    return '/dashboard';
  }
  
  // If user has no memberships but has enrollments
  if (hasEnrollments) {
    // Get unique tenant names from enrollments
    const tenantNames = user.enrollments.map(e => e.tenant_name);
    const uniqueTenantNames = [...new Set(tenantNames)];
    
    // If user has enrollments in only one organization, redirect there
    if (uniqueTenantNames.length === 1) {
      return `/${encodeURIComponent(uniqueTenantNames[0])}`;
    }
    
    // If user has enrollments in multiple organizations, go to dashboard
    return '/dashboard';
  }
  
  // Default fallback to dashboard
  return '/dashboard';
};

const AuthenticatedRedirect = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    // Only redirect if user is loaded and authenticated
    if (!isLoading && user) {
      const redirectPath = getRedirectDestination(user);
      navigate(redirectPath, { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default AuthenticatedRedirect;
