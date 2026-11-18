import { expect, test } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

test.use({ baseURL: 'http://127.0.0.1:4326', reducedMotion: 'no-preference' });

for (const theme of ['default', 'alternative']) {
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    test(`${theme} ${reducedMotion}: static content without JavaScript and responsive typography`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        reducedMotion,
        viewport: { width: 320, height: 720 },
      });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4326/motion/${theme}/`);
      for (const selector of [
        '#services',
        '#about',
        '#gallery',
        '#words-kk',
        '#mask',
        '#scroll-image',
      ]) {
        await expect(page.locator(selector)).toBeVisible();
        await expect(page.locator(selector)).toHaveCSS('opacity', '1');
      }
      await expect(
        page.getByRole('heading', {
          name: 'Әр сөз — жаңа мүмкіндік: ә ғ қ ң ө ұ ү һ і.',
        }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator('a[href="#services"]').first().click();
      await expect(page).toHaveURL(/#services$/);
      await context.close();
    });
  }
}

test('one-time activation, repeat, focus and preference changes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 400 });
  await page.goto('/motion/default/');
  const services = page.locator('#services');
  // Allow the initial observer delivery before scrolling.
  await expect
    .poll(() => page.evaluate(() => typeof IntersectionObserver))
    .toBe('function');
  await page.locator('#scroll-image').scrollIntoViewIfNeeded();
  await services.scrollIntoViewIfNeeded();
  await expect(services).toHaveAttribute('data-motion-state', 'active');
  const animation = await services
    .locator('[data-item]')
    .first()
    .evaluate((el) => {
      const animation = el.getAnimations()[0];
      if (animation) animation.id = 'first-entry';
      return !!animation;
    });
  expect(animation).toBe(true);
  await page.locator('#scroll-image').scrollIntoViewIfNeeded();
  await services.scrollIntoViewIfNeeded();
  // Once effects retain a finished animation rather than restarting.
  await expect(services).toHaveAttribute('data-motion-state', 'active');
  expect(
    await services
      .locator('[data-item]')
      .first()
      .evaluate((el) => el.getAnimations()[0]?.id),
  ).toBe('first-entry');
  const repeat = page.locator('#repeat');
  await repeat.scrollIntoViewIfNeeded();
  await expect(repeat).toHaveAttribute('data-motion-state', 'active');
  await page.evaluate(() => scrollTo(0, 0));
  await expect(repeat).not.toHaveAttribute('data-motion-state');
  await repeat.scrollIntoViewIfNeeded();
  await expect(repeat).toHaveAttribute('data-motion-state', 'active');
  await page.locator('#focus-reveal').focus();
  await expect(page.locator('#focus-reveal')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(services).not.toHaveAttribute('data-motion-state');
  await expect(page.locator('#scroll-image')).toHaveCSS('transform', 'none');
  expect(
    await page
      .locator('[data-motion]')
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).opacity === '1'),
      ),
  ).toBe(true);
});

test('missing observer leaves static content; navigation stays native', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Reflect.deleteProperty(window, 'IntersectionObserver');
  });
  await page.goto('/motion/default/');
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-motion-state]')).toHaveCount(0);
  await expect(page.locator('#gallery')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: 'Русская страница услуг' }).click();
  await expect(page).toHaveURL(/\/ru\/services\/$/);
  await page.getByRole('link', { name: 'Қазақша' }).click();
  await expect(page).toHaveURL(/\/kk\/services\/$/);
});

test('scroll timeline or static fallback and stable media geometry', async ({
  page,
}, testInfo) => {
  await page.goto('/motion/alternative/');
  const image = page.locator('#scroll-image');
  const before = await image.evaluate((el) => ({
    width: el.clientWidth,
    height: el.clientHeight,
  }));
  await image.scrollIntoViewIfNeeded();
  const supported = await page.evaluate(
    () =>
      CSS.supports('animation-timeline: view()') &&
      CSS.supports('animation-range: entry 0% cover 50%'),
  );
  await expect(image).toHaveCSS(
    'animation-name',
    supported ? 'motion-scroll-scale' : 'none',
  );
  if (supported) {
    await image.evaluate((el) =>
      scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight + 20),
    );
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    const start = await image.evaluate((el) => getComputedStyle(el).transform);
    await image.evaluate((el) =>
      scrollTo(0, el.getBoundingClientRect().top + scrollY),
    );
    await expect
      .poll(() => image.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(start);
  } else {
    await expect(image).toHaveCSS('transform', 'none');
  }
  expect(
    await image.evaluate((el) => ({
      width: el.clientWidth,
      height: el.clientHeight,
    })),
  ).toEqual(before);
  await testInfo.attach('timeline-support', {
    body: JSON.stringify({ supported }),
    contentType: 'application/json',
  });
  await writeFile(
    testInfo.outputPath('timeline-support.json'),
    JSON.stringify({ supported }),
  );
  await page.screenshot({
    path: testInfo.outputPath('motion.png'),
    fullPage: true,
    animations: 'disabled',
  });
});

test('observer cleanup and reinitialization keep one active observer', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeObserver = window.IntersectionObserver;
    const active = new Set<IntersectionObserver>();
    Object.defineProperty(window, 'motionObserverCount', {
      get: () => active.size,
    });
    window.IntersectionObserver = class extends NativeObserver {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        super(callback, options);
        active.add(this);
      }
      disconnect() {
        active.delete(this);
        super.disconnect();
      }
    };
  });
  await page.goto('/motion/default/');
  const count = () =>
    page.evaluate(() => Reflect.get(window, 'motionObserverCount') as number);
  await expect.poll(count).toBe(1);
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pagehide')),
  );
  await expect.poll(count).toBe(0);
  await expect(page.locator('[data-motion-state]')).toHaveCount(0);
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent('pageshow', { persisted: true }),
    ),
  );
  await expect.poll(count).toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(count).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(count).toBe(1);
});

test('production motion sample records layout shifts and payload', async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(
    browserName !== 'chromium',
    'LayoutShift PerformanceObserver is measured in Chromium.',
  );
  await page.addInitScript(() => {
    const shifts: { value: number; elements: string[] }[] = [];
    Reflect.set(window, 'motionShifts', shifts);
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
          sources: { node: Node | null }[];
        };
        if (!shift.hadRecentInput)
          shifts.push({
            value: shift.value,
            elements: shift.sources.map(
              ({ node }) =>
                (node instanceof Element
                  ? node
                  : node?.parentElement
                )?.outerHTML.slice(0, 120) ?? '',
            ),
          });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('http://127.0.0.1:4325/kk/');
  for (const selector of ['.clinic-pricing', '.about', 'footer']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
  }
  const metrics = await page.evaluate(() => ({
    inlineMotionBytes: Array.from(document.scripts)
      .filter(
        (script) =>
          !script.src && script.textContent?.includes('IntersectionObserver'),
      )
      .reduce(
        (sum, script) =>
          sum + new TextEncoder().encode(script.textContent ?? '').length,
        0,
      ),
    shifts: Reflect.get(window, 'motionShifts'),
    cls: (Reflect.get(window, 'motionShifts') as { value: number }[]).reduce(
      (sum, shift) => sum + shift.value,
      0,
    ),
    scripts: performance
      .getEntriesByType('resource')
      .filter(
        (entry) =>
          (entry as PerformanceResourceTiming).initiatorType === 'script',
      )
      .map((entry) => ({
        name: new URL(entry.name).pathname,
        bytes: (entry as PerformanceResourceTiming).decodedBodySize,
      })),
  }));
  await testInfo.attach('production-motion-metrics', {
    body: JSON.stringify(metrics, null, 2),
    contentType: 'application/json',
  });
  await writeFile(
    testInfo.outputPath('metrics.json'),
    JSON.stringify(metrics, null, 2),
  );
  expect(metrics.cls).toBeLessThan(0.01);
});
