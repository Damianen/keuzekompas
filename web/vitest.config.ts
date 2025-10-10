import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        'vitest.config.ts',
        'src/main.tsx',
        'vite.config.ts',
        'tailwind.config.ts',
        'eslint.config.js',
        'public/**',
        'src/components/ui/**', // UI library components
        'src/components/layout/**', // Layout components
        'src/components/features/**', // Marketing/landing page components
        'src/App.tsx', // Just routing configuration
        'src/types/**', // Type definitions
        'src/pages/HomePage.tsx', // Just landing page
        'src/pages/AboutPage.tsx', // Static content page
        'src/pages/ModuleDetailPage.tsx', // Complex page - needs separate test suite
        'src/pages/ModuleFormPage.tsx', // Complex admin page - needs separate test suite
        'src/components/ModuleChat.tsx', // AI chat feature - needs separate test suite
        'src/hooks/useApi.ts', // Custom hook - causes memory issues with v8 coverage
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
