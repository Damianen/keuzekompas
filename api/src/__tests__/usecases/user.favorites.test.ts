import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddFavorite } from '@application/usecases/user/user.addFavorite.js';
import type { IUserRepo } from '@domain/repos/user.repo.js';
import type { IModuleRepo } from '@domain/repos/module.repo.js';
import type { User } from '@domain/entities/User.js';
import type { Module } from '@domain/entities/Module.js';

describe('User Favorites Use Cases', () => {
  let mockUserRepo: IUserRepo;
  let mockModuleRepo: IModuleRepo;

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: vi.fn(),
      upsert: vi.fn(),
      findById: vi.fn(),
      listFavorites: vi.fn(),
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      delete: vi.fn(),
    };

    mockModuleRepo = {
      upsert: vi.fn(),
      findById: vi.fn(),
      getById: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };
  });

  describe('AddFavorite', () => {
    it('should add module to user favorites', async () => {
      const addFavorite = new AddFavorite(mockUserRepo, mockModuleRepo);
      const userId = 'user123';
      const moduleId = 'module123';

      const user: User = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        passwordHash: 'hashedPassword',
        role: 1,
        favorites: [],
        createdAt: new Date(),
      };

      const module: Module = {
        id: moduleId,
        name: 'Module 1',
        location: 'Campus A',
        period: 1,
        provider: 'University X',
        duration: 8,
        language: 'English',
        level: 'Bachelor',
        description: 'Description',
        information: 'Info',
        createdAt: new Date(),
      };

      vi.mocked(mockUserRepo.findById).mockResolvedValue(user);
      vi.mocked(mockModuleRepo.findById).mockResolvedValue(module);
      vi.mocked(mockUserRepo.addFavorite).mockResolvedValue();

      const result = await addFavorite.execute(userId, moduleId);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.message).toBe('Module added to favorites');
      }
      expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
      expect(mockModuleRepo.findById).toHaveBeenCalledWith(moduleId);
      expect(mockUserRepo.addFavorite).toHaveBeenCalledWith(userId, moduleId);
    });

    it('should return error when user not found', async () => {
      const addFavorite = new AddFavorite(mockUserRepo, mockModuleRepo);
      const userId = 'nonexistent';
      const moduleId = 'module123';

      vi.mocked(mockUserRepo.findById).mockResolvedValue(null);

      const result = await addFavorite.execute(userId, moduleId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('User not found');
      }
      expect(mockModuleRepo.findById).not.toHaveBeenCalled();
      expect(mockUserRepo.addFavorite).not.toHaveBeenCalled();
    });

    it('should return error when module not found', async () => {
      const addFavorite = new AddFavorite(mockUserRepo, mockModuleRepo);
      const userId = 'user123';
      const moduleId = 'nonexistent';

      const user: User = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        passwordHash: 'hashedPassword',
        role: 1,
        favorites: [],
        createdAt: new Date(),
      };

      vi.mocked(mockUserRepo.findById).mockResolvedValue(user);
      vi.mocked(mockModuleRepo.findById).mockResolvedValue(null);

      const result = await addFavorite.execute(userId, moduleId);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('Module not found');
      }
      expect(mockUserRepo.addFavorite).not.toHaveBeenCalled();
    });
  });
});
