import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ConfirmationDialog, useConfirmationDialog } from '@/components/ui/confirmation-dialog';

// Mock the Radix UI components
vi.mock('@radix-ui/react-alert-dialog', () => ({
  Root: ({ children, open }: any) => open ? <div data-testid="alert-dialog-root">{children}</div> : null,
  Trigger: ({ children, ...props }: any) => <button data-testid="alert-dialog-trigger" {...props}>{children}</button>,
  Portal: ({ children }: any) => <div data-testid="alert-dialog-portal">{children}</div>,
  Overlay: ({ children, ...props }: any) => <div data-testid="alert-dialog-overlay" {...props}>{children}</div>,
  Content: ({ children, ...props }: any) => <div data-testid="alert-dialog-content" {...props}>{children}</div>,
  Title: ({ children, ...props }: any) => <h2 data-testid="alert-dialog-title" {...props}>{children}</h2>,
  Description: ({ children, ...props }: any) => <p data-testid="alert-dialog-description" {...props}>{children}</p>,
  Action: ({ children, onClick, ...props }: any) => (
    <button data-testid="alert-dialog-action" onClick={onClick} {...props}>{children}</button>
  ),
  Cancel: ({ children, onClick, ...props }: any) => (
    <button data-testid="alert-dialog-cancel" onClick={onClick} {...props}>{children}</button>
  ),
}));

describe('ConfirmationDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Test Title',
    description: 'Test Description',
    onConfirm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(<ConfirmationDialog {...defaultProps} />);
    
    expect(screen.getByTestId('alert-dialog-root')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with custom confirm and cancel text', () => {
    render(
      <ConfirmationDialog
        {...defaultProps}
        confirmText="Delete Now"
        cancelText="Keep It"
      />
    );
    
    expect(screen.getByText('Delete Now')).toBeInTheDocument();
    expect(screen.getByText('Keep It')).toBeInTheDocument();
  });

  it('shows correct icon and styling for destructive variant', () => {
    render(<ConfirmationDialog {...defaultProps} variant="destructive" />);
    
    // Check for trash icon (we can't easily test the icon itself, but we can check the button text)
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows correct icon and styling for promote variant', () => {
    render(<ConfirmationDialog {...defaultProps} variant="promote" />);
    
    expect(screen.getByText('Promote')).toBeInTheDocument();
  });

  it('shows correct icon and styling for demote variant', () => {
    render(<ConfirmationDialog {...defaultProps} variant="demote" />);
    
    expect(screen.getByText('Demote')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    render(<ConfirmationDialog {...defaultProps} onConfirm={onConfirm} />);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChange when cancel button is clicked', () => {
    const onOpenChange = vi.fn();
    render(<ConfirmationDialog {...defaultProps} onOpenChange={onOpenChange} cancelText="Cancel" />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows loading state', () => {
    render(<ConfirmationDialog {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    render(<ConfirmationDialog {...defaultProps} loading={true} cancelText="Cancel" />);

    const confirmButton = screen.getByText('Processing...');
    const cancelButton = screen.getByText('Cancel');

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('does not close dialog when onConfirm throws an error', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('Test error'));
    const onOpenChange = vi.fn();
    
    render(
      <ConfirmationDialog
        {...defaultProps}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
      />
    );
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
    
    // Dialog should not close when error occurs
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('useConfirmationDialog', () => {
  function TestComponent() {
    const { confirm, ConfirmationDialog } = useConfirmationDialog();
    
    const handleClick = async () => {
      const result = await confirm({
        title: 'Test Confirmation',
        description: 'Are you sure?',
        variant: 'destructive',
      });
      
      // Add result to DOM for testing
      const resultDiv = document.createElement('div');
      resultDiv.textContent = `Result: ${result}`;
      resultDiv.setAttribute('data-testid', 'confirmation-result');
      document.body.appendChild(resultDiv);
    };
    
    return (
      <div>
        <button onClick={handleClick} data-testid="trigger-button">
          Show Confirmation
        </button>
        <ConfirmationDialog />
      </div>
    );
  }

  beforeEach(() => {
    // Clean up any result divs from previous tests
    const existingResults = document.querySelectorAll('[data-testid="confirmation-result"]');
    existingResults.forEach(el => el.remove());
  });

  it('shows confirmation dialog when confirm is called', async () => {
    render(<TestComponent />);
    
    const triggerButton = screen.getByTestId('trigger-button');
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Confirmation')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });
  });

  it('resolves with true when confirmed', async () => {
    render(<TestComponent />);
    
    const triggerButton = screen.getByTestId('trigger-button');
    fireEvent.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Confirmation')).toBeInTheDocument();
    });
    
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      const result = screen.getByTestId('confirmation-result');
      expect(result).toHaveTextContent('Result: true');
    });
  });

  it('resolves with false when cancelled', async () => {
    // Create a custom TestComponent that includes cancelText
    function TestComponentWithCancel() {
      const { confirm, ConfirmationDialog } = useConfirmationDialog();

      const handleClick = async () => {
        const result = await confirm({
          title: 'Test Confirmation',
          description: 'Are you sure?',
          variant: 'destructive',
          cancelText: 'Cancel', // Added cancelText here
        });

        // Add result to DOM for testing
        const resultDiv = document.createElement('div');
        resultDiv.textContent = `Result: ${result}`;
        resultDiv.setAttribute('data-testid', 'confirmation-result');
        document.body.appendChild(resultDiv);
      };

      return (
        <div>
          <button onClick={handleClick} data-testid="trigger-button">
            Show Confirmation
          </button>
          <ConfirmationDialog />
        </div>
      );
    }

    render(<TestComponentWithCancel />);

    const triggerButton = screen.getByTestId('trigger-button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText('Test Confirmation')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      const result = screen.getByTestId('confirmation-result');
      expect(result).toHaveTextContent('Result: false');
    }, { timeout: 2000 });
  });
});
