import { defineConfig } from 'vitest/config';
import path from 'node:path';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/category/*': path.resolve(__dirname, './src/core/category/*'),
      '@/shared/*': path.resolve(__dirname, './src/core/shared/*'),
    },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
});
