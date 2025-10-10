import { describe, it, expect } from 'vitest';
import { JwtService } from '@infra/services/JwtService.js';
import { PasswordHasher } from '@infra/services/PasswordHasher.js';

describe('JwtService', () => {
  it('should throw error when secret key is not provided', () => {
    expect(() => new JwtService('')).toThrow('JWT secret key is required');
  });

  it('should sign and verify a token', async () => {
    const jwtService = new JwtService('test-secret-key');
    const payload = { userId: 'user123', email: 'test@example.com' };

    const token = await jwtService.sign(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = await jwtService.verify<typeof payload>(token);
    expect(decoded.userId).toBe('user123');
    expect(decoded.email).toBe('test@example.com');
  });

  it('should sign token with expiration', async () => {
    const jwtService = new JwtService('test-secret-key');
    const payload = { userId: 'user123' };

    const token = await jwtService.sign(payload, { expiresIn: '1h' });
    expect(token).toBeDefined();

    const decoded = await jwtService.verify<any>(token);
    expect(decoded.exp).toBeDefined();
  });

  it('should reject invalid token', async () => {
    const jwtService = new JwtService('test-secret-key');

    await expect(jwtService.verify('invalid-token')).rejects.toThrow();
  });

  it('should reject token with wrong secret', async () => {
    const jwtService1 = new JwtService('secret1');
    const jwtService2 = new JwtService('secret2');

    const token = await jwtService1.sign({ userId: 'user123' });

    await expect(jwtService2.verify(token)).rejects.toThrow();
  });
});

describe('PasswordHasher', () => {
  it('should hash a password', async () => {
    const passwordHasher = new PasswordHasher();
    const password = 'password123';

    const hash = await passwordHasher.hash(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it('should verify correct password', async () => {
    const passwordHasher = new PasswordHasher();
    const password = 'password123';

    const hash = await passwordHasher.hash(password);
    const isValid = await passwordHasher.verify(password, hash);

    expect(isValid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const passwordHasher = new PasswordHasher();
    const password = 'password123';

    const hash = await passwordHasher.hash(password);
    const isValid = await passwordHasher.verify('wrongpassword', hash);

    expect(isValid).toBe(false);
  });

  it('should create different hashes for same password', async () => {
    const passwordHasher = new PasswordHasher();
    const password = 'password123';

    const hash1 = await passwordHasher.hash(password);
    const hash2 = await passwordHasher.hash(password);

    expect(hash1).not.toBe(hash2);
    expect(await passwordHasher.verify(password, hash1)).toBe(true);
    expect(await passwordHasher.verify(password, hash2)).toBe(true);
  });

  it('should accept custom salt rounds', async () => {
    const passwordHasher = new PasswordHasher(10);
    const password = 'password123';

    const hash = await passwordHasher.hash(password);
    const isValid = await passwordHasher.verify(password, hash);

    expect(isValid).toBe(true);
  });
});
