import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateModule } from '@application/usecases/module/module.create.js';
import { ListModules } from '@application/usecases/module/module.list.js';
import { UpdateModule } from '@application/usecases/module/module.update.js';
import type { IModuleRepo } from '@domain/repos/module.repo.js';
import type { Module } from '@domain/entities/Module.js';

describe('Module Use Cases', () => {
  let mockModuleRepo: IModuleRepo;

  beforeEach(() => {
    mockModuleRepo = {
      upsert: vi.fn(),
      findById: vi.fn(),
      getById: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };
  });

  describe('CreateModule', () => {
    it('should create a new module', async () => {
      const createModule = new CreateModule(mockModuleRepo);
      const moduleData = {
        name: 'Advanced Programming',
        location: 'Campus A',
        period: 1,
        provider: 'University X',
        duration: 8,
        language: 'English',
        level: 'Bachelor',
        description: 'Learn advanced programming concepts',
        information: 'Additional info',
        createdAt: new Date(),
      };

      vi.mocked(mockModuleRepo.upsert).mockResolvedValue('module123');

      const result = await createModule.execute(moduleData);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('module123');
      }
      expect(mockModuleRepo.upsert).toHaveBeenCalledWith(moduleData);
    });
  });

  describe('ListModules', () => {
    it('should return list of all modules', async () => {
      const listModules = new ListModules(mockModuleRepo);
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
          description: 'Description 1',
          information: 'Info 1',
          createdAt: new Date(),
        },
        {
          id: 'module2',
          name: 'Module 2',
          location: 'Campus B',
          period: 2,
          provider: 'University Y',
          duration: 10,
          language: 'Dutch',
          level: 'Master',
          description: 'Description 2',
          information: 'Info 2',
          createdAt: new Date(),
        },
      ];

      vi.mocked(mockModuleRepo.list).mockResolvedValue(modules);

      const result = await listModules.execute();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(modules);
        expect(result.value).toHaveLength(2);
      }
    });

    it('should return empty list when no modules exist', async () => {
      const listModules = new ListModules(mockModuleRepo);
      vi.mocked(mockModuleRepo.list).mockResolvedValue([]);

      const result = await listModules.execute();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual([]);
      }
    });
  });

  describe('UpdateModule', () => {
    it('should update an existing module', async () => {
      const updateModule = new UpdateModule(mockModuleRepo);
      const existingModule: Module = {
        id: 'module123',
        name: 'Old Name',
        location: 'Campus A',
        period: 1,
        provider: 'University X',
        duration: 8,
        language: 'English',
        level: 'Bachelor',
        description: 'Old description',
        information: 'Old info',
        createdAt: new Date(),
      };

      const updatedModule: Module = {
        ...existingModule,
        name: 'New Name',
        description: 'New description',
      };

      vi.mocked(mockModuleRepo.getById).mockResolvedValue(existingModule);
      vi.mocked(mockModuleRepo.upsert).mockResolvedValue('module123');

      const result = await updateModule.execute(updatedModule);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('module123');
      }
      expect(mockModuleRepo.getById).toHaveBeenCalledWith('module123');
      expect(mockModuleRepo.upsert).toHaveBeenCalledWith(updatedModule);
    });

    it('should return error when module does not exist', async () => {
      const updateModule = new UpdateModule(mockModuleRepo);
      const moduleData: Module = {
        id: 'nonexistent',
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

      vi.mocked(mockModuleRepo.getById).mockResolvedValue(null as any);

      const result = await updateModule.execute(moduleData);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('id not found');
      }
      expect(mockModuleRepo.upsert).not.toHaveBeenCalled();
    });
  });
});
