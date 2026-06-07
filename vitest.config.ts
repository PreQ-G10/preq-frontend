import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.unit.test.{ts,tsx}'],
    exclude: ['node_modules', 'android', 'ios', '.expo'],
    coverage: {
      reporter: ['lcov', 'json-summary'],
    }
  },
})