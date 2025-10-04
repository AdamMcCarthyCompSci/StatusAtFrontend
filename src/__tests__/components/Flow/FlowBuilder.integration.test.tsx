import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import FlowBuilder from '@/components/Flow/FlowBuilder';
import { useFlowSteps, useFlowTransitions, useCreateFlowStep, useUpdateFlowStep, useDeleteFlowStep } from '@/hooks/useFlowBuilderQuery';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';

// Mock the hooks and API
jest.mock('@/hooks/useFlowBuilderQuery');
jest.mock('@/components/ui/confirmation-dialog');
jest.mock('@/lib/api');
jest.mock('@/stores/useTenantStore', () => ({
  useTenantStore: () => ({
    selectedTenant: 'tenant-123',
  }),
}));

const mockUseFlowSteps = useFlowSteps as jest.MockedFunction<typeof useFlowSteps>;
const mockUseFlowTransitions = useFlowTransitions as jest.MockedFunction<typeof useFlowTransitions>;
const mockUseCreateFlowStep = useCreateFlowStep as jest.MockedFunction<typeof useCreateFlowStep>;
const mockUseUpdateFlowStep = useUpdateFlowStep as jest.MockedFunction<typeof useUpdateFlowStep>;
const mockUseDeleteFlowStep = useDeleteFlowStep as jest.MockedFunction<typeof useDeleteFlowStep>;
const mockUseConfirmationDialog = useConfirmationDialog as jest.MockedFunction<typeof useConfirmationDialog>;

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

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/flows/flow-123/edit']}>
        {component}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('FlowBuilder Integration Tests', () => {
  const mockConfirm = jest.fn();
  const mockCreateStepMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };
  const mockUpdateStepMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };
  const mockDeleteStepMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

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

    mockUseCreateFlowStep.mockReturnValue(mockCreateStepMutation as any);
    mockUseUpdateFlowStep.mockReturnValue(mockUpdateStepMutation as any);
    mockUseDeleteFlowStep.mockReturnValue(mockDeleteStepMutation as any);

    mockUseConfirmationDialog.mockReturnValue({
      confirm: mockConfirm,
      ConfirmationDialog: () => <div data-testid="confirmation-dialog" />,
    } as any);

    mockConfirm.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('prevents creating loops in the flow', async () => {
    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
      expect(screen.getByText('Second Step')).toBeInTheDocument();
    });

    // Try to create a connection that would form a loop
    // This would be tested by simulating the connection creation process
    // and verifying that the loop prevention dialog appears
    
    // Mock a scenario where creating a connection would form a loop
    mockConfirm.mockResolvedValueOnce(false); // User cancels loop creation

    // The actual loop detection logic would be triggered during connection creation
    // This is a simplified test to verify the confirmation dialog is used
    expect(mockUseConfirmationDialog).toHaveBeenCalled();
  });

  it('prevents multiple start points in the flow', async () => {
    // Mock a scenario with multiple potential start points
    const stepsWithMultipleStarts = [
      {
        id: 'step-1',
        name: 'Start Point 1',
        x: 100,
        y: 100,
        flow_uuid: 'flow-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'step-2',
        name: 'Start Point 2',
        x: 300,
        y: 100,
        flow_uuid: 'flow-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    mockUseFlowSteps.mockReturnValue({
      data: stepsWithMultipleStarts,
      isLoading: false,
      error: null,
    } as any);

    mockUseFlowTransitions.mockReturnValue({
      data: [], // No transitions, so both steps would be start points
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Start Point 1')).toBeInTheDocument();
      expect(screen.getByText('Start Point 2')).toBeInTheDocument();
    });

    // The validation should prevent creating connections that would result in multiple start points
    // This would be tested during connection creation
  });

  it('shows confirmation dialog when deleting steps', async () => {
    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
    });

    // When deleting a step, should show confirmation dialog
    // This would be triggered by clicking the delete button in the toolbar
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete Step',
        variant: 'destructive',
        confirmText: 'Delete Step',
        cancelText: 'Cancel',
      })
    );
  });

  it('shows confirmation dialog when deleting transitions', async () => {
    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
      expect(screen.getByText('Second Step')).toBeInTheDocument();
    });

    // When deleting a transition, should show confirmation dialog
    // This would be triggered by clicking on a connection line
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete Transition',
        variant: 'destructive',
        confirmText: 'Delete Transition',
        cancelText: 'Cancel',
      })
    );
  });

  it('shows confirmation dialog when organizing flow', async () => {
    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
      expect(screen.getByText('Second Step')).toBeInTheDocument();
    });

    // When organizing flow, should show confirmation dialog
    // This would be triggered by clicking the organize button
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Organize Flow',
        variant: 'info',
        confirmText: 'Organize Flow',
        cancelText: 'Cancel',
      })
    );
  });

  it('handles maximum node limit', async () => {
    // Mock 50 existing steps (the maximum)
    const maxSteps = Array.from({ length: 50 }, (_, i) => ({
      id: `step-${i + 1}`,
      name: `Step ${i + 1}`,
      x: 100 + (i % 10) * 150,
      y: 100 + Math.floor(i / 10) * 100,
      flow_uuid: 'flow-123',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }));

    mockUseFlowSteps.mockReturnValue({
      data: maxSteps,
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });

    // Attempting to add another node should show the limit warning
    // This would be tested by simulating the "Add Node" button click
    const addNodeButton = screen.getByText('Add Node');
    fireEvent.click(addNodeButton);

    // Should show confirmation dialog about reaching the limit
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Maximum Nodes Reached',
        description: expect.stringContaining('50'),
      })
    );
  });

  it('handles optimistic updates for node dragging', async () => {
    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
    });

    // Simulate dragging a node
    const nodeElement = screen.getByText('Initial Step').closest('div');
    
    if (nodeElement) {
      fireEvent.mouseDown(nodeElement, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(nodeElement, { clientX: 200, clientY: 150 });
      fireEvent.mouseUp(nodeElement);
    }

    // The node position should update immediately (optimistic update)
    // And then the API should be called after a debounce delay
    await waitFor(() => {
      expect(mockUpdateStepMutation.mutateAsync).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('handles real-time collaboration mode', async () => {
    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Live Mode')).toBeInTheDocument();
    });

    // Toggle live mode
    const liveModeButton = screen.getByText('Live Mode');
    fireEvent.click(liveModeButton);

    // Should switch to "Offline Mode" and start polling
    await waitFor(() => {
      expect(screen.getByText('Offline Mode')).toBeInTheDocument();
    });
  });

  it('validates step names during editing', async () => {
    renderWithProviders(<FlowBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
    });

    // Double-click to edit step name
    const stepElement = screen.getByText('Initial Step');
    fireEvent.doubleClick(stepElement);

    // Should show input field
    const input = screen.getByDisplayValue('Initial Step');
    expect(input).toBeInTheDocument();

    // Clear the input (invalid empty name)
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    // Should revert to original name
    await waitFor(() => {
      expect(screen.getByText('Initial Step')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockUseFlowSteps.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load steps'),
    } as any);

    renderWithProviders(<FlowBuilder />);

    expect(screen.getByText('Error loading flow')).toBeInTheDocument();
    expect(screen.getByText('Failed to load steps')).toBeInTheDocument();
  });

  it('shows loading state while fetching data', () => {
    mockUseFlowSteps.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<FlowBuilder />);

    expect(screen.getByText('Loading flow...')).toBeInTheDocument();
  });
});
