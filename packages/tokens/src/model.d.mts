// Types for src/model.mjs, so the playground can hold the parameter model
// under a type checker. The module itself stays plain JavaScript: it runs
// in Node for the tests and in the browser for the playground, and adding a
// compile step to this package would put a build between the two.

export type Theme = "light" | "dark";
export type Polarity = "light" | "dark" | "both";
export type SurfaceStrategy = "border" | "fill" | "rule";
export type DensityMode = "compact" | "regular" | "comfortable";
export type CvdModel = "protanopia" | "deuteranopia";

/** Hue and chroma of a chromatic role, and the lightness its solve starts
 * from in each theme. A null lightness starts at the role's own seed; a
 * theme the polarity does not author ignores it and is generated from the
 * authored theme instead. */
export type RoleParameter = {
  hue: number;
  chroma: number;
  lightness: { light: number | null; dark: number | null };
};

export type NeutralParameter = {
  /** `accent` tints the neutral ladder from the accent hue instead of `hue`. */
  source: "hue" | "accent";
  hue: number;
  chroma: number;
  /** Lightness of the lightest and darkest rung of the ladder. */
  paper: number;
  ink: number;
};

export type DensityParameter = {
  mode: DensityMode;
  rowHeight: number;
  cellPaddingX: number;
  fontSize: number;
};

export type Parameters = {
  neutral: NeutralParameter;
  accent: RoleParameter;
  up: RoleParameter;
  down: RoleParameter;
  warning: RoleParameter;
  contrast: { multiplier: number };
  highContrast: boolean;
  polarity: Polarity;
  surface: SurfaceStrategy;
  corner: { control: number; overlay: number };
  density: DensityParameter;
  wash: { alpha: number };
};

/** A partial parameter set, as a preset or a snapshot states it. */
export type PartialParameters = {
  neutral?: Partial<NeutralParameter>;
  accent?: PartialRole;
  up?: PartialRole;
  down?: PartialRole;
  warning?: PartialRole;
  contrast?: { multiplier?: number };
  highContrast?: boolean;
  polarity?: Polarity;
  surface?: SurfaceStrategy;
  corner?: { control?: number; overlay?: number };
  density?: Partial<DensityParameter>;
  wash?: { alpha?: number };
};

export type PartialRole = {
  hue?: number;
  chroma?: number;
  lightness?: { light?: number | null; dark?: number | null };
};

/** One value a hard rule moved, and why. */
export type Clamp = {
  id: string;
  theme: Theme | null;
  role: string;
  property: "lightness" | "alpha" | "font-size" | "row-height";
  from: number;
  to: number;
  /** The contrast ratio, lightness distance or pixel size that was asked. */
  target: number;
  /** The role the clamp was measured against, or null for a size rule. */
  against: string | null;
  achieved: number;
  /** False when even the end of the scale does not make the target. */
  reached: boolean;
  message: string;
};

/** A role whose chroma the sRGB gamut cut back. */
export type Clipped = {
  theme: Theme;
  role: string;
  value: string;
  chroma: number;
  asked: number;
  message: string;
};

export type Separation = {
  lightness: number;
  deltaE: Record<CvdModel, number>;
  byLightness: boolean;
  byDeltaE: boolean;
  pass: boolean;
};

/** Token maps in the shape resolve.mjs returns from the built CSS: names
 * without the `--stoa-` prefix, values as literals. */
export type TokenMap = Record<string, string>;

export type DerivedTokens = {
  parameters: Parameters;
  themes: Record<Theme, TokenMap>;
  densities: Record<DensityMode, TokenMap>;
  clamps: Clamp[];
  clipped: Clipped[];
  separation: Record<Theme, Separation>;
};

export type ModelRules = {
  upDown: { theme: Theme; lightness: number; deltaE: Record<CvdModel, number>; minLightness: number; minDeltaE: number; pass: boolean }[];
  density: { mode: string; fontSize: number; rowHeight: number; minFontSize: number; minRowHeight: number; pass: boolean }[];
  pass: boolean;
};

export type Preset = { label: string; intent: string; parameters: PartialParameters };
export type PresetId = "tape" | "broadsheet" | "studio";

export const UP_DOWN_MIN_LIGHTNESS: number;
export const UP_DOWN_MIN_DELTA_E: number;
export const UP_DOWN_CVD_MODELS: CvdModel[];
export const MIN_FONT_SIZE_PX: number;
export const MIN_ROW_HEIGHT_PER_FONT_SIZE: number;
export const CORNER_STEPS: number[];
export const HIGH_CONTRAST: { multiplier: number; text: number; nonText: number };
export const THEMES: Theme[];
export const DENSITY_MODES: DensityMode[];
export const SURFACE_STRATEGIES: SurfaceStrategy[];
export const UNCLAMPED_PAIRS: string[];
export const DEFAULT_PARAMETERS: Parameters;
export const DENSITY_TABLE: Record<DensityMode, Omit<DensityParameter, "mode">>;
export const CARRIED_TOKENS: TokenMap;
export const PRESETS: Record<PresetId, Preset>;

/** Gamma-encoded sRGB as color.mjs parses it. */
export type Srgb = { r: number; g: number; b: number; alpha: number };

export type LightnessSolve = {
  /** The lightness found, in ten-thousandths. */
  units: number;
  /** True when the seed had to move. */
  clamped: boolean;
  /** False when even the end of the scale does not make the target. */
  reached: boolean;
};

export function formatOklch(parts: { lightness: number; chroma: number; hue: number; alpha?: number }): string;
export function normalizeParameters(given?: PartialParameters): Parameters;
export function highContrastParameters(parameters?: PartialParameters): Parameters;
export function ladderMultiplier(parameters?: PartialParameters): number;
export function fitChroma(lightness: number, chroma: number, hue: number, alpha?: number): number;
export function solveLightness(args: {
  seed: number;
  chroma: number;
  hue: number;
  direction: "up" | "down";
  backgrounds: { srgb: Srgb | null }[];
  target: number;
}): LightnessSolve;
export function isCustomDensity(parameters?: PartialParameters): boolean;
export function deriveTokens(parameters?: PartialParameters): DerivedTokens;
export function modelRules(derived: DerivedTokens): ModelRules;
