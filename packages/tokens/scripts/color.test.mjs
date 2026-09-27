// The colour maths behind the verification rules, checked against sources
// outside this repository: culori for the Oklch conversion and for WCAG
// contrast, the CIE's own CIEDE2000 test data for the colour difference,
// and hand arithmetic for the colour-vision simulation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { converter, parse, wcagContrast } from "culori";
import {
  clipToGamut,
  contrast,
  decodeSrgb,
  deltaE2000,
  encodeSrgb,
  outOfGamut,
  parseColor,
  simulateCvd,
  simulateCvdInGammaSpace,
} from "../src/color.mjs";
import { resolveTokens } from "../src/resolve.mjs";

const css = await readFile(new URL("../dist/tokens.css", import.meta.url), "utf8");
const { themes } = resolveTokens(css);
const toRgb = converter("rgb");
const asCulori = (c) => ({ mode: "rgb", ...clipToGamut(c) });

test("the sRGB transfer function round-trips", () => {
  for (const c of [0, 0.0001, 0.001, 0.0031308, 0.18, 0.5, 1]) {
    assert.ok(Math.abs(decodeSrgb(encodeSrgb(c)) - c) < 1e-9, `${c}`);
    assert.ok(Math.abs(encodeSrgb(decodeSrgb(c)) - c) < 1e-9, `${c}`);
  }
  // The two branches of the standard's piecewise function are written with
  // rounded constants, so they meet at the 0.04045 breakpoint only to about
  // one part in a million. Recorded rather than worked around: it is the
  // definition WCAG cites, and the gap is far below any threshold here.
  const gap = Math.abs(encodeSrgb(decodeSrgb(0.04045)) - 0.04045);
  assert.ok(gap > 0 && gap < 1e-5, `gap at the breakpoint is ${gap}`);
});

test("every token colour parses to the same sRGB as culori", () => {
  let checked = 0;
  for (const tokens of Object.values(themes)) {
    for (const [name, value] of Object.entries(tokens)) {
      if (!name.startsWith("color-")) continue;
      const mine = parseColor(value);
      const theirs = toRgb(parse(value));
      assert.ok(mine, `${name}: ${value} did not parse`);
      assert.ok(theirs, `${name}: ${value} did not parse in culori`);
      for (const ch of ["r", "g", "b"]) {
        assert.ok(Math.abs(mine[ch] - theirs[ch]) < 1e-6, `${name}.${ch}: ${mine[ch]} vs ${theirs[ch]}`);
      }
      assert.ok(Math.abs(mine.alpha - (theirs.alpha ?? 1)) < 1e-12, `${name}.alpha`);
      checked++;
    }
  }
  // 43 colour tokens per theme, light and dark.
  assert.equal(checked, 86);
});

test("hex and rgb notations parse, unknown notations return null", () => {
  assert.deepEqual(parseColor("#ff0000"), { r: 1, g: 0, b: 0, alpha: 1 });
  assert.deepEqual(parseColor("#f00"), { r: 1, g: 0, b: 0, alpha: 1 });
  assert.deepEqual(parseColor("rgb(255 0 0)"), { r: 1, g: 0, b: 0, alpha: 1 });
  assert.deepEqual(parseColor("rgba(255, 0, 0, 0.5)"), { r: 1, g: 0, b: 0, alpha: 0.5 });
  assert.equal(parseColor("rebeccapurple"), null);
  assert.equal(parseColor("var(--stoa-color-text)"), null);
  assert.equal(parseColor(undefined), null);
});

test("WCAG contrast matches culori on the same clipped colours", () => {
  // culori measures the coordinates it is given, without clipping, so the
  // comparison clips both sides first; `contrast` clips on its own.
  const pairs = [
    ["text", "bg"],
    ["text", "surface"],
    ["text-muted", "surface"],
    ["accent", "surface"],
    ["up", "surface"],
    ["down", "surface"],
    ["focus", "surface"],
    ["border-strong", "surface"],
  ];
  for (const [theme, tokens] of Object.entries(themes)) {
    for (const [fg, bg] of pairs) {
      const f = parseColor(tokens[`color-${fg}`]);
      const b = parseColor(tokens[`color-${bg}`]);
      const diff = Math.abs(contrast(f, b) - wcagContrast(asCulori(f), asCulori(b)));
      assert.ok(diff < 1e-12, `${theme}: ${fg} on ${bg} differs by ${diff}`);
    }
  }
});

test("two token colours fall outside the sRGB gamut and are clipped before measuring", () => {
  // Recorded so that a docs claim about these two never reads as exact:
  // a browser gamut-maps by reducing chroma instead of clipping channels.
  const outside = [];
  for (const [theme, tokens] of Object.entries(themes)) {
    for (const [name, value] of Object.entries(tokens)) {
      if (!name.startsWith("color-")) continue;
      const c = parseColor(value);
      if (c && outOfGamut(c)) outside.push(`${theme}/${name}`);
    }
  }
  assert.deepEqual(outside.sort(), [
    // teal-600 is the light theme's up and bid colour, and the two washes
    // are teal-wash and red-wash under their semantic names.
    "dark/color-teal-600",
    "dark/color-teal-wash",
    "dark/color-up-wash",
    "light/color-bid",
    "light/color-teal-600",
    "light/color-teal-wash",
    "light/color-up",
    "light/color-up-wash",
  ]);
});

test("CIEDE2000 reproduces the CIE test data", () => {
  // Sharma, Wu and Dalal 2005, "The CIEDE2000 color-difference formula:
  // implementation notes, supplementary test data and mathematical
  // observations", Color Research and Application 30(1), table 1. These
  // rows are the ones the formula is usually got wrong on: the hue
  // wrap-around near 360 degrees and the near-neutral cases.
  const rows = [
    [[50, 2.6772, -79.7751], [50, 0, -82.7485], 2.0425],
    [[50, 3.1571, -77.2803], [50, 0, -82.7485], 2.8615],
    [[50, -1.3802, -84.2814], [50, 0, -82.7485], 1.0],
    [[50, 0, 0], [50, -1, 2], 2.3669],
    [[50, 2.49, -0.001], [50, -2.49, 0.0009], 7.1792],
    [[50, 2.5, 0], [50, 0, -2.5], 4.3065],
    [[50, 2.5, 0], [73, 25, -18], 27.1492],
    [[50, 2.5, 0], [61, -5, 29], 22.8977],
    [[50, 2.5, 0], [56, -27, -3], 31.903],
    [[50, 2.5, 0], [58, 24, 15], 19.4535],
    [[60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387], 1.2644],
    [[63.0109, -31.0961, -5.8663], [62.8187, -29.7946, -4.0864], 1.263],
    [[22.7233, 20.0904, -46.694], [23.0331, 14.973, -42.5619], 2.0373],
    [[90.8027, -2.0831, 1.441], [91.1528, -1.6435, 0.0447], 1.4441],
    [[6.7747, -0.2908, -2.4247], [5.8714, -0.0985, -2.2286], 0.6377],
    [[2.0776, 0.0795, -1.135], [0.9033, -0.0636, -0.5514], 0.9082],
  ];
  for (const [[l1, a1, b1], [l2, a2, b2], expected] of rows) {
    const got = deltaE2000({ l: l1, a: a1, b: b1 }, { l: l2, a: a2, b: b2 });
    assert.ok(Math.abs(got - expected) < 5e-5, `expected ${expected}, got ${got.toFixed(6)}`);
  }
});

test("CIEDE2000 is symmetric and zero for identical colours", () => {
  const p = { l: 60.2574, a: -34.0099, b: 36.2677 };
  const q = { l: 60.4626, a: -34.1751, b: 39.4387 };
  assert.equal(deltaE2000(p, p), 0);
  assert.ok(Math.abs(deltaE2000(p, q) - deltaE2000(q, p)) < 1e-12);
});

test("the CVD simulation matches arithmetic done by hand in linear light", () => {
  // Deuteranopia of pure red, #ff0000. Linear light is (1, 0, 0), so the
  // result is the first column of the Machado severity-1.0 deuteranomaly
  // matrix: (0.367322, 0.280085, -0.011820). The blue channel clips to 0.
  // Encoding the other two, with 1.055 * c^(1/2.4) - 0.055:
  //   0.367322^(1/2.4) = exp(ln(0.367322) / 2.4) = exp(-1.001516 / 2.4)
  //                    = exp(-0.417298) = 0.658807
  //                    -> 1.055 * 0.658807 - 0.055 = 0.640041
  //   0.280085^(1/2.4) = exp(-1.272662 / 2.4) = exp(-0.530276) = 0.588414
  //                    -> 1.055 * 0.588414 - 0.055 = 0.565777
  // so red is seen as roughly rgb(163, 144, 0), a dark yellow.
  const deutRed = simulateCvd({ r: 1, g: 0, b: 0, alpha: 1 }, "deuteranopia");
  assert.ok(Math.abs(deutRed.r - 0.6400) < 2e-4, `r = ${deutRed.r}`);
  assert.ok(Math.abs(deutRed.g - 0.5658) < 2e-4, `g = ${deutRed.g}`);
  assert.equal(deutRed.b, 0);

  // Protanopia of pure blue, #0000ff: the third column of the protanomaly
  // matrix, (-0.204868, 0.099216, 1.051998). Red clips to 0, blue clips to
  // 1 and encodes to 1.
  //   0.099216^(1/2.4) = exp(-2.310456 / 2.4) = exp(-0.962690) = 0.381890
  //                    -> 1.055 * 0.381890 - 0.055 = 0.347894
  // so blue is seen as roughly rgb(0, 89, 255).
  const protBlue = simulateCvd({ r: 0, g: 0, b: 1, alpha: 1 }, "protanopia");
  assert.equal(protBlue.r, 0);
  assert.ok(Math.abs(protBlue.g - 0.3479) < 2e-4, `g = ${protBlue.g}`);
  assert.ok(Math.abs(protBlue.b - 1) < 1e-15, `b = ${protBlue.b}`);
});

test("applying the matrix in linear light differs from applying it to gamma-encoded channels", () => {
  // The same matrix on a saturated colour: culori 4.0.2 takes the second
  // path, which is why this module does its own simulation.
  const red = { r: 1, g: 0, b: 0, alpha: 1 };
  const linear = simulateCvd(red, "deuteranopia");
  const gamma = simulateCvdInGammaSpace(red, "deuteranopia");
  assert.ok(linear.r - gamma.r > 0.25, `${linear.r} vs ${gamma.r}`);
  assert.ok(linear.g - gamma.g > 0.25, `${linear.g} vs ${gamma.g}`);
  // Far past any plausible rounding: a mid grey against a dark brown.
  assert.ok(contrast(linear, gamma) > 2, `contrast ${contrast(linear, gamma)}`);
});

test("normal vision leaves a colour alone and an unknown model throws", () => {
  const c = { r: 0.2, g: 0.4, b: 0.6, alpha: 0.5 };
  assert.deepEqual(simulateCvd(c, "normal"), c);
  assert.throws(() => simulateCvd(c, "achromatopsia"), /unknown colour-vision model/);
});

test("a translucent foreground is composited before its contrast is measured", () => {
  const white = { r: 1, g: 1, b: 1, alpha: 1 };
  const half = { r: 0, g: 0, b: 0, alpha: 0.5 };
  const opaque = { r: 0.5, g: 0.5, b: 0.5, alpha: 1 };
  assert.ok(Math.abs(contrast(half, white) - contrast(opaque, white)) < 1e-12);
  // Without compositing the ratio would be the one for pure black.
  assert.ok(contrast(half, white) < contrast({ ...half, alpha: 1 }, white));
});
