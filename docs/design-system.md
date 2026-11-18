# Design system

Phase 02 establishes static, CSS-first themes. No runtime theme engine, public theme switcher, new dependency, block library, or animation behavior is introduced.

## Ownership and stylesheet order

`src/styles/global.css` imports Tailwind, `tokens.css`, `themes.css`, and `typography.css` once through `BaseLayout`.

| File             | Responsibility                                                         |
| ---------------- | ---------------------------------------------------------------------- |
| `global.css`     | Entry point, page background, global keyboard focus, container utility |
| `tokens.css`     | Shared reference values, semantic-to-Tailwind mappings, motion tokens  |
| `themes.css`     | Named reference choices and a single set of semantic relationships     |
| `typography.css` | Body defaults and heading font role; no heading-size coupling          |

## Token architecture

1. Reference values: `--palette-blue`, `--font-reference-sans`, and named `--theme-*` choices. Only CSS owns their values.
2. Semantic intent: `--primary`, `--background`, `--body-family`, `--page-gutter`, `--radius`, and related roles. Components consume these roles through utilities or CSS variables.
3. Component tokens: reserved for independent component customization when semantic roles are insufficient. None are needed by this phase. Introduce them alongside their actual component, for example `--button-radius: var(--radius)`; do not add unused tokens preemptively.

Theme selectors override reference choices consistently; semantic relationships are declared once on `:root, [data-theme]`. This also rebinds aliases in a scoped preview rather than inheriting an already resolved root alias. There is no duplicate TypeScript palette or generated CSS.

```css
/* themes.css: selected reference choice */
[data-theme='alternative'] {
  --theme-primary: var(--palette-rust);
}

/* themes.css: shared semantic relationship */
:root,
[data-theme] {
  --primary: var(--theme-primary);
}

/* tokens.css: Tailwind bridge */
@theme inline {
  --color-primary: var(--primary);
}
```

Use `bg-primary text-primary-foreground`, not palette classes in reusable components. Tailwind 4.3's `@theme inline` emits utilities that resolve semantic variables at the consuming element. Tailwind's default spacing, breakpoints, weights, pill radius, and other useful utilities remain available; do not create a parallel numeric scale or construct utility names dynamically.

## Starwind compatibility

Phase 01 installed Button primitive 1.0.3 from registry 2.2.0 and Runtime 1.5.0, not a styled preset. Phase 02 kept its generated source and lifecycle support unchanged and supplied semantic utility classes through the existing `class` prop. Phase 03 adds source-owned default styling and typed variants directly to ButtonRoot; the lifecycle support remains unchanged.

Following current Starwind conventions, this system uses `--card`, `--popover`, `--primary-accent`, `--secondary-accent`, `--error` / `--error-foreground` for destructive states, and `--outline` for focus. It intentionally avoids competing `surface`, `brand`, `destructive`, and `ring` aliases. Each color role has exactly one Tailwind mapping. Future styled Starwind additions must reuse these mappings rather than import another preset wholesale. Info, success, warning, and sidebar tokens are deferred until components require them.

Hover uses `primary-accent` with `primary-foreground`. Keyboard focus uses a 3px outline and 3px offset. Native disabled semantics remain intact. Error examples include explanatory text, so meaning does not depend on color alone.

## Theme selection and registration

`src/config/site.ts` exports the statically known `themes` tuple and derived `Theme` union. Set `siteConfig.theme` to `default`, `alternative`, or the demo-specific `saya`. `BaseLayout` renders the value on `<html data-theme="…">` at build time. The optional typed layout `theme` prop supports verification pages. There is no browser storage, hydration, initial selection script, or runtime class generation.

| Theme         | Identity                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `default`     | Cool neutral surfaces, blue actions, sans typography, compact spacing, geometric corners                                       |
| `alternative` | Cream and rust, serif typography, larger fluid headings and spacing, rounded corners, softer elevation                         |
| `saya`        | SAYA QAM: pine/sage family-clinic identity, self-hosted Noto typography, readable supporting text and compact business spacing |

To add a theme:

1. Add its literal name to `themes` in `src/config/site.ts`.
2. Add `[data-theme='name']` in `themes.css`, overriding the same `--theme-*` choices as the existing themes. Omitted choices inherit the default identity.
3. Select it in `siteConfig.theme` and run checks. The static preview route and parameterized browser suite automatically include it.
4. Verify all text pairs, focus and input contrast, glyphs, responsive layout, and enlarged text before shipping.

No shared component edits or duplicated Tailwind mapping are required.

## Typography and fonts

Roles are `font-body`, `font-display`, `text-display`, `text-heading`, `text-body`, and `text-caption`. Display and heading sizes use `clamp()` with rem minimums and maximums. Utilities carry role-specific line heights; default body leading is 1.6. `tracking-display` varies by theme. Use Tailwind's existing `font-normal` and `font-bold` weights. Semantic heading levels remain independent of visual size.

Example themes use local Arial / Helvetica Neue / sans-serif and Times New Roman / Times / serif stacks. No font file is redistributed, no network request is made, and no font swap is necessary. The installed Windows Arial and Times New Roman Unicode cmap tables were inspected for all required Kazakh characters in both cases: `Ә Ғ Қ Ң Ө Ұ Ү Һ І ә ғ қ ң ө ұ ү һ і`. Both include them; the preview also contains a Kazakh sample.

This is not a cross-platform font guarantee. System rendering and fallback coverage depend on the OS. Before deploying a fixed brand font, choose a licensed self-hosted WOFF2 with verified Russian and Kazakh coverage, declare `font-display: swap`, and measure fallback metrics/layout shift. No unlicensed system font assets are copied into the project.

## Layout and visual treatment

- Keep Tailwind's standard rem spacing scale. Use `px-gutter`, `py-section`, `gap-section`, and `p-panel` for repeated semantic decisions.
- `page-container` centers content with responsive gutters and a theme-defined maximum content width plus gutters. Its width is intrinsic to the viewport.
- `max-w-reading`, `max-w-content`, and `max-w-wide` support distinct width constraints. Full-width sections can wrap a container or omit it. No layout component library is introduced.
- `rounded-sm`, `rounded-md`, and `rounded-lg` derive from Starwind's semantic `--radius`. Tailwind's pill radius remains available.
- `shadow-sm` and `shadow-md` use theme elevation choices. `border` and `input` are semantic color roles.
- `border-hairline` consumes the shared `--border-width` token; focus width and offset are shared tokens. Avoid fixed control heights that could clip enlarged text.

## Motion foundation

Phase 05 extends this foundation with opt-in presets in `motion.css`, imported after typography. Shared tokens add `--ease-enter`, `--motion-stagger`, `--motion-distance`, `--motion-scale`, and `--motion-lift`; existing duration/easing names remain unchanged. See [animations.md](./animations.md) for actual APIs and reduced-motion/fallback behavior. The following describes the original Phase 02 timing-only scope.

`--duration-fast`, `--duration-normal`, `--duration-slow`, and `--ease-standard` provide timing values only. The first duration and easing also supply Tailwind's default transition settings. Reduced-motion media queries resolve all three durations to zero. Future behavior must opt in, use these tokens, and respect reduced motion. No transitions, entrance effects, scroll triggers, or hidden-until-JavaScript content are installed here.

## Preview and verification

The temporary root foundation page uses the configured theme. `/design-system/default/` and `/design-system/alternative/` render the same `DesignSystemPreview.astro` scaffold with static theme props. Links only connect these verification pages; they are not production site navigation. All pages retain `noindex, nofollow`. Remove the temporary scaffold when composing a real site; robots directives are indexing hints, not access control.

The preview shows surfaces, role sizes, Kazakh text, reading/content/wide widths, full-width sections, spacing, borders, shadows, input focus, and the existing Starwind button. Literal preview copy is local to this temporary scaffold; no reusable business blocks or localization dictionaries are implemented.

Playwright tests the production output with page JavaScript disabled in Chromium and Firefox. It validates required semantic color values via computed styles, WCAG text contrast (at least 4.5:1), border/input/focus contrast on relevant surfaces (at least 3:1), keyboard focus, native disabled behavior, 320/768/1440px layouts, and 200% root text enlargement at a 640px viewport. It also checks that both themes change font, primary color, radius, and panel spacing using the same markup. These checks are focused verification, not a full accessibility audit. The text-enlargement check is not a substitute for manual OS/browser zoom testing.

## Tradeoffs and boundaries

Both small theme definitions ship in one stylesheet to keep registration and static previews simple. Theme names exist in TypeScript for type safety; all design values exist only in CSS. Raw Tailwind palette utilities remain technically available, so the semantic-use rule is enforced by convention. No dark mode or automatic brand contrast generation is provided. Component-specific tokens, additional status roles, blocks, dictionaries, animation behaviors, and SEO metadata architecture belong to later phases.

Phase 03 styles source-owned primitives with these semantics and preserves class/style overrides and native keyboard behavior. No new component tokens were necessary. See [components.md](./components.md) for actual APIs, structural variants, media contracts, and development routes. Button's native-disabled fallback now stays disabled until Starwind initializes focusable-disabled behavior; its exports and runtime lifecycle remain intact. Card and section root presentation defaults use the components cascade layer so caller utilities can override them without a class merging dependency.

References: [Tailwind 4 theme variables](https://tailwindcss.com/docs/theme), [Starwind theming conventions](https://starwind.dev/docs/getting-started/theming/).

## Phase 03.1 integration

The business blocks and Header/Footer reuse the existing semantic roles without new tokens, palette mappings, or theme edits. Root presentation defaults remain in the components cascade layer. Gallery uses the established Media contract for SVG and optimized local PNG assets. The overlay Header keeps an opaque `card` panel inside its transparent desktop shell to preserve readable navigation over arbitrary content; mobile falls back to normal flow. Both themes work with every structural variant. See [components.md](./components.md) for APIs and verification boundaries.

## Verification results (2026-11-10)

| Command                     | Result                                                       |
| --------------------------- | ------------------------------------------------------------ |
| `pnpm astro check`          | Passed: 0 errors, warnings, or hints                         |
| `pnpm lint`                 | Passed                                                       |
| `pnpm format:check`         | Passed; Phase 02 spec received formatting-only normalization |
| `pnpm build`                | Passed: three static pages                                   |
| `pnpm test`                 | Passed: one foundational configuration test                  |
| `pnpm exec playwright test` | Passed: eight tests across Chromium and Firefox              |

Desktop and mobile screenshots were also inspected. Browser checks include the actual primary utility mapping, input/placeholder styling, reduced-motion timing, and contrast attachments. Initial test-helper issues (style-tag injection with page scripts disabled and CSS optimizer normalization of `0ms` to `0s`) were corrected. The initial sandbox browser run could not reach the local preview socket; browser verification ran with approved access. Firefox was downloaded after an approved retry of a sandbox DNS failure. Terminal color-environment warnings are harmless and remain external to the implementation.

No WebKit or manual native-browser zoom audit was performed. Automated reflow and text enlargement are covered as described above. Glyph coverage was additionally verified in the installed normal and bold Arial/Times New Roman files for the full Russian alphabet and required Kazakh letters; other platforms still require font verification.
