import { describe, it, expect, beforeAll } from 'vitest';
import mongoose from 'mongoose';
import { ModuleRepo } from '@infra/repos/module.repo.js';
import type { Module } from '@domain/entities/Module.js';

describe('ModuleRepo', () => {
  let moduleRepo: ModuleRepo;

  beforeAll(() => {
    moduleRepo = new ModuleRepo(mongoose.connection);
  });

  it('should create a new module', async () => {
    const module: Module = {
      name: 'Advanced Programming',
      shortdescription: 'A course on advanced programming',
      description: 'Learn advanced programming concepts',
      content: 'Topics include design patterns, algorithms, etc.',
      studycredit: 5,
      location: 'Campus A',
      contact_id: 1,
      level: 'Bachelor',
      learningoutcomes: 'Students will learn advanced concepts',
    };

    const id = await moduleRepo.upsert(module);

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('should find module by id', async () => {
    const module: Module = {
      name: 'Data Structures',
      shortdescription: 'A course on data structures',
      description: 'Study data structures',
      content: 'Topics include arrays, trees, graphs',
      studycredit: 6,
      location: 'Campus B',
      contact_id: 2,
      level: 'Master',
      learningoutcomes: 'Students will understand data structures',
    };

    const id = await moduleRepo.upsert(module);
    const foundModule = await moduleRepo.findById(id);

    expect(foundModule).toBeDefined();
    expect(foundModule?.name).toBe(module.name);
    expect(foundModule?.studycredit).toBe(module.studycredit);
    expect(foundModule?.level).toBe(module.level);
  });

  it('should return null when module not found by findById', async () => {
    const foundModule = await moduleRepo.findById('507f1f77bcf86cd799439011');
    expect(foundModule).toBeNull();
  });

  it('should get module by id', async () => {
    const module: Module = {
      name: 'Algorithms',
      shortdescription: 'A course on algorithms',
      description: 'Study algorithms',
      content: 'Topics include sorting, searching',
      studycredit: 5,
      location: 'Online',
      contact_id: 3,
      level: 'Bachelor',
      learningoutcomes: 'Students will master algorithms',
    };

    const id = await moduleRepo.upsert(module);
    const foundModule = await moduleRepo.getById(id);

    expect(foundModule).toBeDefined();
    expect(foundModule.name).toBe(module.name);
  });

  it('should throw error when module not found by getById', async () => {
    await expect(
      moduleRepo.getById('507f1f77bcf86cd799439011')
    ).rejects.toThrow('Module with id 507f1f77bcf86cd799439011 not found');
  });

  it('should list all modules', async () => {
    const module1: Module = {
      name: 'Module 1',
      shortdescription: 'Short description 1',
      description: 'Description 1',
      content: 'Content 1',
      studycredit: 5,
      location: 'Campus A',
      contact_id: 1,
      level: 'Bachelor',
      learningoutcomes: 'Outcomes 1',
    };

    const module2: Module = {
      name: 'Module 2',
      shortdescription: 'Short description 2',
      description: 'Description 2',
      content: 'Content 2',
      studycredit: 6,
      location: 'Campus B',
      contact_id: 2,
      level: 'Master',
      learningoutcomes: 'Outcomes 2',
    };

    await moduleRepo.upsert(module1);
    await moduleRepo.upsert(module2);

    const modules = await moduleRepo.list();

    expect(modules.length).toBeGreaterThanOrEqual(2);
    expect(modules.some(m => m.name === 'Module 1')).toBe(true);
    expect(modules.some(m => m.name === 'Module 2')).toBe(true);
  });

  it('should update existing module', async () => {
    const module: Module = {
      name: 'Original Name',
      shortdescription: 'Original short description',
      description: 'Original description',
      content: 'Original content',
      studycredit: 5,
      location: 'Campus A',
      contact_id: 1,
      level: 'Bachelor',
      learningoutcomes: 'Original outcomes',
    };

    const id = await moduleRepo.upsert(module);

    const updatedModule: Module = {
      ...module,
      id,
      name: 'Updated Name',
      description: 'Updated description',
    };

    const updatedId = await moduleRepo.upsert(updatedModule);
    expect(updatedId).toBe(id);

    const foundModule = await moduleRepo.findById(id);
    expect(foundModule?.name).toBe('Updated Name');
    expect(foundModule?.description).toBe('Updated description');
  });

  it('should delete module', async () => {
    const module: Module = {
      name: 'To Delete',
      shortdescription: 'Will be deleted',
      description: 'Will be deleted',
      content: 'Delete me',
      studycredit: 5,
      location: 'Campus C',
      contact_id: 1,
      level: 'Bachelor',
      learningoutcomes: 'None',
    };

    const id = await moduleRepo.upsert(module);
    await moduleRepo.delete(id);

    const foundModule = await moduleRepo.findById(id);
    expect(foundModule).toBeNull();
  });
});
