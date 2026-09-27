// Wires the playground to brief 01's verification engine
// (docs/stage-1/01-verification-engine.md): the same pure rules CI runs,
// against the live resolved tokens rather than a build's output. Pure and
// side-effect free, like the modules it calls, so the mapping from live
// values to check inputs is unit-testable without a browser.
import { RULES, pairName, runAllChecks, type CheckResult } from "@valkyra-labs/stoa-tokens/checks";
import { NON_TEXT_PAIRS, TARGETS, TEXT_PAIRS, UP_DOWN, type Pair } from "@valkyra-labs/stoa-tokens/pairs";
import knownViolationsJson from "../../../packages/tokens/known-violations.json";
import { DENSITY_MODES, type DensityMode, type ResolvedTokens, type Theme } from "./tokenModel";

const knownIds = new Set((knownViolationsJson as { violations: { id: string }[] }).violations.map((v) => v.id));

/** Whether a result matches nothing, a known entry, or neither, against
 * `known-violations.json` the same four ways scripts/checks.test.mjs gates
 * it:
 * - `pass`: not a violation, and never was one.
 * - `fixed`: recorded as a known violation, but passes now. The file has
 *   gone stale in the direction that fails a test ("these now pass and
 *   must be removed"), so this is not a clean pass.
 * - `known`: fails, exactly as recorded.
 * - `new`: an enforced failure the file does not list.
 * - `reported`: fails a rule that is not enforced (see pairs.mjs); never
 *   fails a test whether or not it is listed.
 */
export type CheckStatus = "pass" | "fixed" | "known" | "new" | "reported";

export type BrowserCheck = CheckResult & {
  status: CheckStatus;
  /** Token ids (as `ControlPanel`/`OverrideList` key them) this result
   * reads, so selecting it can highlight them. Empty when the rule names
   * nothing `tokensForCheck` can resolve. */
  tokens: string[];
};

export type BrowserChecks =
  | { available: false; note: string }
  | {
      available: true;
      checks: BrowserCheck[];
      /** Whether the current values would make `scripts/checks.test.mjs`
       * fail on pass/fail alone: any `new` or `fixed` result. Reported-only
       * failures and recorded known ones cannot. Does not reproduce the
       * gate's tolerance check on a known violation's recorded value, so a
       * value that drifted but is still failing reads as agreeing here
       * even where the server test would fail on drift. */
      wouldFailServerTests: boolean;
    };

function classify(pass: boolean, enforced: boolean, known: boolean): CheckStatus {
  if (pass) return known ? "fixed" : "pass";
  if (!enforced) return "reported";
  return known ? "known" : "new";
}

const STOA_PREFIX = "--stoa-";

/** A resolved theme or density map, keyed the way `checks.mjs` expects:
 * `color-text`, not the CSS custom property `--stoa-color-text`. */
function tokenMap(variables: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(variables)) {
    if (name.startsWith(STOA_PREFIX)) out[name.slice(STOA_PREFIX.length)] = value;
  }
  return out;
}

const colorTokenId = (theme: string, name: string): string => `semantic.${theme}:color.${name}`;

function pairTokens(theme: string, pair: Pair): string[] {
  const ids = [colorTokenId(theme, pair.fg), colorTokenId(theme, pair.bg)];
  if (pair.bgOver !== undefined) ids.push(colorTokenId(theme, pair.bgOver));
  return ids;
}

const textPairByName = new Map(TEXT_PAIRS.map((p) => [pairName(p), p]));
const nonTextPairByName = new Map(NON_TEXT_PAIRS.map((p) => [pairName(p), p]));
const densityField = (token: string) => token.replace(/^density-/, "");

/** The token ids a result's rule reads: the semantic colour tokens a
 * contrast or distinguishability check names, or the density token a
 * target-size check names. Only what pairs.mjs names directly; a primitive
 * that feeds one of them through a `{reference}` is not traced further. */
export function tokensForCheck(result: Pick<CheckResult, "id" | "rule">): string[] {
  const [rule, scope, name] = result.id.split("/");
  if (!scope) return [];
  if (result.rule === RULES.textContrast || result.rule === RULES.nonTextContrast) {
    const pair = name ? (result.rule === RULES.textContrast ? textPairByName : nonTextPairByName).get(name) : undefined;
    return pair ? pairTokens(scope, pair) : [];
  }
  if (result.rule === RULES.upDown) {
    return [colorTokenId(scope, UP_DOWN.a), colorTokenId(scope, UP_DOWN.b)];
  }
  if (result.rule === RULES.targetSize && name) {
    return [`density:${scope}.${densityField(name)}`];
  }
  return [];
}

export type TokenRuleRef = { rule: string; subject: string; theme: Theme | null };

function buildTokenRules(): Map<string, TokenRuleRef[]> {
  const map = new Map<string, TokenRuleRef[]>();
  const add = (id: string, ref: TokenRuleRef) => map.set(id, [...(map.get(id) ?? []), ref]);
  const subjectOf = (pair: Pair) =>
    pair.bgOver === undefined ? `${pair.fg} on ${pair.bg}` : `${pair.fg} on ${pair.bg} over ${pair.bgOver}`;

  for (const theme of ["light", "dark"] as const) {
    for (const pair of TEXT_PAIRS) {
      for (const id of pairTokens(theme, pair)) add(id, { rule: RULES.textContrast, subject: subjectOf(pair), theme });
    }
    for (const pair of NON_TEXT_PAIRS) {
      for (const id of pairTokens(theme, pair)) add(id, { rule: RULES.nonTextContrast, subject: subjectOf(pair), theme });
    }
    const upDownSubject = `${UP_DOWN.a} against ${UP_DOWN.b}`;
    add(colorTokenId(theme, UP_DOWN.a), { rule: RULES.upDown, subject: upDownSubject, theme });
    add(colorTokenId(theme, UP_DOWN.b), { rule: RULES.upDown, subject: upDownSubject, theme });
  }
  for (const target of TARGETS) {
    for (const mode of DENSITY_MODES) {
      add(`density:${mode}.${densityField(target.token)}`, { rule: RULES.targetSize, subject: target.token, theme: null });
    }
  }
  return map;
}

const TOKEN_RULES = buildTokenRules();

/** Every rule that reads a token, for the hover affordance on a control:
 * the checks a token's value can move, whether or not any of them
 * currently fail. Only covers what `buildTokenRules` names (see
 * `tokensForCheck`); a primitive gets an empty list even though a check
 * reads it indirectly through a semantic reference. */
export function rulesForToken(tokenId: string): TokenRuleRef[] {
  return TOKEN_RULES.get(tokenId) ?? [];
}

export type BrowserCheckInputs = {
  /** Resolved tokens per theme, at the density mode the previews show. */
  themes: Record<Theme, ResolvedTokens>;
  /** Resolved tokens per density mode (light theme; density tokens do not
   * vary by theme), so target-size is checked in all three, as CI does. */
  densities: Record<DensityMode, ResolvedTokens>;
};

/** Run every rule in packages/tokens/src/checks.mjs on the live values.
 * Never throws: a value the rules cannot read (an override typed as text
 * that is not a colour, say) is reported as unavailable rather than
 * crashing the panel, because the panel must not imply that the live
 * values passed anything they were not checked against. */
export function runBrowserChecks({ themes, densities }: BrowserCheckInputs): BrowserChecks {
  try {
    const results = runAllChecks({
      themes: { light: tokenMap(themes.light.variables), dark: tokenMap(themes.dark.variables) },
      densities: Object.fromEntries(DENSITY_MODES.map((mode) => [mode, tokenMap(densities[mode].variables)])),
    });
    const checks = results.map((result) => ({
      ...result,
      status: classify(result.pass, result.enforced, knownIds.has(result.id)),
      tokens: tokensForCheck(result),
    }));
    const wouldFailServerTests = checks.some((c) => c.status === "new" || c.status === "fixed");
    return { available: true, checks, wouldFailServerTests };
  } catch (cause) {
    return { available: false, note: cause instanceof Error ? cause.message : String(cause) };
  }
}
