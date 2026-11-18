import { expect, test } from '@playwright/test';
import { themes } from '../../src/config/site';

test.use({ baseURL: 'http://127.0.0.1:4326' });

for (const theme of themes) {
  test(`${theme}: block structures, optional data, media and responsive content without JavaScript`, async ({
    browser,
  }) => {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(`http://127.0.0.1:4326/components/${theme}/`);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(
      page
        .getByTestId('disabled-form')
        .getByRole('button', { name: 'Отправка недоступна', exact: true }),
    ).toHaveAttribute('disabled', '');
    for (const layout of ['centered', 'split', 'fullBleed']) {
      await expect(page.locator(`#hero-${layout}`)).toBeVisible();
      await expect(page.locator(`#hero-${layout} h2`)).not.toBeEmpty();
    }
    await expect(page.locator('#hero-fullBleed em')).toHaveText(
      'нового взгляда',
    );
    await expect(page.locator('#hero-fullBleed')).toContainText(
      'Мастерская формы',
    );
    await expect(page.locator('#hero-centered img')).toHaveCount(0);
    await expect(page.locator('#features-grid li')).toHaveCount(3);
    await expect(page.locator('#features-alternating li')).toHaveCount(2);
    await expect(page.locator('#features-single li')).toHaveCount(1);
    await expect(page.locator('#features-empty li')).toHaveCount(0);
    await expect(page.locator('#features-alternating h3')).toHaveCount(2);
    await expect(page.locator('#engineering-cta')).toHaveAttribute(
      'data-layout',
      'split',
    );
    await expect(page.locator('#studio-cta')).toHaveAttribute(
      'data-layout',
      'centered',
    );
    await expect(page.locator('#studio-cta p')).toHaveCount(0);
    await expect(page.locator('#card-override')).toHaveCSS('padding', '16px');
    await expect(page.locator('#card-override')).toHaveCSS(
      'border-top-style',
      'dashed',
    );
    for (const heading of await page.getByRole('heading').all()) {
      expect((await heading.textContent())?.trim()).toBeTruthy();
    }
    for (const image of await page.locator('main img').all()) {
      expect(await image.getAttribute('alt')).not.toBeNull();
      expect(Number(await image.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(await image.getAttribute('height'))).toBeGreaterThan(0);
    }
    await expect(page.locator('#hero-split img')).toHaveAttribute(
      'loading',
      'eager',
    );
    await expect(page.locator('#features-grid img').first()).toHaveAttribute(
      'loading',
      'lazy',
    );
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (width === 1440) {
        const splitText = await page
          .locator('#hero-split header')
          .boundingBox();
        const splitMedia = await page.locator('#hero-split img').boundingBox();
        expect(splitMedia!.x).toBeGreaterThan(splitText!.x + splitText!.width);
        const fullMedia = await page
          .locator('#hero-fullBleed img')
          .boundingBox();
        expect(fullMedia!.x).toBe(0);
        expect(fullMedia!.width).toBe(width);
        const first = await page
          .locator('#features-alternating img')
          .nth(0)
          .boundingBox();
        const second = await page
          .locator('#features-alternating img')
          .nth(1)
          .boundingBox();
        expect(second!.x).toBeGreaterThan(first!.x);
      }
      if (width !== 768)
        await page.screenshot({
          path: test.info().outputPath(`${theme}-${width}.png`),
          fullPage: false,
        });
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
    await page.close();
  });

  test(`${theme}: native buttons, keyboard focus and Starwind disabled behavior`, async ({
    page,
  }) => {
    await page.goto(`/components/${theme}/`);
    const ratios = await page
      .locator('button[data-sw-button]')
      .evaluateAll((buttons) => {
        const luminance = (color: string) => {
          const channels = color
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number);
          return channels
            .map((value) => {
              const s = value / 255;
              return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
            })
            .reduce(
              (sum, value, index) =>
                sum + value * [0.2126, 0.7152, 0.0722][index],
              0,
            );
        };
        return buttons.map((button) => {
          const style = getComputedStyle(button);
          let surface: Element | null = button;
          while (
            surface &&
            getComputedStyle(surface).backgroundColor === 'rgba(0, 0, 0, 0)'
          )
            surface = surface.parentElement;
          const background = luminance(
            getComputedStyle(surface!).backgroundColor,
          );
          const foreground = luminance(style.color);
          return (
            (Math.max(background, foreground) + 0.05) /
            (Math.min(background, foreground) + 0.05)
          );
        });
      });
    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
    const small = page.getByRole('button', { name: 'Маленькая', exact: true });
    for (let index = 0; index <= themes.length; index++)
      await page.keyboard.press('Tab');
    await expect(small).toBeFocused();
    await expect(small).toHaveCSS('outline-width', '3px');
    await expect(small).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Вторичная', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Контурная', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Объяснимое ограничение', exact: true }),
    ).toBeFocused();
    await expect(
      page.getByRole('button', { name: 'Недоступно', exact: true }),
    ).toBeDisabled();
    const submit = page.getByTestId('disabled-form').getByRole('button', {
      name: 'Отправка недоступна',
      exact: true,
    });
    await expect(submit).toHaveAttribute('aria-disabled', 'true');
    await page.getByTestId('disabled-form').evaluate((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.setAttribute('data-submitted', 'true');
      });
    });
    await submit.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await submit.dispatchEvent('click');
    await expect(page.getByTestId('disabled-form')).not.toHaveAttribute(
      'data-submitted',
    );
  });
}

test('showcase routes are absent from production output', async ({
  request,
}) => {
  for (const theme of themes) {
    expect(
      (
        await request.get(`http://127.0.0.1:4325/components/${theme}/`)
      ).status(),
    ).toBe(404);
  }
});
