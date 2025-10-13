import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageCircle, Save, Loader2, AlertCircle } from 'lucide-react';
import { useNotificationPreferencesQuery, useUpdateNotificationPreferences } from '@/hooks/useNotificationPreferencesQuery';
import { UpdateNotificationPreferencesRequest } from '@/types/message';
import { useAuthStore } from '@/stores/useAuthStore';

const NotificationPreferences = () => {
  const { user } = useAuthStore();
  const { data: preferences, isLoading, error } = useNotificationPreferencesQuery();
  const updatePreferencesMutation = useUpdateNotificationPreferences();
  
  // Check if user has a WhatsApp phone number configured
  const hasWhatsAppNumber = Boolean(user?.whatsapp_country_code && user?.whatsapp_phone_number);

  // Local form state
  const [formData, setFormData] = useState<UpdateNotificationPreferencesRequest>({
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

  const handleToggle = (field: keyof UpdateNotificationPreferencesRequest, value: boolean) => {
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
      
      // If disabling whatsapp_enabled, also disable all whatsapp-related preferences
      if (field === 'whatsapp_enabled' && !value) {
        newData.whatsapp_status_updates = false;
        newData.whatsapp_invites = false;
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      await updatePreferencesMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  };

  // Check if there are unsaved changes
  const hasChanges = preferences && (
    formData.email_enabled !== preferences.email_enabled ||
    formData.email_status_updates !== preferences.email_status_updates ||
    formData.email_invites !== preferences.email_invites ||
    formData.whatsapp_enabled !== preferences.whatsapp_enabled ||
    formData.whatsapp_status_updates !== preferences.whatsapp_status_updates ||
    formData.whatsapp_invites !== preferences.whatsapp_invites
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading preferences...</span>
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
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Failed to load notification preferences.</p>
            <p className="text-sm mt-1">Please try refreshing the page.</p>
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
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to be notified about important updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">Email Notifications</h4>
          </div>
          
          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="email-enabled" className="font-semibold">Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Master toggle - controls all email notification settings below
                </p>
              </div>
              <Switch
                id="email-enabled"
                checked={formData.email_enabled}
                onCheckedChange={(checked) => handleToggle('email_enabled', checked)}
              />
            </div>

            <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-status" className={!formData.email_enabled ? 'text-muted-foreground' : ''}>Status Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when flow status changes
                  </p>
                </div>
                <Switch
                  id="email-status"
                  checked={formData.email_status_updates}
                  onCheckedChange={(checked) => handleToggle('email_status_updates', checked)}
                  disabled={!formData.email_enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-invites" className={!formData.email_enabled ? 'text-muted-foreground' : ''}>Invitations</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about team and flow invitations
                  </p>
                </div>
                <Switch
                  id="email-invites"
                  checked={formData.email_invites}
                  onCheckedChange={(checked) => handleToggle('email_invites', checked)}
                  disabled={!formData.email_enabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Notifications Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">WhatsApp Notifications</h4>
          </div>
          
          {!hasWhatsAppNumber && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Please add a WhatsApp phone number in your profile settings to enable WhatsApp notifications.
              </p>
            </div>
          )}
          
          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="whatsapp-enabled" className={`font-semibold ${!hasWhatsAppNumber ? 'text-muted-foreground' : ''}`}>Enable WhatsApp Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Master toggle - controls all WhatsApp notification settings below
                </p>
              </div>
              <Switch
                id="whatsapp-enabled"
                checked={formData.whatsapp_enabled}
                onCheckedChange={(checked) => handleToggle('whatsapp_enabled', checked)}
                disabled={!hasWhatsAppNumber}
              />
            </div>

            <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp-status" className={!formData.whatsapp_enabled || !hasWhatsAppNumber ? 'text-muted-foreground' : ''}>Status Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when flow status changes
                  </p>
                </div>
                <Switch
                  id="whatsapp-status"
                  checked={formData.whatsapp_status_updates}
                  onCheckedChange={(checked) => handleToggle('whatsapp_status_updates', checked)}
                  disabled={!formData.whatsapp_enabled || !hasWhatsAppNumber}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp-invites" className={!formData.whatsapp_enabled || !hasWhatsAppNumber ? 'text-muted-foreground' : ''}>Invitations</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about team and flow invitations
                  </p>
                </div>
                <Switch
                  id="whatsapp-invites"
                  checked={formData.whatsapp_invites}
                  onCheckedChange={(checked) => handleToggle('whatsapp_invites', checked)}
                  disabled={!formData.whatsapp_enabled || !hasWhatsAppNumber}
                />
              </div>
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </div>

        {/* Success/Error Messages */}
        {updatePreferencesMutation.isSuccess && (
          <div className="text-sm text-green-600 text-center">
            Notification preferences saved successfully!
          </div>
        )}
        {updatePreferencesMutation.isError && (
          <div className="text-sm text-red-600 text-center">
            Failed to save preferences. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
