import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCurrentUser } from './useUserQuery';
import { ReactNode, createElement } from 'react';

// Mock the auth store
vi.mock('../stores/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from '../stores/useAuthStore';

// Create a wrapper component for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => 
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useCurrentUser', () => {
  it('fetches user data successfully', async () => {
    // Mock authentication state
    (useAuthStore as any).mockReturnValue({ isAuthenticated: true });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      color_scheme: 'light',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    });
  });

  it('handles loading state', () => {
    // Mock authentication state as false to disable the query
    (useAuthStore as any).mockReturnValue({ isAuthenticated: false });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    // When not authenticated, the query should be disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
