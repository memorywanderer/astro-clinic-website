import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const hosting = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};

test('public output excludes internal routes and serves the bilingual 404', async ({
  request,
  page,
}) => {
  for (const path of [
    '/design-system/default/',
    '/components/default/',
    '/motion/default/',
    '/content-preview/ru/',
    '/examples/default/clinic/',
    '/missing-page/',
  ])
    expect((await request.get(path)).status(), path).toBe(404);
  const response = await page.goto('/missing-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
  await expect(page.locator('section[lang="ru"] a')).toHaveAttribute(
    'href',
    '/ru/',
  );
  await expect(page.locator('section[lang="kk"] a')).toHaveAttribute(
    'href',
    '/kk/',
  );
});

test('hosting CSP permits scripts, mobile navigation, dialogs and activated map', async ({
  page,
}) => {
  const violations: string[] = [];
  const missing: string[] = [];
  page.on('console', (message) => {
    if (/content security policy|violat.*directive/i.test(message.text()))
      violations.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) missing.push(response.url());
  });
  // astro preview does not apply hosting headers. Exercise the exact policy in a browser.
  await page.route('**/ru/', async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        ...Object.fromEntries(
          hosting.headers[0].headers.map(({ key, value }) => [key, value]),
        ),
      },
    });
  });
  await page.route('https://platform.2gis.ru/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html lang="ru"><title>Map fixture</title><body>Map fixture</body></html>',
    }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ru/');
  await expect(page.locator('.map-stage iframe')).toHaveCount(0);
  const menu = page.locator('[data-header-menu] button');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await menu.click();
  await page.locator('.main-contact-actions a').first().click();
  await expect(page.locator('#action-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('[data-load-map]').click();
  await expect(
    page.frameLocator('.map-stage iframe').locator('body'),
  ).toContainText('Map fixture');
  expect(violations).toEqual([]);
  expect(missing).toEqual([]);
});
