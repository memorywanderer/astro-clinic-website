import { expect, test } from '@playwright/test';

for (const lang of ['ru', 'kk'])
  test(`${lang}: contextual bookings, modal keyboard and carousel controls`, async ({
    page,
  }) => {
    await page.goto(`/${lang}/`);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    const dialog = page.locator('#action-dialog');
    const messenger = page.locator('.main-contact-actions a').first();
    await messenger.click();
    await expect(dialog).toBeVisible();
    await dialog.locator('[data-close-dialog]').focus();
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.locator('[data-close-dialog]')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(messenger).toBeFocused();
    await page.locator('footer a[href="#privacy-dialog"]').click();
    await expect(page.locator('#privacy-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(
      page.locator('footer a[href="#privacy-dialog"]'),
    ).toBeFocused();
    for (const selector of [
      '[data-doctor-carousel]',
      '[data-review-carousel]',
    ]) {
      const carousel = page.locator(selector);
      await carousel.focus();
      await page.keyboard.press('End');
      await expect
        .poll(() => carousel.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(0);
      await page.keyboard.press('Home');
      await expect
        .poll(() => carousel.evaluate((el) => el.scrollLeft))
        .toBeLessThanOrEqual(
          await carousel.evaluate(
            (el) => parseFloat(getComputedStyle(el).paddingInlineStart) + 1,
          ),
        );
    }
    await page.locator('#prices').scrollIntoViewIfNeeded();
    const other = lang === 'ru' ? 'kk' : 'ru';
    await page.locator(`.clinic-language a[lang="${other}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${other}/#prices$`));
    await expect(page.locator('html')).toHaveAttribute('lang', other);
  });

for (const javaScriptEnabled of [true])
  test(`kk: 200% text with scripts ${javaScriptEnabled}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled,
      viewport: { width: 640, height: 900 },
    });
    const page = await context.newPage();
    await page.goto('/kk/');
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    const overflow = await page.locator('body *').evaluateAll((elements) =>
      elements
        .filter(
          (el) =>
            (el.getBoundingClientRect().right > innerWidth + 1 ||
              el.scrollWidth > el.clientWidth + 1) &&
            !el.closest('[data-doctor-carousel]'),
        )
        .map((el) => ({
          tag: el.tagName,
          class: el.className,
          text: el.textContent?.slice(0, 70),
          right: el.getBoundingClientRect().right,
          sw: el.scrollWidth,
          cw: el.clientWidth,
        }))
        .slice(0, 20),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      JSON.stringify(overflow),
    ).toBe(true);
    for (const label of await page
      .locator('.clinic-wordmark > span, [data-action="header-booking"] > span')
      .all()) {
      const lines = await label.evaluate((el) => {
        const style = getComputedStyle(el);
        return (
          el.getBoundingClientRect().height /
          (parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.6)
        );
      });
      expect(lines).toBeLessThanOrEqual(2.1);
    }
    await context.close();
  });

for (const lang of ['ru', 'kk']) {
  test(`${lang}: final direct actions, demo integrity and responsive layouts`, async ({
    page,
  }, info) => {
    // Fragment navigation must settle before clicking a moving contact target.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${lang}/`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      const overflow = await page.locator('body *').evaluateAll((elements) =>
        elements
          .filter(
            (el) =>
              el.getBoundingClientRect().right > innerWidth + 1 &&
              !el.closest('[data-doctor-carousel]'),
          )
          .map((el) => ({
            tag: el.tagName,
            class: el.className,
            right: el.getBoundingClientRect().right,
          }))
          .slice(0, 15),
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        JSON.stringify({ width, overflow }),
      ).toBe(true);
      if (width === 390) {
        await info.attach('layout-' + lang, {
          contentType: 'application/json',
          body: JSON.stringify(
            await page
              .locator('main > section, footer')
              .evaluateAll((elements) =>
                elements.map((el) => ({
                  id: el.id,
                  class: el.className,
                  height: el.getBoundingClientRect().height,
                })),
              ),
          ),
        });
        await expect(page.locator('.clinic-hero h1')).toBeInViewport();
        await expect(
          page.locator('.hero-actions .business-action').nth(1),
        ).toBeInViewport();
      }
      if (info.project.name === 'chromium') {
        for (const image of await page.locator('main img').all()) {
          await image.scrollIntoViewIfNeeded();
          await expect(image).toHaveJSProperty('complete', true);
        }
        await page
          .locator('[data-doctor-carousel], [data-review-carousel]')
          .evaluateAll((elements) =>
            elements.forEach((el) =>
              el.scrollTo({ left: 0, behavior: 'instant' }),
            ),
          );
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({
          path: `docs/screenshots/07a5-${lang}-${width}.png`,
          fullPage: true,
          animations: 'disabled',
        });
        if (width === 390 || width === 1440)
          await page.screenshot({
            path: `docs/screenshots/07a4-${process.env.UI_POLISH_PHASE ?? 'p2'}-${lang}-${width}-hero.png`,
            animations: 'disabled',
          });
      }
    }
    await expect(page.locator('form, #callback, #kids, #trust')).toHaveCount(0);
    await page.locator('[data-action="header-booking"]').click();
    await expect(page).toHaveURL(/#contact$/);
    for (const selector of [
      '.main-contact-actions a[href="#messenger-demo"]',
      '.main-contact-actions a[href="#phone-demo"]',
      '.hero-actions .urgent-entry',
    ]) {
      await page.locator(selector).click();
      await expect(page.locator('#action-dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#action-dialog')).toBeHidden();
    }
    await expect(page.locator('#map-2gis')).toHaveAttribute(
      'href',
      /^https:\/\/2gis.kz\/almaty\/geo\//,
    );
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('.clinic-floating')).toBeHidden();
    await expect(page.locator('a[href^="tel:"],a[href*="wa.me"]')).toHaveCount(
      0,
    );
  });
}

for (const lang of ['ru', 'kk'])
  test(
    lang +
      ': native anchors, stable language options and user-activated map fallback',
    async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const external: string[] = [];
      page.on('request', (r) => {
        if (
          r.url().includes('2gis.') &&
          !r.url().startsWith('http://127.0.0.1')
        )
          external.push(r.url());
      });
      await page.goto('/' + lang + '/');
      await expect(page.locator('.map-stage iframe')).toHaveCount(0);
      expect(external).toEqual([]);
      await page.setViewportSize({ width: 320, height: 844 });
      const dims = await page.locator('.clinic-language a').evaluateAll((els) =>
        els.map((el) => ({
          w: el.getBoundingClientRect().width,
          h: el.getBoundingClientRect().height,
        })),
      );
      expect(dims[0]).toEqual(dims[1]);
      for (const option of await page.locator('.clinic-language a').all()) {
        expect(await option.getAttribute('aria-label')).toContain(
          (await option.innerText()).trim(),
        );
      }
      const menu = page.locator('[data-header-menu] button');
      await expect(menu).toHaveAccessibleName(lang === 'ru' ? 'Меню' : 'Мәзір');
      const box = await menu.boundingBox();
      expect(box!.width).toBeCloseTo(box!.height, 2);
      for (const [selector, id] of [
        ['.hero-trust a[href="#reviews"]', 'reviews'],
        ['.hero-trust a[href="#credentials"]', 'credentials'],
        ['[data-header-menu] a[href="#promotions"]', 'promotions'],
      ]) {
        if (selector.includes('data-header-menu')) await menu.click();
        await page.locator(selector).click();
        await expect(page).toHaveURL(new RegExp('#' + id + '$'));
        expect(
          await page
            .locator('#' + id)
            .evaluate((el) => el.getBoundingClientRect().top),
        ).toBeGreaterThanOrEqual(
          await page
            .locator('.clinic-sticky')
            .evaluate((el) => el.getBoundingClientRect().bottom),
        );
      }
      const cards = await page
        .locator('.service-tile')
        .evaluateAll((els) =>
          els.map((el) => el.getBoundingClientRect().height),
        );
      expect(Math.max(...cards) - Math.min(...cards)).toBeLessThanOrEqual(1);
      const track = page.locator('[data-doctor-carousel]');
      const ratio = await track.evaluate(
        (el) => el.clientWidth / el.children[0].getBoundingClientRect().width,
      );
      expect(ratio).toBeGreaterThan(1.3);
      expect(ratio).toBeLessThan(1.7);
      await page.route('https://platform.2gis.ru/**', (route) => route.abort());
      await page.locator('[data-load-map]').click();
      await expect(page.locator('.map-stage iframe')).toHaveAttribute(
        'title',
        /2ГИС/,
      );
      await expect(page.locator('#map-2gis')).toBeVisible();
      await expect(page.locator('.map-disclosure')).toContainText('SAYA QAM');
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    },
  );
