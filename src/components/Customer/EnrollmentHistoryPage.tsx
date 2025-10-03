import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';
import { useEnrollment } from '@/hooks/useEnrollmentQuery';
import { useTenantStore } from '@/stores/useTenantStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, History, Clock, User, ArrowRight, RotateCcw } from 'lucide-react';

const EnrollmentHistoryPage = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const { selectedTenant } = useTenantStore();
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Calculate pagination info
  const totalPages = historyData ? Math.ceil(historyData.count / pageSize) : 0;
  const startItem = historyData ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = historyData ? Math.min(currentPage * pageSize, historyData.count) : 0;

  if (enrollmentLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading enrollment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (enrollmentError || !enrollment) {
    return (
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
    );
  }

  return (
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
      </div>

      {/* Enrollment Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{enrollment.flow_name}</span>
            <Badge variant="secondary">{enrollment.current_step_name}</Badge>
          </CardTitle>
          <CardDescription>
            Customer: {enrollment.user_name} ({enrollment.user_email})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current Step:</span> {enrollment.current_step_name}
            </div>
            <div>
              <span className="text-muted-foreground">Enrolled:</span> {new Date(enrollment.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default EnrollmentHistoryPage;
