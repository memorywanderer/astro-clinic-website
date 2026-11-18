# Phosphor icon integration

Verified 13 November 2026. Scope: icon integration/migration only.

- Added dev dependencies unplugin-icons 24.0.0 and @iconify-json/ph 1.2.2 (Phosphor collection 2.1.1). Checked the installed plugin README, Astro compiler and TypeScript declarations before using the API.
- Registered Icons({ compiler: 'astro', scale: 1 }) in the existing Astro/Vite plugin list and added unplugin-icons/types/astro to TypeScript. Icons render as inline SVG during the static build.
- Functional controls use regular-weight list, x and caret-down imports. Native disclosure markers and menu state presentation use these SVGs; keyboard behavior, accessible labels and existing controllers remain. Decorative SVGs have aria-hidden="true". Colors inherit currentColor, and existing sizing/theme behavior remains.
- Migrated every generic ClinicIcon path to Phosphor. Services selectively use tooth-duotone, sparkle-duotone, baby-duotone, crown-duotone, arrows-in-line-horizontal-duotone and chats-duotone. Phone, clock, certificate, credit-card, chat-circle-text, check, map-pin and arrow-right use regular weight. Existing content-driven ClinicIcon is retained locally; no universal icon registry or new wrapper was introduced.
- Replaced WhatsApp marks (header, contacts and floating actions) with the regular Phosphor whatsapp-logo icon, as requested in the follow-up. Preserved the official 2GIS image, custom SAYA QAM mark, Astro favicon and architectural illustrations. Removed the old generic path data and CSS-drawn menu bars.
- No React, icon fonts, icon-specific hydration, client library or icon CDN/API request was added. Production JavaScript/CSS was inspected and checked by browser tests for these exclusions. There was no obsolete icon package to uninstall.

Usage: import a component directly from ~icons/ph/phone (regular) or ~icons/ph/tooth-duotone, render it in Astro with aria-hidden="true", and size it using existing classes. Keep the text/accessibility label on the owning control. SVG attributes/class/style remain overridable. Do not hydrate icons or use dynamic client-side icon lookup.

## Verification

| Check                                                         | Result                                                                                             |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| pnpm astro check                                              | 121 files; zero errors, warnings or hints                                                          |
| pnpm lint                                                     | Passed                                                                                             |
| pnpm test                                                     | 42 tests in eight files passed                                                                     |
| pnpm build                                                    | Passed, static output                                                                              |
| pnpm exec playwright test --workers=2                         | 132 passed; two expected non-Chromium measurement skips                                            |
| pnpm exec playwright test tests/e2e/icons.spec.ts --workers=2 | 8 passed in Chromium/Firefox                                                                       |
| pnpm verify:seo                                               | Passed after the final browser run; fixtures are isolated and must not be deployed                 |
| Formatting                                                    | Changed files pass; whole-project check flags only unchanged specifications 07A.3, 07A.4 and 07A.5 |

The full suite covers themes, accessible business-block variants, native keyboard interactions, no-JavaScript fallback, text enlargement, reduced motion and responsive layouts. Targeted tests prove static SVG rendering, decorative semantics, correct menu/list/close and disclosure states, service duotone versus functional regular variants, preservation of brand assets, and absence of icon runtime/font assets. Screenshots at 320px and 1440px were visually inspected; no icon alignment or responsive regression was observed.

Screenshots: [mobile menu](./screenshots/phosphor-menu-320.png), [mobile disclosure](./screenshots/phosphor-disclosure-320.png), [desktop disclosure](./screenshots/phosphor-disclosure-1440.png). The existing full clinic capture suite also covers both locales at 320, 360, 390, 768, 1024 and 1440px.

Final pnpm measure:seo ran after browser tests and verify:seo, on the isolated eligible fixture (Lighthouse 13.6.0, mobile simulation, one sample per route):

| Route         | Performance | Accessibility | Best practices | SEO |    LCP |     CLS |
| ------------- | ----------: | ------------: | -------------: | --: | -----: | ------: |
| /ru/          |          99 |           100 |            100 | 100 | 1.654s | 0.00088 |
| /kk/          |          99 |           100 |            100 | 100 | 1.654s | 0.00116 |
| /ru/services/ |          98 |           100 |            100 | 100 | 2.255s | 0.00046 |

The initial Russian sample was Performance 96 / LCP 2.557s. A repeat without code changes measured 99 / 1.654s; both samples are recorded rather than treating lab variation as a guaranteed improvement. The repeat Kazakh sample is also 99 / 1.654s. Both latest homepage samples meet the existing 2.5s LCP target. JavaScript transfer remains 24,209 bytes, unchanged from the previous project report. [Initial sample summary](../test-results/seo-measurements/icons-initial-summary.json).

[Machine measurement summary](../test-results/seo-measurements/summary.json). These are local lab samples, not field Core Web Vitals. Automated checks do not replace physical-device or screen-reader testing. No deployment was performed.
