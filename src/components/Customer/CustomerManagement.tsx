import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useEnrollments, useFlowsForFiltering, useFlowSteps } from '@/hooks/useEnrollmentQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { ArrowLeft, Users, Search, UserCircle, X, AlertCircle, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { EnrollmentListParams } from '@/types/enrollment';
import { PAGINATION } from '@/config/constants';

const CustomerManagement = () => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlow, setSelectedFlow] = useState<string>('');
  const [selectedFlowStep, setSelectedFlowStep] = useState<string>('');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState<string>(''); // '' = all, 'true' = active, 'false' = inactive
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);

  // Get selected membership for display
  const selectedMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);

  // Pagination and filter parameters
  const paginationParams: EnrollmentListParams = {
    page: currentPage,
    page_size: pageSize,
    search_user: searchTerm || undefined,
    flow: selectedFlow || undefined,
    current_step: selectedFlowStep || undefined,
    is_active: selectedActiveStatus ? selectedActiveStatus === 'true' : undefined,
  };

  // Fetch data
  const { data: enrollmentsResponse, isLoading, error } = useEnrollments(selectedTenant || '', paginationParams);
  const { data: availableFlows = [], isLoading: flowsLoading } = useFlowsForFiltering(selectedTenant || '');
  const { data: availableSteps = [], isLoading: stepsLoading } = useFlowSteps(selectedTenant || '', selectedFlow);

  const enrollments = enrollmentsResponse?.results || [];
  const totalCount = enrollmentsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFlowChange = (value: string) => {
    const flowValue = value === 'all' ? '' : value;
    setSelectedFlow(flowValue);
    setSelectedFlowStep(''); // Reset step selection when flow changes
    setCurrentPage(1);
  };

  const handleFlowStepChange = (value: string) => {
    const stepValue = value === 'all' ? '' : value;
    setSelectedFlowStep(stepValue);
    setCurrentPage(1);
  };

  const handleActiveStatusChange = (value: string) => {
    const statusValue = value === 'all' ? '' : value;
    setSelectedActiveStatus(statusValue);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFlow('');
    setSelectedFlowStep('');
    setSelectedActiveStatus('');
    setCurrentPage(1);
  };

  // Show error if no tenant is selected
  if (!selectedTenant || !selectedMembership) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button variant="outline" asChild className="w-fit">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Customer Management</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage customer enrollments and status tracking</p>
            </div>
          </div>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-lg text-destructive">No Organization Selected</CardTitle>
                  <CardDescription>
                    Please select an organization from the menu to manage customers.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="outline" asChild className="w-fit">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Managing customers for {selectedMembership.tenant_name}
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Filter customers by name, email, flow, or current step</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search by User */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Customer</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Name or email..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter by Flow */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Flow</label>
                <Select value={selectedFlow || 'all'} onValueChange={handleFlowChange} disabled={flowsLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="All flows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All flows</SelectItem>
                    {availableFlows.map((flow) => (
                      <SelectItem key={flow.uuid} value={flow.uuid}>
                        {flow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Flow Step */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Step</label>
                <Select
                  value={selectedFlowStep || 'all'}
                  onValueChange={handleFlowStepChange}
                  disabled={!selectedFlow || stepsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All steps" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All steps</SelectItem>
                    {availableSteps.map((step) => (
                      <SelectItem key={step.uuid} value={step.uuid}>
                        {step.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Active Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedActiveStatus || 'all'} onValueChange={handleActiveStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="true">Active only</SelectItem>
                    <SelectItem value="false">Inactive only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Page Size Control */}
            <div className="flex items-center justify-end gap-2">
              <label className="text-sm text-muted-foreground">Show:</label>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedFlow || selectedFlowStep || selectedActiveStatus) && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearchChange('')} />
                  </Badge>
                )}
                {selectedFlow && (
                  <Badge variant="secondary" className="gap-1">
                    Flow: {availableFlows.find(f => f.uuid === selectedFlow)?.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFlowChange('all')} />
                  </Badge>
                )}
                {selectedFlowStep && (
                  <Badge variant="secondary" className="gap-1">
                    Step: {availableSteps.find(s => s.uuid === selectedFlowStep)?.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFlowStepChange('all')} />
                  </Badge>
                )}
                {selectedActiveStatus && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {selectedActiveStatus === 'true' ? 'Active' : 'Inactive'}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleActiveStatusChange('all')} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading customers...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to load customers. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customers List */}
        {!isLoading && !error && (
          <>
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Customers ({totalCount})
                  </h2>
                </div>

                <div className="grid gap-4">
                  {enrollments.map((enrollment) => (
                    <Card 
                      key={enrollment.uuid} 
                      className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                      onClick={() => navigate(`/customers/${enrollment.uuid}`)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <UserCircle className="h-10 w-10 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg truncate">{enrollment.user_name}</CardTitle>
                              <CardDescription className="truncate">{enrollment.user_email}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right space-y-1">
                              <div className="text-sm font-medium text-muted-foreground">
                                {enrollment.flow_name}
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {enrollment.current_step_name}
                                </Badge>
                                {enrollment.is_active !== undefined && (
                                  <Badge
                                    variant={enrollment.is_active ? "default" : "outline"}
                                    className={enrollment.is_active ? "text-xs bg-green-500 hover:bg-green-600" : "text-xs"}
                                  >
                                    {enrollment.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}</span>
                          {enrollment.available_transitions && enrollment.available_transitions.length > 0 && (
                            <span>{enrollment.available_transitions.length} available transition{enrollment.available_transitions.length !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} customers
                    </div>
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
                        
                        {totalPages > 5 && <PaginationEllipsis />}
                        
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
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Customers Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedFlow || selectedFlowStep
                        ? "No customers match the current filters. Try adjusting your search criteria."
                        : "No customers are enrolled in any flows yet."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;