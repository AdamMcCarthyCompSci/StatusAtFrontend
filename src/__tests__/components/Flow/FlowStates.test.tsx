import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { FlowLoadingState } from '../../../components/Flow/components/FlowLoadingState';
import { FlowErrorState } from '../../../components/Flow/components/FlowErrorState';

// Wrapper for components that need router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Flow State Components', () => {
  describe('FlowLoadingState', () => {
    it('should render loading spinner and text', () => {
      render(<FlowLoadingState />);
      
      expect(screen.getByText('Loading flow...')).toBeInTheDocument();
      
      // Check for loading spinner (div with animate-spin class)
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-primary');
    });

    it('should have proper layout and styling', () => {
      const { container } = render(<FlowLoadingState />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('min-h-screen', 'bg-background', 'flex', 'items-center', 'justify-center');
      
      const textContainer = screen.getByText('Loading flow...').closest('div');
      expect(textContainer).toHaveClass('text-center');
    });

    it('should center content vertically and horizontally', () => {
      const { container } = render(<FlowLoadingState />);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('min-h-screen', 'bg-background', 'flex', 'items-center', 'justify-center');
    });
  });

  describe('FlowErrorState', () => {
    it('should render error message for Error object', () => {
      const error = new Error('Failed to load flow data');
      
      render(
        <RouterWrapper>
          <FlowErrorState error={error} />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Unable to Load Flow')).toBeInTheDocument();
      expect(screen.getByText('Failed to load flow data')).toBeInTheDocument();
    });

    it('should render generic error message for non-Error objects', () => {
      const error = 'String error message';
      
      render(
        <RouterWrapper>
          <FlowErrorState error={error} />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Unable to Load Flow')).toBeInTheDocument();
      expect(screen.getByText('An error occurred while loading the flow.')).toBeInTheDocument();
    });

    it('should render generic error message for null/undefined', () => {
      render(
        <RouterWrapper>
          <FlowErrorState error={null} />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Unable to Load Flow')).toBeInTheDocument();
      expect(screen.getByText('An error occurred while loading the flow.')).toBeInTheDocument();
    });

    it('should have back to flows navigation link', () => {
      const error = new Error('Test error');
      
      render(
        <RouterWrapper>
          <FlowErrorState error={error} />
        </RouterWrapper>
      );
      
      const backLink = screen.getByRole('link', { name: /back to flows/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/flows');
    });

    it('should display arrow icon in back button', () => {
      const error = new Error('Test error');
      
      render(
        <RouterWrapper>
          <FlowErrorState error={error} />
        </RouterWrapper>
      );
      
      // Check for ArrowLeft icon (should have specific classes)
      const icon = document.querySelector('.h-4.w-4');
      expect(icon).toBeInTheDocument();
    });

    it('should have proper layout and styling', () => {
      const error = new Error('Test error');
      
      const { container } = render(
        <RouterWrapper>
          <FlowErrorState error={error} />
        </RouterWrapper>
      );
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('min-h-screen', 'bg-background', 'flex', 'items-center', 'justify-center');
      
      const textContainer = screen.getByText('Unable to Load Flow').closest('div');
      expect(textContainer).toHaveClass('text-center');
    });

    it('should have proper heading hierarchy', () => {
      const error = new Error('Test error');
      
      render(
        <RouterWrapper>
          <FlowErrorState error={error} />
        </RouterWrapper>
      );
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Unable to Load Flow');
      expect(heading).toHaveClass('text-2xl', 'font-bold', 'mb-4');
    });

    it('should have muted text for error description', () => {
      const error = new Error('Detailed error message');
      
      render(
        <RouterWrapper>
          <FlowErrorState error={error} />
        </RouterWrapper>
      );
      
      const errorText = screen.getByText('Detailed error message');
      expect(errorText).toHaveClass('text-muted-foreground', 'mb-4');
    });

    it('should handle complex error objects', () => {
      const complexError = {
        message: 'Custom error message',
        code: 404,
        details: 'Flow not found'
      };
      
      render(
        <RouterWrapper>
          <FlowErrorState error={complexError} />
        </RouterWrapper>
      );
      
      // Should show generic message for non-Error objects
      expect(screen.getByText('An error occurred while loading the flow.')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should have consistent styling between loading and error states', () => {
      const { rerender } = render(<FlowLoadingState />);
      
      const loadingContainer = document.querySelector('.min-h-screen.bg-background.flex.items-center.justify-center');
      expect(loadingContainer).toBeInTheDocument();
      
      rerender(
        <RouterWrapper>
          <FlowErrorState error={new Error('Test')} />
        </RouterWrapper>
      );
      
      const errorContainer = document.querySelector('.min-h-screen.bg-background.flex.items-center.justify-center');
      expect(errorContainer).toBeInTheDocument();
    });

    it('should both use text-center for content alignment', () => {
      const { rerender } = render(<FlowLoadingState />);
      
      let centerContainer = document.querySelector('.text-center');
      expect(centerContainer).toBeInTheDocument();
      
      rerender(
        <RouterWrapper>
          <FlowErrorState error={new Error('Test')} />
        </RouterWrapper>
      );
      
      centerContainer = document.querySelector('.text-center');
      expect(centerContainer).toBeInTheDocument();
    });
  });
});
