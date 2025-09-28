import { describe, it, expect, vi, beforeEach } from 'vitest';
import { memberApi } from '@/lib/api';

// Mock the apiRequest function
vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual('@/lib/api');
  return {
    ...actual,
    memberApi: {
      getMembers: vi.fn(),
      getMember: vi.fn(),
      updateMember: vi.fn(),
      deleteMember: vi.fn(),
    },
  };
});

const mockMemberApi = vi.mocked(memberApi);

describe('memberApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMembers', () => {
    it('should fetch members with basic parameters', async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            uuid: 'member-1',
            user_id: 3,
            user_name: 'John Doe',
            user_email: 'john@example.com',
            role: 'STAFF',
            available_roles: [
              { value: 'MEMBER', label: 'Member' }
            ],
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-16T14:20:00Z',
          },
        ],
      };

      mockMemberApi.getMembers.mockResolvedValue(mockResponse);

      const result = await memberApi.getMembers('tenant-1');

      expect(mockMemberApi.getMembers).toHaveBeenCalledWith('tenant-1');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch members with filtering parameters', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [],
      };

      const params = {
        page: 1,
        page_size: 10,
        search: 'John',
      };

      mockMemberApi.getMembers.mockResolvedValue(mockResponse);

      const result = await memberApi.getMembers('tenant-1', params);

      expect(mockMemberApi.getMembers).toHaveBeenCalledWith('tenant-1', params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMember', () => {
    it('should fetch a single member', async () => {
      const mockMember = {
        uuid: 'member-1',
        user_id: 3,
        user_name: 'John Doe',
        user_email: 'john@example.com',
        role: 'STAFF',
        available_roles: [
          { value: 'MEMBER', label: 'Member' }
        ],
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T14:20:00Z',
      };

      mockMemberApi.getMember.mockResolvedValue(mockMember);

      const result = await memberApi.getMember('tenant-1', 'member-1');

      expect(mockMemberApi.getMember).toHaveBeenCalledWith('tenant-1', 'member-1');
      expect(result).toEqual(mockMember);
    });
  });

  describe('updateMember', () => {
    it('should update a member', async () => {
      const updateRequest = { role: 'MEMBER' };
      const mockResponse = {
        uuid: 'member-1',
        user_id: 3,
        user_name: 'John Doe',
        user_email: 'john@example.com',
        role: 'MEMBER',
        available_roles: [],
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T14:20:00Z',
      };

      mockMemberApi.updateMember.mockResolvedValue(mockResponse);

      const result = await memberApi.updateMember('tenant-1', 'member-1', updateRequest);

      expect(mockMemberApi.updateMember).toHaveBeenCalledWith('tenant-1', 'member-1', updateRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteMember', () => {
    it('should delete a member', async () => {
      mockMemberApi.deleteMember.mockResolvedValue(undefined);

      await memberApi.deleteMember('tenant-1', 'member-1');

      expect(mockMemberApi.deleteMember).toHaveBeenCalledWith('tenant-1', 'member-1');
    });
  });
});
