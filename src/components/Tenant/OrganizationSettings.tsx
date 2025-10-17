import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTenantByUuid } from '@/hooks/useTenantQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { tenantApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantKeys } from '@/hooks/useTenantQuery';
import { Palette, Upload, Save, ArrowLeft, Eye, X } from 'lucide-react';

const OrganizationSettings = () => {
  const navigate = useNavigate();
  const { selectedTenant } = useTenantStore();
  const queryClient = useQueryClient();
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#1e40af');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.error('Failed to update tenant:', error);
      setIsLoading(false);
    },
  });

  // Initialize form when tenant data loads
  useEffect(() => {
    if (tenant) {
      setPrimaryColor(tenant.theme?.primary_color || '#3b82f6');
      setSecondaryColor(tenant.theme?.secondary_color || '#1e40af');
      if (tenant.logo) {
        setLogoPreview(tenant.logo);
      }
    }
  }, [tenant]);

  const handleSaveTheme = async () => {
    if (!selectedTenant) return;
    
    setIsLoading(true);
    updateTenantMutation.mutate({
      theme: {
        primary_color: primaryColor,
        secondary_color: secondaryColor
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveLogo = async () => {
    if (!selectedTenant) return;
    
    setIsLoading(true);
    
    if (logoFile) {
      try {
        // Use the proper API function with authentication
        await tenantApi.updateTenantLogo(selectedTenant, logoFile);
        
        // Invalidate tenant queries to refresh data
        queryClient.invalidateQueries({ queryKey: tenantKeys.all });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to upload logo:', error);
        setIsLoading(false);
      }
    } else {
      // Remove logo
      updateTenantMutation.mutate({
        logo: undefined
      });
    }
  };

  const handleViewPublicPage = () => {
    if (tenant) {
      window.open(`/${encodeURIComponent(tenant.name)}`, '_blank');
    }
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No organization selected</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Organization Settings</h1>
              <p className="text-muted-foreground">
                Customize {tenant.name}'s appearance and branding
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Colors
              </CardTitle>
              <CardDescription>
                Customize the colors used on your organization's public page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Primary Color */}
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color (Background)</Label>
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

                {/* Secondary Color */}
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color (Text)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#1e40af"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              {/* Color Preview */}
              <div className="space-y-2">
                <Label>Live Preview</Label>
                <div 
                  className="p-6 rounded-lg border-2"
                  style={{ 
                    backgroundColor: primaryColor,
                    color: secondaryColor
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
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
              </div>

              <Button 
                onClick={handleSaveTheme}
                disabled={isLoading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Theme Colors
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
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logoFile">Logo File</Label>
                <div className="flex items-center gap-3">
                  <Input
                    ref={fileInputRef}
                    id="logoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {logoPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload an image file (PNG, JPG, GIF). Maximum size: 5MB. Recommended: 200x200px or larger.
                </p>
              </div>

              {/* Logo Preview */}
              {logoPreview && (
                <div className="space-y-2">
                  <Label>Logo Preview</Label>
                  <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-900">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview"
                      className="h-20 w-20 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSaveLogo}
                disabled={isLoading || (!logoFile && !logoPreview)}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {logoFile ? 'Upload Logo' : logoPreview ? 'Remove Logo' : 'Save Logo'}
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview & Test
              </CardTitle>
              <CardDescription>
                See how your organization page looks to visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  onClick={handleViewPublicPage}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Page
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;
