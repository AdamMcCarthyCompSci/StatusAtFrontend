import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, ArrowLeft } from 'lucide-react';
import { useCreateTenant } from '@/hooks/useTenantQuery';

const CreateOrganization = () => {
  const navigate = useNavigate();
  const createTenantMutation = useCreateTenant();
  const [tenantName, setTenantName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tenantName.trim()) {
      setError('Organization name is required');
      return;
    }

    try {
      await createTenantMutation.mutateAsync({ name: tenantName });
      // Redirect to dashboard after successful creation
      navigate('/dashboard');
    } catch (error: any) {
      // Handle validation errors from backend
      const errorMessage = error?.data?.detail || error?.data?.name?.[0] || error.message || 'Failed to create organization';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Create Organization</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Set up a new organization to manage your teams and workflows
          </p>
        </div>

        {/* Create Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  Choose a unique name for your organization
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  type="text"
                  value={tenantName}
                  onChange={(e) => {
                    setTenantName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter organization name (e.g., Acme Corp)"
                  className={error ? 'border-red-500' : ''}
                  disabled={createTenantMutation.isPending}
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  This name will be visible to your team members and customers
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={createTenantMutation.isPending}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createTenantMutation.isPending || !tenantName.trim()}
                  className="flex-1"
                >
                  {createTenantMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4 mr-2" />
                      Create Organization
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-sm space-y-3">
              <p className="font-medium">What happens next?</p>
              <ul className="space-y-2 ml-4 text-muted-foreground">
                <li>• You'll automatically become the owner of the organization</li>
                <li>• You can invite team members to collaborate</li>
                <li>• Start creating flows to track status updates</li>
                <li>• Subscribe to a plan to unlock full features</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrganization;
