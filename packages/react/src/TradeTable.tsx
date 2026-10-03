import { useStoaFormat } from "./locale";

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
  /** What the table says while it has no trades; the locale's "No trades
   * yet." by default. */
  emptyText?: string;
  formatPrice?: (p: number) => string;
};

/** Recent trades, newest first. Side is a word and a colour; numbers are
 * tabular and right-aligned. Headers, side words and digits follow the
 * locale (see `locale.ts`); `formatPrice` overrides the price format. */
export function TradeTable({ trades, caption, formatPrice, emptyText }: TradeTableProps) {
  const locale = useStoaFormat();
  const words = locale.messages;
  const price = formatPrice ?? ((p: number) => locale.decimal(p, 2));
  return (
    <table className="stoa-table stoa-table--numeric">
      <caption className="stoa-visually-hidden">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{words.time}</th>
          <th scope="col">{words.side}</th>
          <th scope="col" className="stoa-num">{words.price}</th>
          <th scope="col" className="stoa-num">{words.size}</th>
        </tr>
      </thead>
      <tbody>
        {trades.length === 0 && (
          <tr className="stoa-table__empty">
            <td colSpan={4}>{emptyText ?? words.noTrades}</td>
          </tr>
        )}
        {trades.map((t) => (
          <tr key={t.id}>
            <td>{locale.digits(t.time)}</td>
            <td className={t.side === "buy" ? "stoa-up" : "stoa-down"}>{t.side === "buy" ? words.buy : words.sell}</td>
            <td className="stoa-num">{price(t.price)}</td>
            <td className="stoa-num">{locale.integer(t.size)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
