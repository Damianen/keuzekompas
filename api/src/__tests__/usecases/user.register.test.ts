import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUser } from '@application/usecases/user/user.register.js';
import type { IUserRepo } from '@domain/repos/user.repo.js';
import type { IPasswordHasher } from '@domain/services/IPasswordHasher.js';
import type { User } from '@domain/entities/User.js';

describe('RegisterUser', () => {
  let registerUser: RegisterUser;
  let mockUserRepo: IUserRepo;
  let mockPasswordHasher: IPasswordHasher;

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

    mockPasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    };

    registerUser = new RegisterUser(mockUserRepo, mockPasswordHasher);
  });

  it('should successfully register a new user', async () => {
    const input = {
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      password: 'password123',
    };

    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
    vi.mocked(mockPasswordHasher.hash).mockResolvedValue('hashedPassword');
    vi.mocked(mockUserRepo.upsert).mockResolvedValue('user123');

    const result = await registerUser.execute(input);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe('user123');
    }
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(input.password);
    expect(mockUserRepo.upsert).toHaveBeenCalled();
  });

  it('should assign default role when not provided', async () => {
    const input = {
      email: 'test@example.com',
      name: 'Test User',
      study: 'Computer Science',
      password: 'password123',
    };

    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
    vi.mocked(mockPasswordHasher.hash).mockResolvedValue('hashedPassword');
    vi.mocked(mockUserRepo.upsert).mockResolvedValue('user123');

    await registerUser.execute(input);

    expect(mockUserRepo.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 1,
      })
    );
  });

  it('should use provided role when specified', async () => {
    const input = {
      email: 'admin@example.com',
      name: 'Admin User',
      study: 'Computer Science',
      password: 'password123',
      role: 2,
    };

    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
    vi.mocked(mockPasswordHasher.hash).mockResolvedValue('hashedPassword');
    vi.mocked(mockUserRepo.upsert).mockResolvedValue('admin123');

    await registerUser.execute(input);

    expect(mockUserRepo.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 2,
      })
    );
  });

  it('should return error when email already exists', async () => {
    const input = {
      email: 'existing@example.com',
      name: 'Test User',
      study: 'Computer Science',
      password: 'password123',
    };

    const existingUser: User = {
      id: 'existing123',
      email: 'existing@example.com',
      name: 'Existing User',
      study: 'Computer Science',
      passwordHash: 'hashedPassword',
      role: 1,
      favorites: [],
      createdAt: new Date(),
    };

    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(existingUser);

    const result = await registerUser.execute(input);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe('Email already registered');
    }
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepo.upsert).not.toHaveBeenCalled();
  });
});
