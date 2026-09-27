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

/** Two previews on one page, each themed on its own wrapper rather than
 * on `<html>`: the mechanism the playground needs to show several themes
 * side by side. Each "Signal" button dispatches `stoa:tokens` on that
 * preview's own wrapper only and times the resulting redraw. */
export const TwoThemes: StoryObj<typeof Ladder> = {
  render: (args) => {
    const light = useRef<HTMLDivElement>(null);
    const dark = useRef<HTMLDivElement>(null);
    const [lightCost, setLightCost] = useState<string | null>(null);
    const [darkCost, setDarkCost] = useState<string | null>(null);

    const signal = (root: HTMLDivElement | null, report: (ms: string) => void) => {
      if (!root) return;
      const t0 = performance.now();
      signalTokensChanged(root);
      report((performance.now() - t0).toFixed(2));
    };

    return (
      <div style={{ display: "flex", gap: "var(--stoa-space-5)", flexWrap: "wrap" }}>
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
