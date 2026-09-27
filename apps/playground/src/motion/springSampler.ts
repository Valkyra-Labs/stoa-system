// A damped harmonic spring, settling from 0 to 1, sampled at a fixed time
// step (semi-implicit Euler: stable for the stiff, lightly damped springs a
// motion editor invites). No spring type exists in DTCG 2025.10; the result
// is turned into a CSS `linear()` easing by `toLinearEasing`, which is what
// a `transition` can actually use, per docs/stage-1/wave-2/08-motion.md.
export type SpringParams = { damping: number; stiffness: number; mass: number };
export type SpringSample = { t: number; v: number };

const DT = 1 / 120;
const SETTLE_EPSILON = 0.001;
const MAX_SECONDS = 8;

/** Displacement and velocity settle within `SETTLE_EPSILON` of rest, or the
 * sampler gives up at `MAX_SECONDS` (a spring too light to ever look
 * settled would otherwise sample forever). */
export function sampleSpring({ damping, stiffness, mass }: SpringParams): SpringSample[] {
  let x = -1; // displacement from rest (value 1); starts at value 0
  let v = 0;
  let t = 0;
  const samples: SpringSample[] = [{ t: 0, v: 0 }];
  while (t < MAX_SECONDS) {
    const a = (-stiffness * x - damping * v) / mass;
    v += a * DT;
    x += v * DT;
    t += DT;
    samples.push({ t, v: 1 + x });
    if (Math.abs(x) < SETTLE_EPSILON && Math.abs(v) < SETTLE_EPSILON) break;
  }
  return samples;
}

/** The samples resampled to `stops` evenly spaced values and rendered as a
 * CSS `linear()` easing function (Baseline widely available since
 * 2026-06): evenly spaced stops need no percentages of their own. */
export function toLinearEasing(samples: SpringSample[], stops = 24): string {
  const last = samples[samples.length - 1];
  if (!last || samples.length < 2) return "linear(0, 1)";
  const total = last.t;
  const valueAt = (time: number): number => {
    let lo = 0;
    let hi = samples.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (samples[mid]!.t < time) lo = mid + 1;
      else hi = mid;
    }
    return samples[lo]!.v;
  };
  const values = Array.from({ length: stops + 1 }, (_, i) => valueAt((i / stops) * total));
  return `linear(${values.map((v) => v.toFixed(4)).join(", ")})`;
}

/** How long, in milliseconds, the spring takes to settle: what a
 * `transition`'s `duration` should be set to alongside the sampled curve. */
export function settleDurationMs(samples: SpringSample[]): number {
  return Math.round((samples[samples.length - 1]?.t ?? 0) * 1000);
}
