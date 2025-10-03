import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useEnrollments, useDeleteEnrollment, useUpdateEnrollment, useFlowsForFiltering, useFlowSteps } from '@/hooks/useEnrollmentQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { ArrowLeft, Users, Search, Trash2, UserCircle, X, AlertCircle, ArrowRight, RotateCcw, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnrollmentListParams } from '@/types/enrollment';

const CustomerManagement = () => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlow, setSelectedFlow] = useState<string>('');
  const [selectedFlowStep, setSelectedFlowStep] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});
  const deleteEnrollmentMutation = useDeleteEnrollment();
  const updateEnrollmentMutation = useUpdateEnrollment();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Get selected membership for display
  const selectedMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);

  // Pagination and filter parameters
  const paginationParams: EnrollmentListParams = {
    page: currentPage,
    page_size: pageSize,
    search_user: searchTerm || undefined,
    flow: selectedFlow || undefined,
    current_step: selectedFlowStep || undefined,
  };

  // Fetch data
  const { data: enrollmentsResponse, isLoading, error } = useEnrollments(selectedTenant || '', paginationParams);
  const { data: availableFlows = [], isLoading: flowsLoading } = useFlowsForFiltering(selectedTenant || '');
  const { data: availableSteps = [], isLoading: stepsLoading } = useFlowSteps(selectedTenant || '', selectedFlow);

  const enrollments = enrollmentsResponse?.results || [];
  const totalCount = enrollmentsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDeleteEnrollment = async (enrollmentUuid: string, customerName: string) => {
    const confirmed = await confirm({
      title: `Remove ${customerName}?`,
      description: `This will permanently remove ${customerName} from the flow. They will lose access to status tracking.`,
      variant: 'destructive',
      confirmText: 'Remove Customer',
    });

    if (confirmed) {
      try {
        await deleteEnrollmentMutation.mutateAsync({
          tenantUuid: selectedTenant!,
          enrollmentUuid,
        });
      } catch (error) {
        console.error('Failed to delete enrollment:', error);
      }
    }
  };

  const handleMoveEnrollment = async (enrollmentUuid: string, toStepId: string, customerName: string, toStepName: string, isBackward: boolean = false) => {
    const confirmed = await confirm({
      title: isBackward ? 'Move Customer Back' : 'Move Customer Forward',
      description: isBackward 
        ? `Move ${customerName} back to "${toStepName}"? This will revert their progress in the flow.`
        : `Move ${customerName} to "${toStepName}"? This will advance their progress in the flow.`,
      variant: isBackward ? 'warning' : 'info',
      confirmText: isBackward ? 'Move Back' : 'Move Forward',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      try {
        await updateEnrollmentMutation.mutateAsync({
          tenantUuid: selectedTenant || '',
          enrollmentUuid,
          updates: {
            current_step: toStepId,
          },
        });
        
        // Reset the select value for this enrollment after successful move
        setSelectValues(prev => ({
          ...prev,
          [enrollmentUuid]: ''
        }));
      } catch (error) {
        console.error('Failed to move enrollment:', error);
      }
    }
  };

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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFlow('');
    setSelectedFlowStep('');
    setCurrentPage(1);
  };

  // Show error if no tenant is selected
  if (!selectedTenant || !selectedMembership) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Customer Management</h1>
              <p className="text-muted-foreground">Manage customer enrollments and status tracking</p>
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">
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

              {/* Page Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Per Page</label>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger>
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
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedFlow || selectedFlowStep) && (
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
                    <Card key={enrollment.uuid} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-lg">{enrollment.user_name}</CardTitle>
                              <CardDescription>{enrollment.user_email}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">{enrollment.flow_name}</div>
                              <Badge variant="secondary" className="text-xs">
                                {enrollment.current_step_name}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link to={`/customers/${enrollment.uuid}/history`}>
                                  <History className="h-4 w-4 mr-1" />
                                  History
                                </Link>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteEnrollment(enrollment.uuid, enrollment.user_name)}
                                disabled={deleteEnrollmentMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}
                          </div>
                          
                          {/* Transition Dropdown */}
                          {enrollment.available_transitions && enrollment.available_transitions.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Move to:</span>
                              <Select
                                value={selectValues[enrollment.uuid] || ''}
                                onValueChange={(transitionUuid) => {
                                  // Update the select value immediately for UI feedback
                                  setSelectValues(prev => ({
                                    ...prev,
                                    [enrollment.uuid]: transitionUuid
                                  }));
                                  
                                  const transition = enrollment.available_transitions?.find(t => t.uuid === transitionUuid);
                                  if (transition) {
                                    handleMoveEnrollment(
                                      enrollment.uuid,
                                      transition.to_step,
                                      enrollment.user_name,
                                      transition.to_step_name,
                                      transition.is_backward
                                    );
                                  }
                                }}
                                disabled={updateEnrollmentMutation.isPending}
                              >
                                <SelectTrigger className="w-48 h-8 text-xs">
                                  <SelectValue placeholder="Select step..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Forward Transitions */}
                                  {enrollment.available_transitions.filter(t => !t.is_backward).length > 0 && (
                                    <>
                                      {enrollment.available_transitions
                                        .filter(t => !t.is_backward)
                                        .map((transition) => (
                                          <SelectItem key={transition.uuid} value={transition.uuid}>
                                            <div className="flex items-center gap-2">
                                              <ArrowRight className="h-3 w-3 text-green-600" />
                                              <span>{transition.to_step_name}</span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                    </>
                                  )}
                                  
                                  {/* Separator if both types exist */}
                                  {enrollment.available_transitions.some(t => !t.is_backward) && 
                                   enrollment.available_transitions.some(t => t.is_backward) && (
                                    <div className="px-2 py-1">
                                      <div className="border-t border-border"></div>
                                    </div>
                                  )}
                                  
                                  {/* Backward Transitions */}
                                  {enrollment.available_transitions.filter(t => t.is_backward).length > 0 && (
                                    <>
                                      {enrollment.available_transitions
                                        .filter(t => t.is_backward)
                                        .map((transition) => (
                                          <SelectItem key={transition.uuid} value={transition.uuid}>
                                            <div className="flex items-center gap-2">
                                              <RotateCcw className="h-3 w-3 text-orange-600" />
                                              <span>{transition.to_step_name}</span>
                                              <span className="text-xs text-muted-foreground">(back)</span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
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

        <ConfirmationDialog />
      </div>
    </div>
  );
};

export default CustomerManagement;