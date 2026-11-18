# Milestone 07A.2 — SAYA QAM commercial redesign

## Design brief and outcome

Audience: adults and families comparing local dental practices by services, costs, practitioners and convenience. Positioning: approachable mid-range family dentistry in Kazakhstan. SAYA QAM retains its wordmark, pine/sage palette and locally hosted Noto typography, with stronger supporting-text contrast, shorter headings, denser information and a consistent primary-action treatment.

The page follows discover → understand → compare → trust → contact. It is a fictional demonstration, not an operating clinic. It does not take appointments, send messages, process payments or publish real clinical credentials/reviews.

The user additionally requested a modern menu, grouped language switcher, sticky header transition and floating message/call control. The header stays at a stable height, fades its shadow after the announcement scrolls away, and uses native links styled as a segmented language control. The mobile menu preserves the copied Phase 06.1 keyboard/Starwind behavior and parser-time native fallback, with a short opacity/transform entrance and a menu/close icon transition. Reduced motion disables decorative transitions.

## Revised composition

1. One illustrative promotion announcement, outside the sticky header so it scrolls away.
2. Compact business header with wordmark, locality/demo context, primary CTA, language segment and section navigation.
3. Family-focused split hero: a clear service heading, short explanation, primary demo booking action and secondary services/prices action. Redundant hero checklists were removed after mobile review.
4. Eight patient-oriented discovery links. Hygiene and children's dentistry jump directly to featured price cards; the rest reach the price section.
5. Two featured price cards and six compact price rows. Exact, starting, range and consultation-dependent states use the original numeric Price contract. Whole-tenge symbol formatting improves scanning. All sums are clearly illustrative at the section itself.
6. Concise introduction with three specific communication principles and one reception image.
7. Two balanced specialist cards with readable roles, useful short descriptions and first-visit links. Names/portraits are fictional; the section says so once. No invented credentials, years of experience or quotes remain.
8. Compact trust guidance: what to check before a real appointment, an explanation that no verified SAYA QAM evidence exists, and an honestly labeled platform-homepage link through ReviewSummary. No rating, review count or license is fabricated.
9. A three-step first-visit sequence: describe the concern, meet the practitioner, discuss the plan and estimate. No waiting-time or outcome promises.
10. One illustrative prevention promotion beside payment guidance. Unverified payment providers remain absent; there is no financing claim.
11. Four practical FAQ questions covering prices, consultation, payment availability and demo contact behavior.
12. A two-part contact/location section with distinct messenger/call explanations, missing-address information and an explicitly illustrative schedule. There is no fake street address, route or map embed.
13. Footer with section navigation and a complete fictional-content disclosure.
14. One mobile floating bar with message/call controls. Its actual wrapping height is reserved after the footer, preserving access to content and respecting safe-area insets. With JavaScript disabled, it stays in normal flow.

## CTA hierarchy and business value

The primary action names booking and explicitly marks it as a demo. The secondary action helps comparison by taking visitors to services and pricing. Contextual links identify the question: hygiene cost, children's appointments, implants, orthodontics or payment/visit preparation. They use validated internal destinations and never point to unfinished inner pages.

Message and call actions reference the shared normalized contact source when configured. In this demo neither exists, so FloatingContact and ContactActions receive internal explanation links. A small local enhancement opens the appropriate native disclosure while preserving normal fragment navigation. No submitted/sent/confirmed state is simulated and no patient data is collected. Price and announcement actions are normalized through the same helper rather than a second link resolver.

The structure improves access to information needed for service discovery and comparison; it is not evidence of measured conversion improvement. No analytics was installed.

## Components and architecture

Read the actual Phase 06.1 source in foundation-1, then copied only the selected business components, their business contracts/helpers, compatible shared action styling/ButtonRoot extraction, Header improvements and the focused action/formatting unit suite. Foundation-1 remains unchanged. No packages, CMS facade, renderer registry, SDK or hydration framework were added.

Site-specific compositions are ClinicHome, ClinicPricing, ClinicContact, SpecialistsPreview, ClinicIcon and the small ClinicInteractions script. Existing Hero/About/FAQ/Footer and UI primitives are reused. Generic pricing labels are in the existing dictionaries; page content stays typed and locale-resolved. Both `/ru/` and `/kk/` remain shared static compositions.

ContactInfo/BusinessSource optional contact fields and validation follow Phase 06.1. LocationDetails remains conditional on genuine location data. PaymentOptions intentionally receives no verified methods, so no provider list is rendered. Credentials and SocialLinks were not copied or forced into the page. See [starter-feedback.md](./starter-feedback.md) for concrete limitations and candidate improvements.

## Media

The previous repeated gallery is removed. Each of the four current photographs appears once: a new generated family-consultation scene, one reception image and two existing generated portraits. The hero is prioritized; other photographs remain lazy, optimized and dimensioned through Media. Captions and section/footer disclosures identify illustrative imagery. The new prompt and asset path are recorded in [clinic-media.md](./clinic-media.md).

## Verification

Verification date: 2026-11-11. No deployment was performed.

| Executed check                                                        | Final result                                                                                                                                                |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm astro check`                                                    | Passed: 104 files, zero errors/warnings/hints                                                                                                               |
| `pnpm lint`                                                           | Passed                                                                                                                                                      |
| `pnpm format:check`                                                   | Passed after formatting changed documentation and formatting-only normalization of the supplied 07A.2 spec                                                  |
| `pnpm test`                                                           | Passed: 36 tests in six files, including copied action/price/date/schedule invariants and whole-tenge formatting                                            |
| `pnpm exec playwright test --workers=2`                               | 111 passed; two expected non-Chromium skips for the Chromium-only layout-shift sample                                                                       |
| `pnpm exec playwright test tests/e2e/clinic-home.spec.ts --workers=2` | Final settled-state capture follow-up: six passed across Chromium, Firefox and WebKit                                                                       |
| `pnpm build`                                                          | Passed: eight static HTML pages, robots endpoint and 24 optimized image variants; demo profile                                                              |
| `pnpm verify:seo`                                                     | Passed: demo policy, authored-production exclusions, eligible isolated fixture, reciprocal metadata/sitemap/JSON-LD and four rejected unsafe configurations |
| `pnpm measure:seo`                                                    | Passed: three final Lighthouse reports and mobile screenshots                                                                                               |
| `node scripts/verify-clinic-fonts.mjs`                                | Passed: original Noto cmap coverage for Russian and required Kazakh letters in both cases                                                                   |

The full browser run covers all three registered themes and existing generic compositions, both homepage locales, language switching, JavaScript-disabled content and menu fallback, keyboard interaction, contrast and axe WCAG-tagged checks at 320px/1440px in Chromium/Firefox. Homepage scenarios run in Chromium/Firefox/WebKit at 320/390/768/1024/1440px, plus 320x568 and 200% root text at 640px. No horizontal overflow was observed. Floating controls remain visible, reserve room for the footer, and open the correct native demo disclosure. Header stickiness/shadow state, reduced-motion timing, closed-menu visibility, four price modes, missing payment/contact safety and every fragment target are asserted.

The first full run passed 110 tests but recorded CLS 0.0121, exceeding the older 0.01 browser threshold. A trace identified the desktop business sentence changing from one line to two when Noto loaded. Giving it an intentional second line corrected the shift; the full rerun passed with CLS 0.0016. The threshold was not weakened. Visual review also shortened mobile hero copy, removed repetitive hero checklists, changed decimal/code price output to readable whole-tenge symbols, and recaptured the menu only after its closing animation completed.

### Lighthouse conditions and results

Windows, Node 24.22.0, pnpm 12.18.0, Astro 7.4.8, Lighthouse 13.6.0 and Chromium 158.0.8127.18. The existing runner serves the verified eligible production fixture locally without compression and with no-store headers. Default mobile simulation: 412x823, DPR 1.75, 150ms RTT, 1,638.4 Kbps throughput and 4x CPU slowdown. Each final value is one sample, not a median or field measurement. The actual demo remains noindexed; the SEO score below belongs to the eligible fixture, not a claim that fictional content should be indexed.

| Route                                         | Performance | Accessibility | Best practices | SEO | LCP    | CLS    | TBT |
| --------------------------------------------- | ----------- | ------------- | -------------- | --- | ------ | ------ | --- |
| `/ru/`                                        | 98          | 100           | 100            | 100 | 2.255s | 0.0009 | 0ms |
| `/kk/`                                        | 98          | 100           | 100            | 100 | 2.404s | 0.0021 | 0ms |
| `/ru/services/` (inherited regression sample) | 99          | 100           | 100            | 100 | 2.104s | 0.0034 | 0ms |

The homepage samples meet the milestone's Performance/Accessibility/LCP/CLS targets. Compared with the archived 07A samples (99 Performance, roughly 2.11s LCP), the added business content retains strong performance with a small single-run score/LCP difference. This is not a controlled causal comparison. Remaining lab findings include render-blocking CSS, document compression/cache configuration and small font/layout changes. Configure actual hosting and remeasure real client assets. TBT is not INP; field Core Web Vitals are not established.

Detailed machine-readable settings, reports and screenshots are in `test-results/seo-measurements/`; verification fixtures are in `test-results/seo-builds/`. Those directories are replaced by subsequent test/measurement runs and must never be deployed.

### Before/after visual comparison

| View            | Previous 07A                               | Redesigned 07A.2                        |
| --------------- | ------------------------------------------ | --------------------------------------- |
| Russian desktop | [Before](./screenshots/07a-ru-desktop.png) | [After](./screenshots/07a2-ru-1440.png) |
| Russian mobile  | [Before](./screenshots/07a-ru-mobile.png)  | [After](./screenshots/07a2-ru-390.png)  |
| Kazakh desktop  | [Before](./screenshots/07a-kk-desktop.png) | [After](./screenshots/07a2-kk-1440.png) |
| Kazakh mobile   | [Before](./screenshots/07a-kk-mobile.png)  | [After](./screenshots/07a2-kk-390.png)  |

Actual final renders were reviewed for hierarchy, type size/contrast, image crops, section rhythm and mobile navigation/contact placement. Additional reviewed captures:

- [Desktop first screen](./screenshots/07a2-ru-1440-hero.png)
- [Russian mobile first screen](./screenshots/07a2-ru-390-hero.png)
- [Kazakh mobile first screen](./screenshots/07a2-kk-390-hero.png)
- [Open mobile menu](./screenshots/07a2-ru-menu-open.png)
- [Direct hygiene discovery and pricing](./screenshots/07a2-ru-pricing.png)
- [Russian contact explanation](./screenshots/07a2-ru-contact-open.png)
- [Kazakh contact explanation](./screenshots/07a2-kk-contact-open.png)

The before/after review shows a change from atmosphere-led editorial presentation to explicit service/price comparison, balanced practitioner profiles, practical preparation information and visible contact choices. No measured conversion-rate improvement is claimed. The user's existing development server on 4321 was left running; owned review servers used separate ports. Harmless NO_COLOR/FORCE_COLOR warnings remain environmental.

## Remaining limits before 07B

- All prices, the offer and hours remain illustrative. Verified prices, offer terms and schedules must replace them for a real business.
- Real telephone/messenger destinations, address/directions, review sources, licensing evidence, practitioner facts and payment arrangements are absent. They must be supplied and checked before enabling real actions or claims.
- Inner clinic pages remain deferred. The inherited services starter examples remain unlinked and are not completed clinic pages.
- Kazakh copy is complete but should receive native editorial review before a real client launch.
- No live booking, messaging integration, payments, analytics, CMS, medical advice workflow or production deployment was added.
- Automated browser/axe/synthetic performance checks do not constitute a manual screen-reader audit, real-device Safari test, measured user conversion study or field Core Web Vitals evidence.

For 07B, implement the localized services/detail/about/specialists/contact routes using the established normalized boundary, replace the inherited examples, and connect only verified business data. Preserve demo noindex until real content and a production origin are deliberately approved. Never deploy SEO verification fixtures.
