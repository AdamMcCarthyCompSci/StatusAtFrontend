import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertTriangle,
  User,
  Palette,
  Shield,
  Rocket,
  RotateCcw,
  LogIn,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from 'react-international-phone';
import { useTranslation } from 'react-i18next';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useUpdateUser, useDeleteUser } from '@/hooks/useUserMutation';
import { useSoleOwnership } from '@/hooks/useSoleOwnership';
import { logger } from '@/lib/logger';

import NotificationPreferences from './NotificationPreferences';

import 'react-international-phone/style.css';

const AccountSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { theme, setTheme } = useAppStore();
  const { resetOnboarding, hasCompletedOnboarding, hasSkippedOnboarding } =
    useOnboardingStore();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const { soleOwnerships } = useSoleOwnership(user);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    marketing_consent: user?.marketing_consent || false,
    color_scheme: user?.color_scheme || 'light',
  });

  // Separate state for phone to work with PhoneInput component
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('us');

  // Sync form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        marketing_consent: user.marketing_consent || false,
        color_scheme: user.color_scheme || 'light',
      });

      // Sync phone number - reconstruct full phone string with country code
      if (user.whatsapp_country_code && user.whatsapp_phone_number) {
        setPhone(`${user.whatsapp_country_code} ${user.whatsapp_phone_number}`);
      } else {
        setPhone('');
      }

      // Also sync the theme store with user's color scheme
      if (user.color_scheme && user.color_scheme !== theme) {
        setTheme(user.color_scheme);
      }
    }
  }, [
    user?.name,
    user?.email,
    user?.marketing_consent,
    user?.color_scheme,
    user?.whatsapp_country_code,
    user?.whatsapp_phone_number,
    theme,
    setTheme,
  ]);

  // Sole ownership is now handled by the useSoleOwnership hook

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    if (!user) return;

    // Update form data and app store immediately
    setFormData(prev => ({ ...prev, color_scheme: newTheme }));
    setTheme(newTheme);

    // Auto-save theme change to user profile
    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        userData: {
          color_scheme: newTheme,
        },
      });
    } catch (error) {
      logger.error('Failed to save theme preference:', error);
      // Optionally revert the theme change on error
      // setTheme(user.color_scheme || 'light');
      // setFormData(prev => ({ ...prev, color_scheme: user.color_scheme || 'light' }));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!formData.name.trim()) return;

    try {
      // Parse phone number to extract country code and number
      let phoneData = {};

      if (phone && phone.length > 1 && phoneCountry) {
        const country = defaultCountries.find(c => c[1] === phoneCountry);
        if (country) {
          const parsed = parseCountry(country);
          const dialCode = `+${parsed.dialCode}`;
          const nationalNumber = phone
            .replace(dialCode, '')
            .replace(/[\s\-()]/g, '')
            .trim();

          if (nationalNumber) {
            phoneData = {
              whatsapp_country_code: dialCode,
              whatsapp_phone_number: nationalNumber,
            };
          }
        }
      } else {
        phoneData = {
          whatsapp_country_code: null,
          whatsapp_phone_number: null,
        };
      }

      // Update user profile
      await updateUserMutation.mutateAsync({
        userId: user.id,
        userData: {
          name: formData.name,
          email: formData.email,
          marketing_consent: formData.marketing_consent,
          color_scheme: formData.color_scheme,
          ...phoneData,
        },
      });

      // Note: WhatsApp notification preferences are automatically updated by the
      // backend when the phone number is added or removed (update_whatsapp_settings)
    } catch (error) {
      logger.error('Failed to update profile:', error);
    }
  };

  const handleRestartOnboarding = async () => {
    const confirmed = await confirm({
      title: 'Restart Onboarding Tour',
      description:
        'This will reset your onboarding progress and show the interactive tour again on your dashboard. You can skip it anytime.',
      confirmText: 'Restart Tour',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      resetOnboarding();
      // Invalidate flows query to ensure dashboard re-checks for onboarding
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      navigate('/dashboard');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const warningMessage =
      soleOwnerships.length > 0
        ? t('account.deleteAccountWithOrgs', {
            orgs: soleOwnerships.map(m => `• ${m.tenant_name}`).join('\n'),
          })
        : t('account.deleteAccountWarning');

    const confirmed = await confirm({
      title: t('account.deleteAccount'),
      description: warningMessage,
      variant: 'destructive',
      confirmText: t('account.deleteAccount'),
      cancelText: t('common.cancel'),
    });

    if (confirmed) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        navigate('/');
      } catch (error) {
        logger.error('Failed to delete account:', error);
      }
    }
  };

  const hasChanges =
    user &&
    (formData.name !== (user.name || '') ||
      formData.email !== user.email ||
      formData.marketing_consent !== user.marketing_consent ||
      formData.color_scheme !== user.color_scheme ||
      phone !==
        (user.whatsapp_country_code && user.whatsapp_phone_number
          ? `${user.whatsapp_country_code} ${user.whatsapp_phone_number}`
          : ''));

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-muted-foreground">
            {t('account.pleaseSignIn')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToDashboard')}
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {t('settings.accountSettings')}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t('account.managePreferences')}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card className="transition-all hover:border-accent/20 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                {t('account.profileInfo')}
              </CardTitle>
              <CardDescription>
                {t('account.profileDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('account.fullName')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder={t('account.fullNamePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('account.emailAddress')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder={t('account.emailPlaceholder')}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t('account.emailCannotBeChanged')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('account.whatsappPhone')}</Label>
                <PhoneInput
                  defaultCountry="us"
                  value={phone}
                  onChange={(phone, meta) => {
                    setPhone(phone);
                    if (meta?.country) {
                      setPhoneCountry(meta.country.iso2);
                    }
                  }}
                  className="phone-input-custom"
                />
                <p className="text-xs text-muted-foreground">
                  {t('account.whatsappHelper')}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">
                    {t('account.marketingComms')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('account.marketingHelper')}
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={formData.marketing_consent}
                  onCheckedChange={checked =>
                    handleInputChange('marketing_consent', checked)
                  }
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={
                  !hasChanges ||
                  !formData.name.trim() ||
                  updateUserMutation.isPending
                }
                className="bg-gradient-brand-subtle w-full text-white hover:opacity-90"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateUserMutation.isPending
                  ? t('common.saving')
                  : t('account.saveProfile')}
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="transition-all hover:border-accent/20 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-accent" />
                {t('account.appearance')}
              </CardTitle>
              <CardDescription>
                {t('account.appearanceDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">{t('account.theme')}</Label>
                <Select
                  value={formData.color_scheme}
                  onValueChange={(value: 'light' | 'dark') =>
                    handleThemeChange(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('account.selectTheme')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('account.light')}</SelectItem>
                    <SelectItem value="dark">{t('account.dark')}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {t('account.themeHelper')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sign-in Method */}
          <Card className="transition-all hover:border-accent/20 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-accent" />
                {t('account.signInMethod')}
              </CardTitle>
              <CardDescription>
                {t('account.signInMethodDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user.has_usable_password ? (
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {t('account.googleLinkedNoPassword')}
                    </p>
                    <Link
                      to="/forgot-password"
                      className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
                    >
                      {t('account.setPassword')}
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('account.emailPasswordSignIn')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <NotificationPreferences />

          {/* Onboarding Tour */}
          {(hasCompletedOnboarding || hasSkippedOnboarding) &&
            user.memberships?.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Interactive Tour
                  </CardTitle>
                  <CardDescription>
                    Revisit the onboarding tour to learn about platform features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <RotateCcw className="mt-0.5 h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium">Restart Onboarding Tour</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Take the interactive tour again to refresh your
                          knowledge of creating flows, inviting customers, and
                          managing progress. The tour takes about 3-5 minutes.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={handleRestartOnboarding}
                        >
                          <Rocket className="mr-2 h-4 w-4" />
                          Restart Tour
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Account Management */}
          <Card className="border-destructive/50 bg-destructive/5 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                {t('account.accountManagement')}
              </CardTitle>
              <CardDescription>
                {t('account.accountManagementDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/30 bg-background p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                  <div className="flex-1">
                    <h4 className="font-medium text-destructive">
                      {t('account.deleteAccount')}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('account.deleteAccountDescription')}
                      {soleOwnerships.length > 0 && (
                        <span className="mt-2 block font-medium text-destructive">
                          {t('account.soleOwnerWarning', {
                            count: soleOwnerships.length,
                          })}
                        </span>
                      )}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-3"
                      onClick={handleDeleteAccount}
                      disabled={deleteUserMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deleteUserMutation.isPending
                        ? t('account.deleting')
                        : t('account.deleteAccount')}
                    </Button>
                  </div>
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

export default AccountSettings;
