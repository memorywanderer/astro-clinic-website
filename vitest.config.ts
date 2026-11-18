import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'astro:i18n': fileURLToPath(
        new URL('./tests/support/astro-i18n.ts', import.meta.url),
      ),
    },
  },
  test: { include: ['tests/unit/**/*.test.ts'] },
});
