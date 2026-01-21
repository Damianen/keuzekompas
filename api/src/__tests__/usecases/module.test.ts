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
        shortdescription: 'A course on advanced programming',
        description: 'Learn advanced programming concepts',
        content: 'Topics include design patterns',
        studycredit: 5,
        location: 'Campus A',
        contact_id: 1,
        level: 'Bachelor',
        learningoutcomes: 'Students will learn advanced concepts',
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
          shortdescription: 'Short description 1',
          description: 'Description 1',
          content: 'Content 1',
          studycredit: 5,
          location: 'Campus A',
          contact_id: 1,
          level: 'Bachelor',
          learningoutcomes: 'Outcomes 1',
        },
        {
          id: 'module2',
          name: 'Module 2',
          shortdescription: 'Short description 2',
          description: 'Description 2',
          content: 'Content 2',
          studycredit: 6,
          location: 'Campus B',
          contact_id: 2,
          level: 'Master',
          learningoutcomes: 'Outcomes 2',
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
        shortdescription: 'Old short description',
        description: 'Old description',
        content: 'Old content',
        studycredit: 5,
        location: 'Campus A',
        contact_id: 1,
        level: 'Bachelor',
        learningoutcomes: 'Old outcomes',
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
        shortdescription: 'Short description',
        description: 'Description',
        content: 'Content',
        studycredit: 5,
        location: 'Campus A',
        contact_id: 1,
        level: 'Bachelor',
        learningoutcomes: 'Outcomes',
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
