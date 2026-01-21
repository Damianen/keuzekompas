import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetModuleById } from '@application/usecases/module/module.getById.js';
import { DeleteModule } from '@application/usecases/module/module.delete.js';
import type { IModuleRepo } from '@domain/repos/module.repo.js';
import type { Module } from '@domain/entities/Module.js';

describe('Module Additional Use Cases', () => {
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

  describe('GetModuleById', () => {
    it('should get module by id', async () => {
      const getModuleById = new GetModuleById(mockModuleRepo);
      const module: Module = {
        id: 'module123',
        name: 'Advanced Programming',
        shortdescription: 'A course on advanced programming',
        description: 'Learn advanced programming',
        content: 'Topics include design patterns',
        studycredit: 5,
        location: 'Campus A',
        contact_id: 1,
        level: 'Bachelor',
        learningoutcomes: 'Students will learn advanced concepts',
      };

      vi.mocked(mockModuleRepo.getById).mockResolvedValue(module);

      const result = await getModuleById.execute('module123');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('module123');
      }
    });

    it('should return error when module not found', async () => {
      const getModuleById = new GetModuleById(mockModuleRepo);
      vi.mocked(mockModuleRepo.getById).mockResolvedValue(null as any);

      const result = await getModuleById.execute('nonexistent');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('Id not found');
      }
    });
  });

  describe('DeleteModule', () => {
    it('should delete module', async () => {
      const deleteModule = new DeleteModule(mockModuleRepo);
      vi.mocked(mockModuleRepo.delete).mockResolvedValue();

      await deleteModule.execute('module123');

      expect(mockModuleRepo.delete).toHaveBeenCalledWith('module123');
    });
  });
});
