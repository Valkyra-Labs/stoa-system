// The bridge between the parameter model in packages/tokens and the
// playground's token-id world.
//
// The model derives resolved token maps, one per theme and one per density
// mode, keyed by the names the build emits. The control panel and the
// override layer speak token ids instead (`semantic.light:color.accent`),
// because that is what a token file states and what a snapshot records.
// This module maps one onto the other, and applies the override layer on
// top of the derived tree.
//
// One behaviour changes when a parameter set is active. Without it, the
// playground edits the token sources, so an override on a palette entry
// travels to every role that references it. A derived tree is already
// resolved: the model decides each role on its own, so an override there
// changes the name it is written against and nothing else.
import { deriveTokens, type DerivedTokens, type PartialParameters } from "@valkyra-labs/stoa-tokens/model";
import {
  TOKEN_FILE_NAMES,
  baseTokens,
  flattenFile,
  type DensityMode,
  type Overrides,
  type ResolvedTokens,
  type Theme,
  type TokenEntry,
  type TokenFileName,
} from "../tokenModel";

const PREFIX = "--stoa-";

/** Every token the sources declare, which is the set the control panel
 * offers and the set an override can name. The token files do not change
 * while the app runs, so this is read once. */
const ENTRIES: TokenEntry[] = (Object.keys(TOKEN_FILE_NAMES) as TokenFileName[]).flatMap((file) =>
  flattenFile(file, baseTokens[file]),
);

/** Derive a tree, or null for "Stoa today", where there is no derivation
 * and the token sources are the base. */
export function derive(parameters: PartialParameters | null): DerivedTokens | null {
  return parameters === null ? null : deriveTokens(parameters);
}

/** The theme a token id reads its derived value from. The palette
 * primitives are filled from the light theme; the two wash entries are the
 * only ones whose value differs between the themes. */
function themeOf(file: TokenFileName): Theme {
  return file === "semantic.dark" ? "dark" : "light";
}

function derivedValue(tree: DerivedTokens, entry: TokenEntry): string {
  const name = entry.variable.slice(PREFIX.length);
  if (entry.file === "density") return tree.densities[entry.path[0] as DensityMode]?.[name] ?? "";
  return tree.themes[themeOf(entry.file)][name] ?? "";
}

/** Whether this token is one of the ones the given frame draws with: the
 * other theme's semantics and the other density modes are not. */
function appliesTo(entry: TokenEntry, theme: Theme, density: DensityMode): boolean {
  if (entry.file === "primitive") return true;
  if (entry.file === "density") return entry.path[0] === density;
  return themeOf(entry.file) === theme;
}

const REFERENCE = /\{([^}]+)\}/g;

/** An override as typed, with `{color.blue.600}` references followed into
 * the derived tree. A reference that leads nowhere is left visible rather
 * than resolved to an empty value. */
function literal(text: string, flat: Record<string, string>): string {
  return text.replace(REFERENCE, (whole, path: string) => flat[path.split(".").join("-")] ?? whole);
}

/** The derived tree with the override layer on top, in the shape the
 * previews and the control panel already read. */
export function derivedTokens(
  tree: DerivedTokens,
  overrides: Overrides,
  theme: Theme,
  density: DensityMode,
): ResolvedTokens {
  const flat = { ...tree.themes[theme], ...tree.densities[density] };
  const variables: Record<string, string> = {};
  for (const [name, value] of Object.entries(flat)) variables[`${PREFIX}${name}`] = value;

  const values: ResolvedTokens["values"] = {};
  for (const entry of ENTRIES) {
    const derivedText = derivedValue(tree, entry);
    const override = overrides[entry.id];
    const effective = override === undefined ? derivedText : literal(override, flat);
    values[entry.id] = { derived: derivedText, effective };
    if (override !== undefined && appliesTo(entry, theme, density)) variables[entry.variable] = effective;
  }
  return { variables, values };
}

/** Derived and effective values for every token in every file, which is
 * what the override markers in the control panel read. `derivedTokens`
 * covers one theme and one density mode; this covers all of them. */
export function derivedValues(tree: DerivedTokens, overrides: Overrides): ResolvedTokens["values"] {
  const flat = { ...tree.themes.light, ...tree.themes.dark, ...tree.densities[tree.parameters.density.mode] };
  const values: ResolvedTokens["values"] = {};
  for (const entry of ENTRIES) {
    const derivedText = derivedValue(tree, entry);
    const override = overrides[entry.id];
    values[entry.id] = { derived: derivedText, effective: override === undefined ? derivedText : literal(override, flat) };
  }
  return values;
}
