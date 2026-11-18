# Deployment preparation — phase 07C

## Runtime and reproducibility

Use Node.js >=24.22.0 <25 and pnpm 12.18.0. `.nvmrc` records the locally verified Node version. Astro 7.4.8 requires Node >=22.23.4; the selected 24.x line also satisfies Vite 8.3.7. No dependency upgrade or hosting adapter is required.

Commit the manifest, multi-document pnpm 12 lockfile and workspace settings together. Use `pnpm install --frozen-lockfile`; stale manifests must fail rather than silently resolve newer dependencies. Build/verification need devDependencies, so do not use a production-only installation before building. Deployed files require no Node server.

```sh
corepack enable
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
```

The pnpm version must report 12.18.0. If Corepack is missing, follow [Corepack installation](https://github.com/nodejs/corepack#manual-installs). Build output is `dist/`; preview is for local inspection. Never deploy `node_modules` or test fixtures. Public builds contain four localized content pages, root fallback, `404.html`, `robots.txt` and static assets. Internal previews have no build paths.

## Environment configuration

Copy `.env.example` to `.env` locally or set hosting dashboard variables. `PUBLIC_` settings are public; never put credentials in them. No secrets are required. Local env files, `.vercel/`, logs, output, coverage and test artifacts are ignored.

| Variable                       | Use                                                                                                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_DEPLOYMENT_PROFILE`    | `development` in dev only; `demo` or `production` for builds. Omission defaults to development in dev and demo in builds. Blank/unknown values fail.       |
| `PUBLIC_SITE_ORIGIN`           | Origin only, without path/query/credentials/fragment. Production requires an explicit public HTTPS custom domain. Demo should use its own HTTPS origin.    |
| `VERCEL_ENV`                   | Provider-owned context: any defined value other than `production` forces demo policy, even with requested production settings. Leave unset on other hosts. |
| `VERCEL_URL`                   | Provider-owned hostname: fallback demo origin when no explicit origin exists. Do not add protocol/path.                                                    |
| `ENABLE_EXPERIMENTAL_COREPACK` | Set to `1` on Vercel to honor the pinned pnpm version.                                                                                                     |

PowerShell example:

```powershell
$env:PUBLIC_DEPLOYMENT_PROFILE = 'demo'
$env:PUBLIC_SITE_ORIGIN = 'https://your-demo-domain.kz'
pnpm build
pnpm preview
```

Without an origin or provider URL, local demo verification uses reserved `https://example.com`. Set a real origin before publishing elsewhere. Localhost is restricted to dev/test servers. Production rejects local/reserved/test domains, IPs, staging/preview hosts and common provider subdomains. Shell variables take precedence over `.env`; use normal development/production env files. Custom Astro `--mode` env-file selection remains unsupported by the config resolver; use shell variables instead.

## Demo, preview and launch policy

A hosting Production environment is a delivery target, not permission to launch a real business. Keep both Vercel scopes on `demo`. Demo HTML emits `noindex, nofollow`, omits search hreflang and emits no sitemap. Robots allows fetching so crawlers can observe noindex. This is not access control: use host protection for private previews.

Even an explicit production profile and valid origin keep shipped pages noindex because authored eligibility is false. Indexing requires both production policy and per-page `metadata.indexable=true`. Only eligible equivalents receive reciprocal RU/KK hreflang, absolute canonicals and sitemap entries. Vercel previews override production policy before eligibility decisions. Other hosts must explicitly set preview builds to demo. Rebuild with reviewed settings before a real launch; do not promote a preview artifact.

`src/config/clinic.ts` keeps `DEMO_MODE=true`. Phone/WhatsApp actions open local demo dialogs. Never switch this flag for a public demo. Business JSON-LD additionally needs production, eligible content and an explicit verified schema policy. Visible-question FAQPage remains in demo and contains no fabricated business, rating or address.

The 2GIS frame loads only after user activation. Before activation all fonts, images, scripts and CSS are local. The disclosed external directions link points to an unrelated public landmark, not another dental business. Activation requests 2GIS, whose iframe can load its own third-party resources. The disclosure and external fallback link survive disabled JavaScript/blocked frames. No analytics, cookies, submissions or data collection were added.

## Vercel import and deployment

1. Create a Git repository if necessary, review files, commit source/public assets, tests, docs, manifest, lockfile, workspace settings and `vercel.json`, then push to your Git provider. Exclude `.env`, `dist`, `node_modules` and `test-results`. This phase creates no repository, commit or push.
2. In Vercel choose **Add New → Project**, import the repository and select the directory containing `package.json`. Keep automatic **Astro** detection. No `@astrojs/vercel` adapter is needed; see [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro).
3. Select **Node.js 24.x** under Build and Deployment. The package engine prevents drifting into another major. Vercel manages patch versions within the major; see [Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
4. Set `ENABLE_EXPERIMENTAL_COREPACK=1` for Preview and Production. Set install command `pnpm install --frozen-lockfile`, build `pnpm build`, output `dist`. Leave other framework defaults. Corepack honors `packageManager`; see [build configuration](https://vercel.com/docs/builds/configure-a-build).
5. Set `PUBLIC_DEPLOYMENT_PROFILE=demo` separately for Preview and Production. For previews, omit `PUBLIC_SITE_ORIGIN` to use each deployment's URL. For the production delivery target, set it to the intended demo/custom domain; its provider hostname also works as a demo fallback. Do not manually set `VERCEL_ENV` or `VERCEL_URL`.
6. Select the production branch (usually `main`) and enable preview protection where available. Feature branches/PRs produce previews; merging reviewed changes rebuilds the production target. Review environment scopes before merging.
7. Deploy. Add a custom domain under Settings → Domains, follow the exact DNS records Vercel shows, wait for validation/HTTPS and select the canonical host. Redirect alternative hosts to it. Set `PUBLIC_SITE_ORIGIN` to that HTTPS origin and redeploy. Do not guess DNS values.
8. Run the live-host checks below. Environment edits affect new builds only. Use deployment history for rollback and rebuild if configuration or time-sensitive content changes.

No hosting resources or deployment are created by this phase. Vercel installation, Linux builds, DNS, SSL and CDN behavior require confirmation on the first actual deployment.

## Headers, redirects and caching

`vercel.json` supplies a temporary root redirect to `/ru/`, trailing slashes, `nosniff`, a referrer policy, disabled camera/microphone/geolocation, anti-framing headers and a limited CSP. Root retains meta-refresh/native-link fallback on other hosts. Configure equivalent rules there, including serving `404.html` with HTTP 404. Do not use an SPA fallback.

CSP restricts base URLs, objects, form destinations and embedding of this site; `frame-src` permits the exact 2GIS constructor origin. It deliberately omits `default-src`, `script-src` and `style-src`: existing Astro/Starwind scripts, JSON-LD, inline motion and style attributes remain functional. It is not a complete script injection policy. Further restrictions require a generated-hash/nonce or Astro CSP review plus browser verification. Browser tests inject the exact hosting headers into local preview responses and exercise scripts, mobile navigation, dialogs and a mocked 2GIS iframe. Preview itself does not apply hosting rules; the real provider response/live map still need inspection.

Only hashed `/_astro/` assets receive a one-year immutable cache. Unhashed fonts, icons, social cards, HTML, robots and sitemap retain host defaults. Do not apply immutable caching to them. Measure host compression/CDN effectiveness after deployment. Rules follow Vercel's [configuration reference](https://vercel.com/docs/project-configuration/vercel-json); the same static artifact can be hosted elsewhere with equivalent rules.

## Content updates and promotion expiry

Edit typed data in `src/content`, identity/contact settings in `src/config`, and both dictionaries where UI strings change. Check both languages, then commit/merge through preview to trigger a rebuild. The existing static content provider boundary stays unchanged.

Offers are filtered by `validUntil` at build time. The shipped offer expires **2026-12-31**. Deployed HTML does not update at midnight. Redeploy at the intended expiry boundary using the content's timezone/date rules, or remove the offer before its deadline. Also review prices, hours, experience and review claims on real-content updates. No scheduled rebuild, webhook or runtime expiry service is configured.

## Before a real client launch

- Verify and replace business identity, address, phone/WhatsApp/email, hours, services/prices, promotion terms/dates, biographies, licenses and review sources in both languages. Remove fictional claims. Review KK with a native speaker (`docs/kk-review-needed.md`). Replace or retire schematic services pages and update links/routes together.
- Replace the unrelated map with the verified location and review its privacy notice. Confirm rights/licenses for real portraits, photos and testimonials; preserve licensed sources and provenance records.
- Replace the demo social card/icons/metadata as needed. The 1200×630 PNG derives from `src/assets/brand/social-preview.svg`; touch/ICO exports derive from the existing favicon. These are committed assets, with no new build dependency.
- Set the verified custom origin and production profile; review page indexing flags deliberately. Set `DEMO_MODE=false` only after verifying every contact destination. Live-action unit tests use fictional fixtures and do not verify ownership of a number.
- Configure business JSON-LD only with an explicit verified policy. A build cannot verify real-world claims. Keep fabricated ratings/reviews/credentials out of schema.
- Supply any necessary real-client privacy/legal information and consent flows before introducing data collection.

## Verification and live-host acceptance

Executed results, corrected failures and environmental limitations are recorded in [verification-07c.md](verification-07c.md).

Run Astro, lint, formatting, unit and browser checks, then `pnpm verify:seo`, then `pnpm measure:seo`. Playwright resets `test-results`; SEO/Lighthouse must follow it. Browser tests cover desktop/mobile headers, menus, language switching, sliders, contact controls, pricing/service anchors, FAQ, map fallback, footer, keyboard/focus, reduced motion, no-JavaScript and text enlargement. This does not replace screen-reader/real-device testing. SEO fixtures intentionally enable indexable sample content: never deploy them. Results are recorded in `docs/verification-07c.md`.

Finish with `pnpm build` using intended variables and inspect using `pnpm preview`. Deploy only that authored `dist`. On the live URL check:

- HTTPS/preferred host, root/slash redirects and a genuine unknown-page HTTP 404.
- Both languages' titles/descriptions/`lang`, absolute canonical/OG/image URLs, icons and robots policy. Demo must have no sitemap/hreflang; real production must contain only deliberately eligible pages.
- Links/anchors, responsive media/fonts/layout, menus/dialogs/sliders/FAQ, keyboard focus, demo contact safety and no-JavaScript fallback.
- HTML/hashed-asset security and cache headers, compression and CDN behavior; no CSP console errors; real user-activated 2GIS and blocked-frame fallback; no third-party requests before activation.
- Fresh Lighthouse on the real domain. Lab samples do not establish field INP/Core Web Vitals.

In development, Astro's prefixed i18n routing can return HTTP 404 for an unprefixed showcase while preserving its authored preview body. Theme tests validate that body; public builds exclude these routes entirely.
