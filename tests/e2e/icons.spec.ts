import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';

const devOrigin = 'http://127.0.0.1:4326';

test('clinic service duotones and regular UI icons retain decorative semantics and branding', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto('/ru/');
  const services = page.locator('.service-tile > svg:first-child');
  await expect(services).toHaveCount(8);
  for (const icon of await services.all()) {
    await expect(icon).toHaveAttribute('viewBox', '0 0 256 256');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    const opacity = await icon
      .locator('[opacity]')
      .first()
      .getAttribute('opacity');
    expect(Number(opacity)).toBe(0.2);
  }
  for (const name of [
    'phone',
    'clock',
    'license',
    'payment',
    'check',
    'arrow',
    'pin',
    'whatsapp',
  ]) {
    const icon = page.locator('svg[data-ph-icon="' + name + '"]').first();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon.locator('[opacity]')).toHaveCount(0);
  }
  await expect(page.locator('.hero-reputation img')).toHaveAttribute(
    'src',
    '/brands/2gis.png',
  );
  await expect(page.locator('.clinic-wordmark > svg')).toHaveAttribute(
    'viewBox',
    '0 0 40 40',
  );
  await expect(page.locator('.header-whatsapp svg')).toHaveAttribute(
    'viewBox',
    '0 0 256 256',
  );
  await expect(page.locator('svg[data-ph-icon="whatsapp"]')).toHaveCount(3);
  await context.close();
});

test('Phosphor SVG is present in static HTML without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 320, height: 800 },
  });
  const page = await context.newPage();
  await page.goto('/ru/');
  const icons = page.locator('header .header-menu-icon');
  await expect(icons).toHaveCount(2);
  for (const icon of await icons.all()) {
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveAttribute('viewBox', '0 0 256 256');
    await expect(icon.locator('path')).toHaveCount(1);
  }
  await expect(page.locator('astro-island, iconify-icon')).toHaveCount(0);
  await context.close();
});

test('regular menu and disclosure icons follow native component states', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/ru/');
  const toggle = page.locator('header [data-sw-collapsible-trigger]').first();
  await expect(toggle).toHaveAccessibleName(/.+/);
  await expect(toggle.locator('.header-menu-open')).toBeVisible();
  await expect(toggle.locator('.header-menu-close')).toBeHidden();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle.locator('.header-menu-open')).toBeHidden();
  await expect(toggle.locator('.header-menu-close')).toBeVisible();
  await page.screenshot({
    path: info.outputPath('phosphor-menu-320.png'),
    animations: 'disabled',
  });
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await page.goto(devOrigin + '/components/default/');
  const details = page.locator('.faq details').first();
  const summary = details.locator('summary');
  const caret = summary.locator('.faq-caret');
  await expect(caret).toHaveAttribute('aria-hidden', 'true');
  await expect(caret).toHaveCSS('transform', 'none');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  expect(await caret.evaluate((el) => getComputedStyle(el).transform)).toMatch(
    /matrix\(-1,/,
  );
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await details.scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath('phosphor-disclosure-' + width + '.png'),
      animations: 'disabled',
    });
  }
});

test('production assets contain no icon runtime, icon font or framework hydration', () => {
  const assets = readdirSync('dist/_astro');
  for (const file of assets.filter((file) => /\.(js|css)$/.test(file))) {
    expect(readFileSync('dist/_astro/' + file, 'utf8')).not.toMatch(
      /unplugin-icons|@iconify|iconify-icon|phosphor-icons|react-dom|createRoot/,
    );
  }
  expect(
    assets.filter((file) => /phosphor|iconfont|iconify/i.test(file)),
  ).toEqual([]);
});
