import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useUpdateEnrollment } from '@/hooks/useEnrollmentQuery';
import { enrollmentApi } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api');

const mockEnrollmentApi = enrollmentApi as any;

const mockUpdatedEnrollment = {
  uuid: 'enrollment-123',
  user_name: 'John Doe',
  user_email: 'john@example.com',
  flow_name: 'Test Flow',
  current_step_name: 'New Step',
  current_step: 'step-2',
  created_at: '2024-01-01T00:00:00Z',
  available_transitions: [],
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

describe('useUpdateEnrollment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates enrollment successfully', async () => {
    mockEnrollmentApi.updateEnrollment.mockResolvedValue(mockUpdatedEnrollment);

    const { result } = renderHook(() => useUpdateEnrollment(), {
      wrapper: createWrapper(),
    });

    const updateData = {
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-123',
      updates: { current_step: 'step-2' },
    };

    result.current.mutate(updateData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUpdatedEnrollment);
    expect(mockEnrollmentApi.updateEnrollment).toHaveBeenCalledWith(
      'tenant-123',
      'enrollment-123',
      { current_step: 'step-2' }
    );
  });

  it('handles update errors', async () => {
    const error = new Error('Failed to update enrollment');
    mockEnrollmentApi.updateEnrollment.mockRejectedValue(error);

    const { result } = renderHook(() => useUpdateEnrollment(), {
      wrapper: createWrapper(),
    });

    const updateData = {
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-123',
      updates: { current_step: 'step-2' },
    };

    result.current.mutate(updateData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('shows loading state during update', async () => {
    mockEnrollmentApi.updateEnrollment.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useUpdateEnrollment(), {
      wrapper: createWrapper(),
    });

    const updateData = {
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-123',
      updates: { current_step: 'step-2' },
    };

    result.current.mutate(updateData);

    // Wait for the mutation to start
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
  });

  it('invalidates queries on successful update', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    mockEnrollmentApi.updateEnrollment.mockResolvedValue(mockUpdatedEnrollment);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateEnrollment(), { wrapper });

    const updateData = {
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-123',
      updates: { current_step: 'step-2' },
    };

    result.current.mutate(updateData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should invalidate enrollments, enrollment history, and current user
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['enrollments', 'tenant', 'tenant-123'],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['enrollmentHistory', 'tenant-123', 'enrollment-123'],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['user', 'current'],
    });
  });

  it('can update multiple fields', async () => {
    mockEnrollmentApi.updateEnrollment.mockResolvedValue(mockUpdatedEnrollment);

    const { result } = renderHook(() => useUpdateEnrollment(), {
      wrapper: createWrapper(),
    });

    const updateData = {
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-123',
      updates: { 
        current_step: 'step-2',
        // Could include other fields in the future
      },
    };

    result.current.mutate(updateData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockEnrollmentApi.updateEnrollment).toHaveBeenCalledWith(
      'tenant-123',
      'enrollment-123',
      { current_step: 'step-2' }
    );
  });

  it('uses mutateAsync for promise-based usage', async () => {
    mockEnrollmentApi.updateEnrollment.mockResolvedValue(mockUpdatedEnrollment);

    const { result } = renderHook(() => useUpdateEnrollment(), {
      wrapper: createWrapper(),
    });

    const updateData = {
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-123',
      updates: { current_step: 'step-2' },
    };

    const promise = result.current.mutateAsync(updateData);

    await expect(promise).resolves.toEqual(mockUpdatedEnrollment);
    expect(mockEnrollmentApi.updateEnrollment).toHaveBeenCalledWith(
      'tenant-123',
      'enrollment-123',
      { current_step: 'step-2' }
    );
  });

  it('rejects mutateAsync on error', async () => {
    const error = new Error('Update failed');
    mockEnrollmentApi.updateEnrollment.mockRejectedValue(error);

    const { result } = renderHook(() => useUpdateEnrollment(), {
      wrapper: createWrapper(),
    });

    const updateData = {
      tenantUuid: 'tenant-123',
      enrollmentUuid: 'enrollment-123',
      updates: { current_step: 'step-2' },
    };

    const promise = result.current.mutateAsync(updateData);

    await expect(promise).rejects.toEqual(error);
  });
});
