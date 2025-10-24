import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';
import { useEnrollment, useDeleteEnrollment, useUpdateEnrollment } from '@/hooks/useEnrollmentQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTenantStatus } from '@/hooks/useTenantStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, History, Clock, User, ArrowRight, RotateCcw, Trash2, UserCircle, Eye } from 'lucide-react';

const EnrollmentHistoryPage = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const { selectedTenant } = useTenantStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deleteEnrollmentMutation = useDeleteEnrollment();
  const updateEnrollmentMutation = useUpdateEnrollment();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const { isRestrictedTenant } = useTenantStatus();

  // Get selected membership for display
  const selectedMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);

  // Fetch enrollment details
  const { data: enrollment, isLoading: enrollmentLoading, error: enrollmentError } = useEnrollment(
    selectedTenant || '',
    enrollmentId || ''
  );

  // Fetch enrollment history with pagination
  const { data: historyData, isLoading: historyLoading, error: historyError, refetch: refetchHistory } = useEnrollmentHistory(
    selectedTenant || '',
    enrollmentId || '',
    {
      page: currentPage,
      page_size: pageSize,
    }
  );

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
        console.error('Failed to delete enrollment:', error);
      }
    }
  };

  const handleMoveEnrollment = async (toStepId: string, toStepName: string, isBackward: boolean = false) => {
    if (!enrollment) return;
    
    const confirmed = await confirm({
      title: isBackward ? 'Move Customer Back' : 'Move Customer Forward',
      description: isBackward 
        ? `Move ${enrollment.user_name} back to "${toStepName}"? This will revert their progress in the flow.`
        : `Move ${enrollment.user_name} to "${toStepName}"? This will advance their progress in the flow.`,
      variant: isBackward ? 'warning' : 'info',
      confirmText: isBackward ? 'Move Back' : 'Move Forward',
      cancelText: 'Cancel'
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
      } catch (error) {
        console.error('Failed to move enrollment:', error);
      }
    }
  };

  // Calculate pagination info
  const totalPages = historyData ? Math.ceil(historyData.count / pageSize) : 0;
  const startItem = historyData ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = historyData ? Math.min(currentPage * pageSize, historyData.count) : 0;

  if (enrollmentLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading enrollment details...</p>
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
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Enrollment</h1>
            <p className="text-muted-foreground mb-4">
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link to="/customer-management">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customer Management
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6" />
            History
          </h1>
          <p className="text-muted-foreground">
            History for {enrollment.user_name} in {selectedMembership?.tenant_name}
          </p>
        </div>
        <Button asChild>
          <Link to={`/status-tracking/${selectedTenant}/${enrollmentId}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Flow
          </Link>
        </Button>
      </div>

      {/* Customer Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <UserCircle className="h-12 w-12 text-muted-foreground flex-shrink-0" />
              <div>
                <CardTitle className="text-xl mb-1">{enrollment.user_name}</CardTitle>
                <CardDescription className="text-base mb-2">{enrollment.user_email}</CardDescription>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{enrollment.flow_name}</span>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="secondary">{enrollment.current_step_name}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Actions Card - Only show for non-restricted tenants */}
      {!isRestrictedTenant && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Manage Customer</CardTitle>
            <CardDescription>Move customer to a different step or remove them from the flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          {/* Move Customer Section */}
          {enrollment.available_transitions && enrollment.available_transitions.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Move Customer</h3>
              
              {/* Forward Transitions */}
              {enrollment.available_transitions.filter(t => !t.is_backward).length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Move Forward
                  </div>
                  <div className="grid gap-2">
                    {enrollment.available_transitions
                      .filter(t => !t.is_backward)
                      .map((transition) => (
                        <Button
                          key={transition.uuid}
                          variant="outline"
                          className="justify-start h-auto py-3 px-4 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950 dark:hover:border-green-800"
                          onClick={() => handleMoveEnrollment(transition.to_step, transition.to_step_name, false)}
                          disabled={updateEnrollmentMutation.isPending}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{transition.to_step_name}</div>
                              <div className="text-xs text-muted-foreground">Advance to next step</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              {/* Backward Transitions */}
              {enrollment.available_transitions.filter(t => t.is_backward).length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Move Back
                  </div>
                  <div className="grid gap-2">
                    {enrollment.available_transitions
                      .filter(t => t.is_backward)
                      .map((transition) => (
                        <Button
                          key={transition.uuid}
                          variant="outline"
                          className="justify-start h-auto py-3 px-4 hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-orange-950 dark:hover:border-orange-800"
                          onClick={() => handleMoveEnrollment(transition.to_step, transition.to_step_name, true)}
                          disabled={updateEnrollmentMutation.isPending}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <RotateCcw className="h-5 w-5 text-orange-600 flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{transition.to_step_name}</div>
                              <div className="text-xs text-muted-foreground">Revert to previous step</div>
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
            <p className="text-xs text-muted-foreground mb-3">
              Permanently remove this customer from the flow. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteEnrollment}
              disabled={deleteEnrollmentMutation.isPending}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
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
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
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
              Showing {startItem}-{endItem} of {historyData.count} history entries
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading history...</p>
              </div>
            </div>
          ) : historyError ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-2">Error loading history</p>
              <p className="text-sm text-muted-foreground">{historyError.message}</p>
            </div>
          ) : !historyData?.results?.length ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No history entries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyData.results.map((entry) => (
                <div
                  key={entry.uuid}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Timeline indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {entry.from_step_name || (
                            <span className="text-muted-foreground italic">(deleted step)</span>
                          )}
                        </span>
                        {entry.is_backward ? (
                          <div className="flex items-center gap-1">
                            <RotateCcw className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-orange-600 font-medium">(back)</span>
                          </div>
                        ) : (
                          <ArrowRight className="h-4 w-4 text-green-600" />
                        )}
                        <span className="font-medium">
                          {entry.to_step_name || (
                            <span className="text-muted-foreground italic">(deleted step)</span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Changed by {entry.changed_by_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
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
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
