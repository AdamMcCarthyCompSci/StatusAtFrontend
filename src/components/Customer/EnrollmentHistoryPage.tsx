import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  History,
  Clock,
  User,
  ArrowRight,
  RotateCcw,
  Trash2,
  UserCircle,
  Eye,
  AlertCircle,
  Save,
  Mail,
  Phone,
  FileText,
  MessageSquare,
} from 'lucide-react';

import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';
import {
  useEnrollment,
  useDeleteEnrollment,
  useUpdateEnrollment,
  useEnrollmentDocuments,
} from '@/hooks/useEnrollmentQuery';
import { useDocumentFields } from '@/hooks/useFlowBuilderQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTenantStatus } from '@/hooks/useTenantStatus';
import { useIsStaffOrOwner } from '@/hooks/useCurrentRole';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { logger } from '@/lib/logger';
import { PAGINATION } from '@/config/constants';

import { MoveCustomerModal } from './MoveCustomerModal';
import { EnrollmentDocuments } from './EnrollmentDocuments';

const EnrollmentHistoryPage = () => {
  const { t } = useTranslation();
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const { selectedTenant } = useTenantStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState<string>('');
  const [isSavingIdentifier, setIsSavingIdentifier] = useState(false);
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [identifierSuccess, setIdentifierSuccess] = useState(false);
  const deleteEnrollmentMutation = useDeleteEnrollment();
  const updateEnrollmentMutation = useUpdateEnrollment();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const { isRestrictedTenant } = useTenantStatus();
  const isStaffOrOwner = useIsStaffOrOwner();

  // Move customer modal state
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{
    toStepId: string;
    toStepName: string;
    fromStepName: string;
    isBackward: boolean;
  } | null>(null);

  // Get selected membership for display
  const selectedMembership = user?.memberships?.find(
    m => m.tenant_uuid === selectedTenant
  );

  // Fetch enrollment details
  const {
    data: enrollment,
    isLoading: enrollmentLoading,
    error: enrollmentError,
  } = useEnrollment(selectedTenant || '', enrollmentId || '');

  // Fetch enrollment history with pagination
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useEnrollmentHistory(selectedTenant || '', enrollmentId || '', {
    page: currentPage,
    page_size: pageSize,
  });

  // Fetch document fields and documents for required document check
  const flowUuid =
    typeof enrollment?.flow === 'string'
      ? enrollment.flow
      : enrollment?.flow?.uuid || enrollment?.flow_uuid || '';
  const currentStepUuid =
    typeof enrollment?.current_step === 'string'
      ? enrollment.current_step
      : enrollment?.current_step?.uuid || enrollment?.current_step_uuid || '';

  const { data: documentFields = [] } = useDocumentFields(
    selectedTenant || '',
    flowUuid,
    currentStepUuid
  );
  const { data: documents = [] } = useEnrollmentDocuments(
    selectedTenant || '',
    enrollmentId || ''
  );

  // Calculate missing required documents
  const missingRequiredDocuments = documentFields
    .filter(field => field.is_required && field.is_active)
    .filter(field => {
      const hasDocument = documents.some(
        doc => doc.document_field === field.uuid
      );
      return !hasDocument;
    });

  // Initialize identifier from enrollment data
  useEffect(() => {
    if (enrollment?.identifier) {
      setIdentifier(enrollment.identifier);
    }
  }, [enrollment]);

  // Refetch history when the page loads or enrollment ID changes
  useEffect(() => {
    if (selectedTenant && enrollmentId) {
      refetchHistory();
    }
  }, [selectedTenant, enrollmentId, refetchHistory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleDeleteEnrollment = async () => {
    if (!enrollment) return;

    const confirmed = await confirm({
      title: t('customers.removeCustomerTitle', { name: enrollment.user_name }),
      description: t('customers.removeCustomerMessage', {
        name: enrollment.user_name,
      }),
      variant: 'destructive',
      confirmText: t('customers.removeCustomerButton'),
    });

    if (confirmed) {
      try {
        await deleteEnrollmentMutation.mutateAsync({
          tenantUuid: selectedTenant!,
          enrollmentUuid: enrollmentId!,
        });
        // Navigate back to customer management after successful deletion
        navigate('/customer-management');
      } catch (error) {
        logger.error('Failed to delete enrollment:', error);
      }
    }
  };

  const handleSaveIdentifier = async () => {
    if (!enrollment) return;

    setIsSavingIdentifier(true);
    setIdentifierError(null);
    setIdentifierSuccess(false);

    try {
      await updateEnrollmentMutation.mutateAsync({
        tenantUuid: selectedTenant || '',
        enrollmentUuid: enrollmentId!,
        updates: {
          identifier: identifier || undefined,
        },
      });
      setIdentifierSuccess(true);
      setTimeout(() => setIdentifierSuccess(false), 3000);
    } catch (error: any) {
      logger.error('Failed to update identifier:', error);
      setIdentifierError('Failed to update identifier. Please try again.');
      setTimeout(() => setIdentifierError(null), 5000);
    } finally {
      setIsSavingIdentifier(false);
    }
  };

  const handleMoveEnrollment = async (
    toStepId: string,
    toStepName: string,
    isBackward: boolean = false
  ) => {
    if (!enrollment) return;

    // Clear previous errors
    setMoveError(null);

    // Store pending move data and open modal
    setPendingMove({
      toStepId,
      toStepName,
      fromStepName: enrollment.current_step_name,
      isBackward,
    });
    setIsMoveModalOpen(true);
  };

  const handleConfirmMove = async (
    internalNote: string,
    externalNote: string
  ) => {
    if (!enrollment || !pendingMove) return;

    try {
      await updateEnrollmentMutation.mutateAsync({
        tenantUuid: selectedTenant || '',
        enrollmentUuid: enrollmentId!,
        updates: {
          current_step: pendingMove.toStepId,
          internal_note: internalNote || undefined,
          external_note: externalNote || undefined,
        },
      });

      // Close modal on success
      setIsMoveModalOpen(false);
      setPendingMove(null);
    } catch (error: any) {
      logger.error('Failed to move enrollment:', error);

      // Handle 403 errors from backend (tier restrictions)
      if (error?.response?.status === 403) {
        const message =
          error?.response?.data?.detail ||
          'Your plan has reached its limit. Please upgrade to continue.';
        setMoveError(message);
        // Auto-clear error after 5 seconds
        setTimeout(() => setMoveError(null), 5000);
      } else {
        setMoveError('Failed to move enrollment. Please try again.');
        setTimeout(() => setMoveError(null), 5000);
      }

      // Close modal even on error
      setIsMoveModalOpen(false);
      setPendingMove(null);
    }
  };

  const handleCloseMoveModal = () => {
    setIsMoveModalOpen(false);
    setPendingMove(null);
  };

  // Calculate pagination info
  const totalPages = historyData ? Math.ceil(historyData.count / pageSize) : 0;
  const startItem = historyData ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = historyData
    ? Math.min(currentPage * pageSize, historyData.count)
    : 0;

  if (enrollmentLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-muted-foreground">
                {t('customers.loadingEnrollmentDetails')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (enrollmentError || !enrollment) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-destructive">
              {t('errors.errorLoadingEnrollment')}
            </h1>
            <p className="mb-4 text-muted-foreground">
              {enrollmentError?.message || t('errors.failedToLoadEnrollment')}
            </p>
            <Button asChild>
              <Link to="/customer-management">
                {t('customers.backToCustomerManagement')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <div className="container mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 w-full space-y-4">
          {/* Back button - full width on mobile */}
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/customer-management">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('customers.backToCustomerManagement')}
            </Link>
          </Button>

          {/* Title and View Flow button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                <History className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
                <span className="truncate">{t('customers.history')}</span>
              </h1>
              <p className="break-words text-sm text-muted-foreground">
                {t('customers.historyFor', {
                  name: enrollment.user_name,
                  tenant: selectedMembership?.tenant_name,
                })}
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-brand-subtle w-full flex-shrink-0 text-white hover:opacity-90 sm:w-auto"
            >
              <Link to={`/status-tracking/${selectedTenant}/${enrollmentId}`}>
                <Eye className="mr-2 h-4 w-4" />
                {t('customers.viewFlow')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Customer Info Card */}
        <Card className="mb-6 w-full border-accent/20 shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <UserCircle className="h-10 w-10 flex-shrink-0 text-accent sm:h-12 sm:w-12" />
                <div className="min-w-0 flex-1">
                  <CardTitle className="mb-1 break-words text-lg sm:text-xl">
                    {enrollment.user_name}
                  </CardTitle>
                  <CardDescription className="mb-2 space-y-1 text-sm sm:text-base">
                    <div className="flex min-w-0 items-center gap-2">
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{enrollment.user_email}</span>
                    </div>
                    {enrollment.user_whatsapp_full_number && (
                      <div className="flex min-w-0 items-center gap-2">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="break-all">
                          {enrollment.user_whatsapp_full_number}
                        </span>
                      </div>
                    )}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="break-words text-xs text-muted-foreground sm:text-sm">
                      {enrollment.flow_name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="secondary" className="text-xs">
                      {enrollment.current_step_name}
                    </Badge>
                    {enrollment.is_active !== undefined && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge
                          variant={enrollment.is_active ? 'default' : 'outline'}
                          className={
                            enrollment.is_active
                              ? 'bg-green-500 text-xs hover:bg-green-600'
                              : 'text-xs'
                          }
                        >
                          {enrollment.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {t('customers.enrolled')}:{' '}
                {new Date(enrollment.created_at).toLocaleDateString()}
              </div>

              {/* Identifier Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('customers.customerIdentifier')}
                </label>
                <p className="text-xs text-muted-foreground">
                  {t('customers.customerIdentifierHelper')}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={t('customers.enterIdentifier')}
                    className="flex-1"
                    disabled={isSavingIdentifier}
                  />
                  <Button
                    onClick={handleSaveIdentifier}
                    disabled={
                      isSavingIdentifier || identifier === enrollment.identifier
                    }
                    size="default"
                    className="bg-gradient-brand-subtle w-full text-white hover:opacity-90 sm:w-auto"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSavingIdentifier
                      ? t('customers.saving')
                      : t('common.save')}
                  </Button>
                </div>

                {/* Success/Error Messages */}
                {identifierSuccess && (
                  <div className="rounded-md border border-green-200 bg-green-50 p-2 dark:border-green-800 dark:bg-green-950/20">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {t('customers.identifierUpdated')}
                    </p>
                  </div>
                )}
                {identifierError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-2 dark:border-red-800 dark:bg-red-950/20">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {identifierError}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card - Only show for non-restricted tenants */}
        {!isRestrictedTenant && (
          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>{t('customers.manageCustomer')}</CardTitle>
              <CardDescription>
                {t('customers.manageCustomerDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Message */}
              {moveError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {moveError}
                    </p>
                  </div>
                </div>
              )}

              {/* Missing Required Documents Warning */}
              {missingRequiredDocuments.length > 0 && (
                <div className="rounded-md border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950/20">
                  <div className="flex gap-2">
                    <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        {t('customers.missingRequiredDocuments')}
                      </p>
                      <p className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                        {t('customers.missingRequiredDocumentsDescription')}
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-orange-700 dark:text-orange-300">
                        {missingRequiredDocuments.map(field => (
                          <li key={field.uuid}>{field.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Move Customer Section */}
              {enrollment.available_transitions &&
              enrollment.available_transitions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    {t('customers.moveCustomer')}
                  </h3>

                  {/* Forward Transitions */}
                  {enrollment.available_transitions.filter(t => !t.is_backward)
                    .length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t('customers.moveForward')}
                      </div>
                      <div className="grid gap-2">
                        {enrollment.available_transitions
                          .filter(t => !t.is_backward)
                          .map(transition => (
                            <Button
                              key={transition.uuid}
                              variant="outline"
                              className="h-auto justify-start px-4 py-3 hover:border-green-300 hover:bg-green-50 dark:hover:border-green-800 dark:hover:bg-green-950"
                              onClick={() =>
                                handleMoveEnrollment(
                                  transition.to_step,
                                  transition.to_step_name,
                                  false
                                )
                              }
                              disabled={
                                updateEnrollmentMutation.isPending ||
                                missingRequiredDocuments.length > 0
                              }
                            >
                              <div className="flex w-full items-center gap-3">
                                <ArrowRight className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                                <div className="flex-1 text-left">
                                  <div className="font-medium text-foreground">
                                    {transition.to_step_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {t('customers.advanceToNextStep')}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Backward Transitions */}
                  {enrollment.available_transitions.filter(t => t.is_backward)
                    .length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t('customers.moveBack')}
                      </div>
                      <div className="grid gap-2">
                        {enrollment.available_transitions
                          .filter(t => t.is_backward)
                          .map(transition => (
                            <Button
                              key={transition.uuid}
                              variant="outline"
                              className="h-auto justify-start px-4 py-3 hover:border-orange-300 hover:bg-orange-50 dark:hover:border-orange-800 dark:hover:bg-orange-950"
                              onClick={() =>
                                handleMoveEnrollment(
                                  transition.to_step,
                                  transition.to_step_name,
                                  true
                                )
                              }
                              disabled={updateEnrollmentMutation.isPending}
                            >
                              <div className="flex w-full items-center gap-3">
                                <RotateCcw className="h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                                <div className="flex-1 text-left">
                                  <div className="font-medium text-foreground">
                                    {transition.to_step_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {t('customers.revertToPreviousStep')}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t('customers.noAvailableTransitions')}
                </div>
              )}

              {/* Remove Customer Section - Only visible to STAFF and OWNER */}
              {isStaffOrOwner && (
                <>
                  {/* Divider */}
                  <div className="border-t border-border"></div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">
                      {t('customers.removeCustomer')}
                    </h3>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {t('customers.removeCustomerDescription')}
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteEnrollment}
                      disabled={deleteEnrollmentMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('customers.removeCustomerButton')}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Documents Card */}
        {enrollment && selectedTenant && (
          <EnrollmentDocuments
            tenantUuid={selectedTenant}
            enrollmentUuid={enrollmentId!}
            flowUuid={flowUuid}
            currentStepUuid={currentStepUuid}
            currentStepName={
              enrollment.current_step?.name ||
              enrollment.current_step_name ||
              ''
            }
            isAdminView={isStaffOrOwner}
          />
        )}

        {/* History Content */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg sm:text-xl">
                {t('customers.stepHistory')}
              </CardTitle>
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
                  {t('customers.show')}:
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {historyData && (
              <CardDescription className="text-xs sm:text-sm">
                {t('customers.showingHistoryEntries', {
                  start: startItem,
                  end: endItem,
                  count: historyData.count,
                })}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    {t('customers.loadingHistory')}
                  </p>
                </div>
              </div>
            ) : historyError ? (
              <div className="py-8 text-center">
                <p className="mb-2 text-destructive">
                  {t('customers.errorLoadingHistory')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {historyError.message}
                </p>
              </div>
            ) : !historyData?.results?.length ? (
              <div className="py-8 text-center">
                <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {t('customers.noHistoryEntries')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {historyData.results.map(entry => (
                  <div
                    key={entry.uuid}
                    className="flex items-start gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50 sm:gap-4 sm:p-4"
                  >
                    {/* Timeline indicator */}
                    <div className="mt-1 flex-shrink-0">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary sm:h-3 sm:w-3"></div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="break-words text-sm font-medium sm:text-base">
                          {entry.from_step_name || (
                            <span className="italic text-muted-foreground">
                              {t('customers.deletedStep')}
                            </span>
                          )}
                        </span>
                        {entry.is_backward ? (
                          <div className="flex flex-shrink-0 items-center gap-1">
                            <RotateCcw className="h-3 w-3 text-orange-600 sm:h-4 sm:w-4" />
                            <span className="text-xs font-medium text-orange-600">
                              (back)
                            </span>
                          </div>
                        ) : (
                          <ArrowRight className="h-3 w-3 flex-shrink-0 text-green-600 sm:h-4 sm:w-4" />
                        )}
                        <span className="break-words text-sm font-medium sm:text-base">
                          {entry.to_step_name || (
                            <span className="italic text-muted-foreground">
                              {t('customers.deletedStep')}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="mb-2 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
                        <div className="flex min-w-0 items-center gap-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {t('customers.changedBy', {
                              name: entry.changed_by_name,
                            })}
                          </span>
                        </div>
                        <div className="flex min-w-0 items-center gap-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            {new Date(entry.timestamp).toLocaleString(
                              undefined,
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      {(entry.internal_note || entry.external_note) && (
                        <div className="mt-3 space-y-2">
                          {entry.external_note && (
                            <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
                              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-900 dark:text-blue-200">
                                <MessageSquare className="h-3 w-3" />
                                {t('customers.externalNote')}
                              </div>
                              <p className="text-sm text-blue-800 dark:text-blue-300">
                                {entry.external_note}
                              </p>
                            </div>
                          )}
                          {entry.internal_note && (
                            <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950/20">
                              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-amber-900 dark:text-amber-200">
                                <FileText className="h-3 w-3" />
                                {t('customers.internalNote')}
                              </div>
                              <p className="text-sm text-amber-800 dark:text-amber-300">
                                {entry.internal_note}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {historyData && totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        <ConfirmationDialog />

        {/* Move Customer Modal */}
        {pendingMove && enrollment && (
          <MoveCustomerModal
            isOpen={isMoveModalOpen}
            onClose={handleCloseMoveModal}
            onConfirm={handleConfirmMove}
            customerName={enrollment.user_name}
            fromStepName={pendingMove.fromStepName}
            toStepName={pendingMove.toStepName}
            isBackward={pendingMove.isBackward}
            isLoading={updateEnrollmentMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default EnrollmentHistoryPage;
