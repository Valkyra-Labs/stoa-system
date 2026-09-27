import { describe, expect, it } from "vitest";
import { cubicBezier, sampleBezier } from "./bezier";

describe("cubicBezier", () => {
  it("passes through its endpoints, for every named easing", () => {
    for (const points of [
      [0.2, 0, 0, 1],
      [0, 0, 0, 1],
      [0.3, 0, 1, 1],
    ] as const) {
      const ease = cubicBezier(points);
      expect(ease(0)).toBeCloseTo(0, 5);
      expect(ease(1)).toBeCloseTo(1, 5);
    }
  });

  it("is the identity when both control points sit on their own anchor", () => {
    // P1 = P0 and P2 = P3: x(t) and y(t) are the same function of t, so
    // eliminating t leaves y = x whatever that function is.
    const ease = cubicBezier([0, 0, 1, 1]);
    for (const x of [0, 0.25, 0.5, 0.75, 1]) {
      expect(ease(x)).toBeCloseTo(x, 5);
    }
  });

  it("stays monotonic for a curve whose control points are inside [0, 1]", () => {
    const ease = cubicBezier([0.2, 0, 0, 1]);
    let previous = -Infinity;
    for (let i = 0; i <= 20; i++) {
      const y = ease(i / 20);
      expect(y).toBeGreaterThanOrEqual(previous);
      previous = y;
    }
  });
});

describe("sampleBezier", () => {
  it("returns count + 1 points spanning the curve", () => {
    const points = sampleBezier([0.2, 0, 0, 1], 10);
    expect(points).toHaveLength(11);
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[10]!.x).toBeCloseTo(1, 5);
    expect(points[10]!.y).toBeCloseTo(1, 5);
  });
});
