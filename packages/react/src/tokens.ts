// Resolved design tokens for canvas drawing: canvases cannot read CSS
// variables, so components read them once per theme change.

export type CanvasTokens = {
  surface: string;
  text: string;
  muted: string;
  border: string;
  bid: string;
  ask: string;
  bidWash: string;
  askWash: string;
  accent: string;
  rowHeight: number;
  font: string;
};

export function readCanvasTokens(el: Element): CanvasTokens {
  const s = getComputedStyle(el);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    surface: v("--stoa-color-surface"),
    text: v("--stoa-color-text"),
    muted: v("--stoa-color-text-muted"),
    border: v("--stoa-color-border"),
    bid: v("--stoa-color-bid"),
    ask: v("--stoa-color-ask"),
    bidWash: v("--stoa-color-up-wash"),
    askWash: v("--stoa-color-down-wash"),
    accent: v("--stoa-color-accent"),
    rowHeight: parseFloat(v("--stoa-density-row-height")) || 22,
    font: `${v("--stoa-density-font-size") || "12px"} ${v("--stoa-font-family-mono") || "monospace"}`,
  };
}

/** Size a canvas for its CSS box and the device pixel ratio; returns the
 * 2D context with the transform set to CSS pixels. */
export function fitCanvas(canvas: HTMLCanvasElement, cssHeight: number): CanvasRenderingContext2D {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.round(canvas.clientWidth * dpr);
  const h = Math.round(cssHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    canvas.style.height = `${cssHeight}px`;
  }
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
