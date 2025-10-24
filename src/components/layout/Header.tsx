import { useState } from 'react';
import { Menu, User, LogOut, Settings, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { useUnreadMessageCount } from '@/hooks/useMessageQuery';
import { useLogout } from '@/hooks/useUserQuery';
import { useTenantStatus } from '@/hooks/useTenantStatus';
import TenantSidebar from './TenantSidebar';

const Header = () => {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = useUnreadMessageCount();
  const logoutMutation = useLogout();
  const { isRestrictedTenant } = useTenantStatus();

  const selectedMembership = user?.memberships?.find(m => m.tenant_uuid === selectedTenant);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        {/* Left side - Hamburger and tenant info */}
        <div className="flex items-center gap-4">
          {user?.memberships && user.memberships.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-foreground hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
              {selectedMembership && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{selectedMembership.tenant_name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedMembership.role}
                  </Badge>
                </div>
              )}
            </Button>
          )}
        </div>

        {/* Center - Logo/Title */}
        <div className="flex-1">
          <Link to="/home">
            <Logo size="sm" showText={true} />
          </Link>
        </div>

        {/* Right side - Inbox and User menu */}
        <div className="flex items-center gap-2">
          {/* Inbox Button - Only show for non-restricted tenants */}
          {user && !isRestrictedTenant && (
            <Button variant="ghost" size="sm" asChild className="relative">
              <Link to="/inbox" className="flex items-center gap-2 text-foreground hover:text-foreground">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Inbox</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-foreground hover:text-foreground">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Tenant Sidebar */}
      <TenantSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
