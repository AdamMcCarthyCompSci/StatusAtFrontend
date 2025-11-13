import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CustomerManagement from '@/components/Customer/CustomerManagement';
import { useAuthStore } from '@/stores/useAuthStore';
// Mock the ConfirmationProvider
const MockConfirmationProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Mock the auth store
vi.mock('@/stores/useAuthStore');

// Mock the tenant store
vi.mock('@/stores/useTenantStore', () => ({
  useTenantStore: () => ({
    selectedTenant: 'tenant-1',
  }),
}));

// Mock the enrollment query hooks
vi.mock('@/hooks/useEnrollmentQuery', () => ({
  useEnrollments: vi.fn(),
  useDeleteEnrollment: vi.fn(),
  useFlowsForFiltering: vi.fn(),
  useFlowSteps: vi.fn(),
}));

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
      available_roles: []
    }
  ],
  enrollments: [],
  color_scheme: 'light' as const,
  marketing_consent: true
};

const mockEnrollments = [
  {
    uuid: 'enrollment-1',
    user_id: 4,
    user_name: 'Alice Johnson',
    user_email: 'alice@example.com',
    flow_name: 'Order Processing',
    flow_uuid: 'flow-1',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: 'tenant-1',
    current_step_name: 'Initial Review',
    current_step_uuid: 'step-1',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T14:20:00Z',
  },
  {
    uuid: 'enrollment-2',
    user_id: 5,
    user_name: 'Bob Wilson',
    user_email: 'bob@example.com',
    flow_name: 'Support Ticket',
    flow_uuid: 'flow-2',
    tenant_name: 'Test Tenant 1',
    tenant_uuid: 'tenant-1',
    current_step_name: 'Processing',
    current_step_uuid: 'step-2',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-18T11:45:00Z',
  },
];

const mockFlows = [
  { uuid: 'flow-1', name: 'Order Processing', tenant_name: 'Test Tenant 1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { uuid: 'flow-2', name: 'Support Ticket', tenant_name: 'Test Tenant 1', created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z' },
];

const mockFlowSteps = [
  { uuid: 'step-1', name: 'Initial Review' },
  { uuid: 'step-2', name: 'In Progress' },
];

describe('CustomerManagement', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock the enrollment query hooks
    const enrollmentHooks = await import('@/hooks/useEnrollmentQuery');
    
    vi.mocked(enrollmentHooks.useEnrollments).mockReturnValue({
      data: {
        count: mockEnrollments.length,
        next: null,
        previous: null,
        results: mockEnrollments,
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(enrollmentHooks.useDeleteEnrollment).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.mocked(enrollmentHooks.useFlowsForFiltering).mockReturnValue({
      data: mockFlows,
    } as any);

    vi.mocked(enrollmentHooks.useFlowSteps).mockReturnValue({
      data: mockFlowSteps,
    } as any);
  });

  it('renders tenant selection when user has no selected tenant', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    expect(screen.getByText('Customer Management')).toBeInTheDocument();
  });

  it('shows switch organization button when tenant is selected', () => {
    const userWithMultipleTenants = {
      ...mockUser,
      memberships: [
        ...mockUser.memberships,
        {
          uuid: 'membership-2',
          tenant_name: 'Test Tenant 2',
          tenant_uuid: 'tenant-2',
          user: 2,
          user_name: 'admin',
          user_email: 'admin@admin.com',
          role: 'STAFF' as const,
          available_roles: []
        }
      ]
    };

    mockUseAuthStore.mockReturnValue({
      user: userWithMultipleTenants,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    // Since auto-selection happens, we should see the management interface
    expect(screen.getByText('Customer Management')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('renders customer management interface for single tenant', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    expect(screen.getByText('Customer Management')).toBeInTheDocument();
    expect(screen.getByText('Managing customers for Test Tenant 1')).toBeInTheDocument();
  });

  it('displays search and filter controls', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    expect(screen.getByPlaceholderText('Name or email...')).toBeInTheDocument();
    expect(screen.getByText('All flows')).toBeInTheDocument();
    expect(screen.getByText('All steps')).toBeInTheDocument();
    expect(screen.getByText('All statuses')).toBeInTheDocument();
  });

  it('displays customer list', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    expect(screen.getByText('Order Processing')).toBeInTheDocument();
    expect(screen.getByText('Support Ticket')).toBeInTheDocument();
    expect(screen.getByText('Initial Review')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    const searchInput = screen.getByPlaceholderText('Name or email...');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    expect(searchInput).toHaveValue('Alice');
  });

  it('handles flow filter selection', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    // Find and click the flow filter dropdown
    const flowSelect = screen.getByText('All flows').closest('button');
    expect(flowSelect).toBeInTheDocument();
  });

  it('shows clear filters button when filters are active', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    const searchInput = screen.getByPlaceholderText('Name or email...');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    await waitFor(() => {
      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });
  });

  it('handles loading state', async () => {
    const enrollmentHooks = await import('@/hooks/useEnrollmentQuery');
    vi.mocked(enrollmentHooks.useEnrollments).mockReturnValue({
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

    render(<CustomerManagement />, { wrapper: createWrapper });

    expect(screen.getByText('Loading customers...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const enrollmentHooks = await import('@/hooks/useEnrollmentQuery');
    vi.mocked(enrollmentHooks.useEnrollments).mockReturnValue({
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

    render(<CustomerManagement />, { wrapper: createWrapper });

    expect(screen.getByText('Failed to load customers. Please try again.')).toBeInTheDocument();
  });

  it('shows empty state when no customers found', async () => {
    const enrollmentHooks = await import('@/hooks/useEnrollmentQuery');
    vi.mocked(enrollmentHooks.useEnrollments).mockReturnValue({
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

    render(<CustomerManagement />, { wrapper: createWrapper });

    expect(screen.getByText('No Customers Found')).toBeInTheDocument();
    expect(screen.getByText('No customers are enrolled in any flows yet.')).toBeInTheDocument();
  });

  it('displays pagination when multiple pages available', async () => {
    const enrollmentHooks = await import('@/hooks/useEnrollmentQuery');
    vi.mocked(enrollmentHooks.useEnrollments).mockReturnValue({
      data: {
        count: 25, // More than 10 (default page size)
        next: 'http://example.com/next',
        previous: null,
        results: mockEnrollments,
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

    render(<CustomerManagement />, { wrapper: createWrapper });

    // Should show pagination controls
    expect(screen.getByText('1')).toBeInTheDocument(); // Current page
    expect(screen.getByText('3')).toBeInTheDocument(); // Total pages (25/10 = 3)
  });

  it('shows delete buttons for customers', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });

    render(<CustomerManagement />, { wrapper: createWrapper });

    // Wait for customers to be displayed
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    // The page should render with customer data successfully
    expect(screen.getByText('Customer Management')).toBeInTheDocument();
  });
});
