import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    // Only run tests in the src directory
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // Ensure we exclude the playwright tests and the .next directory
    exclude: [...configDefaults.exclude, '**/tests-e2e/**', '.next/**'],
  },
})
