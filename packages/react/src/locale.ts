// Stoa's own words and number formats, by locale. The locale is React
// Aria's (`I18nProvider` above, `useLocale` here), so one provider sets the
// language of Stoa's text, the digits of its numbers and React Aria's own
// behaviour together.
//
// Digits follow the locale's numbering system, which a locale tag can
// state: "ar" alone formats with Latin digits in current ICU data, and
// "ar-u-nu-arab" with Arabic-Indic ones.
import { useMemo } from "react";
import { useLocale } from "react-aria-components";

export type StoaMessages = {
  time: string;
  side: string;
  price: string;
  size: string;
  buy: string;
  sell: string;
  /** The side of a ladder row as a word or a letter, so it is never told
   * by colour alone. */
  bidMark: string;
  askMark: string;
  bookEmpty: string;
  /** A trades table with no trades yet. */
  noTrades: string;
  /** A heatmap with nothing to draw. */
  noLiquidity: string;
  bestBid: (price: string, size: string) => string;
  bestAsk: (price: string, size: string) => string;
  noBids: string;
  noAsks: string;
  spread: (value: string) => string;
  /** One sentence from the bid part, the ask part and the spread, if any. */
  book: (bid: string, ask: string, spread: string | null) => string;
  // Overlays, lists and content.
  /** The close button of a dialog or a sheet. */
  close: string;
  /** The safe action of a confirmation. */
  cancel: string;
  /** Names of an item's own buttons in a reorderable list. */
  moveUp: (item: string) => string;
  moveDown: (item: string) => string;
  remove: (item: string) => string;
  /** Announced after an item moved; position and total in the locale's
   * digits. */
  moved: (item: string, position: string, total: string) => string;
  removed: (item: string) => string;
  /** A reorderable list with no items. */
  listEmpty: string;
  /** The word for each step status, shown beside its symbol (StepList's
   * `StepStatus` is this record's keys). */
  stepStatus: Record<"waiting" | "running" | "done" | "awaiting" | "skipped" | "undone" | "error", string>;
};

const EN: StoaMessages = {
  time: "Time",
  side: "Side",
  price: "Price",
  size: "Size",
  buy: "Buy",
  sell: "Sell",
  bidMark: "B",
  askMark: "A",
  bookEmpty: "The book is empty.",
  noTrades: "No trades yet.",
  noLiquidity: "No liquidity to show.",
  bestBid: (price, size) => `best bid ${price} for ${size}`,
  bestAsk: (price, size) => `best ask ${price} for ${size}`,
  noBids: "no bids",
  noAsks: "no asks",
  spread: (value) => `spread ${value}`,
  book: (bid, ask, spread) => `${bid}, ${ask}${spread ? `, ${spread}` : ""}.`,
  close: "Close",
  cancel: "Cancel",
  moveUp: (item) => `Move up: ${item}`,
  moveDown: (item) => `Move down: ${item}`,
  remove: (item) => `Remove: ${item}`,
  moved: (item, position, total) => `${item} moved to position ${position} of ${total}.`,
  removed: (item) => `${item} removed.`,
  listEmpty: "No items.",
  stepStatus: {
    waiting: "Waiting",
    running: "Running",
    done: "Done",
    awaiting: "Awaiting decision",
    skipped: "Skipped",
    undone: "Undone",
    error: "Error",
  },
};

const AR: StoaMessages = {
  time: "الوقت",
  side: "الاتجاه",
  price: "السعر",
  size: "الحجم",
  buy: "شراء",
  sell: "بيع",
  bidMark: "شراء",
  askMark: "بيع",
  bookEmpty: "دفتر الأوامر فارغ.",
  noTrades: "لا صفقات بعد.",
  noLiquidity: "لا سيولة لعرضها.",
  bestBid: (price, size) => `أفضل سعر شراء ${price} بكمية ${size}`,
  bestAsk: (price, size) => `أفضل سعر بيع ${price} بكمية ${size}`,
  noBids: "لا أوامر شراء",
  noAsks: "لا أوامر بيع",
  spread: (value) => `الفارق ${value}`,
  book: (bid, ask, spread) => `${bid}، ${ask}${spread ? `، ${spread}` : ""}.`,
  close: "إغلاق",
  cancel: "إلغاء",
  moveUp: (item) => `تحريك للأعلى: ${item}`,
  moveDown: (item) => `تحريك للأسفل: ${item}`,
  remove: (item) => `إزالة: ${item}`,
  moved: (item, position, total) => `نُقل ${item} إلى الموضع ${position} من ${total}.`,
  removed: (item) => `أزيل ${item}.`,
  listEmpty: "لا عناصر.",
  stepStatus: {
    waiting: "في الانتظار",
    running: "قيد التنفيذ",
    done: "تم",
    awaiting: "بانتظار قرار",
    skipped: "تم التخطي",
    undone: "تم التراجع",
    error: "خطأ",
  },
};

/** Stoa's words for a locale: Arabic for any "ar" tag, English otherwise. */
export function messagesFor(locale: string): StoaMessages {
  return locale.split("-")[0]?.toLowerCase() === "ar" ? AR : EN;
}

export type StoaFormat = {
  locale: string;
  messages: StoaMessages;
  /** A number with a fixed count of decimals, in the locale's digits. */
  decimal(value: number, fractionDigits: number): string;
  /** A whole number with the locale's grouping and digits. */
  integer(value: number): string;
  /** A preformatted string (a time of day, for example) with its Latin
   * digits and decimal point rewritten in the locale's. */
  digits(text: string): string;
};

const formats = new Map<string, StoaFormat>();

/** The formats for a locale, built once per locale. */
export function stoaFormat(locale: string): StoaFormat {
  const cached = formats.get(locale);
  if (cached) return cached;
  const decimals = new Map<number, Intl.NumberFormat>();
  const decimalFormat = (fractionDigits: number) => {
    let format = decimals.get(fractionDigits);
    if (!format) {
      format = new Intl.NumberFormat(locale, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
      decimals.set(fractionDigits, format);
    }
    return format;
  };
  const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const plain = new Intl.NumberFormat(locale, { useGrouping: false });
  const digitMap = new Map<string, string>(Array.from({ length: 10 }, (_, d) => [String(d), plain.format(d)]));
  const point = decimalFormat(1).formatToParts(1.5).find((part) => part.type === "decimal")?.value ?? ".";
  digitMap.set(".", point);
  const format: StoaFormat = {
    locale,
    messages: messagesFor(locale),
    decimal: (value, fractionDigits) => decimalFormat(fractionDigits).format(value),
    integer: (value) => integer.format(value),
    digits: (text) => text.replace(/[0-9.]/g, (character) => digitMap.get(character) ?? character),
  };
  formats.set(locale, format);
  return format;
}

/** The formats for the locale React Aria is set to. */
export function useStoaFormat(): StoaFormat {
  const { locale } = useLocale();
  return useMemo(() => stoaFormat(locale), [locale]);
}
