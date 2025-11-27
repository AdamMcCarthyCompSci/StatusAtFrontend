import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
  AlertCircle,
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
import { Switch } from '@/components/ui/switch';
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
  const { t } = useTranslation();
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
  const [autoGenerateIdentifiers, setAutoGenerateIdentifiers] = useState(true);
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
      auto_generate_enrollment_identifiers?: boolean;
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
      setAutoGenerateIdentifiers(
        tenant.auto_generate_enrollment_identifiers ?? true
      );

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
      setNameError(t('settings.organization.orgNameRequired'));
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
        setNameError(t('settings.organization.orgNameExists'));
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
        auto_generate_enrollment_identifiers: autoGenerateIdentifiers,
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
          t('settings.organization.themePlanRestriction');
        setUploadError(message);
      } else {
        setUploadError(t('settings.organization.failedToSaveTheme'));
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
        setUploadError(t('settings.organization.selectImageFile'));
        setTimeout(() => setUploadError(''), 5000);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(t('settings.organization.fileSizeTooLarge'));
        setTimeout(() => setUploadError(''), 5000);
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
            t('settings.organization.logoPlanRestriction');
          setUploadError(message);
        } else {
          setUploadError(t('settings.organization.failedToUploadLogo'));
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
      setUploadError(t('settings.organization.failedToDeleteLogo'));
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
          <p className="text-muted-foreground">
            {t('settings.organization.noOrgSelected')}
          </p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            {t('flows.backToDashboard')}
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
              {t('flows.backToDashboard')}
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {t('settings.organizationSettings')}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {t('settings.customizeBranding')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Resource Usage */}
          {tenant &&
            tenant.tier &&
            !['CREATED', 'CANCELLED'].includes(tenant.tier) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('settings.organization.resourceUsage')}
                  </CardTitle>
                  <CardDescription>
                    {t('settings.organization.trackResourceConsumption')}
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
                          <span className="font-medium">
                            {t('settings.organization.activeCases')}
                          </span>
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
                            ? t('settings.organization.unlimitedActiveCases')
                            : isActiveLimitReached
                              ? t(
                                  'settings.organization.activeCasesLimitReached'
                                )
                              : t(
                                  'settings.organization.remainingActiveCases',
                                  { count: activeLimit - activeCount }
                                )}
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
                          <span className="font-medium">
                            {t('settings.organization.teamMembers')}
                          </span>
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
                            ? t('settings.organization.unlimitedTeamMembers')
                            : isMembershipLimitReached
                              ? t(
                                  'settings.organization.teamMembersLimitReached'
                                )
                              : t(
                                  'settings.organization.remainingTeamMembers',
                                  { count: membershipLimit - membershipCount }
                                )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Usage This Month Section */}
                  {tenant.usage && (
                    <>
                      <div className="border-t pt-6">
                        <h3 className="mb-4 text-base font-semibold">
                          {t('settings.organization.usageThisMonth')}
                        </h3>

                        {/* Status Updates Usage */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                              {t('settings.organization.statusUpdates')}
                            </span>
                            <span className="text-muted-foreground">
                              {tenant.usage.current_usage} /{' '}
                              {tenant.usage.limit}
                            </span>
                          </div>
                          <Progress
                            value={tenant.usage.percentage_used}
                            className="h-2"
                          />
                          {tenant.usage.overage > 0 ? (
                            <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                                <div className="text-sm text-red-800 dark:text-red-200">
                                  <strong>
                                    {t('settings.organization.overageAlert')}:
                                  </strong>{' '}
                                  {t('settings.organization.overageMessage', {
                                    count: tenant.usage.overage,
                                    cost: (tenant.usage.overage * 0.05).toFixed(
                                      2
                                    ),
                                  })}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              {t('settings.organization.overageCostInfo')}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {t('settings.organization.billingPeriodStarted')}:{' '}
                            {new Date(
                              tenant.usage.billing_period_start
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t('settings.organization.organizationInfo')}
              </CardTitle>
              <CardDescription>
                {t('settings.organization.basicInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="tenantName">
                  {t('settings.organization.organizationName')}
                </Label>
                <Input
                  id="tenantName"
                  type="text"
                  value={tenantName}
                  onChange={e => {
                    setTenantName(e.target.value);
                    setNameError(''); // Clear error when user types
                  }}
                  placeholder={t(
                    'settings.organization.organizationNamePlaceholder'
                  )}
                  className={`w-full ${nameError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {nameError && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {nameError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t('settings.organization.organizationNameHelper')}
                </p>
              </div>

              {/* Organization Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('settings.organization.organizationDescription')}
                </Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={t(
                    'settings.organization.organizationDescriptionPlaceholder'
                  )}
                  className="min-h-[100px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {t('settings.organization.organizationDescriptionHelper')}
                </p>
              </div>

              {/* Contact Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">
                    {t('settings.organization.contactPhone')}
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('settings.organization.contactPhoneHelper')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">
                    {t('settings.organization.contactEmail')}
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="contact@organization.com"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('settings.organization.contactEmailHelper')}
                  </p>
                </div>
              </div>

              {/* Customer Identifier Preferences */}
              <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor="autoGenerateIdentifiers"
                      className="text-base font-medium"
                    >
                      {t('settings.organization.autoGenerateIdentifiers')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.organization.autoGenerateIdentifiersHelper')}
                    </p>
                  </div>
                  <Switch
                    id="autoGenerateIdentifiers"
                    checked={autoGenerateIdentifiers}
                    onCheckedChange={setAutoGenerateIdentifiers}
                  />
                </div>
                {autoGenerateIdentifiers && (
                  <div className="rounded-md bg-primary/10 p-3 text-sm">
                    <p className="font-medium text-primary">
                      {t('settings.organization.identifierExample')}:
                    </p>
                    <code className="mt-1 block text-xs">
                      CASE-0001, CASE-0002, CASE-0003...
                    </code>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSaveTheme}
                disabled={isLoading}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {t('settings.organization.saveOrgInfo')}
              </Button>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t('settings.organization.themeColors')}
              </CardTitle>
              <CardDescription>
                {t('settings.organization.customizeColors')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">
                    {t('settings.organization.primaryColor')}
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
                    {t('settings.organization.accentColor')}
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
                  <Label htmlFor="textColor">
                    {t('settings.organization.textColor')}
                  </Label>
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
                <Label>{t('settings.organization.livePreview')}</Label>
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
                      {t('settings.organization.previewDescription')}
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
                {t('settings.organization.saveThemeColors')}
              </Button>
            </CardContent>
          </Card>

          {/* Logo Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('settings.organization.organizationLogo')}
              </CardTitle>
              <CardDescription>
                {t('settings.organization.uploadLogoDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logoFile">
                  {t('settings.organization.logoFile')}
                </Label>
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
                  {t('settings.organization.logoFileHelper')}
                </p>
              </div>

              {/* Logo Preview */}
              <div className="space-y-2">
                <Label>{t('settings.organization.logoPreview')}</Label>
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
                      <span className="text-sm">
                        {t('settings.organization.noLogo')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Success/Error Messages */}
              {uploadSuccess && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅{' '}
                    {t('settings.organization.logoSuccess', {
                      action:
                        lastAction === 'upload'
                          ? t('settings.organization.uploaded')
                          : t('settings.organization.deleted'),
                    })}
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
                  {isLoading
                    ? t('settings.organization.uploading')
                    : t('settings.organization.uploadLogo')}
                </Button>

                {logoPreview && (
                  <Button
                    onClick={handleDeleteLogo}
                    disabled={isLoading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {isLoading
                      ? t('settings.organization.deleting')
                      : t('settings.organization.deleteLogo')}
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
                {t('settings.organization.previewAndTest')}
              </CardTitle>
              <CardDescription>
                {t('settings.organization.seeHowPageLooks')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={handleViewPublicPage} className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  {t('settings.organization.viewPublicPage')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  {t('flows.backToDashboard')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t('subscription.manage')}
              </CardTitle>
              <CardDescription>
                {t('settings.organization.manageSubscriptionDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionManagement />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                {t('settings.organization.dangerZone')}
              </CardTitle>
              <CardDescription>
                {t('settings.organization.irreversibleActions')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/30 bg-background p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">
                      {t('settings.organization.leaveOrganization')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.memberships?.find(
                        m => m.tenant_uuid === tenant?.uuid
                      )?.role === 'OWNER'
                        ? t(
                            'settings.organization.leaveOrganizationOwnerWarning'
                          )
                        : t('settings.organization.leaveOrganizationWarning')}
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
                      ? t('settings.organization.leaving')
                      : t('settings.organization.leaveOrganization')}
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
