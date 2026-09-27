// The parameter model: the shape of the tree it derives, the hard rules it
// keeps by clamping, and the three presets measured by the checks of
// src/checks.mjs rather than by hand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { outOfGamut, parseColor } from "../src/color.mjs";
import { pairName, runAllChecks, summarize } from "../src/checks.mjs";
import { NON_TEXT_PAIRS, TEXT_AA, TEXT_AAA, TEXT_PAIRS } from "../src/pairs.mjs";
import { resolveTokens } from "../src/resolve.mjs";
import {
  CARRIED_TOKENS,
  DEFAULT_PARAMETERS,
  DENSITY_MODES,
  HIGH_CONTRAST,
  MIN_FONT_SIZE_PX,
  MIN_ROW_HEIGHT_PER_FONT_SIZE,
  PRESETS,
  SURFACE_STRATEGIES,
  THEMES,
  UNCLAMPED_PAIRS,
  UP_DOWN_MIN_LIGHTNESS,
  deriveTokens,
  highContrastParameters,
  isCustomDensity,
  modelRules,
  normalizeParameters,
} from "../src/model.mjs";

const css = await readFile(new URL("../dist/tokens.css", import.meta.url), "utf8");
const today = resolveTokens(css);

/** Every parameter set the invariants below are held against: the defaults,
 * the three presets, their high-contrast variants, and a sweep that moves
 * one parameter at a time away from the defaults. */
const PARAMETER_SETS = [
  ["defaults", undefined],
  ...Object.entries(PRESETS).map(([name, preset]) => [name, preset.parameters]),
  ...Object.entries(PRESETS).map(([name, preset]) => [`${name}, high contrast`, highContrastParameters(preset.parameters)]),
  ...SURFACE_STRATEGIES.map((surface) => [`surface ${surface}`, { surface }]),
  ...[0, 90, 180, 270].map((hue) => [`accent hue ${hue}`, { accent: { hue, chroma: 0.16 } }]),
  ["neutral tinted from the accent", { neutral: { source: "accent", chroma: 0.03 }, accent: { hue: 300, chroma: 0.14 } }],
  ["stretched ladder", { contrast: { multiplier: 1.6 } }],
  ["flattened ladder", { contrast: { multiplier: 0.7 } }],
  ["paper and ink close together", { neutral: { paper: 0.9, ink: 0.3 } }],
  ["custom density", { density: { mode: "regular", rowHeight: 26, cellPaddingX: 5, fontSize: 12 } }],
];

/** The enforced results of src/checks.mjs a derived tree is allowed to
 * fail, and the reason each one is not the model's to clamp. */
const ALLOWED_FAILURES = new Set([
  ...THEMES.flatMap((theme) => UNCLAMPED_PAIRS.map((pair) => `text-contrast/${theme}/${pair}`)),
  // WCAG 2.2 target size is not one of the model's hard rules: a mode may
  // stay denser than 24px on purpose, and the two modes the parameters do
  // not select keep Stoa's own table, where compact is 22px.
  "target-size/compact/density-row-height",
]);

const checksOf = (derived) => runAllChecks({ themes: derived.themes, densities: derived.densities });

test("a derived tree carries every token name the build emits", () => {
  const derived = deriveTokens();
  for (const theme of THEMES) {
    assert.deepEqual(
      Object.keys(derived.themes[theme]).sort(),
      Object.keys(today.themes[theme]).sort(),
      `${theme}: the derived token names differ from the built ones`,
    );
  }
  assert.deepEqual(Object.keys(derived.densities), DENSITY_MODES);
  for (const mode of DENSITY_MODES) {
    assert.deepEqual(Object.keys(derived.densities[mode]).sort(), Object.keys(today.densities[mode]).sort());
  }
});

test("the tokens the model carries unchanged still match the build", () => {
  // Type, space and motion have no parameters until briefs 07 and 08, so
  // the model repeats the built values. This is the gate that keeps the
  // repetition from going stale.
  for (const [name, value] of Object.entries(CARRIED_TOKENS)) {
    assert.equal(today.themes.light[name], value, `${name} has moved in the sources`);
  }
});

test("the default parameters reproduce Stoa's neutral ladder", () => {
  const derived = deriveTokens();
  for (const name of Object.keys(today.themes.light)) {
    if (!name.startsWith("color-neutral-")) continue;
    assert.equal(derived.themes.light[name], today.themes.light[name], name);
  }
});

test("the default parameters leave the roles no hard rule touches on their rung", () => {
  const derived = deriveTokens();
  // border-strong, warning, up and the washes are missing from this list
  // because a hard rule moves each of them; the next tests are about that.
  const untouched = ["bg", "surface", "surface-sunken", "surface-hover", "border", "text", "text-muted", "text-subtle"];
  for (const role of untouched) {
    assert.equal(derived.themes.light[`color-${role}`], today.themes.light[`color-${role}`], role);
  }
});

test("the default parameters clamp what the built tokens fail", () => {
  const derived = deriveTokens();
  const clamped = new Set(derived.clamps.map((c) => `${c.theme}/${c.role}`));
  // Each of these is a recorded violation of the built tokens in
  // known-violations.json; the model fixes them by moving one lightness.
  for (const id of ["light/border-strong", "dark/border-strong", "light/warning", "dark/text-subtle"]) {
    assert.ok(clamped.has(id), `${id} was not clamped`);
  }
  const builtFailures = summarize(runAllChecks(today)).failures.length;
  const derivedFailures = summarize(checksOf(derived)).failures.length;
  assert.ok(derivedFailures < builtFailures, `derived ${derivedFailures} is not fewer than built ${builtFailures}`);
});

test("every parameter set passes every check the model is answerable for", () => {
  for (const [name, parameters] of PARAMETER_SETS) {
    const { failures } = summarize(checksOf(deriveTokens(parameters)));
    const unexpected = failures.filter((f) => !ALLOWED_FAILURES.has(f.id));
    assert.deepEqual(unexpected.map((f) => `${f.id} ${f.value.toFixed(2)}`), [], `${name}: unexpected failures`);
  }
});

test("every parameter set passes the rules checks.mjs does not carry", () => {
  for (const [name, parameters] of PARAMETER_SETS) {
    const derived = deriveTokens(parameters);
    const rules = modelRules(derived);
    for (const row of rules.upDown) {
      assert.ok(
        row.pass,
        `${name}, ${row.theme}: up and down are ${row.lightness.toFixed(3)} apart in lightness and ${JSON.stringify(row.deltaE)} in dE2000`,
      );
    }
    for (const row of rules.density) {
      assert.ok(row.fontSize >= MIN_FONT_SIZE_PX, `${name}, ${row.mode}: font size ${row.fontSize}px`);
      assert.ok(row.rowHeight >= row.fontSize * MIN_ROW_HEIGHT_PER_FONT_SIZE, `${name}, ${row.mode}: row height ${row.rowHeight}px`);
    }
    assert.ok(rules.pass, name);
  }
});

test("no derived colour falls outside the sRGB gamut", () => {
  for (const [name, parameters] of PARAMETER_SETS) {
    const derived = deriveTokens(parameters);
    for (const theme of THEMES) {
      for (const [token, value] of Object.entries(derived.themes[theme])) {
        if (!token.startsWith("color-")) continue;
        const parsed = parseColor(value);
        assert.ok(parsed, `${name}, ${theme}: ${token} is not a colour this module can read: ${value}`);
        assert.ok(!outOfGamut(parsed), `${name}, ${theme}: ${token} is outside sRGB: ${value}`);
      }
    }
  }
});

test("every clamp reports the value it produced", () => {
  for (const [name, parameters] of PARAMETER_SETS) {
    const derived = deriveTokens(parameters);
    // A role can be clamped twice, once for contrast and once to hold it
    // away from its opposite; the token carries the last of them.
    const last = new Map();
    for (const clamp of derived.clamps) {
      assert.notEqual(clamp.from, clamp.to, `${name}: ${clamp.id} reports no movement`);
      assert.ok(clamp.message.length > 0, `${name}: ${clamp.id} has no message`);
      if (clamp.property === "lightness") last.set(`${clamp.theme}/${clamp.role}`, clamp);
    }
    for (const [role, clamp] of last) {
      const token = derived.themes[clamp.theme][`color-${clamp.role}`];
      const emitted = Number.parseFloat(token.slice("oklch(".length));
      assert.equal(emitted, clamp.to, `${name}: ${role} reports ${clamp.to} but the token carries ${token}`);
    }
  }
});

test("an accent too pale for its surface is clamped, and the clamp says so", () => {
  // Blue at L 0.75 on a white surface is about 3:1; the text target moves
  // it down until it reaches 4.5:1, and nothing else changes.
  const parameters = { accent: { hue: 255, chroma: 0.17, lightness: { light: 0.75 } } };
  const derived = deriveTokens(parameters);
  const clamp = derived.clamps.find((c) => c.id === "light/accent/lightness");
  assert.ok(clamp, "the accent was not clamped");
  assert.equal(clamp.from, 0.75);
  assert.ok(clamp.to < 0.75, `expected a lower lightness, got ${clamp.to}`);
  assert.equal(clamp.target, TEXT_AA);
  assert.ok(clamp.reached, clamp.message);
  assert.match(clamp.message, /^light accent: L 0\.75 lowered to 0\.\d+ for 4\.5:1 against (surface|bg)$/);

  const accent = deriveTokens(parameters).themes.light["color-accent"];
  const surface = deriveTokens(parameters).themes.light["color-surface"];
  assert.ok(
    checksOf(derived).find((r) => r.id === "text-contrast/light/accent-on-surface").value >= TEXT_AA,
    `${accent} on ${surface} is under the target`,
  );
});

test("an accent too pale for a dark surface is raised instead", () => {
  const derived = deriveTokens({ accent: { hue: 255, chroma: 0.12, lightness: { dark: 0.3 } } });
  const clamp = derived.clamps.find((c) => c.id === "dark/accent/lightness");
  assert.ok(clamp, "the accent was not clamped");
  assert.ok(clamp.to > 0.3, `expected a higher lightness, got ${clamp.to}`);
  assert.match(clamp.message, /^dark accent: L 0\.3 raised to /);
});

test("rising and falling too close together are pushed apart", () => {
  // The same hue for both: no lightness distance and no hue to fall back
  // on, so the rule has to move one of them.
  const derived = deriveTokens({
    up: { hue: 170, chroma: 0.11, lightness: { light: 0.53 } },
    down: { hue: 170, chroma: 0.11, lightness: { light: 0.55 } },
  });
  const clamp = derived.clamps.find((c) => c.id.endsWith("/separation"));
  assert.ok(clamp, "up and down were left on top of each other");
  assert.equal(clamp.theme, "light");
  assert.ok(derived.separation.light.lightness >= UP_DOWN_MIN_LIGHTNESS - 1e-9, clamp.message);
  assert.match(clamp.message, /to keep 0\.08 lightness from/);
});

test("a font size or a row height under the minimum is raised", () => {
  const derived = deriveTokens({ density: { mode: "compact", rowHeight: 12, cellPaddingX: 4, fontSize: 9 } });
  assert.equal(derived.densities.compact["density-font-size"], "11px");
  assert.equal(derived.densities.compact["density-row-height"], "17px");
  const messages = derived.clamps.filter((c) => c.property !== "lightness" && c.property !== "alpha").map((c) => c.message);
  assert.deepEqual(messages, [
    "compact font size: 9px raised to 11px, the smallest this system sets",
    "compact row height: 12px raised to 17px, 1.5 times the 11px font size",
  ]);
  // The modes the parameters do not select keep Stoa's own table.
  assert.equal(derived.densities.regular["density-row-height"], "28px");
});

test("the wash alpha drops until text over it clears the text target", () => {
  const derived = deriveTokens({ wash: { alpha: 0.9 } });
  const clamp = derived.clamps.find((c) => c.id === "light/up-wash/alpha");
  assert.ok(clamp, "the wash alpha was not clamped");
  assert.equal(clamp.from, 0.9);
  assert.ok(clamp.to < 0.9, `expected a lower alpha, got ${clamp.to}`);
  const result = checksOf(derived).find((r) => r.id === "text-contrast/light/text-on-up-wash-over-surface");
  assert.ok(result.pass, `${result.value.toFixed(2)}:1 is under ${result.threshold}`);
});

test("the high-contrast variant raises the ladder and the targets", () => {
  const plain = deriveTokens();
  const strong = deriveTokens(highContrastParameters());
  assert.equal(strong.parameters.highContrast, true);
  assert.equal(strong.parameters.contrast.multiplier, HIGH_CONTRAST.multiplier);
  const ratio = (tree, id) => checksOf(tree).find((r) => r.id === id).value;
  for (const id of ["text-contrast/light/text-muted-on-surface", "text-contrast/dark/text-muted-on-surface"]) {
    assert.ok(ratio(strong, id) >= TEXT_AAA, `${id}: ${ratio(strong, id).toFixed(2)}:1`);
    assert.ok(ratio(strong, id) > ratio(plain, id), `${id} did not go up`);
  }
  assert.ok(ratio(strong, "non-text-contrast/light/focus-on-surface") >= HIGH_CONTRAST.nonText);
});

test("the pairs the model does not clamp are real pairs of pairs.mjs", () => {
  const names = new Set([...TEXT_PAIRS, ...NON_TEXT_PAIRS].map(pairName));
  for (const pair of UNCLAMPED_PAIRS) assert.ok(names.has(pair), `${pair} is not a pair in pairs.mjs`);
});

test("deriving is pure: the same parameters give the same tree, and nothing is written back", () => {
  const parameters = structuredClone(PRESETS.studio.parameters);
  const before = JSON.stringify(parameters);
  const first = deriveTokens(parameters);
  const second = deriveTokens(parameters);
  assert.equal(JSON.stringify(parameters), before, "the parameters were modified");
  assert.deepEqual(first.themes, second.themes);
  assert.deepEqual(first.clamps, second.clamps);
});

test("a partial parameter set is filled in from the defaults", () => {
  const filled = normalizeParameters({ accent: { hue: 12 } });
  assert.equal(filled.accent.hue, 12);
  assert.equal(filled.accent.chroma, DEFAULT_PARAMETERS.accent.chroma);
  assert.deepEqual(filled.accent.lightness, { light: null, dark: null });
  assert.equal(filled.surface, DEFAULT_PARAMETERS.surface);
  assert.deepEqual(filled.density, DEFAULT_PARAMETERS.density);
  // An unknown value falls back rather than reaching the derivation.
  assert.equal(normalizeParameters({ surface: "chrome" }).surface, DEFAULT_PARAMETERS.surface);
  assert.equal(normalizeParameters({ polarity: "sideways" }).polarity, DEFAULT_PARAMETERS.polarity);
});

test("a density that no longer matches the mode it names is custom", () => {
  assert.equal(isCustomDensity({ density: { mode: "regular" } }), false);
  assert.equal(isCustomDensity({ density: { mode: "regular", rowHeight: 30 } }), true);
});

test("the corner language reaches the radius tokens, and cells stay square", () => {
  const derived = deriveTokens({ corner: { control: 6, overlay: 8 } });
  assert.equal(derived.themes.light["radius-none"], "0px");
  assert.equal(derived.themes.light["radius-sm"], "6px");
  assert.equal(derived.themes.light["radius-md"], "8px");
  assert.equal(derived.themes.light["radius-lg"], "16px");
  assert.equal(derived.themes.light["radius-full"], "9999px");
});

test("the surface strategy decides whether a panel is a tone step or a boundary", () => {
  const fill = deriveTokens({ surface: "fill" }).themes.light;
  const border = deriveTokens({ surface: "border" }).themes.light;
  const rule = deriveTokens({ surface: "rule" }).themes.light;
  assert.notEqual(fill["color-surface"], fill["color-bg"]);
  assert.equal(border["color-surface"], border["color-bg"]);
  assert.equal(rule["color-surface"], rule["color-bg"]);
  // A boundary strategy draws the panel edge; a rule strategy leaves a
  // hairline, so its border sits closer to the surface behind it.
  assert.notEqual(border["color-border"], rule["color-border"]);
});

test("every preset states the intent it was tuned for", () => {
  for (const [name, preset] of Object.entries(PRESETS)) {
    assert.ok(preset.label.length > 0, name);
    assert.ok(preset.intent.split(" ").length >= 20, `${name}: the intent is not a paragraph`);
    assert.ok(["light", "dark", "both"].includes(normalizeParameters(preset.parameters).polarity), name);
  }
});
