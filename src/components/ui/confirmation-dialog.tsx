import React from 'react';
import {
  AlertTriangle,
  Info,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

export type ConfirmationVariant =
  | 'destructive'
  | 'warning'
  | 'info'
  | 'promote'
  | 'demote';

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

const getVariantConfig = (variant: ConfirmationVariant) => {
  switch (variant) {
    case 'destructive':
      return {
        icon: <Trash2 className="h-6 w-6 text-destructive" />,
        confirmButtonClass:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        defaultConfirmText: 'Delete',
      };
    case 'warning':
      return {
        icon: (
          <AlertTriangle className="h-6 w-6 text-orange-500 dark:text-orange-400" />
        ),
        confirmButtonClass:
          'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
        defaultConfirmText: 'Continue',
      };
    case 'promote':
      return {
        icon: (
          <ChevronUp className="h-6 w-6 text-green-600 dark:text-green-500" />
        ),
        confirmButtonClass:
          'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
        defaultConfirmText: 'Promote',
      };
    case 'demote':
      return {
        icon: (
          <ChevronDown className="h-6 w-6 text-orange-600 dark:text-orange-500" />
        ),
        confirmButtonClass:
          'bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800',
        defaultConfirmText: 'Demote',
      };
    case 'info':
    default:
      return {
        icon: <Info className="h-6 w-6 text-accent" />,
        confirmButtonClass:
          'bg-gradient-brand-subtle text-white hover:opacity-90',
        defaultConfirmText: 'Confirm',
      };
  }
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  variant = 'info',
  onConfirm,
  loading = false,
}: ConfirmationDialogProps) {
  const config = getVariantConfig(variant);
  const finalConfirmText = confirmText || config.defaultConfirmText;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // Let the parent handle the error, don't close dialog
      logger.error('Confirmation action failed', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {config.icon}
            <AlertDialogTitle className="text-lg font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
          {cancelText && (
            <AlertDialogCancel
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              {cancelText}
            </AlertDialogCancel>
          )}
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={config.confirmButtonClass}
          >
            {loading ? 'Processing...' : finalConfirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easier usage with promises
export function useConfirmationDialog() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    variant: ConfirmationVariant;
    confirmText?: string;
    cancelText?: string;
    resolve?: (_value: boolean) => void;
  }>({
    open: false,
    title: '',
    description: '',
    variant: 'info',
  });

  const confirm = React.useCallback(
    (options: {
      title: string;
      description: string;
      variant?: ConfirmationVariant;
      confirmText?: string;
      cancelText?: string;
    }): Promise<boolean> => {
      return new Promise(resolve => {
        setDialogState({
          open: true,
          ...options,
          variant: options.variant || 'info',
          resolve,
        });
      });
    },
    []
  );

  const handleConfirm = React.useCallback(() => {
    dialogState.resolve?.(true);
    setDialogState(prev => ({ ...prev, open: false }));
  }, [dialogState.resolve]);

  const handleCancel = React.useCallback(() => {
    dialogState.resolve?.(false);
    setDialogState(prev => ({ ...prev, open: false }));
  }, [dialogState.resolve]);

  const ConfirmationDialogComponent = React.useCallback(
    () => (
      <ConfirmationDialog
        open={dialogState.open}
        onOpenChange={open => {
          if (!open) handleCancel();
        }}
        title={dialogState.title}
        description={dialogState.description}
        variant={dialogState.variant}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        onConfirm={handleConfirm}
      />
    ),
    [dialogState, handleConfirm, handleCancel]
  );

  return { confirm, ConfirmationDialog: ConfirmationDialogComponent };
}
