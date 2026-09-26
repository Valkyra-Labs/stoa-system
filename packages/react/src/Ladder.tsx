import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { describeBook, ladderRows, parseBook, type Book } from "./book";
import { fitCanvas, readCanvasTokens, type CanvasTokens } from "./tokens";

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
export function Ladder({ depth = 12, data, label, formatPrice = (p) => p.toFixed(2), ref }: LadderProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tokens = useRef<CanvasTokens | null>(null);
  const [summary, setSummary] = useState("The book is empty.");
  const lastSummary = useRef(0);
  const latest = useRef<Book>({ bids: [], asks: [] });
  const trailing = useRef<ReturnType<typeof setTimeout> | null>(null);

  const render = (flat: ArrayLike<number> | null) => {
    const c = canvas.current;
    if (!c) return;
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
  useEffect(() => {
    if (data !== undefined) render(data);
  });
  useEffect(() => {
    // Re-read tokens when the theme or density changes.
    const reset = () => (tokens.current = null);
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", reset);
    const mo = new MutationObserver(reset);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-density"] });
    return () => {
      mq.removeEventListener("change", reset);
      mo.disconnect();
    };
  }, []);

  return (
    <figure className="stoa-ladder" aria-label={label}>
      <canvas ref={canvas} className="stoa-ladder__canvas" aria-hidden="true" />
      <figcaption className="stoa-visually-hidden" aria-live="polite">
        {summary}
      </figcaption>
    </figure>
  );
}
