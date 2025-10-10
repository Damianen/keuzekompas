import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetUserById } from '@application/usecases/user/user.getById.js';
import { UpdateUser } from '@application/usecases/user/user.update.js';
import { DeleteUser } from '@application/usecases/user/user.delete.js';
import { ListFavorites } from '@application/usecases/user/user.listfavorites.js';
import { RemoveFavorite } from '@application/usecases/user/user.removeFavorite.js';
import type { IUserRepo } from '@domain/repos/user.repo.js';
import type { IModuleRepo } from '@domain/repos/module.repo.js';
import type { User } from '@domain/entities/User.js';
import type { Module } from '@domain/entities/Module.js';

describe('User Use Cases', () => {
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

  describe('GetUserById', () => {
    it('should get user by id', async () => {
      const getUserById = new GetUserById(mockUserRepo);
      const user: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        passwordHash: 'hashedPassword',
        role: 1,
        favorites: [],
        createdAt: new Date(),
      };

      vi.mocked(mockUserRepo.findById).mockResolvedValue(user);

      const result = await getUserById.execute('user123');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('user123');
      }
    });

    it('should return error when user not found', async () => {
      const getUserById = new GetUserById(mockUserRepo);
      vi.mocked(mockUserRepo.findById).mockResolvedValue(null);

      const result = await getUserById.execute('nonexistent');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('Id not found');
      }
    });
  });

  describe('UpdateUser', () => {
    it('should update user', async () => {
      const updateUser = new UpdateUser(mockUserRepo);
      const existingUser: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        passwordHash: 'hashedPassword',
        role: 1,
        favorites: [],
        createdAt: new Date(),
      };

      vi.mocked(mockUserRepo.findById).mockResolvedValue(existingUser);
      vi.mocked(mockUserRepo.upsert).mockResolvedValue('user123');

      const result = await updateUser.execute({
        ...existingUser,
        name: 'Updated Name',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('user123');
      }
    });

    it('should return error when user not found', async () => {
      const updateUser = new UpdateUser(mockUserRepo);
      vi.mocked(mockUserRepo.findById).mockResolvedValue(null);

      const result = await updateUser.execute({
        id: 'nonexistent',
        email: 'test@example.com',
        name: 'Test',
        study: 'CS',
        passwordHash: 'hash',
        role: 1,
        favorites: [],
        createdAt: new Date(),
      });

      expect(result.ok).toBe(false);
    });
  });

  describe('DeleteUser', () => {
    it('should delete user', async () => {
      const deleteUser = new DeleteUser(mockUserRepo);
      vi.mocked(mockUserRepo.delete).mockResolvedValue();

      await deleteUser.execute('user123');

      expect(mockUserRepo.delete).toHaveBeenCalledWith('user123');
    });
  });

  describe('ListFavorites', () => {
    it('should list user favorites', async () => {
      const listFavorites = new ListFavorites(mockUserRepo);
      const user: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        passwordHash: 'hashedPassword',
        role: 1,
        favorites: [],
        createdAt: new Date(),
      };

      const modules: Module[] = [
        {
          id: 'module1',
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
        },
      ];

      vi.mocked(mockUserRepo.findById).mockResolvedValue(user);
      vi.mocked(mockUserRepo.listFavorites).mockResolvedValue(modules);

      const result = await listFavorites.execute('user123');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
      }
    });

    it('should return error when user not found', async () => {
      const listFavorites = new ListFavorites(mockUserRepo);
      vi.mocked(mockUserRepo.findById).mockResolvedValue(null);

      const result = await listFavorites.execute('nonexistent');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('Id not found');
      }
    });
  });

  describe('RemoveFavorite', () => {
    it('should remove favorite', async () => {
      const removeFavorite = new RemoveFavorite(mockUserRepo, mockModuleRepo);
      const user: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        study: 'Computer Science',
        passwordHash: 'hashedPassword',
        role: 1,
        favorites: [],
        createdAt: new Date(),
      };

      const module: Module = {
        id: 'module123',
        name: 'Module',
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
      vi.mocked(mockUserRepo.removeFavorite).mockResolvedValue();

      const result = await removeFavorite.execute('user123', 'module123');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.message).toBe('Module removed from favorites');
      }
    });

    it('should return error when user not found', async () => {
      const removeFavorite = new RemoveFavorite(mockUserRepo, mockModuleRepo);
      vi.mocked(mockUserRepo.findById).mockResolvedValue(null);

      const result = await removeFavorite.execute('nonexistent', 'module123');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('User not found');
      }
    });

    it('should return error when module not found', async () => {
      const removeFavorite = new RemoveFavorite(mockUserRepo, mockModuleRepo);
      const user: User = {
        id: 'user123',
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

      const result = await removeFavorite.execute('user123', 'nonexistent');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('Module not found');
      }
    });
  });
});
