import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  MailOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  GitBranch,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  useMessages,
  useMarkMessageAsRead,
  useTakeMessageAction,
  useMarkAllMessagesAsRead,
} from '@/hooks/useMessageQuery';
import { MessageType, Message, MessageListParams } from '@/types/message';
import { useAuthStore } from '@/stores/useAuthStore';
import { PAGINATION } from '@/config/constants';

const getMessageIcon = (messageType: MessageType) => {
  switch (messageType) {
    case 'status_update':
      return <AlertCircle className="h-4 w-4" />;
    case 'tenant_invite':
      return <Users className="h-4 w-4" />;
    case 'flow_invite':
      return <GitBranch className="h-4 w-4" />;
    case 'membership_update':
      return <Settings className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
};

const getMessageTypeLabel = (messageType: MessageType, t: any) => {
  switch (messageType) {
    case 'status_update':
      return t('inbox.statusUpdate');
    case 'tenant_invite':
      return t('inbox.teamInvite');
    case 'flow_invite':
      return t('inbox.flowInvite');
    case 'membership_update':
      return t('inbox.membershipUpdate');
    default:
      return messageType;
  }
};

const getMessageTypeBadgeVariant = (messageType: MessageType) => {
  switch (messageType) {
    case 'status_update':
      return 'default' as const;
    case 'tenant_invite':
      return 'secondary' as const;
    case 'flow_invite':
      return 'outline' as const;
    case 'membership_update':
      return 'destructive' as const;
    default:
      return 'default' as const;
  }
};

interface MessageCardProps {
  message: Message;

  onMarkAsRead: (messageUuid: string) => void;

  onTakeAction: (messageUuid: string, action: 'accept' | 'reject') => void;
  isMarkingAsRead: boolean;
  isTakingAction: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onMarkAsRead,
  onTakeAction,
  isMarkingAsRead,
  isTakingAction,
}) => {
  const { t } = useTranslation();

  return (
    <Card
      className={`transition-all hover:scale-[1.02] hover:shadow-md ${!message.is_read ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : 'hover:shadow-lg'}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`rounded-full p-2 ${!message.is_read ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            {getMessageIcon(message.message_type)}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`font-semibold ${!message.is_read ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {message.title}
                </h3>
                <Badge
                  variant={getMessageTypeBadgeVariant(message.message_type)}
                >
                  {getMessageTypeLabel(message.message_type, t)}
                </Badge>
                {!message.is_read && (
                  <Badge variant="default" className="bg-primary">
                    {t('inbox.new')}
                  </Badge>
                )}
                {message.requires_action &&
                  message.action_accepted === null && (
                    <Badge variant="destructive">
                      {t('inbox.actionRequired')}
                    </Badge>
                  )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(message.created), {
                  addSuffix: true,
                })}
              </div>
            </div>

            <p className="mb-4 whitespace-pre-line text-sm text-muted-foreground">
              {message.content}
            </p>

            {/* Metadata */}
            <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
              {message.sent_by_name && (
                <span>
                  {t('inbox.from')}: {message.sent_by_name}
                </span>
              )}
              {message.tenant_name && (
                <span>
                  {t('inbox.team')}: {message.tenant_name}
                </span>
              )}
              {message.flow_name && (
                <span>
                  {t('inbox.flow')}: {message.flow_name}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!message.is_read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkAsRead(message.uuid)}
                  disabled={isMarkingAsRead}
                >
                  <MailOpen className="mr-1 h-3 w-3" />
                  {t('inbox.markAsRead')}
                </Button>
              )}

              {message.requires_action && message.action_accepted === null && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onTakeAction(message.uuid, 'accept')}
                    disabled={isTakingAction}
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {t('inbox.accept')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTakeAction(message.uuid, 'reject')}
                    disabled={isTakingAction}
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    {t('inbox.reject')}
                  </Button>
                </>
              )}

              {message.requires_action && message.action_accepted !== null && (
                <Badge
                  variant={message.action_accepted ? 'default' : 'secondary'}
                >
                  {message.action_accepted
                    ? t('inbox.accepted')
                    : t('inbox.rejected')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InboxPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [messageTypeFilter, setMessageTypeFilter] = useState<
    MessageType | 'all'
  >('all');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>(
    'unread'
  ); // Default to unread
  const [actionFilter, setActionFilter] = useState<
    'all' | 'actionable' | 'no-action'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [actionError, setActionError] = useState<string | null>(null);

  // Message parameters - with filters but no search
  const messageParams: MessageListParams = {
    page: currentPage,
    page_size: pageSize,
    message_type: messageTypeFilter === 'all' ? undefined : messageTypeFilter,
    is_read: readFilter === 'all' ? undefined : readFilter === 'read',
    requires_action:
      actionFilter === 'all' ? undefined : actionFilter === 'actionable',
  };

  // Fetch data
  const {
    data: messagesData,
    isLoading,
    error,
  } = useMessages(user?.id?.toString() || '', messageParams);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleMessageTypeChange = (value: string) => {
    setMessageTypeFilter(value as MessageType | 'all');
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleReadFilterChange = (value: string) => {
    setReadFilter(value as 'all' | 'read' | 'unread');
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleActionFilterChange = (value: string) => {
    setActionFilter(value as 'all' | 'actionable' | 'no-action');
    setCurrentPage(1); // Reset to first page when filtering
  };

  const markAsReadMutation = useMarkMessageAsRead();
  const takeActionMutation = useTakeMessageAction();
  const markAllAsReadMutation = useMarkAllMessagesAsRead();

  const handleMarkAsRead = (messageUuid: string) => {
    markAsReadMutation.mutate(messageUuid);
  };

  const handleTakeAction = (
    messageUuid: string,
    action: 'accept' | 'reject'
  ) => {
    setActionError(null); // Clear any previous errors
    takeActionMutation.mutate(
      { messageUuid, actionData: { action } },
      {
        onError: (error: any) => {
          if (
            error?.data?.error ===
            'Action has already been taken on this message'
          ) {
            setActionError(t('inbox.actionAlreadyTaken'));
            // Auto-clear the error message after 5 seconds
            setTimeout(() => setActionError(null), 5000);
          }
        },
      }
    );
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Calculate derived values
  const messages = messagesData?.results || [];
  const totalCount = messagesData?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>{t('inbox.loadingMessages')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h3 className="mb-2 text-lg font-semibold">
            {t('inbox.failedToLoad')}
          </h3>
          <p className="text-muted-foreground">{t('inbox.loadErrorMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('flows.backToDashboard')}
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t('inbox.title')}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t('inbox.manageNotifications')}
          </p>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('inbox.actionAlreadyTakenTitle')}</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {t('customers.filters')}
            </CardTitle>
            <CardDescription>{t('inbox.filterDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Message Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('inbox.messageType')}
                </label>
                <Select
                  value={messageTypeFilter}
                  onValueChange={handleMessageTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('inbox.allTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('inbox.allTypes')}</SelectItem>
                    <SelectItem value="status_update">
                      {t('inbox.statusUpdates')}
                    </SelectItem>
                    <SelectItem value="tenant_invite">
                      {t('inbox.teamInvites')}
                    </SelectItem>
                    <SelectItem value="flow_invite">
                      {t('inbox.flowInvites')}
                    </SelectItem>
                    <SelectItem value="membership_update">
                      {t('inbox.membershipUpdates')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Read Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('inbox.readStatus')}
                </label>
                <Select
                  value={readFilter}
                  onValueChange={handleReadFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('inbox.allMessages')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('inbox.allMessages')}
                    </SelectItem>
                    <SelectItem value="unread">{t('inbox.unread')}</SelectItem>
                    <SelectItem value="read">{t('inbox.read')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('inbox.actionRequired')}
                </label>
                <Select
                  value={actionFilter}
                  onValueChange={handleActionFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('inbox.allMessages')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('inbox.allMessages')}
                    </SelectItem>
                    <SelectItem value="actionable">
                      {t('inbox.actionRequired')}
                    </SelectItem>
                    <SelectItem value="no-action">
                      {t('inbox.noAction')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('inbox.perPage')}
                </label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger>
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
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {messages.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                <MailOpen className="mr-2 h-4 w-4" />
                {markAllAsReadMutation.isPending
                  ? t('inbox.marking')
                  : t('inbox.markAllAsRead')}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {t('inbox.totalMessages', { count: totalCount })}
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    {t('inbox.noMessagesFound')}
                  </h3>
                  <p className="text-muted-foreground">
                    {messageTypeFilter !== 'all' ||
                    readFilter !== 'all' ||
                    actionFilter !== 'all'
                      ? t('inbox.tryAdjustingFilters')
                      : t('inbox.noMessagesAtThisTime')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            messages.map(message => (
              <MessageCard
                key={message.uuid}
                message={message}
                onMarkAsRead={handleMarkAsRead}
                onTakeAction={handleTakeAction}
                isMarkingAsRead={markAsReadMutation.isPending}
                isTakingAction={takeActionMutation.isPending}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t('inbox.showingMessages', {
                from: (currentPage - 1) * pageSize + 1,
                to: Math.min(currentPage * pageSize, totalCount),
                total: totalCount,
              })}
            </p>

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
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
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
    </div>
  );
};

export default InboxPage;
