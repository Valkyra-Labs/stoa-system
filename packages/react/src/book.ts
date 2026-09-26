// Book data and its ladder layout, independent of drawing.

export type Level = { price: number; size: number };
export type Book = { bids: Level[]; asks: Level[] };

/** Parse the flat form `[bids, asks, price, size, ...]` (bids best first,
 * then asks best first), as produced by the tyche engine. */
export function parseBook(flat: ArrayLike<number> | null): Book {
  if (!flat || flat.length < 2) return { bids: [], asks: [] };
  const nb = flat[0]!;
  const na = flat[1]!;
  const at = (i: number) => ({ price: flat[2 + i * 2]!, size: flat[3 + i * 2]! });
  return {
    bids: Array.from({ length: nb }, (_, i) => at(i)),
    asks: Array.from({ length: na }, (_, i) => at(nb + i)),
  };
}

export type LadderRow = { y: number; price: number; size: number; side: "bid" | "ask"; barWidth: number };

/** Rows of a ladder `depth` levels per side: asks above the middle line
 * (best ask nearest to it), bids below; bar widths relative to the
 * largest visible size, up to `maxBar` pixels. */
export function ladderRows(book: Book, depth: number, rowHeight: number, maxBar: number): LadderRow[] {
  const visible = [...book.asks.slice(0, depth), ...book.bids.slice(0, depth)];
  const max = Math.max(1, ...visible.map((l) => l.size));
  const rows: LadderRow[] = [];
  book.asks.slice(0, depth).forEach((l, i) =>
    rows.push({ y: (depth - 1 - i) * rowHeight, ...l, side: "ask", barWidth: (l.size / max) * maxBar }),
  );
  book.bids.slice(0, depth).forEach((l, i) =>
    rows.push({ y: (depth + i) * rowHeight, ...l, side: "bid", barWidth: (l.size / max) * maxBar }),
  );
  return rows;
}

/** One sentence describing the top of the book, for screen readers. */
export function describeBook(book: Book, format: (p: number) => string = (p) => p.toFixed(2)): string {
  const b = book.bids[0];
  const a = book.asks[0];
  if (!b && !a) return "The book is empty.";
  const bid = b ? `best bid ${format(b.price)} for ${b.size.toLocaleString("en-US")}` : "no bids";
  const ask = a ? `best ask ${format(a.price)} for ${a.size.toLocaleString("en-US")}` : "no asks";
  const spread = a && b ? `, spread ${format(a.price - b.price)}` : "";
  return `${bid}, ${ask}${spread}.`;
}
