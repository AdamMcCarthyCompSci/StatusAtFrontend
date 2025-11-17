import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';
import {
  useEnrollment,
  useDeleteEnrollment,
  useUpdateEnrollment,
} from '@/hooks/useEnrollmentQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTenantStatus } from '@/hooks/useTenantStatus';
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

const EnrollmentHistoryPage = () => {
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
      title: `Remove ${enrollment.user_name}?`,
      description: `This will permanently remove ${enrollment.user_name} from the flow. They will lose access to status tracking.`,
      variant: 'destructive',
      confirmText: 'Remove Customer',
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

    const confirmed = await confirm({
      title: isBackward ? 'Move Customer Back' : 'Move Customer Forward',
      description: isBackward
        ? `Move ${enrollment.user_name} back to "${toStepName}"? This will revert their progress in the flow.`
        : `Move ${enrollment.user_name} to "${toStepName}"? This will advance their progress in the flow.`,
      variant: isBackward ? 'warning' : 'info',
      confirmText: isBackward ? 'Move Back' : 'Move Forward',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await updateEnrollmentMutation.mutateAsync({
          tenantUuid: selectedTenant || '',
          enrollmentUuid: enrollmentId!,
          updates: {
            current_step: toStepId,
          },
        });
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
      }
    }
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
                Loading enrollment details...
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
              Error Loading Enrollment
            </h1>
            <p className="mb-4 text-muted-foreground">
              {enrollmentError?.message || 'Failed to load enrollment details'}
            </p>
            <Button asChild>
              <Link to="/customer-management">Back to Customer Management</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/customer-management">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customer Management
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <History className="h-6 w-6" />
              History
            </h1>
            <p className="text-muted-foreground">
              History for {enrollment.user_name} in{' '}
              {selectedMembership?.tenant_name}
            </p>
          </div>
          <Button asChild>
            <Link to={`/status-tracking/${selectedTenant}/${enrollmentId}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Flow
            </Link>
          </Button>
        </div>

        {/* Customer Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <UserCircle className="h-12 w-12 flex-shrink-0 text-muted-foreground" />
                <div>
                  <CardTitle className="mb-1 text-xl">
                    {enrollment.user_name}
                  </CardTitle>
                  <CardDescription className="mb-2 text-base">
                    {enrollment.user_email}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {enrollment.flow_name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="secondary">
                      {enrollment.current_step_name}
                    </Badge>
                    {enrollment.is_active !== undefined && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge
                          variant={enrollment.is_active ? 'default' : 'outline'}
                          className={
                            enrollment.is_active
                              ? 'bg-green-500 hover:bg-green-600'
                              : ''
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
                Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}
              </div>

              {/* Identifier Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Customer Identifier
                </label>
                <p className="text-xs text-muted-foreground">
                  Add a custom identifier to help track this customer (e.g.,
                  order number, reference ID)
                </p>
                <div className="flex gap-2">
                  <Input
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Enter identifier..."
                    className="flex-1"
                    disabled={isSavingIdentifier}
                  />
                  <Button
                    onClick={handleSaveIdentifier}
                    disabled={
                      isSavingIdentifier || identifier === enrollment.identifier
                    }
                    size="default"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSavingIdentifier ? 'Saving...' : 'Save'}
                  </Button>
                </div>

                {/* Success/Error Messages */}
                {identifierSuccess && (
                  <div className="rounded-md border border-green-200 bg-green-50 p-2 dark:border-green-800 dark:bg-green-950/20">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Identifier updated successfully!
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Manage Customer</CardTitle>
              <CardDescription>
                Move customer to a different step or remove them from the flow
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

              {/* Move Customer Section */}
              {enrollment.available_transitions &&
              enrollment.available_transitions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Move Customer</h3>

                  {/* Forward Transitions */}
                  {enrollment.available_transitions.filter(t => !t.is_backward)
                    .length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Move Forward
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
                              disabled={updateEnrollmentMutation.isPending}
                            >
                              <div className="flex w-full items-center gap-3">
                                <ArrowRight className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <div className="flex-1 text-left">
                                  <div className="font-medium">
                                    {transition.to_step_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Advance to next step
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
                        Move Back
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
                                <RotateCcw className="h-5 w-5 flex-shrink-0 text-orange-600" />
                                <div className="flex-1 text-left">
                                  <div className="font-medium">
                                    {transition.to_step_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Revert to previous step
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
                  No available transitions from the current step.
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Remove Customer Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Remove Customer</h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  Permanently remove this customer from the flow. This action
                  cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteEnrollment}
                  disabled={deleteEnrollmentMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Step History</CardTitle>
              <div className="flex items-center gap-4">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
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
            </div>
            {historyData && (
              <CardDescription>
                Showing {startItem}-{endItem} of {historyData.count} history
                entries
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading history...
                  </p>
                </div>
              </div>
            ) : historyError ? (
              <div className="py-8 text-center">
                <p className="mb-2 text-destructive">Error loading history</p>
                <p className="text-sm text-muted-foreground">
                  {historyError.message}
                </p>
              </div>
            ) : !historyData?.results?.length ? (
              <div className="py-8 text-center">
                <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No history entries found
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {historyData.results.map(entry => (
                  <div
                    key={entry.uuid}
                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    {/* Timeline indicator */}
                    <div className="mt-1 flex-shrink-0">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {entry.from_step_name || (
                              <span className="italic text-muted-foreground">
                                (deleted step)
                              </span>
                            )}
                          </span>
                          {entry.is_backward ? (
                            <div className="flex items-center gap-1">
                              <RotateCcw className="h-4 w-4 text-orange-600" />
                              <span className="text-xs font-medium text-orange-600">
                                (back)
                              </span>
                            </div>
                          ) : (
                            <ArrowRight className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-medium">
                            {entry.to_step_name || (
                              <span className="italic text-muted-foreground">
                                (deleted step)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Changed by {entry.changed_by_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
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
      </div>
    </div>
  );
};

export default EnrollmentHistoryPage;
