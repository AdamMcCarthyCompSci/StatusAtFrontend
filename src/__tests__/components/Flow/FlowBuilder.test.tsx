import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FlowBuilder from '../../../components/Flow/FlowBuilder';
import { useTenantStore } from '../../../stores/useTenantStore';

// Mock the stores
vi.mock('../../../stores/useTenantStore');
const mockUseTenantStore = useTenantStore as ReturnType<typeof vi.fn>;

// Mock the flow query hook
vi.mock('../../../hooks/useFlowQuery', () => ({
  useFlow: vi.fn(() => ({
    data: {
      uuid: 'test-flow-id',
      name: 'Test Flow',
      tenant_name: 'Test Tenant',
      created_at: '2024-01-01T00:00:00Z'
    },
    isLoading: false,
    error: null
  }))
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock getBoundingClientRect
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  configurable: true,
  value: vi.fn(() => ({
    width: 800,
    height: 600,
    top: 0,
    left: 0,
    bottom: 600,
    right: 800,
    x: 0,
    y: 0,
    toJSON: () => ({})
  })),
});

// Mock addEventListener for wheel events
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
Object.defineProperty(HTMLElement.prototype, 'addEventListener', {
  configurable: true,
  value: mockAddEventListener,
});
Object.defineProperty(HTMLElement.prototype, 'removeEventListener', {
  configurable: true,
  value: mockRemoveEventListener,
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/flows/test-flow-id/edit']}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('FlowBuilder Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTenantStore.mockReturnValue({
      selectedTenant: 'test-tenant-id'
    });
  });

  it('should render FlowBuilder with toolbar and canvas', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    // Should show the toolbar
    await waitFor(() => {
      expect(screen.getByText('Flow Builder')).toBeInTheDocument();
      expect(screen.getByText('Editing: Test Flow')).toBeInTheDocument();
    });

    // Should show toolbar controls
    expect(screen.getByText('Add Node')).toBeInTheDocument();
    expect(screen.getByText('Reset View')).toBeInTheDocument();
    expect(screen.getByText('Fit to View')).toBeInTheDocument();
    expect(screen.getByText('Go to Node')).toBeInTheDocument();
  });

  it('should render initial nodes', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Process')).toBeInTheDocument();
      expect(screen.getByText('End')).toBeInTheDocument();
    });
  });

  it('should show tutorial overlay initially', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Flow Builder Tutorial')).toBeInTheDocument();
      expect(screen.getByText(/Creating Connections:/)).toBeInTheDocument();
      expect(screen.getByText(/Deleting Connections:/)).toBeInTheDocument();
    });
  });

  it('should close tutorial when "Got it!" is clicked', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Flow Builder Tutorial')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Got it!'));

    await waitFor(() => {
      expect(screen.queryByText('Flow Builder Tutorial')).not.toBeInTheDocument();
    });
  });

  it('should create new node when Add Node is clicked', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    // Close tutorial first
    await waitFor(() => {
      expect(screen.getByText('Got it!')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Got it!'));

    // Click Add Node
    fireEvent.click(screen.getByText('Add Node'));

    // Should create a new node with default name
    await waitFor(() => {
      expect(screen.getByText('New Step')).toBeInTheDocument();
    });
  });

  it('should show delete button when node is selected', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    // Close tutorial
    await waitFor(() => {
      expect(screen.getByText('Got it!')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Got it!'));

    // Click on a node to select it
    const startNode = screen.getByText('Start');
    fireEvent.mouseDown(startNode.closest('div')!);

    // Should show delete button
    await waitFor(() => {
      expect(screen.getByText('Delete Node')).toBeInTheDocument();
    });
  });

  it('should delete node when Delete Node is clicked', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    // Close tutorial
    await waitFor(() => {
      expect(screen.getByText('Got it!')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Got it!'));

    // Select and delete a node
    const startNode = screen.getByText('Start');
    fireEvent.mouseDown(startNode.closest('div')!);

    await waitFor(() => {
      expect(screen.getByText('Delete Node')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete Node'));

    // Node should be removed
    await waitFor(() => {
      expect(screen.queryByText('Start')).not.toBeInTheDocument();
    });
  });

  it('should enter edit mode when node is double-clicked', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    // Close tutorial
    await waitFor(() => {
      expect(screen.getByText('Got it!')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Got it!'));

    // Double-click a node
    const processNode = screen.getByText('Process');
    fireEvent.doubleClick(processNode.closest('div')!);

    // Should show input field
    await waitFor(() => {
      const input = screen.getByDisplayValue('Process');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });
  });

  it('should update node name when edited', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    // Close tutorial
    await waitFor(() => {
      expect(screen.getByText('Got it!')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Got it!'));

    // Double-click and edit node
    const processNode = screen.getByText('Process');
    fireEvent.doubleClick(processNode.closest('div')!);

    const input = await screen.findByDisplayValue('Process');
    fireEvent.change(input, { target: { value: 'Updated Process' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should show updated name
    await waitFor(() => {
      expect(screen.getByText('Updated Process')).toBeInTheDocument();
      expect(screen.queryByText('Process')).not.toBeInTheDocument();
    });
  });

  it('should show minimap', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Minimap')).toBeInTheDocument();
    });
  });

  it('should handle zoom controls', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Flow Builder')).toBeInTheDocument();
    });

    // Should have zoom controls (icons)
    const zoomButtons = screen.getAllByRole('button');
    const zoomInButton = zoomButtons.find(btn => btn.querySelector('.lucide-zoom-in'));
    const zoomOutButton = zoomButtons.find(btn => btn.querySelector('.lucide-zoom-out'));

    expect(zoomInButton).toBeInTheDocument();
    expect(zoomOutButton).toBeInTheDocument();
  });

  it('should handle canvas mouse interactions', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    // Close tutorial
    await waitFor(() => {
      expect(screen.getByText('Got it!')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Got it!'));

    // Find the canvas area (should have cursor-grab class)
    const canvas = document.querySelector('.cursor-grab');
    expect(canvas).toBeInTheDocument();

    // Test mouse down on canvas
    if (canvas) {
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      
      // Should change to grabbing cursor
      await waitFor(() => {
        expect(document.querySelector('.cursor-grabbing')).toBeInTheDocument();
      });
    }
  });

  it('should set up wheel event listener for zoom', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    // Should have added wheel event listener
    expect(mockAddEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), { passive: false });
  });

  it('should navigate back to flows', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <FlowBuilder />
      </Wrapper>
    );

    await waitFor(() => {
      const backLink = screen.getByRole('link', { name: /back to flows/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/flows');
    });
  });

  describe('Error Handling', () => {
    it('should show loading state when flow is loading', () => {
      // Mock loading state
      vi.doMock('../../../hooks/useFlowQuery', () => ({
        useFlow: vi.fn(() => ({
          data: null,
          isLoading: true,
          error: null
        }))
      }));

      const Wrapper = createWrapper();
      
      render(
        <Wrapper>
          <FlowBuilder />
        </Wrapper>
      );

      expect(screen.getByText('Loading flow...')).toBeInTheDocument();
    });

    it('should show error state when flow fails to load', () => {
      // Mock error state
      vi.doMock('../../../hooks/useFlowQuery', () => ({
        useFlow: vi.fn(() => ({
          data: null,
          isLoading: false,
          error: new Error('Failed to load flow')
        }))
      }));

      const Wrapper = createWrapper();
      
      render(
        <Wrapper>
          <FlowBuilder />
        </Wrapper>
      );

      expect(screen.getByText('Unable to Load Flow')).toBeInTheDocument();
      expect(screen.getByText('Failed to load flow')).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should remove wheel event listener on unmount', () => {
      const Wrapper = createWrapper();
      
      const { unmount } = render(
        <Wrapper>
          <FlowBuilder />
        </Wrapper>
      );

      unmount();

      // Should have removed the event listener
      expect(mockRemoveEventListener).toHaveBeenCalledWith('wheel', expect.any(Function));
    });
  });
});
