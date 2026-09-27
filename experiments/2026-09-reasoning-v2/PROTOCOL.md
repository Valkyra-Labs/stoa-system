# Experiment v2: does design reasoning add anything beyond rules?

Pre-registered. The commit that adds this file precedes the first
generation; after it, only the dated "Deviations" section changes. The
owner reviewed the draft (`PROTOCOL-DRAFT.md`) and accepted the tasks,
their expected archetypes, blind coding by the owner, and five seeds.
Stage 0 (`../2026-09-reasoning-pilot/`) is kept unchanged; its lessons
are the reason for every choice below.

## Question

Given the same component vocabulary, does a model that is asked to
reason about the work (who, how often, the shape of the work, the
decision and its evidence) build a screen whose structure fits the task
more often than a model given a list of good interface rules of the same
length? And does either beat the vocabulary alone and generic advice?

H1 (primary). Reasoning raises the rate at which the screen's archetype
matches the task's expected archetype, compared with rules.
H0. Reasoning and rules produce the same match rate.

Guard. On tasks where a dashboard is the right answer, reasoning must
not lower the match rate against the vocabulary alone. Avoiding
dashboards everywhere is not a success.

## What changed since Stage 0, and why

| Stage 0 problem | v2 answer |
|---|---|
| Condition B named the measured features ("avoid KPI cards") | Rules and reasoning are separate conditions; the reasoning text names no layout feature and no pattern component |
| Condition B mapped intents to patterns (`review -> ReviewQueue`) | Reasoning describes task properties only; the pattern is left to the model |
| Floor effect in the generic-dashboard metric | Primary outcome is archetype match per task, including tasks where a dashboard is correct |
| Mechanical extractor agreed with blind coding on 29/36 | Primary outcome is blind coding against a closed set; the extractor is a secondary check, fixed to expand pattern slots at any depth |
| Divergence metric tracked noise | Dropped |
| Harness context, uncontrolled sampling | Local models through the ollama HTTP API; every option recorded per generation |
| Calibration: the planning comment was written in 1 of 4 | Two turns for every condition: first the plan, then the file |
| Calibration: a fixed seed did not reproduce output under ollama | llama.cpp server with one slot and the prompt cache off reproduced a sampled generation byte for byte (3 of 3); it becomes the engine, and a random 5 percent of files is regenerated to check |

## Conditions (all word-count matched within 5 percent, except A)

- A, components: the vocabulary only.
- G, generic: vocabulary + generic interface advice.
- U, rules: vocabulary + concrete interface rules, including the avoid
  list.
- R, reasoning: vocabulary + the reasoning questions, no rules, no
  pattern names, no named layout features.

Drafts: `conditions/`. The generic text will be trimmed to match.

Every generation has two turns in one conversation:
1. The condition as system context and the task; the model is asked for
   a plan in under 150 words (A: what the screen is for and how it is
   laid out; G: goal and layout; U: which rules shape it; R: answers to
   steps 1 to 5). No code.
2. "Now write the file." Same output instruction as the calibration.

The plan is kept and coded for compliance (did it do what its condition
asked). Compliance is reported per cell and is the manipulation check.

## Tasks and expected archetypes

Six tasks, two of them dashboard-correct, with prompts, expected
archetypes and three task-fit items each in `prompts/tasks.json`. The
expected archetypes were set by the owner (a senior product designer)
before any generation:

| id | expected |
|---|---|
| P1 payments analyst, failed payouts | queue |
| P2 portfolio manager, what moved and why | explorer |
| P3 teacher preparing to meet a parent about one student | inspector |
| P4 adviser choosing between two funds | comparison |
| P5 head of school presenting the term to the board | dashboard |
| P6 finance director's Monday glance at weekly numbers | dashboard |

Closed archetype set for coding: dashboard, explorer, queue, inspector,
comparison, report, other, defined in `analysis/CODING-GUIDE.md`.

## Models and sampling

Engine: llama.cpp server (build recorded per generation), one slot,
context 8192, `cache_prompt: false`, `runner/llama.mjs`. Two turns per
generation (plan, then file). temperature 0.7, top_p 0.8, at most 4096
output tokens per turn, seeds 1 to 5, thinking off where the model has
it.

Main models (GGUF, Q4_K_M, digests recorded per generation):
- qwen3.5:4b: `bartowski/Qwen_Qwen3.5-4B-GGUF`,
  `Qwen_Qwen3.5-4B-Q4_K_M.gguf`, sha256 13c16f42...a983 (Apache-2.0,
  base `Qwen/Qwen3.5-4B`); ollama's own file does not load in llama.cpp;
- qwen3:8b and qwen2.5:14b: the weights ollama holds.

Size: 3 models x 4 conditions x 6 tasks x 5 seeds = 360 generations,
listed in `plan.json` (built by `analysis/plan.mjs`, seeded). The server
holds one model at a time, so runs are grouped by model in a shuffled
model order and shuffled within each model. A random 5 percent (18) is
regenerated after the run and compared byte for byte.

Exploratory, reported separately and not in the decision: deepseek-r1:8b,
qwen3:1.7b, qwen2.5:3b, gemma4 26B. A small Claude replication follows
as a separate protocol.

## Coding

- Blind coder: one Claude subagent (Opus) codes every file with the
  prompt in `analysis/coder-prompt.md`, the guide, and files prepared by
  `analysis/blind.mjs` (comments stripped, plan turn left out, condition
  and model hidden behind opaque ids, expected archetypes not shown).
- Second coder: the owner codes a random 20 percent (72 files, drawn
  with a seed after generation) through a blind coding page, without
  seeing the first coder's answers. Agreement on archetype is reported as Cohen's
  kappa; if kappa is below 0.6 the primary outcome is declared invalid
  and no claim is made.
- Invalid files (do not parse or have no page component) are not re-run.
  They count as a mismatch in the primary analysis; the invalid rate per
  cell is reported, and a sensitivity analysis excludes them.
- The mechanical extractor (slots expanded at any depth) is reported as
  a check against the blind archetype.

## Analysis and decision rule

- Primary (`analysis/primary.mjs`): archetype match rate of R minus U,
  pooled over the three main models and six tasks, with a 95 percent
  interval from a bootstrap (10,000 draws) that resamples tasks, the
  unit that generalises.
- Signal: R minus U is at least 0.15, its interval excludes 0, it is
  positive in at least 2 of 3 models, and the guard holds (R's match on
  P5 and P6 is not more than 0.10 below A's).
- Secondary: all pairwise condition contrasts; task-fit score; plan
  compliance; output tokens; per-model results.
- Anything else is exploratory and labelled so.

## Checks done before registration

See `calibration/REPORT.md`: plumbing, determinism on each main model,
two-turn timing, condition lengths (generic 370, rules 373, reasoning
378 words), the extractor v2 check on Stage 0, and a dry run of the
blind coder on the timing files.

## Threats kept in view

- The vocabulary's one-line pattern descriptions can be matched to task
  wording; they are identical in every condition, so they bias all
  conditions alike, but they raise the base rate.
- Expected archetypes are one designer's judgement; they are declared
  in advance and published with the results.
- Local models are not the models people use to build products; the
  result speaks to these models and this vocabulary only.

## Deviations

(none yet)
