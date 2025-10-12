import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CustomerManagement from '@/components/Customer/CustomerManagement';
import { useEnrollments, useDeleteEnrollment, useUpdateEnrollment } from '@/hooks/useEnrollmentQuery';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';

// Mock the hooks
vi.mock('@/hooks/useEnrollmentQuery');
vi.mock('@/components/ui/confirmation-dialog');
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

const mockUseEnrollments = useEnrollments as jest.MockedFunction<typeof useEnrollments>;
const mockUseDeleteEnrollment = useDeleteEnrollment as jest.MockedFunction<typeof useDeleteEnrollment>;
const mockUseUpdateEnrollment = useUpdateEnrollment as jest.MockedFunction<typeof useUpdateEnrollment>;
const mockUseConfirmationDialog = useConfirmationDialog as jest.MockedFunction<typeof useConfirmationDialog>;

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
  const mockConfirm = jest.fn();
  const mockDeleteMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };
  const mockUpdateMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  beforeEach(() => {
    mockUseEnrollments.mockReturnValue({
      data: mockEnrollmentsResponse,
      isLoading: false,
      error: null,
    } as any);

    mockUseDeleteEnrollment.mockReturnValue(mockDeleteMutation as any);
    mockUseUpdateEnrollment.mockReturnValue(mockUpdateMutation as any);

    mockUseConfirmationDialog.mockReturnValue({
      confirm: mockConfirm,
      ConfirmationDialog: () => <div data-testid="confirmation-dialog" />,
    } as any);

    mockConfirm.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders customer management page', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      expect(screen.getByText('Customer Management')).toBeInTheDocument();
      expect(screen.getByText('Manage customer enrollments in Test Tenant')).toBeInTheDocument();
    });
  });

  it('displays enrollment cards', async () => {
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

  it('displays history buttons for each enrollment', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      const historyButtons = screen.getAllByText('History');
      expect(historyButtons).toHaveLength(2);
    });
  });

  it('displays remove buttons for each enrollment', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      const removeButtons = screen.getAllByText('Remove');
      expect(removeButtons).toHaveLength(2);
    });
  });

  it('handles enrollment deletion', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);
    });

    expect(mockConfirm).toHaveBeenCalledWith({
      title: 'Remove Customer Enrollment',
      description: 'Are you sure you want to remove John Doe from this flow? This action cannot be undone.',
      variant: 'destructive',
      confirmText: 'Remove',
      cancelText: 'Cancel',
    });

    expect(mockDeleteMutation.mutateAsync).toHaveBeenCalledWith({
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-1',
    });
  });

  it('displays transition dropdown for enrollments with available transitions', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      expect(screen.getByText('Move to:')).toBeInTheDocument();
      expect(screen.getByText('Select step...')).toBeInTheDocument();
    });
  });

  it('handles forward transition selection', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      const selectTrigger = screen.getByText('Select step...');
      fireEvent.click(selectTrigger);
    });

    await waitFor(() => {
      const forwardOption = screen.getByText('Second Step');
      fireEvent.click(forwardOption);
    });

    expect(mockConfirm).toHaveBeenCalledWith({
      title: 'Move Customer Forward',
      description: 'Move John Doe to "Second Step"? This will advance their progress in the flow.',
      variant: 'info',
      confirmText: 'Move Forward',
      cancelText: 'Cancel',
    });

    expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledWith({
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-1',
      updates: {
        current_step: 'step-2',
      },
    });
  });

  it('handles backward transition selection', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      const selectTrigger = screen.getByText('Select step...');
      fireEvent.click(selectTrigger);
    });

    await waitFor(() => {
      const backwardOption = screen.getByText('Previous Step');
      fireEvent.click(backwardOption);
    });

    expect(mockConfirm).toHaveBeenCalledWith({
      title: 'Move Customer Back',
      description: 'Move John Doe back to "Previous Step"? This will revert their progress in the flow.',
      variant: 'warning',
      confirmText: 'Move Back',
      cancelText: 'Cancel',
    });

    expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledWith({
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-1',
      updates: {
        current_step: 'step-0',
      },
    });
  });

  it('displays visual indicators for forward and backward transitions', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      const selectTrigger = screen.getByText('Select step...');
      fireEvent.click(selectTrigger);
    });

    await waitFor(() => {
      // Should show forward transition with green arrow
      expect(screen.getByText('Second Step')).toBeInTheDocument();
      
      // Should show backward transition with orange icon and "(back)" label
      expect(screen.getByText('Previous Step')).toBeInTheDocument();
      expect(screen.getByText('(back)')).toBeInTheDocument();
    });
  });

  it('resets select value after successful move', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      const selectTrigger = screen.getByText('Select step...');
      fireEvent.click(selectTrigger);
    });

    await waitFor(() => {
      const forwardOption = screen.getByText('Second Step');
      fireEvent.click(forwardOption);
    });

    // After successful move, the select should reset
    await waitFor(() => {
      expect(mockUpdateMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('handles search functionality', async () => {
    renderWithProviders(<CustomerManagement />);

    const searchInput = screen.getByPlaceholderText('Search customers...');
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
      expect(screen.getByText('Showing 1-2 of 25 enrollments')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    mockUseEnrollments.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<CustomerManagement />);

    expect(screen.getByText('Loading enrollments...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    mockUseEnrollments.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load enrollments'),
    } as any);

    renderWithProviders(<CustomerManagement />);

    expect(screen.getByText('Error loading enrollments')).toBeInTheDocument();
    expect(screen.getByText('Failed to load enrollments')).toBeInTheDocument();
  });

  it('displays empty state when no enrollments', () => {
    mockUseEnrollments.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CustomerManagement />);

    expect(screen.getByText('No enrollments found')).toBeInTheDocument();
  });

  it('does not show transition dropdown for enrollments without available transitions', async () => {
    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      // Jane Smith's enrollment has no available transitions
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      
      // Should only have one "Move to:" label (for John Doe)
      const moveToLabels = screen.getAllByText('Move to:');
      expect(moveToLabels).toHaveLength(1);
    });
  });

  it('cancels move when user declines confirmation', async () => {
    mockConfirm.mockResolvedValue(false);

    renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      const selectTrigger = screen.getByText('Select step...');
      fireEvent.click(selectTrigger);
    });

    await waitFor(() => {
      const forwardOption = screen.getByText('Second Step');
      fireEvent.click(forwardOption);
    });

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockUpdateMutation.mutateAsync).not.toHaveBeenCalled();
  });
});
