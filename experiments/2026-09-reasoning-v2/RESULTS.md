# Experiment v2 results

**Status: provisional.** The pre-registered decision needs the owner's
blind coding of 72 files and Cohen's kappa of at least 0.6 against the
Claude coders; until then every number here is final as data but the
verdict is provisional. Run 2026-09-27, protocol `PROTOCOL.md`
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

## Primary result (provisional)

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
  interval touches 0: **provisional no signal**, a near miss.

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

## Reproducibility

A seeded 5 percent (18 generations: 4 qwen3:8b, 9 qwen2.5:14b, 5
qwen3.5:4b, `analysis/repro.mjs`) was regenerated after the run: plan,
raw reply and file are byte-identical in **18 of 18** (`repro/out/`).

## Threats

- One designer's expected archetypes; four of six tasks are at ceiling,
  so the pooled contrast rests on P1 and P2.
- Coding by Claude models; the owner's agreement is the check that is
  still missing.
- Local 4B to 14B models at Q4_K_M; not the models people use to build
  products with. The Stage 0 Claude pilot behaved differently on rules.

## Next

1. Owner codes 72 files; kappa and the final verdict.
2. If the verdict stays "no signal": the plan-to-code gap is the next
   hypothesis (for example, a structure turn between plan and code), to
   be pre-registered separately, not tuned on these data.
3. Claude replication (Stage 2B) with the same protocol.
