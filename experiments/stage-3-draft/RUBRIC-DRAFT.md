# Stage 3 measurement: observable features instead of archetypes

PARKED on 2026-09-27 (see `../README.md`); calibration stopped after 1 of 20
screens (`calibration/owner.json`, `calibration/claude.json`).

DRAFT. Not pre-registered. It becomes part of a protocol only after the
calibration below, one revision, and a freeze. Written 2026-09-27, after
experiment v2 showed that a human expert cannot apply the categorical
archetype variable with confidence (`../2026-09-reasoning-v2/RESULTS.md`,
"The archetype variable").

## Principle

The coder never names an archetype. The coder answers yes/no questions
about what the screen shows; the archetype is derived from the answers
by a rule written before any calibration screen is seen.

```
screen -> observable binary features -> pre-registered rule -> archetype
```

The outcome of the experiment can then be stated both ways: per feature
("does the screen keep the set in view while one item is open?") and as
the derived archetype. The feature-level result is primary, because it
is what Stoa's reasoning layer is about: whether the structure the work
needs is present, not what the page is called.

## Features (each 0 or 1, judged from the rendered screen)

| id | question | what counts | what does not |
|---|---|---|---|
| F1 set | Is there a persistent list or set of entities the person chooses from? | a table, list or grid of items of one kind that stays on screen and from which items can be selected or acted on | a table that is one panel of summaries with nothing selectable; a single item |
| F2 detail | Is one selected item's detail shown beside or over the set, with the set still available? | a detail pane, drawer or inspector tied to selection, opened by default or by a working control | detail that replaces the set; a drawer that nothing can open |
| F3 decision | Can the person take a decision on each item individually? | per-item actions (retry, approve, escalate) on the item or on the current item | page-level buttons (export, refresh); bulk actions only |
| F4 progress | Is progress through the set visible? | "N of M", done and remaining, a position, a count of resolved against pending | a total count alone |
| F5 compare | Does the main content set two or more objects against each other on the same measures? | columns or cards per object on shared measures | several unrelated metrics; one object with its own history |
| F6 single | Is the main content devoted to one object? | a profile or record of one entity with its data, context or history | a set of entities; a summary of many |
| F7 summary | Is there a row of three or more summary numbers about the whole set before the main content? | three or more separate metric tiles about the set | numbers about one object; tiles after the main content |

"Main content" is the region that takes most of the screen and that the
person works in. Features are independent: a screen can have any
combination.

## Derivation rule (draft, fixed before calibration)

First match wins:

1. queue: F3 = 1 and F4 = 1
2. explorer: F1 = 1 and F2 = 1
3. comparison: F5 = 1
4. inspector: F6 = 1
5. overview: everything else (the former dashboard and report, which
   humans could not separate reliably, are one class)

The expected outcome per task is stated in the same terms before
generation, as a set of required features (for example, the failed
payouts task requires F3 and F4; the portfolio task requires F1 and F2),
so a screen can meet some of its requirements and not others.

## Calibration (before the freeze)

1. Screens: 20 screens from the v2 generations, stratified over the six
   tasks and the three models, drawn with a seed. Stage 3 generates new
   screens, so none of these can enter its sample.
2. Coders: the owner on the coding page (rendered screens, the feature
   questions instead of archetypes), and one Claude coder on the same
   20 from code, independently.
3. Measure: agreement per feature (percent and Cohen's kappa), and the
   agreement of the derived archetype.
4. Revise once: definitions of features with kappa below 0.6 are
   rewritten, or the feature is dropped. The derivation rule may change
   only where a feature is dropped. No second round on the same screens.
5. Freeze the rubric and the rule; they go into the Stage 3 protocol
   before any Stage 3 generation.

## Owner decisions (2026-09-27)

- "overview" stays one class for both dashboard tasks; no extra feature.
- F7 (summary row) stays a primary feature.
