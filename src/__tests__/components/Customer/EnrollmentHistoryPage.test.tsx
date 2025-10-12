import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import EnrollmentHistoryPage from '@/components/Customer/EnrollmentHistoryPage';
import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';
import { useEnrollment } from '@/hooks/useEnrollmentQuery';

// Mock the hooks
vi.mock('@/hooks/useEnrollmentHistoryQuery');
vi.mock('@/hooks/useEnrollmentQuery');
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

const mockUseEnrollmentHistory = useEnrollmentHistory as jest.MockedFunction<typeof useEnrollmentHistory>;
const mockUseEnrollment = useEnrollment as jest.MockedFunction<typeof useEnrollment>;

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

    mockUseEnrollmentHistory.mockReturnValue({
      data: mockHistoryData,
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the enrollment history page', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Enrollment History')).toBeInTheDocument();
      expect(screen.getByText('History for John Doe in Test Tenant')).toBeInTheDocument();
      expect(screen.getByText('Back to Customer Management')).toBeInTheDocument();
    });
  });

  it('displays enrollment information card', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Flow')).toBeInTheDocument();
      expect(screen.getByText('Current Step')).toBeInTheDocument();
      expect(screen.getByText('Customer: John Doe (john@example.com)')).toBeInTheDocument();
      expect(screen.getByText(/Current Step: Current Step/)).toBeInTheDocument();
    });
  });

  it('displays history entries', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
      expect(screen.getByText('Second Step')).toBeInTheDocument();
      expect(screen.getByText('Final Step')).toBeInTheDocument();
      expect(screen.getByText('Changed by Admin User')).toBeInTheDocument();
      expect(screen.getByText('Changed by Manager User')).toBeInTheDocument();
    });
  });

  it('displays pagination information', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Showing 1-2 of 3 history entries')).toBeInTheDocument();
    });
  });

  it('handles page size change', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      const pageSizeSelect = screen.getByDisplayValue('10');
      fireEvent.click(pageSizeSelect);
    });

    const option25 = screen.getByText('25');
    fireEvent.click(option25);

    // Should call the hook with new page size
    expect(mockUseEnrollmentHistory).toHaveBeenCalledWith(
      'tenant-123',
      'enrollment-123',
      expect.objectContaining({
        page_size: 25,
        page: 1, // Should reset to page 1
      })
    );
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

  it('formats timestamps correctly', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      // Check that timestamps are formatted as locale strings
      expect(screen.getByText(/1\/1\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/1\/2\/2024/)).toBeInTheDocument();
    });
  });

  it('displays timeline indicators', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      // Timeline dots should be present (they have specific styling)
      const timelineElements = screen.getAllByText('Initial Step');
      expect(timelineElements.length).toBeGreaterThan(0);
    });
  });

  it('handles pagination with multiple pages', async () => {
    const multiPageData = {
      ...mockHistoryData,
      count: 25,
      next: 'http://api.example.com/page2',
    };

    mockUseEnrollmentHistory.mockReturnValue({
      data: multiPageData,
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Showing 1-2 of 25 history entries')).toBeInTheDocument();
      
      // Pagination controls should be visible
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeInTheDocument();
    });
  });

  it('uses correct enrollment ID from URL params', () => {
    renderWithProviders(<EnrollmentHistoryPage />, ['/customers/test-enrollment-456/history']);

    expect(mockUseEnrollment).toHaveBeenCalledWith('tenant-123', 'test-enrollment-456');
    expect(mockUseEnrollmentHistory).toHaveBeenCalledWith(
      'tenant-123',
      'test-enrollment-456',
      expect.any(Object)
    );
  });

  it('displays visual indicators for forward and backward transitions', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      // Forward transition (history-1) should show green arrow
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
      expect(screen.getByText('Second Step')).toBeInTheDocument();
      
      // Backward transition (history-2) should show orange icon and "(back)" label
      expect(screen.getByText('(deleted step)')).toBeInTheDocument(); // Updated for null step name
      expect(screen.getByText('(back)')).toBeInTheDocument();
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

  it('refetches history when page loads', async () => {
    const mockRefetch = jest.fn().mockResolvedValue({});
    
    mockUseEnrollmentHistory.mockReturnValue({
      data: mockHistoryData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as any);

    renderWithProviders(<EnrollmentHistoryPage />);

    // Should call refetch when component mounts
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('refetches history when enrollment ID changes', async () => {
    const mockRefetch = jest.fn().mockResolvedValue({});
    
    mockUseEnrollmentHistory.mockReturnValue({
      data: mockHistoryData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as any);

    const { rerender } = renderWithProviders(<EnrollmentHistoryPage />, ['/customers/enrollment-123/history']);

    // Clear previous calls
    mockRefetch.mockClear();

    // Simulate navigation to different enrollment
    rerender(<EnrollmentHistoryPage />);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('handles deleted steps gracefully in history display', async () => {
    renderWithProviders(<EnrollmentHistoryPage />);

    await waitFor(() => {
      // Should show "(deleted step)" for null step names
      expect(screen.getByText('(deleted step)')).toBeInTheDocument();
      
      // Should still show the transition with proper styling
      expect(screen.getByText('Second Step')).toBeInTheDocument();
      expect(screen.getByText('(back)')).toBeInTheDocument();
    });
  });
});
