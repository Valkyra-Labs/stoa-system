# Stoa

A design system for dense data: trading screens, ledgers, gradebooks,
anything with many live values, many states and little room. It is
built in the open alongside two products that use it,
[tyche-replay](https://github.com/Valkyra-Labs/tyche-replay) (market
replay) and [themis-steps](https://github.com/Valkyra-Labs/themis-steps)
(step-checked algebra).

Status: early. Tokens are in; components follow as the products need
them.

## Packages

- `@valkyra-labs/stoa-tokens`: design tokens in the W3C Design Tokens
  format, built with Style Dictionary into CSS variables (`--stoa-*`),
  an ES module with TypeScript declarations, and flat JSON.
- `@valkyra-labs/stoa-react` (next): React components on React Aria.

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
  text meets 7:1 on both surfaces. Ten measurements are reported but not
  enforced, each with its reason in `pairs.mjs`: the decorative `border`
  rule, the translucent depth bars (their sizes are printed beside them),
  and the lightness gap between up and down (told apart by sign and
  shape, and by hue for every colour-vision model checked).
- **Motion explains a change of state** and follows the user's
  reduced-motion setting: every duration token goes to zero.
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
pnpm install
```

```bash
pnpm build && pnpm test
```

## License

MIT OR Apache-2.0, at your option. Fonts: SIL Open Font License 1.1.
