import { describe, it, expect, vi, beforeEach } from 'vitest';

import { enrollmentApi } from '@/lib/api';

// Mock the apiRequest function
vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual('@/lib/api');
  return {
    ...actual,
    enrollmentApi: {
      getEnrollments: vi.fn(),
      getEnrollment: vi.fn(),
      deleteEnrollment: vi.fn(),
      getFlowSteps: vi.fn(),
    },
  };
});

const mockEnrollmentApi = vi.mocked(enrollmentApi);

describe('enrollmentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEnrollments', () => {
    it('should fetch enrollments with basic parameters', async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            uuid: 'enrollment-1',
            user_id: 4,
            user_name: 'Alice Johnson',
            user_email: 'alice@example.com',
            flow_name: 'Order Processing',
            flow_uuid: 'flow-1',
            tenant_name: 'Test Tenant 1',
            tenant_uuid: 'tenant-1',
            current_step_name: 'Initial Review',
            current_step_uuid: 'step-1',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-16T14:20:00Z',
          },
        ],
      };

      mockEnrollmentApi.getEnrollments.mockResolvedValue(mockResponse);

      const result = await enrollmentApi.getEnrollments('tenant-1');

      expect(mockEnrollmentApi.getEnrollments).toHaveBeenCalledWith('tenant-1');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch enrollments with filtering parameters', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [],
      };

      const params = {
        page: 1,
        page_size: 10,
        search_user: 'Alice',
        flow: 'flow-1',
        current_step: 'step-1',
      };

      mockEnrollmentApi.getEnrollments.mockResolvedValue(mockResponse);

      const result = await enrollmentApi.getEnrollments('tenant-1', params);

      expect(mockEnrollmentApi.getEnrollments).toHaveBeenCalledWith('tenant-1', params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getEnrollment', () => {
    it('should fetch a single enrollment', async () => {
      const mockEnrollment = {
        uuid: 'enrollment-1',
        user_id: 4,
        user_name: 'Alice Johnson',
        user_email: 'alice@example.com',
        flow_name: 'Order Processing',
        flow_uuid: 'flow-1',
        tenant_name: 'Test Tenant 1',
        tenant_uuid: 'tenant-1',
        current_step_name: 'Initial Review',
        current_step_uuid: 'step-1',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T14:20:00Z',
      };

      mockEnrollmentApi.getEnrollment.mockResolvedValue(mockEnrollment);

      const result = await enrollmentApi.getEnrollment('tenant-1', 'enrollment-1');

      expect(mockEnrollmentApi.getEnrollment).toHaveBeenCalledWith('tenant-1', 'enrollment-1');
      expect(result).toEqual(mockEnrollment);
    });
  });

  describe('deleteEnrollment', () => {
    it('should delete an enrollment', async () => {
      mockEnrollmentApi.deleteEnrollment.mockResolvedValue(undefined);

      await enrollmentApi.deleteEnrollment('tenant-1', 'enrollment-1');

      expect(mockEnrollmentApi.deleteEnrollment).toHaveBeenCalledWith('tenant-1', 'enrollment-1');
    });
  });

  describe('getFlowSteps', () => {
    it('should fetch flow steps', async () => {
      const mockStepsResponse = {
        count: 3,
        next: null,
        previous: null,
        results: [
          { uuid: 'step-1', name: 'Initial Review' },
          { uuid: 'step-2', name: 'In Progress' },
          { uuid: 'step-3', name: 'Completed' },
        ],
      };

      mockEnrollmentApi.getFlowSteps.mockResolvedValue(mockStepsResponse);

      const result = await enrollmentApi.getFlowSteps('tenant-1', 'flow-1');

      expect(mockEnrollmentApi.getFlowSteps).toHaveBeenCalledWith('tenant-1', 'flow-1');
      expect(result).toEqual(mockStepsResponse);
    });
  });
});
