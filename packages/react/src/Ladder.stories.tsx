import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { Ladder, type LadderHandle } from "./Ladder";
import { sampleBook } from "./fixtures";
import { signalTokensChanged } from "./tokens";

const meta: Meta<typeof Ladder> = {
  title: "Data/Ladder",
  component: Ladder,
  args: { label: "Order book, 12 levels per side", depth: 12 },
  decorators: [(Story) => <div style={{ maxInlineSize: 360 }}><Story /></div>],
};
export default meta;

export const Static: StoryObj<typeof Ladder> = { args: { data: sampleBook() } };

/** Updated through the imperative handle at the display's frame rate,
 * without a React render per frame, as a replay does. */
export const Live: StoryObj<typeof Ladder> = {
  render: (args) => {
    const ref = useRef<LadderHandle>(null);
    useEffect(() => {
      let raf = 0;
      let seed = 1;
      let mid = 222.6;
      const tick = () => {
        mid = +(mid + (Math.random() - 0.5) * 0.02).toFixed(2);
        ref.current?.draw(sampleBook(mid, args.depth, seed++));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [args.depth]);
    return <Ladder {...args} ref={ref} />;
  },
};

export const Empty: StoryObj<typeof Ladder> = { args: { data: null } };

// Tokens ship one scoped override rule for `[data-theme="dark"]`, but none
// for `[data-theme="light"]`: light values live directly on `:root`. So
// the "light" wrapper's `data-theme="light"` attribute below is only
// correct while the surrounding root itself resolves to light (the
// Storybook toolbar's default, and no `prefers-color-scheme: dark`) - it
// carries no scoped override of its own, and would silently inherit dark
// values from an ancestor if the root theme were switched to dark.

const REDRAW_RUNS = 25;

function median(samples: number[]): number {
  const sorted = [...samples].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

/** Two previews on one page, each themed on its own wrapper rather than
 * on `<html>`: the mechanism the playground needs to show several themes
 * side by side. Each "Signal" button changes a token variable on that
 * preview's own wrapper, dispatches `stoa:tokens` on it, and repeats that
 * `REDRAW_RUNS` times, reporting the median redraw cost (a no-op signal,
 * with no variable changed, would measure event-dispatch overhead rather
 * than the real re-read-and-redraw cost). If every run lands on the same
 * duration, the browser's timer resolution is coarser than one redraw, so
 * the figure is reported as an upper bound rather than a real measurement. */
export const TwoThemes: StoryObj<typeof Ladder> = {
  render: (args) => {
    const light = useRef<HTMLDivElement>(null);
    const dark = useRef<HTMLDivElement>(null);
    const [lightCost, setLightCost] = useState<string | null>(null);
    const [darkCost, setDarkCost] = useState<string | null>(null);

    const signal = (root: HTMLDivElement | null, report: (ms: string) => void) => {
      if (!root) return;
      const samples: number[] = [];
      for (let i = 0; i < REDRAW_RUNS; i++) {
        // Alternate between two real tokens so the read after signalling
        // sees an actual change, not a same-value no-op.
        root.style.setProperty("--stoa-color-surface", i % 2 === 0 ? "var(--stoa-color-surface)" : "var(--stoa-color-border)");
        const t0 = performance.now();
        signalTokensChanged(root);
        samples.push(performance.now() - t0);
      }
      const m = median(samples);
      const atFloor = Math.max(...samples) === Math.min(...samples);
      report(atFloor ? `<= ${m.toFixed(2)} (timer resolution; upper bound)` : `${m.toFixed(2)} (median of ${REDRAW_RUNS})`);
    };

    return (
      <div style={{ display: "flex", gap: "var(--stoa-space-4)", flexWrap: "wrap" }}>
        <div ref={light} data-theme="light" style={{ maxInlineSize: 320 }}>
          <Ladder {...args} label="Light preview" data={sampleBook(222.6, args.depth, 7)} />
          <button onClick={() => signal(light.current, setLightCost)}>Signal</button>
          {lightCost && <p>Redraw took {lightCost} ms.</p>}
        </div>
        <div ref={dark} data-theme="dark" style={{ maxInlineSize: 320 }}>
          <Ladder {...args} label="Dark preview" data={sampleBook(222.6, args.depth, 11)} />
          <button onClick={() => signal(dark.current, setDarkCost)}>Signal</button>
          {darkCost && <p>Redraw took {darkCost} ms.</p>}
        </div>
      </div>
    );
  },
};
