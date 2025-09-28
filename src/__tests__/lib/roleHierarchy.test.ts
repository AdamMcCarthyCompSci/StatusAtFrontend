import { describe, it, expect } from 'vitest';
import { canManageRole, canPromoteToRole, getAvailableRoles, ROLE_HIERARCHY } from '@/types/user';

describe('Role Hierarchy and Permissions', () => {
  describe('ROLE_HIERARCHY', () => {
    it('should have correct hierarchy order', () => {
      expect(ROLE_HIERARCHY.OWNER).toBe(3);
      expect(ROLE_HIERARCHY.STAFF).toBe(2);
      expect(ROLE_HIERARCHY.MEMBER).toBe(1);
    });
  });

  describe('canManageRole', () => {
    it('should allow OWNER to manage STAFF', () => {
      expect(canManageRole('OWNER', 'STAFF')).toBe(true);
    });

    it('should allow OWNER to manage MEMBER', () => {
      expect(canManageRole('OWNER', 'MEMBER')).toBe(true);
    });

    it('should allow OWNER to manage OWNER (same level)', () => {
      expect(canManageRole('OWNER', 'OWNER')).toBe(true);
    });

    it('should allow STAFF to manage MEMBER', () => {
      expect(canManageRole('STAFF', 'MEMBER')).toBe(true);
    });

    it('should allow STAFF to manage STAFF (same level)', () => {
      expect(canManageRole('STAFF', 'STAFF')).toBe(true);
    });

    it('should not allow STAFF to manage OWNER', () => {
      expect(canManageRole('STAFF', 'OWNER')).toBe(false);
    });

    it('should allow MEMBER to manage MEMBER (same level)', () => {
      expect(canManageRole('MEMBER', 'MEMBER')).toBe(true);
    });

    it('should not allow MEMBER to manage STAFF', () => {
      expect(canManageRole('MEMBER', 'STAFF')).toBe(false);
    });

    it('should not allow MEMBER to manage OWNER', () => {
      expect(canManageRole('MEMBER', 'OWNER')).toBe(false);
    });
  });

  describe('canPromoteToRole', () => {
    it('should allow OWNER to promote to STAFF', () => {
      expect(canPromoteToRole('OWNER', 'STAFF')).toBe(true);
    });

    it('should allow OWNER to promote to MEMBER', () => {
      expect(canPromoteToRole('OWNER', 'MEMBER')).toBe(true);
    });

    it('should allow OWNER to promote to OWNER (same level)', () => {
      expect(canPromoteToRole('OWNER', 'OWNER')).toBe(true);
    });

    it('should allow STAFF to promote to MEMBER', () => {
      expect(canPromoteToRole('STAFF', 'MEMBER')).toBe(true);
    });

    it('should allow STAFF to promote to STAFF (same level)', () => {
      expect(canPromoteToRole('STAFF', 'STAFF')).toBe(true);
    });

    it('should not allow STAFF to promote to OWNER', () => {
      expect(canPromoteToRole('STAFF', 'OWNER')).toBe(false);
    });

    it('should allow MEMBER to promote to MEMBER (same level)', () => {
      expect(canPromoteToRole('MEMBER', 'MEMBER')).toBe(true);
    });

    it('should not allow MEMBER to promote to STAFF', () => {
      expect(canPromoteToRole('MEMBER', 'STAFF')).toBe(false);
    });

    it('should not allow MEMBER to promote to OWNER', () => {
      expect(canPromoteToRole('MEMBER', 'OWNER')).toBe(false);
    });
  });

  describe('getAvailableRoles', () => {
    it('should return all roles for OWNER', () => {
      const availableRoles = getAvailableRoles('OWNER');
      expect(availableRoles).toEqual(['OWNER', 'STAFF', 'MEMBER']);
    });

    it('should return STAFF and MEMBER for STAFF', () => {
      const availableRoles = getAvailableRoles('STAFF');
      expect(availableRoles).toEqual(['STAFF', 'MEMBER']);
    });

    it('should return only MEMBER for MEMBER', () => {
      const availableRoles = getAvailableRoles('MEMBER');
      expect(availableRoles).toEqual(['MEMBER']);
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid roles gracefully in canManageRole', () => {
      expect(canManageRole('INVALID' as any, 'MEMBER')).toBe(false);
      expect(canManageRole('OWNER', 'INVALID' as any)).toBe(false);
    });

    it('should handle invalid roles gracefully in canPromoteToRole', () => {
      expect(canPromoteToRole('INVALID' as any, 'MEMBER')).toBe(false);
      expect(canPromoteToRole('OWNER', 'INVALID' as any)).toBe(false);
    });

    it('should handle invalid roles gracefully in getAvailableRoles', () => {
      const availableRoles = getAvailableRoles('INVALID' as any);
      expect(availableRoles).toEqual([]);
    });
  });
});
