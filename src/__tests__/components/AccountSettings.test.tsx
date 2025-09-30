import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import AccountSettings from '@/components/Account/AccountSettings';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { useSoleOwnership } from '@/hooks/useSoleOwnership';

// Mock the stores
vi.mock('@/stores/useAuthStore');
vi.mock('@/stores/useAppStore');

// Mock the user mutation hooks
vi.mock('@/hooks/useUserMutation', () => ({
  useUpdateUser: vi.fn(),
  useDeleteUser: vi.fn(),
}));

// Mock the sole ownership hook
vi.mock('@/hooks/useSoleOwnership', () => ({
  useSoleOwnership: vi.fn(),
}));

// Mock the ConfirmationProvider
const MockConfirmationProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const mockUseAuthStore = vi.mocked(useAuthStore);
const mockUseAppStore = vi.mocked(useAppStore);
const mockUseSoleOwnership = vi.mocked(useSoleOwnership);

const createWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MockConfirmationProvider>
          {children}
        </MockConfirmationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const mockUser = {
  id: 2,
  email: 'admin@admin.com',
  name: 'Admin User',
  memberships: [
    {
      uuid: 'membership-1',
      tenant_name: 'Test Tenant 1',
      tenant_uuid: 'tenant-1',
      user: 2,
      user_name: 'Admin User',
      user_email: 'admin@admin.com',
      role: 'OWNER' as const,
      available_roles: []
    }
  ],
  enrollments: [],
  tier: 'FREE' as const,
  color_scheme: 'light' as const,
  marketing_consent: true
};

describe('AccountSettings', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      tokens: null,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    mockUseAppStore.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      sidebarOpen: false,
      setSidebarOpen: vi.fn(),
      toggleSidebar: vi.fn(),
      isOnline: true,
      setIsOnline: vi.fn(),
    });

    mockUseSoleOwnership.mockReturnValue({
      soleOwnerships: [mockUser.memberships[0]], // Mock as sole owner for the test
      isLoading: false,
      hasError: false,
      ownerMemberships: mockUser.memberships,
    });

    // Mock the user mutation hooks
    const userMutationHooks = await import('@/hooks/useUserMutation');
    
    vi.mocked(userMutationHooks.useUpdateUser).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.mocked(userMutationHooks.useDeleteUser).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);
  });

  it('renders account settings interface', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your account preferences and settings')).toBeInTheDocument();
  });

  it('displays profile information section', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin@admin.com')).toBeInTheDocument();
  });

  it('displays appearance settings section', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('displays account management section with delete warning when sole owner', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Account Management')).toBeInTheDocument();
    expect(screen.getAllByText('Delete Account')).toHaveLength(2); // Header and button
    expect(screen.getByText(/Warning: You are the sole owner/)).toBeInTheDocument();
  });

  it('displays account management section without warning when not sole owner', () => {
    // Mock as not being a sole owner
    mockUseSoleOwnership.mockReturnValue({
      soleOwnerships: [], // No sole ownerships
      isLoading: false,
      hasError: false,
      ownerMemberships: mockUser.memberships,
    });

    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Account Management')).toBeInTheDocument();
    expect(screen.getAllByText('Delete Account')).toHaveLength(2); // Header and button
    expect(screen.queryByText(/Warning: You are the sole owner/)).not.toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    const nameInput = screen.getByDisplayValue('Admin User');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    expect(nameInput).toHaveValue('Updated Name');
  });

  it('shows save button when changes are made', async () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    const nameInput = screen.getByDisplayValue('Admin User');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    await waitFor(() => {
      const saveButton = screen.getByText('Save Profile');
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('handles marketing consent toggle', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    const marketingSwitch = screen.getByRole('switch');
    expect(marketingSwitch).toBeChecked();

    fireEvent.click(marketingSwitch);
    expect(marketingSwitch).not.toBeChecked();
  });

  it('shows current tier information', () => {
    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Current Tier')).toBeInTheDocument();
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('renders sign-in message when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      tokens: null,
      setTokens: vi.fn(),
      setUser: vi.fn(),
      clearTokens: vi.fn(),
    });

    render(<AccountSettings />, { wrapper: createWrapper });

    expect(screen.getByText('Please sign in to access account settings.')).toBeInTheDocument();
  });
});
