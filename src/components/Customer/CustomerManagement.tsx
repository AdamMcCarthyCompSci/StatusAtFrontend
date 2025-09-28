import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useEnrollments, useDeleteEnrollment, useFlowsForFiltering, useFlowSteps } from '@/hooks/useEnrollmentQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { ArrowLeft, Users, Search, Trash2, UserCircle, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { EnrollmentListParams } from '@/types/enrollment';

const CustomerManagement = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlow, setSelectedFlow] = useState<string>('');
  const [selectedFlowStep, setSelectedFlowStep] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deleteEnrollmentMutation = useDeleteEnrollment();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Pagination and filter parameters
  const paginationParams: EnrollmentListParams = {
    page: currentPage,
    page_size: pageSize,
    search_user: searchTerm || undefined,
    flow: selectedFlow || undefined,
    current_step: selectedFlowStep || undefined,
  };


  // Auto-select tenant on component mount (same logic as FlowManagement)
  useEffect(() => {
    if (!user?.memberships) return;

    const tenantFromUrl = searchParams.get('tenant');

    if (tenantFromUrl && user.memberships.find(m => m.tenant_uuid === tenantFromUrl)) {
      setSelectedTenant(tenantFromUrl);
      return;
    }

    if (user.memberships.length === 1) {
      const tenantUuid = user.memberships[0].tenant_uuid;
      setSelectedTenant(tenantUuid);
      setSearchParams({ tenant: tenantUuid });
    }
  }, [user?.memberships, searchParams, setSearchParams]);

  // Get current tenant details
  const currentTenant = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);

  // Fetch enrollments for the selected tenant with filters
  const { data: enrollmentsResponse, isLoading, error } = useEnrollments(selectedTenant || '', paginationParams);
  
  // Fetch flows for filtering
  const { data: flows } = useFlowsForFiltering(selectedTenant || '');
  
  // Fetch steps for the selected flow
  const { data: flowSteps } = useFlowSteps(selectedTenant || '', selectedFlow);

  const enrollments = enrollmentsResponse?.results || [];
  const totalCount = enrollmentsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Get available steps for the selected flow
  const availableSteps = flowSteps || [];

  // Reset flow step when flow changes
  useEffect(() => {
    if (selectedFlow && selectedFlowStep) {
      const stepExists = flowSteps?.some(s => s.uuid === selectedFlowStep);
      if (!stepExists) {
        setSelectedFlowStep('');
      }
    }
  }, [selectedFlow, selectedFlowStep, flowSteps]);

  const handleDeleteEnrollment = async (enrollmentUuid: string, customerName: string) => {
    if (!selectedTenant) return;

    const confirmed = await confirm({
      title: `Remove ${customerName}?`,
      description: `${customerName} will be removed from this flow and lose access to their status tracking. This action cannot be undone.`,
      variant: 'destructive',
      confirmText: 'Remove Customer',
    });

    if (confirmed) {
      try {
        await deleteEnrollmentMutation.mutateAsync({ tenantUuid: selectedTenant, enrollmentUuid });
      } catch (error) {
        console.error('Failed to delete enrollment:', error);
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFlow('');
    setSelectedFlowStep('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedFlow || selectedFlowStep;

  if (!user || !user.memberships || user.memberships.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have any memberships to manage customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedTenant || !currentTenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Select Organization</h1>
            <p className="text-muted-foreground">Choose which organization to manage customers for</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {user.memberships.map((membership) => (
              <Card key={membership.uuid} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{membership.tenant_name}</CardTitle>
                  <CardDescription>
                    Role: {membership.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedTenant(membership.tenant_uuid);
                      setSearchParams({ tenant: membership.tenant_uuid });
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Customers
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Customer Management</h1>
              <p className="text-muted-foreground">
                Managing customers for {currentTenant.tenant_name}
              </p>
            </div>
          </div>

          {user?.memberships && user.memberships.length > 1 && (
            <Button variant="outline" onClick={() => setSelectedTenant(null)}>
              Switch Organization
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Search & Filter</CardTitle>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search by user */}
              <div>
                <label htmlFor="search" className="text-sm font-medium mb-2 block">
                  Search customers
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Flow filter */}
              <div>
                <label htmlFor="flow" className="text-sm font-medium mb-2 block">
                  Filter by flow
                </label>
                <Select
                  value={selectedFlow || "all"}
                  onValueChange={(value) => {
                    const flowValue = value === "all" ? "" : value;
                    setSelectedFlow(flowValue);
                    setSelectedFlowStep(''); // Reset step when flow changes
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All flows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All flows</SelectItem>
                    {flows?.map(flow => (
                      <SelectItem key={flow.uuid} value={flow.uuid}>
                        {flow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Flow step filter */}
              <div>
                <label htmlFor="flowStep" className="text-sm font-medium mb-2 block">
                  Filter by step
                </label>
                <Select
                  value={selectedFlowStep || "all"}
                  onValueChange={(value) => {
                    const stepValue = value === "all" ? "" : value;
                    setSelectedFlowStep(stepValue);
                    setCurrentPage(1);
                  }}
                  disabled={!selectedFlow}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedFlow ? "All steps" : "Select flow first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All steps</SelectItem>
                    {availableSteps.map(step => (
                      <SelectItem key={step.uuid} value={step.uuid}>
                        {step.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page size */}
              <div>
                <label htmlFor="pageSize" className="text-sm font-medium mb-2 block">
                  Per page
                </label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Customers</h2>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {enrollments.length} of {totalCount} customers
              </p>
            )}
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading customers...</p>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <p>Failed to load customers. Please try again.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {enrollments && enrollments.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Customers Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {hasActiveFilters 
                      ? "No customers match your current filters."
                      : "There are no customers enrolled in flows yet."
                    }
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {enrollments && enrollments.length > 0 && (
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Flow</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Step</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Enrolled</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.uuid}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground font-semibold">
                              {enrollment.user_name ? enrollment.user_name.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5" />}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground">{enrollment.user_name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{enrollment.user_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{enrollment.flow_name}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">{enrollment.current_step_name}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(enrollment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEnrollment(enrollment.uuid, enrollment.user_name)}
                          disabled={deleteEnrollmentMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <ConfirmationDialog />
    </div>
  );
};

export default CustomerManagement;
