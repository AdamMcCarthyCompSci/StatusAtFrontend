import { useState, useEffect } from 'react';
import {
  Mail,
  X,
  UserPlus,
  AlertCircle,
  QrCode,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import QRCodeLib from 'qrcode';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Flow } from '@/types/flow';
import { useTenantByUuid } from '@/hooks/useTenantQuery';
import { useTenantStore } from '@/stores/useTenantStore';

interface InviteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onInvite: (email: string, flowUuid: string) => Promise<void>;
  availableFlows: Flow[];
  isInviting: boolean;
  error: string | null;
  preSelectedFlowUuid?: string; // Optional pre-selected flow (e.g., from flow management page)
}

export const InviteCustomerModal = ({
  isOpen,
  onClose,
  onInvite,
  availableFlows,
  isInviting,
  error,
  preSelectedFlowUuid,
}: InviteCustomerModalProps) => {
  const { t } = useTranslation();
  const { selectedTenant } = useTenantStore();
  const { data: tenant } = useTenantByUuid(selectedTenant || '');
  const [email, setEmail] = useState('');
  const [selectedFlowUuid, setSelectedFlowUuid] = useState<string>(
    preSelectedFlowUuid || ''
  );
  const [activeTab, setActiveTab] = useState<'email' | 'qr'>('email');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Update selectedFlowUuid when preSelectedFlowUuid changes
  useEffect(() => {
    if (preSelectedFlowUuid) {
      setSelectedFlowUuid(preSelectedFlowUuid);
    }
  }, [preSelectedFlowUuid]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      if (!preSelectedFlowUuid) {
        setSelectedFlowUuid('');
      }
      setActiveTab('email');
      setQrCodeDataUrl('');
      setCopied(false);
    }
  }, [isOpen, preSelectedFlowUuid]);

  // Generate QR code when flow is selected
  useEffect(() => {
    const generateQRCode = async () => {
      if (selectedFlowUuid && tenant) {
        const selectedFlow = availableFlows.find(
          f => f.uuid === selectedFlowUuid
        );
        if (selectedFlow) {
          const inviteUrl = `${window.location.origin}/invite/${tenant.name}/${selectedFlow.name}`;
          try {
            const dataUrl = await QRCodeLib.toDataURL(inviteUrl, {
              width: 300,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF',
              },
            });
            setQrCodeDataUrl(dataUrl);
          } catch (err) {
            console.error('Error generating QR code:', err);
          }
        }
      }
    };

    generateQRCode();
  }, [selectedFlowUuid, tenant, availableFlows]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedFlowUuid || isInviting) return;

    await onInvite(email, selectedFlowUuid);
  };

  const handleClose = () => {
    setEmail('');
    if (!preSelectedFlowUuid) {
      setSelectedFlowUuid('');
    }
    setActiveTab('email');
    setQrCodeDataUrl('');
    setCopied(false);
    onClose();
  };

  const handleDownloadQR = () => {
    const selectedFlow = availableFlows.find(f => f.uuid === selectedFlowUuid);
    if (!qrCodeDataUrl || !selectedFlow) return;

    const link = document.createElement('a');
    link.download = `${selectedFlow.name}-qr-code.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleCopyLink = async () => {
    const selectedFlow = availableFlows.find(f => f.uuid === selectedFlowUuid);
    if (!selectedFlow || !tenant) return;

    const inviteUrl = `${window.location.origin}/invite/${tenant.name}/${selectedFlow.name}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isFormValid = email && selectedFlowUuid;
  const selectedFlow = availableFlows.find(f => f.uuid === selectedFlowUuid);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-lg bg-background p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">
              {t('customers.inviteCustomer')}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as 'email' | 'qr')}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" />
              {t('customers.emailInvite')}
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="mr-2 h-4 w-4" />
              {t('customers.qrCode')}
            </TabsTrigger>
          </TabsList>

          {/* Email Invite Tab */}
          <TabsContent value="email" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Display */}
              {error && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  {t('customers.customerEmail')}{' '}
                  <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('customers.emailPlaceholder')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isInviting}
                  />
                </div>
              </div>

              {/* Flow Selection */}
              <div>
                <label
                  htmlFor="flow"
                  className="mb-2 block text-sm font-medium"
                >
                  {t('flows.flow')} <span className="text-destructive">*</span>
                </label>
                <Select
                  value={selectedFlowUuid}
                  onValueChange={setSelectedFlowUuid}
                  disabled={isInviting}
                >
                  <SelectTrigger id="flow">
                    <SelectValue placeholder={t('customers.selectFlow')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFlows.map(flow => (
                      <SelectItem key={flow.uuid} value={flow.uuid}>
                        {flow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFlow && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t('customers.customerWillBeEnrolled', {
                      flowName: selectedFlow.name,
                    })}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isInviting}
                >
                  <X className="mr-2 h-4 w-4" />
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={!isFormValid || isInviting}>
                  {isInviting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      {t('customers.sending')}
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      {t('customers.sendInvitation')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-4">
            {/* Flow Selection */}
            <div>
              <label
                htmlFor="qr-flow"
                className="mb-2 block text-sm font-medium"
              >
                {t('flows.flow')} <span className="text-destructive">*</span>
              </label>
              <Select
                value={selectedFlowUuid}
                onValueChange={setSelectedFlowUuid}
                disabled={!!preSelectedFlowUuid}
              >
                <SelectTrigger id="qr-flow">
                  <SelectValue placeholder={t('customers.selectFlow')} />
                </SelectTrigger>
                <SelectContent>
                  {availableFlows.map(flow => (
                    <SelectItem key={flow.uuid} value={flow.uuid}>
                      {flow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {preSelectedFlowUuid && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('customers.flowPreSelected')}
                </p>
              )}
            </div>

            {/* QR Code Display */}
            {qrCodeDataUrl && selectedFlow && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/50 p-6">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="h-64 w-64"
                  />
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    {t('customers.scanToJoin', { flowName: selectedFlow.name })}
                  </p>
                </div>

                {/* Invite URL Display */}
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {t('customers.inviteLink')}
                  </p>
                  <code className="block break-all text-xs">
                    {`${window.location.origin}/invite/${tenant?.name}/${selectedFlow.name}`}
                  </code>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="flex-1"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {t('common.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        {t('customers.copyLink')}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadQR}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t('customers.downloadQR')}
                  </Button>
                </div>
              </div>
            )}

            {/* No Flow Selected */}
            {!selectedFlowUuid && (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <QrCode className="mb-2 h-12 w-12 opacity-50" />
                <p className="text-sm">
                  {t('customers.selectFlowToGenerateQR')}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
