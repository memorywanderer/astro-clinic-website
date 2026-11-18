# Animations — Phase 05

Motion is opt-in and independent of business blocks. `src/styles/motion.css` owns interpolation and presets; `src/lib/motion/reveal.ts` only activates visibility states. There are no animation dependencies, scroll listeners, timers, per-frame JavaScript, hydration, or global motion store.

## Composition API

Import `motion/Motion.astro` once in a page that needs observed reveals. Astro bundles and deduplicates its script. The stylesheet is imported by global CSS. Native root attributes and existing slots remain the integration boundary; blocks import no controller and gain no animation props.

```astro
---
import Motion from '@/components/motion/Motion.astro';
import RevealText from '@/components/motion/RevealText.astro';
---

<Motion />
<Hero layout="split">
  <RevealText slot="title" text={title} />
  <div slot="media" data-motion="image" class="motion-media">
    <Media media={image} priority />
  </div>
</Hero>
<Services items={services} data-motion="fade-up" data-motion-group />
<About title={aboutTitle}>
  <div slot="media" data-motion="image">
    <Media media={image} />
  </div>
</About>
<Gallery items={gallery} data-motion="scale" data-motion-group />
```

| API                                       | Behavior                                                      |
| ----------------------------------------- | ------------------------------------------------------------- |
| `data-motion="fade"`                      | Opacity reveal                                                |
| `data-motion="fade-up"`                   | Opacity and upward translation                                |
| `data-motion="scale"` / `"image"`         | Subtle scale and opacity for elements/media                   |
| `data-motion-group`                       | One observed root activates descendant `[data-item]` elements |
| `data-motion-repeat="true"`               | Replay after leaving and reentering; default is once          |
| `--motion-duration`, `--motion-delay`     | Optional local CSS timing overrides                           |
| `--motion-stagger`, `--motion-index`      | CSS stagger interval and item index                           |
| `<RevealText text={text} mode="words" />` | Build-time plain-text word reveal (default)                   |
| `<RevealText text={text} mode="mask" />`  | Whole-text translation inside a static clipping region        |
| `.motion-scroll-scale`                    | Native view-timeline image scale with static fallback         |
| `.motion-media`                           | Optional overflow clipping wrapper                            |
| `.motion-lift`, `.motion-underline`       | Hover/focus micro-interactions                                |

Use known preset values. This is an author-controlled HTML/CSS API, not a runtime configuration parser. Unknown values receive the generic opacity reveal but are not a supported extension mechanism. Native class/style overrides remain available.

Group stagger uses Services/Gallery's existing item markers. CSS `nth-child` assigns delays capped after the sixth item, without a runtime indexing loop or per-child observers. Custom lists can use the same markers or supply indices at build time. Word indices are generated at build time and capped at six intervals. Keep revealed text short. A group activates when its root intersects: items in a tall list can finish before being seen. Use individual roots for those compositions. Avoid nested reveal roots/groups and use separate layers when combining scroll and entrance transforms.

## Tokens

The existing `--duration-fast` (150ms), `--duration-normal` (300ms), `--duration-slow` (500ms), and `--ease-standard` remain unchanged. Shared semantic motion tokens add `--ease-enter`, `--motion-stagger` (60ms), `--motion-distance` (1rem), `--motion-scale` (0.96), and `--motion-lift` (0.125rem) in `tokens.css`. Themes or compositions can override them. No unused exit-easing token is introduced. Mask travel is relative to its text box.

```html
<p
  data-motion="fade-up"
  style="--motion-duration: var(--duration-normal); --motion-delay: var(--motion-stagger)"
>
  ...
</p>
```

## Activation and lifecycle

Content renders visibly. Only a successful IntersectionObserver callback applies `data-motion-state="active"`, starting CSS animation. There is no hidden pending state or global `.js` gate. A small visible-to-entrance change at the viewport boundary is accepted in exchange for fail-open behavior. Initially intersecting content completes statically, protecting immediate Hero/LCP paint. Hero title/media can opt into motion without delaying initially visible content.

One document-scoped observer uses threshold zero. Once targets are unobserved after entry; repeat targets remove their state on exit. Completion is recorded on the element so back/forward-cache restoration does not replay once targets. Focus inside a target cancels movement and unobserves it, including repeat targets. Controls never wait for completion. Initialization errors disconnect observation and clear animation state.

`Motion.astro` initializes during normal document module execution, cleans up on `pagehide`, and reinitializes on persisted `pageshow`. Cleanup disconnects observation and removes focus/preference listeners. Static document navigation and Header/Starwind lifecycle stay unchanged. There is no ClientRouter or synthetic Astro navigation support: review initialization explicitly if client routing is introduced. Dynamic content insertion is outside this static site's contract; no MutationObserver is installed.

## Reduced motion and CSS timelines

All decorative motion rules are inside `prefers-reduced-motion: no-preference`. Reduced-motion content immediately uses its static appearance even with local duration/delay overrides. The controller skips observation and responds to preference changes by disconnecting and clearing active states. Functional visibility, such as navigation disclosure state, is never overridden.

```astro
<div class="motion-media">
  <Media media={image} class="motion-scroll-scale" />
</div>
```

The scroll example uses `animation-timeline: view()` and `animation-range: entry 0% cover 50%` behind a combined `@supports` guard. The animation shorthand precedes the timeline declaration to avoid resetting it. Unsupported browsers get an ordinary image; reduced-motion users receive the same static result. No JavaScript reproduces decorative scroll progress. The CSS effect also works without JavaScript and never hides the image.

## Typography and accessibility

RevealText accepts plain strings only, never splits rich HTML, and introduces no interactive content. A visually hidden span preserves the original accessible text; visual fragments have `aria-hidden="true"`. The containing heading retains its native semantics. Whitespace, punctuation, Russian/Kazakh characters, combining marks, and emoji are preserved. Words use inline blocks and responsive whitespace wrapping rather than measured lines. Long words can wrap within available width. Masking clips a static region and animates only inner transform/opacity, not clip-path or layout.

Browser accessibility-role queries check coherent heading names; manual assistive-technology testing remains separate. Word boundaries can affect typography: choose ordinary text or whole-text mode when exact shaping is essential. Responsive line splitting is deferred because font loading, localization, and resizing would require an additional measurement lifecycle.

Lift transitions use transforms and preserve native focus outlines. Underline offset changes instantly on hover/focus, without animating layout properties. Hover effects are limited to fine pointers with hover capability. Neither effect hides controls.

## Extending and verifying

Add a preset mapping to `--motion-from-transform` and reuse `motion-reveal`; do not add a JavaScript interpolation branch. A genuinely different effect can add scoped keyframes. Preserve static defaults, reduced-motion guards, focus handling, reserved dimensions, and token overrides. Avoid persistent `will-change`, layout animation, blur, large animated regions, and unnecessary wrappers. Keep images on the existing Astro Media optimization path.

Development-only `/motion/default/` and `/motion/alternative/` demonstrate Hero, Services, About, Gallery, all presets, Russian/Kazakh words, masking, repeat, focus, and native scroll scaling. Production excludes these routes. Localized public pages opt into Hero words, Services stagger, and About fade to provide a production measurement sample.

Browser coverage includes no JavaScript under both motion preferences, preference changes, once/repeat behavior, coherent headings, observer cleanup, missing-observer fallback, native navigation, timeline/static behavior, responsive layout, and stable image dimensions. Chromium additionally records production layout shifts and script sizes. This bounded sample does not establish all performance budgets or WCAG conformance.

Optional page transitions are deferred. Native cross-document transitions can be evaluated independently without changing navigation; no routing changes or transition flags are added here.

References reviewed against installed Astro 7.4.8 and Playwright 1.65.0: [Astro scripts](https://docs.astro.build/en/guides/client-side-scripts/), [CSS animation timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline), [Playwright emulation](https://playwright.dev/docs/emulation).

## Recorded verification — 2026-11-10

| Command                                                                                                             | Actual result                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm astro check`                                                                                                  | Passed: 70 files, zero errors, warnings, or hints                                                                                 |
| `pnpm lint`                                                                                                         | Passed                                                                                                                            |
| `pnpm format:check`                                                                                                 | Passed after formatting the changed config and pre-existing Phase 05 spec                                                         |
| `pnpm test`                                                                                                         | Passed: 20 tests across four files, including six text-segmentation cases                                                         |
| `pnpm build`                                                                                                        | Passed: seven static pages, three optimized image variants; motion showcase excluded                                              |
| `pnpm exec playwright test`                                                                                         | Passed: 81 tests; two expected skips for the Chromium-only performance sample                                                     |
| `pnpm exec playwright test tests/e2e/motion.spec.ts`                                                                | Passed after strengthening timeline-progress assertions: 25 tests, two expected performance skips, across Chromium/Firefox/WebKit |
| `pnpm exec playwright test tests/e2e/motion.spec.ts --grep 'scroll timeline\|production motion' --project=chromium` | Final measurement/settled screenshot follow-up: two passed                                                                        |

The production `/kk/` Chromium sample recorded CLS **0** during navigation and the tested scroll sequence. Astro inlined **1,169 bytes** of minified motion JavaScript (uncompressed). Existing external Button/Header/lifecycle scripts were also recorded separately; these are not added motion payload. Saved metrics and timeline-support JSON live under Playwright's `test-results/` and are replaced on subsequent runs. The alternative-theme settled full-page screenshot was visually inspected. Browser tests also verify 320px text wrapping, both themes, no JavaScript under both preferences, focus cancellation, and observer count returning to zero during cleanup/reduced motion.

All three installed engines accepted the guarded timeline syntax and demonstrated changing transforms as scroll progressed. An actual older engine without timeline support was not available; its static fallback is implemented through CSS feature detection but that engine path was not directly exercised. WebKit 27.2 (Playwright revision 2388) was installed for these checks; it is not a substitute for testing Safari on Apple hardware.

Initial failures exposed a test viewport that already included Services (correctly skipping its entrance), missing WebKit, Astro test-server locks/background lifecycle, and formatting. These were resolved. Later sandbox server-start stalls were interrupted and the relevant tests passed outside the sandbox. Harmless `NO_COLOR`/`FORCE_COLOR` warnings remain. No configured final check failed; two performance tests are deliberately skipped outside Chromium. The workspace is not recognized as a Git repository, so a Git diff/status report is unavailable.

Limits: no manual screen-reader/OS-zoom audit, real-device Safari check, full performance trace, long-session heap profile, or Lighthouse/Web Vitals budget certification was performed. Stable image layout, sampled CLS, and observer cleanup are verified, not universal jank-free rendering. Optional responsive line splitting and page transitions remain deferred. For Phase 06, preserve the static content/motion boundary and measure real production assets and compositions before adding more effects.
