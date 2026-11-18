# Components and blocks

Milestone 07A.2 adds selected Phase 06.1 business components and the additive Header contact/social/announcement slots. See [business-components.md](./business-components.md) for the actual copied contracts, local whole-tenge formatting option and demo-data policy. Existing static block APIs remain unchanged; site-specific discovery/pricing/team/contact compositions stay under `components/clinic/`.

Phase 05 adds independent motion through native root attributes and existing title/media slots; block APIs and internals remain unchanged. Include `Motion.astro` once in an opted-in page, use `RevealText.astro` in title slots, and apply `data-motion-group` to Services/Gallery's existing `data-item` markers for capped CSS stagger. See [animations.md](./animations.md) for examples, constraints, and the development-only `/motion/{theme}/` showcase.

Phase 04 preserves all existing block APIs. Static access resolves business content, UI labels, navigation, and media before rendering; components never receive localization wrappers or source metadata. `ResolvedService` aliases the existing `ServiceItem`. Header's `language` slot now hosts `layout/LanguageSwitcher.astro`, a native-link component taking `label` and resolved `items: { locale, label, href, current }[]` plus native nav attributes/class/style. BaseLayout adds optional `description`, `canonical`, and available-translation `alternates` props without changing existing defaults. See [content.md](./content.md) and [i18n.md](./i18n.md). The old root design preview is now the Russian-home redirect; both named design-system previews remain available.

Phases 03 and 03.1 use native Astro props, slots, and static HTML. There is no component registry, block renderer, framework hydration, state store, or new dependency. Phase 03.1 preserves all Phase 03 public APIs and adds eight business-site components.

## Structure and ownership

```text
src/components/
  ui/
    Container.astro
    SectionHeading.astro
    Card.astro
    Media.astro
    NavigationLinks.astro      # Shared Header/Footer link list
    navigation.ts             # Navigation types
    ContactDetails.astro      # Shared Contact/Footer details
    button/ButtonRoot.astro     # Existing source-owned Starwind primitive
    button/index.ts             # Existing anatomy exports
    internal/controller-lifecycle.ts
  blocks/
    Hero.astro
    Features.astro
    CTA.astro
    Services.astro
    About.astro
    Testimonials.astro
    Contact.astro
    FAQ.astro
    Gallery.astro
  layout/
    Header.astro
    Footer.astro
  ComponentShowcase.astro       # Development fixture composition
  BusinessShowcase.astro        # Phase 03.1 fixtures
src/content/component-showcase.ts
src/content/business-showcase.ts
src/content/business-examples.ts
src/content/contact.ts           # Shared ContactInfo type
src/lib/contact.ts               # Contact URL validation and presence checks
src/pages/components/[theme].astro
src/pages/examples/[theme]/clinic.astro
src/pages/examples/[theme]/construction.astro
src/pages/examples/[theme]/professional.astro
```

Primitives own individual surfaces, controls, content widths, headings, and images. SectionHeading is a small reused composition kept beside the primitives. Blocks own section arrangement. Pages select and order blocks and supply content. Blocks never fetch, import business configuration, select a locale, or know about a provider. A future content adapter can supply the same typed props without changing presentation.

## Public APIs

All components accept `class`, `style`, and relevant native HTML attributes on their root. Presentation defaults that require reliable utility overrides live in scoped CSS in Tailwind's `components` layer. For other utility combinations, do not assume the last class in a string wins: use a local class with deliberate specificity, `style`, or semantic custom properties. No class merging package is introduced.

| Component                | Configuration and content                                                                                                                                     | Slots                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Container                | `width`: `content` (default), `reading`, `wide`, `full`                                                                                                       | default                                               |
| SectionHeading           | `title`, `eyebrow`, `description`; `level`: 1–6 (default 2); `align`: `start` / `center`; `scale`: `heading` / `display`; `headingId`                         | `title`, `eyebrow`, `description`                     |
| ButtonRoot / Button.Root | `variant`: `primary` (default), `secondary`, `outline`; `size`: `sm`, `md` (default), `lg`; existing `disabled`, `focusableWhenDisabled`, native button props | default                                               |
| Card                     | `variant`: `default`, `elevated`, `outlined`                                                                                                                  | default                                               |
| Media                    | required `media`; `priority` (default false); native image attributes including `sizes`                                                                       | none                                                  |
| Hero                     | `layout`: `centered` (default), `split`, `fullBleed`; `title`, `description`, `eyebrow`; `level`: 1–6 (default 1); optional `media`, `mediaPriority`          | `title`, `description`, `eyebrow`, `actions`, `media` |
| Features                 | required readonly `items`; `layout`: `grid` (default), `alternating`; optional `title`, `description`; `level`: 1–5 (default 2); `itemLevel`: 2–6 override    | `heading`                                             |
| CTA                      | `layout`: `centered` (default), `split`; `title`, optional `description`; `level`: 1–6 (default 2)                                                            | `title`, `description`, `actions`                     |

Supply a nonempty title prop or title slot to SectionHeading, Hero, and CTA. Astro cannot statically require a named slot, so these title props are optional to permit slot-only composition. Consumers own this content requirement; rendered showcase tests check nonempty headings. Slots take precedence over simple text props. Optional heading regions do not leave empty wrappers when forwarded slots render nothing. Use phrasing content in title and eyebrow slots; description accepts rich flow content.

Container includes responsive gutters. `full` removes the maximum width while preserving gutters. Section backgrounds belong outside the Container. Card is a neutral `div`, without a fixed heading or business anatomy; compose links, headings, or an article around it as appropriate.

## Structural variants

Hero centered stacks and centers its text, actions, and optional media. Split puts text and media side by side at `lg`, stacking on small screens; without media it remains a single column. FullBleed renders text with section spacing followed by edge-to-edge media. It deliberately avoids text overlays and their image-dependent contrast requirements. Its media retains its intrinsic ratio and may be tall on wide screens; provide an intentionally cropped image through the media slot when the composition needs one.

Features grid renders a semantic list of cards, progressing from one to two to three columns. Alternating renders image/text rows with alternating media positions at `lg`; mobile keeps each image before its text. Items without media use one column. Empty collections render no list; one-item collections are supported. Each `FeatureItem` has `title: string`, optional `description: string`, and optional `media: MediaSource`. Rich section headings use the `heading` slot; per-item rich slots and icon APIs are deferred until there is a demonstrated need.

CTA centered stacks a heading and wrapping actions. Split puts heading and actions in separate columns at `lg`. The actions slot accepts multiple native links or controls. Navigation uses anchors; ButtonRoot always remains a native button.

## Composition examples

```astro
---
import Hero from '@/components/blocks/Hero.astro';
import Features from '@/components/blocks/Features.astro';
import CTA from '@/components/blocks/CTA.astro';
import SectionHeading from '@/components/ui/SectionHeading.astro';
import type { FeatureItem } from '@/components/blocks/Features.astro';
const items: FeatureItem[] = [
  { title: 'Исследование', description: 'Сначала уточняем задачу.' },
  { title: 'Результат' },
];
---

<Hero layout="split" title="Понятный путь к результату">
  <p slot="description">
    Текст со <strong>смысловым акцентом</strong>.
  </p>
  <a slot="actions" href="#contact">
    Связаться
  </a>
</Hero>
<Features {items}>
  <SectionHeading slot="heading" title="Наш подход" level={2} />
</Features>
<CTA id="contact" layout="split" title="Обсудим задачу">
  <a slot="actions" href="mailto:team@example.com">
    Написать
  </a>
</CTA>
```

Use content from a page or adapter for a production site; the literal text above illustrates composition. The actual showcase composes an engineering page with a split hero/grid/split CTA and an editorial page with fullBleed hero/alternating rows/centered CTA. Both compositions render under each theme without changing shared components.

## Media contract

`MediaSource` is exported by `ui/Media.astro`: `{ src: ImageMetadata | string; alt: string; width: number; height: number }`. Local imports and URL strings share the same block layouts. Pass positive, accurate dimensions and meaningful alternative text; use `alt: ''` only for decorative media. No data fetching or asset lookup occurs inside blocks.

Media delegates to Astro Image, supplies widths up to the declared width, defaults to lazy loading, and reserves intrinsic dimensions. Candidate widths are 320, 640, 768, 1024 and the declared width, filtered to avoid upscaling and duplicates. The intermediate 768/1024 candidates were added after Milestone 07A measured mobile photographic overfetch. `priority` / Hero `mediaPriority` sets eager loading and high fetch priority; only use it for the actual LCP image. The default `sizes` is a half-viewport desktop estimate. Hero supplies full-viewport sizes for centered/fullBleed; Features grid supplies one/two/three-column sizes. Override `sizes` on Media in the Hero media slot for more exact page-specific sizing. A custom slot image must provide its own responsive sizing, alt, dimensions, and loading policy.

Authorized remote image optimization requires Astro's `image.domains` or `remotePatterns` configuration. No external host is authorized in this phase. Phase 03.1 adds a local PNG fixture and verifies Astro's optimized image endpoint, responsive candidates, dimensions, and actual image loading in development. Remote CMS delivery and representative production raster assets still need integration verification. Astro's local/remote Image prop union is explicitly narrowed at the final render to satisfy the installed version's types.

## Starwind and styling

Reuse the installed Button primitive 1.0.3, registry 2.2.0, with Runtime 1.5.0. Customize its source directly, preserving `Button.Root`, `ButtonRoot`, and default exports, discovery attributes, and lifecycle support. There is no Button wrapper, anchor masquerading as a button, or new variant utility.

Starwind's styled Card was reviewed. This phase needs only a neutral slotted surface, so Card uses the explicitly permitted minimal project primitive rather than installing a multi-part styled component and preset dependencies. It contains no interactive behavior duplicated from Starwind. Container, SectionHeading, and Media encapsulate demonstrated project layout/content contracts.

Button styling is now a component responsibility rather than repeated page classes. Existing page utility classes still override its layered defaults. Primary hover uses `primary-accent`; secondary/outline hover uses `accent`. Native disabled semantics, focus styling, and inherited reduced-motion tokens remain in place. Disabled controls retain readable contrast instead of using blanket opacity.

All primitives and blocks consume existing Phase 02 semantic roles and Tailwind's standard spacing scale. No palette aliases, component tokens, theme definitions, animation behavior, or theme selection contracts were added.

## Accessibility contracts

Consumers choose heading levels and must preserve a coherent page hierarchy. Features defaults its item headings to one level below its section heading, or the supplied `level` when there is no heading. When the heading slot uses a different level, set `level` / `itemLevel` to match. Use native links for navigation and meaningful accessible names for actions. Native attributes such as `aria-labelledby` and `aria-label` are forwarded; associate IDs with an actual visible heading when naming regions.

Buttons default to `type="button"`. Disabled buttons now emit native `disabled` even when `focusableWhenDisabled` is requested. This prevents activation before initialization and with JavaScript disabled. Starwind removes native disabled and applies its focusable `aria-disabled` behavior when the controller initializes. This intentionally changes the prior server-rendered focusability contract while preserving the enhanced behavior. Ordinary native-disabled buttons require no controller. No custom client behavior was added.

All essential content and native navigation render without JavaScript. There are no hidden-until-script sections, animations, or client-side layout calculations. Phase 03.1 adds a Header adapter for the installed Starwind Collapsible runtime; the existing Button script is unchanged. FAQ and nested navigation use native disclosures.

## Adding a block

Start with one Astro file in `blocks/`. Define a small typed API and native root attributes. Receive content through props and slots, reuse the primitives, and implement only demonstrated structural variants. Keep responsive structure in the block, individual appearances in primitives, and design decisions in semantic tokens. Add deterministic showcase fixtures and behavior-focused browser coverage. Extract another primitive only after repeated use justifies it.

Avoid business configuration imports, hardcoded marketing strings, fetching, universal schemas, renderer registries, runtime themes, redundant Starwind wrappers, and boolean combinations for mutually exclusive layouts.

## Development verification

Run `pnpm dev`; visit `/components/default/` and `/components/alternative/`. The showcase is not linked from public pages, retains the layout's noindex metadata, and returns no static paths in production. `pnpm build` does not emit either route. The existing Phase 02 previews remain available for production token verification.

Astro still emits imported fixture assets while processing route modules, even though showcase/example HTML routes are excluded. They contain only schematic artwork. Avoiding these small unused assets would require a separate route-registration/build mechanism, which these phases do not introduce.

Playwright starts both the production build/preview (4321) and development server (4322). Component tests use development routes; foundation tests still exercise production. The suite verifies all variants, zero/one/multiple feature counts, slot/prop fallback, heading content, media dimensions/loading, layered overrides, actual button text contrast, keyboard focus and disabled activation, both themes, 320/768/1440px layouts, and 200% root text at 640px. It records targeted screenshots and asserts production showcase routes return 404.

These are focused integration and accessibility checks, not an axe audit or WCAG certification. Screen-reader checks, manual browser/OS zoom, real-device testing, remote delivery, and Lighthouse/Web Vitals measurement have not been performed. Phase 03.1 adds meaningful unit tests for contact URL validation and independently optional contact fields.

### Recorded results (2026-11-10)

| Check                                    | Result                                                 |
| ---------------------------------------- | ------------------------------------------------------ |
| `pnpm astro check`                       | Passed: 0 errors, warnings, or hints                   |
| `pnpm lint`                              | Passed                                                 |
| `pnpm format:check`                      | Passed after formatting the pre-existing Phase 03 spec |
| `pnpm test`                              | Passed: 1 foundational unit test                       |
| `pnpm build` (Playwright server startup) | Passed; showcase routes excluded                       |
| `pnpm exec playwright test`              | Passed: 18 tests across Chromium and Firefox           |

Desktop default and mobile alternative screenshots were visually inspected. The first integration run caught a forwarded-slot fallback bug; it was fixed and all final browser checks passed. The format check initially found the Phase 03 spec's existing formatting; its normalization does not change the implementation requirements. Test subprocesses emit harmless `NO_COLOR` / `FORCE_COLOR` environment warnings. Git status was unavailable because the supplied workspace is not a Git repository.

For Phase 04, keep localized dictionaries and future provider mapping outside these components. Validate remote image authorization and real raster assets when that integration exists, and perform the remaining manual accessibility/performance checks against actual production page compositions.

## Phase 03.1 business components

Header and Footer belong to page layout and should normally be siblings of `main`. They do not import business configuration. The six additional content blocks follow the existing flat block architecture. Each accepts native root attributes and `class` / `style`. Section presentation defaults use scoped CSS in the components cascade layer; all colors, fonts, radii, spacing, and elevations use existing tokens. Expanded text can wrap within narrow cards. No new theme or component tokens were necessary.

### New APIs

| Component    | Configuration and content                                                                                                                                                                 | Slots                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Header       | Required unique `id`, `name`, `homeHref`, readonly `items`, `navigationLabel`, `menuLabel`; optional `logo: MediaSource`; `layout`: `standard` (default), `centered`, `overlay`           | `logo`, `actions`, `language`                         |
| Footer       | Required `name`, `homeHref`; `layout`: `simple` (default), `multiColumn`, `extended`; optional `description`, `groups`, `details`, `copyright`, `legal`, `legalLabel`                     | `logo`, `extra` (extended only), `lower`              |
| Services     | Required readonly `items`; `layout`: `grid` (default), `list`, `featured`; optional `title`, `description`; `level`: 1–5 (default 2); `itemLevel`: 2–6 override                           | `heading`                                             |
| About        | `layout`: `split` (default), `editorial`, `minimal`; `title`, `eyebrow`, `description`; `level`: 1–6 (default 2); optional `media`; `mediaPlacement`: `start` / `end` (default) for split | `title`, `eyebrow`, `description`, `media`, `actions` |
| Testimonials | Required readonly `items`; `layout`: `grid` (default), `featured`, `list`; optional `title`, `description`; `level`: 1–6 (default 2)                                                      | `heading`                                             |
| Contact      | `layout`: `details` (default), `split`, `formFocused`; optional `details`, `title`, `description`; `level`: 1–6 (default 2)                                                               | `heading`, `form`, `actions`                          |
| FAQ          | `layout`: `accordion` (default), `simple`, `grouped`; optional `items`, `groups`, `title`, `description`; `level`: 1–4 (default 2); `groupLayout`: `accordion` (default) / `simple`       | `heading`, dynamic `answer-{item.id}`                 |
| Gallery      | Required readonly `items`; `layout`: `grid` (default), `masonry`, `featured`; optional `title`, `description`; `level`: 1–6 (default 2)                                                   | `heading`                                             |

About requires a nonempty title prop or title slot, like Hero. Other content-block section headings may be omitted. Consumers supplying a heading slot must set `level` to match it; Services derives its default item level one below a supplied section heading. FAQ derives group and question levels in the same manner, reserving room for the grouped hierarchy. There are no hidden heading-level assumptions about industry or route.

`NavigationLinks` is a small typed link-list composition used by Header and Footer. It accepts `items` and native `ul` attributes. `ContactDetails` accepts required `details: ContactInfo` and native `div` attributes. It emits no element if all fields are absent or unusable. These compositions reuse HTML rather than add wrappers around existing primitives.

### Content contracts

Types are exported near their owning component except the shared ContactInfo model:

- `NavigationLink` in `ui/navigation.ts`: `{ label, href, current? }`. `NavigationItem` extends it with optional readonly `children: NavigationLink[]`. One nested level is supported. `NavigationGroup` is `{ label, items: NavigationItem[] }` with readonly collections.
- `ServiceItem` in `Services.astro`: `{ id, title, description?, media?, link?: NavigationLink, metadata? }`. `metadata` is plain supporting text without industry-specific fields. Icons can be supplied as decorative/informative image media; no separate icon system was added.
- `TestimonialItem` in `Testimonials.astro`: `{ id, quote, author, role?, organization?, avatar?: MediaSource, rating?: { value, max, label }, source?: NavigationLink }`. Ratings render only when both numbers are finite, `max > 0`, and `0 <= value <= max`. The caller supplies the localized label; the numeric value and maximum remain readable text. No rating is synthesized or inferred from a quote.
- `ContactInfo` in `src/content/contact.ts` (also type-re-exported by ContactDetails): optional `phone: { text, number }`, `email`, `address`, `hours`, readonly `links: NavigationLink[]`, and `map: NavigationLink`. Each field works independently. `hours` and `address` support line breaks. Links use their provided visible labels.
- `FAQItem` in `FAQ.astro`: `{ id, question, answer? }`; supply an answer string or its dynamic rich answer slot. `FAQGroup`: `{ id, title, items: FAQItem[] }`. `grouped` consumes `groups`; the other layouts consume `items`. Item IDs must be unique within each FAQ block so dynamic slots are unambiguous.
- `GalleryItem` in `Gallery.astro`: `{ id, media: MediaSource, title?, caption?, link?: NavigationLink }`. A supplied destination renders as a clearly named caption link; images are not automatically wrapped in duplicate links. Missing captions render no figcaption.

All collections are readonly inputs. Stable item identifiers are used for slot/data identity; the components do not mutate content. There are no deeply nested universal section models or provider imports. Relative page links and fragment links in navigation/services/gallery are trusted page content; validate untrusted CMS data at a future provider boundary.

### Layout behavior and accessibility

Header standard uses a logo, desktop navigation, and optional action region. Centered stacks the brand and navigation. Overlay has a transparent outer shell positioned above the first section on desktop; a theme-aware opaque inner panel protects contrast over arbitrary media. Place it inside a positioned page wrapper and reserve space for its actual content. On mobile it uses normal flow so expanded or no-JavaScript navigation cannot cover the page. This responsive fallback is intentional.

Header renders separate desktop and mobile navigation with CSS controlling visibility; their link markup is shared through NavigationLinks. The mobile button starts hidden and the panel starts visible in server HTML. Starwind Runtime 1.5.0 Collapsible owns panel visibility, IDs, `aria-expanded`, and activation after initialization. The existing Button is its real native trigger. A small adapter closes on Escape, link activation, and outside pointer interaction; Escape returns focus to the trigger. There is no focus trap or modal drawer. Listeners and runtime instances are cleaned up using the existing lifecycle helper. The `language` slot provides composition only, without language-switching behavior.

Nested navigation uses native details/summary, supports a parent destination plus one level of child links, and initially opens a group containing a current link. Do not put interactive markup inside a logo slot when Header already wraps it in the home link. Keep IDs in repeated slots unique. Provide descriptive nav/group/legal labels; `legalLabel` is optional for a single obvious legal nav but should be supplied when multiple landmarks need distinguishing.

Footer simple lays out brand and basic navigation with a lower copyright area. MultiColumn uses responsive groups and optional contact details. Extended adds a separate extra-composition region and a bordered lower area. Empty groups are omitted. Copyright is supplied by the page; there is no hidden date, business lookup, newsletter integration, or generated legal copy.

Services grid uses cards; list uses full-width rows with optional side media; featured gives the first item larger spans and elevation, with a display heading only on large screens. Items without media and zero/one/many item counts are supported. Featured treats the first item as prominent; no separate selection state is needed.

About split places text and media side by side on large screens, with configurable media side. Editorial uses a larger heading and a separate narrower media area. Minimal uses reading width without mandatory imagery. Rich text belongs in the description slot. Custom media slots own their image/accessibility policies.

Testimonials uses `figure`, `blockquote` with optional `cite`, and `figcaption`. Grid distributes cards; featured emphasizes the first quote; list puts quote and attribution in separate desktop columns. Text-only entries work without avatars or ratings. Actual businesses must supply legitimate, consented testimonials and verified ratings. Development fixtures use three short, attributed public-domain quotations from [Oscar Wilde's preface](https://www.gutenberg.org/files/174/174-h/174-h.htm), explicitly labeled as literary typography samples, without customer endorsements or ratings.

Contact details lays out only supplied contact data. Split puts details beside the form slot when both exist. FormFocused uses reading width and puts the form before supporting details in DOM and visual order. The block does not create a form or submit action. Compose labeled native fields or suitable existing primitives in the slot. Showcase forms use a disabled fieldset, disabled Button, and explicit explanatory text. Production forms must be functional or omitted/disabled.

Contact URL helpers omit blank/malformed phone and email values, normalize phone punctuation, encode email local-part special characters, and permit only absolute HTTP(S) map/messaging links without credentials. Invalid entries never become clickable links. This is a focused presentation boundary, not complete international phone/email validation. Missing fields do not produce blank address/list/link elements or an empty Contact body grid.

FAQ accordion uses native details/summary and allows multiple open items. Simple renders all questions and answers without disclosures. Grouped adds category headings and supports either answer structure using `groupLayout`. Question headings are inside the summary. Rich answers use explicit item slots, without HTML-string injection or a rich-text engine. Keyboard behavior works without JavaScript. Empty groups are omitted.

Gallery grid deliberately crops images to a common 16:9 presentation; masonry uses intrinsic ratios and varied column spans; featured spans the first figure across two columns. Masonry is a CSS Grid approximation with normal row gaps, not tightly packed masonry. DOM order remains intact and no JavaScript computes layout. Explicit Media dimensions reserve space; local PNG optimization and responsive candidates are verified. There is no lightbox, upload facility, or external media service.

### Composition examples

```astro
---
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import Services from '@/components/blocks/Services.astro';
import About from '@/components/blocks/About.astro';
import FAQ from '@/components/blocks/FAQ.astro';
import Contact from '@/components/blocks/Contact.astro';
---

<Header
  id="site-header"
  name="Практика"
  homeHref="#about"
  items={[{ label: 'О подходе', href: '#about', current: true }]}
  navigationLabel="Основная навигация"
  menuLabel="Меню"
/>
<main>
  <About id="about" layout="minimal" level={1} title="Понятный подход">
    <p slot="description">
      Описание с <strong>акцентом</strong>.
    </p>
  </About>
  <Services
    layout="list"
    title="Направления"
    items={[{ id: 'research', title: 'Исследование', metadata: 'Первый этап' }]}
  />
  <FAQ
    layout="accordion"
    title="Вопросы"
    items={[{ id: 'preparation', question: 'Что подготовить?' }]}
  >
    <ul slot="answer-preparation">
      <li>Описание задачи.</li>
    </ul>
  </FAQ>
  <Contact title="Связаться" details={{ email: 'team@example.com' }} />
</main>
<Footer name="Практика" homeHref="#about" copyright="© 2026 Практика" />
```

The literal copy illustrates the API; production data comes from the page or content adapter. The actual development examples are three explicit Astro page compositions under each theme:

| Route (replace `{theme}` with `default` or `alternative`) | Composition                                                                                                                    |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `/examples/{theme}/clinic/`                               | Standard header, split hero, service grid, reversed split introduction, quote grid, native FAQ, details contact, simple footer |
| `/examples/{theme}/construction/`                         | Overlay header, fullBleed hero, Features, featured gallery, editorial introduction, featured quote, split CTA, extended footer |
| `/examples/{theme}/professional/`                         | Centered header/hero, minimal introduction, service list, Features, quote list, form-focused contact, multi-column footer      |

Links to all three examples appear in the existing component showcase after the Phase 03 specimens. All six example routes are development-only and retain noindex metadata. No production route is emitted, no page builder selects blocks, and no demo-specific branch exists in a shared component.

### Verification and boundaries

The existing Phase 03 contracts, original component files, theme registry, tokens, and BaseLayout API are unchanged. Existing tests now scope the original disabled-form specimen because the showcase contains multiple forms; their assertions remain intact. Phase 03 viewport screenshots are bounded, and Phase 03.1 records targeted section screenshots and full example-page screenshots.

The installed versions checked were Astro 7.4.8, Starwind Runtime 1.5.0, and Vite 8.3.7. Vite prebundles the Button and Collapsible runtime entry points explicitly to avoid dependency-discovery reloads when browsers visit different development routes. This changes development setup only. No package or lockfile changes are required.

Browser coverage verifies 24 variants in two themes, Starwind mobile menu state and close behavior, native nested navigation, current links, keyboard focus, native FAQ Enter/Space interaction with multiple open answers, slots, zero/one/many collections, valid/omitted contact links, image dimensions/loading and the optimized PNG endpoint, representative layout geometry, landmarks, heading order, disabled forms, actual header text contrast, and absence of demo routes from production. Responsive checks use 320/768/1440px plus 200% root text at 640px. Keyboard checks are automated browser actions, not a manual screen-reader audit. Screenshots are deterministic verification artifacts, not baseline pixel-diff snapshots.

Remaining limitations: no real customer-review/rating data, screen-reader audit, manual browser/OS zoom, real-device testing, remote image delivery, or production Web Vitals/Lighthouse measurements. The example pages are not production websites. Ratings/avatar combinations require verification with the actual supplied content. Local raster image transformation is checked in development; real production image pipelines remain an integration task. Imported schematic fixtures and unreferenced component script chunks may still be emitted as unused assets by the production build, although no demo HTML routes or references to the Header script appear in production pages.

### Phase 03.1 recorded results (2026-11-10)

| Command                                             | Actual result                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm astro check`                                  | Passed: 0 errors, warnings, or hints                                       |
| `pnpm lint`                                         | Passed                                                                     |
| `pnpm format:check`                                 | Passed after formatting-only normalization of the existing Phase 03.1 spec |
| `pnpm test`                                         | Passed: 4 tests across 2 files                                             |
| `pnpm build` (Playwright production-server startup) | Passed; 3 existing static pages, no showcase/example routes                |
| `pnpm exec playwright test`                         | Passed: 40 tests across Chromium and Firefox                               |

Representative clinic desktop, construction mobile, featured-service mobile, and masonry-gallery desktop screenshots were inspected. Early browser runs exposed a long featured heading's narrow-screen overflow and old globally scoped form locators; both were corrected without changing existing component APIs. The initial development dependency-discovery reload was addressed with explicit runtime prebundling. There are no remaining failed or skipped configured tests. Test subprocesses retain the environment's harmless `NO_COLOR` / `FORCE_COLOR` warnings. Git status is unavailable because this workspace is not recognized as a Git repository.

For Phase 04, keep localization and provider validation outside the components. Supply verified business data, licensed real imagery, legitimate testimonial sources, and functional form integrations only when that phase explicitly authorizes them.

References checked against the installed APIs: [Astro components and slots](https://docs.astro.build/en/basics/astro-components/), [Astro images](https://docs.astro.build/en/guides/images/), [Starwind Button](https://starwind.dev/docs/components/button/), [Starwind Collapsible runtime contract](https://starwind.dev/docs/primitives/collapsible/), [Starwind Card](https://starwind.dev/docs/components/card/), [native details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details), [Vite dependency optimization](https://vite.dev/config/dep-optimization-options), [Playwright multiple servers](https://playwright.dev/docs/test-webserver).

## Phase 06 media refinement

Services adds optional `mediaPriority` (default false). It forwards priority only to the first item that has media; all other media retain lazy loading. Public Home/Services compositions enable it because mobile Lighthouse identified the first Services image as LCP within the initial viewport. This is an additive loading control, independent of SEO and content models. Existing showcase behavior and markup defaults remain unchanged.
