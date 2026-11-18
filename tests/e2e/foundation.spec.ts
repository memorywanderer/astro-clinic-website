import { expect, test } from '@playwright/test';
import { siteConfig, themes } from '../../src/config/site';

const devOrigin = 'http://127.0.0.1:4326';

test.use({ javaScriptEnabled: false });

test('site configuration selects the static root theme', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page).toHaveTitle(
    'SAYA QAM — семейная стоматология в Алматы (демо)',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('html')).toHaveAttribute(
    'data-theme',
    siteConfig.theme,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
});

for (const theme of themes) {
  test(`${theme}: resolved token contract, contrast, focus and responsive layout without JavaScript`, async ({
    page,
  }) => {
    // Astro's prefixed i18n router gives unprefixed dev showcases HTTP 404
    // while preserving their authored body. Public-route absence is tested separately.
    await page.goto(`${devOrigin}/design-system/${theme}/`);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Недоступно' }),
    ).toBeDisabled();
    const contract = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const probe = document.createElement('div');
      document.body.append(probe);
      const color = (name: string) => {
        const value = root.getPropertyValue(`--${name}`).trim();
        if (!value || !CSS.supports('color', value))
          throw new Error(`Invalid token ${name}: ${value}`);
        probe.style.color = value;
        const rgb = getComputedStyle(probe)
          .color.match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number);
        return rgb;
      };
      const luminance = (rgb: number[]) =>
        rgb
          .map((v) => {
            const s = v / 255;
            return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      const contrast = (a: string, b: string) => {
        const x = luminance(color(a));
        const y = luminance(color(b));
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      };
      const pairs = [
        ['background', 'foreground'],
        ['card', 'card-foreground'],
        ['popover', 'popover-foreground'],
        ['primary', 'primary-foreground'],
        ['secondary', 'secondary-foreground'],
        ['muted', 'muted-foreground'],
        ['accent', 'accent-foreground'],
        ['error', 'error-foreground'],
        ['background', 'muted-foreground'],
        ['card', 'muted-foreground'],
        ['background', 'primary-accent'],
        ['background', 'secondary-accent'],
        ['primary-accent', 'primary-foreground'],
      ];
      const text = pairs.map(([a, b]) => ({ a, b, ratio: contrast(a, b) }));
      const indicators = ['outline', 'input', 'border'].flatMap((a) =>
        ['background', 'card', 'secondary'].map((b) => ({
          a,
          b,
          ratio: contrast(a, b),
        })),
      );
      probe.remove();
      return { text, indicators };
    });
    for (const pair of contract.text)
      expect(pair.ratio, `${pair.a}/${pair.b}`).toBeGreaterThanOrEqual(4.5);
    for (const pair of contract.indicators)
      expect(pair.ratio, `${pair.a}/${pair.b}`).toBeGreaterThanOrEqual(3);
    const button = page.getByRole('button', {
      name: 'Starwind UI',
      exact: true,
    });
    for (let index = 0; index <= themes.length; index++)
      await page.keyboard.press('Tab');
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS('outline-style', 'solid');
    await expect(button).toHaveCSS('outline-width', '3px');
    await expect(button).toHaveCSS('border-top-width', '1px');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox')).toBeFocused();
    await expect(page.getByRole('textbox')).toHaveCSS('outline-style', 'solid');
    const utilityContract = await button.evaluate((el) => {
      const style = getComputedStyle(el);
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'var(--primary)';
      probe.style.color = 'var(--primary-foreground)';
      probe.style.borderRadius = 'var(--radius)';
      document.body.append(probe);
      const expected = getComputedStyle(probe);
      const valid =
        style.backgroundColor === expected.backgroundColor &&
        style.color === expected.color &&
        style.borderRadius === expected.borderRadius;
      probe.style.color = 'var(--muted-foreground)';
      const placeholderValid =
        getComputedStyle(document.querySelector('input')!, '::placeholder')
          .color === getComputedStyle(probe).color;
      probe.remove();
      return valid && placeholderValid;
    });
    expect(utilityContract).toBe(true);
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(button).toBeVisible();
      if (width !== 768) {
        await page.screenshot({
          path: test.info().outputPath(`${theme}-${width}.png`),
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
    await expect(button).toBeVisible();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(
      await page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        return ['fast', 'normal', 'slow'].every(
          (name) =>
            CSS.supports(
              'transition-duration',
              root.getPropertyValue(`--duration-${name}`).trim(),
            ) && parseFloat(root.getPropertyValue(`--duration-${name}`)) === 0,
        );
      }),
    ).toBe(true);
    await test.info().attach('contrast', {
      body: JSON.stringify(contract, null, 2),
      contentType: 'application/json',
    });
  });
}

test('identities change typography, color, spacing and shape using the same markup', async ({
  page,
}) => {
  const identities = [];
  for (const theme of themes) {
    await page.goto(`${devOrigin}/design-system/${theme}/`);
    identities.push(
      await page
        .getByRole('button', { name: 'Starwind UI', exact: true })
        .evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            font: style.fontFamily,
            color: style.backgroundColor,
            radius: style.borderRadius,
            spacing: getComputedStyle(
              document.querySelector('[data-surface="card"]')!,
            ).padding,
          };
        }),
    );
  }
  for (const key of ['font', 'color', 'radius', 'spacing'] as const)
    expect(identities[0][key]).not.toBe(identities[1][key]);
});
