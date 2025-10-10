import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
  clear: () => {},
  length: 0,
  key: (index: number) => null,
};

global.localStorage = localStorageMock as Storage;

// Mock window.location
delete (window as any).location;
window.location = {
  hostname: 'localhost',
} as any;

// Mock pointer capture for Radix UI components
if (typeof Element !== 'undefined') {
  Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture || function() {
    return false;
  };

  Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || function() {};

  Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || function() {};
}
