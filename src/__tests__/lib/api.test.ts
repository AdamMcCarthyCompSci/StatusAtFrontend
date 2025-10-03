import { enrollmentApi } from '@/lib/api';

// Mock the global fetch and apiRequest
const mockApiRequest = jest.fn();
jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  apiRequest: (...args: any[]) => mockApiRequest(...args),
}));

// Re-import after mocking
const { apiRequest } = require('@/lib/api');

describe('API Updates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enrollmentApi.updateEnrollment', () => {
    it('makes correct PATCH request to update enrollment', async () => {
      const mockResponse = {
        uuid: 'enrollment-123',
        current_step: 'step-2',
        current_step_name: 'New Step',
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await enrollmentApi.updateEnrollment(
        'tenant-123',
        'enrollment-123',
        { current_step: 'step-2' }
      );

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/tenants/tenant-123/enrollments/enrollment-123',
        {
          method: 'PATCH',
          body: JSON.stringify({ current_step: 'step-2' }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('handles multiple update fields', async () => {
      const mockResponse = {
        uuid: 'enrollment-123',
        current_step: 'step-2',
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      await enrollmentApi.updateEnrollment(
        'tenant-123',
        'enrollment-123',
        { current_step: 'step-2' }
      );

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/tenants/tenant-123/enrollments/enrollment-123',
        {
          method: 'PATCH',
          body: JSON.stringify({ current_step: 'step-2' }),
        }
      );
    });

    it('handles API errors', async () => {
      const error = new Error('Update failed');
      mockApiRequest.mockRejectedValue(error);

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
            changed_by_name: 'Admin',
            timestamp: '2024-01-01T12:00:00Z',
          },
        ],
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await enrollmentApi.getEnrollmentHistory(
        'tenant-123',
        'enrollment-123'
      );

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/tenants/tenant-123/enrollments/enrollment-123/history'
      );

      expect(result).toEqual(mockResponse);
    });

    it('includes pagination parameters in query string', async () => {
      const mockResponse = {
        count: 10,
        next: 'page2',
        previous: null,
        results: [],
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      await enrollmentApi.getEnrollmentHistory(
        'tenant-123',
        'enrollment-123',
        { page: 2, page_size: 25 }
      );

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/tenants/tenant-123/enrollments/enrollment-123/history?page=2&page_size=25'
      );
    });

    it('handles empty pagination parameters', async () => {
      const mockResponse = { count: 0, results: [] };
      mockApiRequest.mockResolvedValue(mockResponse);

      await enrollmentApi.getEnrollmentHistory(
        'tenant-123',
        'enrollment-123',
        {}
      );

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/tenants/tenant-123/enrollments/enrollment-123/history'
      );
    });

    it('handles API errors for history', async () => {
      const error = new Error('History fetch failed');
      mockApiRequest.mockRejectedValue(error);

      await expect(
        enrollmentApi.getEnrollmentHistory('tenant-123', 'enrollment-123')
      ).rejects.toThrow('History fetch failed');
    });
  });

  describe('URL construction', () => {
    it('constructs correct URLs for different tenants and enrollments', async () => {
      mockApiRequest.mockResolvedValue({});

      await enrollmentApi.updateEnrollment(
        'different-tenant',
        'different-enrollment',
        { current_step: 'new-step' }
      );

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/tenants/different-tenant/enrollments/different-enrollment',
        expect.any(Object)
      );
    });

    it('constructs correct history URLs', async () => {
      mockApiRequest.mockResolvedValue({ count: 0, results: [] });

      await enrollmentApi.getEnrollmentHistory(
        'tenant-456',
        'enrollment-789',
        { page: 3 }
      );

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/tenants/tenant-456/enrollments/enrollment-789/history?page=3'
      );
    });
  });

  describe('Request body serialization', () => {
    it('properly serializes update data to JSON', async () => {
      mockApiRequest.mockResolvedValue({});

      const updates = { current_step: 'step-with-special-chars-123' };

      await enrollmentApi.updateEnrollment(
        'tenant-123',
        'enrollment-123',
        updates
      );

      expect(mockApiRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updates),
        })
      );
    });
  });

  describe('Response handling', () => {
    it('returns the response data directly', async () => {
      const mockEnrollment = {
        uuid: 'enrollment-123',
        user_name: 'John Doe',
        current_step: 'step-2',
        current_step_name: 'Updated Step',
      };

      mockApiRequest.mockResolvedValue(mockEnrollment);

      const result = await enrollmentApi.updateEnrollment(
        'tenant-123',
        'enrollment-123',
        { current_step: 'step-2' }
      );

      expect(result).toEqual(mockEnrollment);
    });

    it('returns history response with pagination info', async () => {
      const mockHistoryResponse = {
        count: 15,
        next: 'http://api.example.com/page2',
        previous: null,
        results: [
          {
            uuid: 'history-1',
            from_step_name: 'A',
            to_step_name: null, // Simulate deleted step
            is_backward: true,
            timestamp: '2024-01-01T00:00:00Z',
          },
        ],
      };

      mockApiRequest.mockResolvedValue(mockHistoryResponse);

      const result = await enrollmentApi.getEnrollmentHistory(
        'tenant-123',
        'enrollment-123'
      );

      expect(result).toEqual(mockHistoryResponse);
      expect(result.count).toBe(15);
      expect(result.next).toBe('http://api.example.com/page2');
      expect(result.results).toHaveLength(1);
    });
  });
});
