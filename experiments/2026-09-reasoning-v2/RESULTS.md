# Experiment v2 results

**Status: final under the Claude coding; not validated by a human
coder.** The pre-registered check (the owner's blind coding of 72 files,
Cohen's kappa of at least 0.6) was not carried out, for the reason in
"The archetype variable" below; see the dated deviation in PROTOCOL.md. Run 2026-09-27, protocol `PROTOCOL.md`
(registered in 73b1574), generations merged in PR 7 (6475c3f), analysis
on 33c41ab.

## Run

- 360 generations: qwen3:8b, qwen2.5:14b, qwen3.5:4b x components,
  generic, rules, reasoning x six tasks x five seeds, two turns each,
  llama.cpp with one slot and the prompt cache off.
- Every generation stopped normally and put its file in a fenced block;
  350 of 360 files parse (the 10 that do not count as mismatches).
- Wall time per two-turn generation: qwen3:8b 29.8 s, qwen2.5:14b
  41.1 s, qwen3.5:4b 32.4 s (averages, this machine, M4 Pro 24 GB).
- Reproducibility: 18 of 18 regenerated files byte-identical (below).

## Coding

- 8 Claude (Opus) coders, same prompt, guide and examples, on a seeded
  random partition (deviation recorded before coding). Agreement between
  Claude coders on the 24 double-coded files: archetype 23/24 (kappa
  0.94), KPI row 24/24, task-fit items 69/72.
- Coders applied a few edge rules differently (for example, a FilterBar
  with an empty filter list: one coder counts it as narrowing). The
  partition is random, so this adds noise, not a condition bias; matches
  on P1 and P2 are spread across all 8 batches (1 to 5 per batch).

## Primary result

| model | components | generic | rules | reasoning |
|---|---|---|---|---|
| qwen3:8b | 0.633 | 0.667 | 0.600 | 0.633 |
| qwen2.5:14b | 0.700 | 0.767 | 0.700 | 0.867 |
| qwen3.5:4b | 0.633 | 0.667 | 0.600 | 0.800 |

Archetype match rate per model and condition (n = 30 each).

- Reasoning minus rules, pooled: **0.133**, 95 percent task-bootstrap
  interval **[-0.011, 0.289]**. Per model: +0.033, +0.167, +0.200.
- Guard: reasoning on the dashboard tasks 0.900 against components
  0.933, within the allowed 0.10; holds.
- Pre-registered rule: signal needs at least 0.15 and an interval above
  0, positive in 2 of 3 models, guard holding. The effect is positive in
  all three models and the guard holds, but it is below 0.15 and the
  interval touches 0: **no signal**, a near miss, under the Claude coding.
  It is not a human-validated result and is not a basis for any public
  claim about AI.

## What the numbers show (secondary, labelled)

1. **Ceiling on four tasks.** The inspector, comparison and both
   dashboard tasks are solved by the task wording in every condition
   (0.87 to 1.00). The conditions differ only on the two tasks whose
   structure depends on the shape of the work:

   | task (expected) | components | generic | rules | reasoning |
   |---|---|---|---|---|
   | P1 failed payouts (queue) | 0.20 | 0.20 | 0.00 | 0.47 |
   | P2 what moved and why (explorer) | 0.00 | 0.00 | 0.07 | 0.33 |

   Without reasoning, P2 is a dashboard in 40 of 45 generations and P1 an
   explorer in 30 of 45.
2. **Rules do nothing for these models.** The rules condition includes
   "avoid a row of KPI cards by default"; blind-coded KPI rows: rules
   31/90, components 34/90, generic 43/90, reasoning 43/90. In the Stage 0
   pilot, Claude Sonnet dropped KPI rows from 6/6 to 0/6 under a similar
   list; local models do not follow it.
3. **The plan-to-code gap.** Under reasoning, the plan names the right
   work shape in 28 of 30 P1 and P2 generations, but the file follows it
   in 11 of those 28: qwen3:8b 0 of 10, qwen2.5:14b 6 of 9, qwen3.5:4b
   5 of 9. The models reason correctly in words and then build the
   familiar layout, most of all the 8B model.
4. **The manipulation check passes.** Every reasoning plan (90/90)
   answers the steps in order; the plan-length limit of 150 words is
   exceeded in 72 of 90 reasoning plans against 31 of 270 elsewhere.
5. **Mechanical extractor (v2) is a check only.** It rarely sees pattern
   components, because these models seldom use them (24 of 360
   files); structure is built from Section, Card and DataTable.

## The archetype variable (methodological finding)

- The owner, a senior product designer, could not apply the archetype
  categories with confidence even with rendered screens and worked
  examples: many screens fit several categories at once. The boundaries
  that caused it are the ones the result depends on: explorer, report
  and dashboard (a filterable table among panels; a single table with
  or without narrowing; a list with per-item buttons but no current
  item).
- The Claude coders agreed with each other at kappa 0.94. That shows the
  coding is reproducible by the same model family reading the same
  guide; it does not show that the categories describe the screens
  well. Copies of one model can resolve an ambiguity the same way every
  time.
- The coders' own judgement calls (in their reports) diverge exactly on
  those boundaries, and the contrast between conditions lives on the two
  tasks whose expected archetypes sit there (P1 queue, P2 explorer).
- Consequence: the next experiment does not ask a coder to name an
  archetype. It asks for observable yes/no features of the screen and
  derives the archetype from them by a rule fixed in advance
  (`../stage-3-draft/RUBRIC-DRAFT.md`).

## Reproducibility

A seeded 5 percent (18 generations: 4 qwen3:8b, 9 qwen2.5:14b, 5
qwen3.5:4b, `analysis/repro.mjs`) was regenerated after the run: plan,
raw reply and file are byte-identical in **18 of 18** (`repro/out/`).

## Threats

- One designer's expected archetypes; four of six tasks are at ceiling,
  so the pooled contrast rests on P1 and P2.
- Coding by Claude models only; the categorical archetype variable
  proved ambiguous for a human expert (above).
- Local 4B to 14B models at Q4_K_M; not the models people use to build
  products with. The Stage 0 Claude pilot behaved differently on rules.

## Next

1. Replace the archetype outcome with observable binary features and a
   pre-registered derivation rule; calibrate the rubric on 20 screens
   outside the next sample before freezing it
   (`../stage-3-draft/RUBRIC-DRAFT.md`).
2. The plan-to-code gap is the next hypothesis (for example, a structure
   turn between plan and code), to be pre-registered separately, not
   tuned on these data.
3. A Claude replication with the same protocol.
