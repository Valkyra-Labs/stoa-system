// Reading a snapshot back into the two layers the app draws with: the
// parameters underneath and the overrides on top.
//
// A snapshot on disk was written by an older version of this app as often
// as by the current one, so nothing here trusts its shape: a field that is
// missing or the wrong type falls back rather than reaching the model. A
// snapshot with no parameters at all is Stoa today, which is what every
// snapshot written before this brief is.
import { normalizeParameters, type PartialParameters } from "@valkyra-labs/stoa-tokens/model";
import type { Overrides } from "../tokenModel";

export type SnapshotState = {
  /** The parameter set to derive from, or null for Stoa today. */
  parameters: PartialParameters | null;
  overrides: Overrides;
};

function overridesFrom(value: unknown): Overrides {
  if (typeof value !== "object" || value === null) return {};
  const out: Overrides = {};
  for (const [id, text] of Object.entries(value as Record<string, unknown>)) {
    if (typeof text === "string") out[id] = text;
  }
  return out;
}

/** The parameters and overrides a snapshot restores. */
export function readSnapshot(snapshot: unknown): SnapshotState {
  const body = (typeof snapshot === "object" && snapshot !== null ? snapshot : {}) as Record<string, unknown>;
  const parameters = body.parameters;
  return {
    parameters:
      typeof parameters === "object" && parameters !== null && !Array.isArray(parameters)
        ? normalizeParameters(parameters as PartialParameters)
        : null,
    overrides: overridesFrom(body.overrides),
  };
}
