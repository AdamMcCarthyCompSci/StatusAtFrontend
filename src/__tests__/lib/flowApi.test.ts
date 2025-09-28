import { vi } from 'vitest';
import { flowApi } from '../../lib/api';
import { CreateFlowRequest } from '../../types/flow';

// Mock the auth store
vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      tokens: {
        access: 'mock-token',
        refresh: 'mock-refresh-token'
      }
    })
  }
}));

const mockTenantUuid = '4c892c79-e212-4189-a8de-8e3df52fc461';

describe('flowApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createFlow', () => {
    it('should create a new flow', async () => {
      const flowData: CreateFlowRequest = {
        name: 'Test Flow'
      };

      const result = await flowApi.createFlow(mockTenantUuid, flowData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Flow');
      expect(result.uuid).toBeDefined();
      expect(result.tenant_name).toBe('Test Tenant 1');
    });

    it('should handle creation errors', async () => {
      const flowData: CreateFlowRequest = {
        name: '' // Empty name should cause error
      };

      await expect(
        flowApi.createFlow(mockTenantUuid, flowData)
      ).rejects.toThrow();
    });
  });

  describe('getFlows', () => {
    it('should fetch flows for a tenant', async () => {
      const result = await flowApi.getFlows(mockTenantUuid);

      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getFlow', () => {
    it('should fetch a specific flow', async () => {
      const flowUuid = 'flow-1-uuid';
      const result = await flowApi.getFlow(mockTenantUuid, flowUuid);

      expect(result).toBeDefined();
      expect(result.uuid).toBe(flowUuid);
    });

    it('should handle non-existent flow', async () => {
      const flowUuid = 'non-existent-flow';
      
      await expect(
        flowApi.getFlow(mockTenantUuid, flowUuid)
      ).rejects.toThrow();
    });
  });

  describe('updateFlow', () => {
    it('should update an existing flow', async () => {
      const flowUuid = 'flow-1-uuid';
      const updateData = { name: 'Updated Flow Name' };

      const result = await flowApi.updateFlow(mockTenantUuid, flowUuid, updateData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Flow Name');
    });

    it('should handle updating non-existent flow', async () => {
      const flowUuid = 'non-existent-flow';
      const updateData = { name: 'Updated Name' };

      await expect(
        flowApi.updateFlow(mockTenantUuid, flowUuid, updateData)
      ).rejects.toThrow();
    });
  });

  describe('deleteFlow', () => {
    it('should delete an existing flow', async () => {
      const flowUuid = 'flow-1-uuid';

      // Should not throw
      await expect(
        flowApi.deleteFlow(mockTenantUuid, flowUuid)
      ).resolves.toBeUndefined();
    });

    it('should handle deleting non-existent flow', async () => {
      const flowUuid = 'non-existent-flow';

      await expect(
        flowApi.deleteFlow(mockTenantUuid, flowUuid)
      ).rejects.toThrow();
    });
  });
});
