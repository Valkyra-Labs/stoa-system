# Roadmap: Stoa as a working system

Decided 2026-09-27. Stoa's job now: be a real design system that the
Tyche (market replay) and Themis (step-checked algebra) demos use for all
of their interface, with every accessibility promise checked. Research
is parked (`experiments/README.md`); the playground is the tool for the
decisions below, not a product.

## One system, one base theme

Decided 2026-10-03, replacing the two product themes (Tape and Studio)
and the parameter model that derived them: Tyche and Themis share one
base theme, stoa-default, with a light and a dark mode. It is the token
files in `packages/tokens/tokens`; the playground tunes it with overrides
and checks every enforced rule live. Product themes can come back later
as overrides on top of it, once the base passes every rule.

## Order of work

1. **Base theme (owner).** Tune stoa-default's light and dark in the
   playground and write the result back to the token files. Everything
   after this reads them.
2. **Migration.** Token sources to DTCG 2025.10; light/dark times density
   in the build; `known-violations.json` emptied by fixing, not by
   loosening; components read the motion and line-height tokens and stop
   hard-coding literals (the token map lists them); tabular Arabic-Indic
   digits in the numeric face; Heatmap height from the density tokens.
3. **Components the demos need**, each with a story, keyboard and
   screen-reader behaviour, tests, and light and dark in its story:
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
   12. Exported VisuallyHidden and LiveRegion; stories for TextField,
       Tabs and StatusBadge (ChoiceGroup is now a segmented control, and
       Select exists)
4. **Storybook as the public face.** Foundations (tokens in light and
   dark, the live verification report), components with usage rules, a
   page on how each promise is checked.
5. **Demos.** Tyche and Themis on stoa-default, with no hand-rolled
   interface left; loading, empty, error and stale states everywhere;
   deployed when the repositories are opened.

## Working rules for this phase

- One narrow brief per component, one pull request each; local review
  before merge; branches updated from `main` and re-checked before merge.
- No new experiments, no new playground features unless a step above
  needs them.
- Cloud credit goes to component briefs; simple components on the
  cheaper model.
