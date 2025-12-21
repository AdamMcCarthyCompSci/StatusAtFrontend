import { useState } from 'react';
import { Plus, Trash2, Edit2, FileText, User, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useDocumentFields,
  useCreateDocumentField,
  useUpdateDocumentField,
  useDeleteDocumentField,
} from '@/hooks/useFlowBuilderQuery';
import {
  FlowStepDocumentField,
  CreateDocumentFieldRequest,
} from '@/types/flowBuilder';

const MAX_DOCUMENT_FIELDS = 10;

interface DocumentFieldManagerProps {
  tenantUuid: string;
  flowUuid: string;
  stepUuid: string;
  onFormStateChange?: (isFormOpen: boolean) => void;
}

interface FieldFormData {
  name: string;
  uploaded_by: 'ADMIN' | 'CUSTOMER';
  is_required: boolean;
  description: string;
}

export const DocumentFieldManager = ({
  tenantUuid,
  flowUuid,
  stepUuid,
  onFormStateChange,
}: DocumentFieldManagerProps) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingFieldUuid, setEditingFieldUuid] = useState<string | null>(null);
  const [formData, setFormData] = useState<FieldFormData>({
    name: '',
    uploaded_by: 'CUSTOMER',
    is_required: false,
    description: '',
  });

  // Confirmation dialog
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Fetch document fields
  const { data: fields, isLoading } = useDocumentFields(
    tenantUuid,
    flowUuid,
    stepUuid
  );

  // Mutations
  const createMutation = useCreateDocumentField(tenantUuid, flowUuid, stepUuid);
  const updateMutation = useUpdateDocumentField(tenantUuid, flowUuid, stepUuid);
  const deleteMutation = useDeleteDocumentField(tenantUuid, flowUuid, stepUuid);

  const resetForm = () => {
    setFormData({
      name: '',
      uploaded_by: 'CUSTOMER',
      is_required: false,
      description: '',
    });
    setIsAdding(false);
    setEditingFieldUuid(null);
    onFormStateChange?.(false);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
    onFormStateChange?.(true);
  };

  const handleStartEdit = (field: FlowStepDocumentField) => {
    setFormData({
      name: field.name,
      uploaded_by: field.uploaded_by,
      is_required: field.is_required,
      description: field.description || '',
    });
    setEditingFieldUuid(field.uuid);
    setIsAdding(false);
    onFormStateChange?.(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editingFieldUuid) {
        // Update existing field
        await updateMutation.mutateAsync({
          fieldUuid: editingFieldUuid,
          fieldData: {
            name: formData.name.trim(),
            uploaded_by: formData.uploaded_by,
            is_required: formData.is_required,
            description: formData.description.trim() || undefined,
          },
        });
      } else {
        // Create new field
        const createData: CreateDocumentFieldRequest = {
          name: formData.name.trim(),
          uploaded_by: formData.uploaded_by,
          is_required: formData.is_required,
          description: formData.description.trim() || undefined,
        };
        await createMutation.mutateAsync(createData);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save document field:', error);
    }
  };

  const handleDelete = async (field: FlowStepDocumentField) => {
    const confirmed = await confirm({
      title: t('flows.deleteDocumentFieldTitle') || 'Delete Document Field',
      description:
        t('flows.deleteDocumentFieldMessage', { fieldName: field.name }) ||
        `Are you sure you want to delete "${field.name}"? This action cannot be undone.`,
      variant: 'destructive',
      confirmText: t('common.delete') || 'Delete',
      cancelText: t('common.cancel') || 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(field.uuid);
    } catch (error) {
      console.error('Failed to delete document field:', error);
    }
  };

  const activeFields = fields?.filter(f => f.is_active) || [];
  const isAtLimit = activeFields.length >= MAX_DOCUMENT_FIELDS;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t('flows.documentFields') || 'Document Fields'}
        </Label>
        <div className="text-sm text-muted-foreground">
          {t('common.loading') || 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {t('flows.documentFields') || 'Document Fields'}
        </Label>
        {!isAdding && !editingFieldUuid && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartAdd}
            className="h-7"
            disabled={isAtLimit}
            title={
              isAtLimit
                ? t('flows.maxDocumentFieldsReached', {
                    max: MAX_DOCUMENT_FIELDS,
                  })
                : undefined
            }
          >
            <Plus className="mr-1 h-3 w-3" />
            {t('flows.addDocumentField') || 'Add Field'}
          </Button>
        )}
      </div>

      {/* Limit warning message */}
      {isAtLimit && !isAdding && !editingFieldUuid && (
        <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {t('flows.maxDocumentFieldsReached', { max: MAX_DOCUMENT_FIELDS })}
        </div>
      )}

      {/* List of existing fields */}
      {activeFields.length > 0 && !isAdding && !editingFieldUuid && (
        <div className="space-y-2">
          {activeFields.map(field => (
            <div
              key={field.uuid}
              className="flex items-start gap-2 rounded-md border border-border bg-muted/50 p-2"
            >
              <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{field.name}</span>
                  {field.is_required && (
                    <span className="text-xs text-red-600 dark:text-red-400">
                      *
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  {field.uploaded_by === 'ADMIN' ? (
                    <>
                      <Shield className="h-3 w-3" />
                      <span>
                        {t('flows.uploadedByAdmin') || 'Admin Upload'}
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" />
                      <span>
                        {t('flows.uploadedByCustomer') || 'Customer Upload'}
                      </span>
                    </>
                  )}
                </div>
                {field.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {field.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStartEdit(field)}
                  className="h-6 w-6 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(field)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingFieldUuid) && (
        <div className="space-y-3 rounded-md border border-border bg-background p-3">
          <div>
            <Label htmlFor="field-name" className="text-xs">
              {t('flows.fieldName') || 'Field Name'}
              <span className="ml-1 text-red-600">*</span>
            </Label>
            <Input
              id="field-name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder={
                t('flows.fieldNamePlaceholder') || 'e.g., Proof of ID'
              }
              className="mt-1 h-8 text-sm"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="uploaded-by" className="text-xs">
              {t('flows.uploadedBy') || 'Uploaded By'}
            </Label>
            <Select
              value={formData.uploaded_by}
              onValueChange={(value: 'ADMIN' | 'CUSTOMER') =>
                setFormData({ ...formData, uploaded_by: value })
              }
            >
              <SelectTrigger id="uploaded-by" className="mt-1 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>{t('flows.customer') || 'Customer'}</span>
                  </div>
                </SelectItem>
                <SelectItem value="ADMIN">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    <span>{t('flows.admin') || 'Admin'}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is-required"
              checked={formData.is_required}
              onCheckedChange={checked =>
                setFormData({ ...formData, is_required: checked === true })
              }
            />
            <Label
              htmlFor="is-required"
              className="text-xs font-normal leading-none"
            >
              {t('flows.isRequired') || 'Required field'}
            </Label>
          </div>

          <div>
            <Label htmlFor="field-description" className="text-xs">
              {t('flows.fieldDescription') || 'Description'}
              <span className="ml-1 text-xs text-muted-foreground">
                ({t('common.optional') || 'optional'})
              </span>
            </Label>
            <textarea
              id="field-description"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={
                t('flows.fieldDescriptionPlaceholder') ||
                'Instructions for this document...'
              }
              className="mt-1 min-h-[60px] w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              maxLength={500}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={resetForm}>
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={
                !formData.name.trim() ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {editingFieldUuid
                ? t('common.update') || 'Update'
                : t('common.add') || 'Add'}
            </Button>
          </div>
        </div>
      )}

      {activeFields.length === 0 && !isAdding && !editingFieldUuid && (
        <p className="text-xs text-muted-foreground">
          {t('flows.noDocumentFields') ||
            'No document fields configured for this step.'}
        </p>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </div>
  );
};
