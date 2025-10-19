import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { useUpdateUser, useDeleteUser } from '@/hooks/useUserMutation';
import { useSoleOwnership } from '@/hooks/useSoleOwnership';
import { useUpdateNotificationPreferences } from '@/hooks/useNotificationPreferencesQuery';
import { ArrowLeft, Save, Trash2, AlertTriangle, User, Palette, Bell, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationPreferences from './NotificationPreferences';
import { PhoneInput, defaultCountries, parseCountry } from 'react-international-phone';
import 'react-international-phone/style.css';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme, setTheme } = useAppStore();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const updateNotificationsMutation = useUpdateNotificationPreferences();
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
  }, [user?.name, user?.email, user?.marketing_consent, user?.color_scheme, user?.whatsapp_country_code, user?.whatsapp_phone_number, theme, setTheme]);

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
      console.error('Failed to save theme preference:', error);
      // Optionally revert the theme change on error
      // setTheme(user.color_scheme || 'light');
      // setFormData(prev => ({ ...prev, color_scheme: user.color_scheme || 'light' }));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      // Check if user had a phone number before
      const hadPhoneNumber = Boolean(user.whatsapp_country_code && user.whatsapp_phone_number);
      
      // Parse phone number to extract country code and number
      let phoneData = {};
      let hasPhoneNumberNow = false;
      
      if (phone && phone.length > 1 && phoneCountry) {
        // Use the selected country to get the correct dial code
        const country = defaultCountries.find(c => c[1] === phoneCountry);
        if (country) {
          const parsed = parseCountry(country);
          const dialCode = `+${parsed.dialCode}`;
          // Remove the dial code and any formatting characters to get just the national number
          const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
          
          if (nationalNumber) { // Only send if there's actually a number
            phoneData = {
              whatsapp_country_code: dialCode, // e.g., "+49"
              whatsapp_phone_number: nationalNumber, // e.g., "16093162276"
            };
            hasPhoneNumberNow = true;
          }
        }
      } else {
        // If phone is empty, clear both fields
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

      // If user removed their phone number, disable WhatsApp notifications
      if (hadPhoneNumber && !hasPhoneNumberNow) {
        try {
          await updateNotificationsMutation.mutateAsync({
            whatsapp_enabled: false,
            whatsapp_status_updates: false,
            whatsapp_invites: false,
          });
        } catch (notificationError) {
          console.error('Failed to disable WhatsApp notifications:', notificationError);
          // Don't throw - the profile update succeeded
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const warningMessage = soleOwnerships.length > 0
      ? `Deleting your account will also delete the following organizations where you are the sole owner:\n\n${soleOwnerships.map(m => `• ${m.tenant_name}`).join('\n')}\n\nThis action cannot be undone.`
      : 'This will permanently delete your account and all associated data. This action cannot be undone.';

    const confirmed = await confirm({
      title: 'Delete Account',
      description: warningMessage,
      variant: 'destructive',
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const hasChanges = user && (
    formData.name !== (user.name || '') ||
    formData.email !== user.email ||
    formData.marketing_consent !== user.marketing_consent ||
    formData.color_scheme !== user.color_scheme ||
    phone !== (user.whatsapp_country_code && user.whatsapp_phone_number 
      ? `${user.whatsapp_country_code} ${user.whatsapp_phone_number}` 
      : '')
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Please sign in to access account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your account preferences and settings
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Phone Number</Label>
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
                  Used for WhatsApp notifications
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and improvements
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={formData.marketing_consent}
                  onCheckedChange={(checked) => handleInputChange('marketing_consent', checked)}
                />
              </div>

              <Button 
                onClick={handleSaveProfile}
                disabled={!hasChanges || updateUserMutation.isPending}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateUserMutation.isPending ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={formData.color_scheme}
                  onValueChange={(value: 'light' | 'dark') => handleThemeChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Current Tier</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You are on the <span className="font-medium">{user.tier}</span> plan
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <NotificationPreferences />

          {/* Account Management */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Management
              </CardTitle>
              <CardDescription>
                Manage your account security and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete your account and all associated data.
                      {soleOwnerships.length > 0 && (
                        <span className="block mt-2 font-medium text-destructive">
                          Warning: You are the sole owner of {soleOwnerships.length} organization(s). 
                          Deleting your account will also delete these organizations.
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
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleteUserMutation.isPending ? 'Deleting...' : 'Delete Account'}
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
