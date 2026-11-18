# SEO and deployment (Phase 06)

## Phase 07C update

Current deployment instructions are in [deployment.md](deployment.md). Vercel preview context forces demo policy even with inherited production settings and eligible content. Other hosts must explicitly scope previews to demo. Production builds reject the development profile. Design-system previews are now development-only. Public builds include a bilingual noindex 404, a configured 1200×630 PNG social card and matching SVG/ICO/touch icons. Fictional-content indexing and business-schema gates remain intact. Optional Vercel configuration adds headers, caching and HTTP redirects. Earlier phase route descriptions and results below are historical.

SEO runs at build time. `src/content/static.ts` still owns normalized content; `src/i18n/routes.ts` still owns page identity, localized paths, and translation availability. Blocks and UI primitives have no SEO responsibilities.

## Configuration

`src/config/deployment.ts` validates `PUBLIC_DEPLOYMENT_PROFILE` and `PUBLIC_SITE_ORIGIN`. Astro configuration loads environment values through Vite 8.3.7's `loadEnv`; rendered site configuration uses the same resolver with Astro's build-time environment. Shell variables take precedence over `.env` values. Use `.env`, `.env.development`, or `.env.production` for the corresponding command, or set shell variables explicitly. Custom Astro `--mode` env-file selection in configuration is not supported by this resolver; use shell variables for such builds.

| Profile     | Default origin           | HTML policy                     | Sitemap             |
| ----------- | ------------------------ | ------------------------------- | ------------------- |
| development | `http://localhost:4321`  | noindex, nofollow               | none                |
| demo        | `https://example.com`    | noindex, nofollow               | none                |
| production  | required explicit origin | index only when content permits | eligible pages only |

An omitted profile defaults to development in dev, demo in a build. Unknown or blank profiles fail. `import.meta.env.PROD` never grants indexing permission. Production rejects non-HTTPS origins, credentials, paths, queries, fragments, nonstandard ports, IPs, localhost, reserved example/test/local domains, named demo/preview/staging hosts, and common provider preview domains. Production custom domains are the supported convention; provider subdomains are deliberately conservative exclusions. This syntactic validation does not verify domain ownership or DNS. Do not put secrets into public variables.

`siteConfig.url` resolves to the validated deployment origin. Optional `siteConfig.seo` contains `titleSuffix` (including its desired separator), `defaultSocialImage` using the existing MediaSource contract, and explicit business schema selection. Business identity and contact values stay in Phase 04 content.

## Metadata flow

The page calls `resolvePageSEO(page, locale, getPage)`, passing normalized Phase 04 data. Title and description are required; neither is inferred from markup or translated through a Russian fallback. Existing `metadata.indexable` remains authoritative content eligibility. Optional page `socialImage` overrides the configured default. There are no automatic description, keyword, title-length, or social-image generation services.

`BaseLayout` accepts optional resolved `seo`. It delegates head output to `SEOHead.astro`, which emits exactly one title, description when supplied, robots directive, canonical, localized alternates, Open Graph metadata, and Twitter-compatible cards. Existing title/description/canonical/alternates props remain supported for old callers with a safe noindex default. A head slot allows the root refresh directive. No SEO client script, hydration, adapter, or runtime state is introduced.

Open Graph uses localized title/description, website type, deployment URL, and `ru_RU` / `kk_KZ` locale values. A social image supplies an absolute URL, alt text, and dimensions. Without an image the card is `summary`; with one it is `summary_large_image`. Local Astro imports retain their emitted asset URLs. Remote social images are URL-validated but their network accessibility must be verified for the real deployment. The shipped fictional content has no configured social image; the isolated production fixture verifies a real emitted local file.

## Canonicals and localized alternates

`availableTranslations(page.id)` supplies the same routes used by the language switcher. Canonicals use the current localized route, the deployment origin, and the established trailing slash. Query strings, fragments, foreign origins, and missing/redirected current routes are rejected. Kazakh pages never canonicalize to Russian.

Only indexable production equivalents appear in head hreflang sets. Each eligible page includes itself and the same eligible counterparts; a noindexed counterpart is excluded on both sides. Missing translations and configured Russian fallback redirects are not independent equivalents. Russian `x-default` points directly to the real eligible Russian page, never the root redirect. Navigation language links remain available even when content is noindexed; they are not search indexing annotations.

Static paths now enumerate `availableTranslations` instead of assuming every locale exists. Existing full-dataset content validation is unchanged: independently relaxing required content translations remains a future content-policy decision.

## Sitemap and robots

Official `@astrojs/sitemap` 3.7.4 is enabled only for production. Its small filter reads each generated HTML head and includes a URL only when SEOHead emitted `index, follow` and its canonical exactly equals that URL. This avoids importing Astro virtual i18n modules or PNG-bearing raw content into config and avoids a second route/content registry. The filter relies on Astro's emitted head serialization; actual-build tests guard that contract. If head serialization changes, update this filter and its build tests together.

HTML hreflang is the single localization annotation channel; sitemap alternates, priorities, lastmod, and changefreq are omitted. Redirects, root, design-system previews, nonindexable pages, and absent routes are excluded. With no eligible pages, the official integration emits its expected warning and no sitemap files. `robots.txt` advertises `sitemap-index.xml` only when production normalized content has eligible routes. Crawling remains allowed so crawlers can read noindex; robots.txt alone is not an indexing safeguard.

The fictional dataset keeps `indexable: false` for all four pages even in production. Design-system routes retain noindex for compatibility. Development-only showcases stay absent from builds. Root now uses BaseLayout and a static meta refresh plus a native Russian-home link, preserving JavaScript-free redirection while adding noindex. It does not promise HTTP 301/302 status codes. A selected host must implement and verify required HTTP redirects, access controls, and headers.

## Structured data

07A.4 adds a site-local FAQPage derived from the five visible localized homepage questions, including on the noindexed demo. This is an exception to the older blanket demo JSON-LD suppression described below: it contains no fabricated rating or business entity. Business schema additionally requires `DEMO_MODE=false` alongside the existing production, indexability and verified-policy gates. The isolated eligible verification fixture switches that flag only inside its copied source.

`businessSchema` accepts normalized BusinessInfo and explicit `siteConfig.seo.business: { verified: true, type: ... }`. Supported types are Organization, LocalBusiness, MedicalClinic, ProfessionalService, and HomeAndConstructionBusiness. Schema selection stays independent of page blocks. Organization suits an online-only provider; a physical address is optional. Home alone emits the entity, with a stable origin-based `#organization` ID. Verification is an author assertion, not an automated claim-checking service.

Name, email, address, and telephone reuse normalized business values. Optional policy values supply verified logo, sameAs, and areaServed. Local business schemas may use optional normalized `openingHours` in Schema.org syntax; localized display hours are never parsed or guessed. Neither sample hours nor ratings/reviews/credentials are fabricated. The current site has no verified-business policy and emits no business entity.

`breadcrumbSchema` uses explicit Home/Services hierarchy and existing localized navigation labels and routes on eligible Services pages. It validates labels, HTTP(S) destinations, duplicates, and sequential positions. Generators validate their supported inputs; the JSON serializer escapes script-breaking characters before `set:html`. Demo, development, and noindexed pages suppress JSON-LD.

Unit tests and actual generated HTML validate supported schema output and parse JSON-LD. No external Schema.org validator or Google Rich Results Test was run. Passing local validation neither certifies eligibility nor guarantees enhanced search results.

## Building a site

For a demo in PowerShell:

```powershell
$env:PUBLIC_DEPLOYMENT_PROFILE = 'demo'
$env:PUBLIC_SITE_ORIGIN = 'https://demo.your-business.kz'
pnpm build
```

For production, first replace fictional content with verified business information, supply complete localized metadata, deliberately set eligible page records to `indexable: true`, and optionally select the appropriate verified business schema and social image. Then:

```powershell
$env:PUBLIC_DEPLOYMENT_PROFILE = 'production'
$env:PUBLIC_SITE_ORIGIN = 'https://your-business.kz'
pnpm build
```

Changing the profile alone does not override page exclusions. Build demo and production into separate deployment artifacts; the current `dist/` is overwritten by the next build. Verify the actual host's canonical URL, robots, sitemap, asset delivery, redirects, HTTPS, caching, and access restrictions. No hosting provider has been selected, so no provider configuration or deployment platform was added.

## Repeatable verification

Run `pnpm test`, `pnpm astro check`, `pnpm lint`, `pnpm format:check`, `pnpm build`, and `pnpm exec playwright test`.

After browser tests (which reset `test-results`), run `pnpm verify:seo`. It copies source into ignored workspace-local fixtures, resolves dependencies from the workspace ancestor, and runs real Astro builds without modifying authored content. It inspects demo HTML and indexing safeguards, production output with the original exclusions, and an eligible production fixture including a noindexed Kazakh Services counterpart. It checks exact sitemap URLs and origin, reciprocal head alternates, a real social image, parsed Organization/BreadcrumbList JSON-LD, and four rejected unsafe configurations. Synthetic fixture business verification is test input only; never deploy the fixtures. Logs, static output, and verification JSON remain under `test-results/seo-builds/`.

Run `pnpm measure:seo` afterward for production-fixture Lighthouse reports. See performance.md for conditions and actual results. No runtime SEO auditor, CMS, analytics, external submission, or deployment manager is included.

If production fails, check the explicit profile/origin first, then existing content validation errors. An empty sitemap with the current fictional dataset is intentional. Never fix it by overriding all content eligibility from an environment variable.

References checked against installed packages: [Astro environment variables](https://docs.astro.build/en/guides/environment-variables/), [official sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/), [Schema.org LocalBusiness](https://schema.org/LocalBusiness), [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList).
