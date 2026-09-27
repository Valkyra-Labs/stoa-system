// Resolved design tokens for canvas drawing: canvases cannot read CSS
// variables, so components read them once per theme change.

import { useEffect, useRef, type RefObject } from "react";

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

/** Custom event type dispatched on a preview root to tell every canvas
 * component whose element sits under that root to re-read its tokens and
 * redraw, even while paused. Any ancestor of the component works, since
 * listeners key off `Node.contains`, not the exact target, and listen in
 * the capture phase, so the event arrives whether or not it bubbles and
 * whether or not some other listener stops its propagation. Carries no
 * `detail`: it is a signal to re-read tokens, not a diff of what changed. */
export const TOKENS_EVENT = "stoa:tokens";

/** Dispatches {@link TOKENS_EVENT} on `root`. Call this after changing
 * token CSS variables on `root` (for example when a playground re-themes
 * one preview frame). `bubbles` is not required for `useTokenSignal`
 * listeners, which use the capture phase, but is left on in case a
 * caller also wants a bubble-phase listener of its own. */
export function signalTokensChanged(root: Element): void {
  root.dispatchEvent(new CustomEvent(TOKENS_EVENT, { bubbles: true }));
}

/**
 * Subscribes a canvas component to every source that can change the
 * tokens it reads from `el.current`, and calls `redraw` each time:
 *
 * - a {@link TOKENS_EVENT} dispatched on an ancestor of `el.current`
 *   (the primary mechanism: it needs no plumbing through intermediate
 *   components, and one dispatch on a preview root reaches every canvas
 *   underneath it, however deeply nested);
 * - `tokensVersion` changing (an alternative for a React caller that
 *   already tracks a version number in state and would rather bump a
 *   prop than dispatch a DOM event);
 * - the existing `<html>` `data-theme`/`data-density` attributes, and the
 *   OS colour scheme, so that global theming keeps working unchanged.
 *
 * The event listener is registered in the capture phase, on
 * `el.current`'s own `ownerDocument` rather than the top-level
 * `document`, so a preview rendered inside an iframe still gets the
 * signal, and so does a listener whose event does not bubble or whose
 * propagation an ancestor stops during its own bubble-phase handling
 * (that happens on the way back up, after this listener has already
 * fired on the way down).
 *
 * `redraw` is read through a ref, so subscribing does not depend on its
 * identity being stable across renders, and nothing here dispatches
 * {@link TOKENS_EVENT} itself, so there is no feedback loop.
 */
export function useTokenSignal(el: RefObject<Element | null>, tokensVersion: number | undefined, redraw: () => void): void {
  const redrawRef = useRef(redraw);
  redrawRef.current = redraw;

  useEffect(() => {
    const doc = el.current?.ownerDocument ?? document;
    const onEvent = (e: Event) => {
      const root = e.target;
      if (root instanceof Node && el.current && root.contains(el.current)) redrawRef.current();
    };
    const onChange = () => redrawRef.current();
    doc.addEventListener(TOKENS_EVENT, onEvent, true);
    // jsdom (used in tests) has no matchMedia; skip the OS listener there.
    const mq = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
    mq?.addEventListener("change", onChange);
    const mo = new MutationObserver(onChange);
    mo.observe(doc.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-density"] });
    return () => {
      doc.removeEventListener(TOKENS_EVENT, onEvent, true);
      mq?.removeEventListener("change", onChange);
      mo.disconnect();
    };
  }, [el]);

  useEffect(() => {
    if (tokensVersion !== undefined) redrawRef.current();
  }, [tokensVersion]);
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
