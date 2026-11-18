import { expect, test } from 'vitest';
import { siteConfig } from '@/config/site';

test('site identity is usable by the layout and static build', () => {
  expect(siteConfig.name.trim()).not.toBe('');
  const url = new URL(siteConfig.url);
  expect(['http:', 'https:']).toContain(url.protocol);
  expect(siteConfig.locales).toContain(siteConfig.defaultLocale);
  expect(new Set(siteConfig.locales).size).toBe(siteConfig.locales.length);
});
