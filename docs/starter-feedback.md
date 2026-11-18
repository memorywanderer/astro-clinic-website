# Starter validation: SAYA QAM

## Milestone 07A.5 — final business presentation

Changes remain local to dental-clinic-demo. The original foundation-1 starter was inspected read-only and was not modified.

- **Short language labels need matching accessible names.** A full language name alone did not include the visible РУ/ҚҚ abbreviation in Lighthouse's label-in-name audit. The demo's LanguageSwitcher now uses both, while retaining native route links and fixed equal option widths. Consider this small accessibility change independently upstream.
- **Layout overrides must account for `display: contents`.** The earlier mobile Header made its action wrapper transparent to grid layout. Moving the language control into the sticky header required restoring that wrapper's flex layout; changing grid positions alone left the menu over the booking action. Real 320px screenshots caught this before completion.
- **No overflow is not proof of readable reflow.** A 640px screenshot with 200% root text exposed letter-by-letter brand/action wrapping even though document width passed. Intrinsic flex wrapping and normal word boundaries now keep Header and floating actions readable. A browser assertion limits header labels to two lines at that enlargement; inspect screenshots in addition to measuring scroll width.
- **Footer slots have a real structural boundary.** The shared Footer can group navigation, but its brand/contact upper region and navigation share one grid. A local ClinicFooter gives the requested upper contact/hours region, three lower groups and a legal baseline without a universal configuration API. A new slot should be considered only with a second concrete consumer.
- **Native rails do not need a carousel framework.** Vertical profiles use one overflow region, scroll snap, focusable region and Arrow/Home/End support. Mobile cards occupy 65% of the track. Promotion lists use the existing validity contract, render one offer as a featured card and enable a native rail only for multiple current offers.
- **Reputation presentation must preserve evidence gates.** ReviewSummary and Credentials remain unchanged. A small site-level selected-review contract requires verified provenance and a source link. The empty demo shows instructional cards without patient identities, stars or fabricated testimonials. Unverified financing receives no bank branding.
- **A demonstration map is not business address data.** The public park example is configured separately from BusinessLocation. Its official constructor iframe is created only after user activation. The page keeps a localized public-place disclosure and native external link when scripts or the iframe fail. A working map must never promote a sample coordinate into fictional business schema.
- **Remove obsolete interaction payloads with removed UI.** Callback markup/controller code and unused testimonial/legal-placeholder copy were removed; homepage JavaScript transfers about 24KB in the final fixture sample, without a new package or hydration framework.

See [milestone-07a5.md](./milestone-07a5.md) for visual evidence, executed checks, map replacement and remaining limitations. These are candidates for separate starter review, not automatic upstream changes.

## Milestone 07A.4 — scoped UI/UX polish

- The existing PriceList `cards` variant accommodates all eight prices consistently. ClinicPricing no longer needs differently structured featured items; individual deep links remain intact.
- Media gains an optional numeric quality override using the installed Astro 7.4.8 Image contract. Only the clinic hero chooses 70 after the first Kazakh mobile LCP sample exceeded 2.5s. Existing callers retain the image service default; no photo, crop or responsive-width contract changes.
- Native modal dialog behavior can still send focus to browser chrome at a Tab boundary. A site-local explicit Tab loop complements native modal/Escape behavior and restores focus after nested legal dialogs.
- FloatingContact remains the only fixed contact group. Visibility suppression preserves measurement, and a conservative mobile footer reservation covers viewport changes before its observer settles. Long Kazakh copy at 200% text size needs intrinsic column sizing.
- Payment, reviews, credentials and location examples remain local illustrative compositions. Shared verified-data gates were not weakened to fill layouts.
- FAQPage uses visible localized FAQ content on the noindexed demo. Business schema additionally requires the site demo flag to be off and the existing verified/indexable policy. Tests distinguish these schema types rather than prohibiting all JSON-LD.
- The new local actions, forms, legal copy and mobile carousels did not justify another generic framework, hydration package or state store.

See [milestone-07a4.md](./milestone-07a4.md) for results and remaining limits.

## Milestone 07A.3 — final UX polish

The RU and KK homepages use a normal-flow information strip above a sticky navigation row. The existing sentinel controls the shadow. Keeping the strip outside the sticky element gives anchors a stable target offset and avoids measuring the header on scroll. The longer Kazakh navigation exposed a font-swap wrap at intermediate desktop widths. Test both the fallback and loaded fonts when composing a compact business header.

- **Contact actions.** The shared resolver and one FloatingContact instance serve both viewports. The phone and WhatsApp fallbacks point to visible demo text. Configured destinations render directly. A local footer reservation covers the fixed controls while they are being measured.
- **Service navigation.** An optional item ID prefix on the demo copy of PriceList lets discovery tiles target individual prices. Existing callers retain their original markup. This is a small candidate for the starter when another site needs deep links.
- **Language switcher.** A short visible label and a full accessible language name fit the segmented control while preserving native links and equivalent-route switching.
- **Trust and directions.** ReviewSummary, Credentials, PaymentOptions and LocationDetails retain their business-data gates. The Hero links to verification and financing information. An explicitly illustrative local map occupies the empty location state without making a third-party request or inventing a pin.

## Milestone 07A.2 — commercial redesign

The current homepage targets an approachable mid-range family clinic. The older 07A findings below are retained as a record of the premium concept. See [milestone-07a2.md](./milestone-07a2.md) for the current design and verification report.

### Actual Phase 06.1 reuse

Read-only inspection of foundation-1 supplied the actual contracts and implementations. Selected files were copied into this demo; foundation-1 was not changed.

| Capability                          | Reuse and local integration                                                                                                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header                              | Copied the additive announcement/contact/social slots and parser-time menu preparation with native fallback. Site CSS supplies the sticky shell, segmented native language links, pill navigation and animated menu icon.      |
| BusinessActionLink / ContactActions | Copied together with action-control.css and the compatible ButtonRoot extraction. All contact destinations resolve through the shared ContactInfo and action helper. No parallel URL resolver.                                 |
| FloatingContact                     | One mobile bar with message/call actions, safe-area padding, measured footer reservation and text enlargement support. Unconfigured destinations open explicitly labeled demo disclosures; they never produce tel/wa.me links. |
| PriceDisplay / PriceList            | Featured hygiene/children's-care cards plus compact rows. Four price modes use the actual numeric Price contract, Intl formatting and localized labels. Every amount is an illustrative fixture.                               |
| AnnouncementBar / Promotion         | One linked illustrative family-prevention offer, without countdowns, fake availability or an invented expiry.                                                                                                                  |
| PaymentOptions                      | Empty verified-method input is intentionally omitted by the component. Local payment guidance remains visible; no bank logos, Kaspi partnership, eligibility or installment terms are invented.                                |
| ReviewSummary                       | Link-only mode explicitly names the 2GIS platform homepage, not a clinic listing. No numeric snapshot, fabricated review count, credentials or review schema.                                                                  |
| LocationDetails / BusinessHours     | LocationDetails is ready for optional normalized location data and omitted when absent. A local fallback explains that the address/directions are unavailable; BusinessHours displays an explicitly illustrative schedule.     |
| Existing static blocks              | Hero split, About split/start, FAQ accordion, Footer multiColumn, Container, Card, SectionHeading, Media and existing motion remain in use.                                                                                    |

Credentials and SocialLinks were deliberately not copied or displayed: no verified credential or clinic account exists. The site-specific specialist presentation remains separate from generic Features/Testimonial schemas.

### Concrete findings and tradeoffs

1. **The Phase 06.1 Header directly addresses the old initialization gap.** Its inline native preparation prevents the deferred collapse and preserves a working toggle if modules fail. The earlier 07A scripting-based reserved-row workaround is removed. Local scripting-aware CSS only selects dropdown positioning versus the JavaScript-disabled in-flow menu; sticky positioning is disabled for the expanded no-JavaScript mobile layout. Hosting CSP must allow the copied inline preparation.
2. **Sticky and floating behavior remain independent.** A small site-local IntersectionObserver fades the header shadow; it does not change header height or install a scroll listener. Existing motion tokens/reduced-motion guards apply. The original FloatingContact owns its measurement and safe-area behavior. No second fixed contact overlay or framework island was introduced.
3. **Services has no per-item pricing/action slot.** Rather than add dentistry or one-off fields to ServiceItem, local ClinicPricing composes existing Card, PriceDisplay and PriceList. ServiceDiscovery is a local semantic navigation list. The generic Services block and all its existing callers remain unchanged.
4. **Price formatting needed an actual display choice.** The copied formatPrice adds an optional fourth argument for Intl currencyDisplay/maximumFractionDigits. Existing three-argument behavior stays unchanged. This site chooses whole-tenge narrow-symbol output, while numeric values and four typed price modes remain intact. This is a local, evidence-based candidate for upstream review, not an automatic starter change.
5. **A real empty state differs from a fake business fact.** PaymentOptions correctly suppresses unverified methods; LocationDetails correctly needs an address. Local explanatory compositions handle absent data instead of marking invented methods verified or putting placeholder text into an address field. Do not weaken those source verification contracts to fill a layout.
6. **Two specialist profiles need a balanced two-card layout.** The old empty text column is removed. The section-level fictional disclosure replaces repeated quotation/disclaimer text inside every card. No experience, credentials or achievements were invented.
7. **Font swaps can change compact business-header wrapping.** A diagnostic trace identified the desktop context sentence switching from one line to two and shifting the header/navigation. Reserving its intended second line stabilizes the layout without fixing text heights or shrinking labels. A small real-content typography check is more useful than only testing empty optional slots.
8. **The existing browser ports can collide with a user's server.** This run found an existing dev process on 4321 and left it untouched. The test preview/dev servers now use 4325/4326; isolated manual review uses 4323. Hardcoded test URLs remain a possible starter improvement, not a reason to replace the user's process.
9. **Structural overrides still need care.** Header grid areas, price-row alignment and specialist crops remain in site-scoped clinic.css. PriceDisplay exposes data-price-kind rather than a price-display class; styling uses the actual rendered contract. A future lightweight class/slot API may help if another real site needs the same overrides; no styling engine was added.

The typed homepage boundary resolves business actions, prices and media before rendering. Shared contact source fields and validation are extended compatibly from Phase 06.1. Generic pricing/disclosure labels live in the existing Russian/Kazakh dictionaries. The root/page routing, static rendering and demo indexing policy are preserved. Remaining 07B pages are not implemented.

## Archived Milestone 07A findings

Scope: SAYA QAM identity and bilingual homepage only. All changes are local to dental-clinic-demo. No changes were made to foundation-1, and no deployment was performed.

## Reuse assessment

| Existing component                     | Use in this homepage                                                                                       | Changes to shared source                                                                       |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Header, standard                       | Wordmark slot, section navigation, language slot, demo contact action; existing Starwind mobile disclosure | None                                                                                           |
| LanguageSwitcher                       | Equivalent Russian/Kazakh homepage links                                                                   | None                                                                                           |
| Hero, split                            | Asymmetric heading and priority architectural image through existing slots                                 | None                                                                                           |
| Services, grid                         | Six localized treatment previews; each links to the homepage contact explanation                           | None                                                                                           |
| About, split/start                     | Introduction beside a reception visualization                                                              | None                                                                                           |
| Features, grid                         | Three sample patient-experience principles with neutral surfaces                                           | None                                                                                           |
| Gallery, featured                      | Large treatment-room image beside a narrower reception image                                               | None                                                                                           |
| FAQ, accordion                         | Four native disclosures, available without JavaScript                                                      | None                                                                                           |
| CTA, split                             | Pine-colored closing section with a native demo explanation                                                | None                                                                                           |
| Footer, multiColumn                    | Brand, section links and fictional-content disclosure                                                      | None                                                                                           |
| Container, SectionHeading, Media, Card | Widths, semantic headings, optimized responsive media and underlying card composition                      | Media adds 768px/1024px candidates after measured mobile overfetch; other primitives unchanged |
| Motion                                 | One restrained introduction-image entrance; initial hero remains visible and static                        | None                                                                                           |
| BaseLayout and SEOHead                 | Localized metadata, canonical, demo noindex and structured-data suppression                                | None                                                                                           |

New site-specific files: `components/clinic/ClinicHome.astro` composes existing blocks, and `SpecialistsPreview.astro` presents two illustrative profiles. Team content remains independent of generic blocks. `content/clinic-home.ts` is a synchronous, typed, locale-resolved content boundary. All block APIs remain unchanged; Media's internal candidate list is the only shared primitive implementation refinement. No registry, CMS facade, hydration framework, state store, package, or animation system was added.

## Concrete limitations and local solutions

1. **Visual customization depends on block anatomy.** Existing class/style overrides work, but service-card surfaces, the split hero's proportions, the gallery crop, and the section-heading arrangement require site-scoped descendant selectors. They are kept in `styles/clinic.css`. A future starter improvement could expose narrowly justified content/media classes or meaningful surface/layout variants. Do not create a universal style configuration API.
2. **No specialist presentation.** A small local typed preview was sufficient. Do not add dental roles, biographies or credentials to Features/Testimonial schemas. Generalizing a team block should wait for another real consumer.
3. **Example PageEntry couples metadata with one example composition.** Home still supplies the inherited required fields for compatibility, while the clinic's richer content lives in its own model. A later focused cleanup could separate PageMetadata from example page-body contracts. No unrelated schemas were changed here.
4. **Gallery featured has a large first-item span, but no intentional crop contract.** Local selectors set the two photograph ratios and alignment. Media's native class/style and sizes overrides were sufficient; no lightbox or JavaScript layout is needed.
5. **Media responsive candidates were too coarse for photographic assets.** Lighthouse's 412px/DPR 1.75 mobile viewport selected the 1536px hero image (168,426 bytes) because the next candidate after 640px was the original. Adding 768px and 1024px candidates inside the existing Media pipeline closes that gap without another prop or image component. Images smaller than those widths still filter out upscaling candidates.
6. **Navigation assumes published destinations.** 07A has no clinic detail pages. Homepage links therefore use real section IDs and treatment links explain the demo interaction. The inherited `/ru/services/` and `/kk/services/` starter examples remain unchanged in body content and are deliberately unlinked from the clinic homepage. They are not completed clinic pages.
7. **Example-based tests couple infrastructure checks to authored copy and theme count.** Existing assertions for the old Home title, three sample services, first-service LCP, and fixture name needed updates. Fixed keyboard Tab counts also assumed exactly two theme links; those now derive from the registered theme count. Route, noindex, fallback, keyboard and schema assertions remain intact. A future starter can prefer resolved fixture expectations where that still tests actual rendered content.
8. **System-font previews were insufficient for a fixed identity.** The clinic self-hosts licensed Noto WOFF2 subsets. Initial broad language subsets transferred unnecessary glyph data; the final text-targeted subsets retain full Russian/Kazakh alphabets, Latin letters, digits and site punctuation in 55,416 bytes combined. Upstream TrueType cmap files are retained under `scripts/font-sources/` solely for reproducible glyph verification and are not copied to public output. See `node scripts/verify-clinic-fonts.mjs`.
9. **Fail-open mobile navigation can shift content when its controller initializes.** Lighthouse observed the main element move as the server-visible menu became a closed disclosure. Local clinic CSS reserves the trigger row and positions the enabled-script menu as an anchored dropdown. The native [scripting media feature](https://www.w3.org/TR/mediaqueries-5/#scripting) preserves the original visible, in-flow navigation when scripts are disabled. No pre-paint script, hidden-until-JavaScript content or shared Header lifecycle change was added. Engines without that media feature retain the original layout, including its possible initialization shift.

## Boundaries

All business claims are framed as a fictional concept. Portraits, names, quoted sample dialogue, and interiors are labeled illustrative. No credentials, clinical outcomes, reviews, prices, real address, phone, or functioning appointment action were invented. The native contact disclosure explicitly states that nothing is collected or sent. Kazakh copy is complete, but professional native-language editorial review remains recommended before a real client launch.

Theme identity, image crops, wordmark and homepage composition should remain site-specific. Existing theme registration is extended with `saya`; default and alternative themes remain available for starter verification. Demo builds keep noindex, nofollow; no business JSON-LD or production sitemap is enabled by the fictional data.

## Verification

Final results and screenshot links are recorded in [milestone-07a.md](./milestone-07a.md). Automated accessibility checks are not a screen-reader audit or WCAG certification. Synthetic performance does not establish real-user Core Web Vitals.
