import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUser } from '@application/usecases/user/user.login.js';
import type { IUserRepo } from '@domain/repos/user.repo.js';
import type { IPasswordHasher } from '@domain/services/IPasswordHasher.js';
import type { User } from '@domain/entities/User.js';

describe('LoginUser', () => {
  let loginUser: LoginUser;
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

    loginUser = new LoginUser(mockUserRepo, mockPasswordHasher);
  });

  it('should successfully login with valid credentials', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

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

    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(user);
    vi.mocked(mockPasswordHasher.verify).mockResolvedValue(true);

    const result = await loginUser.execute(input);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe('user123');
    }
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockPasswordHasher.verify).toHaveBeenCalledWith(input.password, user.passwordHash);
  });

  it('should return error when user does not exist', async () => {
    const input = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);

    const result = await loginUser.execute(input);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe('Invalid Credentials');
    }
    expect(mockPasswordHasher.verify).not.toHaveBeenCalled();
  });

  it('should return error when password is incorrect', async () => {
    const input = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

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

    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(user);
    vi.mocked(mockPasswordHasher.verify).mockResolvedValue(false);

    const result = await loginUser.execute(input);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe('Invalid Credentials');
    }
    expect(mockPasswordHasher.verify).toHaveBeenCalledWith(input.password, user.passwordHash);
  });
});
