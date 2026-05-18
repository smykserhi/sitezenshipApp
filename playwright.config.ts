import { defineConfig, devices } from '@playwright/test';

/**
 * Production-safe configuration for monitoring deployed environment.
 * Uses conservative timeouts and failure handling suitable for production testing.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',

  // Timeout settings suitable for production monitoring
  timeout: 30 * 1000, // 30 seconds per test
  globalTimeout: 5 * 60 * 1000, // 5 minutes total
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },

  // Retry configuration for production stability
  retries: 0, // No retries here; GitHub Actions workflow handles retries

  // Output configuration
  outputDir: 'test-results',
  reportDir: 'playwright-report',

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'], // Console output
  ],

  use: {
    // Base URL for API requests (if needed)
    baseURL: 'https://sitezenshipapp.onrender.com',

    // Browser context options
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Network timeout settings
    navigationTimeout: 30 * 1000,
    actionTimeout: 10 * 1000,

    // Accept self-signed certificates for production
    ignoreHTTPSErrors: false,
  },

  webServer: undefined, // No local server needed for production tests

  // Configure browsers for production testing
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
