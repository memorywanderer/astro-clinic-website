import { expect, test } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';

test.use({ javaScriptEnabled: false });
test('static root redirects without JavaScript and unknown pages return 404', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ru\/$/);
  expect((await page.goto('/kk/missing/'))?.status()).toBe(404);
  expect((await page.goto('/en/'))?.status()).toBe(404);
});

for (const locale of ['ru', 'kk'])
  for (const path of ['', 'services/']) {
    test(`${locale}/${path}: static content, navigation and equivalent language switching`, async ({
      page,
    }) => {
      const requests: string[] = [];
      page.on('request', (request) => {
        if (['fetch', 'xhr'].includes(request.resourceType()))
          requests.push(request.url());
      });
      await page.goto(`/${locale}/${path}`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /.+/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://example.com/${locale}/${path}`,
      );
      await expect(page.locator('link[hreflang]')).toHaveCount(0);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
      expect(
        await page
          .locator(path ? '.services [data-item]' : '#treatments li')
          .count(),
      ).toBe(path ? 4 : 8);
      await expect(page.locator('main')).not.toContainText(
        /nav\.(home|services)|action\.(contact|services)/,
      );
      await expect(page.locator('main')).toContainText(
        path
          ? locale === 'kk'
            ? 'Кеңістікті зерттеу'
            : 'Исследование пространства'
          : locale === 'kk'
            ? 'Тісті емдеу'
            : 'Лечение зубов',
      );
      const switcher = page.getByRole('navigation', {
        name: locale === 'ru' ? 'Выбор языка' : 'Тілді таңдау',
      });
      await expect(switcher.locator('[aria-current="page"]')).toHaveAttribute(
        'lang',
        locale,
      );
      const other = locale === 'ru' ? 'kk' : 'ru';
      await switcher.locator(`a[lang="${other}"]`).focus();
      await expect(switcher.locator(`a[lang="${other}"]`)).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new RegExp(`/${other}/${path}$`));
      await page.goto(`/${locale}/${path}`);
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await expect(switcher).toBeVisible();
        if (width === 320 || width === 1440) {
          await page.screenshot({
            path: test
              .info()
              .outputPath(
                `${locale}-${path ? 'services' : 'home'}-${width}.png`,
              ),
            fullPage: true,
          });
        }
      }
      await page.setViewportSize({ width: 640, height: 900 });
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const nav = page.getByRole('navigation', {
        name: path
          ? locale === 'ru'
            ? 'Навигация внизу страницы'
            : 'Бет соңындағы навигация'
          : 'Клиника',
      });
      await expect(nav.locator('a').last()).toHaveAttribute(
        'href',
        path ? `/${locale}/services/` : '#contact',
      );
      await nav.locator('a').last().click();
      await expect(page).toHaveURL(
        new RegExp(path ? `/${locale}/services/$` : `/${locale}/#contact$`),
      );
      expect(requests).toEqual([]);
    });
  }

for (const locale of ['ru', 'kk'])
  test(`${locale}: both storage representations render identical service markup`, async ({
    page,
  }) => {
    await page.goto(`http://127.0.0.1:4326/content-preview/${locale}/`);
    const fields = page.locator('[data-representation="fields"]');
    const entries = page.locator('[data-representation="entries"]');
    expect(await fields.innerHTML()).toBe(await entries.innerHTML());
    await expect(page.locator('.testimonials figure')).toHaveCount(3);
  });

test('production HTML contains localized content, optimized images and no preview routes', () => {
  for (const locale of ['ru', 'kk']) {
    for (const suffix of ['', 'services/']) {
      const html = readFileSync(`dist/${locale}/${suffix}index.html`, 'utf8');
      expect(html).toContain(`lang="${locale}"`);
      expect(html).toContain(
        suffix
          ? locale === 'kk'
            ? 'Кеңістікті зерттеу'
            : 'Исследование пространства'
          : locale === 'kk'
            ? 'Тісті емдеу'
            : 'Лечение зубов',
      );
      expect(html).toContain('.webp');
      expect(html).not.toContain('client:');
      expect(html).not.toContain('sample-1');
    }
    expect(existsSync(`dist/content-preview/${locale}/index.html`)).toBe(false);
  }
});
