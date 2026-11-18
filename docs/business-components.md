# Business components used by SAYA QAM

Milestone 07A.2 copies selected Phase 06.1 implementations from foundation-1 into this demo. The source repository remains unchanged. No dependency was added; Astro 7.4.8 and Starwind Runtime 1.5.0 remain the installed versions.

## Actual contracts and APIs

Contracts are in `src/content/business.ts`. `BusinessAction` references the shared ContactInfo for phone/WhatsApp/Telegram/booking/email; internal/external links carry their own destination. `resolveBusinessAction(s)` validates destinations and returns plain `ResolvedBusinessAction` models, omitting unavailable contacts and keeping at most one primary action per group. Components never resolve a locale, import business settings, fetch data or generate JSON-LD.

| Component          | Props / variants used or available                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| BusinessActionLink | Optional resolved action; presentation button/text/compact/icon; decorative icon slot; native anchor semantics                          |
| ContactActions     | Resolved actions; inline/stacked/compact layouts; optional indexed icon slots; one primary action per group                             |
| FloatingContact    | First two valid actions; group/bar; always/mobile/desktop; measured reservation, safe-area support, in-flow fallback without JavaScript |
| AnnouncementBar    | Optional current announcement: message, badge, action, supplied validity label                                                          |
| PriceDisplay       | Optional FormattedPrice; text and numeric/discriminated value stay together; rendered hook is data-price-kind                           |
| PriceList          | Price groups; list/grouped/cards; optional row description, price and contextual action; groupLevel controls group headings             |
| Promotion          | Optional current promotion; banner/split/card; title, description, terms, price, action, media and supplied validity label              |
| PaymentOptions     | Options with verification flag; unverified methods and installments without conditions are omitted                                      |
| ReviewSummary      | Attributed external link; numeric snapshot only with valid verified values, labels and nonfuture timestamp                              |
| BusinessHours      | Typed schedule, resolved labels/timezone, intervals, closed days and optional exceptions; no open-now inference                         |
| LocationDetails    | Optional location with required address; compact/split/detailed; optional hours, maps, directions, phone and media                      |

All retain native attributes and class/style overrides. Existing Header adds announcement/contact/social slots alongside logo/actions/language; secondary content appears in the desktop region and mobile panel. Repeated slots must not contain duplicate IDs. Its parser-executed native fallback initializes the menu before later content paints and remains usable when deferred modules fail. With JavaScript disabled the menu is visible in flow.

ButtonRoot and BusinessActionLink import the same action-control.css; native button and anchor semantics remain distinct. Hero, Services, About, FAQ, Contact and Footer APIs were not expanded for this site.

## Formatting and dates

`formatPrice(price, locale, labels, options?)` supports exact/from/range/request/free. Missing prices remain absent, unknown prices are not zero, and invalid negative/nonfinite/reversed amounts throw. The optional fourth argument is a local additive refinement: Intl currencyDisplay and maximumFractionDigits. Without it, the copied three-argument behavior is unchanged. This site requests whole-tenge narrow-symbol formatting and retains the original Price values. Generic labels resolve from the existing Russian/Kazakh dictionaries, including the Kazakh suffix form `{price} бастап`.

Validity helpers require explicit ISO instants when dates are supplied; start is inclusive and end exclusive. Filtering happens at build/render time. No invented validity period, timer or live expiry behavior is added to this demo offer. Schedule validation uses an IANA timezone, ascending nonoverlapping intervals and supplied localized labels. Display hours never become Schema.org openingHours automatically.

## Current demo data

All amounts, the offer and schedule are illustrative and explicitly labeled where shown. No actual phone, messenger or booking destination is configured. Internal demo actions reveal explanations; there is no submission. PaymentOptions receives an empty collection, LocationDetails receives no fictional address, and ReviewSummary links only to the clearly named 2GIS platform homepage. Credentials/SocialLinks are intentionally absent because verified evidence/accounts are unavailable.

The local ClinicPricing/ClinicContact/ClinicHome compositions own empty-state explanations and patient-oriented layout. They do not weaken the generic verification or required-address rules. Future external data must be validated and mapped at the content boundary before these models reach presentation. No universal business profile, component registry, provider framework or integration SDK was created.
