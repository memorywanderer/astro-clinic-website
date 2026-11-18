import { expect, test } from '@playwright/test';
import { themes } from '../../src/config/site';

test.use({ baseURL: 'http://127.0.0.1:4326' });

for (const theme of themes) {
  test(`${theme}: all business variants, optional fields and images without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4326/components/${theme}/`);
    const variants = {
      services: ['grid', 'list', 'featured'],
      about: ['split', 'editorial', 'minimal'],
      testimonials: ['grid', 'featured', 'list'],
      contact: ['details', 'split', 'formFocused'],
      faq: ['accordion', 'simple', 'grouped'],
      gallery: ['grid', 'masonry', 'featured'],
    };
    for (const [block, layouts] of Object.entries(variants)) {
      for (const layout of layouts) {
        const section = page.locator(`#${block}-${layout}`);
        await expect(section).toBeVisible();
        await expect(section).toHaveAttribute('data-layout', layout);
        await expect(section.getByRole('heading').first()).not.toBeEmpty();
      }
    }
    for (const layout of ['standard', 'centered', 'overlay']) {
      await expect(page.locator(`#header-${layout}`)).toHaveAttribute(
        'data-layout',
        layout,
      );
    }
    for (const layout of ['simple', 'multiColumn', 'extended']) {
      await expect(
        page.locator(`[data-preview="footer-${layout}"] footer`),
      ).toHaveAttribute('data-layout', layout);
    }
    await expect(page.locator('#about-minimal img')).toHaveCount(0);
    await expect(page.locator('#services-single [data-item]')).toHaveCount(1);
    for (const id of [
      'services-empty',
      'testimonials-empty',
      'faq-empty',
      'gallery-empty',
    ]) {
      await expect(page.locator(`#${id} li, #${id} details`)).toHaveCount(0);
    }
    await expect(
      page.locator(
        '#contact-empty a, #contact-empty address, #contact-empty p',
      ),
    ).toHaveCount(0);
    await expect(
      page.locator('#contact-links a[href="tel:+70000000000"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('#contact-links a[href="mailto:sample%2Bdemo@example.com"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('#contact-links a[href="https://www.openstreetmap.org/"]'),
    ).toHaveCount(1);
    await expect(
      page.getByRole('link', { name: 'Недопустимая ссылка', exact: true }),
    ).toHaveCount(0);
    await expect(page.locator('#testimonials-grid blockquote')).toHaveCount(3);
    await expect(
      page.locator('#testimonials-grid figcaption').first(),
    ).toContainText('не отзыв клиента');
    await expect(page.locator('#faq-simple details')).toHaveCount(0);
    await expect(page.locator('#faq-grouped [data-group]')).toHaveCount(2);

    const summary = page.locator('#faq-accordion summary').first();
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(
      page.locator('#faq-accordion details').first(),
    ).toHaveAttribute('open', '');
    await expect(summary).toHaveCSS('outline-style', 'solid');
    await page.locator('#faq-accordion summary').nth(1).focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#faq-accordion details[open]')).toHaveCount(2);
    await expect(
      page.locator('#faq-accordion details').nth(1).locator('strong'),
    ).toHaveText('смысловым акцентом');
    await page.keyboard.press('Space');
    await expect(page.locator('#faq-accordion details[open]')).toHaveCount(1);

    for (const image of await page.locator('#gallery-grid img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
      expect(Number(await image.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(await image.getAttribute('height'))).toBeGreaterThan(0);
      expect(await image.getAttribute('alt')).toBeTruthy();
      await expect(image).toHaveAttribute('loading', 'lazy');
    }
    const raster = page.locator('#gallery-grid [data-item="raster"] img');
    expect(await raster.getAttribute('src')).toContain('/_image');
    expect(await raster.getAttribute('srcset')).toContain('640w');

    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.locator('body *').evaluateAll((elements) =>
        elements
          .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
          .slice(0, 12)
          .map((el) => ({
            tag: el.tagName,
            id: el.id,
            class: el.className,
            right: el.getBoundingClientRect().right,
          })),
      );
      expect(overflow, `Overflow at ${width}px`).toEqual([]);
      if (width === 320) {
        await expect(page.locator('#header-overlay')).toHaveCSS(
          'position',
          'relative',
        );
        await expect(
          page.locator('#header-standard [data-sw-collapsible-trigger]'),
        ).toBeHidden();
        await expect(
          page.locator('#header-standard [data-sw-collapsible-panel] nav'),
        ).toBeVisible();
      }
      if (width === 1440) {
        await expect(page.locator('#header-overlay')).toHaveCSS(
          'position',
          'absolute',
        );
        const first = await page
          .locator('#services-featured li')
          .nth(0)
          .boundingBox();
        const next = await page
          .locator('#services-featured li')
          .nth(1)
          .boundingBox();
        expect(first!.width).toBeGreaterThan(next!.width * 1.5);
        const featured = await page
          .locator('#gallery-featured li')
          .first()
          .boundingBox();
        const grid = await page
          .locator('#gallery-grid li')
          .first()
          .boundingBox();
        const gridImage = await page
          .locator('#gallery-grid img')
          .first()
          .boundingBox();
        expect(gridImage!.width / gridImage!.height).toBeCloseTo(16 / 9, 1);
        expect(featured!.width).toBeGreaterThan(grid!.width * 1.5);
        const text = await page.locator('#about-split header').boundingBox();
        const media = await page.locator('#about-split img').boundingBox();
        expect(media!.x).toBeLessThan(text!.x);
      }
      if (width !== 768) {
        for (const id of [
          'services-featured',
          'gallery-masonry',
          'faq-grouped',
        ]) {
          await page
            .locator(`#${id}`)
            .screenshot({ path: test.info().outputPath(`${id}-${width}.png`) });
        }
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
    await context.close();
  });

  test(`${theme}: Starwind mobile menus and native nested navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 850 });
    await page.goto(`/examples/${theme}/clinic/`);
    const toggle = page.locator('#clinic-header [data-sw-collapsible-trigger]');
    const panel = page.locator('#clinic-header [data-sw-collapsible-panel]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-controls', 'clinic-header-menu');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const contrast = await page
      .locator('#clinic-header a')
      .first()
      .evaluate((el) => {
        const luminance = (color: string) =>
          color
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number)
            .map((value) => {
              const s = value / 255;
              return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
            })
            .reduce(
              (sum, value, index) =>
                sum + value * [0.2126, 0.7152, 0.0722][index],
              0,
            );
        const foreground = luminance(getComputedStyle(el).color);
        const background = luminance(
          getComputedStyle(el.closest('header')!).backgroundColor,
        );
        return (
          (Math.max(foreground, background) + 0.05) /
          (Math.min(foreground, background) + 0.05)
        );
      });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(toggle).toHaveCSS('outline-width', '3px');
    await panel.locator('summary').focus();
    await page.keyboard.press('Space');
    await expect(panel.locator('details')).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Space');
    await panel.getByRole('link', { name: 'Связаться', exact: true }).click();
    await expect(panel).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
    await toggle.click();
    await page.locator('main h1').click();
    await expect(panel).toBeHidden();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(toggle).toBeHidden();
    await expect(page.locator('#clinic-header .header-desktop')).toBeVisible();
    await expect(
      page.locator('#clinic-header .header-desktop a[aria-current="page"]'),
    ).toHaveText('Главная');
  });

  for (const example of ['clinic', 'construction', 'professional']) {
    test(`${theme}: ${example} composition landmarks, forms and responsive content`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4326/examples/${theme}/${example}/`);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.getByRole('banner')).toHaveCount(1);
      await expect(page.getByRole('main')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
      const missingAnchors = await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links
            .filter(
              (link) =>
                !document.getElementById(link.getAttribute('href')!.slice(1)),
            )
            .map((link) => link.getAttribute('href')),
        );
      expect(missingAnchors).toEqual([]);
      const levels = await page
        .locator('main h1,main h2,main h3,main h4,main h5,main h6')
        .evaluateAll((headings) =>
          headings.map((heading) => Number(heading.tagName.slice(1))),
        );
      for (let i = 1; i < levels.length; i++)
        expect(levels[i]).toBeLessThanOrEqual(levels[i - 1] + 1);
      for (const input of await page
        .locator('input,textarea,button[type="submit"]')
        .all())
        await expect(input).toBeDisabled();
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        if (width !== 768)
          await page.screenshot({
            path: test.info().outputPath(`${example}-${width}.png`),
            fullPage: true,
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
      await context.close();
    });
  }
}

test('all business examples are absent from production', async ({
  request,
}) => {
  for (const theme of themes) {
    for (const example of ['clinic', 'construction', 'professional']) {
      expect(
        (
          await request.get(
            `http://127.0.0.1:4325/examples/${theme}/${example}/`,
          )
        ).status(),
      ).toBe(404);
    }
  }
});
