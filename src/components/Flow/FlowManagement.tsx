import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useFlows, useDeleteFlow } from '@/hooks/useFlowQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import CreateFlowDialog from './CreateFlowDialog';
import { ArrowLeft, Package, Trash2, Edit, Search, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FlowListParams } from '@/types/flow';

const FlowManagement = () => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deleteFlowMutation = useDeleteFlow();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Get selected membership for display
  const selectedMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);

  // Pagination parameters
  const paginationParams: FlowListParams = {
    page: currentPage,
    page_size: pageSize,
    search: searchTerm || undefined,
  };
  
  // Fetch flows for the selected tenant with pagination
  const { data: flowsResponse, isLoading, error } = useFlows(selectedTenant || '', paginationParams);
  
  const flows = flowsResponse?.results || [];
  const totalCount = flowsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDeleteFlow = async (flowUuid: string, flowName: string) => {
    if (!selectedTenant) return;
    
    const confirmed = await confirm({
      title: `Delete "${flowName}"?`,
      description: 'This flow and all its associated data will be permanently deleted. This action cannot be undone.',
      variant: 'destructive',
      confirmText: 'Delete Flow',
    });

    if (confirmed) {
      try {
        await deleteFlowMutation.mutateAsync({ tenantUuid: selectedTenant, flowUuid });
      } catch (error) {
        console.error('Failed to delete flow:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
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
              <h1 className="text-3xl font-bold">Flow Management</h1>
              <p className="text-muted-foreground">Manage your status tracking workflows</p>
            </div>
          </div>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-lg text-destructive">No Organization Selected</CardTitle>
                  <CardDescription>
                    Please select an organization from the menu to manage flows.
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
            <h1 className="text-3xl font-bold">Flow Management</h1>
            <p className="text-muted-foreground">
              Managing flows for {selectedMembership.tenant_name}
            </p>
          </div>
        </div>

        {/* Create Button */}
        <div className="flex justify-end">
          <CreateFlowDialog tenantUuid={selectedTenant} tenantName={selectedMembership.tenant_name} />
        </div>

        {/* Search and Pagination Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search flows..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
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
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading flows...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to load flows. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flows List */}
        {!isLoading && !error && (
          <>
            {flows.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Flows ({totalCount})
                  </h2>
                </div>

                <div className="grid gap-4">
                  {flows.map((flow) => (
                    <Card key={flow.uuid} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              {flow.name}
                            </CardTitle>
                            <CardDescription>
                              Created: {flow.created_at ? new Date(flow.created_at).toLocaleDateString() : 'Unknown'}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/flows/${flow.uuid}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFlow(flow.uuid, flow.name)}
                              disabled={deleteFlowMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} flows
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
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Flows Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm 
                        ? `No flows match "${searchTerm}". Try adjusting your search.`
                        : "You haven't created any flows yet."
                      }
                    </p>
                    {!searchTerm && <CreateFlowDialog tenantUuid={selectedTenant} tenantName={selectedMembership.tenant_name} />}
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

export default FlowManagement;