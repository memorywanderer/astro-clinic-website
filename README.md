# SAYA QAM dental clinic demo

A fictional Russian/Kazakh clinic website built with Astro 7.4.8, strict TypeScript, Tailwind CSS 4 and source-owned Starwind primitives. It builds to portable static files with no adapter, backend, CMS or tracking.

## Requirements and installation

Use Node.js **24.22.0 or newer within 24.x** (`.nvmrc`) and **pnpm 12.18.0** (`packageManager`). Keep `pnpm-lock.yaml` and `pnpm-workspace.yaml` in Git.

```sh
corepack enable
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
```

If Corepack is unavailable, follow its [installation instructions](https://github.com/nodejs/corepack#manual-installs). The pnpm version must be 12.18.0.

## Build and preview

```sh
pnpm build
pnpm preview
```

Only `dist/` is the deployment artifact. Preview serves generated files but does not apply Vercel headers or redirects. Copy `.env.example` to `.env` for local settings. Builds default to demo; set `PUBLIC_SITE_ORIGIN` to the deployment's HTTPS origin for correct canonical and social URLs. Vercel supplies its deployment URL automatically when an explicit origin is absent.

Demo output remains `noindex, nofollow`, including on Vercel's Production environment. `PUBLIC_DEPLOYMENT_PROFILE=production` requires a real custom HTTPS origin; it does not launch the fictional business. Indexing also requires deliberate per-page content eligibility. `DEMO_MODE=true` keeps contact actions in local demo dialogs and suppresses business schema. Vercel previews always use demo policy even when production settings are inherited.

## Checks

| Command                     | Purpose                                                                          |
| --------------------------- | -------------------------------------------------------------------------------- |
| `pnpm astro check`          | Astro and strict TypeScript diagnostics                                          |
| `pnpm lint`                 | ESLint                                                                           |
| `pnpm format:check`         | Prettier                                                                         |
| `pnpm test`                 | Unit tests                                                                       |
| `pnpm exec playwright test` | Browser regression, production preview, accessibility and CSP compatibility      |
| `pnpm verify:seo`           | Isolated demo, authored production, eligible fixture and provider-preview builds |
| `pnpm measure:seo`          | Lighthouse against the isolated production fixture                               |

Install browsers once with `pnpm exec playwright install chromium firefox webkit`. Playwright owns ports **4325/4326** and resets `test-results/`; run SEO verification and then Lighthouse afterward. Lighthouse needs port **9223**. Fixture builds intentionally change content safety flags: **never deploy anything from `test-results/`**. Finish with `pnpm build` to generate the authored deployment artifact.

## Deployment

Import the repository into Vercel, retain automatic Astro detection, select Node 24.x, set `ENABLE_EXPERIMENTAL_COREPACK=1`, install with `pnpm install --frozen-lockfile`, build with `pnpm build`, and publish `dist`. Set `PUBLIC_DEPLOYMENT_PROFILE=demo` for both Preview and Production while this remains fictional. No adapter is needed for static hosting; see [Vercel's Astro guide](https://vercel.com/docs/frameworks/frontend/astro).

See [deployment.md](docs/deployment.md) for environment scopes, custom domains, branch workflow, promotion rebuilds, security policy, real-client prerequisites and verification limitations.

## Architecture

- `src/config`: identity, locales, theme and deployment policy.
- `src/content`: typed local data, normalization and future provider boundary.
- `src/i18n`: dictionaries and localized route registry.
- `src/components`: primitives, blocks and clinic compositions.
- `src/layouts`: document shell and SEO head.
- `src/lib`: shared utilities and build-time SEO.
- `src/pages`: explicit routes: `/ru/`, `/kk/` and localized `/services/`, root fallback and bilingual 404.

Design-system, component, motion, content and example previews exist only in development. The public services pages retain schematic starter content; replace or deliberately retire them before a real clinic launch.

Further documentation: [design system](docs/design-system.md), [content](docs/content.md), [localization](docs/i18n.md), [SEO](docs/seo.md), [performance](docs/performance.md), [media provenance](docs/clinic-media.md) and [decisions](docs/decisions.md).
