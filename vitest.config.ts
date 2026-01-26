import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['apps/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.browser-test.ts'],
  },
});
