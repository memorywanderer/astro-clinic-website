import assert from 'node:assert/strict';
import process from 'node:process';
import console from 'node:console';
import {
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const artifactRoot = join(root, 'test-results', 'seo-builds');
const origin = 'https://verification-business.kz';
const astroCLI = join(root, 'node_modules/astro/bin/astro.mjs');
const paths = ['/ru/', '/kk/', '/ru/services/', '/kk/services/'];

function prepare(name) {
  const directory = join(artifactRoot, name);
  mkdirSync(directory, { recursive: true });
  for (const entry of [
    'src',
    'public',
    'astro.config.mjs',
    'tsconfig.json',
    'package.json',
  ])
    cpSync(join(root, entry), join(directory, entry), { recursive: true });
  // Node resolves dependencies from the workspace ancestor; no links or installs.
  return directory;
}

function build(directory, profile, siteOrigin, success = true, provider = {}) {
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    PUBLIC_DEPLOYMENT_PROFILE: profile,
    VERCEL_ENV: 'production',
    ...provider,
  };
  if (siteOrigin === undefined) delete env.PUBLIC_SITE_ORIGIN;
  else env.PUBLIC_SITE_ORIGIN = siteOrigin;
  const result = spawnSync(
    process.execPath,
    [astroCLI, 'build', '--ignore-lock'],
    {
      cwd: directory,
      env,
      encoding: 'utf8',
      timeout: 120000,
    },
  );
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  writeFileSync(join(directory, `build-${profile || 'blank'}.log`), output);
  if (success) assert.equal(result.status, 0, output);
  else
    assert.notEqual(
      result.status,
      0,
      'Unsafe configuration unexpectedly built',
    );
  return output;
}

function html(directory, path) {
  return readFileSync(join(directory, 'dist', path, 'index.html'), 'utf8');
}
function inspect(directory, expectedOrigin, eligible = []) {
  for (const path of paths) {
    const content = html(directory, path);
    const indexable = eligible.includes(path);
    assert.ok(
      content.includes(
        `<link rel="canonical" href="${expectedOrigin}${path}">`,
      ),
      path,
    );
    assert.ok(
      content.includes(
        `<meta property="og:url" content="${expectedOrigin}${path}">`,
      ),
      path,
    );
    assert.ok(
      content.includes(
        `content="${indexable ? 'index, follow' : 'noindex, nofollow'}"`,
      ),
      path,
    );
    assert.equal((content.match(/<title>/g) ?? []).length, 1);
    assert.ok(content.includes('loading="eager" fetchpriority="high"'));
    assert.equal((content.match(/name="description"/g) ?? []).length, 1);
    assert.ok(
      content.includes(
        path.includes('/services/')
          ? path.startsWith('/kk/')
            ? 'Кеңістікті зерттеу'
            : 'Исследование пространства'
          : path.startsWith('/kk/')
            ? 'Тісті емдеу'
            : 'Лечение зубов',
      ),
    );
    assert.ok(!content.includes('http://localhost'));
    if (!indexable) {
      assert.ok(!content.includes('<link rel="alternate"'));
      const scripts = [
        ...content.matchAll(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
        ),
      ];
      for (const [, json] of scripts) {
        const schemas = JSON.parse(json);
        assert.ok(
          schemas.every((schema) => schema['@type'] === 'FAQPage'),
          'No fictional business schema',
        );
        assert.equal(schemas[0].mainEntity.length, 5);
      }
      assert.equal(scripts.length, path.includes('/services/') ? 0 : 1);
    }
  }
  for (const path of ['/'])
    assert.ok(
      html(directory, path).includes('content="noindex, nofollow"'),
      path,
    );
  assert.ok(
    readFileSync(join(directory, 'dist/404.html'), 'utf8').includes(
      'content="noindex, nofollow"',
    ),
  );
  for (const internal of [
    'design-system',
    'components',
    'motion',
    'examples',
    'content-preview',
  ])
    assert.ok(!existsSync(join(directory, 'dist', internal)), internal);
  for (const asset of [
    'social-preview.png',
    'apple-touch-icon.png',
    'favicon.svg',
    'favicon.ico',
  ])
    assert.ok(existsSync(join(directory, 'dist', asset)), asset);
  const robots = readFileSync(join(directory, 'dist/robots.txt'), 'utf8');
  assert.ok(robots.includes('Allow: /'));
  assert.equal(robots.includes('Sitemap:'), eligible.length > 0);
  const sitemapPath = join(directory, 'dist/sitemap-0.xml');
  assert.equal(existsSync(sitemapPath), eligible.length > 0);
  if (eligible.length) {
    const sitemap = readFileSync(sitemapPath, 'utf8');
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    );
    assert.deepEqual(
      urls.sort(),
      eligible.map((path) => `${expectedOrigin}${path}`).sort(),
    );
    assert.ok(
      !sitemap.includes('localhost') && !sitemap.includes('example.com'),
    );
    assert.ok(robots.includes(`${expectedOrigin}/sitemap-index.xml`));
    assert.ok(
      readFileSync(join(directory, 'dist/sitemap-index.xml'), 'utf8').includes(
        `${expectedOrigin}/sitemap-0.xml`,
      ),
    );
  }
}

const demo = prepare('demo');
build(demo, 'demo', 'https://demo.verification-business.kz');
inspect(demo, 'https://demo.verification-business.kz');
console.log('PASS: demo HTML, noindex, canonicals, robots, sitemap absence');

const sample = prepare('production-sample');
build(sample, 'production', origin);
inspect(sample, origin);
console.log('PASS: production respects authored fictional-content exclusions');

const fixture = prepare('production-fixture');
const clinicConfigPath = join(fixture, 'src/config/clinic.ts');
writeFileSync(
  clinicConfigPath,
  readFileSync(clinicConfigPath, 'utf8').replace(
    'export const DEMO_MODE = true;',
    'export const DEMO_MODE = false;',
  ),
);
const dataPath = join(fixture, 'src/content/data/business.ts');
let data = readFileSync(dataPath, 'utf8');
assert.equal((data.match(/indexable: false/g) ?? []).length, 4);
data = data.replaceAll('indexable: false', 'indexable: true');
// Exercise a genuine noindexed localized counterpart in the built sitemap/head.
const servicesKK = data.indexOf("id: 'services',\n    locale: 'kk'");
// Source may use CRLF on Windows.
const split =
  servicesKK >= 0
    ? servicesKK
    : data.indexOf("id: 'services',\r\n    locale: 'kk'");
assert.ok(split > 0);
data =
  data.slice(0, split) +
  data.slice(split).replace('indexable: true', 'indexable: false');
writeFileSync(dataPath, data);
const sitePath = join(fixture, 'src/config/site.ts');
let site = readFileSync(sitePath, 'utf8');
assert.ok(site.includes("name: 'SAYA QAM',"));
site = site
  .replace(
    / {2}seo: \{\r?\n/,
    "  seo: {\n    business: { verified: true, type: 'Organization' },\n",
  )
  .replace("src: '/social-preview.png'", "src: '/social.png'");
writeFileSync(sitePath, site);
cpSync(
  join(root, 'src/assets/material-study.png'),
  join(fixture, 'public/social.png'),
);
build(fixture, 'production', origin);
inspect(fixture, origin, ['/ru/', '/kk/', '/ru/services/']);
const ru = html(fixture, '/ru/');
const kk = html(fixture, '/kk/');
const alternates = (content) =>
  content.match(/<link rel="alternate"[^>]+>/g) ?? [];
assert.deepEqual(alternates(ru), alternates(kk));
assert.ok(ru.includes(`hreflang="ru" href="${origin}/ru/"`));
assert.ok(kk.includes(`hreflang="kk" href="${origin}/kk/"`));
assert.ok(ru.includes(`hreflang="x-default" href="${origin}/ru/"`));
const services = html(fixture, '/ru/services/');
assert.ok(!alternates(services).some((tag) => tag.includes('hreflang="kk"')));
const json = /<script type="application\/ld\+json">([^<]+)<\/script>/.exec(
  services,
)?.[1];
assert.ok(json, 'Breadcrumb JSON-LD is rendered');
assert.equal(JSON.parse(json)[0]['@type'], 'BreadcrumbList');
assert.ok(ru.includes(`property="og:image" content="${origin}/social.png"`));
assert.ok(ru.includes('name="twitter:card" content="summary_large_image"'));
const businessJSON =
  /<script type="application\/ld\+json">([^<]+)<\/script>/.exec(ru)?.[1];
assert.ok(businessJSON);
assert.equal(JSON.parse(businessJSON)[0]['@type'], 'Organization');
assert.equal(JSON.parse(businessJSON)[0].url, `${origin}/`);
assert.ok(existsSync(join(fixture, 'dist/social.png')));
console.log(
  'PASS: eligible production HTML, reciprocal hreflang, exact sitemap URLs, social image, parsed JSON-LD',
);

// The same eligible source must lose all indexing permission on a preview.
build(fixture, 'production', origin, true, { VERCEL_ENV: 'preview' });
inspect(fixture, origin);
console.log(
  'PASS: provider preview overrides production profile and eligible content',
);
// Restore the eligible artifact for Lighthouse. Never deploy this fixture.
build(fixture, 'production', origin);

for (const [profile, siteOrigin, message] of [
  ['unknown', origin, 'Unknown deployment profile'],
  ['development', origin, 'Development profile'],
  ['production', undefined, 'PUBLIC_SITE_ORIGIN'],
  ['production', 'https://example.com', 'Production requires'],
  ['production', 'https://demo.business.kz', 'Production requires'],
])
  assert.ok(build(sample, profile, siteOrigin, false).includes(message));
console.log(
  'PASS: unsafe deployment profiles/origins fail actual Astro builds',
);
writeFileSync(
  join(artifactRoot, 'verification.json'),
  JSON.stringify(
    {
      date: new Date().toISOString(),
      origin,
      cases: [
        'demo',
        'production-sample',
        'production-fixture',
        'provider-preview',
      ],
      eligibleURLs: ['/ru/', '/kk/', '/ru/services/'].map(
        (path) => origin + path,
      ),
      unsafeBuildsRejected: 5,
    },
    null,
    2,
  ),
);
