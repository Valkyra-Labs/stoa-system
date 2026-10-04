# Stoa

[![CI](https://github.com/Valkyra-Labs/stoa-system/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Valkyra-Labs/stoa-system/actions/workflows/ci.yml)
[![License: MIT OR Apache-2.0](https://img.shields.io/badge/License-MIT%20OR%20Apache--2.0-blue.svg)](#license)
[![Unit tests](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Valkyra-Labs/stoa-system/badges/unit-tests.json)](#badges)
[![Browser tests](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Valkyra-Labs/stoa-system/badges/browser-tests.json)](#badges)
[![axe](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Valkyra-Labs/stoa-system/badges/axe.json)](#badges)
[![WCAG 2 contrast](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Valkyra-Labs/stoa-system/badges/contrast.json)](#badges)
[![CSS gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Valkyra-Labs/stoa-system/badges/css-size.json)](#badges)

The test, axe, contrast and size badges are measured and published by CI
from `main`; what each one counts is under [Badges](#badges).

A design system for dense data: trading screens, ledgers, gradebooks,
anything with many live values, many states and little room. It is
built in the open alongside two products that use it,
[tyche-replay](https://github.com/Valkyra-Labs/tyche-replay) (market
replay) and [themis-steps](https://github.com/Valkyra-Labs/themis-steps)
(step-checked algebra).

Status: early. Tokens and a first set of React components are in; more
follow as the products need them.

## Packages

- `@valkyra-labs/stoa-tokens`: design tokens in the W3C Design Tokens
  format, built with Style Dictionary into CSS variables (`--stoa-*`),
  an ES module with TypeScript declarations, and flat JSON.
- `@valkyra-labs/stoa-react`: React components on React Aria.
  - Market data: Ladder and Heatmap on canvas, TradeTable on the
    generic Table, LineChart and EventStrip, each with an empty state
    and a text alternative.
  - DataGrid: a virtualised ARIA grid for large tables, with pinned
    columns, sorting, selection and inline editing
    ([decision and measurements](docs/components/data-grid.md)).
  - Controls: Button (default, primary, secondary, ghost, danger),
    ChoiceGroup, Select, NumberField, TextField, TimeSlider, Slider,
    Toggle, Switch, Checkbox and CheckboxGroup, Tag, FilterChip,
    Toolbar and ButtonGroup, Tabs, Disclosure.
  - Feedback and layout: Callout, EmptyState, Skeleton, ProgressBar,
    toasts (ToastQueue, ToastRegion), StatusBadge, LiveRegion,
    VisuallyHidden, Panel, StatBar and Metric, AppHeader, PageShell.
  - Overlays, lists and content: Dialog, Sheet, AlertDialog,
    ReorderableList, StepList, LogView, CodeView.
  - Keyboard and preferences: Kbd, `useShortcuts`, ShortcutList and
    ShortcutsDialog; ThemeSwitch (System, Light, Dark) and
    LanguageSwitch with the preference hooks behind them.

  Words and digits follow the locale set with React Aria's
  `I18nProvider` (`useStoaFormat`). Stoa's own words exist in English,
  Russian and Arabic; an Arabic locale such as `ar-u-nu-arab` also gets
  Arabic-Indic digits.

## Principles

- **Density is a setting**, not a redesign: `data-density="compact |
  regular | comfortable"` changes row height, cell padding and type
  size together.
- **Colour never carries meaning alone.** Up and down, bid and ask use
  colour and a shape or sign. Contrast is measured rather than claimed:
  `packages/tokens/src/pairs.mjs` lists every colour pair and size that is
  checked and why, `pnpm --filter @valkyra-labs/stoa-tokens verify` prints
  the current numbers, and any failure that is accepted for a while is
  recorded in `packages/tokens/known-violations.json`, which is empty:
  every enforced check passes in both themes and every density. Body
  text meets 7:1 on both surfaces. Twenty measurements are reported but
  not enforced, each with its reason in `pairs.mjs`; twelve of them are
  below their threshold: the decorative `border` rule, the translucent
  depth bars (their sizes are printed beside them), the scrollbar thumb
  (kept quiet on purpose), and the lightness gap
  between up and down (told apart by sign and shape, and by hue for every
  colour-vision model checked).
- **Motion explains a change of state** and follows the user's
  reduced-motion setting, or `data-motion="reduce"` on any element for an
  application's own setting: every duration token goes to zero.
- **Right-to-left from the start**: logical properties only, and a type
  stack with IBM Plex Sans Arabic.
- **Numbers are tabular** and prices align on the decimal point.

## Tokens

- Colour: a cool neutral scale, one blue accent, teal for up and bid,
  red for down and ask, amber for warnings; OKLCH; light and dark themes
  (`data-theme`, or the system setting when unset).
- Type: IBM Plex Sans, Plex Sans Arabic and Plex Mono, with Noto Sans
  Arabic after Plex Mono in the numeric stack for tabular Arabic-Indic
  digits (all SIL OFL 1.1).
- Space on a 4 px grid; radii from 0 to 8 px.
- Motion: fast 80 ms, base 160 ms, slow 240 ms, value flash 600 ms.

## Development

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm -r typecheck
pnpm test
```

`pnpm test:e2e` runs the playground's browser tests (it needs the
Chromium that `pnpm --filter playground exec playwright install chromium`
downloads), `node scripts/token-map.mjs --check` fails when the token map
in `docs/generated/` is stale, and `pnpm storybook` serves the stories.
`pnpm build-storybook` builds the stories into `storybook-static/`, and
`pnpm --filter @valkyra-labs/stoa-react test:stories` runs the browser
tests against that build, the axe sweep over every story among them.
The playground, the tool the tokens are tuned in, is described in
[apps/playground/README.md](apps/playground/README.md). How to contribute,
and what every change has to pass: [CONTRIBUTING.md](CONTRIBUTING.md).

### Badges

CI publishes the dynamic badges from each green run on `main` to the
`badges` branch, as JSON that img.shields.io reads; `scripts/badges.mjs`
builds them from that run's own output and stops, publishing nothing,
when a value cannot be read.

- Unit tests: tests passed, summed over Vitest and node:test in every
  package and the root scripts (`pnpm test`).
- Browser tests: Playwright tests passed in Chromium, the playground's
  (`pnpm test:e2e`) and the stories' against the built Storybook
  (`test:stories`).
- axe: axe-core 4.13.0 over every story in the built Storybook's index,
  in four modes: light and dark, each left to right in English and right
  to left in Arabic. A serious or critical violation fails the run;
  moderate and minor ones are not counted.
- WCAG 2 contrast: enforced text and non-text contrast checks passing,
  out of all enforced ones (`verify`, `dist/verify.json`), and how many
  failures `known-violations.json` accepts. Reported-only measurements
  are not in it.
- CSS gzip: the built `styles.css` and `tokens.css`, gzip level 9.

## License

MIT OR Apache-2.0, at your option. Fonts: SIL Open Font License 1.1.
