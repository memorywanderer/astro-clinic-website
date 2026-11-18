import { expect, test, vi } from 'vitest';
import {
  resolveDeployment,
  robotsDirective,
  robotsText,
  validateOrigin,
} from '@/config/deployment';
import { canonicalUrl, resolvePageSEO, socialImage } from '@/lib/seo/metadata';
import {
  businessSchema,
  breadcrumbSchema,
  serializeStructuredData,
} from '@/lib/seo/structured-data';
import { getPage, getBusinessInfo } from '@/content/static';
import type { Locale } from '@/config/site';
import type { PageId } from '@/i18n/routes';
import { normalizeOpeningHours } from '@/content/normalize';

vi.mock('@/assets/material-study.png', () => ({
  default: {
    src: '/_astro/material-study.png',
    width: 960,
    height: 640,
    format: 'png',
  },
}));

const production = {
  profile: 'production',
  origin: 'https://business.kz',
} as const;
const eligiblePage = (id: PageId, locale: Locale) => {
  const page = getPage(id, locale);
  return { ...page, metadata: { ...page.metadata, indexable: true } };
};

test('provider previews cannot inherit production indexing permission', () => {
  for (const context of ['preview', 'development', '', 'unexpected']) {
    const policy = resolveDeployment(
      {
        PUBLIC_DEPLOYMENT_PROFILE: 'production',
        PUBLIC_SITE_ORIGIN: production.origin,
        VERCEL_ENV: context,
      },
      false,
    );
    expect(policy.profile).toBe('demo');
    expect(robotsDirective(policy, true)).toBe('noindex, nofollow');
    expect(robotsText(policy, true)).not.toContain('Sitemap:');
  }
  expect(
    resolveDeployment(
      { VERCEL_ENV: 'preview', VERCEL_URL: 'branch.vercel.app' },
      false,
    ).origin,
  ).toBe('https://branch.vercel.app');
  expect(() =>
    resolveDeployment({ PUBLIC_DEPLOYMENT_PROFILE: 'development' }, false),
  ).toThrow('dev server');
});

test('deployment is fail-closed and rejects unknown, blank and unsafe production configuration', () => {
  expect(resolveDeployment({}, false).profile).toBe('demo');
  expect(resolveDeployment({}, true).profile).toBe('development');
  for (const profile of ['prod', '', 'staging'])
    expect(() =>
      resolveDeployment({ PUBLIC_DEPLOYMENT_PROFILE: profile }, false),
    ).toThrow('Unknown');
  expect(() =>
    resolveDeployment({ PUBLIC_DEPLOYMENT_PROFILE: 'production' }, false),
  ).toThrow('PUBLIC_SITE_ORIGIN');
  for (const origin of [
    'http://business.kz',
    'https://localhost',
    'https://127.0.0.1',
    'https://example.com',
    'https://business.example',
    'https://demo.business.kz',
    'https://business.vercel.app',
    'https://business.kz/path',
    'https://user:pass@business.kz',
    'https://business.kz/?q=1',
    'https://business.kz/#a',
  ])
    expect(() => validateOrigin(origin, true), origin).toThrow();
  expect(validateOrigin('https://business.kz/', true)).toBe(production.origin);
});

test('canonical URLs use the mapped locale, normalized origin and slash convention', () => {
  expect(canonicalUrl('/kk/services/', production.origin)).toBe(
    'https://business.kz/kk/services/',
  );
  for (const path of [
    '/kk/?utm=1',
    '/kk/#a',
    '/kk',
    'https://other.kz/kk/',
    '//other.kz/kk/',
    'javascript:alert(1)',
  ])
    expect(() => canonicalUrl(path, production.origin)).toThrow();
});

test('localized metadata and reciprocal alternates use the existing translated route registry', () => {
  const records = [
    { id: 'services', paths: { ru: 'uslugi', kk: 'qyzmetter' } },
  ];
  const ru = resolvePageSEO(
    eligiblePage('services', 'ru'),
    'ru',
    eligiblePage,
    production,
    records,
  );
  const kk = resolvePageSEO(
    eligiblePage('services', 'kk'),
    'kk',
    eligiblePage,
    production,
    records,
  );
  expect(ru.alternates).toEqual(kk.alternates);
  expect(kk.canonical).toBe('https://business.kz/kk/qyzmetter/');
  expect(kk.title).toBe(getPage('services', 'kk').metadata.title);
  expect(ru.alternates.map((entry) => entry.locale)).toEqual(['ru', 'kk']);
});

test('missing, redirected and noindexed translations are excluded; no asymmetric sets', () => {
  const records = [
    { id: 'home', paths: { ru: '' }, missing: 'redirect-ru' as const },
  ];
  const page = eligiblePage('home', 'ru');
  expect(
    resolvePageSEO(page, 'ru', eligiblePage, production, records).alternates,
  ).toHaveLength(1);
  expect(() =>
    resolvePageSEO(
      eligiblePage('home', 'kk'),
      'kk',
      eligiblePage,
      production,
      records,
    ),
  ).toThrow('No canonical');
  const oneEligible = (id: PageId, locale: Locale) =>
    locale === 'ru' ? eligiblePage(id, locale) : getPage(id, locale);
  expect(
    resolvePageSEO(page, 'ru', oneEligible, production).alternates.map(
      (entry) => entry.locale,
    ),
  ).toEqual(['ru']);
  expect(
    resolvePageSEO(getPage('home', 'kk'), 'kk', oneEligible, production)
      .alternates,
  ).toEqual([]);
});

test('metadata uses the authored social image and never invents missing text', () => {
  const page = eligiblePage('home', 'kk');
  expect(
    resolvePageSEO(page, 'kk', eligiblePage, production).image,
  ).toMatchObject({ url: 'https://business.kz/social-preview.png' });
  expect(() =>
    resolvePageSEO(
      { ...page, metadata: { ...page.metadata, title: '' } },
      'kk',
      eligiblePage,
      production,
    ),
  ).toThrow('SEO title');
  expect(() =>
    resolvePageSEO(
      { ...page, metadata: { ...page.metadata, description: '' } },
      'kk',
      eligiblePage,
      production,
    ),
  ).toThrow('SEO description');
  expect(
    socialImage(
      { src: '/social.png', alt: 'Фото', width: 1200, height: 630 },
      production.origin,
    )?.url,
  ).toBe('https://business.kz/social.png');
  expect(() =>
    socialImage(
      { src: 'javascript:alert(1)', alt: '', width: 1, height: 1 },
      production.origin,
    ),
  ).toThrow();
});

test('profile and content policies jointly control indexing, alternates and sitemap advertising', () => {
  for (const profile of ['development', 'demo'] as const) {
    const policy = { ...production, profile };
    expect(robotsDirective(policy, true)).toBe('noindex, nofollow');
    expect(robotsText(policy, true)).toBe('User-agent: *\nAllow: /\n');
    expect(
      resolvePageSEO(eligiblePage('home', 'ru'), 'ru', eligiblePage, policy)
        .alternates,
    ).toEqual([]);
  }
  expect(robotsDirective(production, true)).toBe('index, follow');
  expect(robotsDirective(production, false)).toBe('noindex, nofollow');
  expect(robotsText(production, true)).toContain(
    'Sitemap: https://business.kz/sitemap-index.xml',
  );
  expect(robotsText(production, false)).not.toContain('Sitemap:');
});

test('verified schemas reuse business data without requiring a physical address or copying display hours', () => {
  const business = {
    ...getBusinessInfo('ru'),
    details: { email: 'contact@business.kz' },
  };
  const organization = businessSchema(business, production.origin, {
    verified: true,
    type: 'Organization',
  });
  expect(organization.name).toBe(business.name);
  expect(organization).not.toHaveProperty('address');
  expect(organization).not.toHaveProperty('openingHours');
  const clinic = businessSchema(
    { ...business, details: { address: 'Verified address' } },
    production.origin,
    { verified: true, type: 'MedicalClinic' },
  );
  expect(clinic['@type']).toBe('MedicalClinic');
  expect(clinic.address).toBe('Verified address');
  const withHours = businessSchema(
    { ...business, openingHours: ['Mo-Fr 09:00-18:00'] },
    production.origin,
    { verified: true, type: 'LocalBusiness' },
  );
  expect(withHours.openingHours).toEqual(['Mo-Fr 09:00-18:00']);
  expect(() => normalizeOpeningHours(['Пн–Пт, 09:00–18:00'])).toThrow();
  expect(() => normalizeOpeningHours(['Mo-Fr 25:00-18:00'])).toThrow();
  expect(() =>
    businessSchema(business, production.origin, {
      verified: false as unknown as true,
      type: 'Organization',
    }),
  ).toThrow('verification');
  expect(() =>
    businessSchema(business, production.origin, {
      verified: true,
      type: 'Organization',
      sameAs: ['javascript:bad'],
    }),
  ).toThrow();
});

test('breadcrumbs use supplied localized labels and JSON-LD cannot break out of script tags', () => {
  const label = '</script><script>alert("x")</script>&\u2028';
  const data = breadcrumbSchema([{ label, href: 'https://business.kz/ru/' }]);
  expect(data.itemListElement).toEqual([
    {
      '@type': 'ListItem',
      position: 1,
      name: label.trim(),
      item: 'https://business.kz/ru/',
    },
  ]);
  const json = serializeStructuredData([data]);
  expect(json).not.toContain('<');
  expect(JSON.parse(json)).toEqual([data]);
  expect(() => breadcrumbSchema([])).toThrow();
  expect(() =>
    breadcrumbSchema([{ label: '', href: 'https://business.kz/' }]),
  ).toThrow();
});
