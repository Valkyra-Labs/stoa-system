# Roadmap: Stoa as a working system

Decided 2026-09-27. Stoa's job now: be a real design system that the
Tyche (market replay) and Themis (step-checked algebra) demos use for all
of their interface, with every accessibility promise checked. Research
is parked (`experiments/README.md`); the playground is the tool for the
decisions below, not a product.

## One system, two product themes

Tyche and Themis share components and rules and differ by theme. Both
themes are derived by the parameter model from the same parameters,
starting from the presets:

- **Tape** for Tyche: dark-first terminal, warm black, amber emphasis,
  fills not borders, radius 0, compact density.
- **Studio** for Themis: calm and bilingual, cool neutrals, ink-green
  accent, blue/orange above/below target, 6 px control radius,
  comfortable density.

Each theme has light and dark, passes every enforced rule, and is
frozen as a committed snapshot of its parameters (and any overrides)
before the migration builds it.

## Order of work

1. **Themes (owner).** Tune Tape and Studio in the playground; save both
   snapshots. Everything after this reads them.
2. **Migration.** Token sources to DTCG 2025.10; a theme dimension in
   the build (`data-theme-product` or equivalent, times light/dark,
   times density); `known-violations.json` emptied by fixing, not by
   loosening; components read the motion and line-height tokens and stop
   hard-coding literals (the token map lists them); tabular Arabic-Indic
   digits in the numeric face; Heatmap height from the density tokens.
3. **Components the demos need**, each with a story, keyboard and
   screen-reader behaviour, tests, and both themes in its story:
   1. Table (generic; TradeTable rebuilt on it; localisable headers)
   2. Callout (tones, role, action slot)
   3. Skeleton and ProgressBar
   4. EmptyState, and empty or stale states on Ladder, Heatmap, TradeTable
   5. Toolbar and ButtonGroup (roving focus)
   6. AppHeader / PageShell
   7. Math and code display (LTR isolation, `bdi`, `lang`, mono)
   8. StepList (numbered, tone, explanation)
   9. Metric (value, unit, basis, threshold); StatBar on top of it
   10. Kbd, a shortcut hook and a shortcuts Dialog
   11. AlertDialog and an undo Toast
   12. SegmentedControl and Select; exported VisuallyHidden and LiveRegion;
       stories for TextField, Tabs and StatusBadge
4. **Storybook as the public face.** Foundations (tokens per theme, the
   live verification report), components with usage rules, a page on
   how each promise is checked.
5. **Demos.** Tyche on Tape and Themis on Studio, with no hand-rolled
   interface left; loading, empty, error and stale states everywhere;
   deployed when the repositories are opened.

## Working rules for this phase

- One narrow brief per component, one pull request each; local review
  before merge; branches updated from `main` and re-checked before merge.
- No new experiments, no new playground features unless a step above
  needs them.
- Cloud credit goes to component briefs; simple components on the
  cheaper model.
