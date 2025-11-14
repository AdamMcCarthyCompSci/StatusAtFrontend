import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Palette,
  Upload,
  Save,
  ArrowLeft,
  Eye,
  X,
  Building2,
  CreditCard,
  TrendingUp,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTenantByUuid } from '@/hooks/useTenantQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { tenantApi } from '@/lib/api';
import { tenantKeys } from '@/hooks/useTenantQuery';
import { Progress } from '@/components/ui/progress';
import SubscriptionManagement from '@/components/Payment/SubscriptionManagement';
import { useLeaveTenantMutation } from '@/hooks/useLeaveTenantMutation';
import { logger } from '@/lib/logger';

const OrganizationSettings = () => {
  const navigate = useNavigate();
  const { selectedTenant } = useTenantStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const leaveTenantMutation = useLeaveTenantMutation();
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
  const [lastAction, setLastAction] = useState<'upload' | 'delete' | null>(
    null
  );
  const [nameError, setNameError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current tenant data
  const { data: tenant, isLoading: tenantLoading } = useTenantByUuid(
    selectedTenant || ''
  );

  // Update tenant mutation
  const updateTenantMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      description?: string;
      contact_phone?: string;
      contact_email?: string;
      theme?: any;
      logo?: string;
    }) => tenantApi.updateTenant(selectedTenant || '', data),
    onSuccess: () => {
      // Invalidate tenant queries to refresh data
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      setIsLoading(false);
    },
    onError: error => {
      logger.error('Failed to update tenant:', error);
      setIsLoading(false);
    },
  });

  // Initialize form when tenant data loads
  useEffect(() => {
    if (tenant) {
      setPrimaryColor(tenant.theme?.primary_color || '#3b82f6');
      setSecondaryColor(tenant.theme?.secondary_color || '#1e40af');
      setTenantName(tenant.name || '');
      setDescription(tenant.description || '');
      setTextColor(tenant.theme?.text_color || '#ffffff');
      setContactPhone(tenant.contact_phone || '');
      setContactEmail(tenant.contact_email || '');

      // Always set logo preview, even if null
      setLogoPreview(tenant.logo || '');
    }
  }, [tenant]);

  const handleSaveTheme = async () => {
    if (!selectedTenant) return;

    // Clear previous errors
    setNameError('');
    setUploadError('');

    // Validate organization name
    if (!tenantName.trim()) {
      setNameError('Organization name is required');
      return;
    }

    // Check if name has changed and validate uniqueness
    if (tenantName !== tenant?.name) {
      // In a real app, you'd make an API call to check for duplicates
      // For now, we'll simulate this with a simple check
      if (
        tenantName?.toLowerCase() === 'acme corp' ||
        tenantName?.toLowerCase() === 'tenant 1'
      ) {
        setNameError('An organization with this name already exists');
        return;
      }
    }

    setIsLoading(true);

    try {
      await updateTenantMutation.mutateAsync({
        name: tenantName,
        description: description,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        theme: {
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          text_color: textColor,
        },
      });

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      // Handle 403 errors from backend for theme restrictions
      if (error?.response?.status === 403) {
        const message =
          error?.response?.data?.detail ||
          'Your plan does not support custom theming. Please upgrade to access this feature.';
        setUploadError(message);
      } else {
        setUploadError('Failed to save theme settings. Please try again.');
      }
      logger.error('Failed to save theme:', error);
      setTimeout(() => setUploadError(''), 5000);
    } finally {
      setIsLoading(false);
    }
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
      reader.onload = e => {
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
        const result = await tenantApi.updateTenantLogo(
          selectedTenant,
          logoFile
        );

        logger.info('Logo upload successful:', result);
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
      } catch (error: any) {
        logger.error('Failed to upload logo:', error);

        // Handle 403 errors from backend for logo restrictions
        if (error?.response?.status === 403) {
          const message =
            error?.response?.data?.detail ||
            'Your plan does not support custom logos. Please upgrade to access this feature.';
          setUploadError(message);
        } else {
          setUploadError('Failed to upload logo. Please try again.');
        }

        setIsLoading(false);

        // Hide error message after 5 seconds
        setTimeout(() => setUploadError(''), 5000);
      }
    } else {
      // Remove logo
      updateTenantMutation.mutate({
        logo: undefined,
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

      logger.info('Logo deleted successfully');
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
      logger.error('Failed to delete logo:', error);
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

  const handleLeaveOrganization = async () => {
    if (!tenant || !user) return;

    const selectedMembership = user.memberships?.find(
      m => m.tenant_uuid === tenant.uuid
    );
    if (!selectedMembership) return;

    // Check if user is sole owner
    const soleOwnerships =
      user.memberships?.filter(m => {
        const otherOwners = user.memberships?.filter(
          other =>
            other.tenant_uuid === m.tenant_uuid &&
            other.role === 'OWNER' &&
            other.uuid !== m.uuid
        );
        return m.role === 'OWNER' && (!otherOwners || otherOwners.length === 0);
      }) || [];

    const isSoleOwner = soleOwnerships.some(
      ownership => ownership.tenant_uuid === tenant.uuid
    );

    const warningMessage = isSoleOwner
      ? `You are the sole owner of "${tenant.name}". Leaving this organization will delete it permanently, including all flows, members, and data. This action cannot be undone.`
      : `Are you sure you want to leave "${tenant.name}"? You will lose access to all flows and data in this organization.`;

    const confirmed = await confirm({
      title: 'Leave Organization',
      description: warningMessage,
      variant: 'destructive',
      confirmText: isSoleOwner ? 'Delete Organization' : 'Leave Organization',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await leaveTenantMutation.mutateAsync(tenant.uuid);
        navigate('/dashboard');
      } catch (error) {
        logger.error('Failed to leave organization:', error);
      }
    }
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="mb-4 h-8 w-1/4 rounded bg-gray-200"></div>
            <div className="h-64 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
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
      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex w-fit items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Organization Settings
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Manage subscription, customize {tenant.name}'s appearance and
                branding
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Management
              </CardTitle>
              <CardDescription>
                Manage your organization's subscription and billing settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionManagement />
            </CardContent>
          </Card>

          {/* Resource Usage */}
          {tenant &&
            tenant.tier &&
            !['CREATED', 'CANCELLED'].includes(tenant.tier) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Resource Usage
                  </CardTitle>
                  <CardDescription>
                    Track your organization's resource consumption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Active Cases Usage */}
                  {(() => {
                    const activeCount = tenant.active_cases_count || 0;
                    const activeLimit = tenant.active_cases_limit;
                    const isUnlimited =
                      activeLimit === null || activeLimit === undefined;
                    const activePercentage = isUnlimited
                      ? 0
                      : Math.min((activeCount / activeLimit) * 100, 100);
                    const isActiveLimitReached =
                      !isUnlimited && activeCount >= activeLimit;

                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Active Cases</span>
                          <span
                            className={`text-muted-foreground ${isActiveLimitReached ? 'font-semibold text-destructive' : ''}`}
                          >
                            {activeCount} / {isUnlimited ? '∞' : activeLimit}
                          </span>
                        </div>
                        {!isUnlimited && (
                          <Progress
                            value={activePercentage}
                            className={`h-2 ${isActiveLimitReached ? 'bg-destructive/20' : ''}`}
                          />
                        )}
                        <div className="text-xs text-muted-foreground">
                          {isUnlimited
                            ? 'Unlimited active cases on your plan'
                            : isActiveLimitReached
                              ? 'Budget reached! Cannot activate new cases or invite new customers.'
                              : `${activeLimit - activeCount} remaining active cases`}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Team Members Usage */}
                  {(() => {
                    const membershipCount = tenant.membership_count || 0;
                    const membershipLimit = tenant.membership_limit;
                    const isUnlimited =
                      membershipLimit === null || membershipLimit === undefined;
                    const membershipPercentage = isUnlimited
                      ? 0
                      : Math.min(
                          (membershipCount / membershipLimit) * 100,
                          100
                        );
                    const isMembershipLimitReached =
                      !isUnlimited && membershipCount >= membershipLimit;

                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Team Members</span>
                          <span
                            className={`text-muted-foreground ${isMembershipLimitReached ? 'font-semibold text-destructive' : ''}`}
                          >
                            {membershipCount} /{' '}
                            {isUnlimited ? '∞' : membershipLimit}
                          </span>
                        </div>
                        {!isUnlimited && (
                          <Progress
                            value={membershipPercentage}
                            className={`h-2 ${isMembershipLimitReached ? 'bg-destructive/20' : ''}`}
                          />
                        )}
                        <div className="text-xs text-muted-foreground">
                          {isUnlimited
                            ? 'Unlimited team members on your plan'
                            : isMembershipLimitReached
                              ? 'Budget reached! Cannot invite new team members.'
                              : `${membershipLimit - membershipCount} remaining team member${membershipLimit - membershipCount !== 1 ? 's' : ''}`}
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

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
                  onChange={e => {
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
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your organization, its mission, and what visitors can expect..."
                  className="min-h-[100px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    onChange={e => setContactPhone(e.target.value)}
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
                    onChange={e => setContactEmail(e.target.value)}
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
                <Save className="mr-2 h-4 w-4" />
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
                  <Label htmlFor="primaryColor">
                    Primary Color (Background)
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="h-10 w-16 rounded border p-1"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">
                    Accent Color (Badges & Highlights)
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="h-10 w-16 rounded border p-1"
                    />
                    <Input
                      type="text"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
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
                      onChange={e => setTextColor(e.target.value)}
                      className="h-10 w-16 rounded border p-1"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={e => setTextColor(e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="space-y-2">
                <Label>Live Preview</Label>
                <div className="space-y-4">
                  {/* Header Preview */}
                  <div
                    className="rounded-lg border-2 p-6"
                    style={{
                      backgroundColor: primaryColor,
                      color: textColor,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {logoPreview && (
                        <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                          <img
                            src={
                              logoPreview.startsWith('http') ||
                              logoPreview.startsWith('data:')
                                ? logoPreview
                                : `${import.meta.env.VITE_API_HOST}${logoPreview}`
                            }
                            alt={`${tenantName || tenant?.name} logo`}
                            className="h-10 w-10 object-contain"
                            onError={e => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <h3
                          className="text-lg font-bold"
                          style={{ color: textColor }}
                        >
                          {tenantName || tenant?.name}
                        </h3>
                        {description && (
                          <p
                            className="mt-1 text-xs opacity-90"
                            style={{ color: textColor }}
                          >
                            {description.slice(0, 60)}
                            {description.length > 60 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="rounded-lg border bg-background p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Current Step Card */}
                      <div className="rounded-lg border bg-card p-4 text-center">
                        <div className="mb-2 text-xs text-muted-foreground">
                          Current Step
                        </div>
                        <div
                          className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold"
                          style={{
                            backgroundColor: `${secondaryColor}15`,
                            border: `2px solid ${secondaryColor}30`,
                            color: secondaryColor,
                          }}
                        >
                          Sample Step
                        </div>
                      </div>

                      {/* Next Steps Card */}
                      <div className="rounded-lg border bg-card p-3">
                        <div className="mb-2 text-xs font-semibold">
                          Next Steps
                        </div>
                        <div
                          className="rounded-lg p-2 text-xs"
                          style={{
                            backgroundColor: `${secondaryColor}10`,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: `${secondaryColor}30`,
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span style={{ color: secondaryColor }}>→</span>
                            <span className="font-medium text-foreground">
                              Next Step
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Preview of how colors appear on your page
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveTheme}
                disabled={isLoading}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
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
                  <input
                    ref={fileInputRef}
                    id="logoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="h-10 flex-1 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
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
                  Upload an image file (PNG, JPG, GIF). Maximum size: 5MB.
                  Recommended: 200x200px or larger.
                </p>
              </div>

              {/* Logo Preview */}
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="rounded-lg border bg-gray-50 p-6 dark:bg-gray-900">
                  {logoPreview && logoPreview.trim() !== '' ? (
                    <img
                      src={
                        logoPreview.startsWith('http') ||
                        logoPreview.startsWith('data:')
                          ? logoPreview
                          : `${import.meta.env.VITE_API_HOST}${logoPreview}`
                      }
                      alt="Logo preview"
                      className="mx-auto h-20 w-20 object-contain"
                    />
                  ) : null}
                  {(!logoPreview || logoPreview.trim() === '') && (
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded border-2 border-dashed text-muted-foreground">
                      <span className="text-sm">No logo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Success/Error Messages */}
              {uploadSuccess && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ Logo {lastAction === 'upload' ? 'uploaded' : 'deleted'}{' '}
                    successfully!
                  </p>
                </div>
              )}

              {uploadError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
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
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Uploading...' : 'Upload Logo'}
                </Button>

                {logoPreview && (
                  <Button
                    onClick={handleDeleteLogo}
                    disabled={isLoading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
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
                <Button onClick={handleViewPublicPage} className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
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

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for this organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/30 bg-background p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Leave Organization</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.memberships?.find(
                        m => m.tenant_uuid === tenant?.uuid
                      )?.role === 'OWNER'
                        ? 'As an owner, leaving may delete the organization if you are the sole owner.'
                        : 'You will lose access to all data and cannot rejoin without a new invitation.'}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleLeaveOrganization}
                    disabled={leaveTenantMutation.isPending}
                    className="sm:w-auto"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {leaveTenantMutation.isPending
                      ? 'Leaving...'
                      : 'Leave Organization'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmationDialog />
    </div>
  );
};

export default OrganizationSettings;
