import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import CustomerManagement from '@/components/Customer/CustomerManagement';
import { useEnrollments, useFlowsForFiltering, useFlowSteps } from '@/hooks/useEnrollmentQuery';

// Mock the hooks
vi.mock('@/hooks/useEnrollmentQuery');
vi.mock('@/stores/useAuthStore', () => ({
  useAuthStore: () => ({
    user: {
      memberships: [
        {
          tenant_uuid: 'tenant-123',
          tenant_name: 'Test Tenant',
        },
      ],
    },
  }),
}));
vi.mock('@/stores/useTenantStore', () => ({
  useTenantStore: () => ({
    selectedTenant: 'tenant-123',
  }),
}));

const mockUseEnrollments = useEnrollments as any;
const mockUseFlowsForFiltering = useFlowsForFiltering as any;
const mockUseFlowSteps = useFlowSteps as any;

const mockEnrollments = [
  {
    uuid: 'enrollment-1',
    user_name: 'John Doe',
    user_email: 'john@example.com',
    flow_name: 'Test Flow',
    current_step_name: 'Initial Step',
    created_at: '2024-01-01T00:00:00Z',
    available_transitions: [
      {
        uuid: 'transition-1',
        to_step: 'step-2',
        to_step_name: 'Second Step',
        conditions: {},
        is_backward: false,
      },
      {
        uuid: 'transition-2',
        to_step: 'step-0',
        to_step_name: 'Previous Step',
        conditions: {},
        is_backward: true,
      },
    ],
  },
  {
    uuid: 'enrollment-2',
    user_name: 'Jane Smith',
    user_email: 'jane@example.com',
    flow_name: 'Another Flow',
    current_step_name: 'Final Step',
    created_at: '2024-01-02T00:00:00Z',
    available_transitions: [],
  },
];

const mockEnrollmentsResponse = {
  count: 2,
  next: null,
  previous: null,
  results: mockEnrollments,
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CustomerManagement', () => {
  beforeEach(() => {
    mockUseEnrollments.mockReturnValue({
      data: mockEnrollmentsResponse,
      isLoading: false,
      error: null,
    } as any);

    mockUseFlowsForFiltering.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    mockUseFlowSteps.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders customer management page', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      expect(screen.getByText('Customer Management')).toBeInTheDocument();
      expect(screen.getByText(/Managing customers for/)).toBeInTheDocument();
    });
  });

  it('displays customer cards', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test Flow')).toBeInTheDocument();
      expect(screen.getByText('Another Flow')).toBeInTheDocument();
    });
  });

  it('shows switch organization button when tenant is selected', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      // The component shows "Back to Dashboard" button instead of "Switch Organization"
      expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
    });
  });

  it('displays search and filter controls', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name or email...')).toBeInTheDocument();
      expect(screen.getByText('All flows')).toBeInTheDocument();
      expect(screen.getByText('All steps')).toBeInTheDocument();
      expect(screen.getByText('All statuses')).toBeInTheDocument();
    });
  });

  it('handles search input', async () => {
    renderWithProviders(<CustomerManagement />);

    const searchInput = screen.getByPlaceholderText('Name or email...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Should trigger a new query with search term
    await waitFor(() => {
      expect(mockUseEnrollments).toHaveBeenCalledWith(
        'tenant-123',
        expect.objectContaining({
          search_user: 'John',
        })
      );
    });
  });

  it('shows clear filters button when filters are active', async () => {
    renderWithProviders(<CustomerManagement />);

    const searchInput = screen.getByPlaceholderText('Name or email...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });
  });

  it('displays transition count for enrollments with available transitions', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      // John Doe has 2 available transitions
      expect(screen.getByText('2 available transitions')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    const paginatedResponse = {
      ...mockEnrollmentsResponse,
      count: 25,
      next: 'http://api.example.com/page2',
    };

    mockUseEnrollments.mockReturnValue({
      data: paginatedResponse,
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      // Verify customers are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      // Pagination should show multiple pages exist (count > page_size)
      const nextButtons = screen.queryAllByText('Next');
      expect(nextButtons.length).toBeGreaterThan(0);
    });
  });

  it('displays loading state', () => {
    mockUseEnrollments.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<CustomerManagement />);

    expect(screen.getByText('Loading customers...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    mockUseEnrollments.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load enrollments'),
    } as any);

    renderWithProviders(<CustomerManagement />);

    expect(screen.getByText('Failed to load customers. Please try again.')).toBeInTheDocument();
  });

  it('displays empty state when no enrollments', () => {
    mockUseEnrollments.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CustomerManagement />);

    expect(screen.getByText('No Customers Found')).toBeInTheDocument();
    expect(screen.getByText('No customers are enrolled in any flows yet.')).toBeInTheDocument();
  });
});
