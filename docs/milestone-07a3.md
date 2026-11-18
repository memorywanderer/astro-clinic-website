# SAYA QAM · Milestone 07A.3

The RU and KK homepages retain the sage theme, family photography and static Astro rendering. A demo and location strip scrolls away above the sticky wordmark, navigation, contact CTA and language switcher. Desktop also shows the illustrative weekday schedule. Native language links show РУ and ҚҚ with full accessible names. The Hero links to information about 2GIS, licensing and installments. No verified rating, license or financing agreement was supplied.

Each of the eight service tiles leads to its corresponding price. Wider tiles wrap between words, and the tooth-pain entry leads directly to contact information. The sample promotion links to the displayed hygiene price for comparison. Smaller specialist cards share one first-visit link and one fictional-profile disclosure.

One floating group serves both desktop and mobile. With the current fixtures it links to visible, labeled WhatsApp and telephone examples. Verified destinations can use the existing business action resolver. The directions panel uses a locally drawn illustrative map, city context and sample hours. There is no third-party request, business pin or live routing destination.

## Visual review

Reviewed RU and KK browser renders at 320, 390, 768, 1024 and 1440 pixels. The review led to separating the urgent link from tile styling, reducing floating-control width and fixing desktop navigation reflow during the Kazakh font swap. The compact header retained navigation across the scroll threshold. No horizontal overflow was detected at the tested widths or at 200% root text size.

[Responsive comparison](./screenshots/07a3-responsive.png) · [Desktop scrolled](./screenshots/07a3-ru-desktop-scrolled.png) · [Mobile menu](./screenshots/07a3-kk-menu-open.png) · [Pricing](./screenshots/07a3-kk-pricing.png) · [Contact and map](./screenshots/07a3-kk-contact.png)

## Verification

- Astro check examined 105 files with zero errors, warnings or hints. Lint and all 36 unit tests passed. Both fonts passed the RU/KK coverage check.
- Playwright passed 111 tests across Chromium, Firefox and WebKit. The two expected skips are for the Chromium-only layout-shift observer. Coverage included native navigation, language switching, keyboard operation, reduced motion, JavaScript-disabled content, footer clearance and automated axe checks. The Chromium desktop layout-shift sample was 0.00165.
- The static build generated eight pages and 24 optimized image variants. SEO verification passed for the demo, authored production exclusions, eligible production fixture and unsafe deployment configurations. The actual demo retains noindex and omits fictional business JSON-LD.
- Repository-wide Prettier flags the supplied 07A.3 specification. Implementation and report files pass formatting.

### Mobile Lighthouse

One local simulated run per route on the isolated eligible production fixture.

| Route                           | Performance | Accessibility | Best practices | SEO |     LCP |    CLS |
| ------------------------------- | ----------: | ------------: | -------------: | --: | ------: | -----: |
| /ru/                            |          98 |           100 |            100 | 100 | 2.256 s | 0.0008 |
| /kk/                            |          98 |           100 |            100 | 100 | 2.408 s | 0.0013 |
| /ru/services/ (starter fixture) |          99 |           100 |            100 | 100 | 2.105 s | 0.0034 |

## Handoff

Ready for 07B inner-page work. Production contact, legal, licensing, review, financing, staff and location details still require client verification. Prices, promotion, photography and hours remain illustrative. Field performance, native editorial review and manual screen-reader testing remain outside this verification. Any future third-party map requires a new performance and privacy evaluation. Starter candidates are recorded in [starter feedback](./starter-feedback.md).
