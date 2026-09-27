// A cubic bezier easing, evaluated the way a browser evaluates
// `cubic-bezier()`: the curve is parametric in a hidden parameter, so
// progress at time `x` is found by solving for it (Newton-Raphson, with a
// bisection fallback for the rare case the derivative is near zero). The
// algorithm is the public one behind every `cubic-bezier()` implementation
// (for example WebKit's `UnitBezier`, BSD-licensed); nothing here is
// copied from a GPL source such as easings.net.
export type BezierPoints = readonly [number, number, number, number];

function componentAt(t: number, p1: number, p2: number): number {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return ((a * t + b) * t + c) * t;
}

function derivativeAt(t: number, p1: number, p2: number): number {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return (3 * a * t + 2 * b) * t + c;
}

/** `t` for the given `x`, the curve's hidden parameter at that time. */
function solveT(x: number, x1: number, x2: number): number {
  let t = x;
  for (let i = 0; i < 8; i++) {
    const d = derivativeAt(t, x1, x2);
    if (Math.abs(d) < 1e-6) break;
    const error = componentAt(t, x1, x2) - x;
    if (Math.abs(error) < 1e-7) return t;
    t -= error / d;
  }
  // The Newton step did not converge (a flat tangent, or `t` walked out of
  // range): fall back to bisection, which always converges for a curve
  // that is monotonic in `x` (P1x and P2x within [0, 1]).
  let lo = 0;
  let hi = 1;
  t = x;
  for (let i = 0; i < 30 && hi - lo > 1e-7; i++) {
    const value = componentAt(t, x1, x2);
    if (value < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return t;
}

/** Progress (0 to 1) at time `x` (0 to 1) along the curve. Values outside
 * the curve's own P1x/P2x range (an "overshoot" curve such as `exit`) are
 * still handled: `x` is clamped for the search, `y` is not. */
export function cubicBezier([x1, y1, x2, y2]: BezierPoints): (x: number) => number {
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const t = solveT(x, x1, x2);
    return componentAt(t, y1, y2);
  };
}

/** `count + 1` evenly spaced points along the curve, for drawing it. */
export function sampleBezier(points: BezierPoints, count = 64): { x: number; y: number }[] {
  const ease = cubicBezier(points);
  return Array.from({ length: count + 1 }, (_, i) => {
    const x = i / count;
    return { x, y: ease(x) };
  });
}

/** The DTCG `cubicBezier` token, typed as its four-number `$value`. */
export function bezierFromTokenValue(value: readonly (string | number)[]): BezierPoints {
  const [x1, y1, x2, y2] = value.map(Number);
  return [x1 ?? 0, y1 ?? 0, x2 ?? 0, y2 ?? 1] as const;
}
