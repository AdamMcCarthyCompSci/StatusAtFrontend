import { useState, useEffect } from 'react';
import { Mail, X, UserPlus, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Flow } from '@/types/flow';

interface InviteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onInvite: (email: string, flowUuid: string) => Promise<void>;
  availableFlows: Flow[];
  isInviting: boolean;
  error: string | null;
}

export const InviteCustomerModal = ({
  isOpen,
  onClose,
  onInvite,
  availableFlows,
  isInviting,
  error,
}: InviteCustomerModalProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [selectedFlowUuid, setSelectedFlowUuid] = useState<string>('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setSelectedFlowUuid('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedFlowUuid) return;

    await onInvite(email, selectedFlowUuid);
  };

  const handleClose = () => {
    setEmail('');
    setSelectedFlowUuid('');
    onClose();
  };

  if (!isOpen) return null;

  const isFormValid = email && selectedFlowUuid;
  const selectedFlow = availableFlows.find(f => f.uuid === selectedFlowUuid);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-lg bg-background p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <UserPlus className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">
            {t('customers.inviteCustomer')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              {t('customers.customerEmail')}{' '}
              <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t('customers.emailPlaceholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isInviting}
              />
            </div>
          </div>

          {/* Flow Selection */}
          <div>
            <label htmlFor="flow" className="mb-2 block text-sm font-medium">
              {t('flows.flow')} <span className="text-destructive">*</span>
            </label>
            <Select
              value={selectedFlowUuid}
              onValueChange={setSelectedFlowUuid}
              disabled={isInviting}
            >
              <SelectTrigger id="flow">
                <SelectValue placeholder={t('customers.selectFlow')} />
              </SelectTrigger>
              <SelectContent>
                {availableFlows.map(flow => (
                  <SelectItem key={flow.uuid} value={flow.uuid}>
                    {flow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFlow && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t('customers.customerWillBeEnrolled', {
                  flowName: selectedFlow.name,
                })}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isInviting}
            >
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={!isFormValid || isInviting}>
              {isInviting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  {t('customers.sending')}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t('customers.sendInvitation')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
