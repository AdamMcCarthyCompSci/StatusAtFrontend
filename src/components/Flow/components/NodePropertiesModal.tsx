import { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { FlowStep } from '../types';

interface NodePropertiesModalProps {
  isOpen: boolean;
  node: FlowStep | null;
  onClose: () => void;
  onSave: (nodeId: string, updates: Partial<FlowStep>) => void;
}

export const NodePropertiesModal = ({
  isOpen,
  node,
  onClose,
  onSave,
}: NodePropertiesModalProps) => {
  const { t } = useTranslation();
  const [nodeName, setNodeName] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');

  // Update local state when node changes
  useEffect(() => {
    if (node) {
      setNodeName(node.name || '');
      setNodeDescription(node.description || '');
    }
  }, [node]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNodeName('');
      setNodeDescription('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (node && nodeName.trim()) {
      onSave(node.id, {
        name: nodeName.trim(),
        description: nodeDescription.trim() || undefined,
      });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !node) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-accent" />
            <h2 className="text-xl font-semibold">
              {t('flows.nodeProperties')}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Node Name */}
          <div>
            <Label
              htmlFor="nodeName"
              className="mb-2 block text-sm font-medium"
            >
              {t('flows.nodeName')}
            </Label>
            <Input
              id="nodeName"
              type="text"
              value={nodeName}
              onChange={e => setNodeName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('flows.nodeNamePlaceholder')}
              className="w-full"
              maxLength={50}
              autoFocus
            />
          </div>

          {/* Node Description */}
          <div>
            <Label
              htmlFor="nodeDescription"
              className="mb-2 block text-sm font-medium"
            >
              {t('flows.nodeDescription')}
              <span className="ml-1 text-xs text-muted-foreground">
                ({t('common.optional')})
              </span>
            </Label>
            <textarea
              id="nodeDescription"
              value={nodeDescription}
              onChange={e => setNodeDescription(e.target.value)}
              placeholder={t('flows.nodeDescriptionPlaceholder')}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {nodeDescription.length} / 500
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!nodeName.trim()}
              className="bg-gradient-brand-subtle text-white hover:opacity-90"
            >
              {t('common.save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
