import { describe, expect, test, vi } from 'vitest';
import { parseLocale, locales, type Locale } from '@/config/site';
import { business, pages, services } from '@/content/data/business';
import {
  resolveBusiness,
  resolveFieldService,
  resolveService,
  resolvePage,
  resolveNavigation,
  normalizeMedia,
  validateEntries,
} from '@/content/normalize';
import {
  getServices,
  getBusinessInfo,
  getPage,
  getNavigation,
} from '@/content/static';
import { ru } from '@/i18n/dictionaries/ru';
import { kk } from '@/i18n/dictionaries/kk';
import { translate, t } from '@/i18n/translations';
import {
  availableTranslations,
  localizedPath,
  resolveRoute,
  validateRoutes,
  type RouteDefinition,
} from '@/i18n/routes';

vi.mock('@/assets/material-study.png', () => ({
  default: {
    src: '/material-study.png',
    width: 640,
    height: 480,
    format: 'png',
  },
}));

describe('content boundary', () => {
  for (const locale of locales) {
    test(`${locale}: both service sources yield exactly the same existing prop contract`, () => {
      const russian = services.find(
        (item) => item.id === 'planning' && item.locale === 'ru',
      )!;
      const kazakh = services.find(
        (item) => item.id === 'planning' && item.locale === 'kk',
      )!;
      const source = {
        id: russian.id,
        title: { ru: russian.title, kk: kazakh.title },
        description: { ru: russian.description, kk: kazakh.description },
        destination: russian.destination,
        metadata: { ru: russian.metadata!, kk: kazakh.metadata! },
      };
      const resolved = resolveFieldService(source, locale);
      expect(resolved).toEqual(
        resolveService(locale === 'ru' ? russian : kazakh, locale),
      );
      expect(Object.keys(resolved).sort()).toEqual([
        'description',
        'id',
        'link',
        'metadata',
        'title',
      ]);
      expect(resolved).not.toHaveProperty('locale');
      expect(typeof resolved.title).toBe('string');
      expect(resolved.link?.href).toBe(`/${locale}/services/`);
    });
    test(`${locale}: static access returns locale-resolved business, pages and navigation`, () => {
      expect(getBusinessInfo(locale).name).toBe(business.name[locale]);
      expect(getServices(locale)).toHaveLength(4);
      expect(getPage('home', locale).hero.title).toBe(
        pages.find((entry) => entry.id === 'home' && entry.locale === locale)!
          .hero.title,
      );
      expect(
        getNavigation(locale, 'services').map((item) => item.href),
      ).toEqual([`/${locale}/`, `/${locale}/services/`]);
      expect(getNavigation(locale, 'services')[1].current).toBe(true);
    });
  }
  test('required translations fail instead of silently publishing Russian', () => {
    expect(() =>
      resolveBusiness({ ...business, name: { ru: 'Имя', kk: '' } }, 'ru'),
    ).toThrow(`${business.id}.name/kk`);
    const incomplete = services.filter(
      (item) => !(item.id === 'research' && item.locale === 'kk'),
    );
    expect(() => validateEntries(incomplete, 'service')).toThrow('research/kk');
    expect(() => resolveService({ ...services[0], title: ' ' }, 'ru')).toThrow(
      'research.title/ru',
    );
    expect(() =>
      resolvePage({ ...pages[0], hero: { title: '', description: 'Text' } }),
    ).toThrow('hero.title');
  });
  test('optional fields are omitted without cross-language fallback', () => {
    const resolved = resolveBusiness(
      { ...business, address: { ru: 'Адрес' }, hours: undefined },
      'kk',
    );
    expect(resolved.details.address).toBeUndefined();
    expect(resolved.details.hours).toBeUndefined();
    const service = resolveService(
      { id: 'plain', locale: 'ru', title: 'Текст', description: 'Описание' },
      'ru',
    );
    expect(service).toEqual({
      id: 'plain',
      title: 'Текст',
      description: 'Описание',
    });
  });
  test('invalid locales, duplicate scoped identities, routes and unsafe data fail', () => {
    expect(() => parseLocale('en')).toThrow('Unsupported locale');
    expect(() => getServices('en' as Locale)).toThrow('Unsupported locale');
    expect(() =>
      validateEntries([...services, services[0]], 'service'),
    ).toThrow('Duplicate');
    expect(() => resolveService(services[0], 'kk')).toThrow('Locale mismatch');
    expect(() =>
      resolveBusiness({ ...business, email: 'invalid' }, 'ru'),
    ).toThrow('Invalid email');
    expect(() => resolveNavigation(['home', 'home'], 'ru', 'home')).toThrow(
      'Duplicate',
    );
    expect(() =>
      resolveService(
        { ...services[0], destination: 'unknown' as 'home' },
        'ru',
      ),
    ).toThrow('Unknown route');
    expect(() =>
      normalizeMedia(
        { src: 'javascript:alert(1)', alt: '', width: 30, height: 30 },
        'bad',
      ),
    ).toThrow('Invalid media URL');
    expect(() =>
      normalizeMedia(
        { src: '/image.png', alt: '', width: 0, height: 30 },
        'bad',
      ),
    ).toThrow('Invalid media metadata');
  });
  test('media preserves local metadata and accepts URL sources without losing dimensions or alt', () => {
    const original = services[0].media!;
    expect(resolveService(services[0], 'ru').media?.src).toBe(original.src);
    const remote = {
      src: 'https://example.com/image.png',
      alt: 'Материал',
      width: 640,
      height: 480,
    };
    expect(normalizeMedia(remote, 'remote')).toEqual(remote);
  });
});

test('dictionaries have equivalent typed keys and missing values warn and fall back', () => {
  expect(Object.keys(kk).sort()).toEqual(Object.keys(ru).sort());
  expect(t('kk', 'nav.home')).toBe('Басты бет');
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    expect(translate({}, 'nav.menu', 'kk')).toBe(ru['nav.menu']);
    expect(translate({ 'nav.menu': ' ' }, 'nav.menu', 'kk')).toBe(
      ru['nav.menu'],
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('kk/nav.menu'));
  } finally {
    warn.mockRestore();
  }
});

test('route identities support translated slugs, configured Russian redirects and true 404s', () => {
  const records: RouteDefinition[] = [
    { id: 'translated', paths: { ru: 'uslugi', kk: 'qyzmetter' } },
    { id: 'partial', paths: { ru: 'only-russian' }, missing: 'redirect-ru' },
    { id: 'absent', paths: { ru: 'absent' }, missing: '404' },
  ];
  validateRoutes(records);
  expect(localizedPath('translated', 'kk', records)).toBe('/kk/qyzmetter/');
  expect(resolveRoute('partial', 'kk', records)).toEqual({
    locale: 'ru',
    path: 'only-russian',
    redirect: true,
  });
  expect(localizedPath('partial', 'kk', records)).toBe('/ru/only-russian/');
  expect(availableTranslations('partial', records)).toEqual([
    { locale: 'ru', href: '/ru/only-russian/' },
  ]);
  expect(localizedPath('absent', 'kk', records)).toBeUndefined();
  expect(() => validateRoutes([...records, records[0]])).toThrow(
    'Duplicate/empty route ID',
  );
  expect(() =>
    validateRoutes([
      { id: 'one', paths: { ru: 'same' } },
      { id: 'two', paths: { ru: 'same' } },
    ]),
  ).toThrow('Duplicate route path');
  expect(() =>
    validateRoutes([{ id: 'bad', paths: { ru: '../escape' } }]),
  ).toThrow('Invalid route');
});
