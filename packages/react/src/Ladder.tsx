import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { describeBook, ladderRows, parseBook, type Book } from "./book";
import { fitCanvas, readCanvasTokens, useTokenSignal, type CanvasTokens } from "./tokens";

export type LadderHandle = {
  /** Draw a book in the flat engine form, without a React render. */
  draw(flat: ArrayLike<number> | null): void;
};

export type LadderProps = {
  /** Levels per side. */
  depth?: number;
  /** Book in the flat engine form, when drawn through React. */
  data?: ArrayLike<number> | null;
  label: string;
  formatPrice?: (p: number) => string;
  /** Bumped to force a token re-read and redraw, as an alternative to
   * dispatching `stoa:tokens` on an ancestor (see `useTokenSignal`). */
  tokensVersion?: number;
  ref?: Ref<LadderHandle>;
};

function draw(canvas: HTMLCanvasElement, t: CanvasTokens, book: Book, depth: number, fmt: (p: number) => string) {
  const width = canvas.clientWidth;
  const height = t.rowHeight * depth * 2;
  const ctx = fitCanvas(canvas, height);
  ctx.fillStyle = t.surface;
  ctx.fillRect(0, 0, width, height);
  ctx.font = t.font;
  ctx.textBaseline = "middle";
  const mid = t.rowHeight / 2;
  for (const r of ladderRows(book, depth, t.rowHeight, width * 0.5)) {
    const bid = r.side === "bid";
    ctx.fillStyle = bid ? t.bidWash : t.askWash;
    ctx.fillRect(width - r.barWidth, r.y + 1, r.barWidth, t.rowHeight - 2);
    ctx.fillStyle = bid ? t.bid : t.ask;
    ctx.textAlign = "left";
    // The side is also a letter, not only a colour.
    ctx.fillText(bid ? "B" : "A", 8, r.y + mid);
    ctx.textAlign = "right";
    ctx.fillText(fmt(r.price), width * 0.45, r.y + mid);
    ctx.fillStyle = t.text;
    ctx.fillText(r.size.toLocaleString("en-US"), width - 8, r.y + mid);
  }
  ctx.strokeStyle = t.border;
  ctx.beginPath();
  ctx.moveTo(0, depth * t.rowHeight + 0.5);
  ctx.lineTo(width, depth * t.rowHeight + 0.5);
  ctx.stroke();
}

/** An order-book ladder on a canvas: asks above, bids below, a size bar
 * per level. Screen readers get the top of the book as text, updated at
 * most once a second. */
export function Ladder({ depth = 12, data, label, formatPrice = (p) => p.toFixed(2), tokensVersion, ref }: LadderProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tokens = useRef<CanvasTokens | null>(null);
  const [summary, setSummary] = useState("The book is empty.");
  const lastSummary = useRef(0);
  const latest = useRef<Book>({ bids: [], asks: [] });
  // Holds a reference to the caller's buffer, not a copy: a token-triggered
  // redraw draws whatever `lastFlat.current` points to right now. A caller
  // that reuses one buffer across frames (the zero-allocation pattern the
  // `Live` story uses) must not mutate it in place between an animation
  // frame and a later signal, or the redraw will show newer data than what
  // was last drawn through React.
  const lastFlat = useRef<ArrayLike<number> | null>(null);
  const trailing = useRef<ReturnType<typeof setTimeout> | null>(null);

  const render = (flat: ArrayLike<number> | null) => {
    const c = canvas.current;
    if (!c) return;
    lastFlat.current = flat;
    tokens.current ??= readCanvasTokens(c);
    const book = parseBook(flat);
    draw(c, tokens.current, book, depth, formatPrice);
    // The text alternative follows at most once a second, and always ends
    // on the latest book: a leading-edge-only throttle left "The book is
    // empty." in place when playback paused right after the first draw.
    latest.current = book;
    const publish = () => {
      trailing.current = null;
      lastSummary.current = performance.now();
      setSummary(describeBook(latest.current, formatPrice));
    };
    const wait = 1000 - (performance.now() - lastSummary.current);
    if (wait <= 0) publish();
    else trailing.current ??= setTimeout(publish, wait);
  };
  useEffect(() => () => {
    if (trailing.current) clearTimeout(trailing.current);
  }, []);

  useImperativeHandle(ref, () => ({ draw: render }));

  // Invalidate cached tokens as soon as `tokensVersion` changes, during
  // render rather than in an effect, so the unconditional effect below
  // (which runs on this same render whenever `data` is set) already reads
  // fresh tokens. Without this, a `tokensVersion` bump with `data` also
  // set drew twice: once with the still-cached, stale tokens from that
  // effect, then again from `useTokenSignal`'s own redraw.
  const [lastTokensVersion, setLastTokensVersion] = useState(tokensVersion);
  if (tokensVersion !== lastTokensVersion) {
    setLastTokensVersion(tokensVersion);
    tokens.current = null;
  }

  useEffect(() => {
    if (data !== undefined) render(data);
  });
  useTokenSignal(canvas, data === undefined ? tokensVersion : undefined, () => {
    tokens.current = null;
    render(lastFlat.current);
  });

  return (
    <figure className="stoa-ladder" aria-label={label}>
      <canvas ref={canvas} className="stoa-ladder__canvas" aria-hidden="true" />
      <figcaption className="stoa-visually-hidden" aria-live="polite">
        {summary}
      </figcaption>
    </figure>
  );
}
