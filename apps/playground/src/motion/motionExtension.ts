// DTCG 2025.10 has no spring type. A spring is stored next to a `transition`
// whose timing function names the nearest of Stoa's cubic-bezier tokens, so
// a consumer without spring support still gets a reasonable curve; see
// docs/stage-1/wave-2/08-motion.md. Token sources do not change this wave
// (Stage 2 migrates them), so this shape is what a snapshot records, not
// what packages/tokens/tokens/*.json holds.
import { cubicBezier, type BezierPoints } from "./bezier";
import { sampleSpring, settleDurationMs, type SpringParams, type SpringSample } from "./springSampler";

export type SpringExtension = {
  $extensions: { "dev.stoa.motion": { spring: SpringParams } };
  transition: { duration: string; timingFunction: string };
};

const PROBE_FRACTIONS = [0.1, 0.25, 0.5, 0.75, 0.9];

function valueAtFraction(samples: SpringSample[], fraction: number): number {
  const total = samples[samples.length - 1]?.t ?? 0;
  const target = fraction * total;
  let lo = 0;
  let hi = samples.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (samples[mid]!.t < target) lo = mid + 1;
    else hi = mid;
  }
  return samples[lo]?.v ?? 0;
}

/** Of the named easing tokens, the one whose curve is closest to this
 * spring's at a few points across its settle time (least squared error). */
export function nearestBezierToken(samples: SpringSample[], tokens: Record<string, BezierPoints>): string {
  let best = "";
  let bestError = Infinity;
  for (const [name, points] of Object.entries(tokens)) {
    const ease = cubicBezier(points);
    let error = 0;
    for (const fraction of PROBE_FRACTIONS) error += (ease(fraction) - valueAtFraction(samples, fraction)) ** 2;
    if (error < bestError) {
      bestError = error;
      best = name;
    }
  }
  return best;
}

/** The spring, as the extension shape the brief describes: a `transition`
 * (a cubic-bezier consumer can use) alongside the spring parameters
 * (one that understands them can use those instead). */
export function springExtension(spring: SpringParams, tokens: Record<string, BezierPoints>): SpringExtension {
  const samples = sampleSpring(spring);
  const nearest = nearestBezierToken(samples, tokens);
  return {
    $extensions: { "dev.stoa.motion": { spring } },
    transition: { duration: `${settleDurationMs(samples)}ms`, timingFunction: `{motion.easing.${nearest}}` },
  };
}
