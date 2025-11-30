import { Navigate } from 'react-router-dom';

import { useHasMinimumRole } from '@/hooks/useCurrentRole';
import { MemberRole } from '@/types/user';

interface RoleGuardProps {
  children: React.ReactNode;
  minimumRole: MemberRole;
}

/**
 * Guard component that restricts access based on user role.
 * Redirects to /unauthorized if user doesn't have minimum required role.
 *
 * @param minimumRole - The minimum role required (MEMBER, STAFF, or OWNER)
 *
 * @example
 * // Only STAFF and OWNER can access
 * <RoleGuard minimumRole="STAFF">
 *   <FlowManagement />
 * </RoleGuard>
 */
export const RoleGuard = ({ children, minimumRole }: RoleGuardProps) => {
  const hasMinimumRole = useHasMinimumRole(minimumRole);

  if (!hasMinimumRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
