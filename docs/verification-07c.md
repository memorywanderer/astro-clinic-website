# Phase 07C verification — 2026-11-18

Environment: Windows, Node 24.22.0, pnpm 12.18.0, Astro 7.4.8. Dependencies were retained at their locked versions. No deployment, hosting resource, repository initialization, commit or push was performed.

## Executed checks

| Check                                  | Actual result                                                                                                                                                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`       | Passed in the workspace with registry access; lockfile unchanged.                                                                                                                                     |
| Isolated clean installation            | Copied source/public/config/manifest/lockfile/workspace settings to empty `test-results/clean-install`; `pnpm install --frozen-lockfile` installed 505 packages. No existing node_modules was copied. |
| `pnpm build` in the clean installation | Passed: six HTML pages, robots endpoint, 24 optimized image variants.                                                                                                                                 |
| `pnpm astro check`                     | Passed: 123 files, zero errors/warnings/hints.                                                                                                                                                        |
| `pnpm lint`                            | Passed after correcting a new regex-spacing lint error.                                                                                                                                               |
| `pnpm format:check`                    | Passed after formatting four pre-existing spec files; their requirements are unchanged.                                                                                                               |
| `pnpm test`                            | Passed: 43 tests across eight files.                                                                                                                                                                  |
| `pnpm exec playwright test`            | Passed: 146 tests; two expected non-Chromium motion-measurement skips. Chromium/Firefox plus selected WebKit suites.                                                                                  |
| Production preview                     | Exercised by Playwright through real `pnpm build` and `pnpm preview` on port 4325, with a separate dev server on 4326.                                                                                |
| `pnpm verify:seo`                      | Passed: demo, authored production, eligible production, Vercel preview downgrade; five unsafe profile/origin builds rejected.                                                                         |
| `pnpm measure:seo`                     | Passed: three eligible-fixture Lighthouse reports and mobile screenshots.                                                                                                                             |
| `node scripts/verify-clinic-fonts.mjs` | Passed: original Noto Sans/Display TrueType cmap coverage for Russian and Kazakh. Shipped local WOFF2 assets remained unchanged.                                                                      |
| Final `pnpm build`                     | Passed after browser/SEO measurements; root dist contains authored demo-safe output, not eligible fixture content.                                                                                    |

The fresh installation used the host package store to obtain the exact locked packages, with supply-chain checks enabled. This verifies installation without existing project dependencies; it is not a cold-cache download or a Linux/Vercel build. Root and isolated lockfile hashes match.

## Output and browser inspection

Actual generated HTML assertions verify localized titles/descriptions, language-specific canonical/OG URLs, robots, indexable-only reciprocal alternates and sitemap URLs, favicon/social/touch assets, parsed JSON-LD and absence of internal routes. The 404 stays noindex and the fixture cannot put it into a sitemap. Eligible test content is confined to ignored test output.

Browser checks cover expanded/compact headers, mobile navigation, RU/KK switching, specialists/review/promotion scrolling, floating contacts, pricing/service navigation, FAQ, map activation/blocked-frame fallback, footer, keyboard/focus, reduced motion, disabled JavaScript, text enlargement and narrow reflow. WCAG-tagged axe checks run at 320px and 1440px. New checks confirm HTTP 404 for internal/missing routes and bilingual recovery links. The exact hosting CSP is injected into preview responses and exercised with scripts, a mobile menu, a demo dialog and a mocked allowed 2GIS iframe in Chromium/Firefox/WebKit. No CSP violations or failing resource responses occurred in that check.

The generated social card and a full Kazakh mobile homepage screenshot were visually inspected. The existing visual identity is preserved. Source images, font licenses/provenance and architecture/spec/test files were retained. The obsolete one-off 07A.5 screenshot script was removed; generated debug logs are ignored and removed locally. No unused production dependency requiring removal was identified.

## Lighthouse samples

| Page            | Performance | Accessibility | Best Practices | SEO | LCP    | CLS     | TBT  |
| --------------- | ----------- | ------------- | -------------- | --- | ------ | ------- | ---- |
| `/ru/`          | 99          | 100           | 100            | 100 | 1.655s | 0.00088 | 55ms |
| `/kk/`          | 99          | 100           | 100            | 100 | 1.653s | 0.00116 | 43ms |
| `/ru/services/` | 98          | 100           | 100            | 100 | 2.255s | 0.00046 | 0ms  |

Existing mobile simulated-throttling settings and uncompressed no-store loopback serving were retained. One run per page; these results do not establish field INP or real-host performance. Reports, settings, findings and screenshots live in `test-results/seo-measurements/`; build assertions live in `test-results/seo-builds/verification.json`. Those directories are local ignored artifacts and must never be deployed.

## Corrected failures and limitations

The initial offline clean-install attempt failed because the sandbox's package metadata cache was incomplete. The frozen installation passed with approved registry access, without disabling supply-chain policy or changing dependency versions. An attempted Python icon conversion was unavailable in this environment; the existing installed image processor produced the committed matching PNG/ICO exports instead, with no new dependency.

The initial full browser run passed 140 tests and failed six theme checks because the checks had retained a public HTTP-200 assumption when design-system pages moved to development. Astro's native prefixed i18n router renders unprefixed dev showcases with their authored body and HTTP 404. The tests now verify the actual theme content/contrast/focus contract on the dev server, while separate public-output tests require those paths to be absent. The final unchanged-source full rerun passed 146 with the same two expected skips. A direct loopback fetch across tool sandboxes was unavailable; the configured Playwright preview checks passed.

No configured check remains failing. No manual screen-reader audit, real-device Safari/OS zoom audit, field Core Web Vitals, live social debugger, live-map-under-host-headers check, external schema validator, domain/DNS/ownership check or real Vercel/Linux installation/deployment was performed. Headers/redirects/CDN caching are configured and CSP compatibility is tested locally; provider delivery needs the post-deployment acceptance steps in [deployment.md](deployment.md).

This directory has no Git repository, so tracked-file status/diff and lockfile commit status could not be verified. The fictional identity, disabled live contacts, schematic Services content and unreviewed KK copy still require the documented real-client replacement work before a commercial launch. They do not prevent deployment as a noindex demo.
