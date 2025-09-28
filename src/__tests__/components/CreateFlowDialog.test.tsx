import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import CreateFlowDialog from '../../components/Flow/CreateFlowDialog';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const mockProps = {
  tenantUuid: '4c892c79-e212-4189-a8de-8e3df52fc461',
  tenantName: 'Test Tenant 1',
  onSuccess: vi.fn(),
};

describe('CreateFlowDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create button initially', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <CreateFlowDialog {...mockProps} />
      </Wrapper>
    );

    expect(screen.getByText('Create New Flow')).toBeInTheDocument();
  });

  it('should open dialog when create button is clicked', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <CreateFlowDialog {...mockProps} />
      </Wrapper>
    );

    fireEvent.click(screen.getByText('Create New Flow'));

    expect(screen.getByText('Create a new status flow for Test Tenant 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Flow Name')).toBeInTheDocument();
  });

  it('should show validation error for empty flow name', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <CreateFlowDialog {...mockProps} />
      </Wrapper>
    );

    // Open dialog
    fireEvent.click(screen.getByText('Create New Flow'));

    // Try to submit without entering a name
    const createButton = screen.getByRole('button', { name: /create flow/i });
    fireEvent.click(createButton);

    // The button should be disabled when no name is entered
    expect(createButton).toBeDisabled();
  });

  it('should create flow with valid input', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <CreateFlowDialog {...mockProps} />
      </Wrapper>
    );

    // Open dialog
    fireEvent.click(screen.getByText('Create New Flow'));

    // Enter flow name
    const nameInput = screen.getByLabelText('Flow Name');
    fireEvent.change(nameInput, { target: { value: 'Test Flow' } });

    // Submit form
    const createButton = screen.getByRole('button', { name: /create flow/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should close dialog when cancel is clicked', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <CreateFlowDialog {...mockProps} />
      </Wrapper>
    );

    // Open dialog
    fireEvent.click(screen.getByText('Create New Flow'));

    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));

    // Dialog should be closed
    expect(screen.queryByText('Create a new status flow for Test Tenant 1')).not.toBeInTheDocument();
  });

  it('should disable form while creating', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <CreateFlowDialog {...mockProps} />
      </Wrapper>
    );

    // Open dialog
    fireEvent.click(screen.getByText('Create New Flow'));

    // Enter flow name
    const nameInput = screen.getByLabelText('Flow Name');
    fireEvent.change(nameInput, { target: { value: 'Test Flow' } });

    // Submit form
    const createButton = screen.getByRole('button', { name: /create flow/i });
    fireEvent.click(createButton);

    // Form should be disabled during creation
    expect(nameInput).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});
