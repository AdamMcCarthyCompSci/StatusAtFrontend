export interface Membership {
  uuid: string;
  tenant_name: string;
  tenant_uuid: string;
  user: number;
  user_name: string;
  user_email: string;
  role: 'OWNER' | 'STAFF' | 'MEMBER';
  available_roles: string[];
}

export interface Enrollment {
  uuid: string;
  flow_name: string;
  flow_uuid: string;
  tenant_name: string;
  tenant_uuid: string;
  current_step_name: string;
  current_step_uuid: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  memberships: Membership[];
  enrollments: Enrollment[];
  tier: 'FREE' | 'PREMIUM' | 'PRO' | 'ENTERPRISE';
  color_scheme: 'light' | 'dark';
  marketing_consent: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserContextType {
  user: User | null;
  updateUser: (userData: User) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Helper types for role detection
export type UserRole = 'admin' | 'customer' | 'both';
export type MemberRole = 'OWNER' | 'STAFF' | 'MEMBER';

// Helper functions
export const getUserRole = (user: User | null): UserRole => {
  if (!user) return 'customer';
  
  const hasMemberships = user.memberships && user.memberships.length > 0;
  const hasEnrollments = user.enrollments && user.enrollments.length > 0;
  
  if (hasMemberships && hasEnrollments) return 'both';
  if (hasMemberships) return 'admin';
  return 'customer';
};

export const hasMultipleTenants = (user: User | null): boolean => {
  if (!user || !user.memberships) return false;
  return user.memberships.length > 1;
};

// Role hierarchy helpers
export const ROLE_HIERARCHY: MemberRole[] = ['OWNER', 'STAFF', 'MEMBER'];

export const ROLE_HIERARCHY_VALUES: Record<MemberRole, number> = {
  OWNER: 3,
  STAFF: 2,
  MEMBER: 1,
};

export const canManageRole = (currentUserRole: MemberRole, targetRole: MemberRole): boolean => {
  return ROLE_HIERARCHY_VALUES[currentUserRole] >= ROLE_HIERARCHY_VALUES[targetRole];
};

export const canPromoteToRole = (currentUserRole: MemberRole, targetRole: MemberRole): boolean => {
  return ROLE_HIERARCHY_VALUES[currentUserRole] >= ROLE_HIERARCHY_VALUES[targetRole];
};

export const getAvailableRoles = (currentUserRole: MemberRole): MemberRole[] => {
  const currentLevel = ROLE_HIERARCHY_VALUES[currentUserRole];
  return Object.entries(ROLE_HIERARCHY_VALUES)
    .filter(([_, level]) => level <= currentLevel)
    .map(([role, _]) => role as MemberRole);
};
