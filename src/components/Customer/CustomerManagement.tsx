import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Users,
  Search,
  UserCircle,
  X,
  AlertCircle,
  AlertTriangle,
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
import { useTenantByUuid } from '@/hooks/useTenantQuery';
import { EnrollmentListParams } from '@/types/enrollment';
import { PAGINATION } from '@/config/constants';
import { inviteApi } from '@/lib/api';
import { logger } from '@/lib/logger';
import { isTierLimitError, getTierLimitMessage } from '@/lib/tierLimitError';

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

  // Fetch tenant data for limit checking
  const { data: tenantData } = useTenantByUuid(selectedTenant || '');
  const isCaseLimitReached =
    tenantData?.active_cases_limit != null &&
    tenantData?.active_cases_count != null &&
    tenantData.active_cases_count >= tenantData.active_cases_limit;

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

      if (isTierLimitError(error)) {
        setInviteError(
          getTierLimitMessage(error, t('customers.customerLimitReached'))
        );
      } else if (error?.data?.email?.[0]) {
        setInviteError(error.data.email[0]);
      } else if (error?.data?.detail) {
        setInviteError(error.data.detail);
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
    <div className="min-h-screen overflow-x-hidden bg-background px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
            <div className="flex flex-col items-start justify-start gap-2 sm:flex-row sm:items-center sm:justify-end">
              <label className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
                {t('customers.show')}:
              </label>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-full sm:w-32">
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
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
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

        {/* Customer Limit Warning Banner */}
        {isCaseLimitReached && (
          <Card className="border-amber-500/20 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-400">
                      {t('customers.customerLimitReachedTitle')}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500">
                      {t('customers.customerLimitReachedDescription', {
                        limit: tenantData?.active_cases_limit,
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full shrink-0 border-amber-500/30 text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-950/40 sm:w-auto"
                >
                  <Link to="/organization-settings">
                    {t('customers.upgradePlan')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customers List */}
        {!isLoading && !error && (
          <>
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    {t('customers.customersCount', { count: totalCount })}
                  </h2>
                  <Button
                    onClick={handleOpenInviteModal}
                    disabled={isCaseLimitReached}
                    className="bg-gradient-brand-subtle flex w-full items-center justify-center gap-2 text-white hover:opacity-90 sm:w-auto"
                  >
                    <UserPlus className="h-4 w-4" />
                    {t('customers.inviteCustomer')}
                  </Button>
                </div>

                {/* Column Headers - Hidden on mobile */}
                <Card className="hidden bg-muted/30 lg:block">
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

                <div className="grid w-full gap-4">
                  {enrollments.map(enrollment => (
                    <Card
                      key={enrollment.uuid}
                      className="group w-full cursor-pointer overflow-hidden transition-all hover:border-accent/50 hover:shadow-lg"
                      onClick={() => navigate(`/customers/${enrollment.uuid}`)}
                    >
                      {/* Desktop Layout (lg+) */}
                      <CardHeader className="hidden overflow-hidden lg:block">
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

                      {/* Mobile Layout (<lg) */}
                      <CardHeader className="p-3 sm:p-6 lg:hidden">
                        <div className="flex w-full min-w-0 flex-col gap-3">
                          {/* Customer Info */}
                          <div className="flex min-w-0 items-start gap-2 sm:gap-3">
                            <UserCircle className="h-8 w-8 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-accent sm:h-10 sm:w-10" />
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <CardTitle className="break-words text-base transition-colors group-hover:text-accent sm:text-lg">
                                {enrollment.user_name}
                              </CardTitle>
                              <CardDescription className="space-y-1 text-xs sm:text-sm">
                                <div className="flex min-w-0 items-center gap-1.5">
                                  <Mail className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {enrollment.user_email}
                                  </span>
                                </div>
                                {enrollment.user_whatsapp_full_number && (
                                  <div className="flex min-w-0 items-center gap-1.5">
                                    <Phone className="h-3 w-3 flex-shrink-0" />
                                    <span className="break-all">
                                      {enrollment.user_whatsapp_full_number}
                                    </span>
                                  </div>
                                )}
                              </CardDescription>
                            </div>
                            <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          </div>

                          {/* Flow and Status Info */}
                          <div className="flex min-w-0 flex-col gap-2 overflow-hidden text-sm">
                            <div className="min-w-0">
                              <span className="text-xs text-muted-foreground">
                                {t('flows.flow')}:
                              </span>
                              <div className="break-words font-semibold">
                                {enrollment.flow_name}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <div className="min-w-0">
                                <span className="text-xs text-muted-foreground">
                                  {t('customers.currentStep')}:
                                </span>
                                <div className="font-medium">
                                  {enrollment.current_step_name}
                                </div>
                              </div>
                              {enrollment.is_active !== undefined && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-2 w-2 rounded-full ${enrollment.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
                                  />
                                  <span className="text-xs font-medium">
                                    {enrollment.is_active
                                      ? t('customers.active')
                                      : t('customers.inactive')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-3 lg:pt-6">
                        <div className="flex items-center overflow-hidden text-xs text-muted-foreground">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                            <span>
                              {t('customers.enrolled')}:{' '}
                              {new Date(
                                enrollment.created_at
                              ).toLocaleDateString()}
                            </span>
                            {enrollment.identifier && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span>
                                  {t('customers.idLabel')}:{' '}
                                  {enrollment.identifier}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
                      {t('customers.showing', {
                        from: (currentPage - 1) * pageSize + 1,
                        to: Math.min(currentPage * pageSize, totalCount),
                        total: totalCount,
                      })}
                    </div>
                    <Pagination className="justify-center sm:justify-end">
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
