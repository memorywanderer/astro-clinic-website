import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const locale of ['ru', 'kk'])
  for (const suffix of ['', 'services/']) {
    test(`${locale}/${suffix}: SEO head and WCAG automated accessibility`, async ({
      page,
    }, testInfo) => {
      await page.goto(`/${locale}/${suffix}`);
      await expect(page.locator('head title')).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        `https://example.com/${locale}/${suffix}`,
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        'content',
        await page.title(),
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      );
      await expect(
        page.locator('script[type="application/ld+json"]'),
      ).toHaveCount(suffix ? 0 : 1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const lcpImage = page
        .locator(suffix ? '.services img' : '.clinic-hero .hero-photo img')
        .first();
      await expect(lcpImage).toHaveAttribute('loading', 'eager');
      await expect(lcpImage).toHaveAttribute('fetchpriority', 'high');
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        await testInfo.attach(`axe-${width}`, {
          body: JSON.stringify(results),
          contentType: 'application/json',
        });
        expect(results.violations).toEqual([]);
      }
    });
  }
