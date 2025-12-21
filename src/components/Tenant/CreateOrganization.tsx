import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
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
import { useCreateTenant } from '@/hooks/useTenantQuery';
import { validateOrganizationName } from '@/lib/constants';

const CreateOrganization = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createTenantMutation = useCreateTenant();
  const [tenantName, setTenantName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate organization name
    const validationError = validateOrganizationName(tenantName);
    if (validationError) {
      setError(t(validationError));
      return;
    }

    try {
      await createTenantMutation.mutateAsync({ name: tenantName });
      // Redirect to dashboard after successful creation
      navigate('/dashboard');
    } catch (error: any) {
      // Handle validation errors from backend
      const errorMessage =
        error?.data?.detail ||
        error?.data?.name?.[0] ||
        error.message ||
        t('organization.failedToCreate');
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.backToDashboard')}
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {t('organization.createOrganization')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {t('organization.setupDescription')}
          </p>
        </div>

        {/* Create Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{t('organization.organizationDetails')}</CardTitle>
                <CardDescription>
                  {t('organization.chooseUniqueName')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organizationName">
                  {t('organization.organizationNameRequired')}
                </Label>
                <Input
                  id="organizationName"
                  type="text"
                  value={tenantName}
                  onChange={e => {
                    setTenantName(e.target.value);
                    setError('');
                  }}
                  placeholder={t('organization.namePlaceholder')}
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
                  {t('organization.nameHelper')}
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
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createTenantMutation.isPending || !tenantName.trim()
                  }
                  className="flex-1"
                >
                  {createTenantMutation.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      {t('organization.creating')}
                    </>
                  ) : (
                    <>
                      <Building2 className="mr-2 h-4 w-4" />
                      {t('organization.createOrganization')}
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
            <div className="space-y-3 text-sm">
              <p className="font-medium">{t('organization.whatHappensNext')}</p>
              <ul className="ml-4 space-y-2 text-muted-foreground">
                <li>• {t('organization.becomeOwner')}</li>
                <li>• {t('organization.inviteMembers')}</li>
                <li>• {t('organization.createFlows')}</li>
                <li>• {t('organization.subscribeToPlan')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrganization;
