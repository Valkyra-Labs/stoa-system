# Contributing to Stoa

## Conventions

- No emojis anywhere: code, comments, docs, commit messages, pull request
  text. `scripts/check-text.mjs` enforces this, in CI too.
- No attribution trailers or generated-by lines in commits or pull
  request text; commit messages and pull request text describe the
  change only.
- Plain, specific sentences, without redundant em dashes. Code comments
  and repository docs in English. Match the surrounding code: naming,
  comment density, idiom.

## Acceptance

Before a change is finished, run and pass:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm -r typecheck
pnpm test
node scripts/token-map.mjs --check
node scripts/check-text.mjs origin/main
pnpm test:e2e
pnpm build-storybook
pnpm --filter @valkyra-labs/stoa-react test:stories
```

Tests are the acceptance gate. A failed check is not flaky until the
exact same command passes on rerun. When a check fails and the fix is not
obvious, report it rather than route around it: no skipped tests, no
loosened thresholds, no `any` to quiet the type checker.

## Measurements

- A number from a vendor, a blog or a model card is a hypothesis, not an
  input; check it on this project before relying on it.
- A metric's name says what is actually measured and how it aggregates.
- Every reported measurement names the commit it was taken on.
- Accessibility claims are only as wide as the test behind them: if a
  test checks a list of colour pairs, the docs claim that list, nothing
  more. Contrast is WCAG 2 with deterministic checks; APCA is out.

## Scope

- Do the task that was asked; list unrequested refactors, renames and
  dependency upgrades as suggestions instead.
- Dead code found during work is reported, not deleted.
- One change at a time when validating; two changes in one measurement
  cannot be told apart.

## Experiments

- A committed `PROTOCOL.md` is pre-registered: it is only ever extended
  by a dated entry under "Deviations".
- Nothing under `generations/`, `calibration/out/` or the raw results is
  edited, regenerated or deleted. Analysis code may be added.
- Product code never reads experiment generations or conditions, and
  never goes into experiment folders.

## Commits and branches

```
<type>(<package>): <short description>
```

Types: feat, fix, refactor, test, docs, chore. Package: tokens, react,
storybook, stoa (repository-wide), or the experiment folder name. Work on
a branch; `main` changes only through a pull request with green CI.
`docs/inside/` is ignored by git and never published.
