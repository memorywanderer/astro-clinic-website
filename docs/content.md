# Content architecture (Phase 04)

## Milestone 07A.2 homepage boundary

`getClinicHome(locale)` resolves the current typed family-clinic content, numeric prices, localized price labels, media and business actions before presentation. Shared contact fields still come from getBusinessInfo/ContactInfo; BusinessSource now accepts the compatible Phase 06.1 optional phone/messengers/bookingUrl/social fields with focused validation. None is populated with a fictional actionable destination. The original getServices source remains only for inherited, unlinked starter service examples pending 07B.

Clinic-specific content lives in clinic-home.ts; generic business contracts are in business.ts. PriceDisplay/PriceList receive FormattedPrice values retaining their original numeric Price. Existing dictionaries own generic price/disclosure labels. PaymentOptions verification and LocationDetails' address requirement are preserved; local compositions show honest missing-data explanations. This is a synchronous static boundary, not a new provider framework or JSON parser. A future CMS adapter must validate untrusted data and return equivalent resolved contracts. See [business-components.md](./business-components.md).

The content boundary is `src/content/static.ts`, with focused source normalization in `normalize.ts`. Data is synchronous, local, and resolved during Astro's build/dev render. No CMS registry, generic provider interface, universal page schema, remote request, new dependency, or client-side content store is introduced.

## Sources and presentation contracts

Phase 06 preserves these contracts and adds only optional `openingHours: readonly string[]` to BusinessSource/BusinessInfo for verified Schema.org machine-readable hours (for example, `Mo-Fr 09:00-18:00`). The existing localized display hours remain presentation text and are never parsed into schema values. Normalization validates the optional machine field; the fictional dataset does not supply it. Existing source metadata title/description/indexable/socialImage is consumed directly by SEO resolution, with the same MediaSource and required-translation policy. No SEO-specific source copy or second content provider was added. See [seo.md](./seo.md).

`models.ts` distinguishes source models only where storage needs them:

- `BusinessSource` stores small shared business configuration with localized name/description/address/hours and shared email.
- `ServiceEntry` and `PageEntry` store independent locale-separated records with stable IDs.
- `FieldServiceSource` demonstrates the alternative field-localized representation for the same service contract in development verification.

For example, business `name: { ru: '...', kk: '...' }` becomes a plain `BusinessInfo.name: string`. A service source `{ id: 'planning', locale: 'kk', title: 'Жоспарлау шешімі', destination: 'services', ... }` becomes `{ id, title, description, link: { label, href: '/kk/services/' }, metadata? }`.

The service target is the existing `ServiceItem` exported by `Services.astro` (`ResolvedService` is an alias). Media uses the existing `MediaSource`, navigation uses the existing link shape, contact data uses `ContactInfo`, and development reviews use `TestimonialItem`. There is no competing service/media/navigation contract and no renamed `image` or `href` layer that requires another UI adapter.

`PageContent` removes source locale and contains only resolved text/metadata needed by the two current page compositions. It is a small example-site model, not a schema imposed on other businesses. Pages explicitly compose Header, Hero, Services, About (Home), CTA, and Footer; there is no block renderer or dynamic component registry.

## Static access

| Function                         | Result                                              |
| -------------------------------- | --------------------------------------------------- |
| `getBusinessInfo(locale)`        | Resolved identity, description, and contact details |
| `getNavigation(locale, current)` | Localized link models with current-page markers     |
| `getServices(locale)`            | Four existing `ServiceItem` models                  |
| `getPage(id, locale)`            | Resolved Home or Services copy and metadata         |

The access module validates the full dataset before exposing results, not merely the selected page. Returned objects are new presentation models; sources are not mutated. Pages and blocks do not select translations inside their markup. The language-switcher link composition is route behavior and uses the centralized available-translation map.

`preview.ts` separately provides `getServiceComparison(locale)` and `getPreviewTestimonials(locale)`. The development route `/content-preview/{locale}/` imports this boundary, renders the same planning service from both source formats through the unchanged Services block, and shows three explicitly fictional review samples. Source reshaping lives in this boundary, not the preview page. Production `getStaticPaths` emits no preview routes, and the public pages import no sample-review access function. Existing phase showcases remain available only in development.

## Normalization and validation

- `resolveBusiness`: validates shared email, resolves required multilingual strings, and omits optional untranslated address/hours without implicit fallback.
- `resolveService`: validates locale, identity, required text, optional metadata/media, and route references; strips source locale/destination and returns the existing block contract.
- `resolveFieldService`: resolves required localized fields and delegates to the same service normalization target. It is deliberately focused rather than recursive/universal.
- `resolvePage`: resolves page identity, required hero/section/metadata text, indexing eligibility, and optional social media.
- `resolveNavigation`: validates unique route references and resolves UI labels plus native localized destinations.
- `normalizeMedia`: preserves local Astro metadata or a URL string, alternative text, and positive finite dimensions.
- `validateEntries`: rejects unsupported locales, blank IDs, duplicate `(id, locale)` pairs, and missing translations. Repeating the stable ID in another locale is intentional.

Missing required business translations fail with contextual errors. Optional fields are omitted; no optional Russian fallback is configured for this dataset. Missing UI dictionary values warn and fall back to Russian. Missing pages follow route availability, not field fallback. See [i18n.md](./i18n.md).

Typed TypeScript data provides the authoring contract; boundary checks enforce content invariants before rendering. This is not a runtime parser for arbitrary external JSON. A future external adapter must parse its untrusted input before calling these functions or returning equivalent validated models. Invalid content is never replaced with placeholder copy.

## Media

Local image imports retain `ImageMetadata`; they are not converted into URL-only strings. The schematic PNG service image exercises real production Astro optimization, responsive candidates, intrinsic dimensions, and localized alt text. Below-fold services retain Media's default lazy loading. Remote HTTP(S) URL references are accepted as data, but no remote image host is authorized in Astro configuration and no network media adapter is implemented. Add verified hosts and test delivery when an actual CMS is introduced. An empty alt string is accepted for explicitly decorative media; authors remain responsible for its meaning.

## Why no Content Collections yet

Astro 7.4.8's supported Content Layer API was evaluated against the official documentation and installed types. Four services, two pages, and small business settings need no Markdown, collection queries, content-driven detail routes, or loader integration. Typed static records plus one boundary avoid duplicating component contracts in collection schemas and introducing an unnecessary second validation system. Collections are appropriate when independent file authoring or larger repeatable content makes their loader/query/schema features useful. Such entries would still normalize to the same UI models.

## Extending the boundary

For a real new content type, inspect existing component contracts first. Define a source type only if its representation differs, put data outside components, write a focused normalizer with contextual validation, and expose only the synchronous access function actually needed. Add a route mapping and explicit page composition if the type needs a page. Do not make unrelated businesses adopt this example's page-copy model.

A future Strapi integration can replace the internals of the relevant access functions or provide a focused adapter returning `ServiceItem`, `BusinessInfo`, and other existing resolved contracts. Validate unknown CMS responses and map media/localization at that boundary. Presentation stays unchanged. No speculative CMS interface, SDK, async wrapper, authentication, caching, synchronization, or provider registry is present.

## Verification

Unit tests compare both service representations with exact object equality and verify required/optional fields, invalid data, stable IDs, media preservation, route policies, and dictionary fallback. Browser tests compare the actual resulting service markup, verify the four production pages with JavaScript disabled, and inspect generated static HTML.

### Recorded results (2026-11-10)

| Command                                                    | Actual result                                                                                                                                         |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm astro check`                                         | Passed: 63 files, 0 errors, warnings, or hints                                                                                                        |
| `pnpm lint`                                                | Passed                                                                                                                                                |
| `pnpm format:check`                                        | Passed after formatting-only normalization of the existing Phase 04 spec                                                                              |
| `pnpm test`                                                | Passed: 14 tests across 3 files                                                                                                                       |
| `pnpm exec playwright test`                                | Passed: all 56 tests across Chromium and Firefox                                                                                                      |
| `pnpm exec playwright test tests/e2e/content-i18n.spec.ts` | Passed: all 16 affected tests after the final preview-boundary refactor                                                                               |
| `pnpm build`                                               | Passed: 7 static pages (4 localized business pages, root redirect, 2 existing design previews), 3 optimized image variants; no route-conflict warning |

Representative Kazakh Home at 320px and Russian Services at 1440px were visually inspected. There are no remaining failed or skipped configured checks. Initial failures exposed the Vitest image-import mismatch and Astro automatic-root redirect precondition/conflict; both were corrected as documented in the decisions log. The first formatting check found pre-existing Phase 04 spec formatting; its normalization changes no requirements. Test subprocesses retain harmless `NO_COLOR`/`FORCE_COLOR` environment warnings. Git diff/status cannot be supplied because the provided workspace is not recognized as a Git repository. No dependency or lockfile change was needed.

## Limitations and next phase

This remains an explicitly fictional noindex demonstration. Contact email uses `example.com`; the origin is now deployment-configurable. Reviews are development-only samples; there is no review verification, form submission, or real business information. Phase 06 adds Open Graph, sitemap/robots policy, minimal JSON-LD generators, and local production measurements without changing fictional-content eligibility. See [seo.md](./seo.md) and [performance.md](./performance.md) for current behavior and verification. System font coverage on other platforms, remote media delivery, a CMS, hosting HTTP redirects, and manual assistive-technology/zoom audits remain separate work. Configure the verified production origin and real content before deployment.
