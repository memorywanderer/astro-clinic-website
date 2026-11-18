# Milestone 07A — SAYA QAM

Implemented scope: theme and complete Russian/Kazakh homepage. The phase spec contains no explicit 07A subdivision; this scope follows the user's approved milestone boundary. Remaining clinic pages are deferred.

## Identity and composition

SAYA QAM is an explicitly fictional premium dental concept set in Almaty, Kazakhstan. Porcelain `#FAFBFA`, graphite `#202D2B`, pine `#153F3B`, jade `#DCECE5`, and lavender `#C8BDD8` form a restrained palette. Theme references resolve through the starter's semantic tokens; the lavender highlight has a theme-safe semantic fallback. The static `saya` theme is selected in site config.

Self-hosted Noto Sans Display establishes expressive, regular-weight headings; Noto Sans carries readable body and interface text. Original font cmap inspection verifies the full Russian alphabet and required Kazakh letters in both cases. The final WOFF2 files include the complete Russian/Kazakh alphabets in both cases, basic Latin, digits and site punctuation; targeted Google Fonts subsets reduce their combined size to 55,416 bytes. They load locally with swap. Font licenses are in `public/fonts/OFL.txt`; the exact Google Fonts CSS used to obtain the subsets is retained as `public/fonts/source.css` for provenance, but is not linked or requested by the site.

The distinctive moment is the oversized, asymmetric hero beside a sunlit treatment-room image with an architectural corner treatment. Subsequent sections vary scale and surface: restrained treatments, jade introduction and experience principles, a three-column editorial team layout, asymmetric gallery, reading-width native FAQ and pine closing contact section. On mobile these become a deliberate single-column sequence with native menu disclosure and generous touch targets.

No medical credentials, results, awards, ratings or treatment promises appear. Six core treatments are explanatory previews. The contact action opens an honest native disclosure rather than a form or simulated success. All substantive content and disclosures work without JavaScript. The existing optional motion controller animates only the introduction image when it enters view, preserving initial hero/LCP paint and reduced-motion behavior.

## Routing and deployment

Completed clinic routes: `/ru/` and `/kk/`. Root retains the native static Russian redirect. Language switching preserves the equivalent homepage. Existing starter services examples remain available for regression coverage, with their original example body content, but are unlinked from this homepage; they are not delivered clinic pages. No other page implementation was added.

Deployment defaults to demo. Localized titles/descriptions and canonical policies use existing infrastructure. Fictional data remains `indexable: false`, including under a production profile; no business JSON-LD, eligible hreflang or production sitemap is advertised for this demo. No hosting configuration or deployment was added. Build with `pnpm build`; use `dist/` only, never `test-results/seo-builds/` fixtures. Configure a real demo origin before publishing externally.

## Verification record

Final verification date: 2026-11-11. All checks below were executed; no deployment was attempted.

| Command                                 | Final result                                                                                                               |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `pnpm astro check`                      | Passed: 85 files, zero errors/warnings/hints                                                                               |
| `pnpm lint`                             | Passed                                                                                                                     |
| `pnpm format:check`                     | Passed                                                                                                                     |
| `pnpm test`                             | Passed: 28 tests in five files                                                                                             |
| `pnpm exec playwright test --workers=2` | Passed: 111 tests; two expected non-Chromium skips for the Chromium-only layout-shift measurement                          |
| `pnpm build`                            | Passed: eight static HTML pages and robots.txt; 24 optimized image variants; demo policy                                   |
| `pnpm verify:seo`                       | Passed: demo, authored-production exclusions, eligible isolated production fixture and four rejected unsafe configurations |
| `pnpm measure:seo`                      | Passed: three Lighthouse reports and mobile screenshots on the verified fixture                                            |
| `node scripts/verify-clinic-fonts.mjs`  | Passed: both original font cmap tables include full Russian and required Kazakh letters in both cases                      |

Both homepage locales were tested in Chromium, Firefox and Playwright WebKit. Checks cover 360/390/768/1024/1440px, with existing integration coverage also exercising 320px and 200% root text enlargement. All image requests completed, fragment links resolve, the mobile menu closes after navigation, the FAQ operates by keyboard, and the contact disclosure truthfully explains that no data is sent. Existing JavaScript-disabled, equivalent-route language switching, reduced-motion, theme contrast and fail-open motion checks pass. Automated axe WCAG-tagged checks found no violations on either homepage at 320px/1440px in Chromium and Firefox.

### Final Lighthouse sample

Windows, Node 24.22.0, pnpm 12.18.0, Astro 7.4.8, Lighthouse 13.6.0, Chromium 158.0.8127.18. Local static serving without compression/cache, default Lighthouse mobile simulated throttling: 412x823, DPR 1.75, 150ms RTT, 1,638.4 Kbps throughput and 4x CPU slowdown. One final sample per page, not a median or field measurement. This is an isolated eligible production fixture; the actual demo remains noindexed.

| Route                                                  | Performance | Accessibility | Best practices | SEO | LCP    | CLS    | TBT  |
| ------------------------------------------------------ | ----------- | ------------- | -------------- | --- | ------ | ------ | ---- |
| `/ru/`                                                 | 99          | 100           | 100            | 100 | 2.113s | 0.0133 | 0ms  |
| `/kk/`                                                 | 99          | 100           | 100            | 100 | 2.105s | 0.0010 | 54ms |
| `/ru/services/` (inherited starter regression fixture) | 99          | 100           | 100            | 100 | 1.806s | 0.0496 | 0ms  |

The final samples meet the stated synthetic score/LCP/CLS targets. TBT is not INP; field Core Web Vitals are not established. Reports and detailed settings remain under `test-results/seo-measurements/`; verification fixtures are under `test-results/seo-builds/` and must never be deployed.

The first sample exposed 3.529s Russian LCP and 0.1322 Kazakh CLS. Intermediate responsive image candidates, a stable mobile disclosure layout, and smaller full-alphabet font subsets corrected these measured findings. Residual findings include render-blocking CSS, local server compression/cache configuration and small font/layout shifts; remeasure under actual hosting conditions.

### Reviewed screenshots

Actual final rendered output was visually reviewed. Persistent Chromium captures:

- [Russian desktop, 1440px](./screenshots/07a-ru-desktop.png)
- [Russian mobile, 390px](./screenshots/07a-ru-mobile.png)
- [Kazakh desktop, 1440px](./screenshots/07a-kk-desktop.png)
- [Kazakh mobile, 390px](./screenshots/07a-kk-mobile.png)
- [Desktop hero detail](./screenshots/07a-ru-desktop-hero.png)
- [Kazakh mobile hero detail](./screenshots/07a-kk-mobile-hero.png)

Review verified headline wraps, mobile composition, image crops, section rhythm and caption readability. It caught an obsolete container-class selector before completion. Initial browser regressions exposed fixed Tab counts tied to two theme links; those assertions now derive from the theme registry. Two initial Firefox tests timed out under eight-worker load; the final two-worker full run passed without retries. The initial font download, local preview and Lighthouse attempts encountered sandbox network/socket/browser-path limits; approved retries succeeded. Existing frontend skill/spec files received formatting-only normalization so the repository's configured format check passes.

## Limitations

No deployment, real-device Safari session, manual screen-reader audit, native browser zoom audit, external structured-data validation or real-user INP measurement is claimed. Automated text enlargement and reflow are tested. Name screening was a limited exact-name web search rather than trademark clearance. The working directory is not recognized as a Git repository, so a Git diff/status report is unavailable. Package restoration used the existing lockfile without a dependency change. Local server access required running the preview outside the sandbox.

See [starter-feedback.md](./starter-feedback.md) for reusable-component findings and [clinic-media.md](./clinic-media.md) for image provenance and prompts.
