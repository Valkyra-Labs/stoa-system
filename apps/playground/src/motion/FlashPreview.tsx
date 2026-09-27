// Price flash on the shared synthetic stream (`stream.ts`, the same
// fixtures the four preview frames use), at a chosen message rate: wash of
// up/down, peak alpha, decay easing, and area (cell, changed digits, row),
// via `element.animate()`. WCAG 2.3.1 caps three flashes per second in any
// one area; the counter here tracks the worst single cell (not the sum
// across cells, which is not what the rule limits) and turns red past
// that. WCAG 2.2.2 requires a pause control for auto-updating content, so
// there is one.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button, ChoiceGroup, StatusBadge, TimeSlider, parseBook } from "@valkyra-labs/stoa-react";
import type { ResolvedTokens, TokenEntry } from "../tokenModel";
import { createStream } from "../stream";
import { lastSegment } from "./motionTokens";

export type FlashPreviewProps = {
  values: ResolvedTokens["values"];
  easings: TokenEntry[];
};

type Area = "cell" | "changed-digits" | "row";
const AREAS: { id: Area; label: string }[] = [
  { id: "cell", label: "Cell" },
  { id: "changed-digits", label: "Changed digits" },
  { id: "row", label: "Row" },
];

const ms = (text: string | undefined) => Number.parseFloat(text ?? "") || 0;

/** The `<span>`s among `el`'s value characters whose text differs from
 * `previous` at that index, or `[el]` when there is no previous text to
 * diff against or the lengths differ (a whole new value, not a tick). */
function changedDigitTargets(el: HTMLElement, previous: string, next: string): HTMLElement[] {
  if (previous.length !== next.length) return [el];
  const spans = [...el.querySelectorAll<HTMLElement>("[data-char]")];
  const changed = spans.filter((span, i) => previous[i] !== next[i]);
  return changed.length > 0 ? changed : [el];
}

function Digits({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} data-char={String(i)}>
          {ch}
        </span>
      ))}
    </>
  );
}

function FlashCell({
  id,
  label,
  value,
  format,
  area,
  peakAlpha,
  durationMs,
  easing,
  reduced,
  onFlash,
}: {
  label: string;
  value: number;
  format: (n: number) => string;
  area: Area;
  peakAlpha: number;
  durationMs: number;
  easing: string;
  reduced: boolean;
  onFlash: (id: string) => void;
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef<{ value: number; text: string } | null>(null);
  const text = format(value);

  useEffect(() => {
    const el = ref.current;
    const last = previous.current;
    if (el && last !== null && value !== last.value) {
      onFlash(id);
      const wash = value > last.value ? "var(--stoa-color-up-wash)" : "var(--stoa-color-down-wash)";
      if (!reduced && durationMs > 0 && typeof el.animate === "function") {
        const targets =
          area === "cell" ? [el] : area === "row" ? [(el.closest("[data-flash-row]") as HTMLElement) ?? el] : changedDigitTargets(el, last.text, text);
        for (const target of targets) {
          target.animate(
            [
              { backgroundColor: wash, opacity: peakAlpha, offset: 0 },
              { backgroundColor: wash, opacity: peakAlpha, offset: 0.15 },
              { backgroundColor: wash, opacity: 0, offset: 1 },
            ],
            { duration: durationMs, easing },
          );
        }
      }
    }
    previous.current = { value, text };
  }, [value, text, area, peakAlpha, durationMs, easing, reduced, onFlash, id]);

  return (
    <div ref={ref} className="pg-flash-cell">
      <span className="pg-flash-cell__label">{label}</span>
      <span className="pg-flash-cell__value">
        <Digits text={text} />
      </span>
    </div>
  );
}

/** Groups cells so "row" area has something wider than "cell" to flash: two
 * cells sharing a `data-flash-row` ancestor, which is what a cell's own
 * `.closest("[data-flash-row]")` finds. */
function FlashRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="pg-flash-row" data-flash-row="" aria-label={label}>
      {children}
    </div>
  );
}

export function FlashPreview({ values, easings }: FlashPreviewProps) {
  const stream = useMemo(() => createStream(11), []);
  const [frame, setFrame] = useState(() => stream.current());
  const [running, setRunning] = useState(true);
  const [rate, setRate] = useState(4);
  const [area, setArea] = useState<Area>("cell");
  const [peakAlpha, setPeakAlpha] = useState(0.35);
  const [easingId, setEasingId] = useState(easings.find((e) => lastSegment(e) === "standard")?.id ?? easings[0]?.id ?? "");
  const [reduced, setReduced] = useState(false);
  const [flashCount, setFlashCount] = useState(0);
  // WCAG 2.3.1 is a per-area limit: four cells each flashing twice a second
  // is not the same hazard as one cell flashing eight times, so the rate
  // that matters is the worst single cell's, not the sum across all of
  // them.
  const flashTimes = useRef<Map<string, number[]>>(new Map());

  useEffect(() => {
    if (!running) {
      stream.stop();
      return;
    }
    stream.start(1000 / rate);
    return () => stream.stop();
  }, [stream, running, rate]);

  useEffect(() => stream.subscribe(setFrame), [stream]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      let max = 0;
      for (const [cellId, times] of flashTimes.current) {
        const recent = times.filter((t) => now - t < 1000);
        flashTimes.current.set(cellId, recent);
        max = Math.max(max, recent.length);
      }
      setFlashCount(max);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const onFlash = (id: string) => {
    const times = flashTimes.current.get(id) ?? [];
    times.push(Date.now());
    flashTimes.current.set(id, times);
  };

  const durationMs = ms(values["primitive:motion.duration.flash"]?.effective);
  const easing = values[easingId]?.effective ?? "ease";
  const book = parseBook(frame.book);
  const trade = frame.trades[0];

  return (
    <div className="pg-motion-flash">
      <div className="pg-row pg-row--between">
        <div className="pg-row">
          <Button onPress={() => setRunning((was) => !was)}>{running ? "Pause" : "Resume"}</Button>
          <Button onPress={() => setReduced((was) => !was)} variant={reduced ? "primary" : "default"}>
            Reduced motion
          </Button>
        </div>
        <StatusBadge tone={flashCount > 3 ? "negative" : "positive"}>{flashCount} flashes/s (worst cell)</StatusBadge>
      </div>

      <div className="pg-token__slider">
        <span className="pg-token__label">Message rate</span>
        <TimeSlider label="Message rate" min={1} max={20} step={1} value={rate} onChange={setRate} format={(v) => `${v}/s`} />
      </div>
      <div className="pg-token__slider">
        <span className="pg-token__label">Peak alpha</span>
        <TimeSlider
          label="Peak alpha"
          min={0.05}
          max={1}
          step={0.05}
          value={peakAlpha}
          onChange={setPeakAlpha}
          format={(v) => v.toFixed(2)}
        />
      </div>
      <ChoiceGroup label="Flash area" choices={AREAS} value={area} onChange={setArea} />
      <ChoiceGroup
        label="Decay easing"
        choices={easings.map((e) => ({ id: e.id, label: lastSegment(e) }))}
        value={easingId}
        onChange={setEasingId}
      />

      <div className="pg-motion-flash__rows">
        <FlashRow label="Top of book">
          <FlashCell
            id="bid"
            label="Best bid"
            value={book.bids[0]?.price ?? 0}
            format={(v) => v.toFixed(2)}
            area={area}
            peakAlpha={peakAlpha}
            durationMs={durationMs}
            easing={easing}
            reduced={reduced}
            onFlash={onFlash}
          />
          <FlashCell
            id="ask"
            label="Best ask"
            value={book.asks[0]?.price ?? 0}
            format={(v) => v.toFixed(2)}
            area={area}
            peakAlpha={peakAlpha}
            durationMs={durationMs}
            easing={easing}
            reduced={reduced}
            onFlash={onFlash}
          />
        </FlashRow>
        <FlashRow label="Trade">
          <FlashCell
            id="mid"
            label="Mid"
            value={frame.mid}
            format={(v) => v.toFixed(2)}
            area={area}
            peakAlpha={peakAlpha}
            durationMs={durationMs}
            easing={easing}
            reduced={reduced}
            onFlash={onFlash}
          />
          <FlashCell
            id="last"
            label="Last trade"
            value={trade ? trade.price : frame.mid}
            format={(v) => v.toFixed(2)}
            area={area}
            peakAlpha={peakAlpha}
            durationMs={durationMs}
            easing={easing}
            reduced={reduced}
            onFlash={onFlash}
          />
        </FlashRow>
      </div>
    </div>
  );
}
