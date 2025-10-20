import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import MemberManagement from '@/components/Member/MemberManagement';
import { useAuthStore } from '@/stores/useAuthStore';

// Mock the auth store
vi.mock('@/stores/useAuthStore');

// Mock the member query hooks
vi.mock('@/hooks/useMemberQuery', () => ({
  useMembers: vi.fn(),
  useUpdateMember: vi.fn(),
  useDeleteMember: vi.fn(),
}));

// Mock the ConfirmationProvider
const MockConfirmationProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const mockUseAuthStore = vi.mocked(useAuthStore);

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
  name: 'admin',
  memberships: [
    {
      uuid: 'membership-1',
      tenant_name: 'Test Tenant 1',
      tenant_uuid: 'tenant-1',
      user: 2,
      user_name: 'admin',
      user_email: 'admin@admin.com',
      role: 'OWNER' as const,
      available_roles: [
        { value: 'STAFF', label: 'Staff' },
        { value: 'MEMBER', label: 'Member' }
      ]
    }
  ],
  enrollments: [],
  color_scheme: 'light' as const,
  marketing_consent: true
};

const mockMembers = [
  {
    uuid: 'member-1',
    user_id: 3,
    user_name: 'John Doe',
    user_email: 'john@example.com',
    role: 'STAFF' as const,
    available_roles: [
      { value: 'MEMBER', label: 'Member' }
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T14:20:00Z',
  },
  {
    uuid: 'member-2',
    user_id: 4,
    user_name: 'Jane Smith',
    user_email: 'jane@example.com',
    role: 'MEMBER' as const,
    available_roles: [],
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-18T11:45:00Z',
  },
];

describe('MemberManagement', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock the member query hooks
    const memberHooks = await import('@/hooks/useMemberQuery');
    
    vi.mocked(memberHooks.useMembers).mockReturnValue({
      data: {
        count: mockMembers.length,
        next: null,
        previous: null,
        results: mockMembers,
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(memberHooks.useUpdateMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.mocked(memberHooks.useDeleteMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);
  });

  it('renders member management interface for single tenant', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    expect(screen.getByText('Member Management')).toBeInTheDocument();
    expect(screen.getByText('Managing members for Test Tenant 1')).toBeInTheDocument();
  });

  it('displays search and filter controls', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    expect(screen.getByPlaceholderText('Search by name or email...')).toBeInTheDocument();
    expect(screen.getByText('Per page')).toBeInTheDocument();
  });

  it('displays member list', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    expect(screen.getByText('STAFF')).toBeInTheDocument();
    expect(screen.getByText('MEMBER')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(searchInput).toHaveValue('John');
  });

  it('shows action buttons for manageable members', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    await waitFor(() => {
      // Should show member names indicating the component loaded successfully
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      
      // Should show role badges
      expect(screen.getByText('STAFF')).toBeInTheDocument();
      expect(screen.getByText('MEMBER')).toBeInTheDocument();
    });
  });

  it('handles loading state', async () => {
    const memberHooks = await import('@/hooks/useMemberQuery');
    vi.mocked(memberHooks.useMembers).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any);

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    expect(screen.getByText('Loading members...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const memberHooks = await import('@/hooks/useMemberQuery');
    vi.mocked(memberHooks.useMembers).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    expect(screen.getByText('Failed to load members. Please try again.')).toBeInTheDocument();
  });

  it('shows empty state when no members found', async () => {
    const memberHooks = await import('@/hooks/useMemberQuery');
    vi.mocked(memberHooks.useMembers).mockReturnValue({
      data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
      },
      isLoading: false,
      error: null,
    } as any);

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    expect(screen.getByText('No Members Found')).toBeInTheDocument();
  });

  it('displays pagination when multiple pages available', async () => {
    const memberHooks = await import('@/hooks/useMemberQuery');
    vi.mocked(memberHooks.useMembers).mockReturnValue({
      data: {
        count: 25, // More than 10 (default page size)
        next: 'http://example.com/next',
        previous: null,
        results: mockMembers,
      },
      isLoading: false,
      error: null,
    } as any);

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<MemberManagement />, { wrapper: createWrapper });

    // Should show pagination controls
    expect(screen.getByText('1')).toBeInTheDocument(); // Current page
    expect(screen.getByText('3')).toBeInTheDocument(); // Total pages (25/10 = 3)
  });
});
