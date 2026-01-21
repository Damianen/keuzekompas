import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModuleController } from '@adapters/controllers/module.controller.js';
import type { ModuleService } from '@application/services/module.service.js';
import { ok, err } from '@shared/result.js';
import { NotFoundError } from '@shared/error.js';
import type { Module } from '@domain/entities/Module.js';

describe('ModuleController', () => {
  let moduleController: ModuleController;
  let mockModuleService: ModuleService;
  let mockContext: any;

  beforeEach(() => {
    mockModuleService = {
      create: { execute: vi.fn() },
      getById: { execute: vi.fn() },
      list: { execute: vi.fn() },
      update: { execute: vi.fn() },
      deleteModule: { execute: vi.fn() },
    } as any;

    mockContext = {
      req: {
        json: vi.fn(),
        param: vi.fn(),
      },
      json: vi.fn((data, status) => ({ data, status })),
    };

    moduleController = new ModuleController(mockModuleService);
  });

  describe('create', () => {
    it('should create a new module successfully', async () => {
      const moduleData = {
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

      mockContext.req.json.mockResolvedValue(moduleData);
      vi.mocked(mockModuleService.create.execute).mockResolvedValue(
        ok({ id: 'module123' })
      );

      const response = await moduleController.create(mockContext);

      expect(mockModuleService.create.execute).toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ id: 'module123' }),
        }),
        201
      );
    });

    it('should handle creation failure', async () => {
      const moduleData = {
        name: 'Test Module',
        shortdescription: 'Short description',
        description: 'Description',
        content: 'Content',
        studycredit: 5,
        location: 'Campus A',
        contact_id: 1,
        level: 'Bachelor',
        learningoutcomes: 'Outcomes',
      };

      mockContext.req.json.mockResolvedValue(moduleData);
      vi.mocked(mockModuleService.create.execute).mockResolvedValue(
        err(new Error('Creation failed'))
      );

      const response = await moduleController.create(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ message: 'Creation failed' }),
        }),
        400
      );
    });
  });

  describe('getById', () => {
    it('should get module by id successfully', async () => {
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

      mockContext.req.param.mockReturnValue('module123');
      vi.mocked(mockModuleService.getById.execute).mockResolvedValue(ok(module));

      const response = await moduleController.getById(mockContext);

      expect(mockModuleService.getById.execute).toHaveBeenCalledWith('module123');
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ name: 'Advanced Programming' }),
        }),
        200
      );
    });

    it('should handle module not found', async () => {
      mockContext.req.param.mockReturnValue('nonexistent');
      vi.mocked(mockModuleService.getById.execute).mockResolvedValue(
        err(new NotFoundError('Module not found'))
      );

      const response = await moduleController.getById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ message: 'Module not found' }),
        }),
        404
      );
    });
  });

  describe('list', () => {
    it('should list all modules successfully', async () => {
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

      vi.mocked(mockModuleService.list.execute).mockResolvedValue(ok(modules));

      const response = await moduleController.list(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            modules: expect.arrayContaining([
              expect.objectContaining({ name: 'Module 1' }),
              expect.objectContaining({ name: 'Module 2' }),
            ]),
            total: 2,
          }),
        }),
        200
      );
    });
  });

  describe('update', () => {
    it('should update module successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      mockContext.req.param.mockReturnValue('module123');
      mockContext.req.json.mockResolvedValue(updateData);
      vi.mocked(mockModuleService.update.execute).mockResolvedValue(
        ok({ id: 'module123' })
      );

      const response = await moduleController.update(mockContext);

      expect(mockModuleService.update.execute).toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ id: 'module123' }),
        }),
        200
      );
    });
  });

  describe('delete', () => {
    it('should delete module successfully', async () => {
      mockContext.req.param.mockReturnValue('module123');
      vi.mocked(mockModuleService.deleteModule.execute).mockResolvedValue(undefined);

      const response = await moduleController.delete(mockContext);

      expect(mockModuleService.deleteModule.execute).toHaveBeenCalledWith('module123');
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ message: 'Module deleted successfully' }),
        }),
        200
      );
    });
  });
});
