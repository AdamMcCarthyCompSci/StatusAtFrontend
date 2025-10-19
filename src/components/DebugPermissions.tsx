import React from 'react';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { useAuthStore } from '@/stores/useAuthStore';

export const DebugPermissions = () => {
  const { data: user } = useCurrentUser();
  const { selectedTenant } = useTenantStore();
  const { tokens } = useAuthStore();

  if (!user) return <div>No user data</div>;

  const selectedMembership = user.memberships?.find(m => m.tenant_uuid === selectedTenant);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>Debug Info</h4>
      <div><strong>User ID:</strong> {user.id}</div>
      <div><strong>User Email:</strong> {user.email}</div>
      <div><strong>Selected Tenant:</strong> {selectedTenant}</div>
      <div><strong>Has Token:</strong> {tokens?.access ? 'Yes' : 'No'}</div>
      
      {selectedMembership ? (
        <div>
          <div><strong>Role:</strong> {selectedMembership.role}</div>
          <div><strong>Tenant Name:</strong> {selectedMembership.tenant_name}</div>
        </div>
      ) : (
        <div><strong>No membership in selected tenant</strong></div>
      )}
      
      <div><strong>All Memberships:</strong></div>
      {user.memberships?.map(m => (
        <div key={m.uuid} style={{ marginLeft: '10px' }}>
          {m.tenant_name} - {m.role}
        </div>
      ))}
    </div>
  );
};
