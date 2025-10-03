import { useState, useEffect } from 'react';
import { X, Building2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { cn } from '@/lib/utils';

interface TenantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const TenantSidebar = ({ isOpen, onClose }: TenantSidebarProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedTenant, setSelectedTenant, initializeTenant } = useTenantStore();
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize tenant selection when user changes
  useEffect(() => {
    if (user?.memberships) {
      initializeTenant(user.memberships);
    }
  }, [user?.memberships, initializeTenant]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleTenantSelect = (tenantUuid: string) => {
    setSelectedTenant(tenantUuid);
    onClose();
    // Redirect to dashboard for a fresh start in the new tenant
    navigate('/dashboard');
  };

  const selectedMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);

  if (!isAnimating && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-background border-r shadow-lg z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-foreground" />
              <h2 className="text-lg font-semibold">Organizations</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Selection */}
          {selectedMembership && (
            <div className="p-6 border-b bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Current Organization</div>
              <div className="flex items-center gap-2">
                <div className="font-medium text-foreground">{selectedMembership.tenant_name}</div>
                <Badge variant="secondary">{selectedMembership.role}</Badge>
              </div>
            </div>
          )}

          {/* Organization List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
              {user?.memberships?.map((membership) => (
                <Card
                  key={membership.tenant_uuid}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/50",
                    selectedTenant === membership.tenant_uuid && "ring-2 ring-primary"
                  )}
                  onClick={() => handleTenantSelect(membership.tenant_uuid)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{membership.tenant_name}</CardTitle>
                      {selectedTenant === membership.tenant_uuid && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline">{membership.role}</Badge>
                      <span className="text-xs text-muted-foreground">as {membership.user_name}</span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {(!user?.memberships || user.memberships.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No organizations found</p>
                <p className="text-sm">Contact your administrator to get access.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t">
            <div className="text-xs text-muted-foreground">
              Switch between organizations to manage different environments.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TenantSidebar;
