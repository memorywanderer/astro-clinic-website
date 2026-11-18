import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:4325' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    {
      name: 'webkit',
      testMatch: [
        '**/motion.spec.ts',
        '**/clinic-home.spec.ts',
        '**/clinic-polish.spec.ts',
        '**/deployment.spec.ts',
      ],
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: [
    {
      command:
        'pnpm build && pnpm preview --ignore-lock --host 127.0.0.1 --port 4325',
      url: 'http://127.0.0.1:4325',
      reuseExistingServer: false,
    },
    {
      command: 'pnpm dev --ignore-lock --host 127.0.0.1 --port 4326',
      url: 'http://127.0.0.1:4326',
      reuseExistingServer: false,
    },
  ],
});
