import { apiRequest } from './client';
import { Tenant, TenantUpdateRequest } from '../../types/tenant';

/**
 * Tenant API methods
 * Handles organization/tenant operations
 */
export const tenantApi = {
  /**
   * Create a new tenant (organization)
   * @param tenantData - Tenant creation data
   * @returns Newly created tenant
   */
  createTenant: (tenantData: { name: string }): Promise<Tenant> =>
    apiRequest<Tenant>('/tenants', {
      method: 'POST',
      body: JSON.stringify(tenantData),
    }),

  /**
   * Get tenant by name (public endpoint)
   * @param tenantName - Name of the tenant
   * @returns Tenant data
   */
  getTenantByName: (tenantName: string): Promise<Tenant> =>
    apiRequest<Tenant>(
      `/public/tenants/${encodeURIComponent(tenantName)}`,
      {},
      false
    ),

  /**
   * Get tenant by UUID (authenticated)
   * @param tenantUuid - UUID of the tenant
   * @returns Tenant data
   */
  getTenant: (tenantUuid: string): Promise<Tenant> =>
    apiRequest<Tenant>(`/tenants/${tenantUuid}`),

  /**
   * Update tenant (theme, logo, etc.)
   * @param tenantUuid - UUID of the tenant
   * @param tenantData - Partial tenant data to update
   * @returns Updated tenant data
   */
  updateTenant: (
    tenantUuid: string,
    tenantData: Partial<TenantUpdateRequest>
  ): Promise<Tenant> =>
    apiRequest<Tenant>(`/tenants/${tenantUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(tenantData),
    }),

  /**
   * Update tenant logo (file upload)
   * @param tenantUuid - UUID of the tenant
   * @param logoFile - Logo file to upload
   * @returns Updated tenant data with new logo URL
   */
  updateTenantLogo: (tenantUuid: string, logoFile: File): Promise<Tenant> => {
    const formData = new FormData();
    formData.append('logo', logoFile);

    return apiRequest<Tenant>(`/tenants/${tenantUuid}`, {
      method: 'PATCH',
      body: formData,
    });
  },
};
