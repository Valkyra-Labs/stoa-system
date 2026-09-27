# Pilot results: design reasoning and AI screen structure

Run 2026-09-27. Protocol: `PROTOCOL.md` (committed before generation,
22e1fa4; deviations listed there). Generators: Claude Sonnet 5 and
Claude Haiku 4.5, one fresh subagent per generation, 36 generations.
Blind coder: Claude Opus 5.5, one subagent for all 36 files, comments
stripped, condition and model hidden. Raw data: `generations/`,
`analysis/results-primary.txt`, `analysis/blind-coding.json`.

## Primary result (pre-registered rule): no signal

| model / condition | M1 generic-dashboard rate | M2 divergence ratio |
|---|---|---|
| Sonnet A (vocabulary) | 0.33 | 1.06 |
| Sonnet B (+ decision layer) | 0.00 | 1.15 |
| Sonnet C (+ generic advice) | 0.00 | 1.25 |
| Haiku A | 0.00 | 0.69 |
| Haiku B | 0.17 | 1.99 |
| Haiku C | 0.00 | 0.97 |

M1 is the share of generations with a mechanically coded KPI row (F1) and
the order header, metrics, chart, table (F3). M2 is the between-task
divided by the within-task edit distance of the region sequence (F10).
The rule needed B's M1 to be at least 0.3 lower and its M2 at least 0.2
higher than both A and C, in both models. It fails in both models. We
claim nothing about AI from this pilot.

## Why the primary metrics could not show much (lessons, not excuses)

1. **Floor effect in M1.** The strict generic order needs a chart, and
   most generations left the chart out. A and C sit at 0 in three of
   four cells, so "0.3 lower" was impossible there before any run.
2. **Coding misses.** Mechanical F1 agrees with the blind coder on
   29/36. Pattern slots were expanded only at the top level. So a
   ReviewQueue inside a Section counted an Inspector's Metric strip as
   a KPI row (gip3g), and Dashboard shells with array data were missed
   (5 cases).
3. **M2 measures sequence noise, not structure.** Edit distance over
   coarse region kinds moves with every extra Section. It does not
   track the archetype change visible in the blind coding below.
4. **A confound in condition B.** B's "Avoid" list names the measured
   features outright: "A row of KPI cards by default", wrapping in a
   Card, an unneeded sidebar. Any drop in F1, F2 or F8 under B is at
   least partly plain rule-following, not reasoning. C had no rules of
   equal specificity.

## Secondary analysis (blind manual coding, labelled, not the decision)

| model / condition | KPI row | generic layout | archetypes, T1 / T2 / T3 | task-fit (M3) |
|---|---|---|---|---|
| Sonnet A | 6/6 | 4/6 | dashboard x2 / dashboard x2 / queue x2 | 0.78 |
| Sonnet B | 0/6 | 0/6 | queue, explorer / explorer x2 / queue x2 | 0.94 |
| Sonnet C | 5/6 | 4/6 | dashboard x2 / dashboard x2 / queue x2 | 0.78 |
| Haiku A | 5/6 | 4/6 | dashboard x2 / dashboard x2 / explorer x2 | 0.17 |
| Haiku B | 2/6 | 1/6 | report, dashboard / other, explorer / queue x2 | 0.56 |
| Haiku C | 4/6 | 4/6 | dashboard x2 / dashboard x2 / queue x2 | 0.50 |

M3 per item, summed over 6 (a / b / c): Sonnet A 6/4/4, B 6/5/6, C 6/4/4;
Haiku A 3/0/0, B 5/4/1, C 5/0/4.

What this suggests, at n = 6 per cell and with the confound above:

- Without the decision layer, both models build a dashboard for the
  teacher and the portfolio manager (8 of 8 per model across A and C)
  and a queue or explorer for the payments analyst. The template pull
  is task-dependent: a task that names a list to work through escapes
  it on its own.
- With the decision layer, Sonnet built no dashboard in 6/6; its
  task-fit rose most on "evidence reachable from the item" and
  "progress visible", items the Avoid list does not name. Haiku moved
  less and less consistently.
- Generic advice of equal length (C) changed nothing structural against
  the baseline, in either model.

## Decision

- No public claim. The pre-registered rule says no signal. The
  secondary pattern is promising only for the stronger model and is
  partly confounded.
- A full run is justified only after these fixes, pre-registered
  again:
  1. add condition D, the Avoid list and rules without the
     intent-to-pattern chain, to separate reasoning from the rule list;
  2. make the primary structural outcome the blind archetype and KPI
     row judgement, with the mechanical coder as a check (slots
     expanded at any depth);
  3. replace M2 with the share of generations whose archetype matches
     a pre-declared expected archetype per task;
  4. add at least three more tasks where the dashboard is the right
     answer, so avoiding dashboards is not rewarded by construction.
- Whether the decision layer stays as documentation for human readers
  is decided separately, as the protocol says.
