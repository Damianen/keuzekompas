import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Mock localStorage with actual storage
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

global.localStorage = new LocalStorageMock() as Storage;

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
  },
  writable: true,
});

// Mock pointer capture for Radix UI components
if (typeof Element !== 'undefined') {
  Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture || function() {
    return false;
  };

  Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || function() {};

  Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || function() {};
}
