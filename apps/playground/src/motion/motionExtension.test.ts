import { describe, expect, it } from "vitest";
import { nearestBezierToken, springExtension } from "./motionExtension";
import type { SpringSample } from "./springSampler";

// A straight ramp: [0, 0, 1, 1] is the identity curve (both control points
// sit on their own anchor, see bezier.test.ts), so it matches this exactly.
const samples: SpringSample[] = Array.from({ length: 101 }, (_, i) => {
  const t = i / 100;
  return { t, v: t };
});

describe("nearestBezierToken", () => {
  it("picks the token whose curve matches the sampled curve", () => {
    const tokens = {
      match: [0, 0, 1, 1],
      other: [0, 1, 1, 0],
    } as const;
    expect(nearestBezierToken(samples, tokens)).toBe("match");
  });
});

describe("springExtension", () => {
  it("carries the spring parameters and a transition naming the nearest token", () => {
    const tokens = { standard: [0.2, 0, 0, 1], enter: [0, 0, 0, 1], exit: [0.3, 0, 1, 1] } as const;
    const spring = { damping: 26, stiffness: 210, mass: 1 };
    const extension = springExtension(spring, tokens);
    expect(extension.$extensions["dev.stoa.motion"].spring).toEqual(spring);
    expect(extension.transition.duration).toMatch(/^\d+ms$/);
    expect(extension.transition.timingFunction).toMatch(/^\{motion\.easing\.(standard|enter|exit)\}$/);
  });
});
