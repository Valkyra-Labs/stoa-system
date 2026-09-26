export type Trade = {
  /** Stable key. */
  id: string;
  time: string;
  /** "buy": the buyer took liquidity (an ask was lifted); "sell": a bid was hit. */
  side: "buy" | "sell";
  price: number;
  size: number;
};

export type TradeTableProps = {
  trades: Trade[];
  caption: string;
  formatPrice?: (p: number) => string;
};

/** Recent trades, newest first. Side is a word and a colour; numbers are
 * tabular and right-aligned. */
export function TradeTable({ trades, caption, formatPrice = (p) => p.toFixed(2) }: TradeTableProps) {
  return (
    <table className="stoa-table stoa-table--numeric">
      <caption className="stoa-visually-hidden">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Time</th>
          <th scope="col">Side</th>
          <th scope="col" className="stoa-num">Price</th>
          <th scope="col" className="stoa-num">Size</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((t) => (
          <tr key={t.id}>
            <td>{t.time}</td>
            <td className={t.side === "buy" ? "stoa-up" : "stoa-down"}>{t.side === "buy" ? "Buy" : "Sell"}</td>
            <td className="stoa-num">{formatPrice(t.price)}</td>
            <td className="stoa-num">{t.size.toLocaleString("en-US")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
