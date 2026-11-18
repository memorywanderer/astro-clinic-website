# Performance verification (Phase 06)

## Phase 07C follow-up (2026-11-18)

After clean-install/build and browser verification, the eligible production fixture was rebuilt and measured with the existing Lighthouse 13.6.0 mobile settings. RU Home scores Performance/Accessibility/Best Practices/SEO **99/100/100/100**, LCP **1.655s**, CLS **0.00088**, TBT **55ms**. KK Home scores **99/100/100/100**, LCP **1.653s**, CLS **0.00116**, TBT **43ms**. RU Services scores **98/100/100/100**, LCP **2.255s**, CLS **0.00046**, TBT **0ms**. All meet the existing lab targets; these are one-run local uncompressed fixture samples, not field INP or live-host results. No visual or accessibility tradeoff was needed. See [verification-07c.md](verification-07c.md) for checks, corrected failures and deployment limitations.

## Milestone 07A.5 follow-up (2026-11-13)

The final eligible-fixture mobile samples score Performance/Accessibility/Best Practices/SEO 100/100/100/100 in both languages. RU LCP is 1.509s and CLS 0.00088; KK LCP is 1.507s and CLS 0.00117. The unchanged services regression sample scores 99/100/100/100, LCP 2.108s and CLS 0.00046. These are single local, uncompressed mobile lab samples, not field Core Web Vitals.

The final affected browser suite passes 51 tests after Header text-reflow and language label-in-name fixes; the preceding full suite passes 132 with two expected non-Chromium measurement skips. Initial homepage third-party requests remain zero. The real 2GIS public-sample iframe loads only after activation; its traffic and widget-internal accessibility are separate from initial-load measurements. Callback UI/controller and unused copy were removed; homepage script transfer is about 24KB. See [milestone-07a5.md](./milestone-07a5.md) for settings, screenshots, map verification, final results and limitations.

## Milestone 07A.2 follow-up (2026-11-11)

The commercial family-clinic redesign was verified after the full browser suite (111 passed, two expected Chromium-only-measurement skips) and a six-test final screenshot follow-up across all three engines. Final eligible-fixture mobile samples: Russian Home Performance 98 / Accessibility 100 / Best Practices 100 / SEO 100, LCP 2.255s, CLS 0.0009, TBT 0ms; Kazakh Home 98/100/100/100, LCP 2.404s, CLS 0.0021, TBT 0ms. The existing single-run, local uncompressed Lighthouse mobile conditions remain unchanged. These are lab samples, not real-user INP or conversion evidence.

Business actions, measured mobile FloatingContact and the small header shadow observer add only native behavior. A traced font-swap wrap in the desktop business region initially produced CLS 0.0121; an intentional two-line context layout corrected it, and the full browser sample fell to 0.0016 without weakening its 0.01 assertion. The actual deployment artifact remains demo/noindex. See [milestone-07a2.md](./milestone-07a2.md) for final commands, conditions and before/after captures; earlier measurements below are historical.

## Milestone 07A follow-up (2026-11-11)

The photographic SAYA QAM homepages were remeasured after the full browser suite. Final eligible-fixture mobile samples scored Performance 99, Accessibility 100, Best Practices 100 and SEO 100 in both languages. Russian Home: LCP 2.113s, CLS 0.0133, TBT 0ms. Kazakh Home: LCP 2.105s, CLS 0.0010, TBT 54ms. Conditions are the same local, uncompressed Lighthouse mobile setup described below; each is a single sample, not field evidence.

The first 07A run exposed mobile image overfetch (the next candidate after 640px was 1536px), an initialization shift from the fail-open Header, and excessive font-subset transfer. Add 768/1024px candidates to Media, use site-local scripting-aware dropdown positioning with a reserved toggle row, and serve two full-alphabet targeted Noto WOFF2 files totaling 55,416 bytes. The measured mobile hero image drops from 168,426 to 55,810 bytes. No animation library, hydration framework, new dependency or pre-paint navigation script was added. JavaScript-disabled navigation remains visible in flow.

The final full browser suite passed 111 tests with two expected Chromium-only measurement skips on Firefox/WebKit. Detailed results, remaining limits and reviewed screenshots are in [milestone-07a.md](./milestone-07a.md); concrete reuse findings are in [starter-feedback.md](./starter-feedback.md). The earlier Phase 06 measurements below describe the original schematic starter, not this new clinic homepage.

Targets: Lighthouse Performance 90+, Accessibility 95+, SEO 95+, Best Practices 90+; LCP <= 2.5s, CLS <= 0.1, INP <= 200ms. These are targets, not guarantees. Field Core Web Vitals need representative real-user data at the 75th percentile; local Lighthouse does not establish INP or field compliance.

## Conventions

Pages remain static Astro output. SEO adds no client JavaScript or hydrated components. Existing Header/Button lifecycle scripts and the 1,169-byte inline motion controller remain the only interaction mechanisms. CSS owns motion; IntersectionObserver activation stays fail-open and reduced-motion users see static content. No analytics, third-party font, external content fetch, animation library, or server adapter is introduced.

Media keeps the existing Astro Image pipeline: intrinsic dimensions, responsive candidates, meaningful alt text, lazy loading below the fold, and explicit eager/high priority for genuine LCP images. Current public Heroes are text-only, but mobile Lighthouse identified the first Services image at y=661px as the LCP element. Public compositions now opt into Services' optional mediaPriority, which forwards eager/high priority only to the first image; all other media keep lazy defaults. The primary heading still paints immediately. The schematic PNG produces three small WebP candidates. Social-image metadata is not an image preload and does not add page rendering weight.

Themes use system Arial / Times New Roman stacks. No font bytes are fetched and no font-swap layout shift is introduced. Prior phases verified installed Windows regular/bold glyph coverage for Russian and Kazakh; cross-platform font availability remains unverified. Any new licensed self-hosted brand font needs Russian/Kazakh coverage, appropriate font-display, fallback metrics, and fresh measurements.

Hashed Astro assets remain static. Production host compression, immutable cache policy for hashed assets, HTML caching, CDN behavior, and HTTP headers require verification on the selected host. None is configured globally by this phase. Evaluate Content-Security-Policy with real Astro/Starwind scripts before enforcing it; X-Content-Type-Options, Referrer-Policy, and Permissions-Policy are hosting responsibilities too.

## Method

1. Run the regular checks and full Playwright suite.
2. Run `pnpm verify:seo` to generate isolated demo, authored production, and eligible production fixture artifacts. This preserves fictional authored data while exercising indexable metadata and sitemap generation.
3. Run `pnpm measure:seo` to serve the eligible fixture statically on loopback, launch installed Playwright Chromium, and audit `/ru/`, `/kk/`, and `/ru/services/` with Lighthouse 13.6.0.
4. Reports and 390px preview screenshots go to `test-results/seo-measurements/`. `summary.json` records actual browser version, full Lighthouse configSettings, scores, LCP/CLS/TBT, resource summaries, and nonperfect audits. The script owns and closes its server/browser. Remote debugging port 9223 must be free.

Lighthouse uses its default mobile emulation and simulated throttling. Screenshots use a separate 390x844 viewport; the report's emulation settings are authoritative for the audit. Static serving deliberately uses no compression and no-store cache headers, so transfer sizes describe this local test. Each page receives one run; results are samples, not medians or guaranteed budgets. No arbitrary new byte budget is enforced before real client assets exist. TBT is a lab indicator and is not INP.

Playwright covers Chromium/Firefox, plus WebKit motion tests. New axe-core 4.14.0 checks use WCAG A/AA tags through WCAG 2.2 on all four localized pages at 320px and 1440px. Existing tests cover JavaScript-disabled content, navigation, keyboard focus, mobile menu behavior, both themes, enlarged text/reflow, and reduced motion. Automated checks do not replace a manual screen-reader, OS/browser zoom, real-device Safari, or full WCAG audit.

## Recorded results (2026-11-10)

Environment: Windows, Node 24.22.0, pnpm 12.18.0, Astro 7.4.8, Playwright 1.65.0, Chromium 158.0.8127.18, Lighthouse 13.6.0, axe-core 4.14.0. Lighthouse used mobile 412x823 emulation at DPR 1.75, simulated 150ms RTT / 1,638.4 Kbps throughput / 4x CPU slowdown, loopback static hosting without compression. These are single-run eligible-fixture measurements after the LCP priority refinement; the sample business is not a real production deployment.

| Page          | Performance | Accessibility | Best Practices | SEO | LCP    | CLS    | TBT  |
| ------------- | ----------- | ------------- | -------------- | --- | ------ | ------ | ---- |
| /ru/          | 100         | 100           | 100            | 100 | 1.565s | 0      | 5ms  |
| /kk/          | 100         | 100           | 100            | 100 | 1.434s | 0      | 25ms |
| /ru/services/ | 100         | 100           | 100            | 100 | 1.357s | 0.0423 | 0ms  |

| Page          | JS transfer | CSS transfer | Image transfer | Font transfer | Total transfer |
| ------------- | ----------- | ------------ | -------------- | ------------- | -------------- |
| /ru/          | 12,093 B    | 18,825 B     | 1,750 B        | 0 B           | 51,022 B       |
| /kk/          | 12,093 B    | 18,825 B     | 1,750 B        | 0 B           | 51,003 B       |
| /ru/services/ | 12,093 B    | 18,825 B     | 1,750 B        | 0 B           | 50,244 B       |

Lighthouse transferSize includes response overhead; inline script/CSS bytes belong to the document row rather than the external script/stylesheet rows. Each page made six recorded resource requests, with no font or third-party transfer. Do not compare these uncompressed local transfer figures directly with a compressed production CDN.

The initial sample flagged lazy loading and missing high priority on the actual mobile LCP image. Final reports no longer flag LCP discovery. All measured values meet the stated lab targets, but small sample variation means the image refinement is not evidence of a universal timing improvement. A residual Services layout shift of 0.0423 remains under target; Lighthouse identifies shifted main content, and a deeper trace would be needed before attributing its cause. CSS render blocking (estimated 140ms), document compression savings (11–12 KiB), the dependency chain, and a forced-reflow insight on Kazakh Home remain findings. No extra runtime or critical-CSS system was added for this small sample. Configure host compression/caching and remeasure real client assets before tightening byte budgets.

The existing Chromium navigation/scroll motion sample separately recorded CLS 0 and 1,169 inline motion-script bytes. This is a different viewport/timing sample from Lighthouse and does not invalidate its residual Services shift. Kazakh mobile production-fixture output was visually inspected; no clipping was observed.

| Command                                                                                                               | Actual result                                                                                         |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| pnpm astro check                                                                                                      | Passed: 80 files, zero errors/warnings/hints                                                          |
| pnpm lint                                                                                                             | Passed                                                                                                |
| pnpm test                                                                                                             | Passed: 28 tests across five files                                                                    |
| pnpm exec playwright test                                                                                             | Passed: 89 tests; two expected Chromium-only measurement skips                                        |
| pnpm exec playwright test tests/e2e/seo-accessibility.spec.ts tests/e2e/content-i18n.spec.ts tests/e2e/motion.spec.ts | Final image-priority follow-up: 49 passed, same two expected skips                                    |
| pnpm build                                                                                                            | Passed: seven static HTML pages, robots endpoint, three optimized image variants; default demo policy |
| pnpm verify:seo                                                                                                       | Passed: demo, authored production, eligible production fixture; four unsafe configurations rejected   |
| pnpm measure:seo                                                                                                      | Passed: three final Lighthouse reports and screenshots                                                |

The final `pnpm format:check` passed: all matched files use Prettier style. The eight new browser accessibility tests run on Chromium/Firefox, each at two widths, and reported no WCAG-tagged axe violations. Existing keyboard, no-JavaScript, reflow, theme-contrast, and reduced-motion tests also passed. Reports are under test-results and are replaced by future test runs.

Initial failures were corrected: the new unit suite needed the existing image-metadata double; an unnecessary Windows junction in the first fixture runner was removed in favor of normal ancestor dependency resolution; the CLI path was corrected against Astro's installed package; a fixture assertion accidentally inspected navigation hreflang instead of only head links; Node script globals needed explicit imports; and new files needed formatting. The first browser run was interrupted after a source/config edit restarted Vite mid-run; the unchanged-source full rerun passed. Lighthouse initially could not see the installed browser from the sandbox and passed when run with approved browser access. Harmless NO_COLOR/FORCE_COLOR warnings remain. The Phase 06 spec received formatting-only normalization.

No external structured-data validator, real-user INP measurement, manual screen-reader/OS zoom audit, real-device Safari test, selected-host redirect/header/cache check, or domain-ownership validation was performed. There are no unresolved failing configured checks. The workspace is not recognized as a Git repository, so Git diff/status is unavailable.
