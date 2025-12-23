import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from '@tanstack/react-query';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  User,
  Shield,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useEnrollmentDocuments,
  useUploadEnrollmentDocument,
  useDeleteEnrollmentDocument,
  useFlowSteps,
} from '@/hooks/useEnrollmentQuery';
import { useDocumentFields } from '@/hooks/useFlowBuilderQuery';
import { flowBuilderApi } from '@/lib/api';
import { EnrollmentDocument } from '@/types/enrollment';
import { FlowStepDocumentField } from '@/types/flowBuilder';
import { CACHE_TIMES } from '@/config/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { getApiBaseUrl } from '@/config/env';

interface EnrollmentDocumentsProps {
  tenantUuid: string;
  enrollmentUuid: string;
  flowUuid: string;
  currentStepUuid: string;
  currentStepName: string;
  isAdminView: boolean; // Whether viewing as admin (STAFF+) or customer
  hideDescription?: boolean; // Hide the card description
  collapsibleOtherSteps?: boolean; // Make "Documents from Other Steps" collapsible
  tenantPrimaryColor?: string; // Tenant brand primary color
  tenantSecondaryColor?: string; // Tenant brand secondary color
  tenantTextColor?: string; // Tenant brand text color
}

const MAX_DOCUMENTS_PER_FIELD = 5;

export const EnrollmentDocuments = ({
  tenantUuid,
  enrollmentUuid,
  flowUuid,
  currentStepUuid,
  currentStepName,
  isAdminView,
  hideDescription = false,
  collapsibleOtherSteps = false,
  tenantPrimaryColor,
  tenantSecondaryColor,
  tenantTextColor,
}: EnrollmentDocumentsProps) => {
  const { t } = useTranslation();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFieldForUpload, setSelectedFieldForUpload] = useState<
    string | null
  >(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);
  const [isOtherStepsExpanded, setIsOtherStepsExpanded] = useState(false);

  // Fetch documents for this enrollment
  const { data: documents = [], isLoading: documentsLoading } =
    useEnrollmentDocuments(tenantUuid, enrollmentUuid);

  // Fetch document fields for current step
  const { data: documentFields = [], isLoading: fieldsLoading } =
    useDocumentFields(tenantUuid, flowUuid, currentStepUuid);

  // Fetch all flow steps to map document fields to steps
  const { data: flowSteps = [] } = useFlowSteps(tenantUuid, flowUuid);

  // Fetch document fields for all steps to build a complete mapping
  const allStepFieldsQueries = useQueries({
    queries: flowSteps.map(step => ({
      queryKey: ['documentFields', tenantUuid, flowUuid, step.uuid],
      queryFn: () =>
        flowBuilderApi.getDocumentFields(tenantUuid, flowUuid, step.uuid),
      enabled: !!tenantUuid && !!flowUuid && !!step.uuid,
      staleTime: CACHE_TIMES.CACHE_TIME,
    })),
  });

  // Build a map of document field UUID to step info and field info
  const fieldToStepMap = useMemo(() => {
    const map = new Map<
      string,
      {
        stepName: string;
        stepUuid: string;
        uploadedBy: string;
        fieldName: string;
      }
    >();
    flowSteps.forEach((step, index) => {
      const fieldsData = allStepFieldsQueries[index]?.data;
      if (fieldsData && Array.isArray(fieldsData)) {
        fieldsData.forEach((field: FlowStepDocumentField) => {
          map.set(field.uuid, {
            stepName: step.name,
            stepUuid: step.uuid,
            uploadedBy: field.uploaded_by,
            fieldName: field.name,
          });
        });
      }
    });
    return map;
  }, [flowSteps, allStepFieldsQueries]);

  // Mutations
  const uploadMutation = useUploadEnrollmentDocument();
  const deleteMutation = useDeleteEnrollmentDocument();

  // Filter fields based on user role
  const fieldsForUser = isAdminView
    ? documentFields.filter(f => f.is_active)
    : documentFields.filter(f => f.is_active && f.uploaded_by === 'CUSTOMER');

  // Group documents by field
  const documentsByField = new Map<string, EnrollmentDocument[]>();
  documents.forEach(doc => {
    const existing = documentsByField.get(doc.document_field) || [];
    documentsByField.set(doc.document_field, [...existing, doc]);
  });

  // Separate current step documents from others
  const currentStepFieldUuids = new Set(
    documentFields.filter(f => f.is_active).map(f => f.uuid)
  );
  const currentStepDocuments = documents.filter(doc =>
    currentStepFieldUuids.has(doc.document_field)
  );
  const otherStepDocuments = documents.filter(
    doc => !currentStepFieldUuids.has(doc.document_field)
  );

  // Group other step documents by step
  const documentsByStep = useMemo(() => {
    const grouped = new Map<
      string,
      { stepName: string; docs: EnrollmentDocument[] }
    >();

    otherStepDocuments.forEach(doc => {
      const stepInfo = fieldToStepMap.get(doc.document_field);
      if (stepInfo) {
        const existing = grouped.get(stepInfo.stepUuid);
        if (existing) {
          existing.docs.push(doc);
        } else {
          grouped.set(stepInfo.stepUuid, {
            stepName: stepInfo.stepName,
            docs: [doc],
          });
        }
      }
    });

    return Array.from(grouped.values());
  }, [otherStepDocuments, fieldToStepMap]);

  // Calculate missing required documents for status messaging
  const missingRequiredFields = useMemo(() => {
    if (isAdminView) {
      // Don't show status message in admin view
      return [];
    }

    // Get required fields for customer
    const requiredFields = fieldsForUser.filter(field => field.is_required);

    // Check which required fields have no documents
    return requiredFields.filter(field => {
      const docs = documentsByField.get(field.uuid) || [];
      return docs.length === 0;
    });
  }, [fieldsForUser, documentsByField, isAdminView]);

  // Check if all required documents are uploaded
  const allRequiredDocumentsUploaded = useMemo(() => {
    if (isAdminView) {
      return false;
    }

    const requiredFields = fieldsForUser.filter(field => field.is_required);
    if (requiredFields.length === 0) {
      // No required documents, so nothing to complete
      return false;
    }

    return missingRequiredFields.length === 0;
  }, [fieldsForUser, missingRequiredFields, isAdminView]);

  const handleSelectFile = (fieldUuid: string) => {
    // Check if field already has max documents
    const docs = documentsByField.get(fieldUuid) || [];
    if (docs.length >= MAX_DOCUMENTS_PER_FIELD) {
      setUploadError(
        t('customers.documents.maxDocumentsReached', {
          max: MAX_DOCUMENTS_PER_FIELD,
        }) ||
          `Maximum of ${MAX_DOCUMENTS_PER_FIELD} documents per field reached`
      );
      return;
    }

    setSelectedFieldForUpload(fieldUuid);
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const validateAndUploadFile = async (file: File, fieldUuid: string) => {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(
        t('customers.documents.fileTooLarge') || 'File size cannot exceed 10MB'
      );
      return;
    }

    // Validate file type
    const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      setUploadError(
        t('customers.documents.invalidFileType') ||
          `File type '${fileExtension}' is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      );
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        tenantUuid,
        enrollmentUuid,
        documentFieldUuid: fieldUuid,
        file,
      });
      setSelectedFieldForUpload(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setUploadError(
        error?.message ||
          t('customers.documents.uploadFailed') ||
          'Failed to upload document'
      );
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedFieldForUpload) return;

    await validateAndUploadFile(file, selectedFieldForUpload);
  };

  const handleDragOver = (event: React.DragEvent, fieldUuid: string) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOverField(fieldUuid);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOverField(null);
  };

  const handleDrop = async (event: React.DragEvent, fieldUuid: string) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOverField(null);
    setUploadError(null);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    // Check if field is at limit
    const docs = documentsByField.get(fieldUuid) || [];
    if (docs.length >= MAX_DOCUMENTS_PER_FIELD) {
      setUploadError(
        t('customers.documents.maxDocumentsReached', {
          max: MAX_DOCUMENTS_PER_FIELD,
        }) ||
          `Maximum of ${MAX_DOCUMENTS_PER_FIELD} documents per field reached`
      );
      return;
    }

    await validateAndUploadFile(file, fieldUuid);
  };

  const handleDownload = async (document: EnrollmentDocument) => {
    try {
      // Fetch document with authentication
      const tokens = useAuthStore.getState().tokens;
      if (!tokens?.access) {
        setUploadError(
          t('customers.documents.authRequired') ||
            'Authentication required to download documents'
        );
        return;
      }

      // Build the full URL - handle both relative and absolute URLs
      let documentUrl = document.file.startsWith('http')
        ? document.file
        : `${getApiBaseUrl()}${document.file}`;

      // Remove trailing slash if present - some backends are strict about this
      if (documentUrl.endsWith('/')) {
        documentUrl = documentUrl.slice(0, -1);
      }

      const response = await fetch(documentUrl, {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to download document: ${response.status} ${response.statusText}`
        );
      }

      // Get the file as a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Open in new tab (works for PDFs/images)
      const newWindow = window.open(url, '_blank');

      // Clean up the object URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      // If popup was blocked, trigger download instead
      if (!newWindow) {
        const link = document.createElement('a');
        link.href = url;
        link.download = document.original_filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (error: any) {
      console.error('Failed to download document:', error);
      setUploadError(
        error?.message ||
          t('customers.documents.downloadFailed') ||
          'Failed to download document'
      );
      setTimeout(() => setUploadError(''), 5000);
    }
  };

  const handleDelete = async (document: EnrollmentDocument) => {
    const confirmed = await confirm({
      title: t('customers.documents.deleteDocumentTitle') || 'Delete Document',
      description:
        t('customers.documents.deleteDocumentMessage', {
          filename: document.original_filename,
        }) ||
        `Are you sure you want to delete "${document.original_filename}"? This action cannot be undone.`,
      variant: 'destructive',
      confirmText: t('common.delete') || 'Delete',
      cancelText: t('common.cancel') || 'Cancel',
    });

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync({
        tenantUuid,
        enrollmentUuid,
        documentUuid: document.uuid,
      });
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const renderDocumentCard = (
    doc: EnrollmentDocument,
    showFieldInfo = false
  ) => {
    const fieldInfo = fieldToStepMap.get(doc.document_field);

    return (
      <div
        key={doc.uuid}
        className="flex items-start gap-3 rounded-md border border-border bg-background p-3"
      >
        <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className="truncate text-sm font-medium"
                  title={doc.original_filename}
                >
                  {doc.original_filename}
                </p>
                {showFieldInfo && fieldInfo && (
                  <>
                    {fieldInfo.uploadedBy === 'ADMIN' ? (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="mr-1 h-2.5 w-2.5" />
                        {t('flows.admin') || 'Admin'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <User className="mr-1 h-2.5 w-2.5" />
                        {t('flows.customer') || 'Customer'}
                      </Badge>
                    )}
                  </>
                )}
              </div>
              {showFieldInfo && fieldInfo && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {fieldInfo.fieldName}
                </p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{doc.uploaded_by_name}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(doc.created).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDownload(doc)}
            className="h-7 w-7 p-0"
            title={t('customers.documents.download') || 'Download'}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(doc)}
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            disabled={deleteMutation.isPending}
            title={t('common.delete') || 'Delete'}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderFieldSection = (field: FlowStepDocumentField) => {
    const docs = documentsByField.get(field.uuid) || [];
    const isAtLimit = docs.length >= MAX_DOCUMENTS_PER_FIELD;
    const isDraggingOver = dragOverField === field.uuid;

    return (
      <div key={field.uuid} className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{field.name}</span>
              {field.is_required ? (
                <Badge
                  variant="outline"
                  className="border-red-600 bg-red-50 text-xs text-red-700 dark:border-red-400 dark:bg-red-950/30 dark:text-red-300"
                >
                  {t('customers.documents.requiredDocument') || 'Required'}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  {t('customers.documents.optionalDocument') || 'Optional'}
                </Badge>
              )}
              {field.uploaded_by === 'ADMIN' ? (
                <Badge variant="outline" className="text-xs">
                  <Shield className="mr-1 h-2.5 w-2.5" />
                  {t('flows.admin') || 'Admin'}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <User className="mr-1 h-2.5 w-2.5" />
                  {t('flows.customer') || 'Customer'}
                </Badge>
              )}
              {docs.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({docs.length}/{MAX_DOCUMENTS_PER_FIELD})
                </span>
              )}
            </div>
            {field.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {field.description}
              </p>
            )}
          </div>
        </div>

        {docs.length > 0 ? (
          <div className="space-y-2">
            {docs.map(doc => renderDocumentCard(doc))}
            {!isAtLimit && (
              <div
                className={`cursor-pointer rounded-md border-2 border-dashed p-3 text-center transition-all ${
                  isDraggingOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => handleSelectFile(field.uuid)}
                onDragOver={e => handleDragOver(e, field.uuid)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, field.uuid)}
              >
                <Upload className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {isDraggingOver
                    ? t('customers.documents.dropToUpload') ||
                      'Drop file to upload'
                    : t('customers.documents.clickOrDragToUpload') ||
                      'Click to upload or drag & drop'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`rounded-md border-2 border-dashed p-6 text-center transition-all ${
              isAtLimit
                ? 'cursor-not-allowed border-border bg-muted/30 opacity-50'
                : isDraggingOver
                  ? 'cursor-pointer border-primary bg-primary/5'
                  : 'cursor-pointer border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
            }`}
            onClick={() => !isAtLimit && handleSelectFile(field.uuid)}
            onDragOver={e => !isAtLimit && handleDragOver(e, field.uuid)}
            onDragLeave={handleDragLeave}
            onDrop={e => !isAtLimit && handleDrop(e, field.uuid)}
          >
            <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {isAtLimit
                ? t('customers.documents.maxDocumentsReached', {
                    max: MAX_DOCUMENTS_PER_FIELD,
                  }) ||
                  `Maximum of ${MAX_DOCUMENTS_PER_FIELD} documents reached`
                : isDraggingOver
                  ? t('customers.documents.dropToUpload') ||
                    'Drop file to upload'
                  : t('customers.documents.clickOrDragToUpload') ||
                    'Click to upload or drag & drop'}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (documentsLoading || fieldsLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('customers.documents.title') || 'Documents'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">
                {t('common.loading') || 'Loading...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('customers.documents.title') || 'Documents'}
          </CardTitle>
          {!hideDescription && (
            <CardDescription>
              {t('customers.documents.description') ||
                'Upload and view documents for this enrollment'}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Error */}
          {uploadError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  {uploadError}
                </p>
              </div>
            </div>
          )}

          {/* Document Status Banner */}
          {!isAdminView && fieldsForUser.length > 0 && (
            <>
              {allRequiredDocumentsUploaded ? (
                <div
                  className="rounded-md border p-4"
                  style={{
                    backgroundColor: tenantPrimaryColor
                      ? `color-mix(in srgb, ${tenantPrimaryColor} 10%, transparent)`
                      : undefined,
                    borderColor: tenantPrimaryColor || undefined,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="h-5 w-5 flex-shrink-0"
                      style={{ color: tenantPrimaryColor || undefined }}
                    />
                    <div className="flex-1">
                      <h4
                        className="text-sm font-medium"
                        style={{ color: tenantPrimaryColor || undefined }}
                      >
                        {t(
                          'customers.documents.allRequiredDocumentsUploaded'
                        ) || 'All Required Documents Uploaded'}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t(
                          'customers.documents.allRequiredDocumentsUploadedMessage'
                        ) ||
                          'All required documents have been uploaded. An admin will review your submission and update your status.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : missingRequiredFields.length > 0 ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        {t('customers.documents.missingRequiredDocuments') ||
                          'Required Documents Needed'}
                      </h4>
                      <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                        {t(
                          'customers.documents.missingRequiredDocumentsMessage'
                        ) ||
                          'Please upload the following required documents to continue:'}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
                        {missingRequiredFields.map(field => (
                          <li
                            key={field.uuid}
                            className="flex items-center gap-2"
                          >
                            <span className="h-1 w-1 rounded-full bg-amber-600 dark:bg-amber-400" />
                            <span className="font-medium">{field.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {/* Current Step Documents */}
          {fieldsForUser.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                {t('customers.documents.currentStepTitle', {
                  step: currentStepName,
                }) || `Documents for ${currentStepName}`}
              </h3>
              {fieldsForUser.map(field => renderFieldSection(field))}
            </div>
          )}

          {/* No fields configured message */}
          {fieldsForUser.length === 0 && currentStepDocuments.length === 0 && (
            <div className="rounded-md border border-dashed border-border bg-muted/30 p-6 text-center">
              <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t('customers.documents.noFieldsConfigured') ||
                  'No document fields configured for the current step'}
              </p>
            </div>
          )}

          {/* Other Steps Documents */}
          {documentsByStep.length > 0 && (
            <>
              <div className="border-t border-border" />
              <div className="space-y-4">
                {collapsibleOtherSteps ? (
                  <>
                    <div
                      className="flex cursor-pointer items-center justify-between"
                      onClick={() =>
                        setIsOtherStepsExpanded(!isOtherStepsExpanded)
                      }
                    >
                      <h3 className="text-sm font-semibold">
                        {t('customers.documents.otherStepsTitle') ||
                          'Documents from Other Steps'}
                      </h3>
                      {isOtherStepsExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                    {isOtherStepsExpanded && (
                      <div className="space-y-4">
                        {documentsByStep.map((stepGroup, index) => (
                          <div key={index} className="space-y-2">
                            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {stepGroup.stepName}
                            </h4>
                            <div className="space-y-2">
                              {stepGroup.docs.map(doc =>
                                renderDocumentCard(doc, true)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold">
                      {t('customers.documents.otherStepsTitle') ||
                        'Documents from Other Steps'}
                    </h3>
                    {documentsByStep.map((stepGroup, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {stepGroup.stepName}
                        </h4>
                        <div className="space-y-2">
                          {stepGroup.docs.map(doc =>
                            renderDocumentCard(doc, true)
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleFileChange}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </>
  );
};
