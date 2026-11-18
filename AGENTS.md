## Commands

Verify scripts against package.json before running them.

- Dev: `pnpm dev`
- Type/Astro check: `pnpm astro check`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Format check: `pnpm format:check`
- Unit tests: `pnpm test` (when configured)
- Browser tests: `pnpm exec playwright test` (when configured)
- SEO build verification: `pnpm verify:seo` (after browser tests)
- Production fixture Lighthouse: `pnpm measure:seo` (after `verify:seo`)

Never invent commands or report unexecuted checks as passing.

After implementation:

- Run checks relevant to changed code.
- Fix failures caused by the changes.
- Report failures, skipped checks, and environmental limitations.
- Browser tests reset `test-results/`; run isolated SEO builds and measurements afterward. Never deploy verification fixtures.

## Stack

- Astro (static output by default), TypeScript (strict), Tailwind CSS 4
- Starwind UI for accessible primitives (source-owned components)
- Nanostores only if shared client-side state is truly needed
- Astro native i18n; static content now, Strapi-compatible later (not installed)

Before using any package API, check the installed version and its docs. Do not assume APIs from earlier versions.

## Principles

- Composition over inheritance and complex configuration.
- Abstract repeated patterns, never hypothetical future needs.
- Keep content, presentation, configuration, and behavior separate.
- Astro components for static rendering; hydrate only when necessary.
- Prefer build-time solutions and native platform features over dependencies.
- Every component must stay individually overridable.
- Do not build features outside the requested scope. No empty directories or placeholder modules.

## Structure

| Path                    | Responsibility                                             |
| ----------------------- | ---------------------------------------------------------- |
| `src/config`            | Business settings, locales, feature flags, theme selection |
| `src/styles`            | Design tokens, global styles, typography, motion           |
| `src/components/ui`     | Starwind components and minimal custom primitives          |
| `src/components/blocks` | Reusable sections composed from primitives                 |
| `src/layouts`           | Document and page layouts                                  |
| `src/content`           | Typed content models, local data, content providers        |
| `src/lib`               | Shared utilities, HTTP client, integrations                |
| `src/pages`             | Routes and page composition                                |

## Design system

Details: `docs/design-system.md`.

- Three token layers: reference (raw values), semantic (primary, background, surface, foreground), component (only when semantic is insufficient).
- Components consume semantic and component-level tokens.
- Never reference raw values directly in components.
- Prefer semantic tokens; introduce component tokens only
  when a component requires independent customization.
- One-off layout values are allowed when they do not
  represent shared design decisions.
- Changing the theme must restyle the whole site with zero component edits.
- Themes are chosen via config. No runtime theme editor.
- Avoid arbitrary Tailwind values when a token fits.

## Components and blocks

- Prefer Starwind components when suitable.
- Customize source-owned components directly when appropriate.
- Create custom primitives when they simplify repeated patterns
  or provide functionality not adequately covered by Starwind.
- Avoid redundant wrapper layers.
- Preserve accessibility when modifying existing components.
- Primitives: typed props, meaningful variants/sizes, semantic HTML, class/style overrides, keyboard and focus support.
- Blocks: composed from primitives, take typed content via props, **never fetch data**, support layout variants (e.g. Hero: `split`, `centered`, `fullBleed`), stay industry-agnostic, avoid boolean-prop sprawl.
- No generic block-rendering engine unless a real requirement appears.

## Design flexibility

- Do not assume all websites share identical page structures.
- Blocks must support meaningful structural variants,
  not merely color or typography changes.
- Allow site-specific compositions without changing primitives.
- Avoid embedding business-specific assumptions in shared blocks.
- Do not force unrelated industries into identical content schemas.
- Validate reusability by composing at least two substantially
  different website designs from the same primitives.

## Content

- Typed content models for business info, navigation, services, testimonials, page sections.
- Static content provider now. The data-access boundary must allow adding a Strapi provider later without touching presentation components.
- Asset references must stay compatible with future CMS-provided URLs.

## Localization (`ru`, `kk`)

Details: `docs/i18n.md`.

- Astro i18n routing, localized URLs and navigation, correct `lang` attributes.
- UI strings live in translation dictionaries. No hardcoded user-facing strings in reusable components.
- Language switcher keeps the equivalent route when one exists.
- Localized SEO metadata and `hreflang` links.
- Missing translations: fall back to `ru` and log a warning at build/dev time. Never render a raw key.
- Fonts must support Kazakh letters: ә ғ қ ң ө ұ ү һ і. Verify before choosing any font.
- Missing UI translations: fall back to `ru` and warn
  during development/build.
- Missing localized routes: redirect to the equivalent
  Russian route.
- Never advertise missing localized pages in hreflang.
- Keep language switching consistent with route availability.

## Animations

Details: `docs/animations.md`.

- Opt-in, independent of UI components, CSS-first. IntersectionObserver for visibility triggers.
- Animate `transform` and `opacity` only for performance-sensitive effects.
- Respect `prefers-reduced-motion`. Content must be visible and usable without JavaScript.
- No animation library without written justification.

## Media and data fetching

- Use Astro image optimization, responsive sizes, explicit dimensions (no CLS), meaningful `alt`, lazy-load below the fold, prioritize the LCP image.
- HTTP client: minimal, typed, explicit errors, `AbortSignal`, configurable base URL, runtime validation at untrusted boundaries. No SDK, auth, caching, or middleware layer. Independent of UI.

## Accessibility and responsiveness

- Target WCAG 2.2 AA: keyboard navigation, visible focus, contrast, correct heading order, accessible forms, zoom-friendly text.
- Prefer native HTML over custom ARIA.
- Mobile-first, fluid layouts, intrinsic sizing; breakpoints only when needed.

## Performance

- Prefer static rendering and minimal client-side JavaScript.
- Optimize critical images, fonts, and third-party resources.
- Avoid unnecessary hydration and layout shifts.
- Measure performance on representative production builds.
- Follow performance targets defined in docs/performance.md.

## SEO

Details: `docs/seo.md`.

- Technical SEO is mandatory for production websites.
- SEO metadata is configured per site and per page.
- Use canonical URLs, localized metadata, and hreflang.
- Generate production sitemaps and robots.txt.
- Use JSON-LD only for verified business information.
- Keep demo and staging sites out of search indexes.
- Ensure important content exists in generated HTML.

## Code quality

- Strict TypeScript, no `any` without a justifying comment.
- Simple, explicit component APIs. No global state unless necessary.
- No needless wrappers or utilities. Keep dependencies minimal.
- Document non-obvious architectural decisions in `docs/decisions.md`.

## Workflow

- Work incrementally, following the phase specs in `specs/` in order.
- At the start of each phase: inspect the project, propose the approach and tradeoffs, then **stop and wait for approval** before implementing.
- Run the relevant checks at the end of each phase and report real results.

## Where to look

- `specs/` — phased build tasks; read the one named in the prompt
- `docs/design-system.md` — token layers and theming
- `docs/i18n.md` — routing, fallback, hreflang
- `docs/animations.md` — animation utilities and conventions
- `docs/decisions.md` — architectural decisions log
- `docs/performance.md` — performance specs
- `docs/seo.md` — seo specs
