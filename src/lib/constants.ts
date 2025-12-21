/**
 * Reserved route paths that cannot be used as organization names
 * These paths are defined in the application routing configuration
 * and would conflict with tenant-specific routes (/:tenantName)
 */
export const RESERVED_ROUTES = [
  // Authentication & Landing Pages
  'home',
  'sign-in',
  'sign-up',
  'forgot-password',
  'confirm-email',
  'email-confirmation',

  // Legal & Policy Pages
  'privacy',
  'terms',

  // Vertical Landing Pages
  'visa-services',
  'law-services',

  // Invitation Routes
  'invite',

  // Unsubscribe
  'unsubscribe',

  // Status Tracking & Payment
  'status-tracking',
  'payment',

  // Premium/Feature Routes
  'premium',

  // Protected/Authenticated Routes
  'dashboard',
  'account',
  'create-organization',
  'flows',
  'members',
  'customer-management',
  'customers',
  'inbox',
  'organization-settings',
  'unauthorized',
] as const;

/**
 * Check if a given organization name conflicts with reserved routes
 * @param name - The organization name to validate
 * @returns true if the name is reserved, false otherwise
 */
export const isReservedRouteName = (name: string): boolean => {
  const normalized = name.toLowerCase().trim();
  return RESERVED_ROUTES.includes(normalized as any);
};

/**
 * Validate organization name against reserved routes
 * @param name - The organization name to validate
 * @returns Error message if invalid, null if valid
 */
export const validateOrganizationName = (name: string): string | null => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'organization.nameRequired';
  }

  if (isReservedRouteName(trimmedName)) {
    return 'organization.nameReserved';
  }

  return null;
};
