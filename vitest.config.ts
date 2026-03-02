import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./apps/web/src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'apps/web/src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/mock-data',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web/src'),
      '@repo/ui': path.resolve(__dirname, './packages/ui/src'),
      '@repo/types': path.resolve(__dirname, './packages/types/src'),
    },
  },
})
