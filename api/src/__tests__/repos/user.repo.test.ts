import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { UserRepo } from '@infra/repos/user.repo.js';
import type { User } from '@domain/entities/User.js';

describe('UserRepo', () => {
  let userRepo: UserRepo;

  beforeAll(() => {
    userRepo = new UserRepo(mongoose.connection);
  });

  it('should create a new user', async () => {
    const user: User = {
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      passwordHash: 'hashedPassword123',
      role: 1,
      favorites: [],
      createdAt: new Date(),
    };

    const id = await userRepo.upsert(user);

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('should find user by id', async () => {
    const user: User = {
      email: 'findbyid@example.com',
      name: 'Find By ID User',
      study: 'Mathematics',
      passwordHash: 'hashedPassword456',
      role: 1,
      favorites: [],
      createdAt: new Date(),
    };

    const id = await userRepo.upsert(user);
    const foundUser = await userRepo.findById(id);

    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(user.email);
    expect(foundUser?.name).toBe(user.name);
    expect(foundUser?.study).toBe(user.study);
  });

  it('should find user by email', async () => {
    const user: User = {
      email: 'findbyemail@example.com',
      name: 'Find By Email User',
      study: 'Physics',
      passwordHash: 'hashedPassword789',
      role: 1,
      favorites: [],
      createdAt: new Date(),
    };

    await userRepo.upsert(user);
    const foundUser = await userRepo.findByEmail('findbyemail@example.com');

    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(user.email);
    expect(foundUser?.name).toBe(user.name);
  });

  it('should return null when user not found by id', async () => {
    const foundUser = await userRepo.findById('507f1f77bcf86cd799439011');
    expect(foundUser).toBeNull();
  });

  it('should return null when user not found by email', async () => {
    const foundUser = await userRepo.findByEmail('nonexistent@example.com');
    expect(foundUser).toBeNull();
  });

  it('should update existing user', async () => {
    const user: User = {
      email: 'update@example.com',
      name: 'Original Name',
      study: 'Computer Science',
      passwordHash: 'hashedPassword',
      role: 1,
      favorites: [],
      createdAt: new Date(),
    };

    const id = await userRepo.upsert(user);

    const updatedUser: User = {
      ...user,
      id,
      name: 'Updated Name',
      study: 'Data Science',
    };

    const updatedId = await userRepo.upsert(updatedUser);
    expect(updatedId).toBe(id);

    const foundUser = await userRepo.findById(id);
    expect(foundUser?.name).toBe('Updated Name');
    expect(foundUser?.study).toBe('Data Science');
  });

  it('should delete user', async () => {
    const user: User = {
      email: 'delete@example.com',
      name: 'Delete User',
      study: 'Chemistry',
      passwordHash: 'hashedPassword',
      role: 1,
      favorites: [],
      createdAt: new Date(),
    };

    const id = await userRepo.upsert(user);
    await userRepo.delete(id);

    const foundUser = await userRepo.findById(id);
    expect(foundUser).toBeNull();
  });

  it('should add favorite module', async () => {
    const user: User = {
      email: 'favorites@example.com',
      name: 'Favorites User',
      study: 'Computer Science',
      passwordHash: 'hashedPassword',
      role: 1,
      favorites: [],
      createdAt: new Date(),
    };

    const userId = await userRepo.upsert(user);
    const moduleId = new mongoose.Types.ObjectId().toString();

    await userRepo.addFavorite(userId, moduleId);

    const favorites = await userRepo.listFavorites(userId);
    expect(favorites).toBeDefined();
  });

  it('should remove favorite module', async () => {
    const user: User = {
      email: 'removefavorite@example.com',
      name: 'Remove Favorite User',
      study: 'Computer Science',
      passwordHash: 'hashedPassword',
      role: 1,
      favorites: [],
      createdAt: new Date(),
    };

    const userId = await userRepo.upsert(user);
    const moduleId = new mongoose.Types.ObjectId().toString();

    await userRepo.addFavorite(userId, moduleId);
    await userRepo.removeFavorite(userId, moduleId);

    const favorites = await userRepo.listFavorites(userId);
    expect(favorites).toHaveLength(0);
  });
});
