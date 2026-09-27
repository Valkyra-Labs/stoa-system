// The playground: one control panel, four preview frames, one verification
// panel. The base is Stoa today, the built tokens of this working tree;
// every edit is an override against that base and is shown as one.
import { useEffect, useMemo, useState } from "react";
import { Button, ChoiceGroup, Panel, StatBar, StatusBadge, TextField } from "@valkyra-labs/stoa-react";
import { ControlPanel } from "./ControlPanel";
import { OverrideList } from "./OverrideList";
import { PreviewGrid } from "./PreviewGrid";
import { Verification } from "./Verification";
import { editableTabs } from "./editable";
import { canRedo, canUndo, clearAll, clearOverride, emptyHistory, redo, setOverride, undo } from "./history";
import { createStream } from "./stream";
import { saveSnapshot } from "./api";
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
  const [name, setName] = useState("stoa-today");
  const [saved, setSaved] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [renderMs, setRenderMs] = useState(0);

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
  const revision = useMemo(() => digest(JSON.stringify([tokens.light.variables, tokens.dark.variables])), [tokens]);

  const interval = SPEEDS.find((s) => s.id === speed)?.interval ?? 250;
  useEffect(() => {
    if (!running) {
      stream.stop();
      return;
    }
    stream.start(interval);
    return () => stream.stop();
  }, [stream, running, interval]);

  const save = async () => {
    setSaveError(null);
    try {
      const result = await saveSnapshot({ name, files, overrides });
      setSaved(`${result.path} on ${result.commit.slice(0, 7)}${result.dirty ? " (working tree dirty)" : ""}`);
    } catch (cause) {
      setSaved(null);
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
            onEdit={(id, value) => setHistory((h) => setOverride(h, id, value))}
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

        <Panel title="Snapshot">
          <div className="pg-stack">
            <TextField
              label="Snapshot name"
              value={name}
              onChange={setName}
              dir="ltr"
              description="Written to apps/playground/snapshots, with the commit it was based on."
            />
            <div className="pg-row">
              <Button variant="primary" onPress={save}>
                Save snapshot
              </Button>
              {saved && <StatusBadge tone="positive">{saved}</StatusBadge>}
              {saveError && <StatusBadge tone="negative">{saveError}</StatusBadge>}
            </div>
          </div>
        </Panel>
      </aside>

      <main className="pg-main">
        <PreviewGrid stream={stream} tokens={tokens} revision={revision} onRenderTime={setRenderMs} />
      </main>
    </div>
  );
}
