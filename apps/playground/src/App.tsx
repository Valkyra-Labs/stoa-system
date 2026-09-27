// The playground: one control panel, four preview frames, one verification
// panel. The base is Stoa today, the built tokens of this working tree;
// every edit is an override against that base and is shown as one.
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Button, ChoiceGroup, Panel, StatBar, StatusBadge, TextField } from "@valkyra-labs/stoa-react";
import { ControlPanel } from "./ControlPanel";
import { OverrideList } from "./OverrideList";
import { PreviewGrid } from "./PreviewGrid";
import { Verification } from "./Verification";
import { AREA_PANELS, mergedVariables, panelSnapshots, type Contribution } from "./panels";
import { editableTabs } from "./editable";
import { canRedo, canUndo, clearAll, clearOverride, emptyHistory, endEdit, redo, setOverride, undo } from "./history";
import { createStream } from "./stream";
import { ApiError, saveSnapshot } from "./api";
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
  // Empty: the server stamps an unnamed save with the time it was written,
  // so a save never lands on an earlier snapshot by default.
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  /** The server refused this name because it is taken; only then may the
   * user ask for it to be written over. */
  const [taken, setTaken] = useState(false);
  const [renderMs, setRenderMs] = useState(0);
  /** What each area panel contributes, by panel id. */
  const [contributions, setContributions] = useState<Record<string, Contribution>>({});

  const overrides = history.present;
  const stream = useMemo(() => createStream(7), []);
  const tabs = useMemo(() => editableTabs(baseTokens), []);

  const tokens = useMemo<Record<Theme, ResolvedTokens>>(
    () => ({
      light: resolveTokens(baseTokens, overrides, "light", density),
      dark: resolveTokens(baseTokens, overrides, "dark", density),
    }),
    [overrides, density],
  );
  const values = useMemo(() => resolveAllValues(baseTokens, overrides), [overrides]);
  const files = useMemo(() => serializeFiles(filesWithOverrides(baseTokens, overrides)), [overrides]);
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

  const save = async (overwrite = false) => {
    setSaveError(null);
    try {
      const result = await saveSnapshot({ name, files, overrides, panels: panelSnapshots(contributions), overwrite });
      setTaken(false);
      setSaved(`${result.path} on ${result.commit.slice(0, 7)}${result.dirty ? " (working tree dirty)" : ""}`);
    } catch (cause) {
      setSaved(null);
      // 409 is the one refusal the user can answer: the name is taken.
      setTaken(cause instanceof ApiError && cause.status === 409);
      setSaveError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  return (
    <div className="pg-app">
      <aside className="pg-side">
        <header className="pg-side__header">
          <h1>Stoa playground</h1>
          <p className="pg-note">
            Base: Stoa today, the token files of this working tree. Every edit below is an override against it.
          </p>
        </header>

        <Panel title="Session">
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
                { label: "revision", value: revision },
              ]}
            />
          </div>
        </Panel>

        <Panel title="Tokens">
          <ControlPanel
            tabs={tabs}
            overrides={overrides}
            values={values}
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
        </Panel>

        <Panel title="Overrides">
          <OverrideList
            overrides={overrides}
            values={values}
            onReset={(id) => setHistory((h) => clearOverride(h, id))}
            onResetAll={() => setHistory(clearAll)}
          />
        </Panel>

        <Panel title="Verification">
          <Verification tokens={tokens} density={density} files={files} />
        </Panel>

        {AREA_PANELS.map(({ id, title, Component }) => (
          <Panel key={id} title={title}>
            <Component density={density} tokens={tokens} onContribute={handlers[id]!} />
          </Panel>
        ))}

        <Panel title="Snapshot">
          <div className="pg-stack">
            <TextField
              label="Snapshot name"
              value={name}
              onChange={(value) => {
                setName(value);
                setTaken(false);
              }}
              dir="ltr"
              description="Written to apps/playground/snapshots, with the commit it was based on. Empty: named after the time it was saved."
            />
            <div className="pg-row">
              <Button variant="primary" onPress={() => void save()}>
                Save snapshot
              </Button>
              {taken && <Button onPress={() => void save(true)}>Replace {name.trim()}</Button>}
              {saved && <StatusBadge tone="positive">{saved}</StatusBadge>}
              {saveError && <StatusBadge tone="negative">{saveError}</StatusBadge>}
            </div>
          </div>
        </Panel>
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
