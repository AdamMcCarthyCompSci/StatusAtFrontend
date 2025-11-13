import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
  ArrowLeft
} from 'lucide-react';
import { useMessages, useMarkMessageAsRead, useTakeMessageAction, useMarkAllMessagesAsRead } from '@/hooks/useMessageQuery';
import { MessageType, Message, MessageListParams } from '@/types/message';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
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

const getMessageTypeLabel = (messageType: MessageType) => {
  switch (messageType) {
    case 'status_update':
      return 'Status Update';
    case 'tenant_invite':
      return 'Team Invite';
    case 'flow_invite':
      return 'Flow Invite';
    case 'membership_update':
      return 'Membership Update';
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
  return (
    <Card className={`transition-all hover:shadow-md hover:scale-[1.02] ${!message.is_read ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : 'hover:shadow-lg'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-2 rounded-full ${!message.is_read ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {getMessageIcon(message.message_type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-semibold ${!message.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {message.title}
                </h3>
                <Badge variant={getMessageTypeBadgeVariant(message.message_type)}>
                  {getMessageTypeLabel(message.message_type)}
                </Badge>
                {!message.is_read && (
                  <Badge variant="default" className="bg-primary">
                    New
                  </Badge>
                )}
                {message.requires_action && message.action_accepted === null && (
                  <Badge variant="destructive">
                    Action Required
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(message.created), { addSuffix: true })}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {message.content}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              {message.sent_by_name && (
                <span>From: {message.sent_by_name}</span>
              )}
              {message.tenant_name && (
                <span>Team: {message.tenant_name}</span>
              )}
              {message.flow_name && (
                <span>Flow: {message.flow_name}</span>
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
                  <MailOpen className="h-3 w-3 mr-1" />
                  Mark as Read
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
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTakeAction(message.uuid, 'reject')}
                    disabled={isTakingAction}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </>
              )}

              {message.requires_action && message.action_accepted !== null && (
                <Badge variant={message.action_accepted ? 'default' : 'secondary'}>
                  {message.action_accepted ? 'Accepted' : 'Rejected'}
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
  const { user } = useAuthStore();
  
  const [messageTypeFilter, setMessageTypeFilter] = useState<MessageType | 'all'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('unread'); // Default to unread
  const [actionFilter, setActionFilter] = useState<'all' | 'actionable' | 'no-action'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [actionError, setActionError] = useState<string | null>(null);

  // Message parameters - with filters but no search
  const messageParams: MessageListParams = {
    page: currentPage,
    page_size: pageSize,
    message_type: messageTypeFilter === 'all' ? undefined : messageTypeFilter,
    is_read: readFilter === 'all' ? undefined : readFilter === 'read',
    requires_action: actionFilter === 'all' ? undefined : actionFilter === 'actionable',
  };

  // Fetch data
  const { data: messagesData, isLoading, error } = useMessages(user?.id?.toString() || '', messageParams);

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

  const handleTakeAction = (messageUuid: string, action: 'accept' | 'reject') => {
    setActionError(null); // Clear any previous errors
    takeActionMutation.mutate(
      { messageUuid, actionData: { action } },
      {
        onError: (error: any) => {
          if (error?.data?.error === 'Action has already been taken on this message') {
            setActionError('This action has already been taken on this message. The page will refresh to show the current status.');
            // Auto-clear the error message after 5 seconds
            setTimeout(() => setActionError(null), 5000);
          }
        }
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load messages</h3>
          <p className="text-muted-foreground">
            There was an error loading your messages. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Inbox</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your notifications and messages
          </p>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Action Already Taken</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
            <CardDescription>
              Filter your messages by type, read status, and action requirements
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Message Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message Type</label>
              <Select value={messageTypeFilter} onValueChange={handleMessageTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="status_update">Status Updates</SelectItem>
                  <SelectItem value="tenant_invite">Team Invites</SelectItem>
                  <SelectItem value="flow_invite">Flow Invites</SelectItem>
                  <SelectItem value="membership_update">Membership Updates</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Read Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Read Status</label>
              <Select value={readFilter} onValueChange={handleReadFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All messages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Required</label>
              <Select value={actionFilter} onValueChange={handleActionFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All messages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="actionable">Action Required</SelectItem>
                  <SelectItem value="no-action">No Action</SelectItem>
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
        </CardContent>
      </Card>

        {/* Actions */}
        {messages.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                <MailOpen className="h-4 w-4 mr-2" />
                {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark All as Read'}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {totalCount} message{totalCount !== 1 ? 's' : ''} total
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                <p className="text-muted-foreground">
                  {messageTypeFilter !== 'all' || readFilter !== 'all' || actionFilter !== 'all'
                    ? 'Try adjusting your filters to see more messages.'
                    : 'You have no messages at this time.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
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
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} messages
            </p>
            
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
    </div>
  );
};

export default InboxPage;
