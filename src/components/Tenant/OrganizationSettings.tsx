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
import { Palette, Upload, Save, ArrowLeft, Eye, X, Building2 } from 'lucide-react';

const OrganizationSettings = () => {
  const navigate = useNavigate();
  const { selectedTenant } = useTenantStore();
  const queryClient = useQueryClient();
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#1e40af');
  const [tenantName, setTenantName] = useState('');
  const [description, setDescription] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [lastAction, setLastAction] = useState<'upload' | 'delete' | null>(null);
  const [nameError, setNameError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current tenant data
  const { data: tenant, isLoading: tenantLoading } = useTenantByUuid(selectedTenant || '');

  // Update tenant mutation
  const updateTenantMutation = useMutation({
    mutationFn: (data: { name?: string; description?: string; contact_phone?: string; contact_email?: string; theme?: any; logo?: string }) => 
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
      console.log('🏢 Tenant data loaded:', tenant);
      setPrimaryColor(tenant.theme?.primary_color || '#3b82f6');
      setSecondaryColor(tenant.theme?.secondary_color || '#1e40af');
      setTenantName(tenant.name || '');
      setDescription(tenant.description || '');
      setTextColor(tenant.theme?.text_color || '#ffffff');
      setContactPhone(tenant.contact_phone || '');
      setContactEmail(tenant.contact_email || '');
      
      // Always set logo preview, even if null
      setLogoPreview(tenant.logo || '');
      console.log('🖼️ Logo preview set to:', tenant.logo || 'null');
    }
  }, [tenant]);

  const handleSaveTheme = async () => {
    if (!selectedTenant) return;
    
    // Clear previous errors
    setNameError('');
    
    // Validate organization name
    if (!tenantName.trim()) {
      setNameError('Organization name is required');
      return;
    }
    
    // Check if name has changed and validate uniqueness
    if (tenantName !== tenant?.name) {
      // In a real app, you'd make an API call to check for duplicates
      // For now, we'll simulate this with a simple check
      if (tenantName.toLowerCase() === 'acme corp' || tenantName.toLowerCase() === 'tenant 1') {
        setNameError('An organization with this name already exists');
        return;
      }
    }
    
    setIsLoading(true);
    updateTenantMutation.mutate({
      name: tenantName,
      description: description,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      theme: {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        text_color: textColor
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
    setUploadSuccess(false);
    setUploadError('');
    
    if (logoFile) {
      try {
        // Use the proper API function with authentication
        const result = await tenantApi.updateTenantLogo(selectedTenant, logoFile);
        
        console.log('✅ Logo upload successful:', result);
        setLastAction('upload');
        setUploadSuccess(true);
        
        // Invalidate tenant queries to refresh data
        queryClient.invalidateQueries({ queryKey: tenantKeys.all });
        
        // Clear the file input
        setLogoFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Failed to upload logo:', error);
        setUploadError('Failed to upload logo. Please try again.');
        setIsLoading(false);
        
        // Hide error message after 5 seconds
        setTimeout(() => setUploadError(''), 5000);
      }
    } else {
      // Remove logo
      updateTenantMutation.mutate({
        logo: undefined
      });
    }
  };

  const handleDeleteLogo = async () => {
    if (!selectedTenant) return;
    
    setIsLoading(true);
    setUploadSuccess(false);
    setUploadError('');
    
    try {
      await tenantApi.updateTenant(selectedTenant, { logo: undefined });
      
      console.log('✅ Logo deleted successfully');
      setLastAction('delete');
      setUploadSuccess(true);
      
      // Clear preview and file
      setLogoPreview('');
      setLogoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Invalidate tenant queries to refresh data
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      
      // Hide success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Failed to delete logo:', error);
      setUploadError('Failed to delete logo. Please try again.');
      setIsLoading(false);
      
      // Hide error message after 5 seconds
      setTimeout(() => setUploadError(''), 5000);
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
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Organization Settings</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Customize {tenant.name}'s appearance and branding
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Information
              </CardTitle>
              <CardDescription>
                Basic information about your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="tenantName">Organization Name</Label>
                <Input
                  id="tenantName"
                  type="text"
                  value={tenantName}
                  onChange={(e) => {
                    setTenantName(e.target.value);
                    setNameError(''); // Clear error when user types
                  }}
                  placeholder="Enter organization name"
                  className={`w-full ${nameError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {nameError && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {nameError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  This name will appear on your public organization page
                </p>
              </div>

              {/* Organization Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Organization Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your organization, its mission, and what visitors can expect..."
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This description will appear on your public organization page
                </p>
              </div>

              {/* Contact Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Phone number for contact inquiries
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@organization.com"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address for contact inquiries
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleSaveTheme}
                disabled={isLoading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Organization Information
              </Button>
            </CardContent>
          </Card>

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
              <div className="grid gap-6 md:grid-cols-3">
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
                  <Label htmlFor="secondaryColor">Accent Color (Badges & Highlights)</Label>
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

                {/* Text Color */}
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      placeholder="#ffffff"
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
                    color: textColor
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {logoPreview && (
                      <img 
                        src={logoPreview.startsWith('http') || logoPreview.startsWith('data:') ? logoPreview : `${import.meta.env.VITE_API_HOST}${logoPreview}`} 
                        alt={`${tenantName || tenant?.name} logo`}
                        className="h-12 w-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3 
                        className="text-xl font-bold"
                        style={{ color: textColor }}
                      >
                        {tenantName || tenant?.name}
                      </h3>
                      {description ? (
                        <p 
                          className="text-sm opacity-80 mt-2 max-w-md"
                          style={{ color: textColor }}
                        >
                          {description}
                        </p>
                      ) : (
                        <p 
                          className="text-sm opacity-90"
                          style={{ color: textColor }}
                        >
                          Welcome to our organization
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Badge Example */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-80">Current Step:</span>
                      <span 
                        className="px-2 py-1 rounded text-sm font-medium"
                        style={{
                          backgroundColor: secondaryColor,
                          color: textColor
                        }}
                      >
                        Sample Step
                      </span>
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
                    className="flex-1 file:bg-primary file:text-primary-foreground file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-medium hover:file:bg-primary/90 dark:file:bg-primary dark:file:text-primary-foreground"
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
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  {logoPreview && logoPreview.trim() !== '' ? (
                    <img 
                      src={logoPreview.startsWith('http') || logoPreview.startsWith('data:') ? logoPreview : `${import.meta.env.VITE_API_HOST}${logoPreview}`} 
                      alt="Logo preview"
                      className="h-20 w-20 object-contain mx-auto"
                      onError={(e) => {
                        console.log('❌ Logo preview failed to load:', logoPreview);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                      onLoad={() => {
                        console.log('✅ Logo preview loaded successfully:', logoPreview);
                      }}
                    />
                  ) : null}
                  {(!logoPreview || logoPreview.trim() === '') && (
                    <div className="h-20 w-20 mx-auto flex items-center justify-center text-muted-foreground border-2 border-dashed rounded">
                      <span className="text-sm">No logo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Success/Error Messages */}
              {uploadSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ Logo {lastAction === 'upload' ? 'uploaded' : 'deleted'} successfully!
                  </p>
                </div>
              )}
              
              {uploadError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    ❌ {uploadError}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleSaveLogo}
                  disabled={isLoading || !logoFile}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Uploading...' : 'Upload Logo'}
                </Button>
                
                {logoPreview && (
                  <Button 
                    onClick={handleDeleteLogo}
                    disabled={isLoading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {isLoading ? 'Deleting...' : 'Delete Logo'}
                  </Button>
                )}
              </div>
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
