import { useState } from 'react';
import { ArrowLeft, Trash2, Crown, Shield, User, Search, ChevronUp, ChevronDown, AlertCircle, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useMembers, useUpdateMember, useDeleteMember, useInviteMember } from '@/hooks/useMemberQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { MemberListParams } from '@/types/member';
import { MemberRole, ROLE_HIERARCHY } from '@/types/user';
import { CreateTenantMemberInviteRequest } from '@/types/message';
import { logger } from '@/lib/logger';
import { PAGINATION } from '@/config/constants';

// Helper function to get available roles for inviting based on current user's role
const getInvitableRoles = (currentUserRole: MemberRole): MemberRole[] => {
  switch (currentUserRole) {
    case 'OWNER':
      return ['MEMBER', 'STAFF', 'OWNER']; // Can invite to any role
    case 'STAFF':
      return ['MEMBER', 'STAFF']; // Can invite members and staff
    case 'MEMBER':
    default:
      return []; // Cannot invite anyone
  }
};

// Invite Member Modal Component
interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (inviteData: CreateTenantMemberInviteRequest) => void;
  currentUserRole: MemberRole;
  tenantUuid: string;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

const InviteMemberModal = ({ isOpen, onClose, onInvite, currentUserRole, tenantUuid, isLoading = false, error, onClearError }: InviteMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<MemberRole>('MEMBER');
  
  const invitableRoles = getInvitableRoles(currentUserRole);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && selectedRole) {
      onInvite({
        email,
        invite_type: 'tenant_member',
        role: selectedRole,
      });
    }
  };

  const handleClose = () => {
    setEmail('');
    setSelectedRole('MEMBER');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Invite Member</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear error when user starts typing
                if (error && onClearError) {
                  onClearError();
                }
              }}
              placeholder="Enter email address"
              required
              disabled={isLoading}
              className={error ? 'border-destructive focus:border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as MemberRole)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {invitableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      {role === 'OWNER' && <Crown className="h-4 w-4" />}
                      {role === 'STAFF' && <Shield className="h-4 w-4" />}
                      {role === 'MEMBER' && <User className="h-4 w-4" />}
                      {role}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !email} className="flex-1">
              {isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MemberManagement = () => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const updateMemberMutation = useUpdateMember();
  const deleteMemberMutation = useDeleteMember();
  const inviteMemberMutation = useInviteMember();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Get selected membership for display
  const selectedMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);

  // Pagination parameters
  const paginationParams: MemberListParams = {
    page: currentPage,
    page_size: pageSize,
    search: searchTerm || undefined,
  };

  // Fetch members for the selected tenant
  const { data: membersResponse, isLoading, error } = useMembers(selectedTenant || '', paginationParams);
  
  const members = membersResponse?.results || [];
  const totalCount = membersResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4" />;
      case 'STAFF':
        return <Shield className="h-4 w-4" />;
      case 'MEMBER':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: MemberRole) => {
    switch (role) {
      case 'OWNER':
        return 'default' as const;
      case 'STAFF':
        return 'secondary' as const;
      case 'MEMBER':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  const handlePromote = async (memberId: string, memberName: string, currentRole: MemberRole, availableRoles: Array<{value: string, label: string}>) => {
    const currentIndex = ROLE_HIERARCHY.indexOf(currentRole);
    const nextHigherRoleIndex = currentIndex - 1; // Lower index = higher role
    
    if (nextHigherRoleIndex < 0) return; // No higher role available
    
    const nextHigherRole = ROLE_HIERARCHY[nextHigherRoleIndex];
    const isRoleAvailable = availableRoles.some(role => role.value === nextHigherRole);
    
    if (!isRoleAvailable) return; // Role not available from backend
    
    const newRole = nextHigherRole;
    
    const confirmed = await confirm({
      title: `Promote ${memberName}?`,
      description: `This will promote ${memberName} from ${currentRole} to ${newRole}.`,
      variant: 'promote',
      confirmText: `Promote to ${newRole}`,
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await updateMemberMutation.mutateAsync({
          tenantUuid: selectedTenant!,
          memberUuid: memberId,
          memberData: { role: newRole },
        });
      } catch (error) {
        logger.error('Failed to promote member:', error);
      }
    }
  };

  const handleDemote = async (memberId: string, memberName: string, currentRole: MemberRole, availableRoles: Array<{value: string, label: string}>) => {
    const currentIndex = ROLE_HIERARCHY.indexOf(currentRole);
    const nextLowerRoleIndex = currentIndex + 1; // Higher index = lower role
    
    if (nextLowerRoleIndex >= ROLE_HIERARCHY.length) return; // No lower role available
    
    const nextLowerRole = ROLE_HIERARCHY[nextLowerRoleIndex];
    const isRoleAvailable = availableRoles.some(role => role.value === nextLowerRole);
    
    if (!isRoleAvailable) return; // Role not available from backend
    
    const newRole = nextLowerRole;
    
    const confirmed = await confirm({
      title: `Demote ${memberName}?`,
      description: `This will demote ${memberName} from ${currentRole} to ${newRole}.`,
      variant: 'demote',
      confirmText: `Demote to ${newRole}`,
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await updateMemberMutation.mutateAsync({
          tenantUuid: selectedTenant!,
          memberUuid: memberId,
          memberData: { role: newRole },
        });
      } catch (error) {
        logger.error('Failed to demote member:', error);
      }
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    const confirmed = await confirm({
      title: `Remove ${memberName}?`,
      description: `This will permanently remove ${memberName} from the organization. They will lose all access immediately.`,
      variant: 'destructive',
      confirmText: 'Remove Member',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteMemberMutation.mutateAsync({
          tenantUuid: selectedTenant!,
          memberUuid: memberId,
        });
      } catch (error) {
        logger.error('Failed to delete member:', error);
      }
    }
  };

  const handleInviteMember = async (inviteData: CreateTenantMemberInviteRequest) => {
    // Clear any previous errors
    setInviteError(null);

    try {
      await inviteMemberMutation.mutateAsync({
        tenantUuid: selectedTenant!,
        inviteData,
      });
      setIsInviteModalOpen(false);
      setInviteError(null); // Clear error on success
    } catch (error: any) {
      logger.error('Failed to invite member:', error);

      // Handle 403 errors from backend (tier restrictions)
      if (error?.response?.status === 403) {
        const message = error?.response?.data?.detail || 'Your plan has reached its membership limit. Please upgrade to add more members.';
        setInviteError(message);
      }
      // Extract email error from response: { "email": ["error message"] }
      // The error data is attached to the error object by our apiRequest function
      else if (error?.data?.email?.[0]) {
        setInviteError(error.data.email[0]);
      } else {
        setInviteError('An error occurred. Please try again.');
      }
    }
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteError(null); // Clear error when closing modal
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

  // Show error if no tenant is selected
  if (!selectedTenant || !selectedMembership) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button variant="outline" asChild className="w-fit">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Member Management</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage team members and their roles</p>
            </div>
          </div>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-lg text-destructive">No Organization Selected</CardTitle>
                  <CardDescription>
                    Please select an organization from the menu to manage members.
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
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="outline" asChild className="w-fit">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Member Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Managing members for {selectedMembership.tenant_name}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search members..."
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
            <span className="ml-2">Loading members...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to load members. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Members List */}
        {!isLoading && !error && (
          <>
            {members.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Members ({totalCount})
                  </h2>
                  {selectedMembership && getInvitableRoles(selectedMembership.role).length > 0 && (
                    <Button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Invite Member
                    </Button>
                  )}
                </div>

                <div className="grid gap-4">
                  {members.map((member) => {
                    const isCurrentUser = (member as any).user === user?.id || member.user_id === user?.id;
                    const availableRoles = member.available_roles || [];
                    
                    // Use backend's available_roles to determine what actions are possible
                    const currentRoleIndex = ROLE_HIERARCHY.indexOf(member.role);
                    
                    // For promotion: find the next higher role (one step up in hierarchy)
                    const nextHigherRoleIndex = currentRoleIndex - 1; // Lower index = higher role
                    const higherRoles = nextHigherRoleIndex >= 0 ? 
                      availableRoles.filter(role => role.value === ROLE_HIERARCHY[nextHigherRoleIndex]) : [];
                    
                    // For demotion: find the next lower role (one step down in hierarchy)  
                    const nextLowerRoleIndex = currentRoleIndex + 1; // Higher index = lower role
                    const lowerRoles = nextLowerRoleIndex < ROLE_HIERARCHY.length ?
                      availableRoles.filter(role => role.value === ROLE_HIERARCHY[nextLowerRoleIndex]) : [];
                    
                    const canPromote = !isCurrentUser && higherRoles.length > 0;
                    const canDemote = !isCurrentUser && lowerRoles.length > 0;
                    const canDelete = !isCurrentUser && availableRoles.length > 0;

                    return (
                      <Card key={member.uuid} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {getRoleIcon(member.role)}
                                  {member.user_name}
                                  {isCurrentUser && <Badge variant="outline" className="text-xs">You</Badge>}
                                </CardTitle>
                                <CardDescription>{member.user_email}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getRoleBadgeVariant(member.role)}>
                                {member.role}
                              </Badge>
                              {canPromote && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePromote(member.uuid, member.user_name, member.role, availableRoles)}
                                  disabled={updateMemberMutation.isPending}
                                >
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                  Promote
                                </Button>
                              )}
                              {canDemote && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDemote(member.uuid, member.user_name, member.role, availableRoles)}
                                  disabled={updateMemberMutation.isPending}
                                >
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                  Demote
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteMember(member.uuid, member.user_name)}
                                  disabled={deleteMemberMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} members
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
                    <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Members Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? `No members match "${searchTerm}". Try adjusting your search.`
                        : "No members found for this organization."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <ConfirmationDialog />
        
        {/* Invite Member Modal */}
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={handleCloseInviteModal}
          onInvite={handleInviteMember}
          currentUserRole={selectedMembership?.role || 'MEMBER'}
          tenantUuid={selectedTenant || ''}
          isLoading={inviteMemberMutation.isPending}
          error={inviteError}
          onClearError={() => setInviteError(null)}
        />
      </div>
    </div>
  );
};

export default MemberManagement;