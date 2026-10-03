// The playground: a list of side panels, two preview frames, one
// verification panel. Under everything sits either the parameter model
// (parameters -> derived tokens) or Stoa today, the built tokens of this
// working tree; on top of either sits the override layer, and every
// override is shown as one. The area panels (src/panels.tsx) sit in the
// same list and contribute variables and content to every preview frame.
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Button, ChoiceGroup, Panel, StatBar, StatusBadge, Tabs, TextField } from "@valkyra-labs/stoa-react";
import type { PartialParameters } from "@valkyra-labs/stoa-tokens/model";
import { ControlPanel } from "./ControlPanel";
import { OverrideList } from "./OverrideList";
import { PreviewGrid } from "./PreviewGrid";
import { Verification } from "./Verification";
import { AREA_PANELS, mergedVariables, panelSnapshots, type Contribution } from "./panels";
import { editableTabs } from "./editable";
import {
  canRedo,
  canUndo,
  clearAll,
  clearOverride,
  commit,
  emptyHistory,
  endEdit,
  redo,
  setOverride,
  undo,
} from "./history";
import { createStream } from "./stream";
import { ApiError, listSnapshots, readSnapshotFile, saveSnapshot } from "./api";
import { derive, derivedTokens, derivedValues } from "./parameters/derived";
import { CUSTOM, STOA_TODAY, ParametersPanel, parametersForPreset } from "./parameters/ParametersPanel";
import { readSnapshot } from "./parameters/snapshot";
import {
  DENSITY_MODES,
  baseTokens,
  digest,
  filesWithOverrides,
  resolveAllValues,
  resolveTokens,
  serializeFiles,
  type DensityMode,
  type ResolvedTokens,
  type Theme,
} from "./tokenModel";

/** Milliseconds between stream frames, per speed. */
const SPEEDS = [
  { id: "1", label: "1x", interval: 250 },
  { id: "2", label: "2x", interval: 125 },
  { id: "4", label: "4x", interval: 60 },
];

export function App() {
  const [history, setHistory] = useState(emptyHistory);
  const [density, setDensity] = useState<DensityMode>("regular");
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState("1");
  /** The parameter set under the override layer, or null for Stoa today. */
  const [parameters, setParameters] = useState<PartialParameters | null>(null);
  const [preset, setPreset] = useState(STOA_TODAY);
  // Empty: the server stamps an unnamed save with the time it was written,
  // so a save never lands on an earlier snapshot by default.
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  /** The server refused this name because it is taken; only then may the
   * user ask for it to be written over. */
  const [taken, setTaken] = useState(false);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [renderMs, setRenderMs] = useState(0);
  const [controlTab, setControlTab] = useState<string>();
  /** The side panel tab on show; every tab stays mounted. */
  const [sideTab, setSideTab] = useState("parameters");
  /** The tokens a selected verification failure reads, so the control panel
   * and the override list can mark and scroll to them. */
  const [highlighted, setHighlighted] = useState<string[]>([]);
  /** What each area panel contributes, by panel id. */
  const [contributions, setContributions] = useState<Record<string, Contribution>>({});

  const overrides = history.present;
  const stream = useMemo(() => createStream(7), []);
  const tabs = useMemo(() => editableTabs(baseTokens), []);

  const tree = useMemo(() => derive(parameters), [parameters]);

  const tokens = useMemo<Record<Theme, ResolvedTokens>>(
    () =>
      tree
        ? {
            light: derivedTokens(tree, overrides, "light", density),
            dark: derivedTokens(tree, overrides, "dark", density),
          }
        : {
            light: resolveTokens(baseTokens, overrides, "light", density),
            dark: resolveTokens(baseTokens, overrides, "dark", density),
          },
    [tree, overrides, density],
  );
  const values = useMemo(
    () => (tree ? derivedValues(tree, overrides) : resolveAllValues(baseTokens, overrides)),
    [tree, overrides],
  );
  // The build endpoint reads token files, so it is always sent the sources
  // with the override layer written in. A derived tree is not a token file
  // set: exporting one is out of scope for this brief, and the verification
  // panel says as much rather than comparing the two.
  const files = useMemo(() => serializeFiles(filesWithOverrides(baseTokens, overrides)), [overrides]);
  // Target size is measured in every density mode, not only the one the
  // previews show, the same way scripts/checks.test.mjs measures it; theme
  // does not change a density token, so "light" is picked arbitrarily.
  const densityTokens = useMemo<Record<DensityMode, ResolvedTokens>>(
    () =>
      Object.fromEntries(
        DENSITY_MODES.map((mode) => [
          mode,
          tree ? derivedTokens(tree, overrides, "light", mode) : resolveTokens(baseTokens, overrides, "light", mode),
        ]),
      ) as Record<DensityMode, ResolvedTokens>,
    [tree, overrides],
  );
  const panelVariables = useMemo(() => mergedVariables(contributions), [contributions]);
  const panelContent = useMemo(
    () =>
      AREA_PANELS.map((panel) => (
        <Fragment key={panel.id}>{contributions[panel.id]?.frameContent ?? null}</Fragment>
      )),
    [contributions],
  );
  // The canvas views read their variables once, so the revision they are
  // keyed on has to move when a panel changes one of them too.
  const revision = useMemo(
    () => digest(JSON.stringify([tokens.light.variables, tokens.dark.variables, panelVariables])),
    [tokens, panelVariables],
  );

  // One stable handler per panel: a panel reports its contribution from an
  // effect, so a handler that changed identity on every render would keep
  // the two of them going round.
  const contribute = useCallback((id: string, contribution: Contribution) => {
    setContributions((previous) => ({ ...previous, [id]: contribution }));
  }, []);
  const handlers = useMemo(
    () =>
      Object.fromEntries(
        AREA_PANELS.map((panel) => [panel.id, (contribution: Contribution) => contribute(panel.id, contribution)]),
      ),
    [contribute],
  );

  const interval = SPEEDS.find((s) => s.id === speed)?.interval ?? 250;
  useEffect(() => {
    if (!running) {
      stream.stop();
      return;
    }
    stream.start(interval);
    return () => stream.stop();
  }, [stream, running, interval]);

  const refreshSnapshots = () => {
    void listSnapshots().then(setSnapshots, () => setSnapshots([]));
  };
  useEffect(refreshSnapshots, []);

  const save = async (overwrite = false) => {
    setSaveError(null);
    try {
      const result = await saveSnapshot({
        name,
        files,
        overrides,
        parameters,
        panels: panelSnapshots(contributions),
        overwrite,
      });
      setTaken(false);
      setSaved(`${result.path} on ${result.commit.slice(0, 7)}${result.dirty ? " (working tree dirty)" : ""}`);
      refreshSnapshots();
    } catch (cause) {
      setSaved(null);
      // 409 is the one refusal the user can answer: the name is taken.
      setTaken(cause instanceof ApiError && cause.status === 409);
      setSaveError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  const load = async (slug: string) => {
    setSaveError(null);
    try {
      const state = readSnapshot(await readSnapshotFile(slug));
      setParameters(state.parameters);
      setPreset(state.parameters === null ? STOA_TODAY : CUSTOM);
      setHistory((h) => commit(h, state.overrides));
      const layer = state.parameters === null ? "Stoa today" : "parameters";
      setSaved(`${slug}: ${layer} and ${Object.keys(state.overrides).length} override(s) restored`);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  /** The side panels, in the order they are shown. Each brief of this wave
   * adds one entry here and keeps its own module under src/. */
  const panels = [
    {
      id: "session",
      title: "Session",
      content: (
        <div className="pg-stack">
          <div className="pg-row">
            <Button onPress={() => setHistory(undo)} isDisabled={!canUndo(history)}>
              Undo
            </Button>
            <Button onPress={() => setHistory(redo)} isDisabled={!canRedo(history)}>
              Redo
            </Button>
            <Button onPress={() => setRunning((was) => !was)}>{running ? "Pause" : "Resume"}</Button>
          </div>
          <ChoiceGroup
            label="Stream speed"
            choices={SPEEDS.map(({ id, label }) => ({ id, label }))}
            value={speed}
            onChange={setSpeed}
          />
          <ChoiceGroup
            label="Density"
            choices={DENSITY_MODES.map((mode) => ({ id: mode, label: mode }))}
            value={density}
            onChange={setDensity}
          />
          <StatBar
            label="Playground counters"
            items={[
              { label: "state to effect", value: `${renderMs.toFixed(1)} ms` },
              { label: "interval", value: `${interval} ms` },
              { label: "tokens", value: String(Object.keys(tokens.light.variables).length) },
              { label: "clamps", value: String(tree?.clamps.length ?? 0) },
              { label: "revision", value: revision },
            ]}
          />
        </div>
      ),
    },
    {
      id: "parameters",
      title: "Parameters",
      content: (
        <ParametersPanel
          preset={preset}
          parameters={parameters}
          derived={tree}
          onPreset={(id) => {
            setPreset(id);
            setParameters(parametersForPreset(id, parameters));
          }}
          onChange={(next) => {
            setParameters(next);
            setPreset(CUSTOM);
          }}
        />
      ),
    },
    {
      id: "tokens",
      title: "Tokens",
      content: (
        <ControlPanel
          tabs={tabs}
          overrides={overrides}
          values={values}
          selected={controlTab}
          onSelectTab={setControlTab}
          highlighted={highlighted}
          onEdit={(id, value, held) => {
            // The moment is read here, not in the updater, which has to
            // stay pure: React may run it more than once.
            const at = Date.now();
            setHistory((h) => setOverride(h, id, value, { at, held }));
          }}
          onEditEnd={() => {
            const at = Date.now();
            setHistory((h) => endEdit(h, at));
          }}
          onReset={(id) => setHistory((h) => clearOverride(h, id))}
        />
      ),
    },
    {
      id: "overrides",
      title: "Overrides",
      tab: `Overrides (${Object.keys(overrides).length})`,
      content: (
        <OverrideList
          overrides={overrides}
          values={values}
          highlighted={highlighted}
          onReset={(id) => setHistory((h) => clearOverride(h, id))}
          onResetAll={() => setHistory(clearAll)}
        />
      ),
    },
    {
      id: "verification",
      title: "Verification",
      tab: "Checks",
      content: (
        <Verification
          tokens={tokens}
          densityTokens={densityTokens}
          density={density}
          files={files}
          derived={tree !== null}
          onSelectCheck={(tab, checkTokens) => {
            setControlTab(tab);
            setHighlighted(checkTokens);
            setSideTab("tokens");
          }}
        />
      ),
    },
    ...AREA_PANELS.map(({ id, title, Component }) => ({
      id,
      title,
      content: <Component density={density} tokens={tokens} onContribute={handlers[id]!} />,
    })),
    {
      id: "snapshot",
      title: "Snapshot",
      content: (
        <div className="pg-stack">
          <TextField
            label="Snapshot name"
            value={name}
            onChange={(value) => {
              setName(value);
              setTaken(false);
            }}
            dir="ltr"
            description="Written to apps/playground/snapshots, with the parameters, the overrides, what each area panel records and the commit it was based on. Empty: named after the time it was saved."
          />
          <div className="pg-row">
            <Button variant="primary" onPress={() => void save()}>
              Save snapshot
            </Button>
            {taken && <Button onPress={() => void save(true)}>Replace {name.trim()}</Button>}
            {saved && <StatusBadge tone="positive">{saved}</StatusBadge>}
            {saveError && <StatusBadge tone="negative">{saveError}</StatusBadge>}
          </div>
          <div className="pg-row" data-testid="snapshot-load">
            <span className="pg-token__label">Load</span>
            {snapshots.length === 0 ? (
              <span className="pg-note">No snapshots on disk yet.</span>
            ) : (
              snapshots.map((slug) => (
                <Button key={slug} onPress={() => void load(slug)}>
                  {slug}
                </Button>
              ))
            )}
          </div>
          <p className="pg-note">Loading a snapshot restores its parameters and its overrides, as one step back.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="pg-app">
      <aside className="pg-side">
        <header className="pg-side__header">
          <h1>Stoa playground</h1>
        </header>

        {panels
          .filter((panel) => panel.id === "session")
          .map((panel) => (
            <Panel key={panel.id} title={panel.title}>
              {panel.content}
            </Panel>
          ))}

        <Tabs
          label="Playground panels"
          keepMounted
          selected={sideTab}
          onChange={setSideTab}
          items={panels
            .filter((panel) => panel.id !== "session")
            .map((panel) => ({
              id: panel.id,
              label: "tab" in panel && typeof panel.tab === "string" ? panel.tab : panel.title,
              content: <Panel title={panel.title}>{panel.content}</Panel>,
            }))}
        />
      </aside>

      <main className="pg-main">
        <PreviewGrid
          stream={stream}
          tokens={tokens}
          revision={revision}
          onRenderTime={setRenderMs}
          panelVariables={panelVariables}
          panelContent={panelContent}
        />
      </main>
    </div>
  );
}
