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
import { ArrowLeft, Save, Trash2, AlertTriangle, User, Palette, Bell, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme, setTheme } = useAppStore();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const { soleOwnerships, isLoading: soleOwnershipLoading } = useSoleOwnership(user);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    marketing_consent: user?.marketing_consent || false,
    color_scheme: user?.color_scheme || 'light',
  });

  // Sync form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        marketing_consent: user.marketing_consent || false,
        color_scheme: user.color_scheme || 'light',
      });
    }
  }, [user?.name, user?.email, user?.marketing_consent, user?.color_scheme]);

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
      await updateUserMutation.mutateAsync({
        userId: user.id,
        userData: {
          name: formData.name,
          email: formData.email,
          marketing_consent: formData.marketing_consent,
          color_scheme: formData.color_scheme,
        },
      });
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
    formData.color_scheme !== user.color_scheme
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
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
