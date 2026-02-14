import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Package,
  Trash2,
  Edit,
  Search,
  AlertCircle,
  UserPlus,
  Printer,
  Copy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useFlows, useDeleteFlow } from '@/hooks/useFlowQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { FlowListParams } from '@/types/flow';
import { CreateFlowEnrollmentInviteRequest } from '@/types/message';
import { inviteApi } from '@/lib/api';
import { logger } from '@/lib/logger';
import { formatRelativeTime } from '@/lib/utils';
import { PAGINATION } from '@/config/constants';

import CreateFlowDialog from './CreateFlowDialog';

const FlowManagement = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(
    PAGINATION.DEFAULT_PAGE_SIZE
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedFlowForInvite, setSelectedFlowForInvite] = useState<{
    uuid: string;
    name: string;
  } | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const deleteFlowMutation = useDeleteFlow();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Get selected membership for display
  const selectedMembership = user?.memberships?.find(
    m => m.tenant_uuid === selectedTenant
  );

  // Pagination parameters
  const paginationParams: FlowListParams = {
    page: currentPage,
    page_size: pageSize,
    search: searchTerm || undefined,
  };

  // Fetch flows for the selected tenant with pagination
  const {
    data: flowsResponse,
    isLoading,
    error,
  } = useFlows(selectedTenant || '', paginationParams);

  const flows = flowsResponse?.results || [];
  const totalCount = flowsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDeleteFlow = async (flowUuid: string, flowName: string) => {
    if (!selectedTenant) return;

    const confirmed = await confirm({
      title: `Delete "${flowName}"?`,
      description:
        'This flow and all its associated data will be permanently deleted. This action cannot be undone.',
      variant: 'destructive',
      confirmText: 'Delete Flow',
    });

    if (confirmed) {
      try {
        await deleteFlowMutation.mutateAsync({
          tenantUuid: selectedTenant,
          flowUuid,
        });
      } catch (error) {
        logger.error('Failed to delete flow:', error);
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

  const handleInviteToFlow = (flowUuid: string, flowName: string) => {
    setSelectedFlowForInvite({ uuid: flowUuid, name: flowName });
    setIsInviteModalOpen(true);
    setInviteError(null);
  };

  const handleSendFlowInvite = async (email: string) => {
    if (!selectedTenant || !selectedFlowForInvite) return;

    setIsInviting(true);
    setInviteError(null);

    try {
      const inviteData: CreateFlowEnrollmentInviteRequest = {
        email,
        invite_type: 'flow_enrollment',
        flow: selectedFlowForInvite.uuid,
      };

      await inviteApi.createTenantInvite(selectedTenant, inviteData);
      setIsInviteModalOpen(false);
      setSelectedFlowForInvite(null);
      setInviteError(null);
    } catch (error: any) {
      logger.error('Failed to send flow invite:', error);

      // Handle 403 errors from backend (tier restrictions)
      if (error?.response?.status === 403) {
        const message =
          error?.response?.data?.detail ||
          'Your plan has reached its limit. Please upgrade to invite more users.';
        setInviteError(message);
      }
      // Extract email error from response
      else if (error?.data?.email?.[0]) {
        setInviteError(error.data.email[0]);
      } else {
        setInviteError('An error occurred. Please try again.');
      }
    } finally {
      setIsInviting(false);
    }
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setSelectedFlowForInvite(null);
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
                {t('flows.flowManagement')}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {t('flows.manageWorkflows')}
              </p>
            </div>
          </div>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-lg text-destructive">
                    {t('flows.noOrgSelected')}
                  </CardTitle>
                  <CardDescription>
                    {t('flows.selectOrgPrompt')}
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
              {t('flows.flowManagement')}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t('flows.managingFor', {
                tenant: selectedMembership.tenant_name,
              })}
            </p>
          </div>
        </div>

        {/* Search and Pagination Controls */}
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex w-full flex-1 flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder={t('flows.searchFlows')}
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">
                  {t('flows.perPage', { count: 5 })}
                </SelectItem>
                <SelectItem value="10">
                  {t('flows.perPage', { count: 10 })}
                </SelectItem>
                <SelectItem value="20">
                  {t('flows.perPage', { count: 20 })}
                </SelectItem>
                <SelectItem value="50">
                  {t('flows.perPage', { count: 50 })}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <span className="ml-2">{t('flows.loadingFlows')}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{t('flows.errorLoadingFlows')}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flows List */}
        {!isLoading && !error && (
          <>
            {flows.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    {t('flows.title')} ({totalCount})
                  </h2>
                  <CreateFlowDialog
                    tenantUuid={selectedTenant}
                    tenantName={selectedMembership.tenant_name}
                  />
                </div>

                <div className="grid w-full gap-4">
                  {flows.map(flow => (
                    <Card
                      key={flow.uuid}
                      className="group w-full overflow-hidden transition-all hover:border-accent/30 hover:shadow-lg"
                    >
                      <CardHeader className="overflow-hidden p-3 sm:p-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                          {/* Flow Title */}
                          <div className="min-w-0 flex-1">
                            <CardTitle
                              className="flex items-center gap-2 break-words text-base transition-colors group-hover:text-accent sm:text-lg"
                              title={flow.name}
                            >
                              <Package className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                              <span className="min-w-0 flex-1">
                                {flow.name}
                              </span>
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs sm:text-sm">
                              Created: {formatRelativeTime(flow.created)}
                            </CardDescription>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-center transition-colors hover:border-accent hover:bg-accent hover:text-white sm:w-auto"
                              asChild
                            >
                              <Link to={`/flows/${flow.uuid}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('flows.edit')}
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-center transition-colors hover:border-accent hover:bg-accent hover:text-white sm:w-auto"
                              onClick={() =>
                                handleInviteToFlow(flow.uuid, flow.name)
                              }
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span className="truncate">
                                {t('flows.inviteToFlow')}
                              </span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full justify-center sm:w-auto"
                              onClick={() =>
                                handleDeleteFlow(flow.uuid, flow.name)
                              }
                              disabled={deleteFlowMutation.isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('flows.delete')}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
                      {t('flows.showing')} {(currentPage - 1) * pageSize + 1}{' '}
                      {t('flows.of')}{' '}
                      {Math.min(currentPage * pageSize, totalCount)}{' '}
                      {t('flows.of')} {totalCount}{' '}
                      {t('flows.flowsCount', { count: totalCount })}
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
                    <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">
                      {t('flows.noFlowsFound')}
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      {searchTerm
                        ? t('flows.tryDifferentSearch')
                        : t('flows.noFlows')}
                    </p>
                    {!searchTerm && (
                      <CreateFlowDialog
                        tenantUuid={selectedTenant}
                        tenantName={selectedMembership.tenant_name}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <ConfirmationDialog />

        {/* Flow Invite Modal */}
        <FlowInviteModal
          isOpen={isInviteModalOpen}
          onClose={handleCloseInviteModal}
          onInvite={handleSendFlowInvite}
          flowName={selectedFlowForInvite?.name || ''}
          flowUuid={selectedFlowForInvite?.uuid || ''}
          tenantName={selectedMembership?.tenant_name || ''}
          isLoading={isInviting}
          error={inviteError}
          onClearError={() => setInviteError(null)}
        />
      </div>
    </div>
  );
};

// Flow Invite Modal Component
interface FlowInviteModalProps {
  isOpen: boolean;
  onClose: () => void;

  onInvite: (email: string) => void;
  flowName: string;
  flowUuid: string;
  tenantName: string;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const FlowInviteModal = ({
  isOpen,
  onClose,
  onInvite,
  flowName,
  flowUuid,
  tenantName,
  isLoading,
  error,
  onClearError,
}: FlowInviteModalProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'email' | 'qr'>('email');

  // Generate QR code when modal opens
  useEffect(() => {
    if (isOpen && flowUuid && tenantName && flowName) {
      // Ensure we have a proper HTTPS URL for mobile scanning
      const frontendUrl = window.location.origin;
      // URL encode the tenant name and flow name for proper handling
      const encodedTenantName = encodeURIComponent(tenantName);
      const encodedFlowName = encodeURIComponent(flowName);
      // Point to the flow invite landing page
      const url = `${frontendUrl}/invite/${encodedTenantName}/${encodedFlowName}`;
      setInviteUrl(url);

      QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        // Add error correction level for better mobile scanning
        errorCorrectionLevel: 'M',
      })
        .then(setQrCodeDataUrl)
        .catch(err => logger.error('Failed to generate QR code:', err));
    }
  }, [isOpen, flowUuid, tenantName, flowName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite(email.trim());
    }
  };

  const handleClose = () => {
    setEmail('');
    setActiveTab('email');
    onClose();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      onClearError();
    }
  };

  const handlePrintQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Flow Invitation QR Code</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .container { 
                max-width: 400px; 
                margin: 0 auto; 
              }
              .qr-code { 
                margin: 20px 0; 
                border: 1px solid #ccc;
                padding: 10px;
                display: inline-block;
              }
              .title { 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 10px; 
              }
              .subtitle { 
                font-size: 16px; 
                color: #666; 
                margin-bottom: 20px; 
              }
              .url { 
                font-size: 12px; 
                color: #999; 
                word-break: break-all; 
                margin-top: 20px;
              }
              .tip {
                font-size: 11px;
                color: #888;
                margin-top: 15px;
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="title">Join ${flowName}</div>
              <div class="subtitle">Scan this QR code to join the flow</div>
              <div class="qr-code">
                <img src="${qrCodeDataUrl}" alt="QR Code" />
              </div>
              <div class="url">${inviteUrl}</div>
              <div class="tip">
                <strong>Mobile Tip:</strong> Use your phone's camera app. 
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      // You could add a toast notification here
    } catch (err) {
      logger.error('Failed to copy URL:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t('flows.inviteToFlow')}</CardTitle>
          <CardDescription>
            {t('flows.inviteOthersTo', { flowName })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="mb-6 flex space-x-1 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'email'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('flows.emailInvite')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'qr'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('flows.qrCode')}
            </button>
          </div>

          {/* Email Tab */}
          {activeTab === 'email' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('flows.enterEmailAddress')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t('flows.enterEmailAddress')}
                  required
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  {t('flows.cancel')}
                </Button>
                <Button type="submit" disabled={isLoading || !email.trim()}>
                  {isLoading ? t('flows.sending') : t('flows.sendInvite')}
                </Button>
              </div>
            </form>
          )}

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mb-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    {t('flows.scanQrCode')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('flows.scanQrCodeDesc')}
                  </p>
                  <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>Mobile Tip:</strong> Use your phone's camera app
                      or a QR scanner app.
                    </p>
                  </div>
                </div>

                {qrCodeDataUrl && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="rounded-lg border bg-white p-4">
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Code"
                        className="h-48 w-48"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handlePrintQRCode}
                        variant="outline"
                        size="sm"
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        {t('flows.qrCode')}
                      </Button>
                      <Button
                        onClick={handleCopyUrl}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t('flows.copyUrl')}
                      </Button>
                    </div>

                    <div className="break-all rounded bg-muted p-2 text-xs text-muted-foreground">
                      {inviteUrl}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={handleClose}>
                  {t('flows.close')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowManagement;
