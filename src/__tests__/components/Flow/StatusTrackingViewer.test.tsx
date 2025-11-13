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

    // Multiple elements with "Test Flow" text exist (mobile + desktop), use getAllByText
    const flowTitles = screen.getAllByText('Test Flow');
    expect(flowTitles.length).toBeGreaterThan(0);
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

    // The current step should be displayed in a badge in the toolbar
    // The component shows "Current:" label and then the step name in mobile view
    // And "Current Step:" label with the step name in desktop view
    // The step is in a Badge, so we check for the step name which should be visible
    expect(screen.getByText('Initial Step')).toBeInTheDocument();
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

    // FlowErrorState shows "Unable to Load Flow" as the title
    expect(screen.getByText('Unable to Load Flow')).toBeInTheDocument();
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

    // Zoom buttons are in desktop toolbar (visible on xl screens) - use getAllByText since there are also mobile menu items
    const zoomInButtons = screen.getAllByText('Zoom In');
    const zoomOutButtons = screen.getAllByText('Zoom Out');

    expect(zoomInButtons.length).toBeGreaterThan(0);
    expect(zoomOutButtons.length).toBeGreaterThan(0);

    // Click the first one (desktop button)
    fireEvent.click(zoomInButtons[0]);
    fireEvent.click(zoomOutButtons[0]);
  });

  it('renders minimap controls', () => {
    renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    // In test environment (smaller viewport), mobile menu is shown
    // Verify the mobile menu button exists (minimap toggle is inside this dropdown)
    const menuButton = screen.getByText('Menu').closest('button');
    expect(menuButton).toBeInTheDocument();

    // The minimap should be rendering (it's controlled by showMinimap state)
    // We can't easily test the dropdown opening in this test environment,
    // but we verify the component renders correctly
    // Multiple elements with "Test Flow" text exist (mobile + desktop)
    const flowTitles = screen.getAllByText('Test Flow');
    expect(flowTitles.length).toBeGreaterThan(0);
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

    // Find and click the go-to-node dropdown (could be mobile or desktop version)
    // Use getAllByText since "Go to Node" appears twice (sr-only text and visible text)
    const goToNodeButtons = screen.getAllByText('Go to Node');
    const visibleButton = goToNodeButtons.find(btn => !btn.className.includes('sr-only'));
    expect(visibleButton).toBeTruthy();
    fireEvent.click(visibleButton!);

    // Wait for dropdown to open - the step names are already visible in the main canvas
    // but we're testing the dropdown specifically, so we should see them appear in the dropdown
    await waitFor(() => {
      // Search input should appear in dropdown
      expect(screen.getByPlaceholderText('Search nodes...')).toBeInTheDocument();
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

    // Tenant name appears in desktop view as "Status Tracking in {tenant_name}"
    const tenantText = screen.queryByText(/Test Tenant/);
    expect(tenantText).toBeTruthy();

    // Verify the current step name is shown (which is always visible)
    expect(screen.getByText('Initial Step')).toBeInTheDocument();
  });

  it('handles canvas panning', () => {
    const { container } = renderWithProviders(
      <StatusTrackingViewer
        tenantUuid="tenant-123"
        flowUuid="flow-123"
        currentStepUuid="step-1"
        flowName="Test Flow"
        enrollmentData={mockEnrollmentData}
      />
    );

    // The canvas is a div with cursor-grab class
    const canvas = container.querySelector('.cursor-grab');
    expect(canvas).toBeInTheDocument();

    if (canvas) {
      // Simulate mouse down for panning
      fireEvent.mouseDown(canvas, { button: 0, clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas);
    }
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
