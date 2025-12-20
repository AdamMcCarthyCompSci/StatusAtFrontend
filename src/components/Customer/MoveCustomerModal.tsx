import { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  RotateCcw,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface MoveCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (internalNote: string, externalNote: string) => void;
  customerName: string;
  fromStepName: string;
  toStepName: string;
  isBackward: boolean;
  isLoading?: boolean;
}

export const MoveCustomerModal = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  fromStepName,
  toStepName,
  isBackward,
  isLoading = false,
}: MoveCustomerModalProps) => {
  const { t } = useTranslation();
  const [internalNote, setInternalNote] = useState('');
  const [externalNote, setExternalNote] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInternalNote('');
      setExternalNote('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(internalNote, externalNote);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="mx-4 w-full max-w-2xl rounded-lg border border-border bg-background p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isBackward ? (
              <RotateCcw className="h-6 w-6 text-orange-600" />
            ) : (
              <ArrowRight className="h-6 w-6 text-green-600" />
            )}
            <h2 className="text-xl font-semibold">
              {isBackward
                ? t('customers.moveCustomerBack')
                : t('customers.moveCustomerForward')}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Description */}
        <div className="mb-6 rounded-md bg-muted/50 p-4">
          <p className="text-sm">
            {isBackward
              ? t('customers.moveCustomerBackDescription', {
                  name: customerName,
                  step: toStepName,
                })
              : t('customers.moveCustomerForwardDescription', {
                  name: customerName,
                  step: toStepName,
                })}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium">
            <span className="text-muted-foreground">{fromStepName}</span>
            {isBackward ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span className={isBackward ? 'text-orange-600' : 'text-green-600'}>
              {toStepName}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Internal Note */}
          <div>
            <Label
              htmlFor="internalNote"
              className="mb-2 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {t('customers.internalNote')}
              <span className="text-xs text-muted-foreground">
                ({t('common.optional')})
              </span>
            </Label>
            <textarea
              id="internalNote"
              value={internalNote}
              onChange={e => setInternalNote(e.target.value)}
              placeholder={t('customers.internalNotePlaceholder')}
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              maxLength={2000}
            />
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {t('customers.internalNoteHelper')}
              </p>
              <p className="text-xs text-muted-foreground">
                {internalNote.length} / 2000
              </p>
            </div>
          </div>

          {/* External Note */}
          <div>
            <Label
              htmlFor="externalNote"
              className="mb-2 flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {t('customers.externalNote')}
              <span className="text-xs text-muted-foreground">
                ({t('common.optional')})
              </span>
            </Label>
            <textarea
              id="externalNote"
              value={externalNote}
              onChange={e => setExternalNote(e.target.value)}
              placeholder={t('customers.externalNotePlaceholder')}
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              maxLength={2000}
            />
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {t('customers.externalNoteHelper')}
              </p>
              <p className="text-xs text-muted-foreground">
                {externalNote.length} / 2000
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={
                isBackward
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }
            >
              {isLoading
                ? t('customers.moving')
                : isBackward
                  ? t('customers.moveBack')
                  : t('customers.moveForward')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
