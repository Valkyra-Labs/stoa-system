import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { cellAlpha, maxAbs } from "./heatmapScale";
import { useStoaFormat, type StoaFormat } from "./locale";
import { drawEmpty, fitCanvas, readCanvasTokens, useInvalidateOnTokensVersion, useTokenSignal, type CanvasTokens } from "./tokens";

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
  /** What the chart says while it has nothing to draw; the locale's "No
   * liquidity to show." by default. Drawn on the canvas and given to
   * assistive technology as text. */
  emptyText?: string;
};

const isEmpty = (d: HeatmapData | null | undefined): boolean => !d || d.columns === 0 || d.rows === 0;

function draw(
  canvas: HTMLCanvasElement,
  t: CanvasTokens,
  d: HeatmapData | null,
  height: number,
  locale: StoaFormat,
  emptyText: string,
) {
  const width = canvas.clientWidth;
  const ctx = fitCanvas(canvas, height);
  ctx.fillStyle = t.surface;
  ctx.fillRect(0, 0, width, height);
  if (!d || isEmpty(d)) {
    drawEmpty(ctx, t, emptyText, width, height);
    return;
  }
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
  plate(ctx, t, locale.decimal(d.top, 2), width, 0);
  plate(ctx, t, locale.decimal(d.top - d.tick * (d.rows - 1), 2), width, height, true);
}

/** Inset of a price label from the chart's corner, and its padding. */
const PLATE_INSET = 2;
const PLATE_PAD = 4;

/** A price label in the chart's top or bottom end corner, on a plate of
 * the surface colour. The cells behind a label can be any bid or ask fill
 * at any opacity, so the label never sits on them directly: on the plate
 * it is text-muted on surface, a pair the contrast tests measure. */
function plate(ctx: CanvasRenderingContext2D, t: CanvasTokens, text: string, width: number, y: number, bottom = false) {
  const metrics = ctx.measureText(text);
  const ascent = metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent;
  const w = Math.ceil(metrics.width) + PLATE_PAD * 2;
  const h = Math.ceil(ascent + descent) + PLATE_PAD;
  const x = width - PLATE_INSET - w;
  const top = bottom ? y - PLATE_INSET - h : y + PLATE_INSET;
  ctx.fillStyle = t.surface;
  ctx.fillRect(x, top, w, h);
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, top + 0.5, w - 1, h - 1);
  ctx.fillStyle = t.muted;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, x + w - PLATE_PAD, top + PLATE_PAD / 2 + ascent);
}

/** Displayed liquidity over time on a canvas: time left to right, price
 * top to bottom, bids in the bid colour and asks in the ask colour,
 * opacity by size on a log scale. */
export function Heatmap({ height = 240, label, description, data, tokensVersion, ref, emptyText }: HeatmapProps) {
  const locale = useStoaFormat();
  const empty = emptyText ?? locale.messages.noLiquidity;
  const canvas = useRef<HTMLCanvasElement>(null);
  const tokens = useRef<CanvasTokens | null>(null);
  const lastData = useRef<HeatmapData | null>(null);
  const render = (d: HeatmapData | null) => {
    const c = canvas.current;
    if (!c) return;
    lastData.current = d;
    tokens.current ??= readCanvasTokens(c);
    draw(c, tokens.current, d, height, locale, empty);
  };
  useImperativeHandle(ref, () => ({ draw: render }));
  // Drop the cached tokens when `tokensVersion` changes, from an effect
  // that runs before the one below (which draws on every render whenever
  // `data` is set), so that draw reads fresh tokens. Without this, a
  // `tokensVersion` bump with `data` also set drew twice: once with the
  // still-cached, stale tokens from that effect, then again from
  // `useTokenSignal`'s own redraw.
  useInvalidateOnTokensVersion(tokensVersion, () => {
    tokens.current = null;
  });
  useEffect(() => {
    if (data !== undefined) render(data);
  });
  // The data effect above already redrew with fresh tokens when `data` is
  // set, so the hook only owns the version path when it is not.
  useTokenSignal(canvas, data === undefined ? tokensVersion : undefined, () => {
    tokens.current = null;
    render(lastData.current);
  });
  return (
    <figure className="stoa-heatmap" aria-label={label}>
      <canvas ref={canvas} className="stoa-heatmap__canvas" aria-hidden="true" />
      {/* While there is nothing to draw, the text alternative says so;
          data passed through the imperative handle is the caller's to
          describe. */}
      {(description || (data !== undefined && isEmpty(data))) && (
        <figcaption className="stoa-visually-hidden">
          {data !== undefined && isEmpty(data) ? empty : description}
        </figcaption>
      )}
    </figure>
  );
}
