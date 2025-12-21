import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Users,
  Search,
  UserCircle,
  X,
  AlertCircle,
  ChevronRight,
  UserPlus,
  Mail,
  Phone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  useEnrollments,
  useFlowsForFiltering,
  useFlowSteps,
} from '@/hooks/useEnrollmentQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { EnrollmentListParams } from '@/types/enrollment';
import { PAGINATION } from '@/config/constants';
import { inviteApi } from '@/lib/api';
import { logger } from '@/lib/logger';

import { InviteCustomerModal } from './InviteCustomerModal';

const CustomerManagement = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [identifierSearch, setIdentifierSearch] = useState('');
  const [selectedFlow, setSelectedFlow] = useState<string>('');
  const [selectedFlowStep, setSelectedFlowStep] = useState<string>('');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState<string>(''); // '' = all, 'true' = active, 'false' = inactive
  const [selectedDocumentsReady, setSelectedDocumentsReady] =
    useState<string>(''); // '' = all, 'true' = ready, 'false' = not ready
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(
    PAGINATION.DEFAULT_PAGE_SIZE
  );

  // Invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Get selected membership for display
  const selectedMembership = user?.memberships?.find(
    m => m.tenant_uuid === selectedTenant
  );

  // Pagination and filter parameters
  const paginationParams: EnrollmentListParams = {
    page: currentPage,
    page_size: pageSize,
    search_user: searchTerm || undefined,
    identifier: identifierSearch || undefined,
    flow: selectedFlow || undefined,
    current_step: selectedFlowStep || undefined,
    is_active: selectedActiveStatus
      ? selectedActiveStatus === 'true'
      : undefined,
    documents_ready: selectedDocumentsReady
      ? selectedDocumentsReady === 'true'
      : undefined,
  };

  // Fetch data
  const {
    data: enrollmentsResponse,
    isLoading,
    error,
  } = useEnrollments(selectedTenant || '', paginationParams);
  const { data: availableFlows = [], isLoading: flowsLoading } =
    useFlowsForFiltering(selectedTenant || '');
  const { data: availableSteps = [], isLoading: stepsLoading } = useFlowSteps(
    selectedTenant || '',
    selectedFlow
  );

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

  const handleIdentifierSearchChange = (value: string) => {
    setIdentifierSearch(value);
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

  const handleDocumentsReadyChange = (value: string) => {
    const documentsValue = value === 'all' ? '' : value;
    setSelectedDocumentsReady(documentsValue);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setIdentifierSearch('');
    setSelectedFlow('');
    setSelectedFlowStep('');
    setSelectedActiveStatus('');
    setSelectedDocumentsReady('');
    setCurrentPage(1);
  };

  const handleInviteCustomer = async (email: string, flowUuid: string) => {
    if (!selectedTenant) {
      logger.error('No tenant selected');
      return;
    }

    setIsInviting(true);
    setInviteError(null);

    try {
      await inviteApi.createTenantInvite(selectedTenant, {
        email,
        invite_type: 'flow_enrollment',
        flow: flowUuid,
      });

      // Close modal on success
      setIsInviteModalOpen(false);

      // Invalidate enrollments query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['enrollments', selectedTenant],
      });

      logger.info(`Successfully sent invite to ${email}`);
    } catch (error: any) {
      logger.error('Failed to invite customer', error);

      // Handle specific error cases
      if (error?.response?.status === 403) {
        setInviteError(
          error?.response?.data?.detail || t('customers.customerLimitReached')
        );
      } else if (error?.data?.email?.[0]) {
        setInviteError(error.data.email[0]);
      } else if (error?.response?.data?.detail) {
        setInviteError(error.response.data.detail);
      } else {
        setInviteError(t('customers.inviteError'));
      }
    } finally {
      setIsInviting(false);
    }
  };

  const handleOpenInviteModal = () => {
    setInviteError(null);
    setIsInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteError(null);
  };

  // Show error if no tenant is selected
  if (!selectedTenant || !selectedMembership) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button variant="outline" asChild className="w-fit">
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('flows.backToDashboard')}
              </Link>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {t('customers.title')}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {t('customers.manageEnrollments')}
              </p>
            </div>
          </div>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-lg text-destructive">
                    {t('dashboard.selectOrganization')}
                  </CardTitle>
                  <CardDescription>
                    {t('customers.pleaseSelectOrg')}
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
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button variant="outline" asChild className="w-fit">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('flows.backToDashboard')}
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {t('customers.title')}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t('customers.managingFor', {
                tenant: selectedMembership.tenant_name,
              })}
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('customers.filters')}</CardTitle>
            <CardDescription>
              {t('customers.filtersDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              {/* Search by User */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('customers.searchCustomer')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder={t('customers.searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Search by Identifier */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('customers.searchById')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder={t('customers.identifierPlaceholder')}
                    value={identifierSearch}
                    onChange={e => handleIdentifierSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter by Flow */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('flows.flow')}</label>
                <Select
                  value={selectedFlow || 'all'}
                  onValueChange={handleFlowChange}
                  disabled={flowsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('customers.allFlows')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('customers.allFlows')}
                    </SelectItem>
                    {availableFlows.map(flow => (
                      <SelectItem key={flow.uuid} value={flow.uuid}>
                        {flow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Flow Step */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('customers.currentStep')}
                </label>
                <Select
                  value={selectedFlowStep || 'all'}
                  onValueChange={handleFlowStepChange}
                  disabled={!selectedFlow || stepsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('customers.allSteps')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('customers.allSteps')}
                    </SelectItem>
                    {availableSteps.map(step => (
                      <SelectItem key={step.uuid} value={step.uuid}>
                        {step.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Active Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('common.status')}
                </label>
                <Select
                  value={selectedActiveStatus || 'all'}
                  onValueChange={handleActiveStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('customers.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('customers.allStatuses')}
                    </SelectItem>
                    <SelectItem value="true">
                      {t('customers.activeOnly')}
                    </SelectItem>
                    <SelectItem value="false">
                      {t('customers.inactiveOnly')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Documents Ready */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('customers.documentsReady')}
                </label>
                <Select
                  value={selectedDocumentsReady || 'all'}
                  onValueChange={handleDocumentsReadyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('customers.allDocuments')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('customers.allDocuments')}
                    </SelectItem>
                    <SelectItem value="true">
                      {t('customers.documentsReadyYes')}
                    </SelectItem>
                    <SelectItem value="false">
                      {t('customers.documentsReadyNo')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Page Size Control */}
            <div className="flex items-center justify-end gap-2">
              <label className="text-sm text-muted-foreground">
                {t('customers.show')}:
              </label>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">
                    {t('customers.perPage', { count: 5 })}
                  </SelectItem>
                  <SelectItem value="10">
                    {t('customers.perPage', { count: 10 })}
                  </SelectItem>
                  <SelectItem value="20">
                    {t('customers.perPage', { count: 20 })}
                  </SelectItem>
                  <SelectItem value="50">
                    {t('customers.perPage', { count: 50 })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(searchTerm ||
              identifierSearch ||
              selectedFlow ||
              selectedFlowStep ||
              selectedActiveStatus ||
              selectedDocumentsReady) && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-muted-foreground">
                  {t('customers.activeFilters')}:
                </span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    {t('customers.searchLabel')}: {searchTerm}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleSearchChange('')}
                    />
                  </Badge>
                )}
                {identifierSearch && (
                  <Badge variant="secondary" className="gap-1">
                    {t('customers.idLabel')}: {identifierSearch}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleIdentifierSearchChange('')}
                    />
                  </Badge>
                )}
                {selectedFlow && (
                  <Badge variant="secondary" className="gap-1">
                    {t('customers.flowLabel')}:{' '}
                    {availableFlows.find(f => f.uuid === selectedFlow)?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFlowChange('all')}
                    />
                  </Badge>
                )}
                {selectedFlowStep && (
                  <Badge variant="secondary" className="gap-1">
                    {t('customers.stepLabel')}:{' '}
                    {
                      availableSteps.find(s => s.uuid === selectedFlowStep)
                        ?.name
                    }
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFlowStepChange('all')}
                    />
                  </Badge>
                )}
                {selectedActiveStatus && (
                  <Badge variant="secondary" className="gap-1">
                    {t('customers.statusLabel')}:{' '}
                    {selectedActiveStatus === 'true'
                      ? t('customers.active')
                      : t('customers.inactive')}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleActiveStatusChange('all')}
                    />
                  </Badge>
                )}
                {selectedDocumentsReady && (
                  <Badge variant="secondary" className="gap-1">
                    {t('customers.documentsReady')}:{' '}
                    {selectedDocumentsReady === 'true'
                      ? t('customers.documentsReadyYes')
                      : t('customers.documentsReadyNo')}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleDocumentsReadyChange('all')}
                    />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  {t('customers.clearAll')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <span className="ml-2">{t('customers.loadingCustomers')}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{t('customers.loadError')}</span>
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
                    {t('customers.customersCount', { count: totalCount })}
                  </h2>
                  <Button
                    onClick={handleOpenInviteModal}
                    className="bg-gradient-brand-subtle flex items-center gap-2 text-white hover:opacity-90"
                  >
                    <UserPlus className="h-4 w-4" />
                    {t('customers.inviteCustomer')}
                  </Button>
                </div>

                {/* Column Headers */}
                <Card className="bg-muted/30">
                  <CardHeader className="py-3">
                    <div className="flex items-center gap-6">
                      {/* Customer Header */}
                      <div
                        className="flex min-w-0 flex-shrink-0 items-center gap-3"
                        style={{ width: '300px' }}
                      >
                        <div style={{ width: '40px' }} />{' '}
                        {/* Spacer for icon */}
                        <span className="text-sm font-medium text-muted-foreground">
                          {t('customers.customer')}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-4 w-px flex-shrink-0 bg-border" />

                      {/* Flow Header */}
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          {t('flows.flow')}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-4 w-px flex-shrink-0 bg-border" />

                      {/* Status Headers */}
                      <div className="flex flex-shrink-0 items-center gap-4">
                        <div style={{ minWidth: '120px', textAlign: 'center' }}>
                          <span className="text-sm font-medium text-muted-foreground">
                            {t('customers.currentStep')}
                          </span>
                        </div>
                        <div className="h-4 w-px flex-shrink-0 bg-border" />
                        <div style={{ minWidth: '80px' }}>
                          <span className="text-sm font-medium text-muted-foreground">
                            {t('common.status')}
                          </span>
                        </div>
                        <div style={{ width: '20px' }} />{' '}
                        {/* Spacer for chevron */}
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid gap-4">
                  {enrollments.map(enrollment => (
                    <Card
                      key={enrollment.uuid}
                      className="group cursor-pointer transition-all hover:border-accent/50 hover:shadow-lg"
                      onClick={() => navigate(`/customers/${enrollment.uuid}`)}
                    >
                      <CardHeader className="overflow-hidden">
                        <div className="flex items-center gap-6">
                          {/* Customer Info - Left */}
                          <div
                            className="flex min-w-0 flex-shrink-0 items-center gap-3"
                            style={{ width: '300px' }}
                          >
                            <UserCircle className="h-10 w-10 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                            <div className="min-w-0 flex-1">
                              <CardTitle className="truncate text-lg transition-colors group-hover:text-accent">
                                {enrollment.user_name}
                              </CardTitle>
                              <CardDescription className="space-y-0.5">
                                <div className="flex items-center gap-1.5 truncate">
                                  <Mail className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {enrollment.user_email}
                                  </span>
                                </div>
                                {enrollment.user_whatsapp_full_number && (
                                  <div className="flex items-center gap-1.5 truncate">
                                    <Phone className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">
                                      {enrollment.user_whatsapp_full_number}
                                    </span>
                                  </div>
                                )}
                              </CardDescription>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="h-12 w-px flex-shrink-0 bg-border" />

                          {/* Flow Name - Center */}
                          <div
                            className="min-w-0 flex-1"
                            style={{ maxWidth: '400px' }}
                          >
                            <div
                              className="truncate text-xl font-bold"
                              title={enrollment.flow_name}
                            >
                              {enrollment.flow_name}
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="h-12 w-px flex-shrink-0 bg-border" />

                          {/* Status Info - Right */}
                          <div className="flex flex-shrink-0 items-center gap-4">
                            {/* Current Step */}
                            <div
                              className="truncate text-center text-sm font-medium"
                              style={{ minWidth: '120px', maxWidth: '120px' }}
                              title={enrollment.current_step_name}
                            >
                              {enrollment.current_step_name}
                            </div>

                            {/* Divider */}
                            {enrollment.is_active !== undefined && (
                              <div className="h-12 w-px flex-shrink-0 bg-border" />
                            )}

                            {/* Active Status */}
                            {enrollment.is_active !== undefined && (
                              <div
                                className="flex items-center gap-2"
                                style={{ minWidth: '80px' }}
                              >
                                <div
                                  className={`h-2 w-2 rounded-full ${enrollment.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
                                />
                                <span className="whitespace-nowrap text-sm font-medium">
                                  {enrollment.is_active
                                    ? t('customers.active')
                                    : t('customers.inactive')}
                                </span>
                              </div>
                            )}

                            <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <div className="flex flex-col gap-1">
                            <span>
                              {t('customers.enrolled')}:{' '}
                              {new Date(
                                enrollment.created_at
                              ).toLocaleDateString()}
                            </span>
                            {enrollment.identifier && (
                              <span>
                                {t('customers.idLabel')}:{' '}
                                {enrollment.identifier}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {t('customers.showing', {
                        from: (currentPage - 1) * pageSize + 1,
                        to: Math.min(currentPage * pageSize, totalCount),
                        total: totalCount,
                      })}
                    </div>
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

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
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
                          }
                        )}

                        {totalPages > 5 && <PaginationEllipsis />}

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
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="py-8 text-center">
                    <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">
                      {t('customers.noCustomersFound')}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm ||
                      identifierSearch ||
                      selectedFlow ||
                      selectedFlowStep ||
                      selectedActiveStatus ||
                      selectedDocumentsReady
                        ? t('customers.noMatchingFilters')
                        : t('customers.noEnrollments')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Invite Customer Modal */}
        <InviteCustomerModal
          isOpen={isInviteModalOpen}
          onClose={handleCloseInviteModal}
          onInvite={handleInviteCustomer}
          availableFlows={availableFlows}
          isInviting={isInviting}
          error={inviteError}
        />
      </div>
    </div>
  );
};

export default CustomerManagement;
