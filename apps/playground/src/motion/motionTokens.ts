// The motion primitives (duration, easing), read from the token sources the
// way `editable.ts` reads the tokens it offers: not listed by hand, so a
// token added under `primitive.motion` shows up here. Kept apart from
// `editable.ts`, whose panel explicitly leaves motion out (it predates this
// brief) in favour of the bezier and spring editors below.
import { flattenFile, type Overrides, type TokenEntry, type TokenFiles } from "../tokenModel";
import { bezierFromTokenValue, type BezierPoints } from "./bezier";

export type MotionTokens = {
  durations: TokenEntry[];
  easings: TokenEntry[];
};

export function motionTokens(files: TokenFiles): MotionTokens {
  const motion = flattenFile("primitive", files.primitive).filter((e) => e.path[0] === "motion");
  return {
    durations: motion.filter((e) => e.path[1] === "duration"),
    easings: motion.filter((e) => e.path[1] === "easing"),
  };
}

export const lastSegment = (entry: TokenEntry): string => entry.path[entry.path.length - 1] ?? "";

/** An easing token's points, with its override (a comma list of four
 * numbers) applied when there is one and it parses that way. */
export function effectiveBezierPoints(entry: TokenEntry, overrides: Overrides): BezierPoints {
  const override = overrides[entry.id];
  if (override !== undefined) {
    const parts = override.split(",").map((p) => Number.parseFloat(p));
    if (parts.length === 4 && parts.every(Number.isFinite)) return parts as unknown as BezierPoints;
  }
  return bezierFromTokenValue(entry.value as (string | number)[]);
}

/** Every easing token's effective points, by its last path segment
 * (`standard`, `enter`, `exit`): what the spring editor compares against. */
export function easingPointsByName(easings: TokenEntry[], overrides: Overrides): Record<string, BezierPoints> {
  return Object.fromEntries(easings.map((e) => [lastSegment(e), effectiveBezierPoints(e, overrides)]));
}
