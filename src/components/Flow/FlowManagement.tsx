import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useFlows, useDeleteFlow } from '@/hooks/useFlowQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import CreateFlowDialog from './CreateFlowDialog';
import { ArrowLeft, Package, Settings, Trash2, Edit, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { FlowListParams } from '@/types/flow';

const FlowManagement = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deleteFlowMutation = useDeleteFlow();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Pagination parameters
  const paginationParams: FlowListParams = {
    page: currentPage,
    page_size: pageSize,
    search: searchTerm || undefined,
  };

  // Auto-select tenant on component mount
  useEffect(() => {
    if (!user?.memberships) return;

    // Check if tenant is specified in URL params
    const tenantFromUrl = searchParams.get('tenant');
    
    if (tenantFromUrl && user.memberships.find(m => m.tenant_uuid === tenantFromUrl)) {
      setSelectedTenant(tenantFromUrl);
      return;
    }

    // If user has only one membership, auto-select it
    if (user.memberships.length === 1) {
      const tenantUuid = user.memberships[0].tenant_uuid;
      setSelectedTenant(tenantUuid);
      setSearchParams({ tenant: tenantUuid });
    }
  }, [user?.memberships, searchParams, setSearchParams]);

  // Get the selected tenant details
  const currentTenant = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);
  
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

  // If no tenant selected, show tenant selection
  if (!selectedTenant || !currentTenant) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Flow Management</h1>
              <p className="text-muted-foreground">Select an organization to manage flows</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {user?.memberships?.map((membership) => (
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
                    <Package className="h-4 w-4 mr-2" />
                    Manage Flows
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Flow Management</h1>
              <p className="text-muted-foreground">
                Managing flows for {currentTenant.tenant_name}
              </p>
            </div>
          </div>
          
          {user?.memberships && user.memberships.length > 1 && (
            <Button variant="outline" onClick={() => setSelectedTenant(null)}>
              Switch Organization
            </Button>
          )}
        </div>

        {/* Create Flow Section */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Flow</CardTitle>
            <CardDescription>
              Set up a new status tracking workflow for your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateFlowDialog
              tenantUuid={selectedTenant}
              tenantName={currentTenant.tenant_name}
              onSuccess={() => {
                // Flow list will automatically refresh due to React Query
              }}
            />
          </CardContent>
        </Card>

                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label htmlFor="search" className="text-sm font-medium mb-2 block">
                          Search flows
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="search"
                            placeholder="Search by flow name..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setCurrentPage(1); // Reset to first page on search
                            }}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="w-32">
                        <label htmlFor="pageSize" className="text-sm font-medium mb-2 block">
                          Per page
                        </label>
                        <Select
                          value={pageSize.toString()}
                          onValueChange={(value) => {
                            setPageSize(parseInt(value));
                            setCurrentPage(1); // Reset to first page on page size change
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

                {/* Flows List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Existing Flows</h2>
                    {totalCount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Showing {flows.length} of {totalCount} flows
                      </p>
                    )}
                  </div>
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading flows...</p>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <p>Failed to load flows. Please try again.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {flows && flows.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Flows Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first status flow to start tracking customer progress
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {flows && flows.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flows.map((flow) => (
                <Card key={flow.uuid} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{flow.name}</CardTitle>
                        <CardDescription>
                          {flow.tenant_name}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Created: {flow.created_at ? new Date(flow.created_at).toLocaleDateString() : 'Unknown'}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-1" />
                        Steps
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteFlow(flow.uuid, flow.name)}
                        disabled={deleteFlowMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                      ))}
                    </div>
                  )}

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
                          
                          {/* Page numbers */}
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
              </div>
              <ConfirmationDialog />
            </div>
          );
        };

        export default FlowManagement;
