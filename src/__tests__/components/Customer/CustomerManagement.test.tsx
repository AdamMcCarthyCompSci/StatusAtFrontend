import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import CustomerManagement from '@/components/Customer/CustomerManagement';
import {
  useEnrollments,
  useFlowsForFiltering,
  useFlowSteps,
} from '@/hooks/useEnrollmentQuery';
import { inviteApi } from '@/lib/api';

// Mock the hooks and API
vi.mock('@/hooks/useEnrollmentQuery');
vi.mock('@/lib/api', () => ({
  inviteApi: {
    createTenantInvite: vi.fn(),
  },
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

const mockFlows = [
  {
    uuid: 'flow-1',
    name: 'Onboarding Flow',
    description: 'Customer onboarding process',
  },
  {
    uuid: 'flow-2',
    name: 'Support Ticket Flow',
    description: 'Support ticket tracking',
  },
];

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
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
      data: mockFlows,
      isLoading: false,
      error: null,
    } as any);

    mockUseFlowSteps.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    // Reset invite API mock
    vi.mocked(inviteApi.createTenantInvite).mockReset();

    // Mock scrollIntoView for Radix UI Select
    Element.prototype.scrollIntoView = vi.fn();
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
      expect(
        screen.getByPlaceholderText('Name or email...')
      ).toBeInTheDocument();
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

    expect(
      screen.getByText('Failed to load customers. Please try again.')
    ).toBeInTheDocument();
  });

  it('displays empty state when no enrollments', () => {
    mockUseEnrollments.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CustomerManagement />);

    expect(screen.getByText('No Customers Found')).toBeInTheDocument();
    expect(
      screen.getByText('No customers are enrolled in any flows yet.')
    ).toBeInTheDocument();
  });

  describe('Invite Customer functionality', () => {
    it('displays invite customer button', async () => {
      renderWithProviders(<CustomerManagement />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Invite Customer/i })
        ).toBeInTheDocument();
      });
    });

    it('opens invite modal when button is clicked', async () => {
      renderWithProviders(<CustomerManagement />);

      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      await waitFor(() => {
        // Check for modal-specific elements
        expect(screen.getByLabelText(/Customer Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Flow/i)).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /Send Invitation/i })
        ).toBeInTheDocument();
      });
    });

    it('displays flow selection dropdown in modal', async () => {
      renderWithProviders(<CustomerManagement />);

      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/Flow/i)).toBeInTheDocument();
      });
    });

    it('sends invite when form is submitted with valid data', async () => {
      vi.mocked(inviteApi.createTenantInvite).mockResolvedValue({} as any);

      renderWithProviders(<CustomerManagement />);

      // Open modal
      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      // Fill in email
      const emailInput = screen.getByLabelText(/Customer Email/i);
      fireEvent.change(emailInput, {
        target: { value: 'newcustomer@example.com' },
      });

      // Select flow - find the Select trigger button
      const flowSelect = screen.getByLabelText(/Flow/i);
      fireEvent.click(flowSelect);

      // Wait for dropdown to appear and select flow
      await waitFor(() => {
        const options = screen.getAllByText('Onboarding Flow');
        expect(options.length).toBeGreaterThan(0);
      });

      // Click the option within the Radix UI select (the second one, not the hidden option)
      const options = screen.getAllByText('Onboarding Flow');
      fireEvent.click(options[options.length - 1]);

      // Submit form
      const submitButton = screen.getByRole('button', {
        name: /Send Invitation/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(inviteApi.createTenantInvite).toHaveBeenCalledWith(
          'tenant-123',
          {
            email: 'newcustomer@example.com',
            invite_type: 'flow_enrollment',
            flow: 'flow-1',
          }
        );
      });
    });

    it('closes modal after successful invite', async () => {
      vi.mocked(inviteApi.createTenantInvite).mockResolvedValue({} as any);

      renderWithProviders(<CustomerManagement />);

      // Open modal
      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      // Fill form
      const emailInput = screen.getByLabelText(/Customer Email/i);
      fireEvent.change(emailInput, {
        target: { value: 'newcustomer@example.com' },
      });

      const flowSelect = screen.getByLabelText(/Flow/i);
      fireEvent.click(flowSelect);
      await waitFor(() => {
        const options = screen.getAllByText('Onboarding Flow');
        expect(options.length).toBeGreaterThan(0);
      });
      const options = screen.getAllByText('Onboarding Flow');
      fireEvent.click(options[options.length - 1]);

      // Submit
      const submitButton = screen.getByRole('button', {
        name: /Send Invitation/i,
      });
      fireEvent.click(submitButton);

      // Modal should close - check by looking for modal-specific elements
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: /Send Invitation/i })
        ).not.toBeInTheDocument();
      });
    });

    it('displays error message when invite fails', async () => {
      vi.mocked(inviteApi.createTenantInvite).mockRejectedValue({
        response: {
          status: 400,
          data: {
            email: ['Invalid email address'],
          },
        },
        data: {
          email: ['Invalid email address'],
        },
      });

      renderWithProviders(<CustomerManagement />);

      // Open modal
      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/Customer Email/i)).toBeInTheDocument();
      });

      // Fill form
      const emailInput = screen.getByLabelText(/Customer Email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const flowSelect = screen.getByLabelText(/Flow/i);
      fireEvent.click(flowSelect);
      await waitFor(() => {
        const options = screen.getAllByText('Onboarding Flow');
        expect(options.length).toBeGreaterThan(0);
      });
      const options = screen.getAllByText('Onboarding Flow');
      fireEvent.click(options[options.length - 1]);

      // Wait a bit for the select to update state and button to be enabled
      await waitFor(() => {
        const submitButton = screen.getByRole('button', {
          name: /Send Invitation/i,
        });
        expect(submitButton).not.toBeDisabled();
      });

      // Submit
      const submitButton = screen.getByRole('button', {
        name: /Send Invitation/i,
      });
      fireEvent.submit(submitButton.closest('form')!);

      // Wait for API call
      await waitFor(() => {
        expect(inviteApi.createTenantInvite).toHaveBeenCalled();
      });

      // Error should be displayed
      await waitFor(
        () => {
          expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('displays 403 error message for tier limit', async () => {
      vi.mocked(inviteApi.createTenantInvite).mockRejectedValue({
        response: {
          status: 403,
          data: {
            detail: 'Your organization has reached its customer limit',
          },
        },
      });

      renderWithProviders(<CustomerManagement />);

      // Open modal
      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      // Fill form
      const emailInput = screen.getByLabelText(/Customer Email/i);
      fireEvent.change(emailInput, {
        target: { value: 'customer@example.com' },
      });

      const flowSelect = screen.getByLabelText(/Flow/i);
      fireEvent.click(flowSelect);
      await waitFor(() => {
        const options = screen.getAllByText('Onboarding Flow');
        expect(options.length).toBeGreaterThan(0);
      });
      const options = screen.getAllByText('Onboarding Flow');
      fireEvent.click(options[options.length - 1]);

      // Submit
      const submitButton = screen.getByRole('button', {
        name: /Send Invitation/i,
      });
      fireEvent.click(submitButton);

      // 403 error should be displayed
      await waitFor(() => {
        expect(
          screen.getByText(/has reached its customer limit/i)
        ).toBeInTheDocument();
      });
    });

    it('displays all flows in dropdown', async () => {
      renderWithProviders(<CustomerManagement />);

      // Open modal
      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      // Open flow dropdown
      const flowSelect = screen.getByLabelText(/Flow/i);
      fireEvent.click(flowSelect);

      // Both flows should be visible (there may be multiple due to hidden select + visible options)
      await waitFor(() => {
        expect(screen.getAllByText('Onboarding Flow').length).toBeGreaterThan(
          0
        );
        expect(
          screen.getAllByText('Support Ticket Flow').length
        ).toBeGreaterThan(0);
      });
    });

    it('disables submit button when form is incomplete', async () => {
      renderWithProviders(<CustomerManagement />);

      // Open modal
      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', {
          name: /Send Invitation/i,
        });
        expect(submitButton).toBeDisabled();
      });
    });

    it('resets form when modal is closed', async () => {
      renderWithProviders(<CustomerManagement />);

      // Open modal
      const inviteButton = screen.getByRole('button', {
        name: /Invite Customer/i,
      });
      fireEvent.click(inviteButton);

      // Fill form
      const emailInput = screen.getByLabelText(/Customer Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Close modal
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      // Reopen modal
      fireEvent.click(inviteButton);

      // Form should be reset
      await waitFor(() => {
        const emailInputReopened = screen.getByLabelText(
          /Customer Email/i
        ) as HTMLInputElement;
        expect(emailInputReopened.value).toBe('');
      });
    });
  });
});
