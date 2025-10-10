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
      location: 'Campus A',
      period: 1,
      provider: 'University X',
      duration: 8,
      language: 'English',
      level: 'Bachelor',
      description: 'Learn advanced programming concepts',
      information: 'Additional information',
      createdAt: new Date(),
    };

    const id = await moduleRepo.upsert(module);

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('should find module by id', async () => {
    const module: Module = {
      name: 'Data Structures',
      location: 'Campus B',
      period: 2,
      provider: 'University Y',
      duration: 10,
      language: 'Dutch',
      level: 'Master',
      description: 'Study data structures',
      information: 'Course details',
      createdAt: new Date(),
    };

    const id = await moduleRepo.upsert(module);
    const foundModule = await moduleRepo.findById(id);

    expect(foundModule).toBeDefined();
    expect(foundModule?.name).toBe(module.name);
    expect(foundModule?.provider).toBe(module.provider);
    expect(foundModule?.level).toBe(module.level);
  });

  it('should return null when module not found by findById', async () => {
    const foundModule = await moduleRepo.findById('507f1f77bcf86cd799439011');
    expect(foundModule).toBeNull();
  });

  it('should get module by id', async () => {
    const module: Module = {
      name: 'Algorithms',
      location: 'Online',
      period: 3,
      provider: 'University Z',
      duration: 12,
      language: 'English',
      level: 'Bachelor',
      description: 'Study algorithms',
      information: 'Online course',
      createdAt: new Date(),
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
      location: 'Campus A',
      period: 1,
      provider: 'University X',
      duration: 8,
      language: 'English',
      level: 'Bachelor',
      description: 'Description 1',
      information: 'Info 1',
      createdAt: new Date(),
    };

    const module2: Module = {
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
      location: 'Campus A',
      period: 1,
      provider: 'University X',
      duration: 8,
      language: 'English',
      level: 'Bachelor',
      description: 'Original description',
      information: 'Original info',
      createdAt: new Date(),
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
      location: 'Campus C',
      period: 1,
      provider: 'University X',
      duration: 8,
      language: 'English',
      level: 'Bachelor',
      description: 'Will be deleted',
      information: 'Delete me',
      createdAt: new Date(),
    };

    const id = await moduleRepo.upsert(module);
    await moduleRepo.delete(id);

    const foundModule = await moduleRepo.findById(id);
    expect(foundModule).toBeNull();
  });
});
