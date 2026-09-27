import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { cellAlpha, maxAbs } from "./heatmapScale";
import { fitCanvas, readCanvasTokens, useTokenSignal, type CanvasTokens } from "./tokens";

export type HeatmapData = {
  /** Column-major cells: `columns` slices of `rows` prices, top row first;
   * bids positive, asks negative. */
  cells: ArrayLike<number>;
  columns: number;
  rows: number;
  /** Price of the top row and the step between rows. */
  top: number;
  tick: number;
};

export type HeatmapHandle = { draw(d: HeatmapData | null): void };

export type HeatmapProps = {
  height?: number;
  label: string;
  /** Plain-language description of what the chart shows now. */
  description?: string;
  data?: HeatmapData | null;
  /** Bumped to force a token re-read and redraw, as an alternative to
   * dispatching `stoa:tokens` on an ancestor (see `useTokenSignal`). */
  tokensVersion?: number;
  ref?: Ref<HeatmapHandle>;
};

function draw(canvas: HTMLCanvasElement, t: CanvasTokens, d: HeatmapData | null, height: number) {
  const width = canvas.clientWidth;
  const ctx = fitCanvas(canvas, height);
  ctx.fillStyle = t.surface;
  ctx.fillRect(0, 0, width, height);
  if (!d || d.columns === 0 || d.rows === 0) return;
  const cw = width / d.columns;
  const rh = height / d.rows;
  const max = maxAbs(d.cells);
  for (let c = 0; c < d.columns; c++) {
    for (let r = 0; r < d.rows; r++) {
      const v = d.cells[c * d.rows + r]!;
      if (v === 0) continue;
      ctx.globalAlpha = 0.15 + 0.85 * cellAlpha(Math.abs(v), max);
      ctx.fillStyle = v > 0 ? t.bid : t.ask;
      ctx.fillRect(c * cw, r * rh, Math.ceil(cw), Math.ceil(rh));
    }
  }
  ctx.globalAlpha = 1;
  ctx.font = t.font;
  ctx.fillStyle = t.muted;
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(d.top.toFixed(2), width - 4, 2);
  ctx.textBaseline = "bottom";
  ctx.fillText((d.top - d.tick * (d.rows - 1)).toFixed(2), width - 4, height - 2);
}

/** Displayed liquidity over time on a canvas: time left to right, price
 * top to bottom, bids in the bid colour and asks in the ask colour,
 * opacity by size on a log scale. */
export function Heatmap({ height = 240, label, description, data, tokensVersion, ref }: HeatmapProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tokens = useRef<CanvasTokens | null>(null);
  const lastData = useRef<HeatmapData | null>(null);
  const render = (d: HeatmapData | null) => {
    const c = canvas.current;
    if (!c) return;
    lastData.current = d;
    tokens.current ??= readCanvasTokens(c);
    draw(c, tokens.current, d, height);
  };
  useImperativeHandle(ref, () => ({ draw: render }));
  useEffect(() => {
    if (data !== undefined) render(data);
  });
  useTokenSignal(canvas, tokensVersion, () => {
    tokens.current = null;
    render(lastData.current);
  });
  return (
    <figure className="stoa-heatmap" aria-label={label}>
      <canvas ref={canvas} className="stoa-heatmap__canvas" aria-hidden="true" />
      {description && <figcaption className="stoa-visually-hidden">{description}</figcaption>}
    </figure>
  );
}
