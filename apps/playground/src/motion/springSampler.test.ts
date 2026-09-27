import { describe, expect, it } from "vitest";
import { sampleSpring, settleDurationMs, toLinearEasing } from "./springSampler";

describe("sampleSpring", () => {
  it("starts at rest and settles at the target", () => {
    const samples = sampleSpring({ damping: 26, stiffness: 210, mass: 1 });
    expect(samples[0]!.t).toBe(0);
    expect(samples[0]!.v).toBeCloseTo(0, 5);
    expect(samples[samples.length - 1]!.v).toBeCloseTo(1, 2);
  });

  it("samples time strictly increasing", () => {
    const samples = sampleSpring({ damping: 12, stiffness: 300, mass: 1 });
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i]!.t).toBeGreaterThan(samples[i - 1]!.t);
    }
  });

  it("overshoots the target when lightly damped", () => {
    const samples = sampleSpring({ damping: 4, stiffness: 300, mass: 1 });
    expect(Math.max(...samples.map((s) => s.v))).toBeGreaterThan(1.05);
  });

  it("does not overshoot when heavily damped", () => {
    const samples = sampleSpring({ damping: 60, stiffness: 120, mass: 1 });
    expect(Math.max(...samples.map((s) => s.v))).toBeLessThanOrEqual(1.001);
  });

  it("gives up on a spring too light to settle, rather than sampling forever", () => {
    const samples = sampleSpring({ damping: 0.01, stiffness: 50, mass: 1 });
    // A fixed dt accumulates float drift past the 8s cap by a fraction of
    // one step; the cap is what matters, not sub-millisecond precision.
    expect(samples[samples.length - 1]!.t).toBeLessThan(8 + 1 / 60);
  });
});

describe("toLinearEasing", () => {
  it("renders as a linear() function with the requested number of stops", () => {
    const css = toLinearEasing(sampleSpring({ damping: 26, stiffness: 210, mass: 1 }), 8);
    expect(css).toMatch(/^linear\(/);
    const values = css.slice("linear(".length, -1).split(", ").map(Number);
    expect(values).toHaveLength(9);
    expect(values[0]).toBeCloseTo(0, 2);
    expect(values[values.length - 1]).toBeCloseTo(1, 2);
  });
});

describe("settleDurationMs", () => {
  it("matches the last sample's time, in milliseconds", () => {
    const samples = sampleSpring({ damping: 26, stiffness: 210, mass: 1 });
    expect(settleDurationMs(samples)).toBe(Math.round(samples[samples.length - 1]!.t * 1000));
  });
});
