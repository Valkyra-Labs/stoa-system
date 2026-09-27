// Stoa's parameter model: a few parameters in, the whole token tree out,
// with the hard accessibility rules enforced by clamping and every clamp
// reported.
//
// Pure and dependency-free like the rest of src/: no `fs`, no `node:`
// built-ins, so the same module backs the tests, CI and the playground.
// The colour maths comes from color.mjs and the thresholds from pairs.mjs;
// neither is restated here.
//
// The output is the shape resolve.mjs produces from the built CSS: one
// token map per theme, one per density mode, keyed by the names the build
// emits without the `--stoa-` prefix. `runAllChecks` in checks.mjs reads it
// directly, so a derived tree is measured by exactly the code that measures
// the built one.
//
// The derivation runs in one direction, so every colour is measured against
// backgrounds that are already fixed:
//
//   neutral ladder -> surface roles -> text roles -> boundaries and marks
//   -> the translucent washes
//
// Two promises in pairs.mjs are measured but not clamped; see
// UNCLAMPED_PAIRS for which and why. The type ramp, the motion tokens and
// the space scale are carried through unchanged: their parameters are
// briefs 07 and 08.

import { clipToGamut, compositeOver, contrast, deltaE2000Srgb, outOfGamut, parseColor, simulateCvd } from "./color.mjs";
import { NON_TEXT, TEXT_AA, TEXT_AAA } from "./pairs.mjs";

/** @typedef {"light" | "dark"} Theme */
/** @typedef {{ hue: number, chroma: number, lightness: { light: number | null, dark: number | null } }} RoleParameter */

/** Lightness is searched and emitted on this grid, so the value a solve
 * returns is the value the token carries and the value the ratio was
 * measured on. */
const LIGHTNESS_STEPS = 10_000;
/** The same grid for chroma and for the alpha of a wash. */
const CHROMA_STEPS = 10_000;
const ALPHA_STEPS = 1000;
/** Floating point slack when a derived number is held against a threshold
 * it was built to meet exactly. */
const EPSILON = 1e-9;

/** Smallest OKLCH lightness difference this project wants between the
 * rising and falling colours. Below it the pair has to earn its place with
 * CIEDE2000 instead, under each dichromacy in UP_DOWN_CVD_MODELS. */
export const UP_DOWN_MIN_LIGHTNESS = 0.08;
/** The CIEDE2000 difference that stands in for the lightness difference.
 * Higher than the 10 that pairs.mjs reports against, because here it is the
 * only thing holding the two colours apart. */
export const UP_DOWN_MIN_DELTA_E = 20;
/** The dichromacies the rising and falling colours are held apart under.
 * Tritanopia is measured by checks.mjs but is not one of the two this rule
 * names: red and green are what a price grid leans on. */
export const UP_DOWN_CVD_MODELS = ["protanopia", "deuteranopia"];

/** Smallest font size any density mode may ask for. */
export const MIN_FONT_SIZE_PX = 11;
/** Smallest row height, as a multiple of the mode's font size. WCAG 2.2
 * target size (2.5.8) asks for 24px on top of this; the model reports that
 * number through checks.mjs rather than clamping to it, so a mode may stay
 * denser than 24px on purpose. */
export const MIN_ROW_HEIGHT_PER_FONT_SIZE = 1.5;

/** Control corner radii the corner language offers, in CSS pixels. Cells
 * are always square; overlays carry their own radius. */
export const CORNER_STEPS = [0, 2, 4, 6];

/** The ladder multiplier the generated high-contrast variant uses, and the
 * targets it raises text and non-text contrast to. */
export const HIGH_CONTRAST = { multiplier: 1.4, text: TEXT_AAA, nonText: TEXT_AA };

export const THEMES = /** @type {Theme[]} */ (["light", "dark"]);
export const DENSITY_MODES = ["compact", "regular", "comfortable"];
export const SURFACE_STRATEGIES = ["border", "fill", "rule"];

/** Pairs in pairs.mjs the model measures but does not clamp.
 *
 * Both are the heatmap drawing its price labels in text-muted straight over
 * a data cell at full opacity. Clamping them would mean pushing text-muted
 * to within a hair of text, or the cell colours far enough from the label
 * that the rising and falling cells collapse into each other under
 * dichromacy; the pair is a composition a component has to fix (a label
 * with its own backing), not a lightness the model can solve for. They are
 * recorded failures of the built tokens today as well, in
 * known-violations.json. */
export const UNCLAMPED_PAIRS = ["text-muted-on-bid", "text-muted-on-ask"];

// ---------------------------------------------------------------------------
// Colour values
// ---------------------------------------------------------------------------

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const trim = (n, places) => String(Number.parseFloat(n.toFixed(places)));

/** An `oklch()` literal at the precision the tokens carry. Hue is dropped
 * to 0 when chroma rounds away: CSS Color 4 makes hue powerless there, and
 * it keeps a pure grey written the way the sources write it. */
export function formatOklch({ lightness, chroma, hue, alpha = 1 }) {
  const c = trim(chroma, 4);
  const body = `${trim(lightness, 4)} ${c} ${c === "0" ? "0" : trim(hue, 2)}`;
  return alpha >= 1 ? `oklch(${body})` : `oklch(${body} / ${trim(alpha, 3)})`;
}

const snap = (value, steps) => Math.round(value * steps) / steps;
const atLeast = (value, threshold) => value >= threshold - EPSILON;

/** The most chroma this lightness and hue can hold inside sRGB, on the
 * grid the token is written on.
 *
 * This is a gamut map, not a clip: CSS Color 4 has a browser reduce chroma
 * for an out-of-gamut `oklch()` colour, and `contrast` in color.mjs can
 * only clip channelwise, so a colour left outside the gamut would be
 * measured as something no display draws. Reducing chroma here means every
 * ratio in this module is measured on the colour a browser will show. The
 * full CSS Color 4 algorithm also clips and judges the result by CIEDE2000;
 * this keeps lightness and hue exactly and gives up chroma alone. */
function fitChroma(lightness, chroma, hue, alpha) {
  const fits = (units) => !outOfGamut(parseColor(formatOklch({ lightness, chroma: units / CHROMA_STEPS, hue, alpha })));
  const asked = Math.round(chroma * CHROMA_STEPS);
  if (fits(asked)) return asked / CHROMA_STEPS;
  let good = 0;
  let bad = asked;
  while (bad - good > 1) {
    const mid = Math.round((good + bad) / 2);
    if (fits(mid)) good = mid;
    else bad = mid;
  }
  return good / CHROMA_STEPS;
}

/** A derived colour: the numbers it was built from, the token text, and the
 * sRGB the text parses to, so a measurement always describes the value the
 * token will carry. Lightness, chroma and alpha are snapped to the grid the
 * token is written on, and chroma is cut back to what sRGB holds. */
function color({ lightness, chroma, hue, alpha = 1 }) {
  const l = snap(clamp01(lightness), LIGHTNESS_STEPS);
  const a = snap(clamp01(alpha), ALPHA_STEPS);
  const asked = snap(Math.max(0, chroma), CHROMA_STEPS);
  const c = fitChroma(l, asked, hue, a);
  const parts = { lightness: l, chroma: c, hue, alpha: a };
  const text = formatOklch(parts);
  return { ...parts, chromaAsked: asked, clipped: c < asked, text, srgb: parseColor(text) };
}

// ---------------------------------------------------------------------------
// The neutral ladder
// ---------------------------------------------------------------------------

/** The neutral ladder Stoa ships today. A derived ladder keeps its shape
 * and moves its ends: `paper` and `ink` set the lightest and darkest step,
 * the contrast multiplier stretches the steps between them, and the chroma
 * parameter scales the whole chroma profile. */
const NEUTRAL_LADDER = [
  { step: "0", lightness: 1, chroma: 0 },
  { step: "50", lightness: 0.985, chroma: 0.002 },
  { step: "100", lightness: 0.967, chroma: 0.003 },
  { step: "150", lightness: 0.94, chroma: 0.004 },
  { step: "200", lightness: 0.92, chroma: 0.005 },
  { step: "300", lightness: 0.87, chroma: 0.007 },
  { step: "400", lightness: 0.71, chroma: 0.01 },
  { step: "500", lightness: 0.55, chroma: 0.012 },
  { step: "600", lightness: 0.45, chroma: 0.012 },
  { step: "700", lightness: 0.37, chroma: 0.012 },
  { step: "800", lightness: 0.28, chroma: 0.01 },
  { step: "850", lightness: 0.235, chroma: 0.009 },
  { step: "900", lightness: 0.205, chroma: 0.008 },
  { step: "950", lightness: 0.16, chroma: 0.007 },
  { step: "1000", lightness: 0.13, chroma: 0.006 },
];
/** The three numbers the ladder's shape is stated against. */
const LADDER_PAPER = 1;
const LADDER_INK = 0.13;
const LADDER_CHROMA = 0.012;
/** How far below the darkest step the sunken well of a dark fill sits.
 * semantic.dark.json states the same well as a literal today. */
const SUNKEN_BELOW_INK = 0.02;

function buildLadder({ hue, chroma, paper, ink }, multiplier) {
  const ladder = {};
  for (const rung of NEUTRAL_LADDER) {
    const shape = (rung.lightness - LADDER_INK) / (LADDER_PAPER - LADDER_INK);
    const stretched = clamp01(0.5 + (shape - 0.5) * multiplier);
    ladder[rung.step] = color({
      lightness: ink + stretched * (paper - ink),
      chroma: (rung.chroma / LADDER_CHROMA) * chroma,
      hue,
    });
  }
  ladder.sunken = color({
    lightness: Math.max(0, ink - SUNKEN_BELOW_INK),
    chroma: ladder["1000"].chroma,
    hue,
  });
  return ladder;
}

/** Which rung each surface role stands on, per theme and surface strategy.
 *
 * `fill` separates panels from the page with a tone step, the way Stoa does
 * today. `border` keeps every surface at one tone and draws the boundary
 * instead. `rule` also keeps one tone and leaves only a hairline; the
 * strategy name travels with the derived tree so a component knows to draw
 * horizontal rules and nothing else. */
const SURFACE_STEPS = {
  light: {
    fill: { bg: "50", surface: "0", "surface-sunken": "100", "surface-hover": "150", border: "200", "border-strong": "300" },
    border: { bg: "0", surface: "0", "surface-sunken": "50", "surface-hover": "150", border: "300", "border-strong": "300" },
    rule: { bg: "0", surface: "0", "surface-sunken": "50", "surface-hover": "150", border: "200", "border-strong": "300" },
  },
  dark: {
    fill: { bg: "1000", surface: "950", "surface-sunken": "sunken", "surface-hover": "900", border: "850", "border-strong": "800" },
    border: { bg: "1000", surface: "1000", "surface-sunken": "950", "surface-hover": "900", border: "800", "border-strong": "800" },
    rule: { bg: "1000", surface: "1000", "surface-sunken": "950", "surface-hover": "900", border: "850", "border-strong": "800" },
  },
};

/** Where a role's lightness starts before the rules move it, per theme.
 * These are the values Stoa ships today, so the default parameters land on
 * today's colours wherever a rule leaves them alone. */
const ROLE_SEEDS = {
  accent: { light: 0.52, dark: 0.7 },
  focus: { light: 0.6, dark: 0.7 },
  up: { light: 0.53, dark: 0.74 },
  down: { light: 0.56, dark: 0.72 },
  warning: { light: 0.78, dark: 0.78 },
};

/** Which rung a neutral text or boundary role starts on. */
const NEUTRAL_ROLE_STEPS = {
  light: { text: "950", "text-muted": "600", "text-subtle": "500" },
  dark: { text: "100", "text-muted": "400", "text-subtle": "500" },
};

/** What each derived role has to keep. The backgrounds named here are all
 * derived before the role that names them, which is what makes the order at
 * the top of this file matter. Targets come from pairs.mjs. */
const ROLE_CONSTRAINTS = {
  text: [
    { target: TEXT_AAA, on: ["bg", "surface"] },
    { target: TEXT_AA, on: ["surface-hover", "surface-sunken"] },
  ],
  "text-muted": [{ target: TEXT_AA, on: ["surface", "bg", "surface-sunken"] }],
  "text-subtle": [{ target: TEXT_AA, on: ["surface", "bg"] }],
  "border-strong": [{ target: NON_TEXT, on: ["surface", "bg"] }],
  accent: [{ target: TEXT_AA, on: ["surface", "bg"] }],
  focus: [{ target: NON_TEXT, on: ["surface", "bg"] }],
  up: [{ target: TEXT_AA, on: ["surface", "bg"] }],
  down: [{ target: TEXT_AA, on: ["surface", "bg"] }],
  warning: [{ target: TEXT_AA, on: ["surface", "bg"] }],
};

/** `border` is not in ROLE_CONSTRAINTS on purpose: pairs.mjs reports its
 * ratio and does not enforce it, because a panel boundary identifies no
 * control. It keeps its rung whatever the rung measures. */

// ---------------------------------------------------------------------------
// Parameters
// ---------------------------------------------------------------------------

export const DEFAULT_PARAMETERS = {
  /** Neutral temperature: the hue and chroma of the grey ladder, and the
   * lightness of its two ends. `source: "accent"` tints the neutrals from
   * the accent hue instead of `hue`. */
  neutral: { source: "hue", hue: 250, chroma: 0.012, paper: 1, ink: 0.13 },
  /** Hue and chroma per chromatic role; lightness is solved from contrast,
   * starting at the value given here for that polarity, or at the role's
   * seed when it is null. */
  accent: { hue: 255, chroma: 0.17, lightness: { light: null, dark: null } },
  up: { hue: 170, chroma: 0.12, lightness: { light: null, dark: null } },
  down: { hue: 30, chroma: 0.18, lightness: { light: null, dark: null } },
  warning: { hue: 80, chroma: 0.15, lightness: { light: null, dark: null } },
  /** One multiplier over the lightness ladder, and the high-contrast
   * variant, which raises both the multiplier and the contrast targets. */
  contrast: { multiplier: 1 },
  highContrast: false,
  /** Which polarity the parameters are designed for. Both themes are always
   * emitted, because every token name has to exist in both; the per-role
   * `lightness` is where the other polarity is tuned separately. */
  polarity: "both",
  /** How a panel is separated from the page: border, fill or rule. */
  surface: "fill",
  /** Corner language. Cells are always square, so `radius-none` stays 0. */
  corner: { control: 2, overlay: 4 },
  /** The selected density mode and the three numbers it carries. The other
   * two modes keep the values in DENSITY_TABLE. */
  density: { mode: "regular", rowHeight: 28, cellPaddingX: 8, fontSize: 13 },
  /** Alpha of the depth-bar washes, before the text-over-wash rule lowers
   * it. */
  wash: { alpha: 0.18 },
};

/** The three density modes as Stoa ships them. */
export const DENSITY_TABLE = {
  compact: { rowHeight: 22, cellPaddingX: 6, fontSize: 12 },
  regular: { rowHeight: 28, cellPaddingX: 8, fontSize: 13 },
  comfortable: { rowHeight: 36, cellPaddingX: 12, fontSize: 14 },
};

const number = (value, fallback) => (typeof value === "number" && Number.isFinite(value) ? value : fallback);
const oneOf = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);

function normalizeRole(given, fallback) {
  const from = given ?? {};
  const lightness = from.lightness ?? {};
  return {
    hue: number(from.hue, fallback.hue),
    chroma: number(from.chroma, fallback.chroma),
    lightness: {
      light: number(lightness.light, null),
      dark: number(lightness.dark, null),
    },
  };
}

/** Fill in everything a caller left out, so the rest of the module reads a
 * complete parameter set and a snapshot can store a partial one. */
export function normalizeParameters(given = {}) {
  const d = DEFAULT_PARAMETERS;
  const neutral = given.neutral ?? {};
  const density = given.density ?? {};
  const mode = oneOf(density.mode, DENSITY_MODES, d.density.mode);
  const table = DENSITY_TABLE[mode];
  return {
    neutral: {
      source: oneOf(neutral.source, ["hue", "accent"], d.neutral.source),
      hue: number(neutral.hue, d.neutral.hue),
      chroma: number(neutral.chroma, d.neutral.chroma),
      paper: number(neutral.paper, d.neutral.paper),
      ink: number(neutral.ink, d.neutral.ink),
    },
    accent: normalizeRole(given.accent, d.accent),
    up: normalizeRole(given.up, d.up),
    down: normalizeRole(given.down, d.down),
    warning: normalizeRole(given.warning, d.warning),
    contrast: { multiplier: number(given.contrast?.multiplier, d.contrast.multiplier) },
    highContrast: given.highContrast === true,
    polarity: oneOf(given.polarity, ["light", "dark", "both"], d.polarity),
    surface: oneOf(given.surface, SURFACE_STRATEGIES, d.surface),
    corner: {
      control: number(given.corner?.control, d.corner.control),
      overlay: number(given.corner?.overlay, d.corner.overlay),
    },
    density: {
      mode,
      rowHeight: number(density.rowHeight, table.rowHeight),
      cellPaddingX: number(density.cellPaddingX, table.cellPaddingX),
      fontSize: number(density.fontSize, table.fontSize),
    },
    wash: { alpha: number(given.wash?.alpha, d.wash.alpha) },
  };
}

/** The generated high-contrast variant of a parameter set: the ladder is
 * stretched and every contrast target goes up a level. */
export function highContrastParameters(parameters) {
  const p = normalizeParameters(parameters);
  return {
    ...p,
    contrast: { multiplier: Math.max(p.contrast.multiplier, HIGH_CONTRAST.multiplier) },
    highContrast: true,
  };
}

/** True when the density numbers no longer match the mode they name, which
 * is what the panel calls a custom density. */
export function isCustomDensity(parameters) {
  const { mode, rowHeight, cellPaddingX, fontSize } = normalizeParameters(parameters).density;
  const table = DENSITY_TABLE[mode];
  return rowHeight !== table.rowHeight || cellPaddingX !== table.cellPaddingX || fontSize !== table.fontSize;
}

/** The contrast target a role asks for, after the high-contrast variant has
 * raised it. AAA text stays AAA; there is nothing above it. */
function target(asked, highContrast) {
  if (!highContrast) return asked;
  if (asked === TEXT_AA) return HIGH_CONTRAST.text;
  if (asked === NON_TEXT) return HIGH_CONTRAST.nonText;
  return asked;
}

// ---------------------------------------------------------------------------
// Solving for lightness
// ---------------------------------------------------------------------------

/** Move a role's lightness along `direction` until the WCAG 2 ratio against
 * every background reaches the target, holding hue and chroma.
 *
 * The search is a bisection on the emitted lightness grid and assumes the
 * ratio is monotone along the direction, which it is for a fixed hue and
 * chroma: away from the surface is always more contrast. Every probe is
 * measured on the colour the token would carry, and `contrast` clips into
 * sRGB first, so an out-of-gamut probe is measured as the display would
 * show it rather than as the maths would like it. `reached: false` means
 * even the end of the scale does not make the target. */
function solveLightness({ seed, chroma, hue, direction, backgrounds, target: wanted }) {
  const at = (units) => color({ lightness: units / LIGHTNESS_STEPS, chroma, hue });
  const ratio = (units) => {
    const c = at(units);
    return Math.min(...backgrounds.map((bg) => contrast(c.srgb, bg.srgb)));
  };
  const start = Math.round(seed * LIGHTNESS_STEPS);
  if (ratio(start) >= wanted) return { units: start, clamped: false, reached: true };

  const end = direction === "down" ? 0 : LIGHTNESS_STEPS;
  if (ratio(end) < wanted) return { units: end, clamped: true, reached: false };

  let good = end;
  let bad = start;
  while (Math.abs(good - bad) > 1) {
    const mid = Math.round((good + bad) / 2);
    if (ratio(mid) >= wanted) good = mid;
    else bad = mid;
  }
  return { units: good, clamped: true, reached: true };
}

/** The background a role ends up closest to failing, for the clamp note. */
function worstBackground(value, backgrounds) {
  let worst = backgrounds[0];
  for (const bg of backgrounds) {
    if (contrast(value.srgb, bg.srgb) < contrast(value.srgb, worst.srgb)) worst = bg;
  }
  return worst;
}

const ratioText = (n) => `${n.toFixed(2)}:1`;

/** Derive one role and record the clamp if a rule moved it. */
function deriveRole({ theme, role, seed, chroma, hue, direction, roles, highContrast, clamps }) {
  // The groups are separate rules over the same lightness; the one that
  // moves it furthest is the one that binds.
  let chosen = { units: Math.round(seed * LIGHTNESS_STEPS), clamped: false, reached: true, group: null };
  for (const group of ROLE_CONSTRAINTS[role] ?? []) {
    const wanted = target(group.target, highContrast);
    const backgrounds = group.on.map((name) => roles[name]);
    const solved = solveLightness({ seed, chroma, hue, direction, backgrounds, target: wanted });
    const further = direction === "down" ? solved.units < chosen.units : solved.units > chosen.units;
    if (solved.clamped && further) chosen = { ...solved, group: { ...group, wanted, backgrounds } };
  }

  const value = color({ lightness: chosen.units / LIGHTNESS_STEPS, chroma, hue });
  if (chosen.clamped && chosen.group) {
    const against = worstBackground(value, chosen.group.backgrounds);
    const achieved = contrast(value.srgb, against.srgb);
    const moved = value.lightness < seed ? "lowered" : "raised";
    clamps.push({
      id: `${theme}/${role}/lightness`,
      theme,
      role,
      property: "lightness",
      from: Number(trim(seed, 4)),
      to: value.lightness,
      target: chosen.group.wanted,
      against: against.role,
      achieved,
      reached: chosen.reached,
      message: chosen.reached
        ? `${theme} ${role}: L ${trim(seed, 4)} ${moved} to ${trim(value.lightness, 4)} for ${chosen.group.wanted}:1 against ${against.role}`
        : `${theme} ${role}: L ${trim(seed, 4)} ${moved} to ${trim(value.lightness, 4)}, the end of the scale, and still only ${ratioText(achieved)} against ${against.role} where ${chosen.group.wanted}:1 is asked`,
    });
  }
  return value;
}

// ---------------------------------------------------------------------------
// One theme
// ---------------------------------------------------------------------------

/** Rising against falling: the lightness distance, and CIEDE2000 under each
 * dichromacy the rule names. `pass` is the rule itself, which either
 * distance may satisfy on its own. */
function separation(up, down) {
  const deltaE = {};
  for (const model of UP_DOWN_CVD_MODELS) {
    deltaE[model] = deltaE2000Srgb(simulateCvd(up.srgb, model), simulateCvd(down.srgb, model));
  }
  const lightness = Math.abs(up.lightness - down.lightness);
  const byLightness = atLeast(lightness, UP_DOWN_MIN_LIGHTNESS);
  const byDeltaE = UP_DOWN_CVD_MODELS.every((model) => atLeast(deltaE[model], UP_DOWN_MIN_DELTA_E));
  return { lightness, deltaE, byLightness, byDeltaE, pass: byLightness || byDeltaE };
}

/** Hold the rising and falling colours apart. The one already further from
 * the surface is pushed further still: that direction only adds contrast
 * against the surface, so it cannot undo a rule already satisfied. */
function separateUpDown(theme, roles, clamps) {
  const before = separation(roles.up, roles.down);
  if (before.pass) return before;

  const away = theme === "light" ? "down" : "up";
  const [moving, fixed] =
    (away === "down") === (roles.up.lightness <= roles.down.lightness) ? ["up", "down"] : ["down", "up"];
  const wanted =
    away === "down"
      ? roles[fixed].lightness - UP_DOWN_MIN_LIGHTNESS
      : roles[fixed].lightness + UP_DOWN_MIN_LIGHTNESS;
  const seed = roles[moving].lightness;
  const value = color({ lightness: wanted, chroma: roles[moving].chromaAsked, hue: roles[moving].hue });
  roles[moving] = { ...value, role: moving };

  const after = separation(roles.up, roles.down);
  clamps.push({
    id: `${theme}/${moving}/separation`,
    theme,
    role: moving,
    property: "lightness",
    from: Number(trim(seed, 4)),
    to: value.lightness,
    target: UP_DOWN_MIN_LIGHTNESS,
    against: fixed,
    achieved: after.lightness,
    reached: after.pass,
    message: after.pass
      ? `${theme} ${moving}: L ${trim(seed, 4)} moved to ${trim(value.lightness, 4)} to keep ${UP_DOWN_MIN_LIGHTNESS} lightness from ${fixed}`
      : `${theme} ${moving}: L ${trim(seed, 4)} moved to ${trim(value.lightness, 4)}, the end of the scale, and up and down are still ${trim(after.lightness, 4)} apart where ${UP_DOWN_MIN_LIGHTNESS} is asked`,
  });
  return after;
}

/** Lower a wash's alpha until text drawn over it, composited on the surface
 * behind it, reaches the text target. Lowering alpha always moves the
 * composite towards the surface, which text already clears. */
function deriveWash({ theme, role, from, alpha, surface, text, highContrast, clamps }) {
  const wanted = target(TEXT_AA, highContrast);
  const at = (units) => color({ lightness: from.lightness, chroma: from.chroma, hue: from.hue, alpha: units / ALPHA_STEPS });
  const over = (units) => compositeOver(clipToGamut(at(units).srgb), clipToGamut(surface.srgb));
  const ratio = (units) => contrast(text.srgb, over(units));
  const start = Math.round(alpha * ALPHA_STEPS);
  if (ratio(start) >= wanted) return at(start);

  let good = 0;
  let bad = start;
  while (bad - good > 1) {
    const mid = Math.round((good + bad) / 2);
    if (ratio(mid) >= wanted) good = mid;
    else bad = mid;
  }
  const value = at(good);
  clamps.push({
    id: `${theme}/${role}/alpha`,
    theme,
    role,
    property: "alpha",
    from: Number(trim(alpha, 3)),
    to: value.alpha,
    target: wanted,
    against: "surface",
    achieved: ratio(good),
    reached: ratio(good) >= wanted,
    message: `${theme} ${role}: alpha ${trim(alpha, 3)} lowered to ${trim(value.alpha, 3)} so text over it on surface reaches ${wanted}:1`,
  });
  return value;
}

/** Every colour role of one theme, in the order the top of this file lists.
 * The roles carry their own name so a clamp note can say what bound them. */
function deriveThemeRoles(theme, p, ladder, clamps) {
  const direction = theme === "light" ? "down" : "up";
  const named = (role, value) => ({ ...value, role });
  const roles = {};

  const steps = SURFACE_STEPS[theme][p.surface];
  // The surfaces and the reported-only panel boundary stand on their rung
  // as the strategy places them; border-strong waits until the text roles
  // are in, because it is measured and moved like them.
  for (const [role, step] of Object.entries(steps)) {
    if (role !== "border-strong") roles[role] = named(role, ladder[step]);
  }

  const fromRung = (role, step) => {
    const rung = ladder[step];
    return named(
      role,
      deriveRole({ theme, role, seed: rung.lightness, chroma: rung.chroma, hue: rung.hue, direction, roles, highContrast: p.highContrast, clamps }),
    );
  };
  for (const [role, step] of Object.entries(NEUTRAL_ROLE_STEPS[theme])) roles[role] = fromRung(role, step);
  roles["border-strong"] = fromRung("border-strong", steps["border-strong"]);

  const seedOf = (role) => p[role].lightness[theme] ?? ROLE_SEEDS[role][theme];
  for (const role of ["accent", "up", "down", "warning"]) {
    roles[role] = named(
      role,
      deriveRole({ theme, role, seed: seedOf(role), chroma: p[role].chroma, hue: p[role].hue, direction, roles, highContrast: p.highContrast, clamps }),
    );
  }
  // Focus is the accent hue and chroma at its own starting lightness: it is
  // a ring around a control, not a fill, so it answers to 1.4.11 rather
  // than to the text target.
  roles.focus = named(
    "focus",
    deriveRole({ theme, role: "focus", seed: ROLE_SEEDS.focus[theme], chroma: p.accent.chroma, hue: p.accent.hue, direction, roles, highContrast: p.highContrast, clamps }),
  );

  const upDown = separateUpDown(theme, roles, clamps);

  roles.bid = named("bid", roles.up);
  roles.ask = named("ask", roles.down);
  roles["up-wash"] = named(
    "up-wash",
    deriveWash({ theme, role: "up-wash", from: roles.up, alpha: p.wash.alpha, surface: roles.surface, text: roles.text, highContrast: p.highContrast, clamps }),
  );
  roles["down-wash"] = named(
    "down-wash",
    deriveWash({ theme, role: "down-wash", from: roles.down, alpha: p.wash.alpha, surface: roles.surface, text: roles.text, highContrast: p.highContrast, clamps }),
  );

  return { roles, upDown };
}

// ---------------------------------------------------------------------------
// The tokens that carry no parameter yet
// ---------------------------------------------------------------------------

/** Type, space and motion as the build emits them today. Their parameters
 * are briefs 07 and 08; until then a derived tree carries the shipped
 * values so every component keeps working. A test holds this table against
 * the built CSS, so it cannot drift away from the sources. */
export const CARRIED_TOKENS = {
  "font-family-sans": "'IBM Plex Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif",
  "font-family-mono": "'IBM Plex Mono', ui-monospace, monospace",
  "font-size-2xs": "11px",
  "font-size-xs": "12px",
  "font-size-sm": "13px",
  "font-size-md": "14px",
  "font-size-lg": "16px",
  "font-size-xl": "20px",
  "font-size-2xl": "24px",
  "font-weight-regular": "400",
  "font-weight-medium": "500",
  "font-weight-semibold": "600",
  "font-line-height-tight": "1.25",
  "font-line-height-normal": "1.45",
  "space-0": "0px",
  "space-0-5": "2px",
  "space-1": "4px",
  "space-2": "8px",
  "space-3": "12px",
  "space-4": "16px",
  "space-6": "24px",
  "space-8": "32px",
  "space-12": "48px",
  "motion-duration-instant": "0ms",
  "motion-duration-fast": "80ms",
  "motion-duration-base": "160ms",
  "motion-duration-slow": "240ms",
  "motion-duration-flash": "600ms",
  "motion-easing-standard": "cubic-bezier(0.2, 0, 0, 1)",
  "motion-easing-enter": "cubic-bezier(0, 0, 0, 1)",
  "motion-easing-exit": "cubic-bezier(0.3, 0, 1, 1)",
  "focus-width": "2px",
  "focus-offset": "2px",
};

/** The corner language as radius tokens. `radius-full` is the pill of a
 * slider thumb and is not a corner the language sets. */
function shapeTokens({ control, overlay }) {
  return {
    "radius-none": "0px",
    "radius-sm": `${control}px`,
    "radius-md": `${overlay}px`,
    "radius-lg": `${overlay * 2}px`,
    "radius-full": "9999px",
  };
}

/** The three density modes, with the selected one carrying the parameters.
 * Font size and row height are clamped here; WCAG 2.2 target size is left
 * to checks.mjs to report. */
function deriveDensities(density, clamps) {
  const out = {};
  for (const mode of DENSITY_MODES) {
    const asked = mode === density.mode ? density : DENSITY_TABLE[mode];
    let fontSize = asked.fontSize;
    if (fontSize < MIN_FONT_SIZE_PX) {
      clamps.push({
        id: `${mode}/font-size`,
        theme: null,
        role: mode,
        property: "font-size",
        from: asked.fontSize,
        to: MIN_FONT_SIZE_PX,
        target: MIN_FONT_SIZE_PX,
        against: null,
        achieved: MIN_FONT_SIZE_PX,
        reached: true,
        message: `${mode} font size: ${asked.fontSize}px raised to ${MIN_FONT_SIZE_PX}px, the smallest this system sets`,
      });
      fontSize = MIN_FONT_SIZE_PX;
    }
    const minRow = Math.ceil(fontSize * MIN_ROW_HEIGHT_PER_FONT_SIZE);
    let rowHeight = asked.rowHeight;
    if (rowHeight < minRow) {
      clamps.push({
        id: `${mode}/row-height`,
        theme: null,
        role: mode,
        property: "row-height",
        from: asked.rowHeight,
        to: minRow,
        target: minRow,
        against: null,
        achieved: minRow,
        reached: true,
        message: `${mode} row height: ${asked.rowHeight}px raised to ${minRow}px, ${MIN_ROW_HEIGHT_PER_FONT_SIZE} times the ${fontSize}px font size`,
      });
      rowHeight = minRow;
    }
    out[mode] = {
      "density-row-height": `${rowHeight}px`,
      "density-cell-padding-x": `${asked.cellPaddingX}px`,
      "density-font-size": `${fontSize}px`,
    };
  }
  return out;
}

/** The palette primitives, filled with the role each name carries in the
 * sources today. A derived role with no primitive name of its own (the dark
 * focus ring, for one) appears under its semantic name alone. */
function paletteTokens(light, dark, theme) {
  const own = theme === "light" ? light : dark;
  return {
    "color-blue-600": light.accent.text,
    "color-blue-500": light.focus.text,
    "color-blue-400": dark.accent.text,
    "color-teal-600": light.up.text,
    "color-teal-400": dark.up.text,
    "color-teal-wash": own["up-wash"].text,
    "color-red-600": light.down.text,
    "color-red-400": dark.down.text,
    "color-red-wash": own["down-wash"].text,
    "color-amber-500": own.warning.text,
  };
}

const SEMANTIC_ROLES = [
  "bg",
  "surface",
  "surface-sunken",
  "surface-hover",
  "border",
  "border-strong",
  "text",
  "text-muted",
  "text-subtle",
  "accent",
  "focus",
  "up",
  "down",
  "bid",
  "ask",
  "up-wash",
  "down-wash",
  "warning",
];

// ---------------------------------------------------------------------------
// The model
// ---------------------------------------------------------------------------

/** Parameters in, the whole token tree out.
 *
 * @param {object} [parameters] a partial parameter set; the rest is filled
 *   in from DEFAULT_PARAMETERS.
 * @returns {{
 *   parameters: object,
 *   themes: Record<Theme, Record<string, string>>,
 *   densities: Record<string, Record<string, string>>,
 *   clamps: object[],
 *   clipped: object[],
 *   separation: Record<Theme, object>,
 * }} `themes` and `densities` have the shape resolve.mjs returns, so
 *   checks.mjs measures a derived tree the same way it measures the built
 *   one. `clamps` is every value a hard rule moved, in derivation order,
 *   and `clipped` every role whose chroma the sRGB gamut cut back.
 */
export function deriveTokens(parameters) {
  const p = normalizeParameters(parameters);
  const hue = p.neutral.source === "accent" ? p.accent.hue : p.neutral.hue;
  const ladder = buildLadder({ ...p.neutral, hue }, p.contrast.multiplier);

  const clamps = [];
  const derived = {};
  for (const theme of THEMES) derived[theme] = deriveThemeRoles(theme, p, ladder, clamps);

  const densities = deriveDensities(p.density, clamps);
  const shape = shapeTokens(p.corner);

  const themes = {};
  const clipped = [];
  for (const theme of THEMES) {
    const roles = derived[theme].roles;
    const tokens = { ...CARRIED_TOKENS, ...shape, ...densities[p.density.mode] };
    for (const [step, value] of Object.entries(ladder)) {
      if (step !== "sunken") tokens[`color-neutral-${step}`] = value.text;
    }
    Object.assign(tokens, paletteTokens(derived.light.roles, derived.dark.roles, theme));
    for (const role of SEMANTIC_ROLES) tokens[`color-${role}`] = roles[role].text;
    themes[theme] = tokens;

    for (const role of SEMANTIC_ROLES) {
      const value = roles[role];
      // bid and ask are up and down under another name; reporting them
      // again would say the same thing twice.
      if (!value.clipped || role === "bid" || role === "ask") continue;
      clipped.push({
        theme,
        role,
        value: value.text,
        chroma: value.chroma,
        asked: value.chromaAsked,
        message: `${theme} ${role}: chroma ${trim(value.chromaAsked, 4)} cut back to ${trim(value.chroma, 4)}, the most sRGB holds at L ${trim(value.lightness, 4)}`,
      });
    }
  }

  return {
    parameters: p,
    themes,
    densities,
    clamps,
    clipped,
    separation: { light: derived.light.upDown, dark: derived.dark.upDown },
  };
}

/** The hard rules checks.mjs does not carry: rising against falling, and
 * the two size rules. The contrast rules are checks.mjs's own, run on
 * `themes` and `densities` straight from `deriveTokens`. */
export function modelRules(derived) {
  const upDown = THEMES.map((theme) => ({
    theme,
    lightness: derived.separation[theme].lightness,
    deltaE: derived.separation[theme].deltaE,
    minLightness: UP_DOWN_MIN_LIGHTNESS,
    minDeltaE: UP_DOWN_MIN_DELTA_E,
    pass: derived.separation[theme].pass,
  }));
  const density = Object.entries(derived.densities).map(([mode, tokens]) => {
    const px = (name) => Number.parseFloat(tokens[name]);
    const fontSize = px("density-font-size");
    const rowHeight = px("density-row-height");
    return {
      mode,
      fontSize,
      rowHeight,
      minFontSize: MIN_FONT_SIZE_PX,
      minRowHeight: fontSize * MIN_ROW_HEIGHT_PER_FONT_SIZE,
      pass: atLeast(fontSize, MIN_FONT_SIZE_PX) && atLeast(rowHeight, fontSize * MIN_ROW_HEIGHT_PER_FONT_SIZE),
    };
  });
  return { upDown, density, pass: [...upDown, ...density].every((r) => r.pass) };
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

/** Three parameter sets, each with the intent it is meant to serve. The
 * numbers are starting points: the model derives the rest and clamps
 * whatever a hard rule reaches. "Stoa today" is not here, because it is the
 * built tokens with no derivation at all. */
export const PRESETS = {
  tape: {
    label: "Tape",
    intent:
      "A dark-first terminal: a warm near-black page, amber as the only chromatic accent, and rows tight enough that a full book and the tape fit on one screen. Rising and falling are told apart by lightness as much as by hue, so the pair survives a monochrome display and red-green dichromacy alike.",
    parameters: {
      neutral: { source: "hue", hue: 75, chroma: 0.012 },
      accent: { hue: 75, chroma: 0.15, lightness: { dark: 0.82 } },
      up: { hue: 195, chroma: 0.12, lightness: { dark: 0.84 } },
      down: { hue: 32, chroma: 0.17, lightness: { dark: 0.72 } },
      warning: { hue: 80, chroma: 0.15 },
      contrast: { multiplier: 1 },
      polarity: "dark",
      surface: "fill",
      corner: { control: 0, overlay: 0 },
      density: { mode: "compact", rowHeight: 22, cellPaddingX: 6, fontSize: 12 },
    },
  },
  broadsheet: {
    label: "Broadsheet",
    intent:
      "Paper and ink: a warm off-white page at one tone throughout, separated by horizontal rules rather than boxes, with a deep blue accent and no corner radius anywhere. Built for reading a long table top to bottom rather than watching one cell change.",
    parameters: {
      neutral: { source: "hue", hue: 82, chroma: 0.012, paper: 0.968, ink: 0.18 },
      accent: { hue: 255, chroma: 0.12, lightness: { light: 0.4 } },
      up: { hue: 165, chroma: 0.1, lightness: { light: 0.5 } },
      down: { hue: 18, chroma: 0.14, lightness: { light: 0.4 } },
      warning: { hue: 80, chroma: 0.15 },
      contrast: { multiplier: 1 },
      polarity: "light",
      surface: "rule",
      corner: { control: 0, overlay: 0 },
      density: { mode: "regular", rowHeight: 28, cellPaddingX: 8, fontSize: 13 },
    },
  },
  studio: {
    label: "Studio",
    intent:
      "Gradebooks: a cool neutral, a green accent, and above-target and below-target in blue and orange rather than green and red, so the two do not collapse for a red-green dichromat reading a class at a glance. Rows are comfortable because the reader is scanning names, not prices.",
    parameters: {
      neutral: { source: "hue", hue: 195, chroma: 0.014 },
      accent: { hue: 158, chroma: 0.12, lightness: { light: 0.5 } },
      up: { hue: 255, chroma: 0.14, lightness: { light: 0.46 } },
      down: { hue: 50, chroma: 0.15, lightness: { light: 0.555 } },
      warning: { hue: 80, chroma: 0.15 },
      contrast: { multiplier: 1 },
      polarity: "light",
      surface: "fill",
      corner: { control: 6, overlay: 8 },
      density: { mode: "comfortable", rowHeight: 34, cellPaddingX: 12, fontSize: 14 },
    },
  },
};
