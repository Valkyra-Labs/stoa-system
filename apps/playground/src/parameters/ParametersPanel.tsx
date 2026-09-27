// The parameters panel: the preset picker, the parameters themselves, and
// the list of values a hard rule moved.
//
// Every control here is a Stoa component, the same rule the token panel
// follows: tuning the system exercises the components the system is for.
// The panel only reads and writes parameters; the derivation, the rules
// and the clamps all belong to packages/tokens/src/model.mjs.
import {
  CORNER_STEPS,
  DENSITY_MODES,
  DENSITY_TABLE,
  HIGH_CONTRAST,
  PRESETS,
  SURFACE_STRATEGIES,
  highContrastParameters,
  isCustomDensity,
  normalizeParameters,
  type DensityMode,
  type DerivedTokens,
  type PartialParameters,
  type Polarity,
  type Preset,
  type RoleParameter,
  type SurfaceStrategy,
} from "@valkyra-labs/stoa-tokens/model";
import { Button, ChoiceGroup, StatusBadge, TimeSlider } from "@valkyra-labs/stoa-react";

/** The presets by picker id. The picker also offers two entries that are
 * not presets, so a lookup has to be allowed to miss. */
const BY_ID: Record<string, Preset | undefined> = PRESETS;

/** The picker entry for the built tokens, which are not a parameter set at
 * all: no derivation, the token sources as they stand. */
export const STOA_TODAY = "stoa-today";
/** The picker entry for a parameter set that is nobody's preset any more. */
export const CUSTOM = "custom";

/** Every entry of the preset picker, in the order it is shown. */
export const PRESET_CHOICES = [
  { id: STOA_TODAY, label: "Stoa today" },
  ...Object.entries(PRESETS).map(([id, preset]) => ({ id, label: preset.label })),
  { id: CUSTOM, label: "Custom" },
];

/** The parameters a picker entry loads. "Stoa today" loads none, which is
 * what turns the derived layer off; "Custom" keeps whatever is in hand. */
export function parametersForPreset(id: string, current: PartialParameters | null): PartialParameters | null {
  if (id === STOA_TODAY) return null;
  if (id === CUSTOM) return normalizeParameters(current ?? undefined);
  return BY_ID[id]?.parameters ?? null;
}

export type ParametersPanelProps = {
  /** Which picker entry is selected. */
  preset: string;
  /** The parameter set in hand, or null for Stoa today. */
  parameters: PartialParameters | null;
  /** The tree those parameters derive, or null for Stoa today. */
  derived: DerivedTokens | null;
  onPreset: (id: string) => void;
  onChange: (parameters: PartialParameters) => void;
};

type ChromaticRole = "accent" | "up" | "down" | "warning";

const CHROMATIC_ROLES: { role: ChromaticRole; label: string }[] = [
  { role: "accent", label: "Accent" },
  { role: "up", label: "Rising" },
  { role: "down", label: "Falling" },
  { role: "warning", label: "Warning" },
];

function NumberSlider({
  label,
  value,
  min,
  max,
  step,
  places,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  places: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="pg-token__slider">
      <span className="pg-token__label">{label}</span>
      <TimeSlider
        label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        format={(v) => `${v.toFixed(places)}${unit}`}
      />
    </div>
  );
}

export function ParametersPanel({ preset, parameters, derived, onPreset, onChange }: ParametersPanelProps) {
  const picker = (
    <ChoiceGroup label="Preset" choices={PRESET_CHOICES} value={preset} onChange={onPreset} />
  );

  if (parameters === null || derived === null) {
    return (
      <div className="pg-stack">
        {picker}
        <p className="pg-note">
          Stoa today: the built tokens of this working tree, with no derivation under them. Pick a preset to put the
          parameter model underneath, or Custom to start from its defaults.
        </p>
      </div>
    );
  }

  const p = normalizeParameters(parameters);
  const set = (patch: PartialParameters) => onChange({ ...p, ...patch });
  const setRole = (role: ChromaticRole, patch: Partial<RoleParameter>) => onChange({ ...p, [role]: { ...p[role], ...patch } });
  const intent = BY_ID[preset]?.intent;

  return (
    <div className="pg-stack">
      {picker}
      {intent && <p className="pg-params__intent">{intent}</p>}

      <section className="pg-group" aria-label="Neutral temperature">
        <h3 className="pg-group__title">Neutral temperature</h3>
        <ChoiceGroup
          label="Neutral hue source"
          choices={[
            { id: "hue", label: "Own hue" },
            { id: "accent", label: "Tint from accent" },
          ]}
          value={p.neutral.source}
          onChange={(source) => set({ neutral: { ...p.neutral, source } })}
        />
        <NumberSlider
          label="Hue"
          value={p.neutral.hue}
          min={0}
          max={360}
          step={1}
          places={0}
          onChange={(hue) => set({ neutral: { ...p.neutral, hue } })}
        />
        <NumberSlider
          label="Chroma"
          value={p.neutral.chroma}
          min={0}
          max={0.03}
          step={0.001}
          places={3}
          onChange={(chroma) => set({ neutral: { ...p.neutral, chroma } })}
        />
        <NumberSlider
          label="Paper (lightest rung)"
          value={p.neutral.paper}
          min={0.8}
          max={1}
          step={0.002}
          places={3}
          onChange={(paper) => set({ neutral: { ...p.neutral, paper } })}
        />
        <NumberSlider
          label="Ink (darkest rung)"
          value={p.neutral.ink}
          min={0}
          max={0.4}
          step={0.005}
          places={3}
          onChange={(ink) => set({ neutral: { ...p.neutral, ink } })}
        />
      </section>

      <section className="pg-group" aria-label="Chromatic roles">
        <h3 className="pg-group__title">Chromatic roles</h3>
        <p className="pg-note">
          Hue and chroma are set here; lightness is solved against the surface the role sits on, starting from the
          value the preset gives for each theme its polarity authors.
        </p>
        {CHROMATIC_ROLES.map(({ role, label }) => (
          <div key={role} className="pg-params__role">
            <span
              className="pg-swatch"
              style={{ background: derived.themes[p.polarity === "dark" ? "dark" : "light"][`color-${role}`] }}
              aria-hidden="true"
              data-swatch={`parameter-${role}`}
            />
            <NumberSlider
              label={`${label} hue`}
              value={p[role].hue}
              min={0}
              max={360}
              step={1}
              places={0}
              onChange={(hue) => setRole(role, { hue })}
            />
            <NumberSlider
              label={`${label} chroma`}
              value={p[role].chroma}
              min={0}
              max={0.3}
              step={0.005}
              places={3}
              onChange={(chroma) => setRole(role, { chroma })}
            />
          </div>
        ))}
      </section>

      <section className="pg-group" aria-label="Contrast and polarity">
        <h3 className="pg-group__title">Contrast and polarity</h3>
        <NumberSlider
          label="Ladder multiplier"
          value={p.contrast.multiplier}
          min={0.6}
          max={1.8}
          step={0.05}
          places={2}
          onChange={(multiplier) => set({ contrast: { multiplier } })}
        />
        <ChoiceGroup
          label="Contrast variant"
          choices={[
            { id: "standard", label: "Standard" },
            { id: "high", label: "High contrast" },
          ]}
          value={p.highContrast ? "high" : "standard"}
          onChange={(id) => onChange(id === "high" ? highContrastParameters(p) : { ...p, highContrast: false })}
        />
        <p className="pg-note">
          High contrast stretches the ladder to at least {HIGH_CONTRAST.multiplier} whatever the multiplier says, and
          raises every contrast target a level. Standard gives the multiplier back.
        </p>
        <ChoiceGroup
          label="Polarity"
          choices={[
            { id: "light", label: "Light" },
            { id: "dark", label: "Dark" },
            { id: "both", label: "Both" },
          ]}
          value={p.polarity}
          onChange={(polarity: Polarity) => set({ polarity })}
        />
        <p className="pg-note">
          Both themes are always derived, because every token name has to exist in both. Polarity says which of them
          the parameters author. An authored theme starts each chromatic role from its own lightness; with Both, dark
          is tuned separately from light. A theme the polarity leaves out is generated from the authored one: each
          role starts at the authored lightness mirrored across the two surfaces, then the rules run on it.
        </p>
      </section>

      <section className="pg-group" aria-label="Surface and corners">
        <h3 className="pg-group__title">Surface and corners</h3>
        <ChoiceGroup
          label="Surface strategy"
          choices={SURFACE_STRATEGIES.map((id) => ({ id, label: id }))}
          value={p.surface}
          onChange={(surface: SurfaceStrategy) => set({ surface })}
        />
        <ChoiceGroup
          label="Control corner"
          choices={CORNER_STEPS.map((px) => ({ id: String(px), label: `${px}px` }))}
          value={String(p.corner.control)}
          onChange={(id) => set({ corner: { ...p.corner, control: Number(id) } })}
        />
        <NumberSlider
          label="Overlay corner"
          value={p.corner.overlay}
          min={0}
          max={16}
          step={1}
          places={0}
          unit="px"
          onChange={(overlay) => set({ corner: { ...p.corner, overlay } })}
        />
        <p className="pg-note">Cells are always square, whatever the corner language says.</p>
      </section>

      <section className="pg-group" aria-label="Density">
        <h3 className="pg-group__title">Density</h3>
        <ChoiceGroup
          label="Density mode"
          choices={DENSITY_MODES.map((id) => ({ id, label: id }))}
          value={p.density.mode}
          onChange={(mode: DensityMode) => set({ density: { mode, ...DENSITY_TABLE[mode] } })}
        />
        {isCustomDensity(p) && <StatusBadge tone="neutral">custom {p.density.mode}</StatusBadge>}
        <NumberSlider
          label="Row height"
          value={p.density.rowHeight}
          min={16}
          max={48}
          step={1}
          places={0}
          unit="px"
          onChange={(rowHeight) => set({ density: { ...p.density, rowHeight } })}
        />
        <NumberSlider
          label="Cell padding"
          value={p.density.cellPaddingX}
          min={0}
          max={24}
          step={1}
          places={0}
          unit="px"
          onChange={(cellPaddingX) => set({ density: { ...p.density, cellPaddingX } })}
        />
        <NumberSlider
          label="Font size"
          value={p.density.fontSize}
          min={8}
          max={20}
          step={1}
          places={0}
          unit="px"
          onChange={(fontSize) => set({ density: { ...p.density, fontSize } })}
        />
        <p className="pg-note">
          The two modes the parameters do not select keep Stoa's own table, so the density switch above the previews
          still has three modes to move between.
        </p>
      </section>

      <section className="pg-group" aria-label="Clamps">
        <h3 className="pg-group__title">Clamps</h3>
        {derived.clamps.length === 0 ? (
          <p className="pg-note">No hard rule had to move a value.</p>
        ) : (
          <ul className="pg-checks" data-testid="clamps">
            {derived.clamps.map((clamp) => (
              <li key={clamp.id}>
                <StatusBadge tone={clamp.reached ? "warning" : "negative"}>
                  {clamp.reached ? "clamped" : "out of reach"}
                </StatusBadge>{" "}
                {clamp.message}
              </li>
            ))}
          </ul>
        )}
        {derived.clipped.length > 0 && (
          <ul className="pg-checks" data-testid="clipped">
            {derived.clipped.map((entry) => (
              <li key={`${entry.theme}/${entry.role}`}>
                <StatusBadge tone="neutral">sRGB</StatusBadge> {entry.message}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="pg-row">
        <Button onPress={() => onPreset(STOA_TODAY)}>Turn the derived layer off</Button>
      </div>
    </div>
  );
}
