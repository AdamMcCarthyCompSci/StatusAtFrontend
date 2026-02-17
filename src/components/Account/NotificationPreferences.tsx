import { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  MessageCircle,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useNotificationPreferencesQuery,
  useUpdateNotificationPreferences,
} from '@/hooks/useNotificationPreferencesQuery';
import { UpdateNotificationPreferencesRequest } from '@/types/message';
import { useAuthStore } from '@/stores/useAuthStore';
import { logger } from '@/lib/logger';

const NotificationPreferences = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const {
    data: preferences,
    isLoading,
    error,
  } = useNotificationPreferencesQuery();
  const updatePreferencesMutation = useUpdateNotificationPreferences();

  // Check if user has a WhatsApp phone number configured
  const hasWhatsAppNumber = Boolean(
    user?.whatsapp_country_code && user?.whatsapp_phone_number
  );

  // Local form state
  const [formData, setFormData] =
    useState<UpdateNotificationPreferencesRequest>({
      email_enabled: false,
      email_status_updates: false,
      email_invites: false,
      whatsapp_enabled: false,
      whatsapp_status_updates: false,
      whatsapp_invites: false,
    });

  // Sync form data when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setFormData({
        email_enabled: preferences.email_enabled,
        email_status_updates: preferences.email_status_updates,
        email_invites: preferences.email_invites,
        whatsapp_enabled: preferences.whatsapp_enabled,
        whatsapp_status_updates: preferences.whatsapp_status_updates,
        whatsapp_invites: preferences.whatsapp_invites,
      });
    }
  }, [preferences]);

  const handleToggle = (
    field: keyof UpdateNotificationPreferencesRequest,
    value: boolean
  ) => {
    // Prevent enabling WhatsApp notifications if no phone number is configured
    if (!hasWhatsAppNumber && String(field).startsWith('whatsapp') && value) {
      return;
    }

    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // If disabling email_enabled, also disable all email-related preferences
      if (field === 'email_enabled' && !value) {
        newData.email_status_updates = false;
        newData.email_invites = false;
      }

      // WhatsApp is a single toggle — sync both sub-fields together
      if (field === 'whatsapp_enabled') {
        newData.whatsapp_status_updates = value;
        newData.whatsapp_invites = value;
      }

      return newData;
    });
  };

  const handleSave = async () => {
    try {
      await updatePreferencesMutation.mutateAsync(formData);
    } catch (error) {
      logger.error('Failed to save notification preferences:', error);
    }
  };

  // Check if there are unsaved changes
  const hasChanges =
    preferences &&
    (formData.email_enabled !== preferences.email_enabled ||
      formData.email_status_updates !== preferences.email_status_updates ||
      formData.email_invites !== preferences.email_invites ||
      formData.whatsapp_enabled !== preferences.whatsapp_enabled ||
      formData.whatsapp_status_updates !==
        preferences.whatsapp_status_updates ||
      formData.whatsapp_invites !== preferences.whatsapp_invites);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications.title')}
          </CardTitle>
          <CardDescription>{t('notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">
              {t('notifications.loadingPreferences')}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications.title')}
          </CardTitle>
          <CardDescription>{t('notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <p>{t('notifications.failedToLoad')}</p>
            <p className="mt-1 text-sm">{t('notifications.tryRefreshing')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('notifications.title')}
        </CardTitle>
        <CardDescription>
          {t('notifications.chooseHowNotified')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">
              {t('notifications.emailNotifications')}
            </h4>
          </div>

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
              <div className="space-y-0.5">
                <Label htmlFor="email-enabled" className="font-semibold">
                  {t('notifications.enableEmailNotifications')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.masterToggleEmail')}
                </p>
              </div>
              <Switch
                id="email-enabled"
                checked={formData.email_enabled}
                onCheckedChange={checked =>
                  handleToggle('email_enabled', checked)
                }
              />
            </div>

            <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="email-status"
                    className={
                      !formData.email_enabled ? 'text-muted-foreground' : ''
                    }
                  >
                    {t('notifications.statusUpdates')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('notifications.statusUpdatesDescription')}
                  </p>
                </div>
                <Switch
                  id="email-status"
                  checked={formData.email_status_updates}
                  onCheckedChange={checked =>
                    handleToggle('email_status_updates', checked)
                  }
                  disabled={!formData.email_enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="email-invites"
                    className={
                      !formData.email_enabled ? 'text-muted-foreground' : ''
                    }
                  >
                    {t('notifications.invitations')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('notifications.invitationsDescription')}
                  </p>
                </div>
                <Switch
                  id="email-invites"
                  checked={formData.email_invites}
                  onCheckedChange={checked =>
                    handleToggle('email_invites', checked)
                  }
                  disabled={!formData.email_enabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Notifications Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">
              {t('notifications.whatsappNotifications')}
            </h4>
          </div>

          {!hasWhatsAppNumber && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {t('notifications.addWhatsAppNumber')}
              </p>
            </div>
          )}

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
              <div className="space-y-0.5">
                <Label
                  htmlFor="whatsapp-enabled"
                  className={`font-semibold ${!hasWhatsAppNumber ? 'text-muted-foreground' : ''}`}
                >
                  {t('notifications.enableWhatsAppNotifications')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.masterToggleWhatsApp')}
                </p>
              </div>
              <Switch
                id="whatsapp-enabled"
                checked={formData.whatsapp_enabled}
                onCheckedChange={checked =>
                  handleToggle('whatsapp_enabled', checked)
                }
                disabled={!hasWhatsAppNumber}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updatePreferencesMutation.isPending}
            className="w-full"
          >
            {updatePreferencesMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('notifications.savePreferences')}
              </>
            )}
          </Button>
        </div>

        {/* Success/Error Messages */}
        {updatePreferencesMutation.isSuccess && (
          <div className="text-center text-sm text-green-600">
            {t('notifications.savedSuccessfully')}
          </div>
        )}
        {updatePreferencesMutation.isError && (
          <div className="text-center text-sm text-red-600">
            {t('notifications.failedToSave')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
