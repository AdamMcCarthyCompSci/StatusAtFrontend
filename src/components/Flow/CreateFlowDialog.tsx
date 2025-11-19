import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCreateFlow } from '@/hooks/useFlowQuery';

interface CreateFlowDialogProps {
  tenantUuid: string;
  tenantName: string;
  onSuccess?: () => void;
}

const CreateFlowDialog = ({
  tenantUuid,
  tenantName,
  onSuccess,
}: CreateFlowDialogProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [flowName, setFlowName] = useState('');
  const [error, setError] = useState('');

  const createFlowMutation = useCreateFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!flowName.trim()) {
      setError(t('flows.flowNameRequired'));
      return;
    }

    try {
      await createFlowMutation.mutateAsync({
        tenantUuid,
        flowData: { name: flowName.trim() },
      });

      // Reset form and close dialog
      setFlowName('');
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || t('flows.failedToCreateFlow'));
    }
  };

  const handleCancel = () => {
    setFlowName('');
    setError('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {t('flows.createNewFlow')}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('flows.createNewFlow')}</CardTitle>
          <CardDescription>
            {t('flows.createFlowFor', { tenant: tenantName })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="flowName">{t('flows.flowNameLabel')}</Label>
              <Input
                id="flowName"
                type="text"
                value={flowName}
                onChange={e => setFlowName(e.target.value)}
                placeholder={t('flows.flowNamePlaceholder')}
                required
                disabled={createFlowMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                {t('flows.flowDescPlaceholder')}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createFlowMutation.isPending}
                className="flex-1"
              >
                {t('flows.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={createFlowMutation.isPending || !flowName.trim()}
                className="flex-1"
              >
                {createFlowMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('flows.creating')}
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('flows.createFlow')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFlowDialog;
