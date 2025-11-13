import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { enrollmentApi } from '@/lib/api';

// Mock the auth store
vi.mock('@/stores/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      tokens: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      setTokens: vi.fn(),
      clearTokens: vi.fn(),
    }),
  },
}));

describe('API Updates', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  describe('enrollmentApi.updateEnrollment', () => {
    it('makes correct PATCH request to update enrollment', async () => {
      const mockResponse = {
        uuid: 'enrollment-123',
        current_step: 'step-2',
        current_step_name: 'New Step',
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await enrollmentApi.updateEnrollment(
        'tenant-123',
        'enrollment-123',
        { current_step: 'step-2' }
      );

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/tenants/tenant-123/enrollments/enrollment-123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ current_step: 'step-2' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-access-token',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('handles multiple update fields', async () => {
      const mockResponse = {
        uuid: 'enrollment-123',
        current_step: 'step-2',
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      await enrollmentApi.updateEnrollment(
        'tenant-123',
        'enrollment-123',
        { current_step: 'step-2' }
      );

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/tenants/tenant-123/enrollments/enrollment-123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ current_step: 'step-2' }),
        })
      );
    });

    it('handles API errors', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Update failed' }),
      });

      await expect(
        enrollmentApi.updateEnrollment(
          'tenant-123',
          'enrollment-123',
          { current_step: 'step-2' }
        )
      ).rejects.toThrow('Update failed');
    });
  });

  describe('enrollmentApi.getEnrollmentHistory', () => {
    it('makes correct GET request for enrollment history', async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            uuid: 'history-1',
            from_step_name: 'Step A',
            to_step_name: 'Step B',
            is_backward: false,
          },
          {
            uuid: 'history-2',
            from_step_name: 'Step B',
            to_step_name: 'Step C',
            is_backward: false,
          },
        ],
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await enrollmentApi.getEnrollmentHistory('tenant-123', 'enrollment-123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/tenants/tenant-123/enrollments/enrollment-123/history',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-access-token',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('includes pagination parameters in query string', async () => {
      const mockResponse = { count: 0, results: [] };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      await enrollmentApi.getEnrollmentHistory('tenant-123', 'enrollment-123', {
        page: 2,
        page_size: 20,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page_size=20'),
        expect.any(Object)
      );
    });

    it('handles empty pagination parameters', async () => {
      const mockResponse = { count: 0, results: [] };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      await enrollmentApi.getEnrollmentHistory('tenant-123', 'enrollment-123', {});

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/tenants/tenant-123/enrollments/enrollment-123/history',
        expect.any(Object)
      );
    });

    it('handles API errors for history', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'History fetch failed' }),
      });

      await expect(
        enrollmentApi.getEnrollmentHistory('tenant-123', 'enrollment-123')
      ).rejects.toThrow('History fetch failed');
    });
  });

  describe('URL construction', () => {
    it('constructs correct URLs for different tenants and enrollments', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await enrollmentApi.updateEnrollment('tenant-456', 'enrollment-789', {});

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/tenants/tenant-456/enrollments/enrollment-789',
        expect.any(Object)
      );
    });

    it('constructs correct history URLs', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ count: 0, results: [] }),
      });

      await enrollmentApi.getEnrollmentHistory('tenant-xyz', 'enrollment-abc');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/tenants/tenant-xyz/enrollments/enrollment-abc/history',
        expect.any(Object)
      );
    });
  });

  describe('Request body serialization', () => {
    it('properly serializes update data to JSON', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const updateData = { current_step: 'step-3' };
      await enrollmentApi.updateEnrollment('tenant-123', 'enrollment-123', updateData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(updateData),
        })
      );
    });
  });

  describe('Response handling', () => {
    it('returns the response data directly', async () => {
      const mockData = { uuid: 'test', current_step: 'step-1' };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await enrollmentApi.updateEnrollment('t', 'e', {});

      expect(result).toEqual(mockData);
    });

    it('returns history response with pagination info', async () => {
      const mockData = {
        count: 10,
        next: 'next-url',
        previous: null,
        results: [],
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await enrollmentApi.getEnrollmentHistory('t', 'e');

      expect(result).toEqual(mockData);
      expect(result.count).toBe(10);
      expect(result.next).toBe('next-url');
    });
  });
});
