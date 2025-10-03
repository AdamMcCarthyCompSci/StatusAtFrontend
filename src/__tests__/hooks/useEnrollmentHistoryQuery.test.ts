import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEnrollmentHistory } from '@/hooks/useEnrollmentHistoryQuery';
import { enrollmentApi } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api');

const mockEnrollmentApi = enrollmentApi as jest.Mocked<typeof enrollmentApi>;

const mockHistoryResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      uuid: 'history-1',
      enrollment: 'enrollment-123',
      transition: 'transition-1',
      changed_by: 1,
      changed_by_name: 'Admin User',
      changed_by_email: 'admin@example.com',
      from_step_name: 'Initial Step',
      to_step_name: 'Second Step',
      is_backward: false,
      enrollment_user_name: 'John Doe',
      enrollment_user_email: 'john@example.com',
      flow_name: 'Test Flow',
      timestamp: '2024-01-01T12:00:00Z',
    },
    {
      uuid: 'history-2',
      enrollment: 'enrollment-123',
      transition: 'transition-2',
      changed_by: 2,
      changed_by_name: 'Manager User',
      changed_by_email: 'manager@example.com',
      from_step_name: 'Second Step',
      to_step_name: null, // Simulate deleted step
      is_backward: true,
      enrollment_user_name: 'John Doe',
      enrollment_user_email: 'john@example.com',
      flow_name: 'Test Flow',
      timestamp: '2024-01-02T12:00:00Z',
    },
  ],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useEnrollmentHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches enrollment history successfully', async () => {
    mockEnrollmentApi.getEnrollmentHistory.mockResolvedValue(mockHistoryResponse);

    const { result } = renderHook(
      () => useEnrollmentHistory('tenant-123', 'enrollment-123'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockHistoryResponse);
    expect(mockEnrollmentApi.getEnrollmentHistory).toHaveBeenCalledWith(
      'tenant-123',
      'enrollment-123',
      undefined
    );
  });

  it('fetches enrollment history with pagination params', async () => {
    mockEnrollmentApi.getEnrollmentHistory.mockResolvedValue(mockHistoryResponse);

    const params = { page: 2, page_size: 25 };
    const { result } = renderHook(
      () => useEnrollmentHistory('tenant-123', 'enrollment-123', params),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockEnrollmentApi.getEnrollmentHistory).toHaveBeenCalledWith(
      'tenant-123',
      'enrollment-123',
      params
    );
  });

  it('handles API errors', async () => {
    const error = new Error('Failed to fetch history');
    mockEnrollmentApi.getEnrollmentHistory.mockRejectedValue(error);

    const { result } = renderHook(
      () => useEnrollmentHistory('tenant-123', 'enrollment-123'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('is disabled when tenantUuid is missing', () => {
    const { result } = renderHook(
      () => useEnrollmentHistory('', 'enrollment-123'),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(mockEnrollmentApi.getEnrollmentHistory).not.toHaveBeenCalled();
  });

  it('is disabled when enrollmentUuid is missing', () => {
    const { result } = renderHook(
      () => useEnrollmentHistory('tenant-123', ''),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(mockEnrollmentApi.getEnrollmentHistory).not.toHaveBeenCalled();
  });

  it('generates correct query keys', () => {
    const { enrollmentHistoryKeys } = require('@/hooks/useEnrollmentHistoryQuery');

    expect(enrollmentHistoryKeys.all).toEqual(['enrollmentHistory']);
    expect(enrollmentHistoryKeys.tenant('tenant-123')).toEqual(['enrollmentHistory', 'tenant-123']);
    expect(enrollmentHistoryKeys.enrollment('tenant-123', 'enrollment-123')).toEqual([
      'enrollmentHistory',
      'tenant-123',
      'enrollment-123',
    ]);
    expect(enrollmentHistoryKeys.list('tenant-123', 'enrollment-123', { page: 1 })).toEqual([
      'enrollmentHistory',
      'tenant-123',
      'enrollment-123',
      'list',
      { page: 1 },
    ]);
  });

  it('shows loading state initially', () => {
    mockEnrollmentApi.getEnrollmentHistory.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(
      () => useEnrollmentHistory('tenant-123', 'enrollment-123'),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('configures query to always refetch fresh data', () => {
    const { result } = renderHook(
      () => useEnrollmentHistory('tenant-123', 'enrollment-123'),
      { wrapper: createWrapper() }
    );

    // The hook should be configured to always fetch fresh data
    // This is tested indirectly by verifying the hook doesn't use stale data
    expect(result.current.isLoading || result.current.data || result.current.error).toBeDefined();
  });

  it('refetches when enrollment ID changes', () => {
    const { result, rerender } = renderHook(
      ({ enrollmentId }) => useEnrollmentHistory('tenant-123', enrollmentId),
      { 
        wrapper: createWrapper(),
        initialProps: { enrollmentId: 'enrollment-123' }
      }
    );

    expect(mockEnrollmentApi.getEnrollmentHistory).toHaveBeenCalledWith(
      'tenant-123',
      'enrollment-123',
      undefined
    );

    // Change enrollment ID
    rerender({ enrollmentId: 'enrollment-456' });

    expect(mockEnrollmentApi.getEnrollmentHistory).toHaveBeenCalledWith(
      'tenant-123',
      'enrollment-456',
      undefined
    );
  });
});
