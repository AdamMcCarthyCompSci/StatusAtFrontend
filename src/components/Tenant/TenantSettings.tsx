import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Palette, Upload, Save } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTenantByUuid } from '@/hooks/useTenantQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { tenantApi } from '@/lib/api';
import { tenantKeys } from '@/hooks/useTenantQuery';
import { logger } from '@/lib/logger';

const TenantSettings = () => {
  const { selectedTenant } = useTenantStore();
  const queryClient = useQueryClient();
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [logoUrl, setLogoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current tenant data
  const { data: tenant, isLoading: tenantLoading } = useTenantByUuid(selectedTenant || '');

  // Update tenant mutation
  const updateTenantMutation = useMutation({
    mutationFn: (data: { theme?: any; logo?: string }) => 
      tenantApi.updateTenant(selectedTenant || '', data),
    onSuccess: () => {
      // Invalidate tenant queries to refresh data
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      setIsLoading(false);
    },
    onError: (error) => {
      logger.error('Failed to update tenant:', error);
      setIsLoading(false);
    },
  });

  // Initialize form when tenant data loads
  useState(() => {
    if (tenant) {
      setPrimaryColor(tenant.theme?.primary_color || '#3b82f6');
      setLogoUrl(tenant.logo || '');
    }
  }, [tenant]);

  const handleSaveTheme = async () => {
    if (!selectedTenant) return;
    
    setIsLoading(true);
    updateTenantMutation.mutate({
      theme: {
        primary_color: primaryColor,
        text_color: '#ffffff',
        background_color: '#f8fafc'
      }
    });
  };

  const handleSaveLogo = async () => {
    if (!selectedTenant) return;
    
    setIsLoading(true);
    updateTenantMutation.mutate({
      logo: logoUrl || null
    });
  };

  if (tenantLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tenant selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Organization Settings</h2>
        <p className="text-muted-foreground">
          Customize your organization's appearance and branding
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Colors
          </CardTitle>
          <CardDescription>
            Customize the primary color used on your organization's public page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-3">
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>
          
          {/* Color Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div 
              className="p-4 rounded-lg text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <h3 className="font-semibold">{tenant.name}</h3>
              <p className="text-sm opacity-90">This is how your organization page will look</p>
            </div>
          </div>

          <Button 
            onClick={handleSaveTheme}
            disabled={isLoading}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Theme
          </Button>
        </CardContent>
      </Card>

      {/* Logo Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Organization Logo
          </CardTitle>
          <CardDescription>
            Upload a logo to display on your organization's public page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of your logo image. Recommended size: 200x200px or larger.
            </p>
          </div>

          {/* Logo Preview */}
          {logoUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg">
                <img 
                  src={logoUrl} 
                  alt="Logo preview"
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <Button 
            onClick={handleSaveLogo}
            disabled={isLoading}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Logo
          </Button>
        </CardContent>
      </Card>

      {/* Public Page Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Public Page Preview</CardTitle>
          <CardDescription>
            See how your organization's public page will appear to visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border-2 border-dashed"
            style={{ 
              backgroundColor: primaryColor,
              color: '#ffffff'
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt={`${tenant.name} logo`}
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div>
                <h3 className="text-xl font-bold">{tenant.name}</h3>
                <p className="text-sm opacity-90">Welcome to our organization</p>
              </div>
            </div>
            <p className="text-sm opacity-80">
              This is how visitors will see your organization page
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantSettings;
