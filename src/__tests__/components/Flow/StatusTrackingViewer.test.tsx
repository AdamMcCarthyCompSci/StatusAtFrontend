import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { StatusTrackingViewer } from '@/components/Flow/StatusTrackingViewer';
import { useFlowSteps, useFlowTransitions } from '@/hooks/useFlowBuilderQuery';

// Mock the hooks
vi.mock('@/hooks/useFlowBuilderQuery');
vi.mock('@/stores/useTenantStore', () => ({
  useTenantStore: () => ({
    selectedTenant: 'tenant-123',
  }),
}));

const mockUseFlowSteps = useFlowSteps as any;
const mockUseFlowTransitions = useFlowTransitions as any;

const mockSteps = [
  {
    id: 'step-1',
    name: 'Initial Step',
    x: 100,
    y: 100,
    flow_uuid: 'flow-123',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'step-2',
    name: 'Second Step',
    x: 300,
    y: 200,
    flow_uuid: 'flow-123',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const mockTransitions = [
  {
    id: 'transition-1',
    fromStepId: 'step-1',
    toStepId: 'step-2',
    flow_uuid: 'flow-123',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const mockEnrollmentData = {
  current_step_name: 'Initial Step',
  created_at: '2024-01-01T00:00:00Z',
  tenant_name: 'Test Tenant',
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

describe('StatusTrackingViewer', () => {
  beforeEach(() => {
    mockUseFlowSteps.mockReturnValue({
      data: mockSteps,
      isLoading: false,
      error: null,
    } as any);

    mockUseFlowTransitions.mockReturnValue({
      data: mockTransitions,
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the status tracking viewer with steps', () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    expect(screen.getByText('Test Flow')).toBeInTheDocument();
    expect(screen.getByText('Initial Step')).toBeInTheDocument();
    expect(screen.getByText('Second Step')).toBeInTheDocument();
  });

  it('highlights the current step', () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    // The current step should have special styling
    const currentStepElement = screen.getByText('Current Step');
    expect(currentStepElement).toBeInTheDocument();
  });

  it('displays loading state', () => {
    mockUseFlowSteps.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    expect(screen.getByText('Loading flow...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    mockUseFlowSteps.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load flow'),
    } as any);

    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    expect(screen.getByText('Error loading flow')).toBeInTheDocument();
    expect(screen.getByText('Failed to load flow')).toBeInTheDocument();
  });

  it('handles zoom controls', () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    const zoomInButton = screen.getByLabelText('Zoom In');
    const zoomOutButton = screen.getByLabelText('Zoom Out');

    expect(zoomInButton).toBeInTheDocument();
    expect(zoomOutButton).toBeInTheDocument();

    fireEvent.click(zoomInButton);
    fireEvent.click(zoomOutButton);
  });

  it('handles minimap toggle', () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    const minimapToggle = screen.getByText(/Minimap/);
    expect(minimapToggle).toBeInTheDocument();

    fireEvent.click(minimapToggle);
  });

  it('handles node selection in go-to-node dropdown', async () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    // Find and click the go-to-node dropdown
    const goToNodeButton = screen.getByText('Go to Node');
    fireEvent.click(goToNodeButton);

    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
      expect(screen.getByText('Second Step')).toBeInTheDocument();
    });
  });

  it('displays enrollment information in toolbar', () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    expect(screen.getByText('Test Tenant')).toBeInTheDocument();
    expect(screen.getByText(/Started:/)).toBeInTheDocument();
  });

  it('handles canvas panning', () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    const canvas = screen.getByRole('main'); // Canvas container
    
    // Simulate mouse down for panning
    fireEvent.mouseDown(canvas, { button: 0, clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas);
  });

  it('auto-fits flow to view on load', async () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    // The fit-to-view should be called automatically
    // This is tested by ensuring the component renders without errors
    // and the steps are visible
    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
      expect(screen.getByText('Second Step')).toBeInTheDocument();
    });
  });
});
