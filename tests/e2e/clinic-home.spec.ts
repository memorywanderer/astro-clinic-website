import { expect, test } from '@playwright/test';

for (const locale of ['ru', 'kk']) {
  test(`${locale}: complete homepage, responsive composition and honest demo interaction`, async ({
    page,
  }, testInfo) => {
    await page.goto(`/${locale}/`);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.locator('.clinic-home > section').count(),
    ).toBeGreaterThanOrEqual(10);
    await expect(page.locator('#team article')).toHaveCount(2);
    await expect(page.locator('form')).toHaveCount(0);
    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (width < 768)
        await expect(page.locator('.clinic-floating')).toBeVisible();
      if (
        testInfo.project.name === 'chromium' ||
        width === 390 ||
        width === 1440
      ) {
        // Scroll through lazy images before taking the complete composition.
        for (const image of await page.locator('main img').all()) {
          await image.scrollIntoViewIfNeeded();
          await expect(image).toHaveJSProperty('complete', true);
          expect(
            await image.evaluate(
              (element: HTMLImageElement) => element.naturalWidth,
            ),
          ).toBeGreaterThan(0);
        }
        await page.locator('body').scrollIntoViewIfNeeded();
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: 'instant' }),
        );
        await page.screenshot({
          path: testInfo.outputPath(`${locale}-${width}.png`),
          fullPage: true,
          animations: 'disabled',
        });
        await page.screenshot({
          path: testInfo.outputPath(`${locale}-${width}-hero.png`),
          animations: 'disabled',
        });
      }
    }
    const contextStrip = page.locator('.clinic-context');
    await expect(contextStrip).toBeInViewport();
    const threshold = await contextStrip.evaluate((el) =>
      Math.ceil(el.getBoundingClientRect().bottom),
    );
    for (const offset of [threshold + 4, 0, threshold + 4]) {
      await page.evaluate((y) => window.scrollTo(0, y), offset);
      if (offset)
        await expect(page.locator('.clinic-sticky')).toHaveClass(/is-scrolled/);
      else
        await expect(page.locator('.clinic-sticky')).not.toHaveClass(
          /is-scrolled/,
        );
    }
    await page.screenshot({
      path: testInfo.outputPath(locale + '-desktop-scrolled.png'),
      animations: 'disabled',
    });
    await page.setViewportSize({ width: 390, height: 844 });
    const menu = page.locator('[data-header-menu] button');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.screenshot({
      path: testInfo.outputPath(`${locale}-menu-open.png`),
      animations: 'disabled',
    });
    await page.locator('[data-header-menu] a[href="#team"]').click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page).toHaveURL(new RegExp(`/${locale}/#team$`));
    await expect(
      page.locator('[data-header-menu] [data-sw-collapsible-panel]'),
    ).toBeHidden();
    const firstQuestion = page.locator('#questions summary').first();
    await firstQuestion.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#questions details').first()).toHaveAttribute(
      'open',
      '',
    );
    const tiles = page.locator('#treatments li a');
    await expect(tiles).toHaveCount(8);
    for (const tile of await tiles.all()) {
      const href = await tile.getAttribute('href');
      expect(href).toMatch(/^#price-/);
      await expect(page.locator(href!)).toContainText(
        (await tile.innerText()).trim(),
      );
    }
    await expect(
      page.locator('#contact details, #directions iframe'),
    ).toHaveCount(0);
    await page.locator('#treatments a[href="#price-hygiene"]').click();
    await expect(page).toHaveURL(/#price-hygiene$/);
    await expect(page.locator('.clinic-sticky')).toHaveClass(/is-scrolled/);
    await page.screenshot({
      path: testInfo.outputPath(`${locale}-pricing.png`),
      animations: 'disabled',
    });
    await expect(
      page.locator('#price-hygiene [data-price-kind]'),
    ).toContainText('18');
    for (const kind of ['exact', 'from', 'range'])
      expect(
        await page.locator(`#prices [data-price-kind="${kind}"]`).count(),
      ).toBeGreaterThan(0);
    await expect(page.locator('.clinic-language [aria-current]')).toHaveCSS(
      'border-radius',
      '48px',
    );
    const floating = page.locator('.clinic-floating');
    await expect(floating).toBeVisible();
    await floating.locator('a[href="#messenger-demo"]').click();
    await expect(page.locator('#action-dialog')).toBeVisible();
    await expect(page.locator('[data-action-preview]')).toContainText(
      'WhatsApp',
    );
    await page.keyboard.press('Escape');
    await floating.locator('a[href="#phone-demo"]').click();
    await expect(page.locator('#action-dialog')).toBeVisible();
    await expect(page.locator('[data-action-preview]')).toContainText(
      '+7 (700)',
    );
    await page.keyboard.press('Escape');
    await page.locator('#phone-demo').scrollIntoViewIfNeeded();
    await expect(floating).toBeHidden();
    await expect(
      page.locator('a[href^="tel:"], a[href*="wa.me"], a[href^="mailto:"]'),
    ).toHaveCount(0);
    await expect(page.locator('[data-payment-kind]')).toHaveCount(0);
    await expect(page.locator('.clinic-sticky')).toHaveCSS(
      'position',
      'sticky',
    );
    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'instant',
      }),
    );
    await expect
      .poll(() =>
        page.evaluate(() => {
          const floating =
            document.querySelector<HTMLElement>('.clinic-floating')!;
          if (getComputedStyle(floating).visibility === 'hidden') return 0;
          return (
            document.querySelector('footer')!.getBoundingClientRect().bottom -
            floating.getBoundingClientRect().top
          );
        }),
      )
      .toBeLessThanOrEqual(2);
    const hrefs = await page
      .locator('header a, main a, footer a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
    for (const href of hrefs.filter((href) => href.startsWith('#')))
      await expect(page.locator(href)).toHaveCount(1);
    await page.setViewportSize({ width: 320, height: 568 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(floating).toBeVisible();
    await page.setViewportSize({ width: 640, height: 900 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(floating).toBeVisible();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(
      await page
        .locator('.clinic-sticky')
        .evaluate(
          (element) => getComputedStyle(element, '::after').transitionDuration,
        ),
    ).toBe('0s');
  });
}
