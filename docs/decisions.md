# Architectural decisions

## Phase 07C: portable static builds and provider preview safety

Keep Astro static output and automatic Vercel framework detection. Pin the tested Node 24 major and pnpm release rather than introducing an adapter or allowing an unbounded Node engine. A provider-owned `VERCEL_ENV` other than production forces demo policy even with eligible content and inherited production settings. Other hosts must scope preview variables explicitly. Fictional content eligibility and `DEMO_MODE` remain independent launch gates.

Move design-system routes behind the existing development-only static-path convention; test theme contracts on the dev server while verifying route absence in actual builds. Add a static bilingual noindex 404. Commit PNG social/touch exports and a matching ICO favicon without adding an image-generation build dependency. Source SVGs preserve editability.

Keep Vercel-specific redirects, limited CSP and hashed-asset caching in one optional `vercel.json`. Do not restrict scripts/styles without a hash/nonce strategy; exercise the exact policy in browser tests. Real host headers, redirects, caching and the live map still require post-deployment checks. See deployment.md for environment scopes and launch prerequisites.

## Milestone 07A.4: local demo behavior and honest example data

Keep numeric/contact/schedule defaults in `config/clinic.ts` and bilingual text in typed content. Resolve real contact URLs with the existing business action helpers. Site-local native dialogs provide demonstration previews and contextual callback forms; forms have no transport in either mode. No patient values enter analytics or storage. The `track` wrapper is a demo no-op and only emits local events when enabled for a future reviewed subscriber.

Use PriceList's existing card variant for all prices and retain the original verification gates for real payment, review, credential and address data. Explicitly illustrative examples are separate local content. Native scroll-snap handles mobile doctors/reviews; a small shared local key handler provides arrows/Home/End without a carousel dependency. Native dialogs receive an explicit Tab boundary loop because tested modal behavior could otherwise move focus to browser chrome.

FAQPage describes visible questions rather than fictional business facts, so it is emitted from the localized FAQ even in demo mode. Business schema additionally requires `DEMO_MODE=false` and the existing verified/indexable policy. Production verification changes the flag only in its isolated fixture, which must never be deployed.

## Milestone 07A.2: selected business primitives and local family-clinic composition

Copy the actual Phase 06.1 Header, selected business components, contracts and helpers into dental-clinic-demo; keep foundation-1 read-only. Preserve the existing static Astro route/content/SEO boundaries. Use Card/PriceDisplay/PriceList for the real pricing requirement rather than extending generic Services with dental-specific fields or building a renderer. Keep optional verified payment/credential/contact data absent; local explanatory states never impersonate business facts.

The user requested a modern grouped language control, sticky header transition and persistent messenger/call access. Native locale anchors remain navigation, styled as a segment. One IntersectionObserver controls a stable-height sticky header's shadow; native menu semantics and the copied pre-paint fallback stay intact. One existing FloatingContact mobile bar reserves its measured height and opens local demo explanations until genuine destinations exist. No analytics, form submission, framework hydration or new animation system is introduced.

Add a small optional Intl display-options argument to the copied formatPrice so whole-tenge symbols remain a formatting concern while numeric Price values and existing callers stay intact. A traced font-swap shift is resolved by reserving the business context's intended second line rather than freezing heights or weakening the existing 0.01 browser threshold. Use separate browser-test ports to leave the user's existing dev server running. See milestone-07a2.md and starter-feedback.md for verification and upstream candidates.

## Milestone 07A: site-specific composition on unchanged shared blocks

Add the SAYA QAM identity through the static theme registry and a focused, typed homepage content boundary. The locale route selects the clinic homepage explicitly; the inherited services composition remains deferred starter content. Keep the homepage's own team preview and composition under components/clinic, with all shared block APIs unchanged. Site-scoped CSS adapts existing surfaces and layouts without dentistry in generic blocks, a block engine, new dependencies, or framework hydration. Preserve the existing normalized SEO metadata and demo indexing policy.

Use self-hosted, licensed Noto web subsets with Russian/Kazakh cmap verification. Keep upstream verification fonts outside public assets. Generated interiors and portraits carry explicit fictional/AI disclosure; a native details element demonstrates the contact action without collecting data. The only observed reveal is the introduction image, preserving fail-open motion and static initial hero paint. See starter-feedback.md for actual anatomy-dependent overrides and possible future improvements; none were automatically applied to foundation-1.

The first 07A Lighthouse run exposed real photographic image overfetch and a mobile navigation initialization shift. Add 768px/1024px candidates to the existing Media primitive rather than adding a competing image path. Keep the Header lifecycle unchanged; site-local CSS uses the native scripting media feature to reserve the toggle row and position its menu as a dropdown only for script-enabled documents. Script-disabled navigation remains visible in flow. Repeat the full shared-component regression suite because Media is used across the starter examples.

## Phase 06: explicit deployment policy and rendered-head sitemap eligibility

Preserve normalized Phase 04 PageContent metadata and the native localized route registry. resolvePageSEO takes normalized content plus the existing getPage function, resolves canonical and eligible reciprocal alternate URLs through availableTranslations, and feeds a single reusable SEOHead through BaseLayout. Legacy layout metadata props stay supported with noindex defaults. Deployment profile and origin validation are shared by Astro config and rendered site config; Vite is a direct development dependency solely for the documented loadEnv API. Unknown profiles and unsafe production origins fail. Default builds are demo, never indexable by default.

Official @astrojs/sitemap 3.7.4 filters actual generated HTML for an explicit index directive and matching self-canonical. Config cannot directly consume Astro's virtual locale helper or the PNG-bearing content source without building another adaptation path. Reading the generated head keeps its canonical/indexing decision authoritative; focused actual-build tests cover this intentionally narrow serialization dependency. No duplicate routing, independent content normalization, sitemap language registry, or general audit engine is introduced. With all authored pages noindexed the integration emits no sitemap; robots omits its advertisement. Eligible fixture builds verify the positive path.

Fictional content retains indexable:false across every deployment profile. Verified business schema selection is opt-in; generators reuse BusinessInfo contacts and optional normalized machine-readable openingHours, never guess from localized display hours. Only Home emits a business entity; eligible Services uses its existing Home/Services hierarchy and localized navigation labels for breadcrumbs. Schema selection and verified-only extra properties live in existing site configuration, separate from blocks. JSON-LD is escaped and only emitted for eligible production pages. Synthetic fixture schema assertions are never deployment configuration.

The root's existing meta-refresh behavior is now rendered through BaseLayout to include noindex while preserving native JavaScript-free navigation. HTTP redirect status codes remain host-specific. Design-system routes remain available for established verification but are always noindex and excluded from sitemap/hreflang. Existing source/model APIs, static output, theme contracts, and motion behavior remain intact.

Verification copies sources into ignored workspace-local build fixtures without modifying authored content or adding a production eligibility override. Lighthouse and axe are development-only tools. Run browser tests first because they reset test-results. No hosting target has been chosen: headers, caching, actual redirects, HTTPS/domain ownership, and private preview protection require deployment verification.

## Phase 05: fail-open CSS motion with static navigation

CSS owns interpolation, stagger, micro-interactions, and view-timeline image scaling. One document-scoped IntersectionObserver activates opted-in roots, unobserving once targets and cleaning up on pagehide/preference changes. No hidden pending state is installed: a small visible-to-entrance change at the viewport edge is preferable to stranded hidden content. Initially visible content completes statically to protect Hero/LCP paint. Keyboard focus cancels decorative reveals immediately.

Native attributes, existing slots, and item markers integrate motion without changing block internals or introducing animation props. Plain-text word segmentation happens at build time; coherent accessible text accompanies aria-hidden visual fragments. Responsive measured lines and optional page transitions are deferred. Static navigation, locale links, and Header lifecycle remain intact. No ClientRouter, library, global motion store, or JavaScript scroll-progress engine is introduced. Native CSS timelines are feature-detected with static fallbacks.

Playwright's Astro servers use the installed CLI's `--ignore-lock` to create foreground test instances alongside existing development locks. This avoids agent auto-backgrounding and leaves the user's dev server alone. WebKit is added for motion coverage; existing Chromium/Firefox regression coverage remains intact.

## Phase 04: focused static normalization and native localized routes

Keep shared configuration field-localized and independently authored services/page copy locale-separated. Normalize at synchronous access functions into the existing ServiceItem, MediaSource, ContactInfo, and navigation contracts; retain source-specific models only for actual representation differences. A development-only comparison resolves the same service from both formats and renders it through the unchanged block. Three clearly fictional reviews are restricted to development. Do not introduce a provider registry, universal page model, CMS SDK, collection loader, or async facade.

Typed static records and focused invariant checks are sufficient for this small dataset. Content Collections were evaluated against Astro 7.4.8's Content Layer documentation; independent files/Markdown, querying, and content-driven detail routes do not yet justify extra loader/schema structure. A future CMS must validate unknown input at its own boundary and return these same presentation contracts.

Follow Phase 04 over the earlier i18n draft: required published business translations fail validation; optional untranslated fields are omitted unless a content-specific fallback is explicitly configured; UI strings warn and fall back to Russian. Route availability is independent of content fallback. Missing translations are excluded from language options/hreflang, and explicitly configured route fallback resolves to an existing Russian equivalent; otherwise the URL is 404.

Use Astro's locale-prefix configuration and native URL helper with centralized stable route IDs and explicit translated slugs. Keep one static Astro composition shared across locales, with Home/Services layout differences expressed directly. The language switcher receives resolved labels/links through Header's existing slot and needs no client state. BaseLayout only adds optional metadata props; existing blocks retain their APIs.

Use an explicit root redirect with native automatic root redirection disabled. Astro 7.4.8's automatic redirect plus an explicit root index produces a duplicate-route warning; removing the root index fails its automatic-redirect precondition. The explicit version builds cleanly and emits Astro's static meta-refresh redirect. HTTP redirect status codes remain a deployment concern. Preserve noindex and the placeholder origin; full SEO infrastructure is deferred.

Vitest doubles Astro's virtual i18n module and imported-image metadata because they depend on Astro's build pipeline. Browser integration tests use the actual native module and optimized images in production output. This keeps unit tests focused on application policy without copying Astro internals into the implementation.

## Phase 03.1: eight additive business components and explicit page compositions

Preserve the Phase 03 primitives, block APIs, media model, theme registry, and BaseLayout. Add six flat content-block files and Header/Footer under `components/layout` because they belong around `main`. Keep types near their components, with shared ContactInfo in content. Reuse Container, SectionHeading, Card, Media, and the source-owned Starwind Button. NavigationLinks and ContactDetails each have two real consumers; no section wrapper, universal item card, block registry, or page schema is introduced.

Use the installed Starwind Runtime 1.5.0 Collapsible raw-HTML contract for Header's mobile disclosure. This avoids duplicating disclosure state and ARIA behavior or installing the styled preset. Reuse the existing lifecycle helper and clean up the small Escape/outside/link-close adapter. Server markup shows the menu and hides its inert trigger until initialization. Native details/summary handles nested navigation and FAQ, with independent open items and no extra runtime. Vite 8.3.7 prebundles the Button/Collapsible entry points to prevent dependency-discovery reloads between development routes.

Overlay Header uses a transparent outer desktop shell with a theme-aware opaque inner panel, guaranteeing contrast without predicting image colors. On mobile it returns to normal flow so expanded navigation and long labels cannot cover content. Page compositions reserve desktop overlay space. Contact's formFocused variant places the form first in DOM order as well as visually. Gallery's masonry variant uses varied Grid spans and intrinsic image ratios; accept normal row gaps to preserve reading order and avoid JavaScript layout.

Keep fixtures outside the shared components. Three explicit development-only Astro pages validate clinic, construction, and professional-services compositions under both themes; there is no data-driven renderer. Demonstration forms are labeled and disabled. Verified public-domain literary quotations exercise quote typography without fabricated business reviews or ratings. A local schematic PNG exercises Astro image transformation, alongside differently proportioned SVGs. Production excludes all demo HTML routes; Astro can still emit small imported fixture assets.

Contact helpers normalize and validate only the schemes needed by the phase, omit blank/invalid content, and support independently optional fields. This small shared boundary receives meaningful unit tests. Full provider validation, real business data, remote assets, production forms, manual assistive-technology checks, and performance measurements remain future integration work. See [components.md](./components.md) for exact APIs, example routes, and results.

## Phase 03: native Astro composition and a development-only showcase

Keep primitives and three blocks in flat directories. SectionHeading is the only repeated text composition; Media is justified by Hero and both Features templates. Public props and slots remain explicit. Features takes a small readonly item collection, not a universal page schema. Pages and future adapters own content and block ordering. FullBleed uses edge-to-edge media below text rather than a contrast-dependent text overlay. No new dependency, provider, framework hydration, or state store is needed.

Reuse the existing source-owned Starwind Button directly and add visual variants/sizes without changing its exports or controller lifecycle. Review the upstream styled Card but use the phase's permitted minimal neutral slotted Card instead of importing a multi-part preset and its dependencies. Keep presentation defaults that need utility overrides in scoped CSS within the components layer. Reuse existing semantic roles; introduce no component tokens.

Change the Button SSR fallback so every disabled button initially has native `disabled`, including `focusableWhenDisabled`. Starwind Runtime 1.5.0 already clears native disabled during controller initialization and preserves disabled activation blocking with ARIA. Enhanced focusability therefore remains available, while a delayed or absent script cannot leave a disabled submit button activatable. Browser tests cover both states.

Use `import.meta.env.DEV` in showcase `getStaticPaths` to emit no production routes. Maintain production foundation tests and add a second development server in Playwright for showcase coverage. This keeps production output free of demo routes while allowing integration checks of all variants in both themes. It adds test server startup cost, without adding a production environment flag or bypass.

See [components.md](./components.md) for APIs, composition examples, verification, and remaining accessibility/media boundaries.

## Phase 01: source-owned Starwind primitive without the styled preset

Use the official CLI's vendored Button primitive and its Runtime dependency. Keep its generated lifecycle support and public anatomy exports so the upstream source remains recognizable and updateable. The representative button is disabled and uses native semantics with minimal Tailwind layout and current-color border classes.

The full Starwind styled preset installs theme colors, form styling, animation utilities, and icon tooling. Those exceed Phase 01's boundaries. Keep only the dependencies actually imported by the vendored source and one global stylesheet containing Tailwind. This means styled components will need their relevant tokens and dependencies when the design system is implemented; it avoids introducing a temporary theme that must be removed later.

Starwind source was installed with CLI 3.6.0, bundled registry 2.2.0, Button primitive 1.0.3. Configuration records the installed primitive version. The official adapter package is unnecessary because the adapter source is vendored locally; the Runtime package remains required.

## Phase 01: compatible TypeScript and production browser smoke test

Retain Astro 7.4.8 and use TypeScript 6.0.3. TypeScript 7 is newer, but the installed Astro checker supports TypeScript 5/6 and typescript-eslint supports versions below 6.1. Compatibility takes precedence over upgrading to an unsupported major.

Playwright builds the app and starts `astro preview` instead of testing the development server. This is slightly slower but verifies the actual static output and stylesheet integration with one smoke test. Only Chromium is configured.

## Phase 02: one CSS theme registry and Starwind semantic contract

Keep reference values and selected theme choices in CSS, with semantic relationships declared once and a single `@theme inline` bridge. Extend the existing global entry point instead of installing the styled Starwind preset, whose additional dependencies and mappings would duplicate the contract. Match current Starwind names (`error`, `outline`, `primary-accent`, `card`) rather than introducing a parallel destructive/ring/surface vocabulary. Keep the vendored Button unchanged and style it at the preview call site.

Site configuration owns only the selected, statically typed theme name. The layout renders `data-theme` at build time. Static noindex preview routes use the same markup and require no theme script; both definitions ship together. This trades negligible CSS size for straightforward verification and avoids runtime state, environment configuration, and generated CSS.

Use system Arial and Times New Roman stacks for the example identities. Their installed Windows Unicode cmap tables contain the required Kazakh letters; system font rendering and fallback coverage remain platform-dependent. No system fonts are redistributed. A future branded self-hosted font must have appropriate licensing, verified glyph coverage, and measured loading behavior.

The first Phase 06 Lighthouse sample identified the first service image as LCP in the mobile viewport despite text-only Heroes. Services now accepts optional mediaPriority (false by default), forwarding existing Media priority only to its first image. Public compositions explicitly opt in; other section images retain lazy loading. This measured refinement does not alter media models or existing callers' defaults.

## Milestone 07A.5: site-owned business footer and user-activated map

The clinic footer uses a local composition because the shared Footer has no independent upper brand/contact/hours region. Keep the shared primitive unchanged instead of adding dentistry-specific fields or a universal footer schema. Header gains only a label span for source-owned visual control; LanguageSwitcher includes the visible short label in its accessible name.

Profiles, reviews and multiple promotions use native overflow/scroll snapping with a small keyboard enhancement. No carousel library, new hydration or global state is justified. One authored promotion remains a featured card; build-time validity filtering suppresses expired offers.

The 2GIS constructor iframe is configured separately from the clinic's BusinessLocation and created only after activation. Its public-landmark coordinates never become a clinic address or structured data. Native text and an external link survive blocked scripts/frames. Review provenance and real contact destinations remain explicit configuration boundaries; sample presentation never marks fictional facts as verified.
