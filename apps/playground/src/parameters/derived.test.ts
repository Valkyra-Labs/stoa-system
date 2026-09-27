// The derived layer as the playground sees it: the same variable set the
// source resolver produces, the override layer on top of it, and a
// snapshot read back into the two layers.
import { PRESETS, deriveTokens } from "@valkyra-labs/stoa-tokens/model";
import { describe, expect, it } from "vitest";
import { derive, derivedTokens, derivedValues } from "./derived";
import { readSnapshot } from "./snapshot";
import { DENSITY_MODES, baseTokens, resolveTokens, type DensityMode, type Theme } from "../tokenModel";

const THEMES: Theme[] = ["light", "dark"];
const tree = deriveTokens(PRESETS.tape.parameters);

describe("the derived layer", () => {
  it("is off for Stoa today and on for a parameter set", () => {
    expect(derive(null)).toBeNull();
    expect(derive(PRESETS.tape.parameters)?.parameters.surface).toBe("fill");
  });

  for (const theme of THEMES) {
    for (const density of DENSITY_MODES) {
      it(`offers the same variables as the source resolver for ${theme} at ${density} density`, () => {
        const source = resolveTokens(baseTokens, {}, theme, density).variables;
        const derived = derivedTokens(tree, {}, theme, density).variables;
        expect(Object.keys(derived).sort()).toEqual(Object.keys(source).sort());
      });
    }
  }

  it("draws each theme and density mode with its own values", () => {
    const light = derivedTokens(tree, {}, "light", "regular").variables;
    const dark = derivedTokens(tree, {}, "dark", "regular").variables;
    expect(light["--stoa-color-bg"]).toBe(tree.themes.light["color-bg"]);
    expect(dark["--stoa-color-bg"]).toBe(tree.themes.dark["color-bg"]);
    expect(light["--stoa-color-bg"]).not.toBe(dark["--stoa-color-bg"]);
    const compact = derivedTokens(tree, {}, "light", "compact").variables;
    expect(compact["--stoa-density-row-height"]).toBe(tree.densities.compact["density-row-height"]);
  });

  it("reports the derived value of every token the control panel offers", () => {
    const values = derivedValues(tree, {});
    expect(values["semantic.light:color.accent"]?.derived).toBe(tree.themes.light["color-accent"]);
    expect(values["semantic.dark:color.accent"]?.derived).toBe(tree.themes.dark["color-accent"]);
    expect(values["primitive:color.neutral.0"]?.derived).toBe(tree.themes.light["color-neutral-0"]);
    expect(values["density:compact.row-height"]?.derived).toBe(tree.densities.compact["density-row-height"]);
    // Nothing is left without a value: an empty one would show in the
    // panel as a token the model forgot.
    for (const [id, value] of Object.entries(values)) expect(value.derived, id).not.toBe("");
  });
});

describe("the override layer on top of a derived tree", () => {
  const overrides = { "semantic.light:color.accent": "oklch(0.3 0.2 300)" };

  it("replaces the derived value in the theme it names, and no other", () => {
    const light = derivedTokens(tree, overrides, "light", "regular").variables;
    const dark = derivedTokens(tree, overrides, "dark", "regular").variables;
    expect(light["--stoa-color-accent"]).toBe("oklch(0.3 0.2 300)");
    expect(dark["--stoa-color-accent"]).toBe(tree.themes.dark["color-accent"]);
  });

  it("keeps the derived value beside the override, which is what Override detected shows", () => {
    const values = derivedValues(tree, overrides);
    expect(values["semantic.light:color.accent"]).toEqual({
      derived: tree.themes.light["color-accent"],
      effective: "oklch(0.3 0.2 300)",
    });
  });

  it("follows a reference in an override into the derived tree", () => {
    const values = derivedValues(tree, { "semantic.light:color.accent": "{color.teal.600}" });
    expect(values["semantic.light:color.accent"]?.effective).toBe(tree.themes.light["color-teal-600"]);
  });

  it("leaves a reference that leads nowhere visible rather than resolving it away", () => {
    const values = derivedValues(tree, { "semantic.light:color.accent": "{color.nothing.here}" });
    expect(values["semantic.light:color.accent"]?.effective).toBe("{color.nothing.here}");
  });

  it("applies a density override only to the mode it names", () => {
    const overridden = { "density:compact.row-height": "30px" };
    const compact = derivedTokens(tree, overridden, "light", "compact" as DensityMode).variables;
    const regular = derivedTokens(tree, overridden, "light", "regular").variables;
    expect(compact["--stoa-density-row-height"]).toBe("30px");
    expect(regular["--stoa-density-row-height"]).toBe(tree.densities.regular["density-row-height"]);
  });
});

describe("reading a snapshot back", () => {
  it("restores the parameters and the overrides", () => {
    const state = readSnapshot({
      parameters: PRESETS.studio.parameters,
      overrides: { "semantic.light:color.accent": "oklch(0.3 0.2 300)" },
    });
    expect(state.parameters?.surface).toBe("fill");
    expect(state.parameters?.density?.mode).toBe("comfortable");
    expect(state.overrides).toEqual({ "semantic.light:color.accent": "oklch(0.3 0.2 300)" });
  });

  it("reads a snapshot written before parameters existed as Stoa today", () => {
    expect(readSnapshot({ overrides: {}, tokens: {} })).toEqual({ parameters: null, overrides: {} });
    expect(readSnapshot({ parameters: null, overrides: {} }).parameters).toBeNull();
  });

  it("drops anything in the file that is not a parameter set or an override", () => {
    const state = readSnapshot({ parameters: [1, 2], overrides: { a: 1, b: "two" } });
    expect(state.parameters).toBeNull();
    expect(state.overrides).toEqual({ b: "two" });
    expect(readSnapshot("not a snapshot")).toEqual({ parameters: null, overrides: {} });
  });
});
