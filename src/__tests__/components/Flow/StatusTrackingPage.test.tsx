import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import StatusTrackingPage from '@/components/Flow/StatusTrackingPage';
import { useEnrollment } from '@/hooks/useEnrollmentQuery';

// Mock the hooks and components
vi.mock('@/hooks/useEnrollmentQuery');
vi.mock('@/components/Flow/StatusTrackingViewer', () => ({
  StatusTrackingViewer: ({ flowName, currentStepUuid }: any) => (
    <div data-testid="status-tracking-viewer">
      <div>Flow: {flowName}</div>
      <div>Current Step: {currentStepUuid}</div>
    </div>
  ),
}));
vi.mock('@/stores/useTenantStore', () => ({
  useTenantStore: () => ({
    selectedTenant: 'tenant-123',
  }),
}));

const mockUseEnrollment = useEnrollment as any;

const mockEnrollment = {
  uuid: 'enrollment-123',
  user_name: 'John Doe',
  user_email: 'john@example.com',
  flow_name: 'Test Flow',
  flow_uuid: 'flow-123',
  tenant_name: 'Test Tenant',
  tenant_uuid: 'tenant-123',
  current_step_name: 'Initial Step',
  current_step_uuid: 'step-1',
  created_at: '2024-01-01T00:00:00Z',
};

const renderWithProviders = (component: React.ReactElement, initialEntries = ['/status-tracking/enrollment-123']) => {
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

describe('StatusTrackingPage', () => {
  beforeEach(() => {
    mockUseEnrollment.mockReturnValue({
      data: mockEnrollment,
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the status tracking page with enrollment details', async () => {
    renderWithProviders(<StatusTrackingPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Flow')).toBeInTheDocument();
      expect(screen.getByText('Status Tracking in Test Tenant')).toBeInTheDocument();
      expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
    });
  });

  it('displays enrollment summary card', async () => {
    renderWithProviders(<StatusTrackingPage />);

    await waitFor(() => {
      expect(screen.getByText('Current Progress')).toBeInTheDocument();
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
      expect(screen.getByText('Flow: Test Flow')).toBeInTheDocument();
      expect(screen.getByText('Tenant: Test Tenant')).toBeInTheDocument();
      expect(screen.getByText('Customer: John Doe (john@example.com)')).toBeInTheDocument();
    });
  });

  it('renders the status tracking viewer component', async () => {
    renderWithProviders(<StatusTrackingPage />);

    await waitFor(() => {
      const viewer = screen.getByTestId('status-tracking-viewer');
      expect(viewer).toBeInTheDocument();
      expect(screen.getByText('Flow: Test Flow')).toBeInTheDocument();
      expect(screen.getByText('Current Step: step-1')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    mockUseEnrollment.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<StatusTrackingPage />);

    expect(screen.getByText('Loading enrollment details...')).toBeInTheDocument();
  });

  it('displays error state when enrollment fails to load', () => {
    mockUseEnrollment.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load enrollment'),
    } as any);

    renderWithProviders(<StatusTrackingPage />);

    expect(screen.getByText('Error Loading Enrollment')).toBeInTheDocument();
    expect(screen.getByText('Failed to load enrollment')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('displays error state when enrollment is not found', () => {
    mockUseEnrollment.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<StatusTrackingPage />);

    expect(screen.getByText('Error Loading Enrollment')).toBeInTheDocument();
    expect(screen.getByText('Failed to load enrollment details')).toBeInTheDocument();
  });

  it('passes correct props to StatusTrackingViewer', async () => {
    renderWithProviders(<StatusTrackingPage />);

    await waitFor(() => {
      const viewer = screen.getByTestId('status-tracking-viewer');
      expect(viewer).toBeInTheDocument();
      
      // Check that the viewer receives the correct props
      expect(screen.getByText('Flow: Test Flow')).toBeInTheDocument();
      expect(screen.getByText('Current Step: step-1')).toBeInTheDocument();
    });
  });

  it('displays formatted enrollment date', async () => {
    renderWithProviders(<StatusTrackingPage />);

    await waitFor(() => {
      // The date should be formatted as a locale string
      expect(screen.getByText(/Started:/)).toBeInTheDocument();
    });
  });

  it('handles missing enrollment ID in URL', () => {
    renderWithProviders(<StatusTrackingPage />, ['/status-tracking/']);

    // Should still attempt to load but with empty ID
    expect(mockUseEnrollment).toHaveBeenCalledWith('tenant-123', '');
  });

  it('uses correct tenant from store', () => {
    renderWithProviders(<StatusTrackingPage />);

    expect(mockUseEnrollment).toHaveBeenCalledWith('tenant-123', 'enrollment-123');
  });

  it('displays enrollment creation date in summary card', async () => {
    renderWithProviders(<StatusTrackingPage />);

    await waitFor(() => {
      // Check that the enrollment date is displayed
      const dateElements = screen.getAllByText(/1\/1\/2024/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });
});
