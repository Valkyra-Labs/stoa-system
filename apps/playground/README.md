# Stoa playground

A private tool for tuning Stoa's tokens against dense screens. It is never
published: `"private": true`, no `files` field, no build output that is
meant to be served anywhere.

```
pnpm build                     # the playground reads the built packages
pnpm --filter playground dev   # http://localhost:5173
```

## What it does

- Four preview frames at once, light and dark by left to right and right
  to left, each one running the same dense screen: Ladder, Heatmap,
  TradeTable, the controls and the form fields, off one synthetic stream
  that can be paused and resumed.
- Token values are written as CSS custom properties on each frame's
  container, never on the document, so a re-theme restyles four preview
  containers rather than the whole page.
- The base is one of two things. Stoa today: the token files in
  `packages/tokens/tokens` as they are in this working tree. Or the
  parameter model of `packages/tokens/src/model.mjs`: a few parameters
  (neutral temperature, the chromatic roles, contrast, polarity, surface
  strategy, corner language, density) from which every token is derived,
  with the hard accessibility rules kept by clamping. The parameters panel
  picks between them, offers the three presets, and lists every value a
  rule had to move and every role whose chroma the sRGB gamut cut back.
- Every edit in the tokens panel is an override against whichever base is
  underneath, listed with the value it would have derived, resettable one
  by one or all at once, with undo and redo. One step back is one edit as a
  person would mean it: typing into a field is one step per pause of
  500 ms, and a slider drag is one step however far it travels. With the
  parameter model underneath, the tree is already resolved, so an override
  changes the token it names and no longer travels to the roles that alias
  it in the sources.
- The verification panel runs the real `packages/tokens` build and its
  tests on the edited files, in a temporary directory, and compares the
  values the previews are using with the variables the build emitted. A
  disagreement is a failure: it means the previews are not showing what
  the build would produce. The build reads token files, so with the
  parameter model underneath the comparison is withheld and says so:
  writing a derived tree back out as DTCG files is not part of this
  version.
- Snapshots (parameters, token files, overrides, and the commit they were
  based on) are written to `snapshots/`, and loading one restores its
  parameters and its overrides.

## Scripts

| Command | What it does |
|---|---|
| `pnpm --filter playground dev` | The tool, with the `/api` endpoints. |
| `pnpm --filter playground build` | Only a check that the app compiles; the tool runs in dev. |
| `pnpm --filter playground typecheck` | `tsc --noEmit`. |
| `pnpm --filter playground test` | Unit tests (vitest). No browser needed. |
| `pnpm --filter playground test:e2e` | The Playwright smoke test. Needs a browser. |

`pnpm test` stays browser-free so that the acceptance commands in
`CLAUDE.md` run on a fresh machine. The smoke test is its own script,
`test:e2e`, and CI runs it in a step of its own. It starts its own dev
server on port 5174 and needs the Chromium that the pinned Playwright
version downloads: `pnpm --filter playground exec playwright install
chromium`.

`node apps/playground/scripts/screenshot.mjs [url] [out]` photographs the
four frames against a dev server that is already running.

## Endpoints

All three are development only and live in `server/tokenServer.ts`.

- `POST /api/build` takes the four token files as text, writes them to a
  temporary directory with the real `packages/tokens` scripts, runs that
  package's own `build` and `test` commands there, and returns the built
  CSS, both commands' output, and the commit the repository was on. A
  command that outlives its timeout is killed and reported as failed.
- `POST /api/save` writes a snapshot to `snapshots/<name>.json`, with the
  parameters and the overrides beside the token files. An unnamed save is
  stamped with the time it was written. A name already on disk is refused
  with 409 until the request says `overwrite: true`; `stoa-today` is
  refused with 403 whatever the request says, because it is the committed
  base every override is stated against.
- `GET /api/snapshots` lists the snapshot names on disk;
  `GET /api/snapshots?name=<slug>` returns one of them. A name that is not
  a slug a save would write is refused rather than cleaned up, so the
  endpoint reads nothing outside `snapshots/`.
- `GET /api/commit` returns the commit and whether the tree is dirty.

Every endpoint refuses a request whose `Origin` is not this server, and the
two POST endpoints require `content-type: application/json`, so a page on
another origin cannot drive the commands they run.

## Not here yet

- The parameter model covers seven parameters. Type, numeric style, change
  encoding and motion are later briefs, so the type ramp, the space scale
  and the motion tokens are carried through unchanged and are not editable
  in this version.
- No export of a derived tree to DTCG token files, so the build endpoint
  always builds the token sources with the override layer written in.
- Canvas components read their colours once, so a token edit re-mounts
  them (`revision` in `PreviewGrid.tsx`). The token-change signal of
  brief 02 replaces that.
- In-browser checks wait for the verification engine of brief 01; the seam
  is `src/browserChecks.ts`, and until then the panel says the checks are
  not available rather than implying a pass.
