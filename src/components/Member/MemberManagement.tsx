import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useMembers, useUpdateMember, useDeleteMember } from '@/hooks/useMemberQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { ArrowLeft, Trash2, Crown, Shield, User, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { MemberListParams } from '@/types/member';
import { MemberRole, ROLE_HIERARCHY } from '@/types/user';

const MemberManagement = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const updateMemberMutation = useUpdateMember();
  const deleteMemberMutation = useDeleteMember();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  // Pagination parameters
  const paginationParams: MemberListParams = {
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

  // Get the selected tenant details and current user's role
  const currentTenant = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);
  const currentUserMembership = currentTenant;
  const currentUserRole = currentTenant?.role;

  // Fetch members for the selected tenant with pagination
  const { data: membersResponse, isLoading, error } = useMembers(selectedTenant || '', paginationParams);
  
  const members = membersResponse?.results || [];
  const totalCount = membersResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePromote = async (memberUuid: string) => {
    if (!selectedTenant || !currentUserMembership) return;

    const targetMember = members.find(m => m.uuid === memberUuid);
    if (!targetMember) return;

    if ((targetMember as any).user === user?.id || targetMember.user_id === user?.id) {
      return; // Self-management is prevented by UI, but this is a safety check
    }

    // Get available higher roles from backend
    const availableRoles = (targetMember as any).available_roles || [];
    const higherRoles = availableRoles.filter((role: any) => 
      ROLE_HIERARCHY[role.value as MemberRole] > ROLE_HIERARCHY[targetMember.role]
    );

    if (higherRoles.length === 0) {
      return; // No higher roles available, button shouldn't be shown
    }

    // Get the next higher role (lowest among higher roles)
    const nextRole = higherRoles.reduce((lowest: any, role: any) => 
      ROLE_HIERARCHY[role.value as MemberRole] < ROLE_HIERARCHY[lowest.value as MemberRole] ? role : lowest
    ).value as MemberRole;

    const isSameLevelPromotion = currentUserRole && ROLE_HIERARCHY[targetMember.role] === ROLE_HIERARCHY[currentUserRole];
    const confirmMessage = isSameLevelPromotion 
      ? `You are promoting a peer (${targetMember.role}) to ${nextRole}. This will give them the same or higher privileges than you currently have.`
      : `This will promote ${targetMember.user_name} from ${targetMember.role} to ${nextRole}.`;
    
    const confirmed = await confirm({
      title: `Promote ${targetMember.user_name}?`,
      description: confirmMessage,
      variant: 'promote',
      confirmText: `Promote to ${nextRole}`,
    });

    if (confirmed) {
      try {
        await updateMemberMutation.mutateAsync({
          tenantUuid: selectedTenant,
          memberUuid,
          memberData: { role: nextRole },
        });
      } catch (err) {
        console.error('Failed to promote member:', err);
        // Error handling could be improved with a toast notification
      }
    }
  };

  const handleDemote = async (memberUuid: string) => {
    if (!selectedTenant || !currentUserMembership) return;

    const targetMember = members.find(m => m.uuid === memberUuid);
    if (!targetMember) return;

    if ((targetMember as any).user === user?.id || targetMember.user_id === user?.id) {
      return; // Self-management is prevented by UI, but this is a safety check
    }

    // Get available lower roles from backend
    const availableRoles = (targetMember as any).available_roles || [];
    const lowerRoles = availableRoles.filter((role: any) => 
      ROLE_HIERARCHY[role.value as MemberRole] < ROLE_HIERARCHY[targetMember.role]
    );

    if (lowerRoles.length === 0) {
      return; // No lower roles available, button shouldn't be shown
    }

    // Get the next lower role (highest among lower roles)
    const nextRole = lowerRoles.reduce((highest: any, role: any) => 
      ROLE_HIERARCHY[role.value as MemberRole] > ROLE_HIERARCHY[highest.value as MemberRole] ? role : highest
    ).value as MemberRole;

    const isSameLevelDemotion = currentUserRole && ROLE_HIERARCHY[targetMember.role] === ROLE_HIERARCHY[currentUserRole];
    const confirmMessage = isSameLevelDemotion 
      ? `You are demoting a peer (${targetMember.role}) to ${nextRole}. This will reduce their privileges.`
      : `This will demote ${targetMember.user_name} from ${targetMember.role} to ${nextRole}.`;
    
    const confirmed = await confirm({
      title: `Demote ${targetMember.user_name}?`,
      description: confirmMessage,
      variant: 'demote',
      confirmText: `Demote to ${nextRole}`,
    });

    if (confirmed) {
      try {
        await updateMemberMutation.mutateAsync({
          tenantUuid: selectedTenant,
          memberUuid,
          memberData: { role: nextRole },
        });
      } catch (err) {
        console.error('Failed to demote member:', err);
        // Error handling could be improved with a toast notification
      }
    }
  };

  const handleDeleteMember = async (memberUuid: string, memberName: string) => {
    if (!selectedTenant || !currentUserRole) return;

    const targetMember = members.find(m => m.uuid === memberUuid);
    if (!targetMember) return;

    if ((targetMember as any).user === user?.id || targetMember.user_id === user?.id) {
      return; // Self-management is prevented by UI, but this is a safety check
    }

    const isSameLevelDeletion = ROLE_HIERARCHY[targetMember.role] === ROLE_HIERARCHY[currentUserRole];
    const confirmMessage = isSameLevelDeletion 
      ? `You are removing a peer with ${targetMember.role} privileges. ${memberName} will lose access to this organization and all associated data.`
      : `${memberName} will be removed from this organization and lose all access. This action cannot be undone.`;

    const confirmed = await confirm({
      title: `Remove ${memberName}?`,
      description: confirmMessage,
      variant: 'destructive',
      confirmText: 'Remove Member',
    });

    if (confirmed) {
      try {
        await deleteMemberMutation.mutateAsync({ tenantUuid: selectedTenant, memberUuid });
      } catch (error) {
        console.error('Failed to delete member:', error);
        // Error handling could be improved with a toast notification
      }
    }
  };

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4" />;
      case 'STAFF':
        return <Shield className="h-4 w-4" />;
      case 'MEMBER':
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
    }
  };

  if (!user || !user.memberships || user.memberships.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have any memberships to manage members.</CardDescription>
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
            <p className="text-muted-foreground">Choose which organization to manage members for</p>
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
                    <User className="h-4 w-4 mr-2" />
                    Manage Members
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
              <h1 className="text-3xl font-bold">Member Management</h1>
              <p className="text-muted-foreground">
                Managing members for {currentTenant.tenant_name}
              </p>
            </div>
          </div>

          {user?.memberships && user.memberships.length > 1 && (
            <Button variant="outline" onClick={() => setSelectedTenant(null)}>
              Switch Organization
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="search" className="text-sm font-medium mb-2 block">
                  Search members
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
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

        {/* Members List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Organization Members</h2>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {members.length} of {totalCount} members
              </p>
            )}
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading members...</p>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <p>Failed to load members. Please try again.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {members && members.length === 0 && !isLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Members Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No members match your search criteria' : 'This organization has no members yet'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {members && members.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Member</th>
                        <th className="text-left p-4 font-medium">Role</th>
                        <th className="text-left p-4 font-medium">Joined</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => {
                        const isCurrentUser = (member as any).user === user?.id || member.user_id === user?.id;
                        const availableRoles = (member as any).available_roles || [];
                        const canManage = !isCurrentUser && availableRoles.length > 0;

                        return (
                          <tr key={member.uuid} className="border-b hover:bg-muted/25 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium">
                                    {member.user_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {member.user_name}
                                    {isCurrentUser && (
                                      <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {member.user_email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1">
                                {getRoleIcon(member.role)}
                                {member.role}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                {canManage && (
                                  <>
                                    {/* Promote button - show if there's a higher role available */}
                                    {(() => {
                                      const higherRoles = availableRoles.filter((role: any) => 
                                        ROLE_HIERARCHY[role.value as MemberRole] > ROLE_HIERARCHY[member.role]
                                      );
                                      return higherRoles.length > 0;
                                    })() && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePromote(member.uuid)}
                                        disabled={updateMemberMutation.isPending}
                                        className="text-green-600 hover:text-green-700"
                                      >
                                        <ChevronUp className="h-4 w-4" />
                                      </Button>
                                    )}
                                    
                                    {/* Demote button - show if there's a lower role available */}
                                    {(() => {
                                      const lowerRoles = availableRoles.filter((role: any) => 
                                        ROLE_HIERARCHY[role.value as MemberRole] < ROLE_HIERARCHY[member.role]
                                      );
                                      return lowerRoles.length > 0;
                                    })() && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDemote(member.uuid)}
                                        disabled={updateMemberMutation.isPending}
                                        className="text-orange-600 hover:text-orange-700"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </Button>
                                    )}
                                    
                                    {/* Delete button - show if user can manage this member */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteMember(member.uuid, member.user_name)}
                                      disabled={deleteMemberMutation.isPending}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                
                                {!canManage && !isCurrentUser && (
                                  <span className="text-xs text-muted-foreground px-2">
                                    No permissions
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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

export default MemberManagement;
