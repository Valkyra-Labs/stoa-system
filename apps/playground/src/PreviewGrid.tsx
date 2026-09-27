// Four frames of the same dense screen: light and dark, left to right and
// right to left. Token values are written as CSS variables on each frame's
// container, never on the document, so one edit re-themes four screens
// without a page-wide restyle.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Button,
  ChoiceGroup,
  Heatmap,
  Ladder,
  Panel,
  StatusBadge,
  Tabs,
  TextField,
  TimeSlider,
  TradeTable,
} from "@valkyra-labs/stoa-react";
import { CVD_CHOICES, CvdFilterDefs, cvdFilterStyle, type CvdMode } from "./cvdPreview";
import type { ResolvedTokens, Theme } from "./tokenModel";
import type { Stream, StreamFrame } from "./stream";

export type FrameSpec = { id: string; label: string; theme: Theme; dir: "ltr" | "rtl" };

export const FRAMES: FrameSpec[] = [
  { id: "light-ltr", label: "Light, left to right", theme: "light", dir: "ltr" },
  { id: "light-rtl", label: "Light, right to left", theme: "light", dir: "rtl" },
  { id: "dark-ltr", label: "Dark, left to right", theme: "dark", dir: "ltr" },
  { id: "dark-rtl", label: "Dark, right to left", theme: "dark", dir: "rtl" },
];

export type PreviewGridProps = {
  stream: Stream;
  tokens: Record<Theme, ResolvedTokens>;
  /** Digest of the current token values; canvases are keyed on it. */
  revision: string;
  onRenderTime: (ms: number) => void;
};

export function PreviewGrid({ stream, tokens, revision, onRenderTime }: PreviewGridProps) {
  const [frame, setFrame] = useState(() => stream.current());
  const published = useRef(0);

  useEffect(
    () =>
      stream.subscribe((next) => {
        published.current = performance.now();
        setFrame(next);
      }),
    [stream],
  );
  useEffect(() => {
    if (published.current > 0) onRenderTime(performance.now() - published.current);
  }, [frame, onRenderTime]);

  return (
    <div className="pg-frames">
      <CvdFilterDefs />
      {FRAMES.map((spec) => (
        <PreviewFrame key={spec.id} spec={spec} tokens={tokens[spec.theme]} revision={revision} frame={frame} />
      ))}
    </div>
  );
}

function PreviewFrame({
  spec,
  tokens,
  revision,
  frame,
}: {
  spec: FrameSpec;
  tokens: ResolvedTokens;
  revision: string;
  frame: StreamFrame;
}) {
  // Local, visual-only, and irrelevant to what the checks measure: a
  // preview is one person looking at one frame, not a value that follows
  // the tokens into history or a snapshot.
  const [cvd, setCvd] = useState<CvdMode>("none");
  return (
    <section className="pg-frame" aria-label={spec.label}>
      <header className="pg-frame__header">
        <h2>{spec.label}</h2>
        <div className="pg-row">
          <ChoiceGroup label={`${spec.label}: colour-vision preview`} choices={CVD_CHOICES} value={cvd} onChange={setCvd} />
          <code>{spec.theme}</code>
        </div>
      </header>
      <div
        className="pg-frame__body"
        data-frame={spec.id}
        data-theme={spec.theme}
        data-cvd={cvd}
        dir={spec.dir}
        style={{ ...(tokens.variables as CSSProperties), ...cvdFilterStyle(cvd) }}
      >
        <Screen frame={frame} revision={revision} />
      </div>
    </section>
  );
}

const SIDES = [
  { id: "buy", label: "Buy" },
  { id: "sell", label: "Sell" },
];

const clock = (seconds: number) =>
  `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

/** The dense screen under test: the two canvas views, the trades tape, and
 * the controls and form fields, at sizes a real screen would use. */
function Screen({ frame, revision }: { frame: StreamFrame; revision: string }) {
  const [side, setSide] = useState("buy");
  const [limit, setLimit] = useState("222.60");
  const [quantity, setQuantity] = useState("500");
  const [replay, setReplay] = useState(52_200);

  return (
    <div className="pg-screen">
      <div className="pg-screen__column">
        {/* TODO(brief 02): the canvas components read their colours once and
            do not notice a variable change on a wrapper, so a token edit
            re-mounts them through `revision`. When the token-change signal
            of docs/stage-1/02-token-signal.md merges, drop the key and let
            them re-read instead: a re-mount also resets the live region. */}
        <Panel title="Order book">
          <Ladder key={revision} depth={12} data={frame.book} label="Order book, 12 levels per side" />
        </Panel>
        <Panel title="Order">
          <div className="pg-form">
            <ChoiceGroup label="Side" choices={SIDES} value={side} onChange={setSide} />
            <TextField label="Limit price" value={limit} onChange={setLimit} dir="ltr" description="Tick 0.01" />
            <TextField label="Quantity" value={quantity} onChange={setQuantity} dir="ltr" />
            <div className="pg-row">
              <Button variant="primary">Send</Button>
              <Button>Clear</Button>
              <StatusBadge tone="warning">Marketable</StatusBadge>
            </div>
          </div>
        </Panel>
      </div>
      <div className="pg-screen__column">
        <Panel title="Displayed liquidity">
          <Heatmap
            key={revision}
            height={180}
            data={frame.heatmap}
            label="Displayed liquidity over the last three minutes"
            description="Bids below the midpoint, asks above; darker cells hold more shares."
          />
          <TimeSlider
            label="Replay time"
            min={50_400}
            max={57_600}
            step={60}
            value={replay}
            onChange={setReplay}
            format={clock}
          />
        </Panel>
        <Panel title="Trades">
          <Tabs
            label="Trades view"
            items={[
              { id: "tape", label: "Tape", content: <TradeTable trades={frame.trades} caption="Recent trades, newest first" /> },
              {
                id: "summary",
                label: "Summary",
                content: (
                  <dl className="pg-summary">
                    <dt>Mid</dt>
                    <dd>{frame.mid.toFixed(2)}</dd>
                    <dt>Trades</dt>
                    <dd>{frame.trades.length}</dd>
                    <dt>Frame</dt>
                    <dd>{frame.tick}</dd>
                  </dl>
                ),
              },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
