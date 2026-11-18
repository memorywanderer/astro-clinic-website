# Milestone 07A.5 — website final polish

Date: 13 November 2026. Scope: dental-clinic-demo only. The supplied specification's internal 07A.4 heading is a naming inconsistency; this report covers `specs/07A.5-website-final-polish.md` and the user's additions. The screenshot references informed structure only. No business identity, rating or legal details were copied. `skills/frontend-design/skill.md` was read and applied. No new dependency, framework, backend, deployment or change to foundation-1.

## Design and implementation

Keep the existing pine #153f3b, sage #dcece5, background #fafbfa, white #ffffff and foreground #202d2b. Reuse the existing lavender #c8bdd8 through the semantic `--highlight` token for service icons, process markers, example labels and the featured promotion. Components do not embed palette literals. Existing self-hosted Noto Sans and Noto Sans Display, responsive type and optimized images remain.

The layout keeps left-aligned content, a photographic split Hero and varied section densities. The design review rejected adding another row of generic trust cards or invented statistics. The strongest accent belongs to the offer; the surrounding evidence and contact areas remain quiet.

```text
Desktop: contacts | sticky brand / navigation / RU–KK / action
         Hero text + indicators | family photograph
         service discovery -> prices -> About + evidence
         vertical profiles in native track
         reputation | documents; instructional/source review cards
         four process steps -> offer | payment -> FAQ
         contacts + schedule | activated public sample map
         brand | contacts | hours
         clinic | services | documents

Mobile:  compact brand + icon menu; language + action
         stacked content; equal service cards
         one specialist + part of next; review track
         vertical process; featured offer; contacts then map
         footer brand/contacts first, grouped links below
```

- Header business contacts have clock, WhatsApp and telephone icons. The information strip scrolls away naturally, leaving a stable sticky navigation shell. At intermediate widths navigation gets its own row. The mobile menu has an icon with a localized accessible name and no visible “Меню” label. RU/KK options have fixed equal 44px dimensions and accessible names containing their visible abbreviations. Padding is symmetric for buttons and links.
- Hero anchors reach `#reviews`, `#credentials` and `#payment`, with sticky-header clearance. The locally served official 2GIS icon identifies the platform; no numerical rating or stars imply nonexistent reviews. Licensing and installments remain explicitly unconfirmed.
- Discovery tiles use equal grid rows and natural word wrapping. All eight links reach their matching PriceList items. Existing PriceDisplay/PriceList contracts and localized illustrative prices remain.
- About explains planning, estimates, questions and document-dependent procedures as concept principles. The licensing destination has a stable ID; no license number, technology claim or guarantee is invented.
- Two fictional specialists remain, without fabricated experience or education. Their vertical cards have consistent portraits, compact specialisms and aligned contact actions. Native snapping tracks reveal the next card on mobile, hide only the visual scrollbar and support Arrow/Home/End plus normal Tab navigation. No extra profiles were invented to fill desktop space.
- Reviews reuse ReviewSummary/Credentials verification gates. The demo contains three unmistakably instructional cards with no authors, ratings, dates or real-review links. An optional typed selected-review input supports verified author/text, optional rating and a validated original-source action. Client verification and permission to reuse are required before supplying it.
- Child Visit, the generic trust introduction and callback forms/controller are removed. Four concise “How we work” steps replace First Visit. Obsolete testimonial names and legal-identifier placeholders were removed from the polish dictionary.
- Promotions use the shared Promotion contract and an actual `endsAt` value. The current single illustrative offer is featured in lavender and links to its visible conditions. Optional authored lists filter by validity and enable a native horizontal rail only when more than one current offer exists. No bank identities, redeemable discounts or additional offers were invented. Static expiry handling requires rebuilding.
- Contacts use the existing shared contact-action resolver. The demo exposes no live `tel:`, `wa.me` or fictional email destinations. Contact previews open a short disclosure; booking actions reach the contact section. FloatingContact remains one persistent group on desktop and mobile, with safe-area spacing and a footer reservation.
- ClinicFooter separates brand, contact/location explanation, hours, clinic navigation, service deep links and document/demo-data information. It does not add branches, social accounts, legal entities, BINs or nonexistent documents. The demo privacy explanation also remains readable without JavaScript.

## 2GIS solution and replacement

The [official Map Constructor](https://docs.2gis.com/en/maps/others/map-constructor/overview) supplies a keyless iframe approach. The embedded payload follows its published example format. The sample point is the public Panfilov park in Almaty, at latitude 43.25972 / longitude 76.95472, checked against [Kazakhstan.travel](https://kazakhstan.travel/ru/attractions/402). The coordinate link follows the [official 2GIS arbitrary-point link format](https://help.2gis.ru/question/razrabotchikam-zapusk-ideystviya-vmobilnom-prilozhenii-cherez-deeplink). These coordinates are never assigned to the clinic.

`src/config/clinic-map.ts` owns the sample iframe and external URL. `ClinicMap.astro` creates the iframe only after activation, supplies a localized title, reserves 320px of height, and leaves disclosure/address text plus the external link outside the iframe. No SDK or vendor script loads with the initial page. The local platform icon came from the official 2GIS site's `https://d-assets.2gis.ru/favicon.png` asset; no remote icon request is needed.

For a real clinic: verify its address; generate a new iframe in the official constructor; replace the embed and external URL together; replace the localized map name/address/disclosure; populate verified BusinessLocation independently; retest privacy, frame loading and directions. Do not remove the public-sample disclosure while retaining sample coordinates.

Live Chromium verification loaded six tiles on desktop and four on 320px, with no failed map requests observed. The zoom-in link was clicked successfully at 320px. Initial-page tests assert zero 2GIS requests before activation; blocked-frame tests retain the external link and disclosure. The iframe adds third-party traffic only after activation and is excluded from initial Lighthouse measurements. Third-party transfer/performance after interaction was not benchmarked.

The external 2GIS page returned HTTP 200 with a CAPTCHA in this environment. The link's documented coordinate format is verified; end-to-end directions beyond that challenge are not claimed. The CAPTCHA was not bypassed. Widget-internal language and accessibility are controlled by 2GIS, and its cross-origin internals were not included in the page axe audit.

## Visual and functional review

Actual RU and KK browser screenshots were reviewed at 320, 390, 768, 1024 and 1440px. Full-page, expanded/compact Header, Hero, service discovery, specialist track, reviews, promotions, contacts and Footer captures are under `docs/screenshots/07a5-*`. Native tracks are reset before captures; lazy media is decoded. The existing Astro development toolbar is hidden for manual screenshots only.

- [RU desktop full page](./screenshots/07a5-ru-1440.png), [KK mobile full page](./screenshots/07a5-kk-390.png).
- [320px Header and Hero](./screenshots/07a5-ru-320-hero.png), [compact desktop Header](./screenshots/07a5-ru-1440-compact.png).
- [Discovery grid](./screenshots/07a5-ru-1440-treatments.png), [mobile specialist track](./screenshots/07a5-ru-390-team.png).
- [Reputation](./screenshots/07a5-ru-1440-reviews.png), [promotion](./screenshots/07a5-kk-1440-promotions.png).
- [Contacts before map activation](./screenshots/07a5-ru-1440-contact.png), [loaded public sample](./screenshots/07a5-map-live.png), [320px map zoom](./screenshots/07a5-map-320-zoom.png).
- [Desktop Footer](./screenshots/07a5-ru-1440-footer.png), [mobile Footer](./screenshots/07a5-kk-320-footer.png).

The first screenshot pass exposed a mobile menu overlapping the booking action: an earlier `display: contents` override bypassed the intended grid. Restoring flex layout fixed it. All ten locale/width combinations then had document scroll width equal to viewport width and no unintended overflow. Native rails intentionally overflow within their own regions. Long Kazakh labels remain readable, and the 200% text checks pass. Review cards have consistent surface/border treatment; promotional color is distinct from sage sections.

The separate [200% text screenshot](./screenshots/07a5-kk-200pct.png) caught an additional defect that overflow checks missed: a constrained header could wrap its brand and action letter by letter. Intrinsic flex wrapping now moves complete controls to another row. Floating contacts wrap their icon/text groups while preserving whole words. The enlarged-text browser test also measures label line counts, so a tall column of single letters cannot pass merely by fitting within the viewport.

Keyboard tests cover modal close/focus restoration, menu Escape and collapse, region Arrow/Home/End, Tab reachability, language switching and native anchors. Source and demo-integrity assertions check absence of forms, Child Visit, generic trust, fictional destinations and business structured data. Sticky anchors are measured against the header bottom. Axe checks run at 320px/1440px in Chromium and Firefox; WebKit covers clinic interaction and motion regressions. These are not screen-reader certification or physical-device testing.

## Executed checks

The complete suite passed before the last label/reflow refinements; the final affected-area follow-up then passed on the finished implementation. SEO fixtures were rebuilt after the last browser run, and Lighthouse ran afterward. No verification fixture was deployed.

| Executed check                                       | Result                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------- |
| pnpm astro check                                     | 120 files, zero errors, warnings or hints                            |
| pnpm lint                                            | Passed                                                               |
| pnpm test                                            | 42 passed in eight files                                             |
| pnpm build (Playwright webServer)                    | Passed; eight static pages                                           |
| pnpm exec playwright test --workers=2                | Full suite: 132 passed; two expected Chromium-only measurement skips |
| Final clinic, localization and SEO browser follow-up | 51 passed across configured Chromium, Firefox and WebKit projects    |
| pnpm verify:seo (after final browser run)            | Passed all four deployment/SEO checks                                |
| pnpm measure:seo (after final verify:seo)            | Passed; final samples below                                          |
| Changed-file Prettier check                          | Passed                                                               |
| pnpm format:check                                    | Fails only on the three unchanged supplied specifications            |

### Final mobile Lighthouse sample

Lighthouse 13.6.0; one run per route; isolated eligible production fixture on local uncompressed/no-store hosting. Mobile simulation: 412×823, DPR 1.75, 150ms RTT, 1,638.4Kbps throughput and 4× CPU slowdown. The real demo remains noindexed. The two homepage samples meet Performance ≥90, Accessibility ≥95, LCP ≤2.5s and CLS ≤0.1.

| Route                                       | Performance | Accessibility | Best practices | SEO |    LCP |     CLS |    TBT |
| ------------------------------------------- | ----------: | ------------: | -------------: | --: | -----: | ------: | -----: |
| /ru/                                        |         100 |           100 |            100 | 100 | 1.509s | 0.00088 | 47.5ms |
| /kk/                                        |         100 |           100 |            100 | 100 | 1.507s | 0.00117 |    0ms |
| /ru/services/ (inherited regression sample) |          99 |           100 |            100 | 100 | 2.108s | 0.00046 |    0ms |

Both final homepage label-in-name audits pass after including РУ/ҚҚ in accessible names. The initial pages make zero third-party requests. JavaScript transfers about 24KB per homepage; the map remains unloaded until activation. Single-run variation was visible in earlier samples (homepage LCP around 2.41s); these results are not field Core Web Vitals or a performance guarantee.

Machine evidence: [measurement summary](../test-results/seo-measurements/summary.json), [RU Lighthouse](../test-results/seo-measurements/ru.html), [KK Lighthouse](../test-results/seo-measurements/kk.html). Generated test artifacts may be reset by future browser tests; none are deployment artifacts.

Repository-wide formatting flags the unchanged supplied 07A.3, 07A.4 and 07A.5 specification files. Their authored content was left intact. Changed-file formatting is checked separately. The initial browser run's stale Footer selector and Firefox subpixel equality failures were corrected. One subsequent sandbox preview startup stalled and was stopped; the successful runs used permitted localhost access. Existing user server on 4321 was left running.

## Limitations and next phase

This remains a fictional noindexed demonstration. Real contacts, location, documents, review permissions, staff facts, financing, prices and offer conditions require client verification. Kazakh medical/legal wording needs a native editor; see `kk-review-needed.md`. Current content has one offer, so the multi-offer native layout is supported but no additional offer is exposed as a real promotion. No booking backend, review scraping, payment integration, new pages or deployment is included.

Automated audits and single Lighthouse samples do not establish field Core Web Vitals, legal compliance or WCAG certification. Hosting compression/cache policies still need production verification. Third-party maps can change or be blocked; the static fallback is intentional. This directory has no Git metadata, so no commits or Git diff can be supplied.

The composition is ready for planning 07B. Production publication remains dependent on verified business data and the existing SEO policy. Reusable findings are separately recorded in `starter-feedback.md` and the architectural decision in `decisions.md`; foundation-1 was not changed.
