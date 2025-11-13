import { Navigate } from 'react-router-dom';

import { useTenantStatus } from '@/hooks/useTenantStatus';

interface TenantGuardProps {
  children: React.ReactNode;
}

/**
 * Guard component that restricts access for CREATED and CANCELLED tenants.
 * Redirects to dashboard if tenant status is restricted.
 */
export const TenantGuard = ({ children }: TenantGuardProps) => {
  const { isRestrictedTenant } = useTenantStatus();

  if (isRestrictedTenant) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
