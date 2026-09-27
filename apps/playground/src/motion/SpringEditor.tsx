// Damping, stiffness and mass, sampled into a curve and rendered as a CSS
// `linear()` easing (`springSampler.ts`). DTCG has no spring type, so the
// stored shape is the `$extensions` + `transition` pair described in
// docs/stage-1/wave-2/08-motion.md, built by `motionExtension.ts`.
import { TimeSlider } from "@valkyra-labs/stoa-react";
import { sampleBezier, type BezierPoints } from "./bezier";
import { nearestBezierToken } from "./motionExtension";
import { sampleSpring, settleDurationMs, toLinearEasing, type SpringParams } from "./springSampler";

export type SpringEditorProps = {
  spring: SpringParams;
  onChange: (spring: SpringParams) => void;
  easingTokens: Record<string, BezierPoints>;
};

const FIELDS: { key: keyof SpringParams; label: string; min: number; max: number; step: number }[] = [
  { key: "damping", label: "Damping", min: 1, max: 60, step: 1 },
  { key: "stiffness", label: "Stiffness", min: 10, max: 600, step: 5 },
  { key: "mass", label: "Mass", min: 0.1, max: 5, step: 0.1 },
];

function curvePath(points: { x: number; y: number }[], size: number): string {
  const ys = points.map((p) => p.y);
  const lo = Math.min(0, ...ys);
  const hi = Math.max(1, ...ys);
  const span = hi - lo || 1;
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x * size).toFixed(1)} ${((1 - (p.y - lo) / span) * size).toFixed(1)}`)
    .join(" ");
}

export function SpringEditor({ spring, onChange, easingTokens }: SpringEditorProps) {
  const samples = sampleSpring(spring);
  const linear = toLinearEasing(samples);
  const nearest = nearestBezierToken(samples, easingTokens);
  const size = 140;
  const plotPoints = Array.from({ length: 49 }, (_, i) => {
    const t = (i / 48) * samples[samples.length - 1]!.t;
    let lo = 0;
    let hi = samples.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (samples[mid]!.t < t) lo = mid + 1;
      else hi = mid;
    }
    return { x: i / 48, y: samples[lo]!.v };
  });

  return (
    <div className="pg-motion-spring">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="pg-motion-bezier__plot"
        role="img"
        aria-label="Spring settle curve"
      >
        <rect x={0} y={0} width={size} height={size} className="pg-motion-bezier__bg" />
        <path d={curvePath(plotPoints, size)} fill="none" stroke="var(--stoa-color-accent)" strokeWidth={2} />
        <path
          d={curvePath(sampleBezier(easingTokens[nearest] ?? [0, 0, 0, 1], 48), size)}
          fill="none"
          stroke="var(--stoa-color-text-muted)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      </svg>

      <div className="pg-motion-spring__fields">
        {FIELDS.map(({ key, label, min, max, step }) => (
          <div key={key} className="pg-token__slider">
            <span className="pg-token__label">{label}</span>
            <TimeSlider
              label={label}
              min={min}
              max={max}
              step={step}
              value={spring[key]}
              onChange={(value) => onChange({ ...spring, [key]: value })}
              format={(value) => value.toFixed(step < 1 ? 1 : 0)}
            />
          </div>
        ))}
      </div>

      <dl className="pg-summary">
        <dt>Settles in</dt>
        <dd>{settleDurationMs(samples)}ms</dd>
        <dt>Nearest easing token</dt>
        <dd>{nearest}</dd>
        <dt>linear() (24 stops)</dt>
        <dd>
          <code>{linear}</code>
        </dd>
      </dl>
    </div>
  );
}
