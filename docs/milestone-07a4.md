# SAYA QAM · Milestone 07A.4

The existing Russian/Kazakh single-page clinic demo keeps its sage palette, Noto fonts, generated photography, static Astro rendering and route structure. No package, generic rendering framework, backend, vendor integration or deployment was added. Foundation-1 was inspected read-only.

## P0: contact and booking

- A persistent two-row header combines the slim demo notice, example phone, language links and illustrative opening status above the wordmark/navigation/booking row. Desktop includes WhatsApp; mobile retains the existing safe-area-aware FloatingContact. It hides while contacts are visible, and footer clearance is reserved.
- WhatsApp, calls, urgent messages and map controls show localized demo previews. All eight service CTAs, doctor CTAs, the hero and promotion open a contextual callback dialog. The inline contact form and dialog require a name, valid Kazakhstan mobile format and consent. Submission stays in the browser, clears the fields, and explicitly confirms that nothing was sent or saved.
- Native dialogs have labelled headings, modal semantics, an explicit Tab/Shift+Tab loop, Escape dismissal and trigger-focus restoration. Consent opens the same legal dialog from the form and footer.
- All service tiles target their matching prices. Reduced motion disables smooth scrolling; targeted prices receive a visible highlight. On small phones discovery uses full-width tiles to preserve whole words in both languages.
- All eight prices now use one existing PriceList card system. BusinessActionLink, PriceDisplay/PriceList, Header, BusinessHours, Promotion and FloatingContact retain their existing contracts and business-data verification gates.

## P1: decision support

- Fictional doctors have individually labelled illustrative experience, specialties, languages and expandable education examples, plus contextual booking. Mobile cards scroll and snap with keyboard Home/End/arrow controls; desktop retains two columns.
- A rating placeholder has no numeric rating. Three individually labelled review examples remain available in a mobile scroll region and a desktop grid. Four explicitly illustrative safety statements accompany the trust content.
- Text-only Kaspi/Halyk installment examples and explanatory captions appear near pricing and the promotion. No verified payment option or partnership was fabricated.
- Added insurance guidance/FAQ, a compact three-step children's visit, urgent WhatsApp entry points, example promotion validity/conditions, legal placeholders and local privacy/consent dialogs.
- Hours use `Intl` with `Asia/Almaty`, including weekday, Saturday and Sunday boundaries. Initial text reserves space before the client calculation. Maps remain previews in demo mode; non-demo map defaults are city searches, since no clinic address exists.

## P2: presentation and behavior

- Consistent price cards, page-grid FAQ alignment, token-based styles, larger touch targets, compact mobile steps and mobile doctor/review scrolling reduce repetition and vertical space. The main contact form action has a high-contrast on-palette treatment.
- Optimized WebP/srcset images retain dimensions, AI labels, lazy loading below the fold and eager/high-priority hero loading. Media adds an optional encoding-quality override; only the hero uses 70. This follows the first Kazakh LCP sample of 2.557s (RU 2.407s). The installed Astro 7.4.8 image types/service were inspected before using the option. Photography, crop and dimensions are unchanged.
- Existing dynamic document language, localized titles/descriptions and demo noindex remain. Language switching preserves the section and its viewport offset; the selected language is stored with guarded storage access. There is no browser-language redirect.
- FAQPage JSON-LD uses the same five localized FAQ entries. Business JSON-LD additionally requires `DEMO_MODE=false`; the existing indexability and verified-business gates still apply. Flipping the flag alone does not make fictional business facts verified.
- `track(eventName, params)` is a demo no-op. Non-demo events dispatch locally for a future reviewed subscriber; no scripts, cookies, requests, patient names or entered phone numbers are sent. Booking, WhatsApp, call, urgent, callback, FAQ, price navigation and language events are covered.
- Arial fallback metrics were calculated from installed Arial and the original Noto TrueType advances for the bilingual hero/navigation and `Әә ҒғҚқ Ңң Өө Ұұ Үү Һһ Ії` sample. Body size adjustment is 104.0147%; display is 98.8725%, with Noto ascent/descent overrides and zero line gap. This reduces metric changes; it does not guarantee identical wrapping on every OS. Noto retains `font-display: swap`.

## Defaults for owner confirmation

All are examples, not an offer or evidence of an operating clinic. The shared numeric/contact/schedule source is `src/config/clinic.ts`; bilingual copy remains in the typed existing content pattern.

| Item              | Illustrative default                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Phone             | +7 (700) 000-00-00                                                                                                      |
| Implant treatment | From 180,000 ₸                                                                                                          |
| Orthodontics      | From 250,000 ₸; no unit/arch/package scope is asserted                                                                  |
| Children's visit  | From 12,000 ₸                                                                                                           |
| Other prices      | Hygiene 18,000; treatment from 22,000; crowns 85,000–120,000; extraction from 15,000; consultation 5,000 ₸              |
| Promotion         | 20,000 ₸; example validity through 31 December 2026; adults, consultation plus hygiene, extra procedures excluded       |
| Schedule          | Mon–Fri 09:00–20:00, Sat 10:00–16:00, Sun closed; Asia/Almaty                                                           |
| Experience        | Aida 8 years; Daniyar 11 years; both explicitly examples                                                                |
| Location/legal    | Almaty is illustrative; no street or licence number; fictional legal entity; BIN 000000000000 is a labelled placeholder |

The callback stays local even when real contact links are enabled; no callback transport exists. The optional installment arithmetic and optional desktop floating WhatsApp control were omitted.

## Verification

Verification date: 12 November 2026. The final full browser run passed 126 tests with two expected non-Chromium measurement skips. Intermediate failures were corrected: Kazakh safety text at 200% enlargement, footer reservation when floating controls return, dialog keyboard boundaries, and regression assertions for the newly required forms/prices/FAQ schema. Browser access required an approved run outside the localhost socket restriction.

| Executed check                                               | Result                                                                                                                                                         |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm astro check                                             | 114 files; zero errors, warnings or hints                                                                                                                      |
| pnpm lint                                                    | Passed                                                                                                                                                         |
| pnpm test                                                    | 42 tests passed in eight files, including DEMO_MODE=false dummy contact actions                                                                                |
| pnpm exec playwright test --workers=2                        | 126 passed; two expected Chromium-only-measurement skips                                                                                                       |
| Final clinic/SEO browser follow-up after encoding adjustment | 29 passed across the configured engines                                                                                                                        |
| Final mask keyboard editing follow-up                        | 15 passed, including Backspace across inserted punctuation                                                                                                     |
| Production build through Playwright webServer                | Passed; eight static pages; original demo output policy                                                                                                        |
| pnpm verify:seo                                              | Passed: demo, authored exclusions, isolated eligible fixture, unsafe configuration rejection                                                                   |
| Font verification                                            | Original cmap script passed; direct installed fontkitten 1.0.3 checks found no missing glyphs in either shipped WOFF2 or Arial for the requested Kazakh sample |
| Scoped Prettier check                                        | All changed implementation/test/report files passed                                                                                                            |
| pnpm format:check                                            | Fails only on the unchanged supplied 07A.3 and 07A.4 specifications                                                                                            |

Chromium, Firefox and Playwright WebKit cover the clinic actions, nested legal dialogs, explicit focus trap, Escape/focus return, carousels, contextual booking and preserved-section language switching. Existing no-JavaScript, text enlargement, reduced-motion, theme and routing tests pass. Chromium/Firefox axe checks report no WCAG-tagged violations on both homepages at 320px and 1440px.

Final screenshots: [RU mobile](./screenshots/07a4-p2-ru-390.png), [KK mobile](./screenshots/07a4-p2-kk-390.png), [RU desktop](./screenshots/07a4-p2-ru-1440.png), [KK desktop](./screenshots/07a4-p2-kk-1440.png). The same capture suite covers 320, 360, 390, 768, 1024 and 1440 pixels; the final P2 captures supersede intermediate phase images. Lazy images and carousel positions are settled before captures.

## Final mobile Lighthouse sample

Lighthouse 13.6.0 / Chromium 158.0.8127.18 on Windows. One run per route on the isolated eligible production fixture, served locally without compression and with no-store headers. Mobile simulation: 412×823, DPR 1.75, 150ms RTT, 1,638.4 Kbps throughput and 4× CPU slowdown. The actual demo remains noindexed. Scores are lab samples, not field Core Web Vitals or a conversion study.

| Route                                       | Performance | Accessibility | Best practices | SEO |    LCP |     CLS |  TBT |
| ------------------------------------------- | ----------: | ------------: | -------------: | --: | -----: | ------: | ---: |
| /ru/                                        |          97 |           100 |            100 | 100 | 2.408s | 0.00147 | 40ms |
| /kk/                                        |          97 |           100 |            100 | 100 | 2.411s | 0.00095 |  0ms |
| /ru/services/ (inherited regression sample) |          98 |           100 |            100 | 100 | 2.257s | 0.00046 |  0ms |

Both homepage samples meet LCP ≤2.5s, CLS ≤0.1 and Accessibility ≥95. Lighthouse console audits pass. The selected hero image transfers 28,403 bytes in both homepage samples; the page uses about 35KB of uncompressed JavaScript including the existing shared runtime. Actual hosting compression/cache configuration still needs verification. The first pre-adjustment Kazakh LCP sample was 2.557s; the hero encoding change was followed by 29 passing clinic/SEO browser checks and a further 15 passing keyboard/mask checks before rebuilding fixtures and remeasuring. This is not a controlled benchmark or a guarantee across runs.

Machine reports, complete settings and resource details: [measurement summary](../test-results/seo-measurements/summary.json), [RU report](../test-results/seo-measurements/ru.html), [KK report](../test-results/seo-measurements/kk.html). These and the SEO fixtures are generated test artifacts, can be replaced by future tests, and must never be deployed.

## Limits and follow-up

- The 10–11 mobile screen aim is only partially achieved. At 390×844, final captures measure 11,625px RU and 11,843px KK (about 14 viewports). The intermediate RU P1 capture was 13,340px; polish reduces it by about 13%. Required extra content and readable text leave a longer page. No content was removed to meet an arbitrary height.
- Kazakh medical, insurance, booking and legal wording needs the review listed in [kk-review-needed.md](./kk-review-needed.md). No native editorial or legal approval is claimed.
- Real contact details, address, staff/education facts, price inclusions, financing agreements, legal documents and review sources require client verification. Real submission, new pages, vendor analytics and deployment remain outside this milestone.
- Automated axe, keyboard/browser checks and synthetic Lighthouse do not constitute a manual screen-reader audit, field Core Web Vitals or a real-device Safari test.
- This directory is not a Git checkout (`git status` reports no repository), so the requested incremental commits cannot be created. P1/P2 refinements received combined final verification rather than separately committed releases.
- Repository-wide formatting already flags the supplied 07A.3 and 07A.4 specs. Their authored text was left intact; implementation and report formatting are checked separately.
