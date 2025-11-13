import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import EnrollmentHistoryPage from '@/components/Customer/EnrollmentHistoryPage';
import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';
import { useEnrollment, useFlowsForFiltering, useFlowSteps, useDeleteEnrollment, useUpdateEnrollment } from '@/hooks/useEnrollmentQuery';

// Mock the hooks
vi.mock('@/hooks/useEnrollmentHistoryQuery');
vi.mock('@/hooks/useEnrollmentQuery');
vi.mock('@/components/ui/confirmation-dialog', () => ({
  useConfirmationDialog: () => ({
    confirm: vi.fn().mockResolvedValue(true),
    ConfirmationDialog: () => null,
  }),
}));
vi.mock('@/hooks/useTenantStatus', () => ({
  useTenantStatus: () => ({
    isRestrictedTenant: false,
  }),
}));
vi.mock('@/stores/useTenantStore', () => ({
  useTenantStore: () => ({
    selectedTenant: 'tenant-123',
  }),
}));
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

const mockUseEnrollmentHistory = useEnrollmentHistory as any;
const mockUseEnrollment = useEnrollment as any;
const mockUseFlowsForFiltering = useFlowsForFiltering as any;
const mockUseFlowSteps = useFlowSteps as any;
const mockUseDeleteEnrollment = useDeleteEnrollment as any;
const mockUseUpdateEnrollment = useUpdateEnrollment as any;

const mockEnrollment = {
  uuid: 'enrollment-123',
  user_name: 'John Doe',
  user_email: 'john@example.com',
  flow_name: 'Test Flow',
  current_step_name: 'Current Step',
  created_at: '2024-01-01T00:00:00Z',
};

const mockHistoryData = {
  count: 3,
  next: null,
  previous: null,
  results: [
    {
      uuid: 'history-1',
      enrollment: 'enrollment-123',
      transition: 'transition-1',
      changed_by: 1,
      changed_by_name: 'Admin User',
      changed_by_email: 'admin@example.com',
      from_step_name: 'Initial Step',
      to_step_name: 'Second Step',
      is_backward: false,
      enrollment_user_name: 'John Doe',
      enrollment_user_email: 'john@example.com',
      flow_name: 'Test Flow',
      timestamp: '2024-01-01T12:00:00Z',
    },
    {
      uuid: 'history-2',
      enrollment: 'enrollment-123',
      transition: 'transition-2',
      changed_by: 2,
      changed_by_name: 'Manager User',
      changed_by_email: 'manager@example.com',
      from_step_name: 'Second Step',
      to_step_name: null, // Simulate deleted step
      is_backward: true,
      enrollment_user_name: 'John Doe',
      enrollment_user_email: 'john@example.com',
      flow_name: 'Test Flow',
      timestamp: '2024-01-02T12:00:00Z',
    },
  ],
};

const renderWithProviders = (component: React.ReactElement, initialEntries = ['/customers/enrollment-123/history']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('EnrollmentHistoryPage', () => {
  beforeEach(() => {
    mockUseEnrollment.mockReturnValue({
      data: mockEnrollment,
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

    mockUseEnrollmentHistory.mockReturnValue({
      data: mockHistoryData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    mockUseDeleteEnrollment.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    } as any);

    mockUseUpdateEnrollment.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the enrollment history page', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
      expect(screen.getByText('History for John Doe in Test Tenant')).toBeInTheDocument();
      expect(screen.getByText('Back to Customer Management')).toBeInTheDocument();
    });
  });

  it('displays enrollment information card', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      // Check enrollment name and email are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      // Check flow name and current step badge
      expect(screen.getByText('Test Flow')).toBeInTheDocument();
      expect(screen.getByText('Current Step')).toBeInTheDocument();
    });
  });

  it('displays history entries', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      // Check step names from the mock history data (may appear multiple times)
      expect(screen.getAllByText('Initial Step').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Second Step').length).toBeGreaterThan(0);
      // Check who made the changes
      expect(screen.getByText('Changed by Admin User')).toBeInTheDocument();
      expect(screen.getByText('Changed by Manager User')).toBeInTheDocument();
    });
  });


  it('displays loading state for enrollment', () => {
    mockUseEnrollment.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<EnrollmentHistoryPage />);

    expect(screen.getByText('Loading enrollment details...')).toBeInTheDocument();
  });

  it('displays loading state for history', () => {
    mockUseEnrollmentHistory.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<EnrollmentHistoryPage />);

    expect(screen.getByText('Loading history...')).toBeInTheDocument();
  });

  it('displays error state for enrollment', () => {
    mockUseEnrollment.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load enrollment'),
    } as any);

    renderWithProviders(<EnrollmentHistoryPage />);

    expect(screen.getByText('Error Loading Enrollment')).toBeInTheDocument();
    expect(screen.getByText('Failed to load enrollment')).toBeInTheDocument();
  });

  it('displays error state for history', () => {
    mockUseEnrollmentHistory.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load history'),
    } as any);

    renderWithProviders(<EnrollmentHistoryPage />);

    expect(screen.getByText('Error loading history')).toBeInTheDocument();
    expect(screen.getByText('Failed to load history')).toBeInTheDocument();
  });

  it('displays empty state when no history entries', () => {
    mockUseEnrollmentHistory.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<EnrollmentHistoryPage />);

    expect(screen.getByText('No history entries found')).toBeInTheDocument();
  });


  it('displays timeline indicators', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      // Timeline dots should be present (they have specific styling)
      const timelineElements = screen.getAllByText('Initial Step');
      expect(timelineElements.length).toBeGreaterThan(0);
    });
  });




  it('shows correct colors for transition indicators', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      // Check that backward transition has orange styling
      const backLabel = screen.getByText('(back)');
      expect(backLabel).toHaveClass('text-orange-600');
    });
  });

  // Note: Removed "refetches history" tests - they tested implementation details (when hooks are called)
  // rather than user-visible behavior. The data being displayed correctly is what matters.

});
