// Integration point for brief 01, the verification engine
// (docs/stage-1/01-verification-engine.md).
//
// TODO(brief 01): when packages/tokens exports the verification engine,
// run its checks here against the resolved preview values and return the
// results, so the panel reports contrast and the rest of the engine's
// checks on the live values without waiting for a server build. Until
// then this returns "not available": the panel must not imply that the
// live values passed anything they were not checked against.
import type { ResolvedTokens } from "./tokenModel";

export type BrowserCheck = { name: string; ok: boolean; detail: string };

export type BrowserChecks =
  | { available: false; note: string }
  | { available: true; checks: BrowserCheck[] };

const NOT_AVAILABLE =
  "In-browser checks arrive with brief 01, the verification engine. Until then the server build and its tests are the only check.";

export function runBrowserChecks(_resolved: Record<string, ResolvedTokens>): BrowserChecks {
  return { available: false, note: NOT_AVAILABLE };
}
