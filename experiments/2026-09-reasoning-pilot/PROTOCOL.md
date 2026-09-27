# Pilot: does design reasoning change the structure of AI-built screens?

Pre-registered before any generation. The commit that adds this file is
the timestamp; nothing below changes after the first generation except
in a dated "Deviations" section.

## Hypothesis

H1. Given the same component vocabulary, a model that also receives
Stoa's decision layer (intent -> information -> decision -> pattern)
builds screens whose structure differs more between tasks and less
toward the generic dashboard than a model without it, and more than a
model given generic UI advice of the same length.

H0. The decision layer changes styling or wording at most; structure
stays at the generic composition (header, row of KPI cards, chart,
table), as with the other conditions.

We do not claim that screens are better or more beautiful. Only
structure is measured.

## Design

- Tasks (3), each a prompt of two sentences, in `prompts/`:
  T1 a teacher reviewing a class's progress after a unit test;
  T2 a portfolio manager checking what moved today and why;
  T3 a payments operations analyst working through failed payouts.
- Conditions (3), in `conditions/`, each a system context given with
  the prompt:
  A baseline: the component vocabulary only (names, props, one line
    each);
  B Stoa reasoning: the same vocabulary plus the decision layer v0;
  C length control: the same vocabulary plus generic UI best-practice
    advice of about the same length as B's decision layer.
- Models (2): Claude Sonnet and Claude Haiku, each generation in a fresh
  subagent with no other context.
- Samples: 2 per task x condition x model. Total 3 x 3 x 2 x 2 = 36.
- Output: one TSX file per generation, a single page component that
  uses only the vocabulary's components and plain layout elements; no
  styling beyond the vocabulary. Saved verbatim in `generations/`.

## Structural features (coded mechanically from the JSX tree)

Coded by `analysis/features.mjs` (TypeScript compiler API), fixed before
generation:

F1 kpi_row: a run of 3 or more Metric (or Card containing one number)
   siblings in the first two top-level regions (0/1).
F2 sidebar: a Sidebar or a navigation region beside the main content (0/1).
F3 generic_order: top-level region order matches header, metric row,
   chart, table (0/1).
F4 regions: number of top-level regions of the page (integer).
F5 filters: none / inline controls / FilterBar / saved views (category).
F6 drilldown: an Inspector, DetailPanel, Drawer or row-selection that
   opens detail (0/1).
F7 comparison: none / side-by-side entities / delta columns / baseline
   reference (category).
F8 card_share: share of leaf data components wrapped in a Card (0..1).
F9 archetype: the first-level pattern component if any (Explorer,
   Compare, Inspector, Monitor, ReviewQueue, Dashboard, none).
F10 sequence: the ordered list of top-level component types (for edit
   distance).

## Metrics

M1 Generic-dashboard rate: share of generations with F1 = 1 and
   F3 = 1, per condition.
M2 Structural divergence ratio: mean normalised edit distance of F10
   between generations of different tasks divided by the mean between
   generations of the same task, per condition. Higher means structure
   follows the task more than a template.
M3 Task-fit checklist: per task, three pre-written items that the task
   needs (listed in `prompts/`), each 0/1, coded mechanically where
   possible; reported, not used for the decision.

## Decision rule (pilot)

- Signal: condition B has M1 at least 0.3 lower than both A and C, and
  M2 at least 0.2 higher than both A and C, in both models.
- No signal: otherwise. Then we record the negative result, do not
  claim anything about AI in public, and decide separately whether the
  decision layer is still worth keeping for human readers.
- 36 generations cannot establish effect sizes; the pilot only decides
  whether a full run (about 960 generations) is justified.

## Threats

Same vocabulary in all conditions (only B mentions patterns such as
Explorer; A and C have the same component names available, including
the pattern components, so B is not the only one able to use them).
Prompts are fixed and neutral. Order of generation randomised. Coding is
mechanical; any manual coding is marked and done blind to condition.

## Coding rules (fixed with the extractor, before generation)

Checked against hand-coded fixtures by `analysis/check-fixtures.mjs`.

- Root: the JSX returned by the default-exported component. Local helper
  components defined in the same file are inlined.
- Regions: the children of `Page` (and of single `main`/`div` wrappers
  under it). A `Page` with a `title` counts as a header region first.
- A pattern component at the top level is expanded into its slots in
  declared order (Dashboard: metrics, charts, table; Explorer: toolbar,
  table, detail; and so on), so the Dashboard pattern and a hand-built
  dashboard code the same.
- Region kind (F10), first match: Header or h1-h3 -> header; 2+ Metric
  -> metrics; DataTable -> table; Chart -> chart; Comparison ->
  comparison; Inspector or Drawer -> detail; Timeline or AuditLog ->
  history; FilterBar or SavedViews -> filters; an empty pattern slot ->
  the slot's kind; otherwise the component name.
- F1 counts in the first two non-header regions; a Dashboard `metrics`
  or Monitor `signals` slot with an array of 3+ items counts as a row.
- F5 "inline" means Button, Tabs, input or select without a FilterBar.
- F7 precedence: side_by_side (Comparison or Compare), then baseline (a
  Delta with a `basis`), then delta, then none.
- M2: pairs are formed within one condition and model; the within-task
  mean is floored at 0.05 so identical samples do not divide by zero.
- M3: coded after generation by a separate subagent that sees only the
  opaque file ids and the checklists, not the condition or model.

## Procedure

1. `analysis/plan.mjs` writes `manifest.json`: 36 runs with opaque ids
   in a seeded random order (committed with this file).
2. Each run is one fresh subagent (Claude Sonnet 5 or Claude Haiku 4.5)
   given `prompts/template.md` filled with the condition file and the
   task prompt; it writes one file, which is copied unchanged to
   `generations/<id>.tsx`.
3. A generation that does not parse, or has no JSX, is re-run once with
   the same prompt and recorded under Deviations.
4. `analysis/metrics.mjs` computes M1 and M2 and applies the decision
   rule; M3 is merged from `analysis/m3.json`.

## Deviations

- 2026-09-27, before the first generation: the filled prompt is
  delivered as a file the subagent reads once (its only read), instead
  of inline in the subagent call. The text is identical; the change
  only saves context in the orchestrating session.
