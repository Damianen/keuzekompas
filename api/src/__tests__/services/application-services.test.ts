import { describe, it, expect, vi } from 'vitest';
import { ModuleService } from '@application/services/module.service.js';
import { UserService } from '@application/services/user.service.js';
import type { IModuleRepo } from '@domain/repos/module.repo.js';
import type { IUserRepo } from '@domain/repos/user.repo.js';
import type { IPasswordHasher } from '@domain/services/IPasswordHasher.js';

describe('Application Services', () => {
  describe('ModuleService', () => {
    it('should create module service with all use cases', () => {
      const mockModuleRepo: IModuleRepo = {
        upsert: vi.fn(),
        findById: vi.fn(),
        getById: vi.fn(),
        list: vi.fn(),
        delete: vi.fn(),
      };

      const service = ModuleService.createService(mockModuleRepo);

      expect(service).toBeDefined();
      expect(service.create).toBeDefined();
      expect(service.getById).toBeDefined();
      expect(service.list).toBeDefined();
      expect(service.update).toBeDefined();
      expect(service.deleteModule).toBeDefined();
    });
  });

  describe('UserService', () => {
    it('should create user service with all use cases', () => {
      const mockUserRepo: IUserRepo = {
        findByEmail: vi.fn(),
        upsert: vi.fn(),
        findById: vi.fn(),
        listFavorites: vi.fn(),
        addFavorite: vi.fn(),
        removeFavorite: vi.fn(),
        delete: vi.fn(),
      };

      const mockModuleRepo: IModuleRepo = {
        upsert: vi.fn(),
        findById: vi.fn(),
        getById: vi.fn(),
        list: vi.fn(),
        delete: vi.fn(),
      };

      const mockPasswordHasher: IPasswordHasher = {
        hash: vi.fn(),
        verify: vi.fn(),
      };

      const service = UserService.createService(mockUserRepo, mockModuleRepo, mockPasswordHasher);

      expect(service).toBeDefined();
      expect(service.register).toBeDefined();
      expect(service.login).toBeDefined();
      expect(service.getById).toBeDefined();
      expect(service.update).toBeDefined();
      expect(service.deleteUser).toBeDefined();
      expect(service.listFavorites).toBeDefined();
      expect(service.addFavorite).toBeDefined();
      expect(service.removeFavorite).toBeDefined();
    });
  });
});
