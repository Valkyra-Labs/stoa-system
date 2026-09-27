# Experiments: parked

Status on 2026-09-27: **parked.** No new experiments are planned; the
work below is kept as it is, with its protocols, raw data and results.
The project's focus moved to Stoa as a working design system for the
Tyche and Themis products.

| Folder | Question | Outcome |
|---|---|---|
| `2026-09-reasoning-pilot/` | Does a design-reasoning layer change the structure of screens built by Claude (36 generations)? | Inconclusive: the instruments were not valid (floor effect, a condition that named the measured features, a coder that disagreed with blind coding on 7 of 36). |
| `2026-09-reasoning-v2/` | Does reasoning add anything beyond rules for local models (360 generations, pre-registered, byte-reproducible)? | No signal under the pre-registered rule, a near miss (+0.133, interval touching 0); positive in all three models. Findings: four of six tasks at ceiling; rules had no effect on local models; the plan-to-code gap (the plan names the right structure, the file does not follow it). Final under Claude coding, not validated by a human coder. |
| `stage-3-draft/` | A measurement built on observable yes/no features instead of archetype categories. | Draft rubric and calibration tooling; calibration stopped after 1 of 20 screens. Not pre-registered. |

The main methodological finding: an expert could not apply the archetype
categories with confidence, so any future measurement should start from
observable features (`stage-3-draft/RUBRIC-DRAFT.md`).
