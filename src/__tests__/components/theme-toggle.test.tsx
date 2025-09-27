import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../../components/ui/theme-toggle';

// Mock the useAppStore hook
const mockSetTheme = vitest.fn();
vitest.mock('../../stores/useAppStore', () => ({
  useAppStore: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders theme toggle button', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Toggle theme')).toBeInTheDocument();
  });

  it('calls setTheme when clicked', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Toggle theme');
  });
});
