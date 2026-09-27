# Experiment v2: does design reasoning add anything beyond rules?

DRAFT for the owner's review. Nothing here is pre-registered until this
file is renamed to `PROTOCOL.md` and committed before the first
generation. Stage 0 (`../2026-09-reasoning-pilot/`) is kept unchanged;
its lessons are the reason for every choice below.

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

Six tasks, two of them dashboard-correct. The expected archetype is set
by the owner (a senior product designer) before any generation, blind
to outputs. Proposed:

| id | task (prompt, two sentences) | expected |
|---|---|---|
| P1 | A payments operations analyst has a list of failed payouts to work through. Build the screen they use to resolve them. | queue |
| P2 | A portfolio manager opens their book in the morning. Build the screen they use to see what moved since yesterday and understand why. | explorer |
| P3 | A teacher meets a parent tomorrow about one student. Build the screen the teacher uses to prepare. | inspector |
| P4 | A financial adviser must recommend one of two funds to a client. Build the screen they use to choose. | comparison |
| P5 | A head of school presents the term to the board next week and will not change anything on the screen. Build the screen they use to show how the school is doing. | dashboard |
| P6 | A finance director glances at the company's weekly numbers every Monday before meetings. Build the screen they use. | dashboard |

Closed archetype set for coding: dashboard, explorer, queue, inspector,
comparison, report, other. Definitions go into the coding guide before
generation.

## Models and sampling

Main: qwen3.5:4b, qwen3:8b, qwen2.5:14b: the GGUF weights ollama
already holds, served by llama.cpp server (build recorded) with one
slot, context 8192, `cache_prompt: false`; file digests recorded.
Thinking off where the model has it, recorded per run. temperature 0.7,
top_p 0.8, max 4096 output tokens. Seeds 1 to 4. The server holds one
model at a time, so runs are grouped by model in a random model order
and shuffled within each model.

Size: 3 models x 4 conditions x 6 tasks x 4 seeds = 288 generations,
order randomised by a seeded shuffle. Wall time is estimated only after
a timing run on each model; qwen3:8b took 30 to 47 s per single-turn
generation in calibration.

Exploratory, reported separately and not in the decision: deepseek-r1:8b
(a reasoning-trained model), qwen3:1.7b and qwen2.5:3b (capability
floor), gemma4 26B (upper tier, alone on the machine). A small Claude
replication follows as a separate protocol.

## Coding

- Blind coder: one Claude subagent codes every file with comments and
  the plan removed, condition and model hidden behind opaque ids: the
  archetype from the closed set, the three task-fit items per task, and
  whether the file is invalid.
- Second coder: the owner codes a random 20 percent (58 files) through a
  blind coding page. Agreement on archetype is reported as Cohen's
  kappa; if kappa is below 0.6 the primary outcome is declared invalid
  and no claim is made.
- Invalid files (do not parse or have no page component) are not re-run.
  They count as a mismatch in the primary analysis; the invalid rate per
  cell is reported, and a sensitivity analysis excludes them.
- The mechanical extractor (slots expanded at any depth) is reported as
  a check against the blind archetype.

## Analysis and decision rule

- Primary: archetype match rate of R minus U, pooled over the three main
  models and six tasks, with a 95 percent interval from a bootstrap that
  resamples tasks (the tasks are the unit that generalises).
- Signal: R minus U is at least 0.15, its interval excludes 0, it is
  positive in at least 2 of 3 models, and the guard holds (R's match on
  P5 and P6 is not more than 0.10 below A's).
- Secondary: all pairwise condition contrasts; task-fit score; plan
  compliance; output tokens; per-model results.
- Anything else is exploratory and labelled so.

## Checks before pre-registration

1. Determinism: done for qwen3:8b (calibration addendum); repeat once
   per main model before the run.
2. Timing run: 4 generations per main model, two-turn.
3. Condition texts trimmed to within 5 percent of each other.
4. Coding guide with archetype definitions and two worked examples per
   archetype, written before generation.
5. The blind coder run on the 8 calibration files, to check the guide.

## Threats kept in view

- The vocabulary's one-line pattern descriptions can be matched to task
  wording; they are identical in every condition, so they bias all
  conditions alike, but they raise the base rate.
- Expected archetypes are one designer's judgement; they are declared
  in advance and published with the results.
- Local models are not the models people use to build products; the
  result speaks to these models and this vocabulary only.

## Open questions for the owner

1. Do you accept the six tasks and set their expected archetypes?
2. Will you be the second coder for 58 files (about an hour)?
3. Four seeds (288 generations) or five (360)?

## Deviations

(the protocol is not yet registered)
